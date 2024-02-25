# PaymentPHP

Esse projeto consiste em uma API REST de pagamentos usando cartão de crédito.

## Requisitos

Para rodar esse projeto você precisa ter instalado na sua maquina:

[`Docker`](https://docs.docker.com/engine/install/)<br><br>
`Make` (Windows: `choco install make` ou Linux: `sudo apt-get install make`)

## Como rodar?
Obs: se você não tem o `make` instalado é só abrir o arquivo `Makefile` e rodar os comandos manualmente.<br>
<br>
<strong>Rodar nessa ordem para subir a aplicação:</strong><br>
<br>

`make run` Roda toda a aplicação: banco de dados, aplicação laravel e o nginx.
<br><br>

`make setup` Roda o comando que gera a chave da aplicação Laravel e roda as migrações no banco de dados.
<br><br>

<strong>Opcional:</strong>
<br><br>
`make down` Derruba toda a aplicação.

## Como testar?

`make test` Roda os testes unitários e de integração da aplicação (necessário ter rodado `make run` e `make setup`).

## Contrato da API

### Criar pagamento

Endpoint: POST http://127.0.0.1/rest/payments

Request:

Headers:
```json
{
    "Accept": "application/json"
}
```

Body:
```json
{
    "transaction_amount": 245.90,
    "installments": 3,
    "token": "ae4e50b2a8f3h6d9f2c3a4b5d6e7f8g9",
    "payment_method_id": "master",
    "payer": {
        "email": "example_random@gmail.com",
        "identification": {
            "type": "CPF",
            "number": "12345678909"
        }
    },
}

```

Response:

- Status 201
```json
{
    "id":"84e8adbf-1a14-403b-ad73-d78ae19b59bf",
    "created_at":"2024-01-01"
}
```

- Status 400
```json
{
    "status": "payment not provided in the request body"
}
```

- Status 422
```json
{
    "status": "Invalid payment provided.The possible reasons are:\n ○ A field of the provided payment was null or with invalid values"
}
```

- Status 500

### Listar pagamentos

Endpoint: GET http://127.0.0.1/rest/payments/

Request:

Headers:
```json
{
    "Accept": "application/json"
}
```

Response:

- Status 200
```json
[
    {
        "id":"84e8adbf-1a14-403b-ad73-d78ae19b59bf",
        "status": "CANCELED",
        "transaction_amount": 245.90,
        "installments": 3,
        "token": "ae4e50b2a8f3h6d9f2c3a4b5d6e7f8g9",
        "payment_method_id": "master",
        "payer": {
            "entity_type": "individual",
            "type": "customer",
            "email": "example_random@gmail.com",
            "identification": {
                "type": "CPF",
                "number": "12345678909"
            }
        },
        "notification_url": "https://webhook.site/unique-r",
        "created_at": "2024-01-10",
        "updated_at": "2024-01-11"
    },
    {
        "id": "9998adbf-1a14-403b-ad73-d78ae19b59bf",
        "status": "PAID",
        "transaction_amount": 300.90,
        "installments": 5,
        "token": "ae4e50b2a8f3h6d965c3a4b5d6e7f8g9",
        "payment_method_id": "visa",
        "payer": {
            "entity_type": "individual",
            "type": "customer",
            "email": "example_random2@gmail.com",
            "identification": {
                "type": "CPF",
                "number": "44345678988"
            }
        },
        "notification_url": "https://webhook.site/1a2b3c4d",
        "created_at": "2024-01-10",
        "updated_at": "2024-01-11"
    }
]
```

- Status 404
```json
{}
```

### Ver detalhes de um pagamento

Endpoint: GET http://127.0.0.1/rest/payments/{id}

Request:

Headers:
```json
{
    "Accept": "application/json"
}
```

Response:

- Status 200
```json
{
    "id":"84e8adbf-1a14-403b-ad73-d78ae19b59bf",
    "status": "PAID",
    "transaction_amount": 245.90,
    "installments": 3,
    "token": "ae4e50b2a8f3h6d9f2c3a4b5d6e7f8g9",
    "payment_method_id": "master",
    "payer": {
        "entity_type": "individual",
        "type": "customer",
        "email": "example_random@gmail.com",
        "identification": {
            "type": "CPF",
            "number": "12345678909"
        }
    },
    "notification_url": "https://webhook.site/unique-r",
    "created_at": "2024-01-10",
    "updated_at": "2024-01-11"
}
```

- Status 404
```json
{}
```

### Confirmar um pagamento

Endpoint: PATCH http://127.0.0.1/rest/payments/{id}/

Request:

Headers:
```json
{
    "Accept": "application/json"
}
```

Response:

- Status 204

- Status 404
```json
{
    "status": "Bankslip not found with the specified id"
}
```

### Cancelar um pagamento

Endpoint: DELETE http://127.0.0.1/rest/payments/{id}

Request:

Headers:
```json
{
    "Accept": "application/json"
}
```

Response:

- Status 204

- Status 404
```json
{
    "status": "Payment not found with the specified id"
}
```

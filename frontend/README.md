# PaymentNextJS

Esse projeto é a parte frontend para a tela de pagamento usando cartão de crédito.<br>
Já está configurado para se comunicar com o backend se você estiver com o projeto do PHP rodando.

## Requisitos

Para rodar esse projeto você precisa ter instalado na sua maquina:

[`Docker`](https://docs.docker.com/engine/install/)<br><br>
`Make` (Windows: `choco install make` ou Linux: `sudo apt-get install make`)

## Como rodar?

Obs: se você não tem o `make` instalado é só abrir o arquivo `Makefile` e rodar os comandos manualmente.<br><br>

`make run` Roda a aplicação.
<br><br>

`make down` Derruba a aplicação.

## Como testar?

`make test` Roda os testes unitários (antes tem que ter rodado: `make run`)


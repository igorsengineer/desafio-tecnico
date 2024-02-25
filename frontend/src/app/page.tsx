"use client";

import React, { useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { initMercadoPago } from "@mercadopago/sdk-react";
import { getInstallments, createCardToken } from "@mercadopago/sdk-react/coreMethods";
import {PayerCost} from "@mercadopago/sdk-react/coreMethods/util/types";
import CustomButton from "@/components/CustomButton"
import SuccessModal from "@/components/SuccessModal"
import ErrorModal from "@/components/ErrorModal"
import WarningField from "@/components/WarningField";
import Tooltip from "@/components/Tooltip";

interface FormData {
    userEmail?: string
    userDocumentType?: string
    userDocumentValue?: string
    paymentValue?: string
    paymentMethodId?: string
    paymentCardNumber?: string
    paymentCardOwner?: string
    paymentCardCvv?: string
    paymentCardExpirationMonth?: string
    paymentCardExpirationYear?: string
    paymentCardInstallments?: string
}

export default function Home(): React.JSX.Element {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_KEY);

    const [form, setForm] = useState<FormData>({
        userDocumentType: 'CPF',
    });
    const [installments, setInstallments] = useState<PayerCost[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [warningAllFields, setWarningAllFields] = useState(false);

    useEffect(() => {
        if (form.paymentValue && form.paymentCardNumber && form.paymentCardNumber.length == 16) {
            getInstallments({
                bin: form.paymentCardNumber.slice(0, 6),
                amount: form.paymentValue,
                locale: 'pt-BR'
            }).then(installments => {
                if (installments) {
                    setForm({
                        ...form,
                        paymentMethodId: installments[0].payment_method_id,
                        paymentCardInstallments: '1'
                    })
                    setInstallments(installments[0].payer_costs);
                }
            })
        } else {
            if (installments.length > 0) {
                setInstallments([]);
            }
        }
    }, [form.paymentValue, form.paymentCardNumber]);

    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>): void => {
        setWarningAllFields(false);
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    // @ts-ignore
    const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        if (form.userEmail &&
            form.userDocumentType &&
            form.userDocumentValue &&
            form.paymentMethodId &&
            form.paymentValue &&
            form.paymentCardNumber &&
            form.paymentCardOwner &&
            form.paymentCardExpirationMonth &&
            form.paymentCardExpirationYear &&
            form.paymentCardCvv) {

            createCardToken({
                cardNumber: form.paymentCardNumber,
                cardExpirationMonth: form.paymentCardExpirationMonth,
                cardExpirationYear: form.paymentCardExpirationYear,
                securityCode: form.paymentCardCvv,
                cardholderName: form.paymentCardOwner,
                identificationType: form.userDocumentType,
                identificationNumber: form.userDocumentValue,
            }).then(result => {
                const requestData = {
                    // @ts-ignore
                    "transaction_amount": parseFloat(form.paymentValue).toFixed(2),
                    // @ts-ignore
                    "installments": parseInt(form.paymentCardInstallments),
                    "token": result?.id,
                    "payment_method_id": form.paymentMethodId,
                    "payer": {
                        "email": form.userEmail,
                        "identification": {
                            "type": form.userDocumentType,
                            "number": form.userDocumentValue,
                        }
                    },
                }

                fetch(process.env.NEXT_PUBLIC_PAYMENT_API_URL+'/rest/payments', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                }).then(() => {
                    setSuccessMessage('Pagamento realizado, confira conta bancária.');
                }).catch(() => {
                    setErrorMessage('Não foi possível completar a transação.');
                });
            }).catch(() => {
                setErrorMessage('Dados de cartão inválidos, altere os dados ou tente novamentes mais tarde.');
            });
        } else {
            setWarningAllFields(true);
        }
    }

    return (
      <div className="flex min-h-screen bg-white flex-col items-center justify-between p-24">
          <div className="bg-white py-8 px-4 w-100">
              <ErrorModal
                  modalTitle="Erro ao fazer pagamento."
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}/>

              <SuccessModal
                    modalTitle="Transação realizada com sucesso."
                    successMessage={successMessage} />

              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-1/2 md:mr-4 mb-4 md:mb-0">
                      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                          <h2 className="text-lg text-gray-700 font-bold mb-4">Dados do Pagador</h2>
                          <div className="mb-4">
                              <input
                                  name='userEmail'
                                  onChange={handleFormDataChange}
                                  value={form.userEmail}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  type="email"
                                  placeholder="Email do Pagador"/>
                          </div>
                          <div className="mb-4">
                              <select
                                  name='userDocumentType'
                                  onChange={handleFormDataChange}
                                  value={form.userDocumentType}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                  <option value="cpf">CPF</option>
                                  <option value="cnpj">CNPJ</option>
                              </select>
                          </div>

                          <div className="mb-6">
                              <input
                                  name='userDocumentValue'
                                  onChange={handleFormDataChange}
                                  value={form.userDocumentValue}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  type="text"
                                  placeholder="Número de identificação"/>
                          </div>
                      </div>
                  </div>
                  <div className="w-full md:w-1/2 md:ml-4">
                      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                          <h2 className="text-lg text-gray-700 font-bold mb-4">Dados do Pagamento</h2>
                          <div className="mb-4">
                              <input
                                  name='paymentValue'
                                  onChange={handleFormDataChange}
                                  value={form.paymentValue}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  type="number"
                                  placeholder="Valor do pagamento" />
                          </div>
                          <div className="mb-4">
                              <input
                                  name='paymentCardNumber'
                                  value={form.paymentCardNumber}
                                  onChange={handleFormDataChange}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  type="number"
                                  placeholder="Número do cartão"/>
                          </div>
                          <div className="mb-4">
                              <input
                                  name='paymentCardOwner'
                                  onChange={handleFormDataChange}
                                  value={form.paymentCardOwner}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  type="text"
                                  placeholder="Nome do titular"/>
                          </div>
                          <div className="flex flex-col md:flex-row md:space-x-2">
                              <div className="w-full md:w-1/3 mb-4">
                                  <InputMask
                                      name='paymentCardCvv'
                                      onChange={handleFormDataChange}
                                      value={form.paymentCardCvv}
                                      mask="999"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="CVV" />
                              </div>
                              <div className="w-full md:w-1/3 mb-4">
                                  <InputMask
                                      mask="99"
                                      name='paymentCardExpirationMonth'
                                      onChange={handleFormDataChange}
                                      value={form.paymentCardExpirationMonth}
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="Mês de expiração (MM)" />
                              </div>
                              <div className="w-full md:w-1/3 mb-4">
                                  <InputMask
                                      mask="9999"
                                      name='paymentCardExpirationYear'
                                      onChange={handleFormDataChange}
                                      value={form.paymentCardExpirationYear}
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="Ano de expiração (YYYY)" />
                              </div>
                          </div>
                          <div className="mb-2">
                              <select
                                  name='paymentCardInstallments'
                                  onChange={handleFormDataChange}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                  {installments.length > 0 ? (
                                      installments.map(({installments, recommended_message}) => (
                                          <option key={installments} value={installments}>
                                              {recommended_message}
                                          </option>
                                      ))
                                  ) : (<option disabled={true} selected>Sem parcelamentos disponíveis</option>)}
                              </select>
                              <Tooltip hint='Insira dados de cartão válidos para ver opções de parcelamento.'/>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="flex justify-center mb-2">
                  <CustomButton onClick={handleSubmitClick}/>
              </div>
              <div className="flex justify-center">
                  {warningAllFields && (<WarningField warning="Preencha todos os campos antes de realizar um pagamento." />)}
              </div>
          </div>
      </div>
    );
}

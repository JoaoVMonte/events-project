import * as Yup from 'yup'

export const funcionarioValidator = Yup.object().shape({
    nome: Yup.string()
        .min(3, 'Nome muito curto')
        .required('Campo obrigatório'),
    cpf: Yup.string()
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
        .required('Campo obrigatório'),
    telefone: Yup.string()
        .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido')
        .required('Campo obrigatório'),
    cargo: Yup.string()
        .oneOf(['Funileiro', 'Caixa'], 'Selecione um cargo válido')
        .required('Campo obrigatório'),
    endereco: Yup.string()
        .min(5, 'Endereço muito curto')
        .required('Campo obrigatório')
}) 
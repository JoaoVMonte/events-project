import * as Yup from 'yup'

export const clienteValidator = Yup.object().shape({
    // Validação do nome: mínimo 3 caracteres e obrigatório
    nome: Yup.string()
        .min(3, 'Nome muito curto')
        .required('Campo obrigatório'),
    
    // Validação do CPF: formato XXX.XXX.XXX-XX e obrigatório
    cpf: Yup.string()
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
        .required('Campo obrigatório'),
    
    // Validação do email: formato válido de email e obrigatório
    email: Yup.string()
        .email('Email inválido')
        .required('Campo obrigatório'),
    
    // Validação do telefone: formato (XX) XXXXX-XXXX e obrigatório
    telefone: Yup.string()
        .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido')
        .required('Campo obrigatório'),
    
    // Validação do CEP: formato XXXXX-XXX e obrigatório
    cep: Yup.string()
        .matches(/^\d{5}-\d{3}$/, 'CEP inválido')
        .required('Campo obrigatório'),
    
    // Validação do endereço: mínimo 5 caracteres e obrigatório
    endereco: Yup.string()
        .min(5, 'Endereço muito curto')
        .required('Campo obrigatório'),
})

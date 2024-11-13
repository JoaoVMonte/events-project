import * as Yup from 'yup'

export const veiculoValidator = Yup.object().shape({
  marca: Yup.string()
    .required('Marca é obrigatória'),
  modelo: Yup.string()
    .required('Modelo é obrigatório'),
  placa: Yup.string()
    .max(7, 'A placa deve ter no máximo 7 caracteres')
    .required('Placa é obrigatória'),
  ano: Yup.number()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano inválido')
    .required('Ano é obrigatório'),
  cor: Yup.string()
    .required('Cor é obrigatória'),
  quilometragem: Yup.number()
    .min(0, 'Quilometragem inválida')
    .required('Quilometragem é obrigatória')
}) 
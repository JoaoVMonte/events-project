import * as Yup from 'yup'

export const servicoValidator = Yup.object().shape({
  descricao: Yup.string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .required('Descrição é obrigatória'),
  valor: Yup.string()
    .required('Valor é obrigatório'),
  categoria: Yup.string()
    .required('Categoria é obrigatória'),
  observacoes: Yup.string()
}) 
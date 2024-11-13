import * as Yup from 'yup'

export const orcamentoValidator = Yup.object().shape({
  cliente: Yup.string()
    .required('Cliente é obrigatório'),
  veiculo: Yup.string()
    .required('Veículo é obrigatório'),
  funcionario: Yup.string()
    .required('Funcionário é obrigatório'),
  servicos: Yup.array()
    .of(
      Yup.object().shape({
        descricao: Yup.string()
          .required('Descrição é obrigatória'),
        valor: Yup.string()
          .required('Valor é obrigatório')
      })
    )
    .min(1, 'Adicione pelo menos um serviço'),
  status: Yup.string()
    .required('Status é obrigatório'),
  valorTotal: Yup.number()
    .min(0, 'Valor total inválido')
    .required('Valor total é obrigatório')
}) 
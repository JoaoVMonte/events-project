'use client'

import { useEffect, useState } from "react"
import Pagina from "@/app/components/Pagina"
import { Formik } from "formik"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { BsCheckLg } from "react-icons/bs"
import { IoMdArrowBack } from "react-icons/io"
import { v4 } from "uuid"
import { FaPlusCircle } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { orcamentoValidator } from "@/validators/orcamentoValidator"

export default function FormOrcamento({ params }) {
  const route = useRouter()
  const [clientes, setClientes] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [servicosCadastrados, setServicosCadastrados] = useState([])
  const [orcamento, setOrcamento] = useState({
    cliente: '',
    veiculo: '',
    funcionario: '',
    servicos: [],
    valorTotal: 0,
    status: 'pendente',
    data: new Date().toISOString()
  })

  useEffect(() => {
    setClientes(JSON.parse(localStorage.getItem('clientes')) || [])
    setFuncionarios(JSON.parse(localStorage.getItem('funcionarios')) || [])
    setVeiculos(JSON.parse(localStorage.getItem('veiculos')) || [])
    setServicosCadastrados(JSON.parse(localStorage.getItem('servicos')) || [])

    if (params.id) {
      const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || []
      const dadosOrcamento = orcamentos.find(item => item.id == params.id)
      if (dadosOrcamento) {
        setOrcamento(dadosOrcamento)
      }
    }
  }, [params.id])

  function salvar(dados) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || []
    if (params.id) {
      const index = orcamentos.findIndex(orcamento => orcamento.id == params.id)
      if (index !== -1) {
        Object.assign(orcamentos[index], dados)
      }
    } else {
      dados.id = v4()
      orcamentos.push(dados)
    }
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos))
    route.push('/orcamentos')
  }

  return (
    <Pagina titulo={params.id ? "Editar Orçamento" : "Novo Orçamento"}>
      <Card className="shadow-lg">
        <Card.Body>
          <Formik
            initialValues={orcamento}
            onSubmit={values => salvar(values)}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue
            }) => (
              <Form>
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group controlId="cliente">
                      <Form.Label>Cliente:</Form.Label>
                      <Form.Select
                        name="cliente"
                        value={values.cliente}
                        onChange={handleChange}
                        isInvalid={errors.cliente && touched.cliente}
                      >
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nome} - CPF: {cliente.cpf}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.cliente}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="veiculo">
                      <Form.Label>Veículo:</Form.Label>
                      <Form.Select
                        name="veiculo"
                        value={values.veiculo}
                        onChange={handleChange} 
                        isInvalid={errors.veiculo && touched.veiculo}
                      >
                        <option value="">Selecione um veículo</option>
                        {veiculos.map(veiculo => (
                          <option key={veiculo.id} value={veiculo.id}>
                            {veiculo.modelo} - Placa: {veiculo.placa}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.veiculo}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group controlId="funcionario">
                      <Form.Label>Funcionário Responsável:</Form.Label>
                      <Form.Select
                        name="funcionario"
                        value={values.funcionario}
                        onChange={handleChange}
                        isInvalid={errors.funcionario && touched.funcionario}
                      >
                        <option value="">Selecione um funcionário</option>
                        {funcionarios.map(funcionario => (
                          <option key={funcionario.id} value={funcionario.id}>
                            {funcionario.nome} - {funcionario.cargo}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.funcionario}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label>Status:</Form.Label>
                      <Form.Select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        isInvalid={errors.status && touched.status}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="finalizado">Finalizado</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Card className="border">
                      <Card.Header className="bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Serviços</h5>
                          <div className="d-flex gap-2">
                            <Form.Select
                              size="sm"
                              style={{ width: '300px' }}
                              onChange={(e) => { // Adiciona um serviço ao orcamento ao selecionar um serviço cadastrado na lista 
                                const servicoSelecionado = servicosCadastrados.find(s => s.id === e.target.value)
                                if (servicoSelecionado) {
                                  const novoServico = {
                                    id: v4(),
                                    descricao: servicoSelecionado.descricao,
                                    categoria: servicoSelecionado.categoria,
                                    valor: servicoSelecionado.valor
                                  }
                                  // Adiciona o serviço ao orcamento 
                                  const novosServicos = [...values.servicos, novoServico]
                                  setFieldValue('servicos', novosServicos)
                                  
                                  // Atualiza o valor total
                                  const total = novosServicos.reduce((acc, curr) => {
                                    return acc + (Number(curr.valor) || 0)
                                  }, 0)
                                  setFieldValue('valorTotal', total)
                                  
                                  // Limpa a seleção
                                  e.target.value = ''
                                }
                              }}
                            >
                              <option value="">Selecionar serviço cadastrado</option>
                              {servicosCadastrados.map(servico => (
                                <option key={servico.id} value={servico.id}>
                                  {servico.descricao} - R$ {Number(servico.valor).toFixed(2)}
                                </option>
                              ))}
                            </Form.Select>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => {
                                const novosServicos = [...values.servicos, {
                                  id: v4(),
                                  descricao: '',
                                  categoria: '',
                                  valor: ''
                                }]
                                setFieldValue('servicos', novosServicos)
                              }}
                            >
                              <FaPlusCircle className="me-2" />
                              Novo Serviço
                            </Button>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        {values.servicos.map((servico, index) => (
                          <Row key={servico.id} className="mb-3 align-items-end">
                            <Col md={5}>
                              <Form.Group controlId={`servicos.${index}.descricao`}>
                                <Form.Label>Descrição do Serviço:</Form.Label>
                                <Form.Control
                                  type="text"
                                  name={`servicos.${index}.descricao`}
                                  value={servico.descricao}
                                  onChange={handleChange}
                                  isInvalid={
                                    errors.servicos?.[index]?.descricao && 
                                    touched.servicos?.[index]?.descricao
                                  }
                                  placeholder="Descreva o serviço"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.servicos?.[index]?.descricao}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group controlId={`servicos.${index}.categoria`}>
                                <Form.Label>Categoria:</Form.Label>
                                <Form.Select
                                  name={`servicos.${index}.categoria`}
                                  value={servico.categoria}
                                  onChange={handleChange}
                                  isInvalid={
                                    errors.servicos?.[index]?.categoria && 
                                    touched.servicos?.[index]?.categoria
                                  }
                                >
                                  <option value="">Selecione</option>
                                  <option value="Funilaria">Funilaria</option>
                                  <option value="Pintura">Pintura</option>
                                  <option value="Polimento">Polimento</option>
                                  <option value="Restauração">Restauração</option>
                                  <option value="Outros">Outros</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {errors.servicos?.[index]?.categoria}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group controlId={`servicos.${index}.valor`}>
                                <Form.Label>Valor:</Form.Label>
                                <Form.Control
                                  type="text"
                                  name={`servicos.${index}.valor`}
                                  value={servico.valor}
                                  onChange={(e) => {
                                    const valor = e.target.value.replace(/\D/g, '')
                                    const valorFormatado = (Number(valor) / 100).toFixed(2)
                                    setFieldValue(`servicos.${index}.valor`, valorFormatado)
                                    
                                    // Recalcula o valor total
                                    const total = values.servicos.reduce((acc, curr, idx) => {
                                      const val = idx === index ? valorFormatado : curr.valor
                                      return acc + (Number(val) || 0)
                                    }, 0)
                                    setFieldValue('valorTotal', total)
                                  }}
                                  isInvalid={
                                    errors.servicos?.[index]?.valor && 
                                    touched.servicos?.[index]?.valor
                                  }
                                  placeholder="R$ 0,00"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.servicos?.[index]?.valor}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={1}>
                              <Button 
                                variant="outline-danger"
                                size="sm"
                                onClick={() => {
                                  const novosServicos = values.servicos.filter((_, idx) => idx !== index)
                                  setFieldValue('servicos', novosServicos)
                                  
                                  // Recalcula o valor total após remover o serviço
                                  const total = novosServicos.reduce((acc, curr) => {
                                    return acc + (Number(curr.valor) || 0)
                                  }, 0)
                                  setFieldValue('valorTotal', total)
                                }}
                              >
                                <MdDelete size={20} />
                              </Button>
                            </Col>
                          </Row>
                        ))}

                        {values.servicos.length > 0 && (
                          <div className="d-flex justify-content-end mt-4">
                            <div className="bg-light p-3 rounded">
                              <h5 className="mb-0">
                                Valor Total: <span className="text-primary">
                                  R$ {values.valorTotal.toFixed(2)}
                                </span>
                              </h5>
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Link href="/orcamentos" className="btn btn-outline-secondary">
                    <IoMdArrowBack className="me-2" />
                    Voltar
                  </Link>
                  <Button onClick={handleSubmit} variant="primary">
                    <BsCheckLg className="me-2" />
                    Salvar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      <style jsx global>{`
        /* Estilo dos campos de formulário */
        .form-control, .form-select {
          border-radius: 8px;
          border: 1px solid #ced4da;
          padding: 0.75rem;
          transition: border-color 0.2s;
        }

        .form-control:focus, .form-select:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .card {
          border-radius: 15px;
          border: none;
          margin-bottom: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
        }

        .form-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        /* Estilo do card de serviços em orçamentos */
        .card.border {
          border: 1px solid #e0e0e0 !important;
          border-radius: 12px;
          overflow: hidden;
        }

        .card-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          padding: 1rem;
        }

        /* Estilo específico para a seção de serviços */
        .bg-light.p-3.rounded {
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .text-primary {
          font-weight: 600;
        }

        /* Botões de ação nos serviços */
        .btn-outline-danger {
          padding: 0.5rem;
          line-height: 1;
        }

        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: white;
        }
      `}</style>
    </Pagina>
  )
} 
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
import { mask } from 'remask'
import { v4 } from "uuid"
import { clienteValidator } from '@/validators/clienteValidator'

export default function page({ params }) {
  const route = useRouter()
  // const id = React.use(params)?.id?.[1]
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: ''
  })

  useEffect(() => {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || []
    if (params.id) {
      const dadosCliente = clientes.find(item => item.id == params.id)
      if (dadosCliente) {
        setCliente(dadosCliente)
      }
    }
  }, [params.id])

  function salvar(dados) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || []
    if (params.id) {
      const index = clientes.findIndex(cliente => cliente.id == params.id)
      if (index !== -1) {
        Object.assign(clientes[index], dados)
      }
    } else {
      dados.id = v4()
      clientes.push(dados)
    }
    localStorage.setItem('clientes', JSON.stringify(clientes))
    route.push('/clientes')
  }

  return (
    <Pagina titulo={params.id ? "Editar Cliente" : "Novo Cliente"}>
      <Card className="shadow-lg">
        <Card.Body>
          <Formik
            initialValues={cliente}
            validationSchema={clienteValidator}
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
                    <Form.Group controlId="nome">
                      <Form.Label>Nome Completo:</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={values.nome}
                        onChange={handleChange}
                        isInvalid={errors.nome && touched.nome}
                        placeholder="Digite o nome completo" 
                      /> 
                      <Form.Control.Feedback type="invalid" >{errors.nome}</Form.Control.Feedback> 
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="cpf">
                      <Form.Label>CPF:</Form.Label>
                      <Form.Control
                        type="text"
                        name="cpf"
                        value={values.cpf}
                        onChange={(e) => {
                          setFieldValue('cpf', mask(e.target.value, '999.999.999-99'))
                        }}
                        isInvalid={errors.cpf && touched.cpf}
                        placeholder="000.000.000-00" 
                      />
                      <Form.Control.Feedback type="invalid">{errors.cpf}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={8}>
                    <Form.Group controlId="email">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={errors.email && touched.email}
                        placeholder="email@exemplo.com"
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="telefone">
                      <Form.Label>Telefone:</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefone"
                        value={values.telefone}
                        onChange={(e) => {
                          setFieldValue('telefone', mask(e.target.value, '(99) 99999-9999'))
                        }}
                        isInvalid={errors.telefone && touched.telefone}
                        placeholder="(00) 00000-0000"
                      />
                      <Form.Control.Feedback type="invalid">{errors.telefone}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group controlId="cep">
                      <Form.Label>CEP:</Form.Label>
                      <Form.Control
                        type="text"
                        name="cep"
                        value={values.cep}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, '')
                          if (numericValue.length === 8) {
                            setFieldValue('cep', mask(numericValue, '99999-999'))
                          } else {
                            setFieldValue('cep', e.target.value)
                          }
                        }}
                        isInvalid={errors.cep && touched.cep}
                        placeholder="00000-000"
                      />
                      <Form.Control.Feedback type="invalid">{errors.cep}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group controlId="endereco">
                      <Form.Label>Endereço:</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco"
                        value={values.endereco}
                        onChange={handleChange}
                        isInvalid={errors.endereco && touched.endereco}
                        placeholder="Rua, número, bairro"
                      />
                      <Form.Control.Feedback type="invalid">{errors.endereco}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                {/* Botoes de salvar e voltar */}
                <div className="d-flex justify-content-between">
                  <Link href="/clientes" className="btn btn-outline-secondary">
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
        .form-control {
            border-radius: 8px;  /* Arredonda os cantos dos inputs */
            border: 1px solid #ced4da;  /* Borda sutil cinza */
            padding: 0.75rem;  /* Espaçamento interno */
            transition: border-color 0.2s;  /* Transição suave ao mudar a cor da borda */
        }

        /* Estilo quando o campo está em foco */
        .form-control:focus {
            border-color: #80bdff;  /* Borda azul quando selecionado */
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);  /* Sombra suave azul */
        }

        /* Estilo do card que contém o formulário */
        .card {
            border-radius: 15px;  /* Cantos arredondados */
            border: none;  /* Remove a borda padrão */
            margin-bottom: 2rem;  /* Espaço abaixo do card */
        }

        /* Estilo base dos botões */
        .btn {
            padding: 0.75rem 1.5rem;  /* Espaçamento interno */
            border-radius: 8px;  /* Cantos arredondados */
            font-weight: 500;  /* Peso da fonte */
        }

        /* Estilo das labels do formulário */
        .form-label {
            font-weight: 500;  /* Peso da fonte */
            margin-bottom: 0.5rem;  /* Espaço abaixo da label */
        }
      `}</style>
    </Pagina>
  )
} 
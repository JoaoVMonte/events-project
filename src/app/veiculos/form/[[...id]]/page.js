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

export default function FormVeiculo({ params }) {
  const route = useRouter()
  const [veiculo, setVeiculo] = useState({
    marca: '',
    modelo: '',
    placa: '',
    ano: '',
    cor: '',
    quilometragem: ''
  })

  useEffect(() => {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || []
    if (params.id) {
      const dadosVeiculo = veiculos.find(item => item.id == params.id)
      if (dadosVeiculo) {
        setVeiculo(dadosVeiculo)
      }
    }
  }, [params.id])

  function salvar(dados) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || []
    if (params.id) {
      const index = veiculos.findIndex(veiculo => veiculo.id == params.id)
      if (index !== -1) {
        Object.assign(veiculos[index], dados)
      }
    } else {
      dados.id = v4()
      veiculos.push(dados)
    }
    localStorage.setItem('veiculos', JSON.stringify(veiculos))
    route.push('/veiculos')
  }

  return (
    <Pagina titulo={params.id ? "Editar Veículo" : "Novo Veículo"}>
      <Card className="shadow-lg">
        <Card.Body>
          <Formik
            initialValues={veiculo}
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
                    <Form.Group controlId="marca">
                      <Form.Label>Marca:</Form.Label>
                      <Form.Control
                        type="text"
                        name="marca"
                        value={values.marca}
                        onChange={handleChange}
                        isInvalid={errors.marca && touched.marca}
                        placeholder="Digite a marca"
                      />
                      <Form.Control.Feedback type="invalid">{errors.marca}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="modelo">
                      <Form.Label>Modelo:</Form.Label>
                      <Form.Control
                        type="text"
                        name="modelo"
                        value={values.modelo}
                        onChange={handleChange}
                        isInvalid={errors.modelo && touched.modelo}
                        placeholder="Digite o modelo"
                      />
                      <Form.Control.Feedback type="invalid">{errors.modelo}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group controlId="placa">
                      <Form.Label>Placa:</Form.Label>
                      <Form.Control
                        type="text"
                        name="placa"
                        value={values.placa}
                        onChange={(e) => {
                          const valor = e.target.value.toUpperCase()
                          const placaMascarada = mask(valor, ['AAA-9999'])
                          setFieldValue('placa', placaMascarada)
                        }}
                        isInvalid={errors.placa && touched.placa}
                        placeholder="AAA-9999"
                        maxLength={8}
                      />
                      <Form.Control.Feedback type="invalid">{errors.placa}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="ano">
                      <Form.Label>Ano:</Form.Label>
                      <Form.Control
                        type="number"
                        name="ano"
                        value={values.ano}
                        onChange={handleChange}
                        isInvalid={errors.ano && touched.ano}
                        placeholder="2024"
                      />
                      <Form.Control.Feedback type="invalid">{errors.ano}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="cor">
                      <Form.Label>Cor:</Form.Label>
                      <Form.Control
                        type="text"
                        name="cor"
                        value={values.cor}
                        onChange={handleChange}
                        isInvalid={errors.cor && touched.cor}
                        placeholder="Digite a cor"
                      />
                      <Form.Control.Feedback type="invalid">{errors.cor}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group controlId="quilometragem">
                      <Form.Label>Quilometragem:</Form.Label>
                      <Form.Control
                        type="number"
                        name="quilometragem"
                        value={values.quilometragem}
                        onChange={handleChange}
                        isInvalid={errors.quilometragem && touched.quilometragem}
                        placeholder="Digite a quilometragem"
                      />
                      <Form.Control.Feedback type="invalid">{errors.quilometragem}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Link href="/veiculos" className="btn btn-outline-secondary">
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
      `}</style>
    </Pagina>
  )
} 
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

export default function FormServico({ params }) {
  const route = useRouter()
  const [servico, setServico] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    observacoes: ''
  })

  useEffect(() => {
    if (params.id) {
      const servicos = JSON.parse(localStorage.getItem('servicos')) || []
      const dadosServico = servicos.find(item => item.id == params.id)
      if (dadosServico) {
        setServico(dadosServico)
      }
    }
  }, [params.id])

  function salvar(dados) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || []
    if (params.id) {
      const index = servicos.findIndex(servico => servico.id == params.id)
      if (index !== -1) {
        Object.assign(servicos[index], dados)
      }
    } else {
      dados.id = v4()
      servicos.push(dados)
    }
    localStorage.setItem('servicos', JSON.stringify(servicos))
    route.push('/servicos')
  }

  return (
    <Pagina titulo={params.id ? "Editar Serviço" : "Novo Serviço"}>
      <Card className="shadow-lg">
        <Card.Body>
          <Formik
            initialValues={servico}
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
                  <Col md={8}>
                    <Form.Group controlId="descricao">
                      <Form.Label>Descrição:</Form.Label>
                      <Form.Control
                        type="text"
                        name="descricao"
                        value={values.descricao}
                        onChange={handleChange}
                        isInvalid={errors.descricao && touched.descricao}
                        placeholder="Digite a descrição do serviço"
                      />
                      <Form.Control.Feedback type="invalid">{errors.descricao}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="valor">
                      <Form.Label>Valor:</Form.Label>
                      <Form.Control
                        type="text"
                        name="valor"
                        value={values.valor}
                        onChange={(e) => {
                          const valor = e.target.value.replace(/\D/g, '')
                          const valorFormatado = (Number(valor) / 100).toFixed(2)
                          setFieldValue('valor', valorFormatado)
                        }}
                        isInvalid={errors.valor && touched.valor}
                        placeholder="R$ 0,00"
                      />
                      <Form.Control.Feedback type="invalid">{errors.valor}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group controlId="categoria">
                      <Form.Label>Categoria:</Form.Label>
                      <Form.Select
                        name="categoria"
                        value={values.categoria}
                        onChange={handleChange}
                        isInvalid={errors.categoria && touched.categoria}
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="Funilaria">Funilaria</option>
                        <option value="Pintura">Pintura</option>
                        <option value="Polimento">Polimento</option>
                        <option value="Restauração">Restauração</option>
                        <option value="Outros">Outros</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group controlId="observacoes">
                      <Form.Label>Observações:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="observacoes"
                        value={values.observacoes}
                        onChange={handleChange}
                        isInvalid={errors.observacoes && touched.observacoes}
                        placeholder="Observações adicionais sobre o serviço"
                      />
                      <Form.Control.Feedback type="invalid">{errors.observacoes}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Link href="/servicos" className="btn btn-outline-secondary">
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
'use client'

import Pagina from "@/app/components/Pagina"
import { Formik } from "formik"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { BsCheckLg } from "react-icons/bs"
import { IoMdArrowBack } from "react-icons/io"
import { mask } from 'remask'
import { v4 } from "uuid"
import { funcionarioValidator } from '@/validators/funcionarioValidator'


export default function page({ params }) {
    const route = useRouter()
    const CARGOS = {
        FUNILEIRO: 'Funileiro',
        CAIXA: 'Caixa'
    }
    const [funcionario, setFuncionario] = useState({
        nome: '',
        cpf: '',
        telefone: '',
        cargo: '',
        endereco: ''
    })

    useEffect(() => {
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || []
        if (params.id) {
            const dadosFuncionario = funcionarios.find(item => item.id == params.id)
            if (dadosFuncionario) {
                setFuncionario(dadosFuncionario)
            }
        }
    }, [params.id])

    function salvar(dados) {
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || []
        if (params.id) {
            const index = funcionarios.findIndex(funcionario => funcionario.id == params.id) 
            if (index !== -1) { 
                Object.assign(funcionarios[index], dados)
            }
        } else {
            dados.id = v4() // Cria um novo id para o funcionário
            funcionarios.push(dados) // Adiciona o funcionário ao array
        }
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios))
        route.push('/funcionarios')
    }

    return (
        <Pagina titulo={params.id ? "Editar Funcionário" : "Novo Funcionário"}> 
            <Card className="shadow-lg">
                <Card.Body>
                    <Formik
                        initialValues={funcionario}
                        validationSchema={funcionarioValidator}
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
                                            <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
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
                                    <Col md={6}>
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
                                    <Col md={6}>
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

                                <Row className="mb-4">
                                    <Col md={12}>
                                        <Form.Group controlId="cargo">
                                            <Form.Label>Cargo:</Form.Label>
                                            <Form.Select
                                                name="cargo"
                                                value={values.cargo}
                                                onChange={handleChange}
                                                isInvalid={errors.cargo && touched.cargo}
                                            >
                                                <option value="">Selecione o cargo</option>
                                                {Object.values(CARGOS).map(cargo => (
                                                    <option key={cargo} value={cargo}>
                                                        {cargo}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.cargo}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-between">
                                    <Link href="/funcionarios" className="btn btn-outline-secondary">
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
        .form-control {
            border-radius: 8px;
            border: 1px solid #ced4da;
            padding: 0.75rem;
            transition: border-color 0.2s;
        }
        .form-control:focus {
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
      `}</style>
        </Pagina>
    )
}    
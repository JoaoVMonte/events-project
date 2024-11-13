'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, Row, Col, Button, Form, Modal } from "react-bootstrap"
import { FaPlusCircle, FaRegEdit, FaSearch } from "react-icons/fa"
import { MdDelete, MdPerson } from "react-icons/md"
import Pagina from "../components/Pagina"

export default function Page() {
  const [funcionarios, setFuncionarios] = useState([])
  const [filtro, setFiltro] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState(null)

  useEffect(() => {
    setFuncionarios(JSON.parse(localStorage.getItem('funcionarios')) || [])
  }, [])

  function handleExcluir(funcionario) {
    setFuncionarioParaExcluir(funcionario)
    setShowModal(true)
  }

  function confirmarExclusao() {
    if (funcionarioParaExcluir) {
      const funcionariosAtuais = JSON.parse(localStorage.getItem('funcionarios')) || []
      const index = funcionariosAtuais.findIndex(funcionario => funcionario.id === funcionarioParaExcluir.id)
      if (index !== -1) {
        funcionariosAtuais.splice(index, 1)
        localStorage.setItem('funcionarios', JSON.stringify(funcionariosAtuais))
        setFuncionarios(funcionariosAtuais)
      }
    }
    setShowModal(false)
  }

  const funcionariosFiltrados = funcionarios.filter(funcionario => 
    (funcionario?.cpf || '').includes(filtro) // verifica se algum valor do cpf esta contido no filtro e retorna
  )

  return (
    <Pagina titulo="Gerenciamento de Funcionários">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href={`/funcionarios/form`} className="btn btn-new">
          <FaPlusCircle className="me-2" />
          Novo Funcionário
        </Link>
        <div className="d-flex align-items-center">
          <FaSearch className="me-2 text-primary" />
          <Form.Control
            type="text"
            placeholder="Buscar por CPF..."
            value={filtro}
            onChange={busca => setFiltro(busca.target.value)} // Atribui o valor digitado ao filtro 
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {funcionariosFiltrados.length === 0 ? (
          <Card className="text-center p-4">
            <Card.Body>
              <MdPerson size={50} className="text-muted mb-3" />
              <h4>Nenhum funcionário encontrado</h4>
              <p className="text-muted">
                {filtro ? 'Não há funcionários que correspondam à sua busca.' : 'Comece adicionando um novo funcionário!'}
              </p>
            </Card.Body>
          </Card>
        ) : (
          funcionariosFiltrados.map((funcionario) => (
            <Col key={funcionario.id}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary p-3 me-3">
                        <MdPerson className="text-white" size={24} />
                      </div>
                      <div>
                        <Card.Title className="mb-0">{funcionario.nome}</Card.Title>
                        <Card.Subtitle className="text-muted">{funcionario.cargo}</Card.Subtitle>
                      </div>
                    </div>
                  </div>
                  
                  <Card.Text>
                    <strong>CPF:</strong> {funcionario.cpf}<br />
                    <strong>Telefone:</strong> {funcionario.telefone}<br />
                    <strong>Endereço:</strong> {funcionario.endereco}<br />
                    <strong>Cargo:</strong> {funcionario.cargo}
                  </Card.Text>
                  
                  <div className="d-flex justify-content-end mt-3">
                    <Link href={`/funcionarios/form/${funcionario.id}`} className="me-2">
                      <Button variant="outline-primary" size="sm" style={{ padding: '4px 8px' }}>
                        <FaRegEdit size={14} className="me-1" /> Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleExcluir(funcionario)}
                    >
                      <MdDelete size={14} className="me-1" /> Excluir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {/* Modal para confirmar exclusão */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered> 
        <Modal.Header closeButton>
          <Modal.Title className="text-danger d-flex align-items-center">
            <MdDelete className="me-2" size={24} />
            Confirmar Exclusão
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {funcionarioParaExcluir && (
            <div className="cliente-info p-3 bg-light rounded">
              <div className="mb-2">
                <strong>Nome:</strong> 
                <span className="ms-2">{funcionarioParaExcluir.nome}</span>
              </div>
              <div className="mb-2">
                <strong>CPF:</strong> 
                <span className="ms-2">{funcionarioParaExcluir.cpf}</span>
              </div>
              <div className="mb-2">
                <strong>Telefone:</strong> 
                <span className="ms-2">{funcionarioParaExcluir.telefone}</span>
              </div>
              <div className="mb-2">
                <strong>Endereço:</strong> 
                <span className="ms-2">{funcionarioParaExcluir.endereco}</span>
              </div>
              <div className="mb-2">
                <strong>Cargo:</strong> 
                <span className="ms-2">{funcionarioParaExcluir.cargo}</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmarExclusao}
          >
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        /* Efeitos de Cards */
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          border: none !important;
          background-color: white;
        }

        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }

        /* Estilização Geral */
        .card {
          border-radius: 15px;
          border: none;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        /* Estilização de Botões */
        .btn { 
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn:active {
          transform: scale(0.98);
        }

        /* Campo de Busca */
        .form-control {
          border-radius: 8px;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }

        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
        }

        /* Ícone de Pessoa */
        .rounded-circle {
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .card:hover .rounded-circle {
          background-color: #0056b3 !important;
          transform: scale(1.05);
        }

        /* Botão Novo Funcionário */
        .btn-new {
          background-color: #003366;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0, 51, 102, 0.15);
        }

        .btn-new:hover {
          background-color: #004080;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 51, 102, 0.2);
          color: white;
        }

        /* Mensagem de Nenhum Funcionário */
        .text-center.p-4 {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .text-center.p-4 h4 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .text-center.p-4 .text-muted {
          font-size: 1.1rem;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .btn-new {
            padding: 0.5rem 1rem;
          }

          .form-control {
            width: 100% !important;
          }

          .text-center.p-4 {
            margin: 1rem;
          }
        }
      `}</style>
    </Pagina>
  )
} 
'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, Row, Col, Button, Form, Modal } from "react-bootstrap"
import { FaPlusCircle, FaRegEdit, FaSearch } from "react-icons/fa"
import { MdDelete, MdBuildCircle } from "react-icons/md"
import Pagina from "../components/Pagina"

export default function Page() {
  const [servicos, setServicos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [servicoParaExcluir, setServicoParaExcluir] = useState(null)

  useEffect(() => {
    setServicos(JSON.parse(localStorage.getItem('servicos')) || [])
  }, [])

  function handleExcluir(servico) {
    setServicoParaExcluir(servico)
    setShowModal(true)
  }

  function confirmarExclusao() {
    if (servicoParaExcluir) {
      const servicosAtuais = JSON.parse(localStorage.getItem('servicos')) || []
      const index = servicosAtuais.findIndex(servico => servico.id === servicoParaExcluir.id)
      if (index !== -1) {
        servicosAtuais.splice(index, 1)
        localStorage.setItem('servicos', JSON.stringify(servicosAtuais))
        setServicos(servicosAtuais)
      }
    }
    setShowModal(false)
  }

  const servicosFiltrados = servicos.filter(servico => 
    servico?.descricao?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <Pagina titulo="Gerenciamento de Serviços">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href={`/servicos/form`} className="btn btn-new">
          <FaPlusCircle className="me-2" />
          Novo Serviço
        </Link>
        <div className="d-flex align-items-center">
          <FaSearch className="me-2 text-primary" />
          <Form.Control
            type="text"
            placeholder="Buscar por descrição..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {servicosFiltrados.length === 0 ? (
          
          <Card className="text-center p-4">
            <Card.Body>
              <MdBuildCircle size={50} className="text-muted mb-3" />
              <h4>Nenhum serviço encontrado</h4>
              <p className="text-muted">
                {filtro ? 'Não há serviços que correspondam à sua busca.' : 'Comece adicionando um novo serviço!'}
              </p>
            </Card.Body>
          </Card>
        ) : (
          servicosFiltrados.map((servico) => (
            <Col key={servico.id}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary p-3 me-3">
                        <MdBuildCircle className="text-white" size={24} />
                      </div>
                      <div>
                        <Card.Title className="mb-0">{servico.descricao}</Card.Title>
                        <Card.Subtitle className="text-muted">
                          R$ {Number(servico.valor).toFixed(2)}
                        </Card.Subtitle>
                      </div>
                    </div>
                  </div>
                  
                  <Card.Text>
                    <strong>Categoria:</strong> {servico.categoria}<br />
                    <strong>Tempo Estimado:</strong> {servico.tempoEstimado}<br />
                    <strong>Observações:</strong> {servico.observacoes || 'Nenhuma observação'}
                  </Card.Text>
                  
                  <div className="d-flex justify-content-end mt-3">
                    <Link href={`/servicos/form/${servico.id}`} className="me-2">
                      <Button variant="outline-primary" size="sm" style={{ padding: '4px 8px' }}>
                        <FaRegEdit size={14} className="me-1" /> Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleExcluir(servico)}
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
          {servicoParaExcluir && (
            <div className="cliente-info p-3 bg-light rounded">
              <div className="mb-2">
                <strong>Descrição:</strong> 
                <span className="ms-2">{servicoParaExcluir.descricao}</span>
              </div>
              <div className="mb-2">
                <strong>Valor:</strong> 
                <span className="ms-2">R$ {Number(servicoParaExcluir.valor).toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <strong>Categoria:</strong> 
                <span className="ms-2">{servicoParaExcluir.categoria}</span>
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
        /* Efeito de transição suave ao mover o card e mudar a sombra */
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        /* Quando o mouse passar por cima do card */
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }

        /* Estilo base dos cards */
        .card {
          border-radius: 15px;
          border: none;
        }

        /* Estilo base dos botões */
        .btn { 
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
        }

        /* Estilo dos campos de formulário */
        .form-control {
          border-radius: 8px;
          padding: 0.75rem;
        }

        /* Círculo que contém o ícone */
        .rounded-circle {
          transition: background-color 0.2s;
        }

        /* Muda a cor do círculo quando passa o mouse sobre o card */
        .card:hover .rounded-circle {
          background-color: #0056b3 !important;
        }

        /* Estilo do botão "Novo Serviço" */
        .btn-new {
          background-color: #003366;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        /* Efeito hover no botão "Novo Serviço" */
        .btn-new:hover {
          background-color: #004080;
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 51, 102, 0.2);
        }

        /* Container das informações no modal */
        .cliente-info {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid #e9ecef;
        }

        /* Cada linha de informação */
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        /* Labels das informações */
        .info-item strong {
          min-width: 80px;
          color: #6c757d;
        }

        /* Efeito hover no botão secundário */
        .btn-outline-secondary:hover {
          background-color: #f8f9fa;
          color: #6c757d;
          border-color: #6c757d;
        }
      `}</style>
    </Pagina>
  )
} 
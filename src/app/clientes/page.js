'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Form, Modal, Accordion, Badge } from "react-bootstrap";
import { FaPlusCircle, FaRegEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdPerson } from "react-icons/md";
import Pagina from "../components/Pagina";

export default function Page() {
  const [clientes, setClientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null)

  useEffect(() => {
    setClientes(JSON.parse(localStorage.getItem('clientes')) || [])
  }, [])

  function handleExcluir(cliente) { // Função para excluir um cliente do array
    setClienteParaExcluir(cliente)
    setShowModal(true)
  }

  function confirmarExclusao() { // Função para confirmar a exclusão do cliente
    if (clienteParaExcluir) {
      const clientesAtuais = JSON.parse(localStorage.getItem('clientes')) || []
      const index = clientesAtuais.findIndex(cliente => cliente.id === clienteParaExcluir.id)
      if (index !== -1) {
        clientesAtuais.splice(index, 1)
        localStorage.setItem('clientes', JSON.stringify(clientesAtuais))
        setClientes(clientesAtuais)
      }
    }
    setShowModal(false) 
  }

  const clientesFiltrados = clientes.filter(cliente => 
    (cliente?.cpf || '').includes(filtro) // Verifica se o CPF do cliente contém o filtro de busca e retorna o resultado correspondente 
  )

  return (
    <Pagina titulo="Gerenciamento de Clientes">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href={`/clientes/form`} className="btn btn-new">
          <FaPlusCircle className="me-2" />
          Novo Cliente
        </Link>

        {/* Campo de busca */}
        <div className="d-flex align-items-center">
          <FaSearch className="me-2 text-primary" />
          <Form.Control
            type="text"
            placeholder="Buscar por CPF..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)} // Atualiza o filtro quando o valor do input muda
            style={{ width: '300px' }}
          />
        </div>
      </div>

      {clientesFiltrados.length === 0 ? ( // Se o array de clientes filtrados estiver vazio, mostre esta mensagem padrao
        <Card className="text-center p-4">
          <Card.Body>
            <MdPerson size={50} className="text-muted mb-3" />
            <h4>Nenhum cliente encontrado</h4>
            <p className="text-muted">
              {filtro ? 'Não há clientes que correspondam à sua busca.' : 'Comece adicionando um novo cliente!'}
            </p>
          </Card.Body>
        </Card>
      ) : (
        
        <div> 
          {/* Lista de clientes */}
          <Row xs={1} md={2} lg={3} className="g-4">
            {clientesFiltrados.map((cliente) => ( 
              <Col key={cliente.id}>
                <Card className="h-100 shadow-sm hover-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary p-3 me-3">
                          <MdPerson className="text-white" size={24} />
                        </div>
                        <div>
                          <Card.Title className="mb-0">{cliente.nome}</Card.Title>
                          <Card.Subtitle className="text-muted">{cliente.cpf}</Card.Subtitle>
                        </div>
                      </div>
                    </div>
                    
                    <Card.Text>
                      <strong>Email:</strong> {cliente.email}<br />
                      <strong>Telefone:</strong> {cliente.telefone}<br />
                      <strong>Endereço:</strong> {cliente.endereco}
                    </Card.Text>

                    {cliente.historicoServicos && cliente.historicoServicos.length > 0 && (
                      <Accordion className="mt-3">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            Histórico de Serviços ({cliente.historicoServicos.length})
                          </Accordion.Header>
                          <Accordion.Body>
                            {cliente.historicoServicos.map((servico, index) => (
                              <div key={index} className="servico-historico mb-3 p-3 bg-light rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <p className="mb-1">
                                      <strong>Data:</strong> {new Date(servico.dataPagamento).toLocaleDateString()}
                                    </p>
                                    <p className="mb-1">
                                      <strong>Veículo:</strong> {servico.veiculo?.modelo} ({servico.veiculo?.placa})
                                    </p>
                                    <p className="mb-0">
                                      <strong>Valor Total:</strong> R$ {servico.valorTotal?.toFixed(2)}
                                    </p>
                                  </div>
                                  <Badge bg="success">Pago</Badge>
                                </div>
                              </div>
                            ))}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    )}
                    
                    <div className="d-flex justify-content-end mt-3">
                      <Link href={`/clientes/form/${cliente.id}`} className="me-2">
                        <Button variant="outline-primary" size="sm">
                          <FaRegEdit className="me-1" /> Editar
                        </Button>
                        
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={( ) => handleExcluir(cliente)}
                      >
                        <MdDelete className="me-1" /> Excluir
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
      {/* Modal de exclusão */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger d-flex align-items-center">
            <MdDelete className="me-2" size={24} />
            Confirmar Exclusão
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clienteParaExcluir && (
            <div className="cliente-info p-3 bg-light rounded">
              <div className="mb-2">
                <strong>Nome:</strong> 
                <span className="ms-2">{clienteParaExcluir.nome}</span>
              </div>
              <div className="mb-2">
                <strong>CPF:</strong> 
                <span className="ms-2">{clienteParaExcluir.cpf}</span>
              </div>
              <div className="mb-2">
                <strong>Email:</strong> 
                <span className="ms-2">{clienteParaExcluir.email}</span>
              </div>
              <div className="mb-2">
                <strong>Telefone:</strong> 
                <span className="ms-2">{clienteParaExcluir.telefone}</span>
              </div>
              <div className="mb-2">
                <strong>CEP:</strong> 
                <span className="ms-2">{clienteParaExcluir.cep}</span>
              </div>
              <div>
                <strong>Endereço:</strong> 
                <span className="ms-2">{clienteParaExcluir.endereco}</span>
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
      {/* Efeito de transição suave ao mover o card e mudar a sombra */}
      .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }

      /* Quando o mouse passar por cima do card */
      .hover-card:hover {
          transform: translateY(-5px);  /* Move o card 5px para cima */
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;  /* Adiciona sombra suave */
      }

      /* Estilo base dos cards */
      .card {
          border-radius: 15px;  /* Arredonda os cantos */
          border: none;  /* Remove a borda padrão */
      }

      /* Estilo base dos botões */
      .btn { 
          border-radius: 8px;  /* Arredonda os cantos dos botões */
          display: inline-flex;  /* Permite alinhar ícone e texto */
          align-items: center;  /* Centraliza verticalmente o conteúdo */
      }

      /* Estilo dos campos de formulário */
      .form-control {
          border-radius: 8px;  /* Arredonda os cantos dos inputs */
          padding: 0.75rem;  /* Espaçamento interno */
      }

      /* Círculo que contém o ícone de pessoa */
      .rounded-circle {
          transition: background-color 0.2s;  /* Transição suave da cor de fundo */
      }

      /* Muda a cor do círculo quando passa o mouse sobre o card */
      .card:hover .rounded-circle {
          background-color: #0056b3 !important;  /* Azul mais escuro */
      }

      /* Estilo do botão "Novo Cliente" */
      .btn-new {
          background-color: #003366;  /* Cor de fundo azul escuro */
          color: white;  /* Texto branco */
          border: none;  /* Sem borda */
          padding: 0.6rem 1.2rem;  /* Espaçamento interno */
          transition: all 0.2s ease;  /* Transição suave */
          display: flex;  /* Permite alinhar ícone e texto */
          align-items: center;  /* Centraliza verticalmente */
          font-weight: 500;  /* Peso da fonte */
      }

      /* Efeito hover no botão "Novo Cliente" */
      .btn-new:hover {
          background-color: #004080;  /* Azul um pouco mais claro */
          transform: translateY(-2px);  /* Move o botão 2px para cima */
          box-shadow: 0 3px 8px rgba(0, 51, 102, 0.2);  /* Sombra suave */
      }

      /* Container das informações do cliente no modal */
      .cliente-info {
          background-color: #f8f9fa;  /* Fundo cinza claro */
          padding: 1rem;  /* Espaçamento interno */
          border-radius: 10px;  /* Cantos arredondados */
          border: 1px solid #e9ecef;  /* Borda sutil */
      }

      /* Cada linha de informação do cliente */
      .info-item {
          display: flex;  /* Layout flexível */
          align-items: center;  /* Alinha itens verticalmente */
          margin-bottom: 0.5rem;  /* Espaço entre itens */
      }

      /* Labels das informações do cliente */
      .info-item strong {
          min-width: 80px;  /* Largura mínima para alinhar valores */
          color: #6c757d;  /* Cor cinza médio */
      }

      /* Efeito hover no botão secundário */
      .btn-outline-secondary:hover {
          background-color: #f8f9fa;  /* Fundo cinza claro */
          color: #6c757d;  /* Texto cinza médio */
          border-color: #6c757d;  /* Borda cinza */
      }

      /* Estilos para o histórico de serviços */
      .servico-historico {
        border: 1px solid #e0e0e0;
        transition: all 0.2s ease;
      }

      .servico-historico:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .accordion-button:not(.collapsed) {
        background-color: #f8f9fa;
        color: #0d6efd;
      }

      .accordion-button:focus {
        box-shadow: none;
        border-color: rgba(0,0,0,.125);
      }

      .list-unstyled li {
        color: #666;
        font-size: 0.95rem;
      }

      .badge {
        padding: 0.5em 0.8em;
        font-weight: 500;
      }
      `}</style>
    </Pagina>
  )
}
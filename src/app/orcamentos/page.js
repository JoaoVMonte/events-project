'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, Row, Col, Button, Badge } from "react-bootstrap"
import { FaPlusCircle, FaRegEdit, FaSearch } from "react-icons/fa"
import { MdDelete, MdDescription, MdCheck, MdArchive } from "react-icons/md"
import Pagina from "../components/Pagina"
import { useRouter } from "next/navigation"
import { Form } from "react-bootstrap"

export default function Page() {
  const [orcamentos, setOrcamentos] = useState([])
  const router = useRouter()
  const [cpfFiltro, setCpfFiltro] = useState('')

  useEffect(() => {carregarDados()}, [])

  function carregarDados() {
    const orcamentosData = JSON.parse(localStorage.getItem('orcamentos')) || []
    const clientesData = JSON.parse(localStorage.getItem('clientes')) || []
    const veiculosData = JSON.parse(localStorage.getItem('veiculos')) || []
    const funcionariosData = JSON.parse(localStorage.getItem('funcionarios')) || []

    const orcamentosCompletos = orcamentosData
      .filter(orc => orc.status === 'pendente' || orc.status === 'arquivado')
      .map(orcamento => ({
        ...orcamento,
        cliente: clientesData.find(cliente => cliente.id === orcamento.cliente),
        veiculo: veiculosData.find(veiculos => veiculos.id === orcamento.veiculo),
        funcionario: funcionariosData.find(f => f.id === orcamento.funcionario)
      }))

    setOrcamentos(orcamentosCompletos)
  }

  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    const cpfCliente = orcamento.cliente?.cpf || ''
    return (orcamento.status === 'pendente' || orcamento.status === 'arquivado') &&
           cpfCliente.includes(cpfFiltro)
  })

  const orcamentosPendentes = orcamentosFiltrados.filter(o => o.status === 'pendente')
  const orcamentosArquivados = orcamentosFiltrados.filter(o => o.status === 'arquivado')
{/* função para iniciar o trabalho */}
  function handleIniciarTrabalho(orcamento) {
    const orcamentosAtuais = JSON.parse(localStorage.getItem('orcamentos')) || []
    const index = orcamentosAtuais.findIndex(o => o.id === orcamento.id)
    
    if (index !== -1) {
      orcamentosAtuais[index] = {
        ...orcamentosAtuais[index], //copia o orçamento
        status: 'em_andamento', //altera o status para em andamento
        dataInicio: new Date().toISOString() //altera a data de início
      }
      
      localStorage.setItem('orcamentos', JSON.stringify(orcamentosAtuais))
      
      // Redireciona para a home após iniciar o trabalho
      router.push('/home')
    }
  }

  function handleExcluirArquivado(orcamento) {
    const orcamentosAtuais = JSON.parse(localStorage.getItem('orcamentos')) || []
    const index = orcamentosAtuais.findIndex(o => o.id === orcamento.id)
    
    if (index !== -1) {
      orcamentosAtuais.splice(index, 1)
      localStorage.setItem('orcamentos', JSON.stringify(orcamentosAtuais))
      carregarDados()
    }
  }

  return (
    <Pagina titulo="Gerenciamento de Orçamentos">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href={`/orcamentos/form`} className="btn btn-new">
          <FaPlusCircle className="me-2" />
          Novo Orçamento
        </Link>
        <div className="d-flex align-items-center">
          <FaSearch className="me-2 text-primary" />
          <Form.Control
            type="text"
            placeholder="Buscar por CPF do cliente..."
            value={cpfFiltro}
            onChange={e => setCpfFiltro(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      {/* orçamentos pendentes */}
      <h4 className="mb-4">Orçamentos Pendentes</h4>
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {orcamentosPendentes.length === 0 ? (// busca se orçamentos pendentes existem
          <Card className="text-center p-4">
            <Card.Body>
              <MdDescription size={50} className="text-muted mb-3" />
              <h4>Nenhum orçamento pendente</h4>
              <p className="text-muted">
                {cpfFiltro 
                  ? 'Não há orçamentos pendentes para o CPF informado.' 
                  : 'Não há orçamentos aguardando confirmação.'}
              </p>
            </Card.Body>
          </Card>
        ) : (
          orcamentosPendentes.map((orcamento) => ( 
            <Col key={orcamento.id}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary p-3 me-3">
                        <MdDescription className="text-white" size={24} />
                      </div>
                      <div>
                        <Card.Title className="mb-0">{orcamento.cliente?.nome}</Card.Title>
                        <Card.Subtitle className="text-muted">{orcamento.veiculo?.placa}</Card.Subtitle>
                      </div>
                    </div>
                    <Badge bg="warning">Pendente</Badge>
                  </div>
                  
                  <Card.Text>
                    <strong>Valor Total:</strong> R$ {orcamento.valorTotal?.toFixed(2)}<br />
                    <strong>Funcionário:</strong> {orcamento.funcionario?.nome}<br />
                    <strong>Data:</strong> {new Date(orcamento.data).toLocaleDateString()}<br />
                    <strong>Serviços:</strong> {orcamento.servicos?.length || 0} item(s)
                  </Card.Text>
                  
                  <div className="d-flex justify-content-end mt-3 gap-2">
                    <Button 
                      variant="success" 
                      size="sm" 
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleIniciarTrabalho(orcamento)}
                    >
                      <MdCheck size={14} className="me-1" />
                      Iniciar Trabalho
                    </Button>
                    <Link href={`/orcamentos/form/${orcamento.id}`}>
                      <Button variant="outline-primary" size="sm" style={{ padding: '4px 8px' }}>
                        <FaRegEdit size={14} className="me-1" /> Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleExcluir(orcamento)}
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
      {/* orçamentos arquivados */}
      <h4 className="mb-4">Orçamentos Arquivados</h4>
      <Row xs={1} md={2} lg={3} className="g-4">
        {orcamentosArquivados.length === 0 ? (
          <Card className="text-center p-4">
            <Card.Body>
              <MdDescription size={50} className="text-muted mb-3" />
              <h4>Nenhum orçamento arquivado</h4>
              <p className="text-muted">
                {cpfFiltro 
                  ? 'Não há orçamentos arquivados para o CPF informado.' 
                  : 'Não há orçamentos arquivados no momento.'}
              </p>
            </Card.Body>
          </Card>
        ) : (
          //Card Busca de Orçamentos Arquivados
          orcamentosArquivados.map((orcamento) => (
            <Col key={orcamento.id}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-secondary p-3 me-3">
                        <MdDescription className="text-white" size={24} />
                      </div>
                      <div>
                        <Card.Title className="mb-0">{orcamento.cliente?.nome}</Card.Title>
                        <Card.Subtitle className="text-muted">{orcamento.veiculo?.placa}</Card.Subtitle>
                      </div>
                    </div>
                    <Badge bg="secondary">Arquivado</Badge>
                  </div>
                  
                  <Card.Text>
                    <strong>Valor Total:</strong> R$ {orcamento.valorTotal?.toFixed(2)}<br />
                    <strong>Funcionário:</strong> {orcamento.funcionario?.nome}<br />
                    <strong>Data:</strong> {new Date(orcamento.data).toLocaleDateString()}<br />
                    <strong>Finalizado em:</strong> {new Date(orcamento.dataFinalizacao).toLocaleDateString()}<br />
                    <strong>Serviços:</strong> {orcamento.servicos?.length || 0} item(s)
                  </Card.Text>
                  
                  <div className="d-flex justify-content-end mt-3">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleExcluirArquivado(orcamento)}
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
        .form-control, .form-select {
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

        /* Estilo do botão "Novo Orçamento" */
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

        /* Efeito hover no botão "Novo Orçamento" */
        .btn-new:hover {
          background-color: #004080;
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0, 51, 102, 0.2);
        }

        /* Container das informaçes no modal */
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

        /* Status Badges */
        .badge {
          padding: 0.5em 0.8em;
          font-weight: 500;
          font-size: 0.875rem;
        }
      `}</style>
    </Pagina>
  )
} 
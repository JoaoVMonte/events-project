'use client'

import { useEffect, useState } from "react"
import { Card, Row, Col, Button, Badge } from "react-bootstrap"
import { MdDescription, MdCheck } from "react-icons/md"
import Pagina from "../components/Pagina"

export default function Home() {
  const [orcamentos, setOrcamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])

  useEffect(() => {
    carregarDados()
  }, [])

  function carregarDados() {
    const orcamentosData = JSON.parse(localStorage.getItem('orcamentos')) || []
    const clientesData = JSON.parse(localStorage.getItem('clientes')) || []
    const veiculosData = JSON.parse(localStorage.getItem('veiculos')) || []
    const funcionariosData = JSON.parse(localStorage.getItem('funcionarios')) || []

    const orcamentosCompletos = orcamentosData.map(orcamento => ({
      ...orcamento,
      cliente: clientesData.find(c => c.id === orcamento.cliente),
      veiculo: veiculosData.find(v => v.id === orcamento.veiculo),
      funcionario: funcionariosData.find(f => f.id === orcamento.funcionario)
    }))

    setOrcamentos(orcamentosCompletos)
    setClientes(clientesData)
    setVeiculos(veiculosData)
    setFuncionarios(funcionariosData)
  }

  function handleConcluir(orcamento) {
    const orcamentosAtuais = JSON.parse(localStorage.getItem('orcamentos')) || []
    const index = orcamentosAtuais.findIndex(o => o.id === orcamento.id)
    
    if (index !== -1) {
      orcamentosAtuais[index] = {
        ...orcamentosAtuais[index],
        status: 'finalizado'
      }
      
      localStorage.setItem('orcamentos', JSON.stringify(orcamentosAtuais))
      carregarDados()
    }
  }

  function handleConcluirPagamento(orcamento) {
    const orcamentosAtuais = JSON.parse(localStorage.getItem('orcamentos')) || []
    const clientesAtuais = JSON.parse(localStorage.getItem('clientes')) || []
    const veiculosAtuais = JSON.parse(localStorage.getItem('veiculos')) || []
    
    const index = orcamentosAtuais.findIndex(o => o.id === orcamento.id)
    const clienteIndex = clientesAtuais.findIndex(c => c.id === orcamento.cliente.id)
    
    if (index !== -1 && clienteIndex !== -1) {
      const veiculoCompleto = veiculosAtuais.find(v => v.id === orcamento.veiculo.id)

      const orcamentoFinalizado = {
        ...orcamentosAtuais[index],
        status: 'arquivado',
        dataPagamento: new Date().toISOString(),
        veiculo: veiculoCompleto
      }
      
      orcamentosAtuais[index] = orcamentoFinalizado
      
      if (!clientesAtuais[clienteIndex].historicoServicos) {
        clientesAtuais[clienteIndex].historicoServicos = []
      }
      
      clientesAtuais[clienteIndex].historicoServicos.push(orcamentoFinalizado)
      
      localStorage.setItem('orcamentos', JSON.stringify(orcamentosAtuais))
      localStorage.setItem('clientes', JSON.stringify(clientesAtuais))
      carregarDados()
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'em_andamento': { bg: 'primary', text: 'Em Andamento' },
      'finalizado': { bg: 'success', text: 'Finalizado' }
    }
    const config = statusConfig[status] || { bg: 'secondary', text: status }
    return <Badge bg={config.bg}>{config.text}</Badge>
  }

  const orcamentosEmAndamento = orcamentos.filter(o => o.status === 'em_andamento')
  const orcamentosFinalizados = orcamentos.filter(o => o.status === 'finalizado')

  return (
    <Pagina titulo="Dashboard">
      <h4 className="mb-4">Orçamentos em Andamento</h4>
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {orcamentosEmAndamento.length === 0 ? (
          <Card className="text-center p-4">
            <Card.Body>
              <MdDescription size={50} className="text-muted mb-3" />
              <h4>Nenhum orçamento em andamento</h4>
              <p className="text-muted">
                Não há orçamentos sendo executados no momento.
              </p>
            </Card.Body>
          </Card>
        ) : (
          orcamentosEmAndamento.map((orcamento) => (
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
                    {getStatusBadge(orcamento.status)}
                  </div>
                  
                  <Card.Text>
                    <strong>Valor Total:</strong> R$ {orcamento.valorTotal?.toFixed(2)}<br />
                    <strong>Funcionário:</strong> {orcamento.funcionario?.nome}<br />
                    <strong>Data:</strong> {new Date(orcamento.data).toLocaleDateString()}<br />
                    <strong>Serviços:</strong> {orcamento.servicos?.length || 0} item(s)
                  </Card.Text>
                  
                  <div className="d-flex justify-content-end mt-3">
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => handleConcluir(orcamento)}
                    >
                      <MdCheck className="me-2" />
                      Concluir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <h4 className="mb-4">Orçamentos Finalizados</h4>
      <Row xs={1} md={2} lg={3} className="g-4">
        {orcamentosFinalizados.length === 0 ? (
          <Card className="text-center p-4">
            <Card.Body>
              <MdDescription size={50} className="text-muted mb-3" />
              <h4>Nenhum orçamento finalizado</h4>
              <p className="text-muted">
                Não há orçamentos aguardando finalização real.
              </p>
            </Card.Body>
          </Card>
        ) : (
          orcamentosFinalizados.map((orcamento) => (
            <Col key={orcamento.id}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-success p-3 me-3">
                        <MdDescription className="text-white" size={24} />
                      </div>
                      <div>
                        <Card.Title className="mb-0">{orcamento.cliente?.nome}</Card.Title>
                        <Card.Subtitle className="text-muted">{orcamento.veiculo?.placa}</Card.Subtitle>
                      </div>
                    </div>
                    {getStatusBadge(orcamento.status)}
                  </div>
                  
                  <Card.Text>
                    <strong>Valor Total:</strong> R$ {orcamento.valorTotal?.toFixed(2)}<br />
                    <strong>Funcionário:</strong> {orcamento.funcionario?.nome}<br />
                    <strong>Data:</strong> {new Date(orcamento.data).toLocaleDateString()}<br />
                    <strong>Serviços:</strong> {orcamento.servicos?.length || 0} item(s)
                  </Card.Text>
                  
                  <div className="d-flex justify-content-end mt-3">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleConcluirPagamento(orcamento)}
                    >
                      <MdCheck className="me-2" />
                      Concluir Pagamento
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <style jsx global>{`
        /* ... estilos anteriores ... */
      `}</style>
    </Pagina>
  )
}
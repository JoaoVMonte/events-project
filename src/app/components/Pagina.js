'use client'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';

export default function Pagina(props) {
    const pathname = usePathname(); // pathname para definir e conseguir estilizar onde o link estiver selecionado

    return (
        <main>
            <Navbar 
                style={{ backgroundColor: '#003366' }} 
                variant="dark" 
                expand="lg" 
                className="shadow-sm"
                fixed="top"
            >
                <Container>
                    <Navbar.Brand href="/home" className="d-flex align-items-center">                        
                        <img
                            src="/logo.png"
                            alt="Logo Oficina do Lalá"
                            style={{ height: '45px', width: 'auto' }}
                            className="me-3"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link // PathName para definir qual o link atual selecionado
                                href="/orcamentos" 
                                className={`px-3 py-2 mx-1 rounded-pill ${pathname === '/orcamentos' ? 'active bg-white bg-opacity-25' : ''}`} 
                            >
                                Orçamentos
                            </Nav.Link>
                            <Nav.Link 
                                href="/clientes" 
                                className={`px-3 py-2 mx-1 rounded-pill ${pathname === '/clientes' ? 'active bg-white bg-opacity-25' : ''}`}
                            >
                                Clientes
                            </Nav.Link>
                            <Nav.Link 
                                href="/veiculos" 
                                className={`px-3 py-2 mx-1 rounded-pill ${pathname === '/veiculos' ? 'active bg-white bg-opacity-25' : ''}`}
                            >
                                Veículos
                            </Nav.Link>
                            <Nav.Link 
                                href="/servicos" 
                                className={`px-3 py-2 mx-1 rounded-pill ${pathname === '/servicos' ? 'active bg-white bg-opacity-25' : ''}`}
                            >
                                Serviços
                            </Nav.Link>
                            <Nav.Link 
                                href="/funcionarios" 
                                className={`px-3 py-2 mx-1 rounded-pill ${pathname === '/funcionarios' ? 'active bg-white bg-opacity-25' : ''}`}
                            >
                                Funcionários
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div style={{ marginTop: '80px' }}>
                <div className="page-header">
                    <h1 className="page-title container">{props.titulo}</h1>
                </div>

                <Container className="mt-4">
                    {props.children}
                </Container>
            </div>

            <style jsx global>{`
                .page-header {
                    background-color: #f8f9fa;
                    padding: 1.5rem 0;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid #e9ecef;
                }

                .page-title {
                    color: #003366;
                    font-size: 2rem;
                    font-weight: 600;
                    margin: 0;
                    padding: 0 1rem;
                    text-align: center;
                    position: relative;
                }

                .page-title:after {
                    content: '';
                    display: block;
                    width: 60px;
                    height: 3px;
                    background-color: #003366;
                    margin: 0.5rem auto 0;
                    border-radius: 2px;
                }

                .nav-link {
                    color: white !important;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .navbar {
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                }

                .navbar-brand {
                    transition: transform 0.2s ease;
                }

                .navbar-brand:hover {
                    transform: translateY(-1px);
                }

                @media (min-width: 768px) {
                    .page-title {
                        text-align: left;
                    }
                    
                    .page-title:after {
                        margin: 0.5rem 0 0;
                    }
                }
            `}</style>
        </main>
    );
}

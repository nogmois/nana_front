import React from "react";
import { Layout, Row, Col, Typography, Button, Card, Space, Image } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// Depoimentos personalizados
const testimonials = [
  {
    text: "O NanaFácil salvou nossas noites! Em uma semana, meu bebê dormiu 2 horas a mais por sessão de sono.",
    author: "– Marina, mãe do Lucas",
  },
  {
    text: "Adoro receber alertas no WhatsApp quando meu pequeno entrou em janela de sono. Me sinto mais tranquila e preparada.",
    author: "– Fernanda, mãe da Sofia",
  },
  {
    text: "Os relatórios em PDF são detalhados e ajudam meu pediatra a ajustar o plano. Vimos progresso rápido!",
    author: "– Carla, mãe do Miguel",
  },
  {
    text: "A interface é extremamente intuitiva. Consigo registrar eventos e ver gráficos em segundos.",
    author: "– Juliana, mãe da Helena",
  },
  {
    text: "O plano de 14 dias baseado em SBP mudou a rotina do meu bebê para melhor em poucos dias.",
    author: "– Patrícia, mãe do Gabriel",
  },
  {
    text: "Ter um histórico completo de eventos e gráficos interativos facilitou identificar padrões e melhorar o sono.",
    author: "– Ana, mãe da Laura",
  },
  {
    text: "Recomendo o NanaFácil para todas as mamães! Atendimento, tecnologia e resultados reais.",
    author: "– Bianca, mãe do Pedro",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  // Funcionalidades / benefícios
  const features = [
    "Algoritmo personalizado de janelas de sono",
    "Alertas em tempo real via WhatsApp",
    "Relatórios detalhados em PDF",
    "Plano de 14 dias baseado em SBP",
    "Histórico completo de eventos de sono e mamadas",
    "Gráficos interativos de padrão de sono",
    "Interface intuitiva e fácil de usar",
    "Dicas exclusivas de especialistas",
  ];

  return (
    <Layout className="landing-layout">
      {/* ATTENTION */}
      <Header className="landing-header">
        <div className="logo">NanaFácil</div>
        <Space size="middle">
          <Button type="link" className="btn-login" onClick={handleLogin}>
            Login
          </Button>
          <Button
            type="primary"
            size="large"
            className="btn-register"
            onClick={handleRegister}
          >
            Começar grátis
          </Button>
        </Space>
      </Header>

      <Content className="landing-content">
        {/* ATTENTION */}
        <section className="attention-section">
          <div className="attention-container">
            <Row align="middle" justify="center" gutter={[32, 32]}>
              <Col xs={24} md={12} className="attention-text">
                <Title level={1} className="attention-title">
                  Transforme suas noites com ciência e cuidado
                </Title>
                <Paragraph className="attention-subtitle">
                  Descubra o poder de um plano de sono personalizado, alertas em
                  tempo real e recursos que só o NanaFácil oferece.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  className="attention-cta"
                  onClick={handleRegister}
                >
                  Quero experimentar agora
                </Button>
              </Col>
              <Col xs={24} md={12} className="attention-image">
                <Image
                  src="https://saanova-imagens.s3.us-east-2.amazonaws.com/imagem+bb.png"
                  alt="Bebê dormindo"
                  preview={false}
                  width="100%"
                />
              </Col>
            </Row>
          </div>
        </section>

        {/* INTEREST */}
        <section className="interest-section features-section">
          <Title level={2} className="section-title">
            Todos os benefícios para você e seu bebê
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {features.map((item) => (
              <Col xs={24} sm={12} md={6} key={item}>
                <Card bordered={false} className="feature-card-upgraded">
                  <div className="feature-icon-wrapper">
                    <CheckCircleOutlined className="feature-icon-large" />
                  </div>
                  <Text className="feature-text-upgraded">{item}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* PLATFORM PREVIEW */}
        <section className="platform-section">
          <div className="platform-container">
            <Title level={2} className="section-title">
              Por dentro do NanaFácil
            </Title>
            <Paragraph className="platform-subtitle">
              Veja como nossa interface intuitiva coloca tudo o que você precisa
              na palma da mão.
            </Paragraph>
            <Row gutter={[24, 24]} justify="center">
              {[
                {
                  src: "https://saanova-imagens.s3.us-east-2.amazonaws.com/Screenshot+2025-06-12+123845.png",
                  alt: "Dashboard",
                  label: "Dashboard completo com resumo de rotina",
                },
                {
                  src: "https://saanova-imagens.s3.us-east-2.amazonaws.com/grafico.png",
                  alt: "Gráfico de sono",
                  label: "Gráficos interativos de sono e mamadas",
                },
                {
                  src: "https://saanova-imagens.s3.us-east-2.amazonaws.com/eventos.png",
                  alt: "Eventos",
                  label: "Alertas automáticos via WhatsApp",
                },
              ].map(({ src, alt, label }) => (
                <Col xs={24} sm={12} md={8} key={label}>
                  <div className="platform-card-wrapper">
                    <div className="device-frame">
                      <Image
                        src={src}
                        alt={alt}
                        preview={false}
                        className="platform-image"
                      />
                    </div>
                    <Text className="platform-text">{label}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* DESIRE */}
        <section className="desire-section testimonials-section">
          <Title level={2} className="section-title">
            O que dizem as mamães
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {testimonials.map(({ text, author }, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <Card className="testimonial-card">
                  <Paragraph className="testimonial-text">"{text}"</Paragraph>
                  <Text strong className="testimonial-author">
                    {author}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* ACTION */}
        <section className="action-section final-cta-section">
          <Title level={2} className="section-title">
            Pronta para noites mais tranquilas?
          </Title>
          <Button
            type="primary"
            size="large"
            className="action-cta"
            onClick={handleRegister}
          >
            Sim, quero começar!
          </Button>
        </section>
      </Content>

      <Footer className="landing-footer">
        <Text>© 2025 NanaFácil. Todos os direitos reservados.</Text>
      </Footer>
    </Layout>
  );
}

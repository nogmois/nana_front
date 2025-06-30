import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Card,
  Space,
  Image,
  Grid,
  Drawer,
  Form,
  Input,
} from "antd";
import { CheckCircleOutlined, MenuOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

import "./LandingPage.css";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

// Depoimentos de maior impacto
const testimonials = [
  {
    text: "Depois de 3 dias, meu bebê dormiu 5 horas seguidas — e eu também!",
    author: "– Marina, mãe do Lucas",
  },
  {
    text: "O plano validado por pediatras mudou nosso sono em 1 semana.",
    author: "– Fernanda, mãe da Sofia",
  },
  {
    text: "Nunca imaginei que acordaria tão descansada!",
    author: "– Carla, mãe do Miguel",
  },
];

// Features principais acima da dobra
const FEATURES = [
  "Noites contínuas em até 3 dias",
  "Plano validado por pediatras",
  "Garantia de resultado ou dinheiro de volta",
  "Relatórios claros para seu médico",
  // extras atrás da dobra
  "Gráficos que explicam despertares",
  "Interface simples e limpa",
  "Acompanhamento em qualquer dispositivo",
  "Suporte rápido quando precisar",
];

// Componente rotativo de micro-highlights
function RotatingHighlights({ items, interval = 3000 }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % items.length),
      interval
    );
    return () => clearInterval(timer);
  }, [items.length, interval]);
  return <Text className="highlight-text">{items[idx]}</Text>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showSwiper, setShowSwiper] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const idle = () => setShowSwiper(true);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(idle);
    } else {
      setTimeout(idle, 2000);
    }
  }, []);

  // Handler do cadastro via email
  const handleEmailSubmit = ({ email }) => {
    navigate("/register", { state: { email } });
  };

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  // Só 4 cards acima da dobra
  const visibleFeatures = FEATURES.slice(0, 4);

  return (
    <Layout className="landing-layout">
      <Helmet>
        <title>NanaFácil – Chega de noites em claro</title>
      </Helmet>

      {/* HEADER */}
      <Header className="landing-header">
        <div className="logo">NanaFácil</div>
        {screens.xs ? (
          <>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setOpenDrawer(true)}
            />
            <Drawer
              title="Menu"
              placement="right"
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button type="link" block onClick={handleLogin}>
                  Login
                </Button>
                <Button type="primary" block onClick={handleRegister}>
                  Começar grátis
                </Button>
              </Space>
            </Drawer>
          </>
        ) : (
          <Space size="middle">
            <Text>⭐ Mais de 10.000 mamães satisfeitas</Text>
            <Button type="link" className="btn-login" onClick={handleLogin}>
              Login
            </Button>
            <Button
              type="primary"
              className="btn-register"
              onClick={handleRegister}
            >
              Começar grátis
            </Button>
          </Space>
        )}
      </Header>

      {/* CONTENT */}
      <Content className="landing-content">
        {/* HERO */}
        <section className="attention-section">
          <div className="attention-container">
            <Row align="middle" justify="center" gutter={[48, 48]}>
              <Col xs={24} md={12} className="attention-text">
                <Title level={2} className="attention-title">
                  Chega de noites em claro!
                </Title>
                <Paragraph className="attention-subtitle">
                  Tenha até 5 horas seguidas de sono em 3 dias com nosso plano
                  validado por pediatras. Teste grátis.
                </Paragraph>

                {/* Rotator de micro-highlights */}
                <RotatingHighlights
                  items={[
                    "10 000+ mamães já dormem melhor",
                    "+2 horas de sono extra em 3 dias",
                    "100% validado por pediatras",
                    "Garantia total de satisfação",
                  ]}
                />
                <br />
                {/* Formulário de captura de email */}
                <Button
                  type="primary"
                  size="large"
                  className="attention-cta"
                  onClick={handleRegister}
                >
                  Quero noites tranquilas
                </Button>

                <Text className="attention-note">
                  💡 Restam 6 vagas para teste gratuito.
                </Text>
              </Col>
              <Col xs={24} md={12} className="attention-image">
                <Image
                  src="https://saanova-imagens.s3.us-east-2.amazonaws.com/imagem+bb.webp"
                  alt="Bebê dormindo tranquilamente"
                  preview={false}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          </div>
          <div className="attention-wave" />
        </section>

        {/* REAL QUESTIONS */}
        <section className="real-questions-section">
          <Title level={3} className="section-title">
            Suas dúvidas mais comuns
          </Title>
          <ul className="real-questions-list">
            <li>Por que meu bebê acorda às 3h toda noite?</li>
            <li>Por que meu bebê acorda muito à noite aos 6 meses?</li>
            <li>Meu bebê de 2 anos acorda várias vezes — o que fazer?</li>
            <li>Bebê não dorme de jeito nenhum. Já tentei de tudo!</li>
            <li>Qual é a janela ideal de soneca do bebê?</li>
            <li>Como ajustar a rotina de sono do bebê?</li>
            <li>Como ensinar o bebê a dormir sozinho?</li>
            <li>O que é janelinha do sono e como usar?</li>
            <li>Quais itens ajudam recém-nascido a dormir melhor?</li>
          </ul>
        </section>

        {/* FEATURES */}
        <section className="interest-section features-section">
          <Title level={2} className="section-title">
            Benefícios comprovados
          </Title>
          <Row gutter={[48, 48]} justify="center">
            {visibleFeatures.map((item, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Card bordered={false} className="feature-card-upgraded">
                  <CheckCircleOutlined className="feature-icon-large" />
                  <Text className="feature-text-upgraded">{item}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Row justify="center" style={{ marginTop: 32 }}>
            <Button
              type="primary"
              size="large"
              className="action-cta"
              onClick={handleRegister}
            >
              Quero meu plano agora
            </Button>
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
                  alt: "Dashboard completo",
                  label: "Dashboard completo",
                },
                {
                  src: "https://saanova-imagens.s3.us-east-2.amazonaws.com/grafico.png",
                  alt: "Gráficos de sono",
                  label: "Gráficos de sono e mamadas",
                },
                {
                  src: "https://saanova-imagens.s3.us-east-2.amazonaws.com/eventos.png",
                  alt: "Alertas automáticos",
                  label: "Alertas automáticos via WhatsApp",
                },
              ].map(({ src, alt, label }) => (
                <Col xs={24} sm={12} md={8} key={label}>
                  <div className="platform-card-wrapper">
                    <Image
                      src={src}
                      alt={alt}
                      preview={false}
                      className="platform-image"
                    />
                    <Text className="platform-text">{label}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-it-works-section">
          <Title level={2} className="section-title">
            Como funciona
          </Title>
          <ol className="how-list">
            <li>Cadastre seu bebê em menos de 1 minuto</li>
            <li>Receba seu plano e comece a ver noites tranquilas em 3 dias</li>
          </ol>
          <Button
            type="primary"
            size="large"
            className="how-cta"
            onClick={handleRegister}
          >
            Criar meu plano agora
          </Button>
        </section>

        {/* TESTIMONIALS */}
        <section className="desire-section testimonials-section">
          <Title level={2} className="section-title">
            Depoimentos reais
          </Title>
          {showSwiper && (
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              spaceBetween={24}
              loop
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{ 768: { slidesPerView: 2 } }}
            >
              {testimonials.map(({ text, author }, i) => (
                <SwiperSlide key={i}>
                  <Card className="testimonial-card">
                    <Paragraph className="testimonial-text">"{text}"</Paragraph>
                    <Text strong className="testimonial-author">
                      {author}
                    </Text>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <Title level={2} className="section-title">
            Dúvidas frequentes
          </Title>
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4}>
                  Por que meu bebê acorda no meio da noite?
                </Title>
                <Text>
                  Variações no ciclo de sono e fatores como fome ou desconforto
                  podem despertá-lo; nosso plano ajusta a rotina para minimizar
                  essas interrupções.
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4}>Como ensinar meu bebê a dormir sozinho?</Title>
                <Text>
                  Ensinamos técnicas suaves de autoconforto e um cronograma de
                  transição que ajudam seu bebê a adormecer de forma
                  independente.
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4}>
                  O que é janela de sono e como aplicá-la?
                </Title>
                <Text>
                  A janela de sono é o período ideal entre sonecas; planejamos
                  horários perfeitos para otimizar o ciclo natural do seu bebê.
                </Text>
              </Card>
            </Col>
          </Row>
        </section>
      </Content>

      {/* FOOTER */}
      <Footer className="landing-footer">
        <Text>© 2025 NanaFácil. Todos os direitos reservados.</Text>

        <div style={{ marginTop: 8 }}>
          <Link to="/terms" style={{ marginRight: 16 }}>
            Termos de Uso
          </Link>
          <Link to="/privacy">Política de Privacidade</Link>
        </div>
      </Footer>
    </Layout>
  );
}

import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
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
  Menu,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "./LandingPage.css";

const { useBreakpoint } = Grid;

import { MenuOutlined } from "@ant-design/icons";

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

  const screens = useBreakpoint();
  // Funcionalidades / benefícios
  const features = [
    "Sono mais longo com algoritmo personalizado",
    "Alertas no WhatsApp no momento certo",
    "Relatórios em PDF para o pediatra",
    "Plano de 14 dias aprovado por especialistas",
    "Acompanhamento completo de mamadas e sonecas",
    "Gráficos fáceis de entender e acompanhar",
    "App pensado para mães reais, sem complicação",
    "Conteúdo exclusivo de especialistas em sono",
  ];
  const isMobile = !screens.sm;
  const visibleFeatures = isMobile ? features.slice(0, 4) : features;
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <Layout className="landing-layout">
      {/* ATTENTION */}
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
              onClose={() => setOpenDrawer(false)}
              open={openDrawer}
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
        )}
      </Header>

      <Content className="landing-content">
        {/* ATTENTION */}
        <section className="attention-section">
          <div className="attention-container">
            <Row align="middle" justify="center" gutter={[32, 32]}>
              <Col xs={24} md={12} className="attention-text">
                <Title level={1} className="attention-title">
                  Mais sono para o bebê. Mais paz para você.
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
            {visibleFeatures.map((item, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
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

          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={16}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map(({ text, author }, i) => (
              <SwiperSlide key={i}>
                <Card className="testimonial-card" style={{ height: "100%" }}>
                  <Paragraph className="testimonial-text">"{text}"</Paragraph>
                  <Text strong className="testimonial-author">
                    {author}
                  </Text>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* ACTION */}
        <section className="action-section final-cta-section">
          <Title level={2} className="section-title">
            Pronta para noites mais tranquilas?
          </Title>
          <Paragraph className="action-subtitle">
            Comece agora com um plano personalizado e transforme o sono do seu
            bebê.
          </Paragraph>
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

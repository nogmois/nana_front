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

/* TESTIMONIALS & FEATURES */
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

const FEATURES = [
  "Sono mais longo com algoritmo personalizado",
  "Alertas no WhatsApp no momento certo",
  "Relatórios em PDF para o pediatra",
  "Plano de 14 dias aprovado por especialistas",
  "Acompanhamento completo de mamadas e sonecas",
  "Gráficos fáceis de entender e acompanhar",
  "App pensado para mães reais, sem complicação",
  "Conteúdo exclusivo de especialistas em sono",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // navigation handlers
  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  // mobile drawer
  const [openDrawer, setOpenDrawer] = useState(false);

  // delay Swiper for LCP
  const [showSwiper, setShowSwiper] = useState(false);
  useEffect(() => {
    const idleFn = () => setShowSwiper(true);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(idleFn);
    } else {
      setTimeout(idleFn, 2000);
    }
  }, []);

  const visibleFeatures = isMobile ? FEATURES.slice(0, 4) : FEATURES;

  // JSON-LD (Product + FAQ)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "NanaFácil – App de Sono Infantil",
        description:
          "Aplicativo web que ajuda pais a monitorar sono, mamadas e rotina do bebê com alertas em tempo real e relatórios para pediatras.",
        brand: { "@type": "Brand", name: "NanaFácil" },
        image:
          "https://saanova-imagens.s3.us-east-2.amazonaws.com/imagem+bb.png",
        offers: {
          "@type": "Offer",
          price: "29.90",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          url: "https://nanafacil-web.onrender.com/",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "O NanaFácil é gratuito?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Você pode testar grátis por 3 dias. Depois, planos a partir de R$29,90/mês.",
            },
          },
          {
            "@type": "Question",
            name: "Preciso instalar algum app?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não. O NanaFácil funciona 100% no navegador e se integra ao WhatsApp.",
            },
          },
          {
            "@type": "Question",
            name: "Os dados são compartilhados?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Seus dados ficam seguros e só são compartilhados quando você gera relatórios em PDF para o pediatra.",
            },
          },
        ],
      },
    ],
  };

  return (
    <Layout className="landing-layout">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
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

      {/* CONTENT */}
      <Content className="landing-content">
        {/* HERO */}
        <section className="attention-section">
          <div className="attention-container">
            <Row align="middle" justify="center" gutter={[48, 48]}>
              <Col xs={24} md={12} className="attention-text">
                <Title level={1} className="attention-title">
                  Seu bebê dormindo melhor. Você mais tranquila, hoje mesmo.
                </Title>
                <Paragraph className="attention-subtitle">
                  Teste grátis: receba agora um plano de sono personalizado com
                  alertas no WhatsApp. Sem complicação, direto no seu celular.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  className="attention-cta"
                  onClick={handleRegister}
                >
                  Começar teste grátis agora →
                </Button>
                <Text
                  type="secondary"
                  style={{ display: "block", marginTop: 8 }}
                >
                  💡 Válido por tempo limitado.
                </Text>
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
          <div className="attention-wave" />
        </section>

        {/* FEATURES */}
        <section className="interest-section features-section">
          <Title level={2} className="section-title">
            Todos os benefícios para você e seu bebê
          </Title>
          <Row gutter={[48, 48]} justify="center">
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
            <Row gutter={[48, 48]} justify="center">
              {[
                {
                  src: "https://saanova-imagens.s3.us-east-2.amazonaws.com/Screenshot+2025-06-12+123845.png",
                  alt: "Dashboard",
                  label: "Dashboard completo com resumo de rotina",
                },
                {
                  src: "https://saanova-imagens.s3.us-east-2.amazonaws.com/grafico.png",
                  alt: "Gráfico de sono",
                  label: "Gráficos interativos de sono e mamadeiras",
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
                        loading="lazy"
                      />
                    </div>
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
          <Row gutter={[48, 48]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} className="how-card">
                <Title level={4}>1. Cadastre seu bebê</Title>
                <Text>
                  Informe nome, idade e peso — leva menos de 1 minuto.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} className="how-card">
                <Title level={4}>2. Receba o plano no WhatsApp</Title>
                <Text>
                  Alertas personalizados e rotina diária com base em dados
                  reais.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} className="how-card">
                <Title level={4}>3. Acompanhe a evolução</Title>
                <Text>
                  Gráficos simples, relatórios em PDF e recomendações de
                  especialistas.
                </Text>
              </Card>
            </Col>
          </Row>
        </section>

        {/* TESTIMONIALS */}
        <section className="desire-section testimonials-section">
          <Title level={2} className="section-title">
            O que dizem as mamães
          </Title>
          {showSwiper ? (
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              spaceBetween={32}
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
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
          ) : (
            <Row gutter={[48, 48]} justify="center">
              {testimonials.slice(0, 3).map((_, i) => (
                <Col xs={24} sm={12} md={8} key={i}>
                  <Card className="testimonial-card" loading />
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <Title level={2} className="section-title">
            Dúvidas frequentes
          </Title>
          <Row gutter={[48, 48]}>
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Preciso instalar algo?</Title>
                <Text>
                  Não. O NanaFácil funciona direto no navegador e envia alertas
                  via WhatsApp.
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>É gratuito?</Title>
                <Text>
                  Você pode usar grátis por 3 dias. Depois, planos a partir de
                  R$29,90/mês.
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

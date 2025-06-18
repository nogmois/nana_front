// src/pages/PlanPage.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Badge,
  Grid,
  Modal,
  Spin,
} from "antd";
import {
  CheckOutlined,
  StarFilled,
  HeartFilled,
  SmileOutlined,
} from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import api from "../services/api";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar";

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  {
    key: "starter",
    name: "Plano Básico",
    price: "R$ 29,90",
    period: "por mês",
    priceId: "price_1RYoVKK7rJhyt4vJWM7RiaOQ",
    tagline: "Perfeito para começar e garantir noites mais tranquilas 🌙",
    color: "#FFF7E6",
    benefits: [
      "1 bebê",
      "Alertas por e-mail",
      "Diário ilimitado",
      "Relatórios semanais",
      "Acesso mobile",
      "Notificações push",
      "Backup automático",
    ],
    cta: "Quero testar!",
    emoji: "🍼",
  },
  {
    key: "plus",
    name: "Plano Plus",
    price: "R$ 49,90",
    period: "por mês",
    priceId: "price_1RYoVhK7rJhyt4vJBgMwiLLi",
    tagline: "Completo para acompanhar cada detalhe do seu bebê 💤",
    color: "#E6F7FF",
    benefits: [
      "Até 2 bebês",
      "Alertas por WhatsApp",
      "Relatório PDF diário",
      "Suporte por chat",
      "Exportação CSV",
      "Histórico de 30 dias",
      "Templates de rotina",
    ],
    cta: "Assinar Plus",
    popular: true,
    emoji: "⭐",
  },
];

export default function PlanPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // estado do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState(null);

  // 1. Handler simplificado
  const handleCheckout = (priceId) => {
    setSelectedPriceId(priceId); // define o plano
    setModalOpen(true); // mostra o modal (sempre abre)
  };

  // dispara a lógica de checkout quando o modal abre
  useEffect(() => {
    if (!modalOpen || !selectedPriceId) return;

    (async () => {
      try {
        const { data } = await api.post("/payment/checkout-session", {
          priceId: selectedPriceId,
        });
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });

        // ❌ NÃO feche aqui – o redirect sai da página.
      } catch (error) {
        // Se falhar, aí sim feche para tentar de novo.
        setModalOpen(false);
        setSelectedPriceId(null);
        Modal.error({
          title: "Erro ao iniciar pagamento",
          content:
            "Não conseguimos redirecionar para o Stripe. Tente novamente.",
        });
        console.error(error);
      }
    })();
  }, [modalOpen, selectedPriceId]);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Navbar />

      <Content
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "16px 16px 80px" : "32px",
        }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <HeartFilled style={{ fontSize: 40, color: "#ff4d4f" }} />
          <Title
            level={isMobile ? 3 : 2}
            style={{ marginTop: 8, marginBottom: 0 }}
          >
            Escolha o plano que acolhe o seu coração 💗
          </Title>
          <Text type="secondary">
            Sem contratos. Cancele quando quiser – mas continue dormindo melhor
            😉
          </Text>
        </div>

        {/* Cards de planos */}
        <Row
          gutter={[24, 24]}
          justify="center"
          align="top"
          style={{ flexWrap: "wrap" }}
        >
          {plans.map((plan) => (
            <Col
              key={plan.key}
              flex={isMobile ? "1 1 100%" : "0 0 380px"}
              style={{ display: "flex" }}
            >
              <Badge.Ribbon
                text="Mais popular"
                color="cyan"
                style={{ display: plan.popular ? "block" : "none" }}
              >
                <Card
                  hoverable
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    background: plan.color,
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  bodyStyle={{ padding: isMobile ? 24 : 32, flex: 1 }}
                >
                  {/* Cabeçalho do card */}
                  <div style={{ textAlign: "left", marginBottom: 24 }}>
                    <span style={{ fontSize: 32 }}>{plan.emoji}</span>
                    <Title level={4} style={{ margin: "8px 0 0" }}>
                      {plan.name}
                    </Title>
                    <Text
                      style={{
                        display: "block",
                        fontSize: isMobile ? 28 : 32,
                        fontWeight: 700,
                        margin: "12px 0 4px",
                      }}
                    >
                      {plan.price}{" "}
                      <Text type="secondary" style={{ fontSize: 16 }}>
                        {plan.period}
                      </Text>
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontSize: isMobile ? 14 : 16 }}
                    >
                      {plan.tagline}
                    </Text>
                  </div>

                  {/* Botão de CTA */}
                  <Button
                    type={plan.popular ? "primary" : "default"}
                    size="large"
                    block
                    style={{
                      borderRadius: 8,
                      marginBottom: 24,
                      fontWeight: 600,
                    }}
                    onClick={() => handleCheckout(plan.priceId)}
                  >
                    {plan.cta}
                  </Button>

                  {/* Lista de benefícios */}
                  <ul style={{ paddingLeft: 0, listStyle: "none", flex: 1 }}>
                    {plan.benefits.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 12,
                          fontSize: 14,
                        }}
                      >
                        <CheckOutlined
                          style={{ color: "#52c41a", marginRight: 8 }}
                        />
                        <Text>{b}</Text>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>

        {/* Rodapé curto */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <StarFilled style={{ color: "#faad14" }} />{" "}
          <Text type="secondary">
            Mais de <b>1 200 mamães</b> já estão dormindo melhor com o
            NanaFácil.
          </Text>
        </div>
      </Content>

      <BottomNavbar />

      {/* Modal de carregamento */}
      <Modal
        open={modalOpen}
        footer={null}
        closable={false}
        maskClosable={false}
        centered
        bodyStyle={{ textAlign: "center", padding: "24px" }}
      >
        <SmileOutlined style={{ fontSize: 48, color: "#108ee9" }} />
        <Title level={4} style={{ marginTop: 16 }}>
          Redirecionando para o Stripe...
        </Title>
        <Spin tip="Aguarde" style={{ marginTop: 16 }} />
      </Modal>
    </Layout>
  );
}

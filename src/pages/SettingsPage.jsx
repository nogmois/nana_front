// src/pages/SettingsPage.jsx
import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Layout, Card, Typography, Tag, Space, Button } from "antd";
import Navbar from "../components/Navbar"; // 👈
import SubscriptionInfo from "../components/SubscriptionInfo"; // opcional
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;
const { Title, Text } = Typography;

export default function SettingsPage() {
  /* -------- localStorage -------- */
  const trialEndStr = localStorage.getItem("trialEnd");
  const hasSub = localStorage.getItem("hasSubscription") === "true";
  const planName = localStorage.getItem("planName");
  const priceDisplay = localStorage.getItem("planPrice");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* -------- dias restantes -------- */
  const trialInfo = useMemo(() => {
    if (!trialEndStr) return null;
    const end = dayjs(trialEndStr);
    const diffDays = end.diff(dayjs(), "day");
    return diffDays >= 0
      ? { daysLeft: diffDays, endFormatted: end.format("DD/MM") }
      : null;
  }, [trialEndStr]);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Navbar /> {/* topo fixo */}
      <Content
        style={{
          padding: 24,
          margin: "0 auto 56px",
          width: "100%",
          maxWidth: 1200,
        }}
      >
        {/* se tiver extrações, basta usar <SubscriptionInfo /> aqui */}
        <Title level={3}>Minha Assinatura</Title>

        <Card bordered={false} style={{ borderRadius: 12 }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {hasSub ? (
              <>
                <Text>Plano atual:</Text>
                <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                  {planName || "Indefinido"}{" "}
                  {priceDisplay && (
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      {priceDisplay}/mês
                    </Tag>
                  )}
                </Title>
              </>
            ) : (
              <Text>Você ainda não tem assinatura ativa.</Text>
            )}

            {trialInfo ? (
              <Text type="secondary">
                Seu teste gratuito expira em{" "}
                <b>
                  {trialInfo.daysLeft}{" "}
                  {trialInfo.daysLeft === 1 ? "dia" : "dias"}
                </b>{" "}
                (até {trialInfo.endFormatted}).
              </Text>
            ) : !hasSub ? (
              <Text type="danger">
                O período de teste acabou — escolha um plano para continuar.
              </Text>
            ) : null}
          </Space>
          <Button
            type="primary"
            onClick={() => navigate("/plans")}
            style={{ marginTop: 16 }}
          >
            Gerenciar assinatura
          </Button>
        </Card>

        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ marginTop: 24 }}
        >
          Sair
        </Button>

        {/* …outros blocos de configurações abaixo… */}
      </Content>
    </Layout>
  );
}

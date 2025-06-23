// src/pages/login/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Typography,
  message,
  Grid,
  Space,
} from "antd";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function LoginPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já tem token, pula direto
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  // Captura ?token= na URL (caso venha)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [location, navigate]);

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const {
        access_token,
        user_id,
        stripe_customer_id,
        has_active_subscription,
        trial_active,
        trial_end,
      } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", String(user_id));
      localStorage.setItem("stripe_customer_id", stripe_customer_id);
      localStorage.setItem(
        "hasSubscription",
        has_active_subscription ? "true" : "false"
      );
      localStorage.setItem("trialActive", trial_active ? "true" : "false");
      localStorage.setItem("trialEnd", trial_end);

      navigate("/dashboard");
    } catch (err) {
      message.error(err.response?.data?.detail || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Row style={{ minHeight: "100vh" }}>
      <Col xs={0} md={14}>
        <div
          style={{
            height: "100%",
            background:
              "linear-gradient(135deg,#e6f7ff 0%,#bae7ff 50%,#fff0f6 100%)",
          }}
        />
      </Col>

      <Col
        xs={24}
        md={10}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "64px 4px" : 0,
        }}
      >
        <Card
          bordered={false}
          style={{
            width: isMobile ? "100%" : 440,
            maxWidth: 440,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            borderRadius: 16,
            padding: isMobile ? "12px 0px" : 32,
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
            Entrar
          </Title>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                size="large"
              />

              <Input.Password
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                size="large"
              />

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <Text type="secondary">
                  Não tem conta?{" "}
                  <a onClick={() => !loading && navigate("/register")}>
                    Cadastre-se
                  </a>
                </Text>
              </div>

              <Button
                type="primary"
                block
                htmlType="submit" // isso permite que Enter funcione
                loading={loading}
                disabled={loading}
                size="large"
              >
                Entrar
              </Button>
            </Space>
          </form>

          {/* Link simples para Home */}
          <Button
            type="link"
            block
            style={{ marginTop: 12, textAlign: "center" }}
            onClick={() => navigate("/")}
          >
            Voltar à Home
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

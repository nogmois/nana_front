// src/pages/login/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Form,
  Checkbox,
} from "antd";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export default function RegisterPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /** fluxo: cadastro → login → onboarding */
  async function handleRegister(values) {
    const { email, password } = values;
    setLoading(true);
    try {
      // 1) cria usuário
      await api.post("/auth/cadastro", { email, password });

      // Dispara o evento de conversão do Google Ads
      if (window.gtag_report_conversion) {
        window.gtag_report_conversion();
      }

      // 2) login automático
      const res = await api.post("/auth/login", { email, password });
      const {
        access_token,
        user_id,
        stripe_customer_id,
        has_active_subscription,
        trial_active,
        trial_end,
      } = res.data;

      // 3) persiste no storage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", String(user_id));
      localStorage.setItem("stripe_customer_id", stripe_customer_id);
      localStorage.setItem(
        "hasSubscription",
        has_active_subscription ? "true" : "false"
      );
      localStorage.setItem("trialActive", trial_active ? "true" : "false");
      localStorage.setItem("trialEnd", trial_end);

      message.success("Conta criada! Bem-vinda(o) 😉");
      navigate("/onboarding");
    } catch (err) {
      message.error(err.response?.data?.detail || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* Lado esquerdo (imagem ou gradiente) */}
      <Col xs={0} md={14}>
        <div
          style={{
            height: "100%",
            background:
              "linear-gradient(135deg,#fff0f6 0%,#ffd6e7 50%,#e6f7ff 100%)",
          }}
        />
      </Col>

      {/* Lado direito (form) */}
      <Col
        xs={24}
        md={10}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "64px 24px" : 0,
        }}
      >
        <Card
          bordered={false}
          style={{
            width: isMobile ? "100%" : 440,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            borderRadius: 12,
            padding: 32,
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
            Criar conta
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                { required: true, message: "Informe o e-mail" },
                { type: "email", message: "E-mail inválido" },
              ]}
            >
              <Input placeholder="exemplo@dominio.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              rules={[
                { required: true, message: "Informe a senha" },
                {
                  pattern: PASSWORD_REGEX,
                  message:
                    "Mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Senha forte" />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirmar senha"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Confirme a senha" },
                ({ getFieldValue }) => ({
                  validatoar(_, value) {
                    return value && value === getFieldValue("password")
                      ? Promise.resolve()
                      : Promise.reject("As senhas não coincidem");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Repita a senha" />
            </Form.Item>

            {/* Checkbox de aceitação de termos */}
            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Você deve aceitar os Termos de Uso")
                        ),
                },
              ]}
            >
              <Checkbox>
                Li e aceito os <Link to="/terms">Termos de Uso</Link> e a{" "}
                <Link to="/privacy">Política de Privacidade</Link>
              </Checkbox>
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? "Criando…" : "Cadastrar"}
            </Button>
          </Form>

          {/* Link simples para Home */}
          <Button
            type="link"
            block
            style={{ marginTop: 12, textAlign: "center" }}
            onClick={() => navigate("/")}
          >
            Voltar à Home
          </Button>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Typography.Text type="secondary">
              Já tem conta? <a onClick={() => navigate("/login")}>Entrar</a>
            </Typography.Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

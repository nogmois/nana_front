// src/pages/SuccessPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Row, Col, Typography, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Dispara o evento de conversão de pagamento
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16946148296/Yo1ECPm0xbAaEMjnxpA_",
        transaction_id: "", // opcional, preencha se tiver um ID de transação
      });
    }

    // (Opcional) redireciona automaticamente após X segundos
    // const timer = setTimeout(() => navigate("/dashboard"), 5000);
    // return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh", textAlign: "center" }}>
      <Content style={{ padding: "100px 24px" }}>
        <Row justify="center" gutter={[0, 24]}>
          <Col>
            <CheckCircleOutlined style={{ fontSize: 72, color: "#52c41a" }} />
          </Col>
          <Col>
            <Title level={2}>Pagamento realizado com sucesso!</Title>
            <Paragraph>
              Obrigado por assinar o NanaFácil. Sua assinatura foi ativada e
              você já pode acessar todos os recursos exclusivos.
            </Paragraph>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/dashboard")}
            >
              Ir para o Dashboard
            </Button>
          </Col>
          <Col>
            <Paragraph type="secondary">
              Se não for redirecionado em alguns segundos, clique no botão
              acima.
            </Paragraph>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

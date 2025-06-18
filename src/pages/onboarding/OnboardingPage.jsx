// src/pages/onboarding/OnboardingPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Typography,
  Row,
  Col,
  Card,
  message,
} from "antd";
import "dayjs/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";
import api from "../../services/api";
import "./OnboardingPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const GENDER_OPTIONS = [
  { label: "Menino", value: "male", emoji: "👦" },
  { label: "Menina", value: "female", emoji: "👧" },
];

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const selectedGender = Form.useWatch("gender", form);

  const handleCreateBaby = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birth_date: values.birth_date.format("YYYY-MM-DD"),
        birth_weight_grams: parseInt(values.birth_weight_grams, 10),
      };
      await api.post("/babies", payload);
      message.success("Bebê cadastrado com sucesso!");
      navigate("/dashboard");
    } catch {
      message.error("Erro ao cadastrar bebê.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="onboarding-layout">
      <Content className="onboarding-content">
        <Title level={2} className="onboarding-title">
          Primeiro Passo: Cadastre seu Bebê
        </Title>
        <Text type="secondary" className="onboarding-subtitle">
          Para começar a monitorar, conte-nos quem é seu bebê e seus dados.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateBaby}
          initialValues={{ gender: "male" }}
          className="onboarding-form"
        >
          {/* Gênero */}
          <Form.Item
            name="gender"
            label="Sexo do Bebê"
            rules={[{ required: true, message: "Selecione o sexo" }]}
          >
            <Row gutter={24} justify="center">
              {GENDER_OPTIONS.map((opt) => (
                <Col key={opt.value} xs={24} md={8}>
                  <Card
                    hoverable
                    className={`gender-card ${
                      selectedGender === opt.value ? "selected" : ""
                    }`}
                    onClick={() => form.setFieldsValue({ gender: opt.value })}
                  >
                    <div className="gender-emoji">{opt.emoji}</div>
                    <div className="gender-label">{opt.label}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form.Item>

          {/* Campos principais em três colunas */}
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="name"
                label="Nome do Bebê"
                rules={[{ required: true, message: "Insira o nome do bebê" }]}
              >
                <Input
                  placeholder="Ex: Alice"
                  size="large"
                  className="onboarding-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="birth_date"
                label="Data de Nascimento"
                rules={[{ required: true, message: "Selecione a data" }]}
              >
                <DatePicker
                  locale={locale}
                  style={{ width: "100%" }}
                  size="large"
                  className="onboarding-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="birth_weight_grams"
                label="Peso ao Nascer (g)"
                rules={[{ required: true, message: "Informe o peso" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1000}
                  max={6000}
                  placeholder="Ex: 3200"
                  size="large"
                  stringMode
                  formatter={(value) => value?.replace(/\D/g, "")}
                  parser={(value) => value?.replace(/\D/g, "")}
                  className="onboarding-input"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Botão */}
          <Form.Item>
            <Button
              className="onboarding-submit"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Cadastrar Bebê
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}

// src/components/modal/BabyModal.jsx
import React from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Typography,
} from "antd";
import { HeartTwoTone, GiftTwoTone } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/pt_BR";

export default function BabyModal({ open, onCancel, onCreate, loading }) {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Cadastrar Bebê
        </Button>,
      ]}
      centered
      width={520}
      bodyStyle={{
        backgroundColor: "#fff0f6",
        borderRadius: 8,
        padding: "24px",
      }}
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <HeartTwoTone
            twoToneColor="#eb2f96"
            style={{ fontSize: 26, marginRight: 10 }}
          />
          <span style={{ fontSize: 22, fontWeight: 500 }}>
            Bem-vinda, Mamãe!
          </span>
        </div>
      }
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Typography.Text type="secondary">
          Preencha os dados do seu bebê para começarmos!
        </Typography.Text>
      </div>
      <Form form={form} layout="vertical" onFinish={onCreate}>
        <Form.Item
          name="name"
          label="Nome do Bebê"
          rules={[
            { required: true, message: "Por favor, insira o nome do bebê." },
          ]}
        >
          <Input
            placeholder="Ex: Alice"
            size="large"
            prefix={<GiftTwoTone />}
          />
        </Form.Item>
        <Form.Item
          name="birth_date"
          label="Data de Nascimento"
          rules={[
            { required: true, message: "Selecione a data de nascimento." },
          ]}
        >
          <DatePicker locale={locale} style={{ width: "100%" }} size="large" />
        </Form.Item>
        <Form.Item
          name="birth_weight_grams"
          label="Peso ao Nascer"
          rules={[{ required: true, message: "Informe o peso ao nascer." }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1000}
            max={6000}
            placeholder="3200 g"
            size="large"
            formatter={(v) => `${v} g`}
            parser={(v) => v?.replace(" g", "")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

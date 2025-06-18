import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Card, Typography, Tag, Space } from "antd";

const { Title, Text } = Typography;

export default function SubscriptionInfo() {
  /* --- dados vindos do login / checkout --- */
  const trialEndStr = localStorage.getItem("trialEnd");
  const hasSub = localStorage.getItem("hasSubscription") === "true";
  const planName = localStorage.getItem("planName");
  const priceDisplay = localStorage.getItem("planPrice");

  /* --- calcula dias restantes do trial --- */
  const trialInfo = useMemo(() => {
    if (!trialEndStr) return null;
    const end = dayjs(trialEndStr);
    const diffDays = end.diff(dayjs(), "day");
    return diffDays >= 0
      ? { daysLeft: diffDays, endFormatted: end.format("DD/MM") }
      : null;
  }, [trialEndStr]);

  return (
    <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {/* Plano atual */}
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

        {/* Trial */}
        {trialInfo ? (
          <Text type="secondary">
            Seu teste gratuito expira em{" "}
            <b>
              {trialInfo.daysLeft} {trialInfo.daysLeft === 1 ? "dia" : "dias"}
            </b>{" "}
            (até {trialInfo.endFormatted}).
          </Text>
        ) : !hasSub ? (
          <Text type="danger">
            O período de teste acabou — escolha um plano para continuar.
          </Text>
        ) : null}
      </Space>
    </Card>
  );
}

// src/pages/ReviewPage.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Avatar,
  Spin,
  message,
  Grid,
  Space,
  Button,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { groupBy } from "lodash";
import Navbar from "../components/Navbar";

// Configura locale do dayjs
dayjs.locale("pt-br");

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const COR_PRIMARIA = "#1890ff";
const COR_FUNDO = "#f0f2f5";
const CARD_SHADOW = "0 4px 12px rgba(0,0,0,0.05)";
const SECTION_GAP = 24;

export default function ReviewPage() {
  const diasRef = useRef(null);
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  const ICON_SZ = isMobile ? 22 : 26;
  const VALUE_SZ = isMobile ? 16 : 20;
  const DIVIDER_H = isMobile ? 48 : 60;

  const navigate = useNavigate();
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const hojeStr = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(hojeStr);

  // Gera lista dos últimos 7 dias
  const ultimos7Dias = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        dayjs()
          .subtract(6 - i, "day")
          .format("YYYY-MM-DD")
      ),
    []
  );
  const diasKey = ultimos7Dias.join();

  // Busca bebês do usuário
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/babies/me");
        setBabies(data);
        if (data.length) setSelectedBabyId(data[0].id);
      } catch {
        message.error("Erro ao buscar bebês. Faça login novamente.");
      }
    })();
  }, []);

  // Busca eventos do bebê selecionado
  useEffect(() => {
    if (!selectedBabyId) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/events?baby_id=${selectedBabyId}`);
        setEvents(data);
      } catch {
        message.error("Erro ao buscar eventos.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedBabyId]);

  // Scroll automático no mobile para mostrar dias mais recentes
  useEffect(() => {
    if (isMobile && diasRef.current) {
      diasRef.current.scrollLeft =
        diasRef.current.scrollWidth - diasRef.current.clientWidth;
    }
  }, [isMobile, diasKey]);

  // Filtra eventos dos últimos 7 dias
  const eventos7d = events.filter((e) =>
    ultimos7Dias.includes(dayjs(e.timestamp).format("YYYY-MM-DD"))
  );
  const agrupados = groupBy(eventos7d, (e) =>
    dayjs(e.timestamp).format("YYYY-MM-DD")
  );
  const eventosDia = (agrupados[selectedDate] || []).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Calcula resumo de alimentação e sono
  const resumo = React.useMemo(() => {
    let feeds = 0;
    let sleepTotal = 0;
    let longest = 0;
    let lastStart = null;

    // Cópia em ordem crescente para o cálculo
    const eventosOrdenados = [...eventosDia].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    eventosOrdenados.forEach((e) => {
      if (e.type === "sleep_start") lastStart = dayjs(e.timestamp);
      else if (e.type === "sleep_end" && lastStart) {
        const mins = dayjs(e.timestamp).diff(lastStart, "minute");
        sleepTotal += mins;
        longest = Math.max(longest, mins);
        lastStart = null;
      } else if (e.type === "feed") feeds += 1;
    });

    return { feeds, sleepTotal, longest };
  }, [eventosDia]);

  const fmtMinutes = (m) =>
    m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;

  const mapTipo = {
    feed: { icon: "🍼", label: "Mamou" },
    sleep_start: { icon: "💤", label: "Dormiu" },
    sleep_end: { icon: "🌞", label: "Acordou" },
  };

  const selectedBaby = babies.find((b) => b.id === selectedBabyId) || {};

  // Gera PDF usando jsPDF + autoTable
  const handleGeneratePDF = useCallback(() => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const formattedDate = dayjs(selectedDate).format("DD/MM/YYYY");

    doc.setFontSize(16);
    doc.text(`Relatório diário - ${selectedBaby.name || "Bebê"}`, 40, 40);
    doc.setFontSize(12);
    doc.text(`Data: ${formattedDate}`, 40, 60);
    if (selectedBaby.birthDate) {
      const ageMonths = dayjs(selectedDate).diff(
        dayjs(selectedBaby.birthDate),
        "month"
      );
      doc.text(`Idade: ${ageMonths} meses`, 40, 80);
    }

    doc.text("Resumo:", 40, 110);
    doc.text(`• Alimentações: ${resumo.feeds}`, 60, 130);
    doc.text(`• Sono total: ${fmtMinutes(resumo.sleepTotal)}`, 60, 150);
    doc.text(`• Maior soneca: ${fmtMinutes(resumo.longest)}`, 60, 170);

    const head = [["Hora", "Evento", "Observação"]];
    const body = eventosDia.map((e) => [
      dayjs(e.timestamp).format("HH:mm"),
      mapTipo[e.type]?.label || e.type,
      e.note || "-",
    ]);

    autoTable(doc, {
      startY: 200,
      head,
      body,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      theme: "striped",
    });

    doc.save(`relatorio_${selectedBaby.name || "bebe"}_${selectedDate}.pdf`);
  }, [eventosDia, resumo, selectedDate, selectedBaby]);

  return (
    <Layout style={{ minHeight: "100vh", background: COR_FUNDO }}>
      <Navbar />
      <Content
        style={{
          padding: isMobile ? 16 : 24,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto 56px",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
              Eventos
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              shape="round"
              style={{ background: COR_PRIMARIA, borderColor: COR_PRIMARIA }}
              onClick={handleGeneratePDF}
            >
              Gerar PDF
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Spin tip="Carregando eventos…" />
          </div>
        ) : (
          <>
            {/* Barra de dias */}
            <div
              ref={diasRef}
              style={{
                whiteSpace: "nowrap",
                overflowX: "auto",
                marginBottom: SECTION_GAP,
              }}
            >
              <div style={{ display: "inline-flex", gap: 8 }}>
                {ultimos7Dias.map((dia) => {
                  const sel = dia === selectedDate;
                  const hoje = dia === hojeStr;
                  const side = isMobile ? 52 : 64;
                  const num = String(dayjs(dia).date()).padStart(2, "0");
                  return (
                    <Card
                      key={dia}
                      hoverable
                      size="small"
                      onClick={() => setSelectedDate(dia)}
                      style={{
                        width: side,
                        height: side,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                        background: sel ? COR_PRIMARIA : "#fff",
                        cursor: "pointer",
                        boxShadow: sel
                          ? CARD_SHADOW
                          : "0 1px 3px rgba(0,0,0,0.04)",
                        padding: 0,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: sel ? "#fff" : "#333",
                        }}
                      >
                        {hoje ? "Hoje" : num}
                      </Text>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Resumo */}
            <Card
              style={{
                borderRadius: 12,
                padding: isMobile ? 12 : 16,
                boxShadow: CARD_SHADOW,
                marginBottom: SECTION_GAP,
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Row justify="space-between" align="middle">
                {[
                  { icon: "🍼", label: "Alimentação", value: resumo.feeds },
                  {
                    icon: "😴",
                    label: "Sono total",
                    value: fmtMinutes(resumo.sleepTotal),
                  },
                  {
                    icon: "⏱",
                    label: "Maior soneca",
                    value: fmtMinutes(resumo.longest),
                  },
                ].map((b, i) => (
                  <React.Fragment key={b.label}>
                    <Col flex="1 0 0" style={{ textAlign: "center" }}>
                      <div style={{ fontSize: ICON_SZ, marginBottom: 4 }}>
                        {b.icon}
                      </div>
                      <Text type="secondary">{b.label}</Text>
                      <div style={{ fontSize: VALUE_SZ, fontWeight: 600 }}>
                        {b.value}
                      </div>
                    </Col>
                    {i < 2 && (
                      <Divider
                        type="vertical"
                        style={{ height: DIVIDER_H, marginInline: 0 }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Row>
            </Card>

            {/* Título do dia */}
            <Text strong style={{ fontSize: 18 }}>
              {dayjs(selectedDate).format("dddd, DD/MM/YYYY")}
            </Text>

            {/* Lista de eventos */}
            {eventosDia.length === 0 ? (
              <Card
                size="small"
                style={{
                  borderRadius: 12,
                  marginTop: 12,
                  textAlign: "center",
                  boxShadow: CARD_SHADOW,
                }}
              >
                <Text type="secondary">Nenhum evento neste dia.</Text>
              </Card>
            ) : (
              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: 16 }}
              >
                {eventosDia.map((e) => {
                  const { icon, label } = mapTipo[e.type] || {
                    icon: "📌",
                    label: e.type,
                  };
                  return (
                    <Card
                      key={e.id}
                      size="small"
                      bodyStyle={{ padding: 0 }}
                      style={{
                        borderRadius: 12,
                        padding: isMobile ? "8px 12px" : "12px 16px",
                        boxShadow: CARD_SHADOW,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          style={{
                            background: "#e6f7ff",
                            color: COR_PRIMARIA,
                            marginRight: 16,
                            fontSize: 20,
                          }}
                        >
                          {icon}
                        </Avatar>
                        <div>
                          <Text style={{ color: "#888", fontSize: 14 }}>
                            {dayjs(e.timestamp).format("HH:mm")}
                          </Text>
                          <div style={{ fontSize: 16, fontWeight: 600 }}>
                            {label}
                          </div>
                          {e.note && (
                            <Text style={{ fontSize: 14, color: "#666" }}>
                              {e.note}
                            </Text>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </Space>
            )}
          </>
        )}
      </Content>
    </Layout>
  );
}

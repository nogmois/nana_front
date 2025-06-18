// src/pages/ChartsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Layout,
  Typography,
  Card,
  message,
  Grid,
  Row,
  Col,
  Segmented,
} from "antd";
import { CoffeeOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar";
import api from "../services/api";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* -------------------------------------------------------------------------- */
/* CONFIG GERAL                                                               */
/* -------------------------------------------------------------------------- */
dayjs.locale("pt-br");
const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const cardShadow = "0 4px 12px rgba(0,0,0,0.05)";
const sectionGap = 24;

// Tooltip compacto para os gráficos empilhados (pattern)
const renderPatternTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  // mantém só as barras com valor > 0
  const valid = payload.filter((p) => p.value > 0);
  if (!valid.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #d9d9d9",
        borderRadius: 4,
        padding: "4px 8px",
        fontSize: 12,
      }}
    >
      <strong>{label}</strong>
      {valid.map((item) => (
        <div key={item.name}>
          {item.name} h: <b>{item.value}</b>
        </div>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* COMPONENTE                                                                 */
/* -------------------------------------------------------------------------- */
export default function ChartsPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  /* -------------------------------------------------------- estado & fetch */
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("feed");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/babies/me");
        setBabies(data);
        if (data.length) setSelectedBabyId(data[0].id);
      } catch {
        message.error("Erro ao buscar bebês.");
      }
    })();
  }, []);

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

  /* -------------------------------------------------------------- helpers */
  const last7Days = useMemo(
    () =>
      [...Array(7)].map((_, i) =>
        dayjs()
          .subtract(6 - i, "day")
          .format("YYYY-MM-DD")
      ),
    []
  );

  /* --------------------------- feed volume (barras) + média */
  const feedVolumeData = useMemo(
    () =>
      last7Days.map((d) => ({
        date: dayjs(d).format("DD/MM"),
        alimentacao: events.filter(
          (e) =>
            e.type === "feed" && dayjs(e.timestamp).format("YYYY-MM-DD") === d
        ).length,
      })),
    [events, last7Days]
  );
  const feedAvg = useMemo(() => {
    const total = feedVolumeData.reduce((s, d) => s + d.alimentacao, 0);
    return total > 0 ? (total / 7).toFixed(1) : "0";
  }, [feedVolumeData]);

  /* --------------------------- feed pattern (empilhado 24h) */
  const feedPatternGrouped = useMemo(() => {
    const pattern = last7Days.flatMap((dateStr) =>
      events
        .filter(
          (e) =>
            e.type === "feed" &&
            dayjs(e.timestamp).format("YYYY-MM-DD") === dateStr
        )
        .map((e) => ({
          dia: dayjs(dateStr).format("dd"),
          hora: parseInt(dayjs(e.timestamp).format("H"), 10),
        }))
    );

    return last7Days.map((d) => {
      const diaLabel = dayjs(d).format("dd");
      const counts = Array.from({ length: 24 }, (_, h) => ({
        h,
        count: pattern.filter((p) => p.dia === diaLabel && p.hora === h).length,
      }));
      return {
        dia: diaLabel,
        ...Object.fromEntries(counts.map((c) => [c.h, c.count])),
      };
    });
  }, [events, last7Days]);

  /* --------------------------- sessões de sono, volume ------------------ */
  const sleepSessions = useMemo(() => {
    const ordered = events
      .filter((e) => ["sleep_start", "sleep_end"].includes(e.type))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const out = [];
    let start = null;
    ordered.forEach((evt) => {
      if (evt.type === "sleep_start") start = evt;
      if (evt.type === "sleep_end" && start) {
        const min = dayjs(evt.timestamp).diff(dayjs(start.timestamp), "minute");
        if (min > 0)
          out.push({
            date: dayjs(start.timestamp).format("YYYY-MM-DD"),
            minutes: min,
          });
        start = null;
      }
    });
    return out;
  }, [events]);

  const sleepVolumeData = useMemo(
    () =>
      last7Days.map((d) => ({
        date: dayjs(d).format("DD/MM"),
        hours: (
          sleepSessions
            .filter((s) => s.date === d)
            .reduce((s, x) => s + x.minutes, 0) / 60
        ).toFixed(1),
      })),
    [sleepSessions, last7Days]
  );

  /* -------- média de sono em minutos inteiros + formatação h & min ------ */
  const sleepAvgMin = useMemo(
    () =>
      Math.round(
        (sleepVolumeData.reduce((s, d) => s + parseFloat(d.hours), 0) / 7) * 60
      ),
    [sleepVolumeData]
  );

  const sleepAvgHm = useMemo(() => {
    if (sleepAvgMin < 60) return `${sleepAvgMin} min`;
    const h = Math.floor(sleepAvgMin / 60);
    const m = sleepAvgMin % 60;
    return `${h} h ${m} min`;
  }, [sleepAvgMin]);

  /* --------------------------- sleep pattern (empilhado 24h) */
  const sleepPatternGrouped = useMemo(() => {
    const pattern = last7Days.flatMap((dateStr) =>
      events
        .filter(
          (e) =>
            e.type === "sleep_start" &&
            dayjs(e.timestamp).format("YYYY-MM-DD") === dateStr
        )
        .map((e) => ({
          dia: dayjs(dateStr).format("dd"),
          hora: parseInt(dayjs(e.timestamp).format("H"), 10),
        }))
    );

    return last7Days.map((d) => {
      const diaLabel = dayjs(d).format("dd");
      const counts = Array.from({ length: 24 }, (_, h) => ({
        h,
        count: pattern.filter((p) => p.dia === diaLabel && p.hora === h).length,
      }));
      return {
        dia: diaLabel,
        ...Object.fromEntries(counts.map((c) => [c.h, c.count])),
      };
    });
  }, [events, last7Days]);

  /* ----------------------------------------------------------- layout util */
  const gutter = isMobile ? [0, 16] : [24, 24]; // [horizontal, vertical]

  /* ---------------------------------------------------------------------- */
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />

      <Content
        style={{
          padding: isMobile ? "16px 12px 80px" : "32px 24px 80px",
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          overflowX: "hidden",
        }}
      >
        {/* ---------------------------------------------------- bebê cards */}
        <Row gutter={gutter} style={{ marginBottom: sectionGap }}>
          {babies.map((b) => {
            const ageYears = dayjs().diff(dayjs(b.birth_date), "year");
            const ageMonths = dayjs().diff(
              dayjs(b.birth_date).add(ageYears, "year"),
              "month"
            );
            const babyEmoji = b.gender === "male" ? "👦" : "👧";
            const coverBg =
              b.gender === "male"
                ? "linear-gradient(135deg,#e6f7ff 0%,#bae7ff 100%)"
                : "linear-gradient(135deg,#fff0f6 0%,#ffd6e7 100%)";
            const isSelected = selectedBabyId === b.id;

            return (
              <Col xs={24} key={b.id}>
                <Card
                  hoverable
                  onClick={() => setSelectedBabyId(b.id)}
                  bordered={false}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    boxShadow: isSelected
                      ? `0 0 0 2px ${
                          b.gender === "male" ? "#1890ff" : "#ff80bf"
                        } inset`
                      : cardShadow,
                    overflow: "hidden",
                  }}
                  cover={
                    <div
                      style={{
                        height: 200,
                        background: coverBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: isMobile ? 56 : 72 }}>
                        {babyEmoji}
                      </span>
                    </div>
                  }
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
                      {b.name}
                    </Title>
                    <Text type="secondary">
                      {ageYears}a {ageMonths}m
                    </Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* ------------------------------------------------------- métricas */}
        <Row gutter={gutter} style={{ marginBottom: sectionGap }}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{ boxShadow: cardShadow, borderRadius: 12 }}
              bodyStyle={{ padding: 16, display: "flex", alignItems: "center" }}
            >
              <CoffeeOutlined
                style={{ fontSize: 32, marginRight: 16, color: "#ff69b4" }}
              />
              <div>
                <Text type="secondary">Média de Alimentações</Text>
                <Title level={3}>{feedAvg} / dia</Title>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{ boxShadow: cardShadow, borderRadius: 12 }}
              bodyStyle={{ padding: 16, display: "flex", alignItems: "center" }}
            >
              <ClockCircleOutlined
                style={{ fontSize: 32, marginRight: 16, color: "#69b3ff" }}
              />
              <div>
                <Text type="secondary">Média de Sono</Text>
                <Title level={3}>{sleepAvgHm} / dia</Title>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ------------------------------------------------------- toggle */}
        <Segmented
          options={[
            { label: "Alimentação", value: "feed" },
            { label: "Sono", value: "sleep" },
          ]}
          value={viewMode}
          onChange={setViewMode}
          style={{ marginBottom: sectionGap }}
        />

        {/* ------------------------------------------------------- gráficos */}
        <Row gutter={gutter}>
          {/* volume */}
          <Col xs={24} md={12}>
            <Card
              style={{ boxShadow: cardShadow, borderRadius: 12 }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ padding: 16 }}>
                <Text strong>
                  {viewMode === "feed"
                    ? "Volume de Alimentação"
                    : "Tempo de Sono"}
                </Text>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={viewMode === "feed" ? feedVolumeData : sleepVolumeData}
                  margin={{ top: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val) => {
                      if (viewMode === "feed") return val;
                      const minutes = Math.round(parseFloat(val) * 60);
                      const h = Math.floor(minutes / 60);
                      const m = minutes % 60;
                      return `${h}h ${m}m`;
                    }}
                  />
                  <Bar
                    dataKey={viewMode === "feed" ? "alimentacao" : "hours"}
                    fill={viewMode === "feed" ? "#ff69b4" : "#69b3ff"}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* padrão (empilhado 24h) */}
          <Col xs={24} md={12}>
            <Card
              style={{ boxShadow: cardShadow, borderRadius: 12 }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ padding: 16 }}>
                <Text strong>
                  {viewMode === "feed" ? "Padrão Alimentação" : "Padrão Sono"}
                </Text>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={
                    viewMode === "feed"
                      ? feedPatternGrouped
                      : sleepPatternGrouped
                  }
                  margin={{ top: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />

                  {/* tooltip totalmente customizado */}
                  <Tooltip
                    wrapperStyle={{ outline: "none" }} // remove borda azul do foco
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;

                      // apenas valores > 0
                      const valid = payload.filter((p) => p.value > 0);
                      if (!valid.length) return null;

                      return (
                        <div
                          style={{
                            background: "#fff",
                            border: "1px solid #d9d9d9",
                            borderRadius: 6,
                            padding: "6px 8px",
                            fontSize: 12,
                            maxWidth: 140,
                            maxHeight: 160,
                            overflowY: "auto",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        >
                          <strong style={{ display: "block", marginBottom: 4 }}>
                            {label}
                          </strong>
                          {valid.map((item) => (
                            <div
                              key={item.name}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: item.color || "#000",
                                  marginRight: 4,
                                }}
                              />
                              {String(item.name).padStart(2, "0")}:00 —{" "}
                              <b>{item.value}</b>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />

                  {Array.from({ length: 24 }, (_, i) => (
                    <Bar
                      key={i}
                      dataKey={String(i)}
                      stackId="a"
                      radius={i === 23 ? [6, 6, 0, 0] : 0}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

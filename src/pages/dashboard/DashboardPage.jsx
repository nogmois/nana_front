// src/pages/DashboardPage.jsx

import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import ptBR from "antd/lib/locale/pt_BR";
import {
  Row,
  Col,
  Card,
  Typography,
  Layout,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  TimePicker,
  Grid,
  Space,
  message,
  Tag,
  Popover,
  Tour,
  ConfigProvider,
  Descriptions,
} from "antd";
import { PlusCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import BabyCardWithArc from "../../components/BabyCardWithArc";
import { logout } from "../../utils/auth";

// --- SVG arc helpers ---
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const p1 = polarToCartesian(cx, cy, r, endAngle);
  const p2 = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return [`M`, p1.x, p1.y, `A`, r, r, 0, largeArcFlag, 0, p2.x, p2.y].join(` `);
}

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Configurações dos três tipos de evento
const TYPE_OPTIONS = [
  { value: "sleep_start", label: "Dormiu", icon: "💤" },
  { value: "sleep_end", label: "Acordou", icon: "🌞" },
  { value: "feed", label: "Mamou", icon: "🍼" },
];

const DashboardPage = () => {
  const [babies, setBabies] = useState([]);
  const [events, setEvents] = useState([]);
  const [plan, setPlan] = useState(null);
  const [reportsHistory, setReportsHistory] = useState([]);

  const [selectedBabyId, setSelectedBabyId] = useState(null);

  const [tourOpen, setTourOpen] = useState(false);

  const [showBabyModal, setShowBabyModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const hasSubscription = localStorage.getItem("hasSubscription") === "true";

  const canAddBaby = hasSubscription || babies.length === 0;

  const [babyForm] = Form.useForm();
  const [eventForm] = Form.useForm();
  const [selectedType, setSelectedType] = useState(null);

  const [nextNap, setNextNap] = useState(null);
  const [nextFeed, setNextFeed] = useState(null);

  const [openEventFor, setOpenEventFor] = useState(null);

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Filtrar eventos por período (1 = hoje, 7, 15, 30 dias)

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const isDesktop = screens.md;

  const tourLocale = {
    ...ptBR,
    Tour: {
      ...ptBR.Tour,
      finish: "Entendi",
    },
  };
  const now = new Date();
  // Se plan.naps existir, usamos o end da última soneca para determinar expiração
  const napEnd =
    plan && plan.naps && plan.naps.length > 0
      ? new Date(plan.naps[plan.naps.length - 1].end)
      : null;
  const isPlanExpired = napEnd && now > napEnd;
  const ROW_STYLES = {
    feed: { bg: "#FDEEF3", pillBg: "#F8D9E6", pillColor: "#D7266B" },
    sleep_start: { bg: "#E5F4FF", pillBg: "#D0EBFF", pillColor: "#0050B3" },
    sleep_end: { bg: "#EAFBF1", pillBg: "#D6F8E4", pillColor: "#389E0D" },
  };

  const baseRow = {
    display: "flex",
    alignItems: "center",
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 12,
  };

  const iconPill = {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    marginRight: 12,
  };

  const titleTxt = { fontSize: 16, fontWeight: 600 };
  const subtitleTxt = { fontSize: 14, color: "#666" };
  const dividerStyle = {
    width: 1,
    height: 28,
    background: "#d9d9d9",
    margin: "0 16px",
  };
  // Carrega a lista de bebês na montagem
  useEffect(() => {
    fetchBabies();
  }, []);

  // Sempre que selecionar um bebê, refaz planos, eventos e histórico de reports
  useEffect(() => {
    if (selectedBabyId) {
      fetchEvents(selectedBabyId);
      fetchPlan(selectedBabyId);
      fetchReportsHistory(selectedBabyId);
    }
  }, [selectedBabyId]);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("tourShown") === "true";
    const hasNoEvents =
      selectedBabyId &&
      events.filter((e) => e.baby_id === selectedBabyId).length === 0;

    if (!alreadyShown && hasNoEvents) {
      setTourOpen(true);
      localStorage.setItem("tourShown", "true");
    }
  }, [events, selectedBabyId]);

  // 1) Seleciona um bebê (atualiza plan & events & history)
  const handleSelectBaby = (babyId) => {
    setSelectedBabyId(babyId);
  };

  const tourSteps = [
    {
      title: "Registrar seu primeiro evento",
      description:
        "Clique neste ícone de relógio para marcar quando seu bebê dormiu, acordou ou mamou.",
      target: () => document.querySelector(".clock-tip"),
      placement: "bottom",
    },
  ];

  // 2) Abre o modal de evento para o bebê selecionado
  const handleOpenEventModal = (babyId) => {
    setSelectedBabyId(babyId);
    eventForm.setFieldsValue({
      baby_id: babyId,
      timestamp: dayjs(), // hora padrão para agora
    });
    setSelectedType(null);
    setShowEventModal(true);
  };

  const fetchBabies = async () => {
    try {
      const res = await api.get("/babies/me");
      setBabies(res.data);
      if (res.data.length > 0) {
        const primeiroBabyId = res.data[0].id;
        setSelectedBabyId(primeiroBabyId);
      }
    } catch {
      logout();
    }
  };

  const fetchEvents = async (babyId) => {
    if (!babyId) return;
    try {
      const res = await api.get(`/events?baby_id=${babyId}`);
      setEvents(res.data);
    } catch {
      setEvents([]);
    }
  };

  // A API retorna um objeto { baby_id, date, naps: [...], feeds: [...] }
  const fetchPlan = async (babyId) => {
    if (!babyId) {
      setPlan(null);
      return;
    }
    setLoadingPlan(true);
    try {
      const res = await api.get(`/plan/today?baby_id=${babyId}`);
      setPlan(res.data);

      const agora = new Date();
      const upcomingNap = res.data.naps?.find((n) => new Date(n.start) > agora);
      const upcomingFeed = res.data.feeds?.find((f) => new Date(f) > agora);

      setNextNap(upcomingNap || null);
      setNextFeed(upcomingFeed || null);
    } catch {
      setPlan(null);
      setNextNap(null);
      setNextFeed(null);
    } finally {
      setLoadingPlan(false);
    }
  };

  // Busca histórico de reports diários (assume endpoint GET /report/history?baby_id=)
  const fetchReportsHistory = async (babyId) => {
    if (!babyId) {
      setReportsHistory([]);
      return;
    }
    setLoadingHistory(true);
    try {
      const res = await api.get(`/report/history?baby_id=${babyId}`);
      // res.data deve ser array de objetos: { date: "YYYY-MM-DD", total_sleep_minutes: number, longest_nap_minutes: number }
      // Ordena por data ascendente
      const sorted = res.data.sort((a, b) => a.date.localeCompare(b.date));
      setReportsHistory(sorted);
    } catch {
      setReportsHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ==========  NOVO: Função para gerar (ou atualizar) o relatório diário  ==========
  const handleGenerateReport = async (babyId) => {
    if (!babyId) {
      message.warning("Selecione um bebê antes de gerar o relatório.");
      return;
    }

    try {
      const res = await api.post(`/report/generate`, null, {
        params: { baby_id: babyId },
      });
      message.success(res.data.msg || "Relatório gerado com sucesso!");
      // Após gerar, recarrega o histórico para atualizar o gráfico
      fetchReportsHistory(babyId);
    } catch (err) {
      const detail = err.response?.data?.detail || "Erro ao gerar relatório.";
      message.error(detail);
    }
  };

  const handleGeneratePlan = async (babyId) => {
    try {
      await api.post(`/plan/routine/generate?baby_id=${babyId}`);
      message.success("Plano de rotina gerado com sucesso!");
      fetchPlan(babyId);
    } catch (err) {
      message.error(
        err?.response?.data?.detail || "Erro ao gerar plano de rotina."
      );
    }
  };

  const handleCreateBaby = async (values) => {
    try {
      const payload = {
        ...values,
        birth_date: values.birth_date.format("YYYY-MM-DD"),
        birth_weight_grams: parseInt(values.birth_weight_grams, 10),
      };
      await api.post("/babies", payload);
      message.success("Bebê cadastrado!");
      setShowBabyModal(false);
      babyForm.resetFields();
      fetchBabies();
    } catch {
      message.error("Erro ao cadastrar bebê");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      message.success("Evento excluído com sucesso!");
      // Recarrega eventos e plano
      const ev = events.find((e) => e.id === eventId);
      if (ev) {
        fetchEvents(ev.baby_id);
        fetchPlan(ev.baby_id);
      }
    } catch {
      message.error("Erro ao excluir evento.");
    }
  };

  const handleCreateEvent = async (values) => {
    try {
      // values.timestamp é um moment contendo hora e minuto
      const selectedTime = values.timestamp;
      const todayDate = dayjs().format("YYYY-MM-DD");
      const hour = selectedTime.format("HH");
      const minute = selectedTime.format("mm");
      const combined = dayjs(`${todayDate}T${hour}:${minute}:00`);

      const payload = {
        baby_id: values.baby_id,
        type: values.type,
        timestamp: combined.toISOString(),
      };

      await api.post("/events", payload);
      message.success("Evento registrado!");
      setShowEventModal(false);
      eventForm.resetFields();

      // Recarrega eventos, plano e histórico
      fetchEvents(values.baby_id);
      fetchPlan(values.baby_id);
      fetchReportsHistory(values.baby_id);
    } catch {
      message.error("Erro ao registrar evento");
    }
  };

  // Função auxiliar para calcular idade detalhada
  const calcularIdade = (birthDateString) => {
    const nascimento = dayjs(birthDateString);
    const hoje = dayjs();

    const anos = hoje.diff(nascimento, "year");
    const meses = hoje.subtract(anos, "year").diff(nascimento, "month");
    const dias = hoje
      .subtract(anos, "year")
      .subtract(meses, "month")
      .diff(nascimento, "day");

    const partes = [];
    if (anos) partes.push(`${anos} ano${anos > 1 ? "s" : ""}`);
    if (meses) partes.push(`${meses} mês${meses > 1 ? "es" : ""}`);
    if (dias || partes.length === 0)
      // se não há anos/meses, mostra só dias
      partes.push(`${dias} dia${dias !== 1 ? "s" : ""}`);

    return partes.join(" e ");
  };

  return (
    <>
      {tourOpen && (
        <ConfigProvider locale={tourLocale}>
          <Tour
            open={tourOpen}
            onClose={() => setTourOpen(false)}
            steps={tourSteps}
          />{" "}
        </ConfigProvider>
      )}
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content
          style={{
            padding: isDesktop ? 24 : "0px 0px 80px",
            width: "100%",
            maxWidth: isDesktop ? 1200 : "100%",
            marginInline: "auto",
          }}
        >
          {isDesktop && (
            <>
              <Title level={2}>Relatório</Title>
              <Row justify="start" style={{ marginBottom: 24 }}>
                <Col>
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    size="large"
                    shape="round"
                    disabled={!canAddBaby}
                    onClick={() => {
                      if (!canAddBaby) {
                        message.warning(
                          "Para cadastrar mais de um bebê, você precisa assinar o Plano Plus."
                        );
                      } else {
                        setShowBabyModal(true);
                      }
                    }}
                  >
                    Adicionar seu bebê
                  </Button>
                </Col>
              </Row>
            </>
          )}
          {/* Lista de cards de bebê */}
          <Row
            gutter={isDesktop ? [24, 24] : 0} // desktop: 24px / mobile: 0
            justify="center"
            style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}
          >
            {babies.map((b) => {
              const idadeTexto = calcularIdade(b.birth_date);
              const isSelected = selectedBabyId === b.id;
              // 1) Filtra só os eventos deste bebê
              const babyEvents = events.filter((e) => e.baby_id === b.id);

              // 2) Pega o último sleep_start e o último sleep_end
              const lastStart = babyEvents
                .filter((e) => e.type === "sleep_start")
                .sort((a, b) => dayjs(b.timestamp).diff(a.timestamp))[0];
              const lastEnd = babyEvents
                .filter((e) => e.type === "sleep_end")
                .sort((a, b) => dayjs(b.timestamp).diff(a.timestamp))[0];

              // 3) Se tiver um start mais recente que o end, considera dormindo
              const isSleeping =
                lastStart &&
                (!lastEnd ||
                  dayjs(lastStart.timestamp).isAfter(lastEnd.timestamp));

              // 4) Escolhe o emoji: 😴 se dormindo, senão 👦 ou 👧
              const babyEmoji = isSleeping
                ? "😴"
                : b.gender === "male"
                ? "👦"
                : "👧";

              // … mantém seu coverBg etc …
              const coverBg =
                b.gender === "male"
                  ? "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)"
                  : "linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)";

              return (
                <Col xs={24} key={b.id}>
                  {/* Card do bebê */}
                  <Card
                    hoverable
                    onClick={() => handleSelectBaby(b.id)}
                    bordered={false}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      boxShadow: isSelected
                        ? `0 0 0 2px ${
                            b.gender === "male"
                              ? "#1890ff"
                              : "#ff80bf" /* azul ou rosa */
                          } inset`
                        : "0 4px 12px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                    }}
                    cover={
                      <div
                        style={{
                          position: "relative",
                          height: 280,
                          marginBottom: 0,
                          background: coverBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width={280}
                          height={280}
                          style={{ overflow: "visible" }}
                        >
                          {/* arco maior e mais grosso */}
                          <path
                            d={describeArc(140, 140, 120, 270, 90)}
                            stroke="#1890ff"
                            strokeWidth={10}
                            fill="none"
                          />

                          {["sleep_start", "sleep_end"]
                            .map((type) => {
                              if (type === "sleep_start" && nextNap)
                                return { time: nextNap.start, icon: "💤" };
                              if (type === "sleep_end" && nextNap)
                                return {
                                  time: nextNap.end,
                                  icon: "🌞",
                                  isWake: true,
                                };
                              return null;
                            })
                            .filter(Boolean)
                            .map((ev, i, arr) => {
                              const startA = 270,
                                endA = 90;
                              const angle =
                                startA +
                                (i * (endA - startA)) / (arr.length - 1 || 1);
                              const { x, y } = polarToCartesian(
                                140,
                                140,
                                120,
                                angle
                              );

                              // círculos um pouco maiores
                              const r = ev.isWake ? 20 : 16;
                              const strokeW = ev.isWake ? 5 : 3;
                              const strokeC = ev.isWake ? "#0050b3" : "#fff";
                              const fillC = ev.isWake ? "#e6f7ff" : "#fff";

                              // maior espaçamento antes do horário
                              const marginTopTime = 18; // de 6 para 12px
                              const yBase = y + r; // base logo abaixo da bolinha

                              return (
                                <g key={i}>
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r={r}
                                    fill={fillC}
                                    stroke={strokeC}
                                    strokeWidth={strokeW}
                                  />

                                  {/* emoji do evento */}
                                  <text
                                    x={x}
                                    y={y + 6}
                                    textAnchor="middle"
                                    fontSize={ev.isWake ? 18 : 16}
                                  >
                                    {ev.icon}
                                  </text>

                                  {/* horário sempre abaixo, com espaço maior e em negrito */}
                                  <text
                                    x={x}
                                    y={yBase}
                                    dy={marginTopTime}
                                    textAnchor="middle"
                                    fontSize={14}
                                    fontWeight="bold"
                                    fill={ev.isWake ? "#0050b3" : "#333"}
                                  >
                                    {dayjs(ev.time).format("HH:mm")}
                                  </text>
                                </g>
                              );
                            })}
                        </svg>

                        {/* Emoji central */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: 120,
                            height: 120,
                            marginTop: -60,
                            marginLeft: -60,
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 64,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          {babyEmoji}
                        </div>
                      </div>
                    }
                    bodyStyle={{ padding: 24 }}
                  >
                    {/* nome + tag continuam iguais */}
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <Title level={3} style={{ margin: 0 }}>
                        {b.name}
                      </Title>
                      <Tag color={b.gender === "male" ? "blue" : "magenta"}>
                        {b.gender === "male" ? "Menino" : "Menina"}
                      </Tag>
                    </div>

                    {/* metadados em linha  -------------------------------------------------- */}
                    {/* metadados em linha – fonte maior, peso 500, alinhamento central */}
                    <Descriptions
                      column={isMobile ? 1 : 3}
                      bordered={false}
                      size="small"
                      style={{ marginBottom: 12 }}
                      labelStyle={{ fontWeight: 500, color: "#555" }}
                      contentStyle={{ color: "#555" }}
                    >
                      <Descriptions.Item label="Nascimento">
                        {new Date(b.birth_date).toLocaleDateString("pt-BR")}
                      </Descriptions.Item>
                      <Descriptions.Item label="Peso">
                        {b.birth_weight_grams} g
                      </Descriptions.Item>
                      <Descriptions.Item label="Idade">
                        {idadeTexto}
                      </Descriptions.Item>
                    </Descriptions>

                    <div style={{ margin: "16px 0" }}>
                      {TYPE_OPTIONS.map((opt) => {
                        // pega o evento +-recente deste tipo
                        const evtLatest = events
                          .filter(
                            (e) => e.baby_id === b.id && e.type === opt.value
                          )
                          .sort((a, b) =>
                            dayjs(b.timestamp).diff(a.timestamp)
                          )[0];

                        const isPlaceholder = !evtLatest;
                        const baseTime = evtLatest?.timestamp;
                        const diffMin = baseTime
                          ? dayjs().diff(dayjs(baseTime), "minute")
                          : null;

                        //— calcula texto de “há…”
                        let agoText;
                        let stale = false;
                        if (diffMin !== null) {
                          if (diffMin > 120) {
                            agoText = "Sem registros nas últimas 2 horas";
                            stale = true;
                          } else {
                            const hrs = Math.floor(diffMin / 60);
                            const mins = diffMin % 60;
                            agoText = `${
                              hrs ? `${hrs} hr${hrs > 1 ? "s" : ""} ` : ""
                            }${mins} min atrás`;
                          }
                        } else {
                          agoText = "—";
                        }

                        //— subtítulo
                        let subtitle = evtLatest?.note || opt.label;
                        if (!evtLatest && opt.value === "sleep_end")
                          subtitle = "Ainda não acordou";
                        if (!evtLatest && opt.value === "sleep_start")
                          subtitle = "Ainda não dormiu";

                        //— cores
                        const style = ROW_STYLES[opt.value] || {};

                        return (
                          <div
                            key={
                              evtLatest
                                ? evtLatest.id
                                : `ph-${opt.value}-${b.id}`
                            }
                            style={{
                              ...baseRow,
                              background: style.bg,
                              opacity: isPlaceholder ? 0.55 : 1,
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            {/* ícone */}
                            <span
                              style={{
                                ...iconPill,
                                background: style.pillBg,
                                color: style.pillColor,
                              }}
                            >
                              {opt.icon}
                            </span>

                            {/* texto */}
                            <div style={{ flex: 1, padding: "4px 0" }}>
                              {/* horário / mensagem */}
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginBottom: 2,
                                  color: stale ? "#999" : "#333",
                                  display: "block",
                                }}
                              >
                                {agoText}
                              </Text>
                              {/* subtítulo */}
                              <Text style={{ fontSize: 12, color: "#666" }}>
                                {subtitle}
                              </Text>
                            </div>

                            {/* divisor */}
                            <div style={dividerStyle} />

                            {/* relógio */}
                            {!isPlaceholder && (
                              <Popover
                                trigger="click"
                                content={
                                  <Space>
                                    <TimePicker
                                      defaultValue={dayjs(baseTime || dayjs())}
                                      format="HH:mm"
                                      onChange={(_, time) =>
                                        handleCreateEvent({
                                          baby_id: b.id,
                                          type: opt.value,
                                          timestamp: time,
                                        })
                                      }
                                    />
                                    <Button
                                      size="small"
                                      type="default"
                                      onClick={() =>
                                        handleCreateEvent({
                                          baby_id: b.id,
                                          type: opt.value,
                                          timestamp: dayjs(),
                                        })
                                      }
                                    >
                                      Agora
                                    </Button>
                                  </Space>
                                }
                              >
                                <ClockCircleOutlined
                                  className="clock-tip"
                                  style={{
                                    fontSize: 20,
                                    color: style.pillColor,
                                    cursor: "pointer",
                                  }}
                                />
                              </Popover>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Lista de eventos, inline sob o card */}
                </Col>
              );
            })}
          </Row>
          {/* Área de exibição do plano de rotina para o bebê selecionado 
          <Divider style={{ marginTop: 32 }} />
          {selectedBabyId && !isPlanExpired && plan ? (
            <Card
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                marginTop: 24,
                padding: 24,
                border: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 16, color: "#888", marginRight: 8 }}>
                  Plano de Rotina de
                </Text>
                <Title level={4} style={{ margin: 0 }}>
                  {plan.date === new Date().toISOString().slice(0, 10)
                    ? "Hoje"
                    : "Amanhã"}
                </Title>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
                {/* Próxima Soneca 
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 24,
                      marginRight: 12,
                      color: "#555",
                    }}
                  >
                    💤
                  </span>
                  <div>
                    <Text style={{ fontSize: 14, color: "#555" }}>
                      Próxima Soneca
                    </Text>
                    {nextNap ? (
                      <div style={{ marginTop: 4 }}>
                        <Title level={5} style={{ margin: 0 }}>
                          {new Date(nextNap.start).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {new Date(nextNap.end).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Title>
                      </div>
                    ) : (
                      <Text
                        type="secondary"
                        style={{ marginTop: 4, display: "block" }}
                      >
                        Nenhuma nova soneca para hoje
                      </Text>
                    )}
                  </div>
                </div>

                {/* Próxima Mamadeira 
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 24,
                      marginRight: 12,
                      color: "#555",
                    }}
                  >
                    🍼
                  </span>
                  <div>
                    <Text style={{ fontSize: 14, color: "#555" }}>
                      Próxima Mamadeira
                    </Text>
                    {nextFeed ? (
                      <div style={{ marginTop: 4 }}>
                        <Title level={5} style={{ margin: 0 }}>
                          {new Date(nextFeed).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Title>
                      </div>
                    ) : (
                      <Text
                        type="secondary"
                        style={{ marginTop: 4, display: "block" }}
                      >
                        Nenhuma nova mamadeira para hoje
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 16 }}
              >
                {selectedBabyId && plan === null
                  ? "Ainda não há plano de rotina para este bebê."
                  : plan && isPlanExpired
                  ? "O plano de hoje já expirou."
                  : "Selecione um bebê para ver ou gerar o plano."}
              </Text>
              {selectedBabyId && (
                <Button
                  type="primary"
                  onClick={() => handleGeneratePlan(selectedBabyId)}
                  // desativa apenas quando estiver no estado "Gerar Plano para Este Bebê"
                  disabled={plan === null}
                >
                  {plan === null
                    ? "Gerar Plano para Este Bebê"
                    : "Gerar Novo Plano"}
                </Button>
              )}
            </div>
          )}
          {/* Se estiver carregando o plano, mostra spinner */}
          <Modal
            title="Registrar Evento"
            open={showEventModal}
            onCancel={() => {
              setShowEventModal(false);
              eventForm.resetFields();
              setSelectedType(null);
            }}
            onOk={() => eventForm.submit()}
          >
            <Form
              layout="vertical"
              form={eventForm}
              onFinish={handleCreateEvent}
              initialValues={{
                timestamp: dayjs(),
              }}
            >
              {/* baby_id oculto */}
              <Form.Item name="baby_id" hidden>
                <Input type="hidden" />
              </Form.Item>

              {/* type oculto (sempre definido pelos botões abaixo) */}
              <Form.Item name="type" hidden>
                <Input type="hidden" />
              </Form.Item>

              {/* Botões para escolher o tipo de evento */}
              <Form.Item
                label="Tipo de Evento"
                required
                validateStatus={!selectedType ? "error" : ""}
                help={!selectedType ? "Selecione um tipo" : ""}
              >
                <Space>
                  {TYPE_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      type={selectedType === opt.value ? "primary" : "default"}
                      onClick={() => {
                        setSelectedType(opt.value);
                        eventForm.setFieldsValue({ type: opt.value });
                      }}
                    >
                      <span style={{ marginRight: 4 }}>{opt.icon}</span>
                      {opt.label}
                    </Button>
                  ))}
                </Space>
              </Form.Item>

              {/* TimePicker: dia fixo (hoje), apenas hora e minuto */}
              <Form.Item
                name="timestamp"
                label="Hora do Evento"
                rules={[{ required: true, message: "Informe a hora" }]}
              >
                <TimePicker
                  format="HH:mm"
                  minuteStep={5}
                  style={{ width: "100%" }}
                  defaultValue={dayjs()}
                />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </>
  );
};

export default DashboardPage;

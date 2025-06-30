// src/components/BabyCardWithArc.jsx
import React from "react";
import dayjs from "dayjs";

// Helpers para converter coordenadas polares ↔ cartesianas
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}
function describeArc(cx, cy, r, startAngle, endAngle) {
  const p1 = polarToCartesian(cx, cy, r, endAngle);
  const p2 = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return ["M", p1.x, p1.y, "A", r, r, 0, largeArcFlag, 0, p2.x, p2.y].join(" ");
}

export default function BabyCardWithArc({ baby, nextNap, nextFeed }) {
  // eventos a desenhar no arco
  const events = [
    nextNap && { time: nextNap.start, icon: "💤", label: "Soneca" },
    nextFeed && { time: nextFeed, icon: "🍼", label: "Mamadeira" },
  ].filter(Boolean);

  // dimensões do SVG
  const size = 160;
  const radius = 70;
  const center = { x: size / 2, y: size / 2 + 20 };

  return (
    <Card
      style={{
        width: 300,
        borderRadius: 12,
        overflow: "hidden",
        textAlign: "center",
      }}
      cover={
        <div style={{ position: "relative", height: size }}>
          {/* 1) O SVG com o arco e marcadores */}
          <svg
            width={size}
            height={size}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* arco semi-circular */}
            <path
              d={describeArc(center.x, center.y, radius, 180, 0)}
              stroke="#1890ff88"
              strokeWidth={3}
              fill="none"
            />
            {/* marcadores */}
            {events.map((ev, i) => {
              const angle = 180 - (i * 180) / (events.length - 1 || 1);
              const { x, y } = polarToCartesian(
                center.x,
                center.y,
                radius,
                angle
              );
              return (
                <g key={i}>
                  {/* bolinha */}
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="#fff"
                    stroke="#1890ff"
                    strokeWidth={2}
                  />
                  {/* ícone */}
                  <text x={x} y={y + 4} textAnchor="middle" fontSize={12}>
                    {ev.icon}
                  </text>
                  {/* horário */}
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#333"
                  >
                    {dayjs(ev.time).format("HH:mm")}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 2) A foto/avatar do bebê (ou emoji) */}
          <div
            style={{
              position: "absolute",
              top: size / 2 - 40,
              left: size / 2 - 40,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#f0f8ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {baby.gender === "male" ? "👦" : "👧"}
          </div>
        </div>
      }
    >
      <Title level={4} style={{ margin: "12px 0 4px" }}>
        {baby.name}
      </Title>
      <Text type="secondary">
        Nasc: {dayjs(baby.birth_date).format("DD/MM/YYYY")} ·{" "}
        {baby.birth_weight_grams} g
      </Text>
    </Card>
  );
}

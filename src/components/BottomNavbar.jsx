// src/components/BottomNavbar.jsx

import React from "react";
import { Layout, Grid, Button, Space } from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Footer } = Layout;
const { useBreakpoint } = Grid;

const BottomNavbar = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm; // mobile = telas menores que "sm"
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: "/dashboard", label: "Início", icon: <HomeOutlined /> },
    { key: "/review", label: "Diário", icon: <ReadOutlined /> },
    { key: "/charts", label: "Semana", icon: <BarChartOutlined /> },
    { key: "/settings", label: "Mais", icon: <SettingOutlined /> },
  ];

  if (!isMobile) return null;

  return (
    <Footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#ffffff",
        borderTop: "1px solid #e8e8e8",
        padding: 3, // remove padding padrão
        zIndex: 1000,
      }}
    >
      <Space
        style={{
          display: "flex",
          justifyContent: "space-evenly", // distribui abas mais próximas
          alignItems: "center",
          width: "100%",
          padding: "6px 0", // padding vertical do Footer
        }}
        size={0} // sem espaçamento extra
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.key;
          return (
            <Button
              key={tab.key}
              type="text"
              onClick={() => navigate(tab.key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 0", // padding vertical interno do botão
                minWidth: 56, // largura mínima menor para aproximar horizontalmente
                color: isActive ? "#1890ff" : "#888888",
                fontWeight: isActive ? 600 : 400,
                lineHeight: 1,
              }}
            >
              {/*
                Ícone em 24px, sem margem inferior
              */}
              {React.cloneElement(tab.icon, {
                style: { fontSize: 20, marginBottom: 0 },
                twoToneColor: isActive ? "#1890ff" : undefined,
              })}

              {/*
                Label com lineHeight igual ao tamanho do ícone (24px),
                e marginTop ajustado para “colar” completamente ao ícone.
              */}
              <span
                style={{
                  fontSize: 12,
                  lineHeight: "24px", // igual a fontSize do ícone
                  marginTop: -10, // “puxa” texto para cima 2px
                }}
              >
                {tab.label}
              </span>
            </Button>
          );
        })}
      </Space>
    </Footer>
  );
};

export default BottomNavbar;

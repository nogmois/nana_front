// src/components/Navbar.jsx

import React from "react";
import { Layout, Grid, Typography, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.sm; // true em larguras < 576px

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configurações",
      onClick: () => navigate("/settings"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sair",
      onClick: handleLogout,
    },
  ];

  if (isMobile) return null;

  const linkStyle = {
    fontSize: 16,
    fontWeight: 500,
    textDecoration: "none",
    padding: "0 12px",
    lineHeight: "56px",
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: 56,
      }}
    >
      {/* 1) Logo */}
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        <Title
          level={3}
          style={{ margin: 0, color: "#1890ff", lineHeight: "56px" }}
        >
          NanaFácil
        </Title>
      </div>

      {/* 2) Links centrais */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            ...linkStyle,
            color: isActive ? "#1890ff" : "#333",
            borderBottom: isActive
              ? "2px solid #1890ff"
              : "2px solid transparent",
          })}
        >
          Início
        </NavLink>
        <NavLink
          to="/review"
          style={({ isActive }) => ({
            ...linkStyle,
            color: isActive ? "#1890ff" : "#333",
            borderBottom: isActive
              ? "2px solid #1890ff"
              : "2px solid transparent",
          })}
        >
          Eventos
        </NavLink>
        <NavLink
          to="/charts"
          style={({ isActive }) => ({
            ...linkStyle,
            color: isActive ? "#1890ff" : "#333",
            borderBottom: isActive
              ? "2px solid #1890ff"
              : "2px solid transparent",
          })}
        >
          Semana
        </NavLink>

        <NavLink
          to="/plans"
          style={({ isActive }) => ({
            ...linkStyle,
            color: isActive ? "#1890ff" : "#333",
            borderBottom: isActive
              ? "2px solid #1890ff"
              : "2px solid transparent",
          })}
        >
          Planos
        </NavLink>
      </div>

      {/* 3) Avatar + Dropdown */}
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Space
          size="small"
          style={{
            cursor: "pointer",
            marginLeft: 16 /* afasta um pouco das tabs */,
          }}
        >
          <Avatar
            size={36} /* maior que 'small' */
            icon={<UserOutlined />}
            style={{
              background:
                location.pathname === "/settings" ? "#e6f7ff" : undefined,
              color: location.pathname === "/settings" ? "#1890ff" : undefined,
            }}
          />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default Navbar;

import React from "react";
import api from "../services/api";

export default function DiaryPage() {
  const handleRegisterSleep = async () => {
    try {
      await api.post("/events", {
        baby_id: 1,
        type: "sleep_start",
        timestamp: new Date().toISOString(),
      });
      alert("Evento registrado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar evento");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Diário do Bebê</h2>
      <button onClick={handleRegisterSleep}>Dormiu 💤</button>
    </div>
  );
}

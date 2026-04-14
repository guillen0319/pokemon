import { useEffect, useState } from "react";
import AdivinaNumero from "./components/AdivinaNumero";
import AdivinarPokemon from "./components/AdivinarPokemon";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("");
  const [juegoActivo, setJuegoActivo] = useState("numero");

  useEffect(() => {
    fetch("/api/mensaje")
      .then((res) => res.json())
      .then((data) => setMensaje(data.texto));
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "#2d3436" }}>Frontend conectado</h1>
      <p style={{ fontSize: "1.2rem", color: "#0984e3" }}>{mensaje}</p>
      <hr style={{ margin: "20px 0" }} />

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setJuegoActivo("numero")}
          style={{
            marginRight: "10px", padding: "10px 20px", borderRadius: "8px",
            border: "none", backgroundColor: juegoActivo === "numero" ? "#0984e3" : "#b2bec3",
            color: "#fff", cursor: "pointer", fontWeight: "bold",
          }}
        >
          🎲 Adivina el Número
        </button>
        <button
          onClick={() => setJuegoActivo("pokemon")}
          style={{
            padding: "10px 20px", borderRadius: "8px", border: "none",
            backgroundColor: juegoActivo === "pokemon" ? "#6c5ce7" : "#b2bec3",
            color: "#fff", cursor: "pointer", fontWeight: "bold",
          }}
        >
          🎮 Adivina el Pokémon
        </button>
      </div>

      {juegoActivo === "numero" && <AdivinaNumero />}
      {juegoActivo === "pokemon" && <AdivinarPokemon />}
    </div>
  );
}

export default App;
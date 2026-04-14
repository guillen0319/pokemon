import { useState, useEffect, useRef } from "react";

function AdivinarPokemon() {
  const [pokemon, setPokemon] = useState(null);
  const [intento, setIntento] = useState("");
  const [resultado, setResultado] = useState("");
  const [imagenVisible, setImagenVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("https://vgmsite.com/soundtracks/pokemon-firered-leafgreen/xlqmofputs/1-03.%20Pallet%20Town.mp3");    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
      audioRef.current.pause();
    };
  }, []);

  const toggleMusica = () => {
    if (reproduciendo) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setReproduciendo(!reproduciendo);
  };

  const nuevoPokemon = async () => {
    if (!reproduciendo) {
      audioRef.current.play().then(() => {
        setReproduciendo(true);
      }).catch(() => {});
    }
    setCargando(true);
    setResultado("");
    setImagenVisible(false);
    setIntento("");
    setIntentos(0);
    const res = await fetch("/api/pokemon/nuevo");
    const data = await res.json();
    setPokemon(data);
    setCargando(false);
  };

  const adivinar = async () => {
    if (!intento || !pokemon) return;
    setIntentos((prev) => prev + 1);
    const res = await fetch("/api/pokemon/adivinar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intento, nombreReal: pokemon.name }),
    });
    const data = await res.json();
    setResultado(data.mensaje);
    setImagenVisible(true);
  };

  const rendirse = () => {
    setResultado(`😔 El Pokémon era ${pokemon.name}.`);
    setImagenVisible(true);
  };

  const typeColors = {
    fire: "#e17055", water: "#0984e3", grass: "#00b894",
    electric: "#fdcb6e", psychic: "#fd79a8", normal: "#b2bec3",
    poison: "#a29bfe", rock: "#636e72", ground: "#d4a84b",
    flying: "#74b9ff", bug: "#55efc4", ghost: "#6c5ce7",
    dragon: "#6c5ce7", dark: "#2d3436", steel: "#aaa",
    ice: "#81ecec", fighting: "#e17055", fairy: "#fd79a8",
  };

  return (
    <div style={{
      maxWidth: "480px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif",
      background: "linear-gradient(160deg, #cc0000 0%, #cc0000 48%, #111 48%, #111 52%, #fff 52%)",
      borderRadius: "20px", padding: "4px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
    }}>
      <div style={{ background: "#fff", borderRadius: "17px", padding: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(180deg, #cc0000 50%, #fff 50%)",
              border: "3px solid #111", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{
                width: "12px", height: "12px", borderRadius: "50%",
                background: "#fff", border: "3px solid #111", zIndex: 1
              }} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#cc0000", fontWeight: "900", letterSpacing: "1px" }}>
              ¿QUIÉN ES ESE POKÉMON?
            </h2>
          </div>
          <button onClick={toggleMusica} style={{
            background: reproduciendo ? "#cc0000" : "#111", color: "#fff",
            border: "none", borderRadius: "50%", width: "36px", height: "36px",
            fontSize: "1rem", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}>
            {reproduciendo ? "🔇" : "🎵"}
          </button>
        </div>

        {pokemon && (
          <div style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#636e72" }}>
            🎯 Intentos: <strong style={{ color: "#cc0000" }}>{intentos}</strong>
          </div>
        )}

        {!pokemon && !cargando && (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#636e72" }}>
            <div style={{ fontSize: "4rem", marginBottom: "10px" }}>⚪</div>
            <p>Presiona <strong>"Nuevo Pokémon"</strong> para comenzar</p>
          </div>
        )}

        {cargando && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: "3rem", animation: "spin 1s linear infinite" }}>🔴</div>
            <p style={{ color: "#cc0000", fontWeight: "bold" }}>Cargando Pokémon...</p>
          </div>
        )}

        {pokemon && !cargando && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, #cc0000 0%, #990000 100%)",
              borderRadius: "12px", padding: "16px", marginBottom: "14px",
              color: "#fff", boxShadow: "0 4px 12px rgba(204,0,0,0.3)"
            }}>
              <p style={{ margin: "0 0 8px", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8 }}>
                📋 Pistas
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.95rem" }}>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px" }}>
                  <span style={{ opacity: 0.8 }}>🔢 ID</span><br />
                  <strong>#{pokemon.id}</strong>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px" }}>
                  <span style={{ opacity: 0.8 }}>🎨 Color</span><br />
                  <strong>{pokemon.color}</strong>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px" }}>
                  <span style={{ opacity: 0.8 }}>📏 Altura</span><br />
                  <strong>{pokemon.height / 10} m</strong>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px" }}>
                  <span style={{ opacity: 0.8 }}>⚖️ Peso</span><br />
                  <strong>{pokemon.weight / 10} kg</strong>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <span style={{ opacity: 0.8, fontSize: "0.85rem" }}>🧬 Tipo(s): </span>
                {pokemon.types.map((t) => (
                  <span key={t} style={{
                    display: "inline-block", backgroundColor: typeColors[t] || "#636e72",
                    color: "#fff", borderRadius: "20px", padding: "3px 10px",
                    margin: "3px", fontSize: "0.8rem", fontWeight: "bold",
                    border: "1px solid rgba(255,255,255,0.3)"
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ marginTop: "10px" }}>
                <span style={{ opacity: 0.8, fontSize: "0.85rem" }}>⚔️ Ataques: </span>
                {pokemon.moves.map((m) => (
                  <span key={m} style={{
                    display: "inline-block", backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#fff", borderRadius: "20px", padding: "3px 10px",
                    margin: "3px", fontSize: "0.8rem",
                    border: "1px solid rgba(255,255,255,0.3)"
                  }}>{m}</span>
                ))}
              </div>
            </div>

            {imagenVisible && (
              <div style={{ textAlign: "center", marginBottom: "14px", animation: "fadeInScale 0.6s ease-out" }}>
                <div style={{
                  display: "inline-block", background: "radial-gradient(circle, #fff9c4, #fff)",
                  borderRadius: "50%", padding: "20px",
                  boxShadow: "0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3)",
                  border: "3px solid #fdcb6e"
                }}>
                  <img src={pokemon.image} alt={pokemon.name}
                    style={{ width: "140px", height: "140px", objectFit: "contain" }} />
                </div>
                <p style={{ marginTop: "8px", fontWeight: "900", fontSize: "1.4rem", color: "#cc0000", textTransform: "uppercase", letterSpacing: "2px" }}>
                  {pokemon.name}
                </p>
              </div>
            )}

            {resultado && (
              <div style={{
                padding: "12px", borderRadius: "10px", marginBottom: "12px", textAlign: "center",
                background: resultado.includes("Correcto") ? "#d4edda" : "#f8d7da",
                border: `2px solid ${resultado.includes("Correcto") ? "#00b894" : "#cc0000"}`,
                fontSize: "1.1rem", fontWeight: "bold",
                color: resultado.includes("Correcto") ? "#00b894" : "#cc0000",
                animation: "fadeInScale 0.4s ease-out"
              }}>
                {resultado}
              </div>
            )}

            {!imagenVisible && (
              <div style={{ textAlign: "center" }}>
                <input
                  type="text"
                  value={intento}
                  onChange={(e) => setIntento(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && adivinar()}
                  placeholder="Escribe el nombre del Pokémon..."
                  style={{
                    padding: "12px 16px", fontSize: "1rem", borderRadius: "10px",
                    border: "2px solid #cc0000", width: "100%", marginBottom: "12px",
                    outline: "none", boxSizing: "border-box"
                  }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={adivinar} style={{
                    flex: 1, padding: "12px", fontSize: "1rem", borderRadius: "10px",
                    border: "none", backgroundColor: "#cc0000", color: "#fff",
                    cursor: "pointer", fontWeight: "bold", boxShadow: "0 3px 8px rgba(204,0,0,0.3)"
                  }}>
                    ✅ Adivinar
                  </button>
                  <button onClick={rendirse} style={{
                    flex: 1, padding: "12px", fontSize: "1rem", borderRadius: "10px",
                    border: "2px solid #111", backgroundColor: "#fff", color: "#111",
                    cursor: "pointer", fontWeight: "bold"
                  }}>
                    🏳️ Rendirse
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={nuevoPokemon} style={{
          marginTop: "16px", width: "100%", padding: "12px", fontSize: "1rem",
          borderRadius: "10px", border: "none",
          background: "linear-gradient(90deg, #cc0000, #ff4444)",
          color: "#fff", cursor: "pointer", fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(204,0,0,0.4)", letterSpacing: "1px"
        }}>
          🔄 NUEVO POKÉMON
        </button>

        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdivinarPokemon;
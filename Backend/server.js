const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/api/mensaje", (req, res) => {
  res.send({ texto: "Hola desde el backend " });
});

// JUEGO: ADIVINA EL NÚMERO
let numeroSecreto = Math.floor(Math.random() * 100) + 1;

app.get("/api/start", (req, res) => {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  res.json({ mensaje: "Nuevo juego iniciado. Adivina un número entre 1 y 100." });
});

app.post("/api/guess", (req, res) => {
  const intento = req.body.numero;
  if (!intento && intento !== 0) {
    return res.status(400).json({ mensaje: "Debes enviar un número." });
  }
  if (intento < numeroSecreto) {
    res.json({ mensaje: "El número secreto es mayor 🔼" });
  } else if (intento > numeroSecreto) {
    res.json({ mensaje: "El número secreto es menor 🔽" });
  } else {
    res.json({ mensaje: "🎉 ¡Correcto! Adivinaste el número." });
  }
});

// JUEGO: ADIVINA EL POKÉMON
app.get("/api/pokemon/nuevo", async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    const pokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((t) => t.type.name),
      height: data.height,
      weight: data.weight,
      color: speciesData.color.name,
      moves: data.moves.slice(0, 4).map((m) => m.move.name),
      image: data.sprites.other?.dream_world?.front_default || data.sprites.front_default,
    };
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el Pokémon." });
  }
});

app.post("/api/pokemon/adivinar", (req, res) => {
  const { intento, nombreReal } = req.body;
  if (!intento || !nombreReal) {
    return res.status(400).json({ mensaje: "Faltan datos." });
  }
  if (intento.trim().toLowerCase() === nombreReal.toLowerCase()) {
    res.json({ correcto: true, mensaje: `¡Correcto! Es ${nombreReal}.` });
  } else {
    res.json({ correcto: false, mensaje: `Incorrecto, el Pokémon era ${nombreReal}.` });
  }
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
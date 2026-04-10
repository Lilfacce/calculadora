import { useState } from "react";
import "./App.css";

import MetodoGrafico from "./components/grafico/MetodoGrafico";
import SimplexUI from "./components/simplex/SimplexUI";
import GranMUI from "./components/gran_m/GranMUI";
import BiseccionUI from "./components/biseccion/BiseccionUI";
import TransporteUI from "./components/transporte/TransporteUI"; // 👈 NUEVO

function App() {
  const [modo, setModo] = useState(null);

  return (
    <div className="app-container">
      <h1 className="app-title">Calculadora de Métodos Numéricos</h1>

      {/* MENÚ PRINCIPAL */}
      {!modo && (
        <div className="menu">
          <h2>¿Qué deseas hacer?</h2>

          <button onClick={() => setModo("grafico")}>
            Método Gráfico
          </button>

          <button onClick={() => setModo("simplex")}>
            Método Simplex
          </button>

          <button onClick={() => setModo("gran_m")}>
            Método Gran M
          </button>

          <button onClick={() => setModo("biseccion")}>
            Método de Bisección
          </button>

          {/* 👇 NUEVO BOTÓN */}
          <button onClick={() => setModo("transporte")}>
            Métodos de Transporte
          </button>
        </div>
      )}

      {/* MÉTODO GRÁFICO */}
      {modo === "grafico" && (
        <>
          <button onClick={() => setModo(null)}>⬅ Volver al menú</button>
          <MetodoGrafico />
        </>
      )}

      {/* MÉTODO SIMPLEX */}
      {modo === "simplex" && (
        <>
          <button onClick={() => setModo(null)}>⬅ Volver al menú</button>
          <SimplexUI />
        </>
      )}

      {/* MÉTODO GRAN M */}
      {modo === "gran_m" && (
        <>
          <button onClick={() => setModo(null)}>⬅ Volver al menú</button>
          <GranMUI />
        </>
      )}

      {/* MÉTODO BISECCIÓN */}
      {modo === "biseccion" && (
        <>
          <button onClick={() => setModo(null)}>⬅ Volver al menú</button>
          <BiseccionUI />
        </>
      )}

      {/* 👇 NUEVA SECCIÓN TRANSPORTE */}
      {modo === "transporte" && (
        <>
          <button onClick={() => setModo(null)}>⬅ Volver al menú</button>
          <TransporteUI />
        </>
      )}
    </div>
  );
}

export default App;
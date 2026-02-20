import { useState } from "react";
import "./App.css";

import MetodoGrafico from "./components/grafico/MetodoGrafico";   // tu UI actual
import SimplexUI from "./components/simplex/SimplexUI";

function App() {
  const [modo, setModo] = useState(null);

  return (
    <div className="app-container">
      <h1 className="app-title">Calculadora de Programación Lineal</h1>

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
    </div>
  );
}

export default App;
import { useState } from "react";
import "./App.css";

import MetodoGrafico from "./components/grafico/MetodoGrafico";
import SimplexUI from "./components/simplex/SimplexUI";
import GranMUI from "./components/gran_m/GranMUI";
import {
  resolverEsquinaNoroeste,
  resolverCostoMinimo,
  resolverVogel,
} from "./components/transporte";

function App() {
  const [modo, setModo] = useState(null);

  const ejemploTransporte = {
  costos: [
    [2, 3, 1],
    [5, 4, 8],
    [5, 6, 8],
  ],
  oferta: [180, 80, 100],
  demanda: [100, 120, 140],
};

console.log("Esquina Noroeste:", resolverEsquinaNoroeste(ejemploTransporte));
console.log("Costo Mínimo:", resolverCostoMinimo(ejemploTransporte));
console.log("Vogel:", resolverVogel(ejemploTransporte));
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

          <button onClick={() => setModo("gran_m")}>
            Método gran M
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

      {/* MÉTODO GRAN MM */}
      {modo === "gran_m" && (
        <>
          <button onClick={() => setModo(null)}>⬅ Volver al menú</button>
          <GranMUI />
        </>
      )}
    </div>
  );
}

export default App;
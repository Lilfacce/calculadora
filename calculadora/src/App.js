import { useState } from "react";
import "./App.css";

import FuncionObjetivo from "./components/FuncionObjetivo";
import RestriccionesForm from "./components/RestriccionesForm";
import Resultados from "./components/Resultados";

import { resolverPL } from "./logica/soluciones";

function App() {
  const [tipo, setTipo] = useState("maximizar");

  const [funcionObjetivo, setFuncionObjetivo] = useState({
    x1: 0,
    x2: 0,
  });

  const [restricciones, setRestricciones] = useState([
    { x1: 0, x2: 0, op: "<=", b: 0 },
  ]);

  const [resultado, setResultado] = useState(null);

  const manejarGraficar = () => {
    const problema = {
      tipo,
      funcionObjetivo,
      restricciones,
      noNegatividad: true,
    };

    const res = resolverPL(problema);
    setResultado(res);
  };

  const manejarLimpiar = () => {
    setResultado(null);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Calculadora de Programación Lineal</h1>

      <FuncionObjetivo
        tipo={tipo}
        setTipo={setTipo}
        funcionObjetivo={funcionObjetivo}
        setFuncionObjetivo={setFuncionObjetivo}
      />

      <RestriccionesForm
        restricciones={restricciones}
        setRestricciones={setRestricciones}
      />

      <div className="button-group">
        <button onClick={manejarGraficar}>Graficar</button>
        <button onClick={manejarLimpiar}>Limpiar</button>
      </div>

      <Resultados resultado={resultado} />
    </div>
  );
}

export default App;

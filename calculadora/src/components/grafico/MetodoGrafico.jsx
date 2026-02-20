import { useState } from "react";
import FuncionObjetivo from "./FuncionObjetivo";
import RestriccionesForm from "./RestriccionesForm";
import Resultados from "./Resultados";
import { resolverPL } from "./soluciones";

function MetodoGrafico() {
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
    <div>
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

      <div>
        <button onClick={manejarGraficar}>Graficar</button>
        <button onClick={manejarLimpiar}>Limpiar</button>
      </div>

      <Resultados resultado={resultado} />
    </div>
  );
}

export default MetodoGrafico;
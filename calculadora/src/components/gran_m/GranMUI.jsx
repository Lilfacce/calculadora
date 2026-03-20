import { useState } from "react";
import { resolverGranM } from "../gran_m/granM";

export default function GranMUI() {

  const [numVars, setNumVars] = useState(2);
  const [funcionObjetivo, setFuncionObjetivo] = useState(Array(2).fill(""));
  const [restricciones, setRestricciones] = useState([
    { coef: Array(2).fill(""), signo: "<=", b: "" }
  ]);
  const [resultado, setResultado] = useState(null);

  // =========================
  // 🔢 FRACCIONES CORREGIDO
  // =========================
  function decimalAFraccion(decimal) {
    if (!isFinite(decimal)) return "";

    const signo = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);

    if (Number.isInteger(decimal)) {
      return (signo < 0 ? "-" : "") + decimal;
    }

    let tolerancia = 1.0E-6;
    let h1 = 1, h2 = 0;
    let k1 = 0, k2 = 1;
    let b = decimal;

    let iter = 0;
    const maxIter = 50;

    do {
      let a = Math.floor(b);

      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;

      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;

      if (b - a === 0) break;

      b = 1 / (b - a);

      iter++;
      if (iter > maxIter) break;

    } while (Math.abs(decimal - h1 / k1) > tolerancia);

    return `${signo < 0 ? "-" : ""}${h1}/${k1}`;
  }

  function mostrarNumero(n) {
    if (n === Infinity) return "∞";
    if (n === -Infinity) return "-∞";
    if (isNaN(n)) return "—";

    const redondeado = Number(n.toFixed(2));

    if (Number.isInteger(redondeado)) return redondeado;

    return `${redondeado} (${decimalAFraccion(redondeado)})`;
  }

  // =========================
  // 🔴 MOSTRAR M
  // =========================
  const BIG_M = 1000000;

  function mostrarM(n) {
    if (n === Infinity) return "∞";
    if (n === -Infinity) return "-∞";
    if (isNaN(n)) return "—";

    if (Math.abs(n) >= BIG_M - 1) {
      return n > 0 ? "M" : "-M";
    }

    return mostrarNumero(n);
  }

  // =========================
  // MANEJADORES
  // =========================
  const handleFOChange = (i, value) => {
    const nueva = [...funcionObjetivo];
    nueva[i] = value;
    setFuncionObjetivo(nueva);
  };

  const handleRestriccionChange = (i, j, value) => {
    const nuevas = [...restricciones];
    nuevas[i].coef[j] = value;
    setRestricciones(nuevas);
  };

  const handleSignoChange = (i, value) => {
    const nuevas = [...restricciones];
    nuevas[i].signo = value;
    setRestricciones(nuevas);
  };

  const handleBChange = (i, value) => {
    const nuevas = [...restricciones];
    nuevas[i].b = value;
    setRestricciones(nuevas);
  };

  const handleNumVarsChange = (n) => {
    const num = parseInt(n);
    setNumVars(num);

    setFuncionObjetivo(Array(num).fill(""));

    setRestricciones(prev =>
      prev.map(r => ({
        ...r,
        coef: Array(num).fill("")
      }))
    );
  };

  const agregarRestriccion = () => {
    setRestricciones([
      ...restricciones,
      { coef: Array(numVars).fill(""), signo: "<=", b: "" }
    ]);
  };

  // =========================
  // RESOLVER
  // =========================
  const resolver = () => {
    try {
      const problem = {
        objetivo: "min",
        c: funcionObjetivo.map(Number),
        restricciones: restricciones.map(r => ({
          coef: r.coef.map(Number),
          signo: r.signo,
          b: Number(r.b)
        }))
      };

      const res = resolverGranM(problem);
      setResultado(res);

    } catch {
      alert("Error en los datos");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Método Gran M (Minimización)</h2>

      <div>
        <label>Número de variables: </label>
        <input
          type="number"
          value={numVars}
          min="1"
          onChange={(e) => handleNumVarsChange(e.target.value)}
        />
      </div>

      <h3>Función Objetivo (Min Z)</h3>
      {funcionObjetivo.map((val, i) => (
        <input
          key={i}
          type="number"
          placeholder={`x${i + 1}`}
          value={val}
          onChange={(e) => handleFOChange(i, e.target.value)}
        />
      ))}

      <h3>Restricciones</h3>
      {restricciones.map((r, i) => (
        <div key={i} style={{ marginBottom: "5px" }}>
          {r.coef.map((val, j) => (
            <input
              key={j}
              type="number"
              placeholder={`x${j + 1}`}
              value={val}
              onChange={(e) =>
                handleRestriccionChange(i, j, e.target.value)
              }
              style={{ width: "60px", marginRight: "5px" }}
            />
          ))}

          <select
            value={r.signo}
            onChange={(e) => handleSignoChange(i, e.target.value)}
          >
            <option value="<=">{"<="}</option>
            <option value=">=">{">="}</option>
            <option value="=">{"="}</option>
          </select>

          <input
            type="number"
            placeholder="b"
            value={r.b}
            onChange={(e) => handleBChange(i, e.target.value)}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </div>
      ))}

      <button onClick={agregarRestriccion}>
        Agregar restricción
      </button>

      <br /><br />

      <button onClick={resolver}>
        Resolver
      </button>

      {resultado && (
        <div>
          <h3>Resultado</h3>
          <p><b>Estado:</b> {resultado.estado}</p>
          <p><b>Mensaje:</b> {resultado.mensaje}</p>

          {resultado.exito && (
            <>
              <p><b>Z óptimo:</b> {mostrarNumero(resultado.valorZ)}</p>

              <h4>Solución</h4>
              {Object.entries(resultado.solucionOriginal).map(([k, v]) => (
                <p key={k}>{k} = {mostrarNumero(v)}</p>
              ))}
            </>
          )}

          {/* ITERACIONES */}
          <h3>Iteraciones</h3>

          {resultado.iteraciones.map((it, index) => {
            const columnas = [...it.columnas, "R"];

            return (
              <div key={index} style={{ marginBottom: "25px" }}>
                <h4>Iteración {it.iteracion}</h4>

                <table border="1" cellPadding="6" style={{ textAlign: "center" }}>
                  <thead>
                    <tr style={{ background: "#ddd" }}>
                      <th></th>
                      {columnas.map((col, i) => (
                        <th key={i}>{col}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>

                    <tr style={{ background: "#e8f4ff" }}>
                      <td><b>Z</b></td>
                      {it.cjMinusZj.map((val, i) => (
                        <td key={i}>{mostrarM(val)}</td>
                      ))}
                    </tr>

                    {it.matriz.map((fila, i) => (
                      <tr key={i}>
                        <td><b>{it.base[i]}</b></td>
                        {fila.map((val, j) => (
                          <td key={j}>{mostrarM(val)}</td>
                        ))}
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
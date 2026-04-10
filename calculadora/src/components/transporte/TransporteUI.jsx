import React, { useState } from "react";
import { resolverCostoMinimo } from "./costoMinimo";
import { resolverEsquinaNoroeste } from "./esquinaNoroeste";
import { resolverVogel } from "./vogel";

const TransporteUI = () => {
  const [costos, setCostos] = useState("");
  const [oferta, setOferta] = useState("");
  const [demanda, setDemanda] = useState("");
  const [metodo, setMetodo] = useState("noroeste");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const parseInput = (text) => {
    return text.split("\n").map((row) =>
      row.split(",").map((num) => parseFloat(num))
    );
  };

  const parseArray = (text) => {
    return text.split(",").map((num) => parseFloat(num));
  };

  const calcular = () => {
    try {
      setError("");

      const data = {
        costos: parseInput(costos),
        oferta: parseArray(oferta),
        demanda: parseArray(demanda),
      };

      let res;

      switch (metodo) {
        case "noroeste":
          res = resolverEsquinaNoroeste(data);
          break;
        case "costo":
          res = resolverCostoMinimo(data);
          break;
        case "vogel":
          res = resolverVogel(data);
          break;
        default:
          throw new Error("Método no válido");
      }

      setResultado(res);
    } catch (err) {
      setError("Error en los datos: " + err.message);
      setResultado(null);
    }
  };

  return (
  <div className="transporte-container">
    <h2 className="titulo">Métodos de Transporte</h2>

    <div className="form-grid">
      <div className="input-group">
        <label>Costos</label>
        <textarea
          placeholder="Ej:\n2,3,1\n5,4,8"
          value={costos}
          onChange={(e) => setCostos(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Oferta</label>
        <input
          type="text"
          placeholder="Ej: 20,30"
          value={oferta}
          onChange={(e) => setOferta(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Demanda</label>
        <input
          type="text"
          placeholder="Ej: 10,25,15"
          value={demanda}
          onChange={(e) => setDemanda(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Método</label>
        <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
          <option value="noroeste">Esquina Noroeste</option>
          <option value="costo">Costo Mínimo</option>
          <option value="vogel">Vogel</option>
        </select>
      </div>
    </div>

    <button className="btn-calcular" onClick={calcular}>
      Calcular
    </button>

    {error && <p className="error">{error}</p>}

    {resultado && (
      <div className="resultado">
        <h3>{resultado.metodo}</h3>
        <p><b>Costo Total:</b> {resultado.costoTotal}</p>

        <table>
          <tbody>
            {resultado.asignaciones.map((fila, i) => (
              <tr key={i}>
                {fila.map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

export default TransporteUI;
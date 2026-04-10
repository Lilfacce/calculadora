import React, { useState } from "react";
import { biseccion } from "./biseccion";
import TablaBiseccion from "./TablaBiseccion";

const BiseccionUI = () => {
  const [funcion, setFuncion] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [tolerancia, setTolerancia] = useState(1e-7);
  const [maxIter, setMaxIter] = useState(100);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const calcular = () => {
    try {
      setError("");

      const f = new Function("x", "return " + funcion);

      const res = biseccion(f, parseFloat(a), parseFloat(b), {
        tolerancia: parseFloat(tolerancia),
        maxIter: parseInt(maxIter),
      });

      setResultado(res);
    } catch (err) {
      setError(err.message);
      setResultado(null);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Método de Bisección</h2>

      <input
        type="text"
        placeholder="f(x) = x*x - 4"
        value={funcion}
        onChange={(e) => setFuncion(e.target.value)}
        className="w-full p-2 mb-2 rounded text-black"
      />

      <input
        type="number"
        placeholder="a"
        value={a}
        onChange={(e) => setA(e.target.value)}
        className="w-full p-2 mb-2 rounded text-black"
      />

      <input
        type="number"
        placeholder="b"
        value={b}
        onChange={(e) => setB(e.target.value)}
        className="w-full p-2 mb-2 rounded text-black"
      />

      <input
        type="number"
        placeholder="Tolerancia"
        value={tolerancia}
        onChange={(e) => setTolerancia(e.target.value)}
        className="w-full p-2 mb-2 rounded text-black"
      />

      <input
        type="number"
        placeholder="Max Iter"
        value={maxIter}
        onChange={(e) => setMaxIter(e.target.value)}
        className="w-full p-2 mb-2 rounded text-black"
      />

      <button
        onClick={calcular}
        className="w-full bg-green-600 p-2 rounded mt-2 hover:bg-green-700"
      >
        Calcular
      </button>

      {error && <p className="text-red-400 mt-3">{error}</p>}

      {resultado && (
        <div className="mt-4">
          <p><b>Raíz:</b> {resultado.raiz}</p>
          <p><b>f(x):</b> {resultado.fx}</p>
          <p><b>Iteraciones:</b> {resultado.iteraciones}</p>
          <p><b>Convergió:</b> {resultado.convergio ? "Sí" : "No"}</p>

          <TablaBiseccion historia={resultado.historia} />
        </div>
      )}
    </div>
  );
};

export default BiseccionUI;
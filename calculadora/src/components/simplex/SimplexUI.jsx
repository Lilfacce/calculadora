import { useState } from "react";
import { solveSimplexMax } from "./solveSimplex";

function SimplexUI() {
  const [numVars, setNumVars] = useState(2);
  const [numCons, setNumCons] = useState(2);

  const [A, setA] = useState([]);
  const [b, setB] = useState([]);
  const [c, setC] = useState([]);

  const [resultado, setResultado] = useState(null);

  const generarFormulario = () => {
    setC(Array(numVars).fill(0));
    setA(Array(numCons).fill().map(() => Array(numVars).fill(0)));
    setB(Array(numCons).fill(0));
    setResultado(null);
  };

  const manejarResolver = () => {
    const res = solveSimplexMax({
      numVars,
      numCons,
      A,
      b,
      c,
      showIterations: true
    });

    setResultado(res);
  };

  return (
    <div>
      <h2>Método Simplex (Max)</h2>

      <div>
        Variables:
        <input
          type="number"
          min="1"
          value={numVars}
          onChange={(e) => setNumVars(Number(e.target.value))}
        />
      </div>

      <div>
        Restricciones:
        <input
          type="number"
          min="1"
          value={numCons}
          onChange={(e) => setNumCons(Number(e.target.value))}
        />
      </div>

      <button onClick={generarFormulario}>Generar</button>

      {c.length > 0 && (
        <>
          <h3>Max Z =</h3>
          {c.map((coef, i) => (
            <input
              key={i}
              type="number"
              value={coef}
              onChange={(e) => {
                const nueva = [...c];
                nueva[i] = Number(e.target.value);
                setC(nueva);
              }}
            />
          ))}

          <h3>Restricciones (≤)</h3>

          {A.map((fila, i) => (
            <div key={i}>
              {fila.map((coef, j) => (
                <input
                  key={j}
                  type="number"
                  value={coef}
                  onChange={(e) => {
                    const nuevaA = [...A];
                    nuevaA[i][j] = Number(e.target.value);
                    setA(nuevaA);
                  }}
                />
              ))}
              ≤
              <input
                type="number"
                value={b[i]}
                onChange={(e) => {
                  const nuevaB = [...b];
                  nuevaB[i] = Number(e.target.value);
                  setB(nuevaB);
                }}
              />
            </div>
          ))}

          <button onClick={manejarResolver}>Resolver</button>
        </>
      )}

      {resultado && (
        <div>
          <h3>Resultado</h3>
          <p>Status: {resultado.status}</p>

          {resultado.status === "OPTIMO" && (
            <>
              <p>Z = {resultado.solution.z.toFixed(4)}</p>
              <p>
                {resultado.solution.x.map((val, i) =>
                  `x${i + 1} = ${val.toFixed(4)} `
                )}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SimplexUI;
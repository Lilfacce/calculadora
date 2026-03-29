import { useState } from "react";
import { solveSimplexMax } from "./solveSimplex";
import TablaSimplex from "./TablaSimplex";

function SimplexUI() {
  const [numVars, setNumVars] = useState(2);
  const [numCons, setNumCons] = useState(2);

  const [A, setA] = useState([]);
  const [b, setB] = useState([]);
  const [c, setC] = useState([]);

  const [resultado, setResultado] = useState(null);

  const generarFormulario = () => {
    setC(Array(numVars).fill(0));
    setA(Array(numCons).fill(null).map(() => Array(numVars).fill(0)));
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
      showIterations: true,
    });
    setResultado(res);
  };

  return (
    <div className="simplex-container">
      <h2>Método Simplex (Maximización)</h2>

      {/* CONFIGURACIÓN */}
      <section className="card">
        <h3>Configuración</h3>

        <label>
          Variables:
          <input
            type="number"
            min="1"
            value={numVars}
            onChange={(e) => setNumVars(Number(e.target.value))}
          />
        </label>

        <label>
          Restricciones:
          <input
            type="number"
            min="1"
            value={numCons}
            onChange={(e) => setNumCons(Number(e.target.value))}
          />
        </label>

        <button onClick={generarFormulario}>Generar modelo</button>
      </section>

      {/* MODELO */}
      {c.length > 0 && (
        <>
          {/* FUNCIÓN OBJETIVO */}
          <section className="card">
            <h3>Función Objetivo</h3>
            <p>Maximizar:</p>

            <div className="row">
              {c.map((coef, i) => (
                <div key={i} className="inline-input">
                  <input
                    type="number"
                    value={coef}
                    onChange={(e) => {
                      const nueva = [...c];
                      nueva[i] = Number(e.target.value);
                      setC(nueva);
                    }}
                  />
                  <span>x{i + 1}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RESTRICCIONES */}
          <section className="card">
            <h3>Restricciones (≤)</h3>

            {A.map((fila, i) => (
              <div key={i} className="row">
                {fila.map((coef, j) => (
                  <div key={j} className="inline-input">
                    <input
                      type="number"
                      value={coef}
                      onChange={(e) => {
                        const nuevaA = [...A];
                        nuevaA[i][j] = Number(e.target.value);
                        setA(nuevaA);
                      }}
                    />
                    <span>x{j + 1}</span>
                  </div>
                ))}

                <span className="ineq">≤</span>

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
          </section>

          <button className="resolver-btn" onClick={manejarResolver}>
            Resolver
          </button>
        </>
      )}

      {/* RESULTADO */}
      {resultado && (
        <section className="card">
          <h3>Resultado</h3>
          <p><strong>Estado:</strong> {resultado.status}</p>

          {resultado.status === "OPTIMO" && (
            <>
              <p><strong>Z =</strong> {resultado.solution.z.toFixed(4)}</p>
              <ul>
                {resultado.solution.x.map((val, i) => (
                  <li key={i}>
                    x{i + 1} = {val.toFixed(4)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {/* ITERACIONES */}
      {resultado?.iterations && (
        <section className="card">
          <TablaSimplex iterations={resultado.iterations} />
        </section>
      )}
    </div>
  );
}

export default SimplexUI;
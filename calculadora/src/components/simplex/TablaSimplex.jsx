// TablaSimplex.jsx

function toFraction(value, tol = 1e-9, maxDen = 1000) {
  if (Math.abs(value) < tol) return "0";

  const sign = value < 0 ? "-" : "";
  value = Math.abs(value);

  let bestNum = 1;
  let bestDen = 1;
  let bestErr = Math.abs(value - bestNum / bestDen);

  for (let den = 1; den <= maxDen; den++) {
    const num = Math.round(value * den);
    const err = Math.abs(value - num / den);

    if (err < bestErr - tol) {
      bestErr = err;
      bestNum = num;
      bestDen = den;
    }
    if (bestErr < tol) break;
  }

  if (bestDen === 1) return sign + bestNum;
  return `${sign}${bestNum}/${bestDen}`;
}

function TablaSimplex({ iterations }) {
  if (!iterations || iterations.length === 0) return null;

  return (
    <div>
      <h3>Iteraciones del Método Simplex</h3>

      {iterations.map((step, index) => {
        const tableau = step.tableau;
        if (!tableau) return null;

        const m = tableau.length - 1;      // restricciones
        const totalCols = tableau[0].length;
        const n = totalCols - m - 1;       // variables originales

        return (
          <div key={index} className="iteration">
            <h4>
              Iteración {step.iter}
            </h4>

            <table border="1" cellPadding="6">
              <thead>
                <tr>
                  <th></th>
                  {/* Variables x */}
                  {Array.from({ length: n }).map((_, j) => (
                    <th key={`x${j}`}>x{j + 1}</th>
                  ))}
                  {/* Variables slack */}
                  {Array.from({ length: m }).map((_, j) => (
                    <th key={`s${j}`}>s{j + 1}</th>
                  ))}
                  <th>R</th>
                </tr>
              </thead>

              <tbody>
                {tableau.map((row, i) => (
                  <tr key={i}>
                    {/* Etiqueta de fila */}
                    <th>
                      {i < m ? `R${i + 1}` : "Z"}
                    </th>

                    {row.map((cell, j) => (
                      <td key={j}>{toFraction(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {step.enteringCol !== null && (
              <p>VE: x{step.enteringCol + 1}</p>
            )}

            {step.leavingRow !== null && (
              <p>VS: R{step.leavingRow + 1}</p>
            )}

            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default TablaSimplex;
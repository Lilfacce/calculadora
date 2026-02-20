function TablaSimplex({ iterations }) {
  return (
    <div>
      <h3>Iteraciones</h3>

      {iterations.map((step, index) => (
        <div key={index}>
          <h4>Iteración {step.iter}</h4>

          {step.tableau && (
            <table border="1">
              <tbody>
                {step.tableau.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{Number(cell).toFixed(2)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {step.enteringCol !== null && (
            <p>Entra columna: {step.enteringCol + 1}</p>
          )}

          {step.leavingRow !== null && (
            <p>Sale fila: {step.leavingRow + 1}</p>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default TablaSimplex;
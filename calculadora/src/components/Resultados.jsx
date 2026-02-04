function Resultados({ resultado }) {
  const width = 400;
  const height = 400;
  const padding = 40;

  if (!resultado) {
    return (
      <section className="results">
        <h2>Resultados</h2>
        <p>Presiona "Graficar" para mostrar los resultados.</p>
      </section>
    );
  }

  if (resultado.estado !== "optimo") {
    return (
      <section className="results">
        <h2>Resultados</h2>
        <p>{resultado.mensaje}</p>
      </section>
    );
  }

  const puntos = resultado.regionFactibleOrdenada;

  const maxX = Math.max(...puntos.map(p => p.x1)) * 1.2;
  const maxY = Math.max(...puntos.map(p => p.x2)) * 1.2;

  const escalaX = (width - 2 * padding) / maxX;
  const escalaY = (height - 2 * padding) / maxY;

  const mapX = x => padding + x * escalaX;
  const mapY = y => height - padding - y * escalaY;

  const puntosPoligono = puntos
    .map(p => `${mapX(p.x1)},${mapY(p.x2)}`)
    .join(" ");

  const ticksX = Math.ceil(maxX);
  const ticksY = Math.ceil(maxY);

  const { solucionOptima } = resultado;
  const solucionesMultiples = solucionOptima.multiples || [];

  return (
    <section className="results">
      <h2>Resultados</h2>

      {/* Texto de la solución */}
      <p>
        <strong>Solución óptima:</strong><br />
        x₁ = {solucionOptima.x1.toFixed(2)} <br />
        x₂ = {solucionOptima.x2.toFixed(2)} <br />
        Z = {solucionOptima.z.toFixed(2)}
      </p>

      {/* Óptimo múltiple */}
      {solucionesMultiples.length > 1 && (
        <>
          <p><strong>Soluciones óptimas múltiples:</strong></p>
          <ul>
            {solucionesMultiples.map((s, i) => (
              <li key={i}>
                {s.punto}: (x₁ = {s.x1.toFixed(2)}, x₂ = {s.x2.toFixed(2)})
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="graph-container">
        <svg width={width} height={height}>
          {/* Ejes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="black"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="black"
          />

          {/* Ticks eje X */}
          {Array.from({ length: ticksX + 1 }).map((_, i) => (
            <g key={`x-${i}`}>
              <line
                x1={mapX(i)}
                y1={height - padding}
                x2={mapX(i)}
                y2={height - padding + 5}
                stroke="black"
              />
              <text
                x={mapX(i)}
                y={height - padding + 18}
                fontSize="10"
                textAnchor="middle"
              >
                {i}
              </text>
            </g>
          ))}

          {/* Ticks eje Y */}
          {Array.from({ length: ticksY + 1 }).map((_, i) => (
            <g key={`y-${i}`}>
              <line
                x1={padding - 5}
                y1={mapY(i)}
                x2={padding}
                y2={mapY(i)}
                stroke="black"
              />
              <text
                x={padding - 10}
                y={mapY(i) + 4}
                fontSize="10"
                textAnchor="end"
              >
                {i}
              </text>
            </g>
          ))}

          {/* Rectas de restricciones */}
          {resultado.rectas.map((r, i) => {
            if (!r.interceptos.ejeX || !r.interceptos.ejeY) return null;

            return (
              <line
                key={i}
                x1={mapX(r.interceptos.ejeX.x)}
                y1={mapY(0)}
                x2={mapX(0)}
                y2={mapY(r.interceptos.ejeY.y)}
                stroke="gray"
                strokeDasharray="5,5"
              />
            );
          })}

          {/* Región factible */}
          <polygon
            points={puntosPoligono}
            fill="rgba(0, 150, 255, 0.3)"
            stroke="blue"
          />

          {/* Puntos factibles */}
          {puntos.map((p, i) => (
            <circle
              key={i}
              cx={mapX(p.x1)}
              cy={mapY(p.x2)}
              r={4}
              fill="blue"
            />
          ))}

          {/* Soluciones óptimas múltiples */}
          {solucionesMultiples.map((s, i) => (
            <g key={i}>
              <circle
                cx={mapX(s.x1)}
                cy={mapY(s.x2)}
                r={6}
                fill="red"
              />
              <text
                x={mapX(s.x1) + 6}
                y={mapY(s.x2) - 6}
                fontSize="10"
                fill="red"
              >
                ({s.x1.toFixed(1)}, {s.x2.toFixed(1)})
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

export default Resultados;

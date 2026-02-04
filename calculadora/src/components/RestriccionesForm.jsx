function RestriccionesForm({ restricciones, setRestricciones }) {
  const agregarRestriccion = () => {
    setRestricciones([
      ...restricciones,
      { x1: 0, x2: 0, op: "<=", b: 0 },
    ]);
  };

  const quitarRestriccion = () => {
    if (restricciones.length > 1) {
      setRestricciones(restricciones.slice(0, -1));
    }
  };

  const actualizarRestriccion = (index, campo, valor) => {
    const nuevas = [...restricciones];
    nuevas[index][campo] = valor;
    setRestricciones(nuevas);
  };

  return (
    <section className="section">
      <h2>Restricciones</h2>

      <div className="button-group">
        <button type="button" onClick={agregarRestriccion}>+</button>
        <button type="button" onClick={quitarRestriccion}>−</button>
      </div>

      {restricciones.map((r, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Coeficiente x1"
            value={r.x1}
            onChange={(e) =>
              actualizarRestriccion(index, "x1", Number(e.target.value))
            }
          />
          <span>x1 +</span>

          <input
            type="text"
            placeholder="Coeficiente x2"
            value={r.x2}
            onChange={(e) =>
              actualizarRestriccion(index, "x2", Number(e.target.value))
            }
          />
          <span>x2</span>

          <select
            value={r.op}
            onChange={(e) =>
              actualizarRestriccion(index, "op", e.target.value)
            }
          >
            <option value="<=">&le;</option>
            <option value=">=">&ge;</option>
            <option value="=">=</option>
          </select>

          <input
            type="text"
            placeholder="Resultado"
            value={r.b}
            onChange={(e) =>
              actualizarRestriccion(index, "b", Number(e.target.value))
            }
          />
        </div>
      ))}
    </section>
  );
}

export default RestriccionesForm;

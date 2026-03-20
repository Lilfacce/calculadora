function RestriccionesForm({ restricciones, setRestricciones }) {
  const agregarRestriccion = () => {
    setRestricciones([
      ...restricciones,
      { x1: 0, x2: 0, op: "<=", b: 0 },
    ]);
  };

  const quitarRestriccion = (index) => {
    if (restricciones.length > 1) {
      setRestricciones(
        restricciones.filter((_, i) => i !== index)
      );
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
      </div>

      {restricciones.map((r, index) => (
        <div key={index} className="restriccion-row">
          <input
            type="number"
            placeholder="Coef x"
            value={r.x1}
            onChange={(e) =>
              actualizarRestriccion(index, "x1", Number(e.target.value))
            }
          />
          <span>x</span>

          <span>+</span>

          <input
            type="number"
            placeholder="Coef y"
            value={r.x2}
            onChange={(e) =>
              actualizarRestriccion(index, "x2", Number(e.target.value))
            }
          />
          <span>y</span>

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
            type="number"
            placeholder="b"
            value={r.b}
            onChange={(e) =>
              actualizarRestriccion(index, "b", Number(e.target.value))
            }
          />

          <button
            type="button"
            onClick={() => quitarRestriccion(index)}
            title="Eliminar restricción"
          >
            -
          </button>
        </div>
      ))}
    </section>
  );
}

export default RestriccionesForm;
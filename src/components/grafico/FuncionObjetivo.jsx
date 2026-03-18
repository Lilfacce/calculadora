function FuncionObjetivo({ tipo, setTipo, funcionObjetivo, setFuncionObjetivo }) {
  return (
    <section className="section">
      <h2>Función Objetivo</h2>

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="maximizar">Maximizar</option>
        <option value="minimizar">Minimizar</option>
      </select>

      <div>
        <input
          type="text"
          placeholder="Coeficiente x1"
          value={funcionObjetivo.x1}
          onChange={(e) =>
            setFuncionObjetivo({
              ...funcionObjetivo,
              x1: Number(e.target.value),
            })
          }
        />
        <span>x1 +</span>

        <input
          type="text"
          placeholder="Coeficiente x2"
          value={funcionObjetivo.x2}
          onChange={(e) =>
            setFuncionObjetivo({
              ...funcionObjetivo,
              x2: Number(e.target.value),
            })
          }
        />
        <span>x2</span>
      </div>
    </section>
  );
}

export default FuncionObjetivo;

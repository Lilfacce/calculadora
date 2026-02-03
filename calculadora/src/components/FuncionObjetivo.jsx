function FuncionObjetivo() {
  return (
    <section className="section">
      <h2>Función Objetivo</h2>

      <select>
        <option>Maximizar</option>
        <option>Minimizar</option>
      </select>

      <div>
        <input type="number" placeholder="Coeficiente x1" />
        <span>x1 +</span>

        <input type="number" placeholder="Coeficiente x2" />
        <span>x2</span>
      </div>
    </section>
  );
}

export default FuncionObjetivo;

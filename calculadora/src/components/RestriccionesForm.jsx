function RestriccionesForm() {
  return (
    <section className="section">
      <h2>Restricciones</h2>

      <div>
        <input type="number" placeholder="Coeficiente x1" />
        <span>x1 +</span>

        <input type="number" placeholder="Coeficiente x2" />
        <span>x2</span>

        <select>
          <option>&le;</option>
          <option>&ge;</option>
          <option>=</option>
        </select>

        <input type="number" placeholder="Resultado" />
      </div>
    </section>
  );
}

export default RestriccionesForm;

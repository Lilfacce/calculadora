function VariablesForm() {
  return (
    <section className="section">
      <h2>Configuración del modelo</h2>

      <label>
        Número de variables
        <input type="number" />
      </label>

      <label>
        Número de restricciones
        <input type="number" />
      </label>
    </section>
  );
}

export default VariablesForm;

import './App.css';
import FuncionObjetivo from './components/FuncionObjetivo';
import RestriccionesForm from './components/RestriccionesForm';
import VariablesForm from './components/VariablesForm';
import Resultados from './components/Resultados';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Calculadora de Programación Lineal</h1>

      <VariablesForm />
      <FuncionObjetivo />
      <RestriccionesForm />

      <div className="button-group">
        <button>Calcular</button>
        <button>Limpiar</button>
      </div>

      <Resultados />
    </div>
  );
}

export default App;


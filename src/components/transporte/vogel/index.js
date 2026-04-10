import {
  balancearProblema,
  crearMatriz,
  calcularCostoTotal,
  obtenerCeldasActivasFila,
  obtenerCeldasActivasColumna,
} from "../utils";

function calcularPenalizacion(lista) {
  if (lista.length === 0) return -1;
  if (lista.length === 1) return lista[0].costo;
  return lista[1].costo - lista[0].costo;
}

export function resolverVogel(data) {
  const { costos, oferta, demanda, balanceado, tipoBalanceo } = balancearProblema(data);

  const m = oferta.length;
  const n = demanda.length;

  const asignaciones = crearMatriz(m, n, 0);
  const ofertaRestante = [...oferta];
  const demandaRestante = [...demanda];
  const filasActivas = Array(m).fill(true);
  const columnasActivas = Array(n).fill(true);
  const pasos = [];

  while (filasActivas.some(Boolean) && columnasActivas.some(Boolean)) {
    const opciones = [];

    for (let i = 0; i < m; i++) {
      if (!filasActivas[i] || ofertaRestante[i] === 0) continue;

      const celdasFila = obtenerCeldasActivasFila(costos, i, columnasActivas, demandaRestante);
      if (celdasFila.length === 0) continue;

      opciones.push({
        tipo: "fila",
        indice: i,
        penalizacion: calcularPenalizacion(celdasFila),
        mejorCelda: celdasFila[0],
      });
    }

    for (let j = 0; j < n; j++) {
      if (!columnasActivas[j] || demandaRestante[j] === 0) continue;

      const celdasColumna = obtenerCeldasActivasColumna(costos, j, filasActivas, ofertaRestante);
      if (celdasColumna.length === 0) continue;

      opciones.push({
        tipo: "columna",
        indice: j,
        penalizacion: calcularPenalizacion(celdasColumna),
        mejorCelda: celdasColumna[0],
      });
    }

    if (opciones.length === 0) break;

    opciones.sort((a, b) => {
      if (b.penalizacion !== a.penalizacion) {
        return b.penalizacion - a.penalizacion;
      }

      if (a.mejorCelda.costo !== b.mejorCelda.costo) {
        return a.mejorCelda.costo - b.mejorCelda.costo;
      }

      return 0;
    });

    const seleccion = opciones[0];
    const { fila, columna, costo } = seleccion.mejorCelda;
    const cantidad = Math.min(ofertaRestante[fila], demandaRestante[columna]);

    asignaciones[fila][columna] = cantidad;

    pasos.push({
      seleccionTipo: seleccion.tipo,
      seleccionIndice: seleccion.indice,
      penalizacion: seleccion.penalizacion,
      fila,
      columna,
      costo,
      asignado: cantidad,
      ofertaAntes: ofertaRestante[fila],
      demandaAntes: demandaRestante[columna],
      ofertaDespues: ofertaRestante[fila] - cantidad,
      demandaDespues: demandaRestante[columna] - cantidad,
    });

    ofertaRestante[fila] -= cantidad;
    demandaRestante[columna] -= cantidad;

    if (ofertaRestante[fila] === 0) filasActivas[fila] = false;
    if (demandaRestante[columna] === 0) columnasActivas[columna] = false;
  }

  return {
    metodo: "Vogel",
    asignaciones,
    costoTotal: calcularCostoTotal(costos, asignaciones),
    ofertaFinal: ofertaRestante,
    demandaFinal: demandaRestante,
    balanceado,
    tipoBalanceo,
    pasos,
  };
}
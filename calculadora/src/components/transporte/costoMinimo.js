import {
  balancearProblema,
  crearMatriz,
  calcularCostoTotal,
} from "../../utils";

export function resolverCostoMinimo(data) {
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
    let mejorCelda = null;

    for (let i = 0; i < m; i++) {
      if (!filasActivas[i] || ofertaRestante[i] === 0) continue;

      for (let j = 0; j < n; j++) {
        if (!columnasActivas[j] || demandaRestante[j] === 0) continue;

        const actual = {
          fila: i,
          columna: j,
          costo: costos[i][j],
        };

        if (
          !mejorCelda ||
          actual.costo < mejorCelda.costo ||
          (actual.costo === mejorCelda.costo &&
            Math.min(ofertaRestante[i], demandaRestante[j]) >
              Math.min(ofertaRestante[mejorCelda.fila], demandaRestante[mejorCelda.columna]))
        ) {
          mejorCelda = actual;
        }
      }
    }

    if (!mejorCelda) break;

    const { fila, columna, costo } = mejorCelda;
    const cantidad = Math.min(ofertaRestante[fila], demandaRestante[columna]);

    asignaciones[fila][columna] = cantidad;

    pasos.push({
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
    metodo: "Costo Mínimo",
    asignaciones,
    costoTotal: calcularCostoTotal(costos, asignaciones),
    ofertaFinal: ofertaRestante,
    demandaFinal: demandaRestante,
    balanceado,
    tipoBalanceo,
    pasos,
  };
}
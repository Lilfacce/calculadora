import {
  balancearProblema,
  crearMatriz,
  calcularCostoTotal,
} from "../../utils";

export function resolverEsquinaNoroeste(data) {
  const { costos, oferta, demanda, balanceado, tipoBalanceo } = balancearProblema(data);

  const m = oferta.length;
  const n = demanda.length;

  const asignaciones = crearMatriz(m, n, 0);
  const ofertaRestante = [...oferta];
  const demandaRestante = [...demanda];
  const pasos = [];

  let i = 0;
  let j = 0;

  while (i < m && j < n) {
    const cantidad = Math.min(ofertaRestante[i], demandaRestante[j]);
    asignaciones[i][j] = cantidad;

    pasos.push({
      fila: i,
      columna: j,
      costo: costos[i][j],
      asignado: cantidad,
      ofertaAntes: ofertaRestante[i],
      demandaAntes: demandaRestante[j],
      ofertaDespues: ofertaRestante[i] - cantidad,
      demandaDespues: demandaRestante[j] - cantidad,
    });

    ofertaRestante[i] -= cantidad;
    demandaRestante[j] -= cantidad;

    if (ofertaRestante[i] === 0 && demandaRestante[j] === 0) {
      i++;
      j++;
    } else if (ofertaRestante[i] === 0) {
      i++;
    } else if (demandaRestante[j] === 0) {
      j++;
    }
  }

  return {
    metodo: "Esquina Noroeste",
    asignaciones,
    costoTotal: calcularCostoTotal(costos, asignaciones),
    ofertaFinal: ofertaRestante,
    demandaFinal: demandaRestante,
    balanceado,
    tipoBalanceo,
    pasos,
  };
}
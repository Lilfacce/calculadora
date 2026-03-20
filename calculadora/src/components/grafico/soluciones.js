// src/logica/soluciones.js

const EPS = 1e-9;
const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function casiIgual(a, b, eps = 1e-7) {
  return Math.abs(a - b) <= eps;
}

function agregarNoNegatividad(restricciones) {
  return [
    ...restricciones,
    { x1: 1, x2: 0, op: ">=", b: 0 }, // x1 >= 0
    { x1: 0, x2: 1, op: ">=", b: 0 }, // x2 >= 0
  ];
}

function cumple(p, r) {
  const lhs = r.x1 * p.x + r.x2 * p.y;
  if (r.op === "<=") return lhs <= r.b + 1e-7;
  if (r.op === ">=") return lhs >= r.b - 1e-7;
  if (r.op === "=") return casiIgual(lhs, r.b);
  throw new Error(`Operador inválido: ${r.op}`);
}

function calcularInterseccion(r1, r2) {
  // r: a x + b y = c
  const a1 = r1.x1, b1 = r1.x2, c1 = r1.b;
  const a2 = r2.x1, b2 = r2.x2, c2 = r2.b;

  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < EPS) return null;

  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;

  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function quitarDuplicados(puntos) {
  const salida = [];
  for (const p of puntos) {
    const existe = salida.some(q => Math.hypot(p.x - q.x, p.y - q.y) < 1e-6);
    if (!existe) salida.push(p);
  }
  return salida;
}

function ordenarRegion(puntosEtiquetados) {
  if (puntosEtiquetados.length <= 2) return puntosEtiquetados;

  const cx = puntosEtiquetados.reduce((s, p) => s + p.x1, 0) / puntosEtiquetados.length;
  const cy = puntosEtiquetados.reduce((s, p) => s + p.x2, 0) / puntosEtiquetados.length;

  return [...puntosEtiquetados].sort((p1, p2) => {
    const a1 = Math.atan2(p1.x2 - cy, p1.x1 - cx);
    const a2 = Math.atan2(p2.x2 - cy, p2.x1 - cx);
    return a1 - a2;
  });
}

function valorZ(funcionObjetivo, punto) {
  return funcionObjetivo.x1 * punto.x1 + funcionObjetivo.x2 * punto.x2;
}

function interceptosDeRecta(a, b, c) {
  // a*x + b*y = c
  const ejeX = Math.abs(a) < EPS ? null : { x: c / a, y: 0 };
  const ejeY = Math.abs(b) < EPS ? null : { x: 0, y: c / b };
  return { ejeX, ejeY };
}

function ordenarParaTabla(puntos) {
  // Orden “bonito” y estable: primero mayor y (arriba), luego menor x (izquierda)
  // así suele salir similar a webs (ej: (4,10), (9,0), (0,14), (0,0) según caso)
  return [...puntos].sort((p1, p2) => (p2.y - p1.y) || (p1.x - p2.x));
}

/**
 * Resolver Programación Lineal por método gráfico (2 variables).
 * @param {import("./tipos").ProblemaPL} problema
 * @returns {import("./tipos").ResultadoPL}
 */
export function resolverPL(problema) {
  if (!problema || !problema.funcionObjetivo || !Array.isArray(problema.restricciones)) {
    throw new Error("Problema inválido: falta funcionObjetivo/restricciones");
  }
  if (!["maximizar", "minimizar"].includes(problema.tipo)) {
    throw new Error("tipo debe ser 'maximizar' o 'minimizar'");
  }

  let restricciones = problema.restricciones;
  if (problema.noNegatividad) {
    restricciones = agregarNoNegatividad(restricciones);
  }

  // Rectas para graficar: a*x + b*y = c
  const rectas = restricciones.map(r => ({
    a: r.x1,
    b: r.x2,
    c: r.b,
    op: r.op,
    interceptos: interceptosDeRecta(r.x1, r.x2, r.b),
  }));

  // Intersecciones entre todas las parejas de rectas (tratándolas como igualdades)
  const comoIgualdades = restricciones.map(r => ({ ...r, op: "=" }));
  let intersecciones = [];
  for (let i = 0; i < comoIgualdades.length; i++) {
    for (let j = i + 1; j < comoIgualdades.length; j++) {
      const p = calcularInterseccion(comoIgualdades[i], comoIgualdades[j]);
      if (p) intersecciones.push(p);
    }
  }
  intersecciones = quitarDuplicados(intersecciones);

  // Filtrar puntos factibles
  const puntosFactibles = intersecciones.filter(p =>
    restricciones.every(r => cumple(p, r))
  );

  if (puntosFactibles.length === 0) {
    return {
      estado: "sin_solucion",
      mensaje: "No existe región factible para estas restricciones.",
      rectas,
      intersecciones,
      solucionesFactibles: [],
      regionFactibleOrdenada: [],
      tabla: [],
      solucionOptima: null,
      cantidadSolucionesFactibles: 0,
    };
  }

  // Orden estable para etiquetar A,B,C...
  const ordenados = ordenarParaTabla(puntosFactibles);

  const solucionesFactibles = ordenados.map((p, i) => ({
    punto: LETRAS[i] || `P${i}`,
    x1: p.x,
    x2: p.y,
  }));

  // Tabla de evaluación
  const tabla = solucionesFactibles.map(s => ({
    punto: s.punto,
    x1: s.x1,
    x2: s.x2,
    z: valorZ(problema.funcionObjetivo, s),
  }));

  // Elegir óptimo
  let mejor = tabla[0];
  for (const fila of tabla) {
    if (problema.tipo === "maximizar") {
      if (fila.z > mejor.z + 1e-7) mejor = fila;
    } else {
      if (fila.z < mejor.z - 1e-7) mejor = fila;
    }
  }

  // Óptimo múltiple
  const multiples = tabla
    .filter(f => casiIgual(f.z, mejor.z))
    .map(f => ({ punto: f.punto, x1: f.x1, x2: f.x2 }));

  const solucionOptima = {
    punto: mejor.punto,
    x1: mejor.x1,
    x2: mejor.x2,
    z: mejor.z,
    multiples,
  };

  // Región factible ordenada (para dibujar polígono)
  const regionFactibleOrdenada = ordenarRegion(solucionesFactibles);

  return {
    estado: "optimo",
    mensaje: multiples.length > 1
      ? "Se encontró solución óptima múltiple (mismo valor de Z en varios puntos)."
      : "Óptimo encontrado.",
    rectas,
    intersecciones,
    solucionesFactibles,
    regionFactibleOrdenada,
    tabla,
    solucionOptima,
    cantidadSolucionesFactibles: solucionesFactibles.length,
  };
}
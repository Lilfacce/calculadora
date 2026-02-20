// src/logica/ejemplos.js

export const ejemploBasico = {
  tipo: "maximizar",
  funcionObjetivo: { x1: 3, x2: 2 },
  restricciones: [
    { x1: 2, x2: 1, op: "<=", b: 18 }, // 2x1 + x2 <= 18
    { x1: 1, x2: 1, op: "<=", b: 14 }, // x1 + x2 <= 14
  ],
  noNegatividad: true,
};

export const ejemploSinSolucion = {
  tipo: "maximizar",
  funcionObjetivo: { x1: 1, x2: 1 },
  restricciones: [
    { x1: 1, x2: 0, op: "<=", b: 1 }, // x1 <= 1
    { x1: 1, x2: 0, op: ">=", b: 5 }, // x1 >= 5
  ],
  noNegatividad: true,
};
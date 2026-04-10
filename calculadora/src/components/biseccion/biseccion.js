/**
 * biseccion(f, a, b, opciones)
 *
 * Encuentra la raíz de f(x) en el intervalo [a, b] por el método de bisección.
 *
 * @param {Function} f        - Función continua f(x)
 * @param {number}   a        - Extremo izquierdo del intervalo
 * @param {number}   b        - Extremo derecho del intervalo
 * @param {object}   opciones
 *   @param {number}  tolerancia  - Criterio de parada (default: 1e-7)
 *   @param {number}  maxIter     - Máximo de iteraciones (default: 100)
 *   @param {boolean} verbose     - Imprime tabla de iteraciones (default: false)
 *
 * @returns {{ raiz, fx, iteraciones, convergio, historia }}
 */
function biseccion(f, a, b, { tolerancia = 1e-7, maxIter = 100, verbose = false } = {}) {
 
  if (typeof f !== "function") throw new TypeError("f debe ser una función.");
  if (a >= b)                  throw new RangeError("a debe ser estrictamente menor que b.");
  if (tolerancia <= 0)         throw new RangeError("La tolerancia debe ser positiva.");
 
  const fa = f(a);
  const fb = f(b);
 
  if (Math.abs(fa) < Number.EPSILON) return { raiz: a, fx: fa, iteraciones: 0, convergio: true, historia: [] };
  if (Math.abs(fb) < Number.EPSILON) return { raiz: b, fx: fb, iteraciones: 0, convergio: true, historia: [] };
 
  if (fa * fb > 0) {
    throw new Error(
      `No se garantiza raíz en [${a}, ${b}]. ` +
      `f(${a}) = ${fa.toFixed(6)}, f(${b}) = ${fb.toFixed(6)} tienen el mismo signo.`
    );
  }
 
  const historia = [];
  let izq = a, der = b;
 
  if (verbose) {
    console.log("Iter |       a        |       b        |       c        |     f(c)     |    |b-a|");
    console.log("─".repeat(90));
  }
 
  for (let i = 1; i <= maxIter; i++) {
    const c  = (izq + der) / 2;
    const fc = f(c);
    const error = (der - izq) / 2;
 
    historia.push({ iteracion: i, a: izq, b: der, c, fc, error });
 
    if (verbose) {
      console.log(
        `${String(i).padStart(4)} | ` +
        `${izq.toFixed(10).padStart(14)} | ` +
        `${der.toFixed(10).padStart(14)} | ` +
        `${c.toFixed(10).padStart(14)} | ` +
        `${fc.toExponential(4).padStart(12)} | ` +
        `${error.toExponential(4)}`
      );
    }
 
    if (Math.abs(fc) < Number.EPSILON || error < tolerancia) {
      return { raiz: c, fx: fc, iteraciones: i, convergio: true, historia };
    }
 
    if (f(izq) * fc < 0) {
      der = c;
    } else {
      izq = c;
    }
  }
 
  const ultimo = historia[historia.length - 1];
  return { raiz: ultimo.c, fx: ultimo.fc, iteraciones: maxIter, convergio: false, historia };
}
 
if (typeof module !== "undefined") module.exports = { biseccion };
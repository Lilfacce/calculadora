// src/logica/tipos.js

/**
 * TIPOS / CONTRATO DEL SOLVER (solo documentación, no afecta runtime)
 *
 * @typedef {"maximizar"|"minimizar"} TipoOptimizacion
 * @typedef {"<="|">="|"="} Operador
 *
 * @typedef {Object} FuncionObjetivo
 * @property {number} x1  Coeficiente de X1
 * @property {number} x2  Coeficiente de X2
 *
 * @typedef {Object} Restriccion
 * @property {number} x1  Coeficiente de X1
 * @property {number} x2  Coeficiente de X2
 * @property {Operador} op  <=, >= o =
 * @property {number} b   Término independiente
 *
 * @typedef {Object} ProblemaPL
 * @property {TipoOptimizacion} tipo                 "maximizar" o "minimizar"
 * @property {FuncionObjetivo} funcionObjetivo       Z = ax1 + bx2
 * @property {Restriccion[]} restricciones           Restricciones
 * @property {boolean} [noNegatividad]               Si true, agrega x1>=0 y x2>=0
 *
 * @typedef {Object} Interceptos
 * @property {{x:number,y:number} | null} ejeX  Corte con eje X (y=0)
 * @property {{x:number,y:number} | null} ejeY  Corte con eje Y (x=0)
 *
 * @typedef {Object} RectaParaGrafica
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {Operador} op
 * @property {Interceptos} interceptos
 *
 * @typedef {Object} PuntoEtiquetado
 * @property {string} punto
 * @property {number} x1
 * @property {number} x2
 *
 * @typedef {Object} FilaTabla
 * @property {string} punto
 * @property {number} x1
 * @property {number} x2
 * @property {number} z
 *
 * @typedef {Object} Optimo
 * @property {string} punto
 * @property {number} x1
 * @property {number} x2
 * @property {number} z
 * @property {Array<{punto:string,x1:number,x2:number}>} multiples
 *
 * @typedef {Object} ResultadoPL
 * @property {"optimo"|"sin_solucion"} estado
 * @property {string} mensaje
 * @property {RectaParaGrafica[]} rectas
 * @property {{x:number,y:number}[]} intersecciones
 * @property {PuntoEtiquetado[]} solucionesFactibles
 * @property {PuntoEtiquetado[]} regionFactibleOrdenada
 * @property {FilaTabla[]} tabla
 * @property {Optimo|null} solucionOptima
 * @property {number} cantidadSolucionesFactibles
 */

export {};
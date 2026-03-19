const BIG_M = 1000000;
const EPS = 1e-9;

function round(n, dec = 6) {
  return Number(Number(n).toFixed(dec));
}

function cloneMatrix(matrix) {
  return matrix.map(row => [...row]);
}

function makeNames(count, prefix) {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
}

function normalizeRestrictions(restricciones) {
  // Si b < 0, multiplicamos toda la restricción por -1
  // y cambiamos el signo
  return restricciones.map(r => {
    let { coef, signo, b } = r;
    let newCoef = [...coef];
    let newSigno = signo;
    let newB = b;

    if (newB < 0) {
      newCoef = newCoef.map(v => -v);
      newB = -newB;

      if (newSigno === "<=") newSigno = ">=";
      else if (newSigno === ">=") newSigno = "<=";
    }

    return {
      coef: newCoef,
      signo: newSigno,
      b: newB
    };
  });
}

function buildInitialTable(problem) {
  const { objetivo, c } = problem;
  const restricciones = normalizeRestrictions(problem.restricciones);

  const n = c.length;
  const originalNames = makeNames(n, "x");

  let variableNames = [...originalNames];
  let rows = restricciones.map(r => ({
    values: [...r.coef],
    b: r.b,
    signo: r.signo
  }));

  let base = [];
  let artificiales = [];

  let slackCount = 0;
  let surplusCount = 0;
  let artificialCount = 0;

  function addColumn(name) {
    variableNames.push(name);
    rows.forEach(r => r.values.push(0));
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (row.signo === "<=") {
      slackCount++;
      const s = `s${slackCount}`;
      addColumn(s);
      row.values[variableNames.length - 1] = 1;
      base[i] = s;
    } else if (row.signo === ">=") {
      surplusCount++;
      const e = `e${surplusCount}`;
      addColumn(e);
      row.values[variableNames.length - 1] = -1;

      artificialCount++;
      const a = `a${artificialCount}`;
      addColumn(a);
      row.values[variableNames.length - 1] = 1;
      base[i] = a;
      artificiales.push(a);
    } else if (row.signo === "=") {
      artificialCount++;
      const a = `a${artificialCount}`;
      addColumn(a);
      row.values[variableNames.length - 1] = 1;
      base[i] = a;
      artificiales.push(a);
    } else {
      throw new Error(`Signo no soportado: ${row.signo}`);
    }
  }

  const matrix = rows.map(r => [...r.values, r.b]);

  // Convertimos min a max internamente:
  // min c^T x  <=>  max (-c^T x)
  const internalC = objetivo === "min" ? c.map(v => -v) : [...c];

  // Vector de costos de todas las columnas
  const costVector = new Array(variableNames.length).fill(0);

  // variables originales
  for (let j = 0; j < n; j++) {
    costVector[j] = internalC[j];
  }

  // artificiales con penalización -M en maximización
  for (let j = 0; j < variableNames.length; j++) {
    if (artificiales.includes(variableNames[j])) {
      costVector[j] = -BIG_M;
    }
  }

  return {
    objetivo,
    variableNames,
    costVector,
    base,
    artificiales,
    matrix,
    originalCount: n
  };
}

function getCb(base, variableNames, costVector) {
  return base.map(basicVar => {
    const idx = variableNames.indexOf(basicVar);
    return costVector[idx];
  });
}

function computeZj(matrix, cb) {
  const cols = matrix[0].length;
  const zj = new Array(cols).fill(0);

  for (let j = 0; j < cols; j++) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
      sum += cb[i] * matrix[i][j];
    }
    zj[j] = sum;
  }

  return zj;
}

function computeCjMinusZj(costVector, zj) {
  const totalColsWithoutRHS = costVector.length;
  const row = new Array(totalColsWithoutRHS + 1).fill(0);

  for (let j = 0; j < totalColsWithoutRHS; j++) {
    row[j] = costVector[j] - zj[j];
  }

  // para RHS: 0 - Z_rhs
  row[totalColsWithoutRHS] = 0 - zj[totalColsWithoutRHS];
  return row;
}

function findEnteringColumn(cjMinusZj) {
  // Para maximización entra el mayor positivo
  let bestValue = EPS;
  let pivotCol = -1;

  for (let j = 0; j < cjMinusZj.length - 1; j++) {
    if (cjMinusZj[j] > bestValue) {
      bestValue = cjMinusZj[j];
      pivotCol = j;
    }
  }

  return pivotCol;
}

function findLeavingRow(matrix, pivotCol) {
  let bestRatio = Infinity;
  let pivotRow = -1;

  for (let i = 0; i < matrix.length; i++) {
    const aij = matrix[i][pivotCol];
    const bi = matrix[i][matrix[i].length - 1];

    if (aij > EPS) {
      const ratio = bi / aij;
      if (ratio < bestRatio - EPS) {
        bestRatio = ratio;
        pivotRow = i;
      }
    }
  }

  return pivotRow;
}

function pivot(matrix, pivotRow, pivotCol) {
  const newMatrix = cloneMatrix(matrix);
  const pivotElement = newMatrix[pivotRow][pivotCol];

  for (let j = 0; j < newMatrix[pivotRow].length; j++) {
    newMatrix[pivotRow][j] = newMatrix[pivotRow][j] / pivotElement;
  }

  for (let i = 0; i < newMatrix.length; i++) {
    if (i === pivotRow) continue;

    const factor = newMatrix[i][pivotCol];
    for (let j = 0; j < newMatrix[i].length; j++) {
      newMatrix[i][j] = newMatrix[i][j] - factor * newMatrix[pivotRow][j];
    }
  }

  // limpiar ruido numérico
  for (let i = 0; i < newMatrix.length; i++) {
    for (let j = 0; j < newMatrix[i].length; j++) {
      if (Math.abs(newMatrix[i][j]) < EPS) newMatrix[i][j] = 0;
      newMatrix[i][j] = round(newMatrix[i][j], 10);
    }
  }

  return newMatrix;
}

function buildSolution(base, variableNames, matrix) {
  const solution = {};
  variableNames.forEach(name => {
    solution[name] = 0;
  });

  for (let i = 0; i < base.length; i++) {
    solution[base[i]] = round(matrix[i][matrix[i].length - 1], 10);
  }

  return solution;
}

export function resolverGranM(problem, maxIter = 50) {
  const state = buildInitialTable(problem);

  let {
    objetivo,
    variableNames,
    costVector,
    base,
    artificiales,
    matrix,
    originalCount
  } = state;

  const iteraciones = [];

  for (let iter = 0; iter <= maxIter; iter++) {
    const cb = getCb(base, variableNames, costVector);
    const zj = computeZj(matrix, cb);
    const cjMinusZj = computeCjMinusZj(costVector, zj);

    iteraciones.push({
      iteracion: iter,
      base: [...base],
      cb: [...cb],
      columnas: [...variableNames],
      matriz: cloneMatrix(matrix),
      zj: [...zj],
      cjMinusZj: [...cjMinusZj]
    });

    const pivotCol = findEnteringColumn(cjMinusZj);

    // Óptimo alcanzado
    if (pivotCol === -1) {
      const solucion = buildSolution(base, variableNames, matrix);

      // Si alguna artificial queda positiva => inviable
      const artificialPositiva = artificiales.some(a => (solucion[a] || 0) > EPS);

      if (artificialPositiva) {
        return {
          exito: false,
          estado: "inviable",
          mensaje: "El problema no tiene solución factible.",
          iteraciones,
          solucion
        };
      }

      let valorObjetivoInterno = 0;
      for (let j = 0; j < originalCount; j++) {
        const varName = variableNames[j];
        valorObjetivoInterno += costVector[j] * (solucion[varName] || 0);
      }

      let valorZ;
      if (objetivo === "min") {
        valorZ = -valorObjetivoInterno;
      } else {
        valorZ = valorObjetivoInterno;
      }

      const solucionOriginal = {};
      for (let j = 0; j < originalCount; j++) {
        solucionOriginal[variableNames[j]] = solucion[variableNames[j]] || 0;
      }

      return {
        exito: true,
        estado: "optimo",
        mensaje: "Solución óptima encontrada.",
        iteraciones,
        solucion,
        solucionOriginal,
        valorZ: round(valorZ, 10)
      };
    }

    const pivotRow = findLeavingRow(matrix, pivotCol);

    if (pivotRow === -1) {
      return {
        exito: false,
        estado: "ilimitado",
        mensaje: "La solución es ilimitada.",
        iteraciones
      };
    }

    matrix = pivot(matrix, pivotRow, pivotCol);
    base[pivotRow] = variableNames[pivotCol];
  }

  return {
    exito: false,
    estado: "max_iter",
    mensaje: "Se alcanzó el máximo de iteraciones.",
    iteraciones
  };
}
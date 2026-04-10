export function validarDatosTransporte({ costos, oferta, demanda }) {
  if (!Array.isArray(costos) || costos.length === 0) {
    throw new Error("La matriz de costos es obligatoria.");
  }

  if (!Array.isArray(oferta) || oferta.length === 0) {
    throw new Error("El vector de oferta es obligatorio.");
  }

  if (!Array.isArray(demanda) || demanda.length === 0) {
    throw new Error("El vector de demanda es obligatorio.");
  }

  const columnas = costos[0].length;

  for (let i = 0; i < costos.length; i++) {
    if (!Array.isArray(costos[i])) {
      throw new Error("Cada fila de costos debe ser un arreglo.");
    }

    if (costos[i].length !== columnas) {
      throw new Error("Todas las filas de la matriz de costos deben tener el mismo tamaño.");
    }

    for (let j = 0; j < costos[i].length; j++) {
      if (typeof costos[i][j] !== "number" || costos[i][j] < 0) {
        throw new Error("Los costos deben ser números mayores o iguales a 0.");
      }
    }
  }

  if (oferta.length !== costos.length) {
    throw new Error("La cantidad de ofertas debe coincidir con el número de filas de la matriz de costos.");
  }

  if (demanda.length !== columnas) {
    throw new Error("La cantidad de demandas debe coincidir con el número de columnas de la matriz de costos.");
  }

  for (let i = 0; i < oferta.length; i++) {
    if (typeof oferta[i] !== "number" || oferta[i] < 0) {
      throw new Error("Los valores de oferta deben ser números mayores o iguales a 0.");
    }
  }

  for (let j = 0; j < demanda.length; j++) {
    if (typeof demanda[j] !== "number" || demanda[j] < 0) {
      throw new Error("Los valores de demanda deben ser números mayores o iguales a 0.");
    }
  }
}

export function sumaVector(vector) {
  return vector.reduce((acc, val) => acc + val, 0);
}

export function crearMatriz(filas, columnas, valor = 0) {
  return Array.from({ length: filas }, () => Array(columnas).fill(valor));
}

export function calcularCostoTotal(costos, asignaciones) {
  let total = 0;

  for (let i = 0; i < costos.length; i++) {
    for (let j = 0; j < costos[i].length; j++) {
      total += costos[i][j] * asignaciones[i][j];
    }
  }

  return total;
}

export function balancearProblema({ costos, oferta, demanda }) {
  validarDatosTransporte({ costos, oferta, demanda });

  const sumaOferta = sumaVector(oferta);
  const sumaDemanda = sumaVector(demanda);

  let nuevosCostos = costos.map((fila) => [...fila]);
  let nuevaOferta = [...oferta];
  let nuevaDemanda = [...demanda];
  let balanceado = false;
  let tipoBalanceo = "ninguno";

  if (sumaOferta > sumaDemanda) {
    const diferencia = sumaOferta - sumaDemanda;
    nuevaDemanda.push(diferencia);
    nuevosCostos = nuevosCostos.map((fila) => [...fila, 0]);
    balanceado = true;
    tipoBalanceo = "columna-ficticia";
  } else if (sumaDemanda > sumaOferta) {
    const diferencia = sumaDemanda - sumaOferta;
    nuevaOferta.push(diferencia);
    nuevosCostos.push(new Array(nuevaDemanda.length).fill(0));
    balanceado = true;
    tipoBalanceo = "fila-ficticia";
  }

  return {
    costos: nuevosCostos,
    oferta: nuevaOferta,
    demanda: nuevaDemanda,
    balanceado,
    tipoBalanceo,
  };
}

export function obtenerCeldasActivasFila(costos, fila, columnasActivas, demandaRestante) {
  const celdas = [];

  for (let j = 0; j < costos[fila].length; j++) {
    if (columnasActivas[j] && demandaRestante[j] > 0) {
      celdas.push({ costo: costos[fila][j], fila, columna: j });
    }
  }

  return celdas.sort((a, b) => a.costo - b.costo);
}

export function obtenerCeldasActivasColumna(costos, columna, filasActivas, ofertaRestante) {
  const celdas = [];

  for (let i = 0; i < costos.length; i++) {
    if (filasActivas[i] && ofertaRestante[i] > 0) {
      celdas.push({ costo: costos[i][columna], fila: i, columna });
    }
  }

  return celdas.sort((a, b) => a.costo - b.costo);
}
// Crear matriz vacía
export function crearMatriz(filas, columnas, valorInicial = 0) {
  return Array.from({ length: filas }, () =>
    Array(columnas).fill(valorInicial)
  );
}

// Calcular costo total
export function calcularCostoTotal(costos, asignaciones) {
  let total = 0;

  for (let i = 0; i < costos.length; i++) {
    for (let j = 0; j < costos[i].length; j++) {
      total += costos[i][j] * asignaciones[i][j];
    }
  }

  return total;
}

// Balancear problema
export function balancearProblema({ costos, oferta, demanda }) {
  const sumaOferta = oferta.reduce((a, b) => a + b, 0);
  const sumaDemanda = demanda.reduce((a, b) => a + b, 0);

  let nuevoCostos = costos.map(row => [...row]);
  let nuevaOferta = [...oferta];
  let nuevaDemanda = [...demanda];

  let balanceado = true;
  let tipoBalanceo = null;

  if (sumaOferta > sumaDemanda) {
    // agregar columna ficticia
    nuevaDemanda.push(sumaOferta - sumaDemanda);

    nuevoCostos = nuevoCostos.map(row => [...row, 0]);

    balanceado = false;
    tipoBalanceo = "Demanda ficticia";
  } else if (sumaDemanda > sumaOferta) {
    // agregar fila ficticia
    nuevaOferta.push(sumaDemanda - sumaOferta);

    const nuevaFila = new Array(nuevaDemanda.length).fill(0);
    nuevoCostos.push(nuevaFila);

    balanceado = false;
    tipoBalanceo = "Oferta ficticia";
  }

  return {
    costos: nuevoCostos,
    oferta: nuevaOferta,
    demanda: nuevaDemanda,
    balanceado,
    tipoBalanceo,
  };
}

// Obtener celdas activas fila
export function obtenerCeldasActivasFila(costos, fila, columnasActivas, demandaRestante) {
  return costos[fila]
    .map((costo, j) => ({
      fila,
      columna: j,
      costo,
    }))
    .filter((_, j) => columnasActivas[j] && demandaRestante[j] > 0)
    .sort((a, b) => a.costo - b.costo);
}

// Obtener celdas activas columna
export function obtenerCeldasActivasColumna(costos, columna, filasActivas, ofertaRestante) {
  return costos
    .map((fila, i) => ({
      fila: i,
      columna,
      costo: fila[columna],
    }))
    .filter((_, i) => filasActivas[i] && ofertaRestante[i] > 0)
    .sort((a, b) => a.costo - b.costo);
}
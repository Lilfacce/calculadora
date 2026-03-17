import { resolverGranM } from "./granM";

const problema = {
  objetivo: "min",
  c: [2, 3],
  restricciones: [
    { coef: [1, 1], signo: ">=", b: 4 },
    { coef: [1, 2], signo: "=", b: 6 }
  ]
};

const resultado = resolverGranM(problema);

console.log("=== RESULTADO GRAN M ===");
console.log("Estado:", resultado.estado);
console.log("Mensaje:", resultado.mensaje);

if (resultado.exito) {
  console.log("Solución completa:", resultado.solucion);
  console.log("Solución original:", resultado.solucionOriginal);
  console.log("Valor óptimo Z:", resultado.valorZ);
}

console.log("=== ITERACIONES ===");
resultado.iteraciones.forEach(it => {
  console.log(`\nIteración ${it.iteracion}`);
  console.log("Base:", it.base);
  console.log("Cb:", it.cb);
  console.log("Columnas:", it.columnas);

  console.table(
    it.matriz.map(fila => {
      const obj = {};
      it.columnas.forEach((col, i) => {
        obj[col] = fila[i];
      });
      obj.RHS = fila[fila.length - 1];
      return obj;
    })
  );

  const zjObj = {};
  it.columnas.forEach((col, i) => {
    zjObj[col] = it.zj[i];
  });
  zjObj.RHS = it.zj[it.zj.length - 1];
  console.log("Zj:");
  console.table([zjObj]);

  const evalObj = {};
  it.columnas.forEach((col, i) => {
    evalObj[col] = it.cjMinusZj[i];
  });
  evalObj.RHS = it.cjMinusZj[it.cjMinusZj.length - 1];
  console.log("Cj - Zj:");
  console.table([evalObj]);
});
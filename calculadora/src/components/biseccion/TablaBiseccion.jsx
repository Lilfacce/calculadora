import React from "react";

const TablaBiseccion = ({ historia }) => {
  return (
    <table className="w-full mt-4 border border-gray-600 text-sm">
      <thead>
        <tr className="bg-gray-700">
          <th>Iter</th>
          <th>a</th>
          <th>b</th>
          <th>c</th>
          <th>f(c)</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody>
        {historia.map((row, index) => (
          <tr key={index} className="text-center border-t border-gray-600">
            <td>{row.iteracion}</td>
            <td>{row.a.toFixed(6)}</td>
            <td>{row.b.toFixed(6)}</td>
            <td>{row.c.toFixed(6)}</td>
            <td>{row.fc.toExponential(2)}</td>
            <td>{row.error.toExponential(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaBiseccion;
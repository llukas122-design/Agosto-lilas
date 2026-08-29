import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RegioesChart({ denuncias }) {
const porRegiao = {};

(denuncias || []).forEach((d) => {
  const regiao = (d.bairro || d.cidade || 'Não informado')
    .trim()
    .replace(/\s+/g, ' ');

  porRegiao[regiao] = (porRegiao[regiao] || 0) + 1;
});

  const data = Object.entries(porRegiao)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[320px] bg-purple-50 rounded-2xl text-purple-700 text-sm">
        Sem dados suficientes para o gráfico ainda.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-lg p-6">
      <h3 className="text-lg font-semibold text-purple-900 mb-4">Regiões com mais denúncias</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: 'rgba(124,58,237,0.08)' }} contentStyle={{ borderRadius: 10, border: '1px solid #ede9fe' }} />
          <Bar dataKey="total" fill="#7c3aed" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
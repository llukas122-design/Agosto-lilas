import React from 'react';
import { Ribbon, AlertTriangle, BookOpen, Users } from 'lucide-react';

const DADOS = [
  { icon: AlertTriangle, titulo: 'A realidade',
    texto: 'No Brasil, milhões de mulheres sofrem violência todos os anos. A maior parte dos casos ocorre dentro de casa, por pessoas conhecidas da vítima.' },
  { icon: BookOpen, titulo: 'Lei Maria da Penha',
    texto: 'Lei 11.340/2006 — cria mecanismos para coibir a violência doméstica e familiar contra a mulher, com medidas protetivas e punições.' },
  { icon: Users, titulo: 'Tipos de violência',
    texto: 'Física, psicológica, sexual, patrimonial e moral. Toda forma de violência deve ser denunciada — não há "exagero" quando se trata de segurança.' },
];

export default function InfoSection() {
  return (
    <section id="sobre" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <Ribbon className="w-7 h-7 text-purple-700" />
          <h2 className="text-3xl font-bold text-purple-900 text-center">O que é o Agosto Lilás</h2>
        </div>
        <p className="text-purple-700/80 text-center max-w-2xl mx-auto mb-12">
          O Agosto Lilás é uma campanha nacional de prevenção à violência contra a mulher,
          intensificada em agosto, mas que deve ser lembrada o ano inteiro.
          Este espaço reúne informação, canais de ajuda e um mapa anônimo de denúncias.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {DADOS.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.titulo} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="font-semibold text-purple-900 mb-2">{d.titulo}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{d.texto}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
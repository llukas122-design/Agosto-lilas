import React from 'react';
import { Phone, MessageCircle, Globe, Heart } from 'lucide-react';

const CANAIS = [
  { icon: Phone, nome: 'Ligue 180', desc: 'Central de Atendimento à Mulher — 24h, gratuita e sigilosa.', contato: '180' },
  { icon: Globe, nome: 'Gov.br — Direitos da Mulher', desc: 'Canais oficiais de denúncia e orientação.', contato: 'gov.br/mulher' },
  { icon: MessageCircle, nome: 'Disque 100', desc: 'Direitos Humanos — denúncias de violência contra crianças, idosos e outros.', contato: '100' },
  { icon: Heart, nome: 'Polícia Militar', desc: 'Em casos de emergência ou risco imediato.', contato: '190' },
];

export default function HelpChannels() {
  return (
    <section id="ajuda" className="py-16 px-4 bg-purple-50/60">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-2">Canais de Ajuda</h2>
        <p className="text-purple-700/70 text-center mb-10">
          Se você está em risco, procure ajuda imediatamente. Os canais abaixo são gratuitos.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {CANAIS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.nome} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">{c.nome}</h3>
                  <p className="text-sm text-slate-600 mb-2">{c.desc}</p>
                  <span className="inline-block text-purple-700 font-medium">{c.contato}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
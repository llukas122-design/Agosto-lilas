import React, { useState } from 'react';
import { Loader2, ShieldCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const TIPOS = ['Física', 'Psicológica', 'Sexual', 'Patrimonial', 'Moral', 'Outro'];
const VITIMAS = ['Mulher', 'Criança', 'Adolescente', 'Idoso', 'Outro'];

export default function DenunciaForm({ onRegistrada }) {
  const [form, setForm] = useState({
    tipo_agressao: '', quem_agredida: '', rua: '', bairro: '', cidade: '', descricao: '',
  });
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tipo_agressao || !form.quem_agredida || !form.rua) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    setLoading(true);
    setCoords(null);

    try {
      // 1. Busca as coordenadas usando o Nominatim (OpenStreetMap)
      let lat = null;
      let lng = null;
      const q = [form.rua, form.bairro, form.cidade, 'Brasil'].filter(Boolean).join(', ');
      const geoUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q);
      
      const geoRes = await fetch(geoUrl, { headers: { 'Accept-Language': 'pt-BR' } });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (Array.isArray(geoData) && geoData.length > 0) {
          lat = parseFloat(geoData[0].lat);
          lng = parseFloat(geoData[0].lon);
        }
      }

      // 2. Envia os dados e coordenadas para o SEU Backend (Node.js)
      const denunciaBody = { ...form, latitude: lat, longitude: lng };
      const response = await fetch('https://agosto-lilas-production.up.railway.app/denuncias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(denunciaBody)
      });

      if (!response.ok) throw new Error('Erro ao salvar no banco de dados.');

      toast.success('Denúncia registrada com anonimato. Obrigada por falar.');
      if (lat && lng) setCoords({ lat, lng });
      setForm({ tipo_agressao: '', quem_agredida: '', rua: '', bairro: '', cidade: '', descricao: '' });
      if (onRegistrada) onRegistrada();

    } catch (err) {
      toast.error(err.message || 'Não foi possível registrar a denúncia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-purple-700" />
        <h3 className="text-xl font-semibold text-purple-900">Denúncia Anônima</h3>
      </div>
      <p className="text-sm text-purple-700/70 mb-6">
        Nenhum dado pessoal é coletado. Informe apenas o que aconteceu e o local.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-purple-900 text-sm font-medium">Tipo de agressão *</label>
            <select className="border border-gray-300 rounded-md p-2" value={form.tipo_agressao} onChange={(e) => setForm({ ...form, tipo_agressao: e.target.value })}>
              <option value="">Selecione</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-purple-900 text-sm font-medium">Quem está sendo agredida *</label>
            <select className="border border-gray-300 rounded-md p-2" value={form.quem_agredida} onChange={(e) => setForm({ ...form, quem_agredida: e.target.value })}>
              <option value="">Selecione</option>
              {VITIMAS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5 flex flex-col">
          <label className="text-purple-900 text-sm font-medium">Rua *</label>
          <input className="border border-gray-300 rounded-md p-2" value={form.rua} onChange={(e) => setForm({ ...form, rua: e.target.value })} placeholder="Ex.: Rua das Flores, 123" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-purple-900 text-sm font-medium">Bairro</label>
            <input className="border border-gray-300 rounded-md p-2" value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} placeholder="Bairro" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-purple-900 text-sm font-medium">Cidade</label>
            <input className="border border-gray-300 rounded-md p-2" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Cidade" />
          </div>
        </div>

        <div className="space-y-1.5 flex flex-col">
          <label className="text-purple-900 text-sm font-medium">Descrição (opcional)</label>
          <textarea className="border border-gray-300 rounded-md p-2" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Conte o que aconteceu, sem se identificar." rows={3} />
        </div>

        {coords && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
            <MapPin className="w-4 h-4" />
            Localizado: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-purple-700 hover:bg-purple-800 text-white p-3 rounded-md font-medium flex justify-center items-center">
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Localizando e salvando...</>
          ) : 'Registrar denúncia anônima'}
        </button>
      </form>
    </div>
  );
}
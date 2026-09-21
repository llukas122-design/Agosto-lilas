import React, { useState, useEffect, useCallback } from 'react';
import { Ribbon, MapPin, BarChart3, FileText } from 'lucide-react';

// Seus componentes (Crie estes arquivos na pasta src/components/)
import InfoSection from '../components/InfoSection';
import HelpChannels from '../components/HelpChannels';
import DenunciaForm from '../components/DenunciaForm';
import DenunciasMap from '../components/DenunciasMap';
import RegioesChart from '../components/RegioesChart';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca as denúncias cadastradas no SEU MySQL
 const carregar = useCallback(async () => {
  try {
    setLoading(true);

    const res = await fetch(
      'https://agosto-lilas-production.up.railway.app/denuncias'
    );

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }

    const data = await res.json();

    console.log('Denúncias recebidas:', data);

    if (Array.isArray(data)) {
      setDenuncias(data);
    } else {
      console.error('Resposta inesperada do servidor:', data);
      setDenuncias([]);
    }
  } catch (e) {
    console.error('Erro ao buscar denúncias no servidor:', e);
    setDenuncias([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { carregar(); }, [carregar]);

 const total = denuncias.length;

const geoloc = denuncias.filter(
  (d) => d.latitude != null && d.longitude != null
).length;

const tiposUnicos = new Set(
  denuncias
    .map((d) => d.tipo_agressao)
    .filter(Boolean)
).size;

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Hero */}
      <header className="relative overflow-hidden bg-purple-900 text-white">
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="flex items-center gap-2 mb-4 text-purple-200">
            <Ribbon className="w-6 h-6" />
            <span className="uppercase tracking-widest text-xs font-medium">Campanha Nacional</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight max-w-3xl">Agosto Lilás</h1>
          <p className="mt-4 text-lg sm:text-xl text-purple-100 max-w-2xl">
            Informação, ajuda e um mapa anônimo de denúncias. Juntas, contra a violência à mulher.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#denunciar" className="bg-white text-purple-900 font-medium px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors">
              Fazer denúncia anônima
            </a>
            <a href="#ajuda" className="border border-purple-200 text-white px-6 py-3 rounded-xl hover:bg-purple-700/40 transition-colors">
              Canais de ajuda
            </a>
          </div>
        </div>
      </header>

      <InfoSection />

      <section id="denunciar" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-6 h-6 text-purple-700" />
            <h2 className="text-3xl font-bold text-purple-900">Denúncia e Mapa</h2>
          </div>
          <p className="text-purple-700/70 mb-10 max-w-2xl">
            Preencha o formulário anônimo. O endereço é convertido em localização e
            aparece como ponto vermelho no mapa. Ao lado, o gráfico mostra as regiões
            com mais denúncias.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mb-8" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
            <DenunciaForm onRegistrada={carregar} />
            <div>
              <div className="flex items-center gap-2 mb-3 mt-8 lg:mt-0">
                <MapPin className="w-5 h-5 text-purple-700" />
                <h3 className="text-lg font-semibold text-purple-900">Mapa de denúncias</h3>
              </div>
              <DenunciasMap denuncias={denuncias} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <Stat label="Denúncias registradas" value={total} />
            <Stat label="Geolocalizadas" value={geoloc} />
            <Stat label="Tipos mapeados" value={tiposUnicos} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-purple-700" />
            <h3 className="text-lg font-semibold text-purple-900">Regiões com mais denúncias</h3>
          </div>
          <RegioesChart denuncias={denuncias} />
        </div>
      </section>

      <HelpChannels />

      <footer className="bg-purple-900 text-purple-200 py-8 px-4 text-center text-sm">
        <p>Agosto Lilás · Denúncias 100% anônimas · Nenhum dado pessoal é coletado.</p>
      </footer>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 flex-1 min-w-[200px]">
      <div className="text-3xl font-bold text-purple-900">{value}</div>
      <div className="text-sm text-purple-700/70 mt-1">{label}</div>
    </div>
  );
}
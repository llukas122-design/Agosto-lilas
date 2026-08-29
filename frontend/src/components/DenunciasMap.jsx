import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';

export default function DenunciasMap({ denuncias }) {
const pontos = (denuncias || [])
.filter((d) => d.latitude != null && d.longitude != null)
.map((d) => ({
...d,
latitude: Number(d.latitude),
longitude: Number(d.longitude),
}))
.filter((d) => !isNaN(d.latitude) && !isNaN(d.longitude));

if (!pontos.length) {
return ( <div className="flex flex-col items-center justify-center h-[420px] bg-purple-50 rounded-2xl text-purple-700"> <Loader2 className="w-6 h-6 mb-2" /> <p className="text-sm">
Ainda não há denúncias geolocalizadas no mapa. </p> </div>
);
}

return ( <div className="rounded-2xl overflow-hidden border border-purple-100 shadow-lg">
<MapContainer
center={[pontos[0].latitude, pontos[0].longitude]}
zoom={11}
style={{ height: '460px', width: '100%' }}
> <TileLayer
       attribution='&copy; OpenStreetMap'
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     />

```
    {pontos.map((d) => (
      <CircleMarker
        key={d.id}
        center={[d.latitude, d.longitude]}
        radius={9}
        pathOptions={{
          color: '#7c3aed',
          fillColor: '#dc2626',
          fillOpacity: 0.85,
          weight: 2,
        }}
      >
        <Tooltip>
          <div className="text-xs">
            <strong>{d.tipo_agressao}</strong>
            <br />
            Vítima: {d.quem_agredida}
            <br />
            {d.rua}
            {d.bairro ? ` — ${d.bairro}` : ''}
          </div>
        </Tooltip>
      </CircleMarker>
    ))}
  </MapContainer>
</div>
```

);
}

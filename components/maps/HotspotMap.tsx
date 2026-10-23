'use client';
import dynamic from 'next/dynamic';
import type { HotspotData } from '@/types';

// SSR disabled for Leaflet — map is client-only
const HotspotMapInner = dynamic(() => import('./HotspotMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-green-50 rounded-xl" style={{ height: '100%', minHeight: 300 }}>
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-green-700 font-medium">Loading Interactive Map...</p>
        <p className="text-gray-400 text-sm">Powered by OpenStreetMap</p>
      </div>
    </div>
  ),
});

interface Props {
  data: HotspotData[];
  height?: string;
}

export default function HotspotMap({ data, height = '500px' }: Props) {
  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <HotspotMapInner data={data} height={height} />
    </div>
  );
}

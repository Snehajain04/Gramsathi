'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { HotspotData } from '@/types';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7c3aed',
};

interface Props {
  data: HotspotData[];
  height: string;
}

export default function HotspotMapInner({ data, height }: Props) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height, width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {data.map(point => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={Math.max(8, Math.min(30, Math.sqrt(point.reportCount) * 2.5))}
          fillColor={RISK_COLORS[point.riskLevel] || '#22c55e'}
          color={RISK_COLORS[point.riskLevel] || '#22c55e'}
          weight={2}
          fillOpacity={0.7}
          opacity={1}
        >
          <Popup>
            <div style={{ minWidth: 200, fontFamily: 'Inter, system-ui, sans-serif' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>
                📍 {point.district}, {point.state}
              </h3>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Crop', point.crop],
                    ['Issue', point.issue],
                    ['Type', point.issueType === 'disease' ? '🦠 Disease' : '🐛 Pest'],
                    ['Reports', String(point.reportCount)],
                    ['Risk Level', point.riskLevel.toUpperCase()],
                    ['Trend', point.trend === 'increasing' ? '📈 Increasing' : point.trend === 'decreasing' ? '📉 Decreasing' : '➡️ Stable'],
                    ['Last Report', point.lastReport],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '3px 0', color: '#6b7280', width: '40%' }}>{k}</td>
                      <td style={{ padding: '3px 0', fontWeight: 600, color: k === 'Risk Level' ? RISK_COLORS[point.riskLevel] : '#111827' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

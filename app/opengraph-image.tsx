import { ImageResponse } from 'next/og'

export const alt = 'Three Lines — Scripture study through analytical lenses'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#ffffff',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 80,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48, width: 320 }}>
        <div style={{ width: '100%', height: 5, background: '#378ADD', borderRadius: 3 }} />
        <div style={{ width: '80%', height: 5, background: '#1D9E75', borderRadius: 3 }} />
        <div style={{ width: '60%', height: 5, background: '#534AB7', borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 80, fontWeight: 600, color: '#111827', lineHeight: 1 }}>Three Lines</div>
      <div style={{ fontSize: 32, color: '#6B7280', marginTop: 20, lineHeight: 1.4 }}>
        Scripture study through analytical lenses
      </div>
    </div>,
    { ...size }
  )
}

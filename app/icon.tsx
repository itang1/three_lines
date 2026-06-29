import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#111827',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 4,
        padding: 7,
      }}
    >
      <div style={{ width: '100%', height: 2, background: '#378ADD', borderRadius: 1 }} />
      <div style={{ width: '100%', height: 2, background: '#1D9E75', borderRadius: 1 }} />
      <div style={{ width: '100%', height: 2, background: '#534AB7', borderRadius: 1 }} />
    </div>,
    { ...size }
  )
}

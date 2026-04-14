export function generateCaptcha(): { text: string; dataUrl: string } {
  const chars = '0123456789'
  let text = ''
  for (let i = 0; i < 4; i++) {
    text += chars[Math.floor(Math.random() * chars.length)]
  }

  // 创建 canvas
  const canvas = document.createElement('canvas')
  canvas.width = 120
  canvas.height = 40
  const ctx = canvas.getContext('2d')!

  // 背景
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, 120, 40)

  // 干扰线
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`
    ctx.beginPath()
    ctx.moveTo(Math.random() * 120, Math.random() * 40)
    ctx.lineTo(Math.random() * 120, Math.random() * 40)
    ctx.stroke()
  }

  // 绘制文字
  for (let i = 0; i < text.length; i++) {
    ctx.font = `${20 + Math.random() * 10}px Arial`
    ctx.fillStyle = `rgb(${Math.random() * 100},${Math.random() * 100},${Math.random() * 100})`
    ctx.save()
    ctx.translate(20 + i * 25, 25)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillText(text[i], 0, 0)
    ctx.restore()
  }

  // 干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`
    ctx.fillRect(Math.random() * 120, Math.random() * 40, 2, 2)
  }

  return { text, dataUrl: canvas.toDataURL() }
}

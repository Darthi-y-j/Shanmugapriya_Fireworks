import { useEffect, useRef } from 'react'

const COLORS = ['#fbbf24', '#f59e0b', '#fde68a', '#ea580c', '#f97316', '#fff5d6']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  gravity: number
}

interface Rocket {
  x: number
  y: number
  targetY: number
  speed: number
  color: string
}

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function HeroFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId = 0
    let particles: Particle[] = []
    let rockets: Rocket[] = []
    let pendingLaunches = 1
    let lastLaunch = 0
    let width = 0
    let height = 0
    let dpr = 1
    let isMobile = false

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      isMobile = width < 640
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const createBurst = (x: number, y: number, color?: string) => {
      const baseColor = color ?? pickColor()
      const count = isMobile ? 28 : 48

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25
        const speed = 1.4 + Math.random() * 3.2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 45 + Math.random() * 35,
          color: Math.random() > 0.35 ? baseColor : pickColor(),
          size: 1.2 + Math.random() * 1.8,
          gravity: 0.035 + Math.random() * 0.02,
        })
      }

      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.4 + Math.random() * 1.2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 25 + Math.random() * 20,
          color: '#fff5d6',
          size: 0.8 + Math.random() * 0.6,
          gravity: 0.015,
        })
      }
    }

    const launchRocket = () => {
      const x = width * (0.12 + Math.random() * 0.76)
      const targetY = height * (0.12 + Math.random() * 0.38)
      rockets.push({
        x,
        y: height + 4,
        targetY,
        speed: 3.5 + Math.random() * 2.5,
        color: pickColor(),
      })
    }

    const tick = (time: number) => {
      if (document.hidden) {
        animationId = requestAnimationFrame(tick)
        return
      }

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      const launchInterval = isMobile ? 1400 : 900
      if (time - lastLaunch > launchInterval + Math.random() * 900) {
        launchRocket()
        lastLaunch = time
        if (Math.random() > 0.55) pendingLaunches += 1
      }

      while (pendingLaunches > 0) {
        launchRocket()
        pendingLaunches -= 1
      }

      rockets = rockets.filter((rocket) => {
        rocket.y -= rocket.speed
        rocket.speed *= 0.985

        ctx.beginPath()
        ctx.arc(rocket.x, rocket.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = rocket.color
        ctx.globalAlpha = 0.95
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(rocket.x, rocket.y + 2)
        ctx.lineTo(rocket.x, rocket.y + 14)
        ctx.strokeStyle = rocket.color
        ctx.globalAlpha = 0.35
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.globalAlpha = 1

        if (rocket.y <= rocket.targetY) {
          createBurst(rocket.x, rocket.y, rocket.color)
          return false
        }
        return true
      })

      const maxParticles = isMobile ? 220 : 380
      particles = particles.filter((particle) => {
        particle.life += 1
        particle.vx *= 0.985
        particle.vy *= 0.985
        particle.vy += particle.gravity
        particle.x += particle.vx
        particle.y += particle.vy

        const alpha = 1 - particle.life / particle.maxLife
        if (alpha <= 0) return false

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = alpha * 0.9
        ctx.fill()

        return true
      })

      if (particles.length > maxParticles) {
        particles = particles.slice(-maxParticles)
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    lastLaunch = performance.now() - 400
    animationId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden="true"
    />
  )
}

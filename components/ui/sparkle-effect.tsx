"use client"

import React, { useState, useEffect, useMemo } from 'react'

interface SparkleProps {
  size?: number
  duration?: number
  density?: number
  trailSize?: number
}

// Create a utility function for rainbow colors
const getRainbowColor = (offset: number = 0) => {
  const hue = ((Date.now() / 20) % 360 + offset) % 360
  return `hsla(${hue}, 100%, 70%, 0.8)`
}

export const SparkleEffect: React.FC<SparkleProps> = ({
  size = 12,
  duration = 800,
  density = 0.4,
  trailSize = 24
}) => {
  const [sparkles, setSparkles] = useState<Array<{
    id: number
    x: number
    y: number
    createdAt: number
    color: string
    size: number
    angle: number
    speed: number
  }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 })
  const [mouseMoved, setMouseMoved] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Rainbow gradient for the mouse trailer
  const rainbowGradient = useMemo(() => {
    return `radial-gradient(circle, 
      rgba(255,255,255,0.9) 0%, 
      rgba(255,50,150,0.7) 25%, 
      rgba(50,150,255,0.6) 50%, 
      rgba(50,255,150,0.4) 75%, 
      rgba(100,100,255,0) 100%)`
  }, [])

  // Clean up old sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setSparkles(sparkles => sparkles.filter(sparkle => {
        return now - sparkle.createdAt < duration
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setSparkles([])
  }

  // Add sparkle on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseMoved) setMouseMoved(true)
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Store previous position
    setPrevPosition(mousePosition)
    setMousePosition({ x, y })
    
    // Calculate mouse speed and direction
    const dx = x - prevPosition.x
    const dy = y - prevPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (Math.random() > (1 - density) || distance > 10) {
      // Create multiple sparkles with different sizes and speeds
    const newSparkles: Array<{
      id: number;
      x: number;
      y: number;
      createdAt: number;
      color: string;
      size: number;
      angle: number;
      speed: number;
    }> = []
      
      // Number of sparkles to generate based on mouse speed
      const sparkleCount = Math.min(Math.max(Math.floor(distance / 5), 1), 5)
      
      for (let i = 0; i < sparkleCount; i++) {
        // Create slight variation around the mouse position
        const randomOffset = () => (Math.random() - 0.5) * 20
        const sparkleX = x + randomOffset()
        const sparkleY = y + randomOffset()
        
        // Random angle for movement
        const angle = Math.random() * Math.PI * 2
        // Size variation
        const sparkleSize = size * (0.7 + Math.random() * 0.6)
        // Speed variation
        const speed = 0.5 + Math.random() * 1.5
        // Unique color for each sparkle with slight hue variation
        const hueOffset = Math.random() * 60 - 30
        
        newSparkles.push({
          id: Date.now() + i,
          x: sparkleX,
          y: sparkleY,
          createdAt: Date.now(),
          color: getRainbowColor(hueOffset),
          size: sparkleSize,
          angle,
          speed
        })
      }
      
      setSparkles(sparkles => [...sparkles, ...newSparkles])
    }
  }

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse trailer effect */}
      <div 
        className="pointer-events-none absolute" 
        style={{ 
          left: mousePosition.x, 
          top: mousePosition.y,
          opacity: isHovering ? 0.8 : 0,
          width: trailSize * 2,
          height: trailSize * 2,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: rainbowGradient,
          transition: 'opacity 0.2s ease-in-out, width 0.3s ease-out, height 0.3s ease-out',
          filter: 'blur(3px)',
          zIndex: 20
        }}
      />
      
      {/* Sparkles */}
      {sparkles.map(sparkle => {
        const timeAlive = Date.now() - sparkle.createdAt
        const lifeProgress = timeAlive / duration
        const opacity = Math.max(0, 1 - (lifeProgress * 1.2))
        
        // Calculate movement
        const distance = sparkle.speed * timeAlive * 0.05
        const moveX = sparkle.x + Math.cos(sparkle.angle) * distance
        const moveY = sparkle.y + Math.sin(sparkle.angle) * distance
        
        // Pulse scale effect
        const scaleBase = 1 - lifeProgress * 0.5
        const pulseFrequency = 6
        const pulseAmplitude = 0.2
        const scale = scaleBase + Math.sin(lifeProgress * Math.PI * pulseFrequency) * pulseAmplitude * (1 - lifeProgress)
        
        return (
          <div
            key={sparkle.id}
            className="pointer-events-none absolute"
            style={{
              left: moveX,
              top: moveY,
              opacity,
              width: sparkle.size,
              height: sparkle.size,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${timeAlive / 20}deg)`,
              background: sparkle.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${sparkle.size / 1.5}px ${sparkle.color}`,
              filter: 'blur(0.5px)',
              zIndex: 30,
              transition: 'transform 0.1s ease-out'
            }}
          />
        )
      })}
    </div>
  )
}
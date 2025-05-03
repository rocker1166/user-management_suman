"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'

interface SparkleProps {
  size?: number
  duration?: number
  density?: number
  trailSize?: number
}

// Create a utility function for softer pastel colors
const getPastelColor = (offset: number = 0) => {
  const hue = ((Date.now() / 50) % 360 + offset) % 360
  return `hsla(${hue}, 80%, 75%, 0.6)`
}

export const SparkleEffect: React.FC<SparkleProps> = ({
  size = 10,
  duration = 2500,
  density = 0.2,
  trailSize = 35
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
  const [lastSparkleTime, setLastSparkleTime] = useState(0)

  // Softer gradient for the mouse trailer
  const softGradient = useMemo(() => {
    return `radial-gradient(circle, 
      rgba(255,255,255,0.6) 0%, 
      rgba(255,180,220,0.5) 25%, 
      rgba(140,180,255,0.4) 50%, 
      rgba(180,230,240,0.3) 75%, 
      rgba(190,190,255,0) 100%)`
  }, [])

  // Throttle function to limit sparkle creation
  const throttle = useCallback((callback: Function, limit: number) => {
    const now = Date.now()
    if (now - lastSparkleTime > limit) {
      setLastSparkleTime(now)
      callback()
    }
  }, [lastSparkleTime])

  // Clean up old sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setSparkles(sparkles => sparkles.filter(sparkle => {
        return now - sparkle.createdAt < duration
      }))
    }, 200) // Reduced cleanup frequency for better performance

    return () => clearInterval(interval)
  }, [duration])

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Create sparkles with a relaxed, lazy feel
  const createSparkles = useCallback((x: number, y: number, distance: number) => {
    // Create a limited number of sparkles with different sizes and speeds
    const newSparkles: Array<{
      id: number
      x: number
      y: number
      createdAt: number
      color: string
      size: number
      angle: number
      speed: number
    }> = []
    
    // Fewer sparkles for a lazier feel
    const sparkleCount = Math.min(Math.max(Math.floor(distance / 12), 1), 2)
    
    for (let i = 0; i < sparkleCount; i++) {
      // Create wider variation around the mouse position for a more relaxed feel
      const randomOffset = () => (Math.random() - 0.5) * 35
      const sparkleX = x + randomOffset()
      const sparkleY = y + randomOffset()
      
      // Random angle for movement
      const angle = Math.random() * Math.PI * 2
      // Size variation - larger particles for a dreamy effect
      const sparkleSize = size * (0.8 + Math.random() * 0.7)
      // Slower speed for lazy movement
      const speed = 0.2 + Math.random() * 0.6
      // Unique color for each sparkle with slight hue variation
      const hueOffset = Math.random() * 80 - 40
      
      newSparkles.push({
        id: Date.now() + i,
        x: sparkleX,
        y: sparkleY,
        createdAt: Date.now(),
        color: getPastelColor(hueOffset),
        size: sparkleSize,
        angle,
        speed
      })
    }
    
    setSparkles(sparkles => [...sparkles, ...newSparkles])
  }, [size])

  // Add sparkle on mouse move with throttling
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseMoved) setMouseMoved(true)
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Update mouse position with smoother transition 
    // by adding slight delay and inertia
    setTimeout(() => {
      setPrevPosition(mousePosition)
      setMousePosition({ x, y })
    }, 30)
    
    // Calculate mouse speed and direction
    const dx = x - prevPosition.x
    const dy = y - prevPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Only create sparkles if we exceed the density threshold or move significantly
    // Use throttling to create a lazier feel
    if (Math.random() > (1 - density) || distance > 20) {
      throttle(() => createSparkles(x, y, distance), 150)
    }
  }

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse trailer effect with lazy follow */}
      <div 
        className="pointer-events-none absolute" 
        style={{ 
          left: mousePosition.x, 
          top: mousePosition.y,
          opacity: isHovering ? 0.7 : 0,
          width: trailSize * 2,
          height: trailSize * 2,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: softGradient,
          transition: 'opacity 0.5s ease-in-out, left 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), width 0.8s ease-out, height 0.8s ease-out',
          filter: 'blur(8px)',
          zIndex: 20
        }}
      />
      
      {/* Sparkles */}
      {sparkles.map(sparkle => {
        const timeAlive = Date.now() - sparkle.createdAt
        const lifeProgress = timeAlive / duration
        
        // Smoother fade in/out with cubic easing
        const fadeInDuration = 0.2
        const fadeOutStart = 0.65
        
        let opacity
        if (lifeProgress < fadeInDuration) {
          // Gentle fade in
          opacity = lifeProgress / fadeInDuration * 0.7
        } else if (lifeProgress > fadeOutStart) {
          // Extended, slower fade out
          opacity = 0.7 * (1 - (lifeProgress - fadeOutStart) / (1 - fadeOutStart))
        } else {
          // Stable middle period
          opacity = 0.7
        }
        
        // Calculate lazy, drifting movement
        const distance = sparkle.speed * timeAlive * 0.02
        const gravity = 0.01 * timeAlive * 0.01 // Slight downward drift
        const moveX = sparkle.x + Math.cos(sparkle.angle) * distance
        const moveY = sparkle.y + Math.sin(sparkle.angle) * distance + gravity
        
        // Gentle pulsing scale effect
        const scaleBase = 1 - lifeProgress * 0.3
        const pulseFrequency = 2 // Slower pulse
        const pulseAmplitude = 0.15 // Gentler pulse
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
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${timeAlive / 60}deg)`,
              background: sparkle.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${sparkle.size / 1.2}px ${sparkle.color}`,
              filter: 'blur(1.5px)',
              zIndex: 30,
              transition: 'opacity 0.8s ease-out, transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}
          />
        )
      })}
    </div>
  )
}
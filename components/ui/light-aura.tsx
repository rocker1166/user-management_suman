"use client"

import React, { useState, useEffect, useMemo } from 'react'

interface AuraProps {
  intensity?: number
  speed?: number
  color?: string
  size?: number
}

export const LightAura: React.FC<AuraProps> = ({
  intensity = 0.6,
  speed = 1,
  color = "rainbow",
  size = 100
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [time, setTime] = useState(0)

  // Update time for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1)
    }, 50 / speed)

    return () => clearInterval(interval)
  }, [speed])

  // Choose gradient based on color preference
  const auraGradient = useMemo(() => {
    if (color === "rainbow") {
      return `radial-gradient(circle, 
        rgba(255,255,255,0.9) 0%, 
        rgba(255,220,240,0.6) 30%, 
        rgba(180,210,255,0.5) 60%, 
        rgba(200,240,255,0.3) 80%, 
        rgba(240,240,255,0) 100%)`
    } else {
      // For single color auras
      return `radial-gradient(circle, 
        rgba(255,255,255,0.9) 0%, 
        ${color}aa 40%, 
        ${color}55 70%, 
        ${color}00 100%)`
    }
  }, [color])

  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    
    // Smooth mouse position transitions
    const targetX = e.clientX - rect.left
    const targetY = e.clientY - rect.top
    
    // Add some delay for smoother following
    setMousePosition(prev => ({
      x: prev.x + (targetX - prev.x) * 0.1,
      y: prev.y + (targetY - prev.y) * 0.1
    }))
  }

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient background light pulsing */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(200,220,255,0.05) 40%, rgba(50,50,100,0) 70%)`,
          opacity: 0.7,
          filter: 'blur(30px)',
          transform: `scale(${1 + Math.sin(time * 0.05) * 0.1})`,
          transition: 'transform 1s ease-in-out'
        }}
      />
      
      {/* Main aura that follows the mouse */}
      <div 
        className="pointer-events-none absolute" 
        style={{ 
          left: mousePosition.x, 
          top: mousePosition.y,
          opacity: isHovering ? intensity : 0.2,
          width: size * 2,
          height: size * 2,
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(time * 0.1) * 0.1})`,
          borderRadius: '50%',
          background: auraGradient,
          transition: 'opacity 0.8s ease-in-out, left 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
          filter: 'blur(20px)',
          zIndex: 20,
          mixBlendMode: 'lighten'
        }}
      />
      
      {/* Secondary glow for added light effect */}
      <div 
        className="pointer-events-none absolute" 
        style={{ 
          left: mousePosition.x, 
          top: mousePosition.y,
          opacity: isHovering ? intensity * 0.7 : 0.1,
          width: size * 3.5,
          height: size * 3.5,
          transform: `translate(-50%, -50%) scale(${1 - Math.sin(time * 0.08) * 0.05})`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
          transition: 'opacity 1s ease-in-out, left 1s cubic-bezier(0.2, 0.8, 0.2, 1), top 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
          filter: 'blur(30px)',
          zIndex: 10,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'

export default function BeforeAfterSlider() {
  const [showAfter, setShowAfter] = useState(false)

  // Auto-demo: toggle every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAfter(prev => !prev)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      <div className="flex items-center gap-12">
        
        {/* Before Control - Left Side */}
        <button
          onClick={() => setShowAfter(false)}
          className={`group flex flex-col items-center gap-6 transition-all duration-700 ease-in-out ${
            !showAfter ? 'opacity-100' : 'opacity-40 hover:opacity-60'
          }`}
        >
          {/* Vertical indicator bar */}
          <div className="relative h-64 w-12 flex items-center justify-center">
            <div 
              className={`absolute inset-0 border border-black transition-all duration-700 ease-in-out ${
                !showAfter 
                  ? 'bg-gradient-to-b from-white via-gray-100 to-white' 
                  : 'bg-transparent'
              }`}
            />
            
            {/* Center dot indicator */}
            <div 
              className={`relative z-10 w-3 h-3 rounded-full border border-black transition-all duration-700 ease-in-out ${
                !showAfter ? 'bg-black scale-125' : 'bg-white scale-100'
              }`}
            />
          </div>

          {/* Label */}
          <p className="text-sm font-light tracking-[0.3em] writing-mode-vertical">
            BEFORE
          </p>
        </button>

        {/* Image Display Frame - Center */}
        <div className="relative">
          {/* Frame border */}
          <div className="relative w-[800px] h-[450px] border-2 border-black bg-white overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.08)]">
            
            {/* Before Image */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                !showAfter 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                {/* Placeholder - Manual workflow illustration */}
                <div className="flex flex-col items-center gap-8 p-12">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="black" strokeWidth="1.5">
                    {/* Desk/Computer */}
                    <rect x="30" y="50" width="60" height="40" strokeLinecap="round" />
                    <line x1="40" y1="60" x2="80" y2="60" strokeLinecap="round" />
                    <line x1="40" y1="70" x2="70" y2="70" strokeLinecap="round" />
                    <line x1="40" y1="80" x2="65" y2="80" strokeLinecap="round" />
                    {/* Person */}
                    <circle cx="60" cy="30" r="8" />
                    <line x1="60" y1="38" x2="60" y2="50" strokeLinecap="round" />
                  </svg>
                  
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-light tracking-wide">Manual Process</p>
                    <p className="text-lg font-light text-gray-600">Time-consuming workflows</p>
                    <p className="text-5xl font-light mt-6">300 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* After Image */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                showAfter 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
                {/* Placeholder - Automated workflow illustration */}
                <div className="flex flex-col items-center gap-8 p-12">
                  <svg width="160" height="120" viewBox="0 0 160 120" fill="none" stroke="black" strokeWidth="1.5">
                    {/* Automated nodes */}
                    <circle cx="30" cy="60" r="12" />
                    <circle cx="80" cy="60" r="12" />
                    <circle cx="130" cy="60" r="12" />
                    {/* Connecting lines */}
                    <line x1="42" y1="60" x2="68" y2="60" strokeLinecap="round" strokeDasharray="4 4" />
                    <line x1="92" y1="60" x2="118" y2="60" strokeLinecap="round" strokeDasharray="4 4" />
                    {/* Checkmarks */}
                    <path d="M25 60 L28 63 L35 56" strokeLinecap="round" />
                    <path d="M75 60 L78 63 L85 56" strokeLinecap="round" />
                    <path d="M125 60 L128 63 L135 56" strokeLinecap="round" />
                  </svg>
                  
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-light tracking-wide">Automated System</p>
                    <p className="text-lg font-light text-gray-600">Streamlined efficiency</p>
                    <p className="text-5xl font-light mt-6">5 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle inner border for depth */}
            <div className="absolute inset-4 border border-gray-100 pointer-events-none" />
          </div>

          {/* State indicator at bottom */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <div 
              className={`h-1 transition-all duration-700 ease-in-out ${
                !showAfter ? 'w-16 bg-black' : 'w-8 bg-gray-300'
              }`}
            />
            <div 
              className={`h-1 transition-all duration-700 ease-in-out ${
                showAfter ? 'w-16 bg-black' : 'w-8 bg-gray-300'
              }`}
            />
          </div>
        </div>

        {/* After Control - Right Side */}
        <button
          onClick={() => setShowAfter(true)}
          className={`group flex flex-col items-center gap-6 transition-all duration-700 ease-in-out ${
            showAfter ? 'opacity-100' : 'opacity-40 hover:opacity-60'
          }`}
        >
          {/* Vertical indicator bar */}
          <div className="relative h-64 w-12 flex items-center justify-center">
            <div 
              className={`absolute inset-0 border border-black transition-all duration-700 ease-in-out ${
                showAfter 
                  ? 'bg-gradient-to-b from-white via-gray-100 to-white' 
                  : 'bg-transparent'
              }`}
            />
            
            {/* Center dot indicator */}
            <div 
              className={`relative z-10 w-3 h-3 rounded-full border border-black transition-all duration-700 ease-in-out ${
                showAfter ? 'bg-black scale-125' : 'bg-white scale-100'
              }`}
            />
          </div>

          {/* Label */}
          <p className="text-sm font-light tracking-[0.3em] writing-mode-vertical">
            AFTER
          </p>
        </button>

      </div>
    </div>
  )
}

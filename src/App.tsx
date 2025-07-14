"use client"

import SketchPanel from '@/components/SketchPanel'
import type { SketchPanelHandle } from '@/components/SketchPanel'
import React, { useEffect, useState, useRef } from 'react'

// import React from 'react'

const App = () => {
  const sketchPanelRef = useRef<SketchPanelHandle>(null);

  const handleExport = async () => {
    if (!sketchPanelRef.current) return;
    
    try {
      const img = await sketchPanelRef.current.exportDrawing();
      return img
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(handleExport());
  
  return (
    <div className='max-w-4xl max-h-[90vh] mx-auto pt-2'>
      <SketchPanel ref={sketchPanelRef}/>
    </div>
  )
}

export default App
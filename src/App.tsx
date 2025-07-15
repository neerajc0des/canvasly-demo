"use client"

import SketchPanel from '@/components/SketchPanel'
import type { SketchPanelHandle } from '@/components/SketchPanel'
import React, { useEffect, useState, useRef } from 'react'

// import React from 'react'

const App = () => {
  const sketchPanelRef = useRef<SketchPanelHandle>(null);

  // to export from the component 
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
    <div className='w-full max-h-[90vh] mx-auto'>
      <SketchPanel ref={sketchPanelRef}/>
    </div>
  )
}

export default App
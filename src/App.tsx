"use client"

import Canvasly from '@/components/Canvasly'
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
// import type { CanvaslyPanelHandle } from '@/components/SketchPanel'
// import React, { useEffect, useState, useRef } from 'react'

// import React from 'react'

const App = () => {
  // const sketchPanelRef = useRef<SketchPanelHandle>(null);

  // to export from the component 
  // const handleExport = async () => {
  //   if (!sketchPanelRef.current) return;

  //   if (sketchPanelRef.current && sketchPanelRef.current.exportDrawing) {
  //     try {
  //       const img = await sketchPanelRef.current.exportDrawing();
  //       return img
  //     } catch (error:any) {
  //       throw new Error(error)
  //     }
  //   }
  // }

  // console.log(handleExport());

  return (
    <div className='w-full max-h-[90vh] mx-auto'>
      <Canvasly />
      <Button asChild type='button' className='absolute py-4 bottom-2 right-2'>
        <a href="https://github.com/neerajc0des/canvasly-demo" target="_blank" rel="noopener noreferrer">
         <Github/>
        </a>
        
      </Button>
    </div>
  )
}

export default App
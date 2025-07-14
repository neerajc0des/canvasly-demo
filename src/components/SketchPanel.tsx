"use client"
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ReactSketchCanvas, } from 'react-sketch-canvas';
import type { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Slider } from "@/components/ui/slider"
import { CirclePicker, SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';
import { Button } from './ui/button';
import { Circle, CircleDot, Download, Eraser, Plus, Redo, Trash, Undo } from 'lucide-react';

const predefinedColors = [
    '#FF7F7F', // Vivid Rose (A deeper, more saturated pink-red)
    '#FFBF00', // Amber (Bright, warm orange-yellow)
    '#80D880', // Medium Spring Green (Lively but still soft green)
    '#fafafa', // Soft White (for highlights or 'erasing' to background)
    '#303030', // Deep Charcoal (Strong, dark neutral for outlines)
    '#F1C27D', // face
    '#64B5F6', // Cerulean Blue (Clear, vibrant blue)
    '#FFB7C5',
    '#B39DDB', // Amethyst (Rich, muted purple)
    '#795548', // Brown (Earth tone)
    'rgba(255, 255, 255, 0.5)', //semilight white
    'rgba(255, 0, 0, 0.5)', //tranaslucent red
    'rgba(0, 128, 0, 0.5)', // translucent green
    'rgba(0, 0, 0, 0.5)', // translucent black

];

export interface SketchPanelHandle {
    exportDrawing: () => Promise<string>;
}

interface SketchPanelProps {
    onImgExport: (imageData: string) => void;
}

const SketchPanel = forwardRef<SketchPanelHandle>((_props, ref) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const sliderBoxRef = useRef<HTMLDivElement>(null);
    const customColorPickerRef = useRef<HTMLDivElement>(null);
    const customColorIconRef = useRef<HTMLDivElement>(null);
    const brushIconRef = useRef<HTMLButtonElement>(null);
    const [brushColor, setBrushColor] = useState(predefinedColors[0]);
    const [showBrushSlider, setShowBrushSlider] = useState(false);
    const [brushRadius, setBrushRadius] = useState<number>(5);
    const [isErasing, setIsErasing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [exportImgUrl, setExportImgUrl] = useState<string>("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sliderBoxRef.current &&
                !sliderBoxRef.current.contains(event.target as Node) &&
                brushIconRef.current &&
                !brushIconRef.current.contains(event.target as Node)
            ) {
                setShowBrushSlider(false);
            }

            if (
                showColorPicker &&
                customColorPickerRef.current &&
                !customColorPickerRef.current.contains(event.target as Node) &&
                customColorIconRef.current &&
                !customColorIconRef.current.contains(event.target as Node)

            ) {
                setShowColorPicker(false);
            }
        };

        if (showBrushSlider || showColorPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showBrushSlider, showColorPicker]);


    const handleBrushIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBrushSlider(prev => !prev);
    };

    const handleChangeColor = (color: ColorResult) => {
        if (canvasRef.current) {
            canvasRef.current.eraseMode(false);
        }
        setIsErasing(false);

        setShowColorPicker(false)

        let newBrushColor;
        if (color.rgb.a !== undefined && color.rgb.a < 1) {
            newBrushColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        } else {
            newBrushColor = color.hex;
        }

        setBrushColor(newBrushColor);
    };

    const handleChangeCustomColor = (color: ColorResult) => {
        if (canvasRef.current) {
            canvasRef.current.eraseMode(false);
        }
        setIsErasing(false);

        let newBrushColor;
        if (color.rgb.a !== undefined && color.rgb.a < 1) {
            newBrushColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        } else {
            newBrushColor = color.hex;
        }

        setBrushColor(newBrushColor);
    };

    const handleUndo = () => {
        if (canvasRef.current) {
            canvasRef.current.undo();
        }
    };

    const handleRedo = () => {
        canvasRef.current?.redo();
    };

    const handleClear = () => {
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };

    const handleEraserClick = () => {
        const newIsErasing = !isErasing;
        setIsErasing(newIsErasing);
        if (canvasRef.current) {
            canvasRef.current.eraseMode(newIsErasing);
        }
        if (showBrushSlider) {
            setShowBrushSlider(false);
        }
    };

    // to export image thru parent component 
    useImperativeHandle(ref, () => ({
        exportDrawing: async () => {
            if (canvasRef.current) {
                const imageData = await canvasRef.current.exportImage('png');
                return imageData;
            }
            throw new Error("Canvas not ready");
        }
    }));

    // to export image internally
    const handleExport = async () => {
        if (!canvasRef.current) return;

        try {
            const img = await canvasRef.current.exportImage('png');
            return img;
            
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const handleExportIconClick = async () => {
        const exportImgUrl = await handleExport();

        if (exportImgUrl) {
            const link = document.createElement('a');
            link.href = exportImgUrl;
            link.download = `my-sketch-${Date.now()}.png`;
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link); 
            URL.revokeObjectURL(exportImgUrl); 
        } else {
            console.warn("No image URL to download.");
        }
    }

    return (
        <div className='w-full border rounded-md border-zinc-300'>
            <div className='controls w-full flex items-center justify-between py-1 relative'>
                <div className="colorPickerContainer relative w-[100%] overflow-x-auto py-2 pl-10 whitespace-nowrap no-scrollbar">
                    <div onClick={() => setShowColorPicker((prev) => !prev)} ref={customColorIconRef} title="New color" className="w-[20px] h-[20px] text-primary/60  shadow-sm flex items-center justify-center font-semibold hue-wheel-gradient border-zinc-400 border absolute top-[8px] left-[10px] cursor-pointer hover:scale-110">
                        <Plus size={15} strokeWidth={3} />
                    </div>

                    <CirclePicker
                        colors={predefinedColors}
                        color={brushColor}
                        onChangeComplete={handleChangeColor}
                        width='430px'
                        circleSize={20}
                        circleSpacing={10}
                    />
                </div>
                {/* <div className="separator w-px h-[15px] bg-zinc-400/80 mx-2 rounded-sm"></div> */}
                {showColorPicker &&
                    <div className="sketchPickerWrapper absolute top-[10px] left-[10px] z-50" ref={customColorPickerRef}>
                        <SketchPicker
                            color={brushColor}
                            onChangeComplete={handleChangeCustomColor}
                            width='250px'
                            className='absolute top-[45px] left-[10px]'
                        />
                    </div>
                }
                <div className="flex gap-0 items-center tools justify-end">
                    <Button
                        title='Undo'
                        onClick={handleUndo}
                        className=" hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  hover:text-primary/60 cursor-pointer"
                        variant={"ghost"}
                        type="button"
                    >
                        <Undo />
                    </Button>
                    <Button
                        title='Redo'
                        onClick={handleRedo}
                        className=" hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  hover:text-primary/60 cursor-pointer"
                        variant={"ghost"}
                        type="button"
                    >
                        <Redo />
                    </Button>

                    <Button
                        onClick={handleClear}
                        className=" hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px] hover:text-primary/60 cursor-pointer"
                        variant={"ghost"}
                        type="button"
                        title='Clear'
                    >
                        <Trash />
                    </Button>
                    <Button
                        title='Eraser'
                        className={` hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px] ${isErasing ? "bg-zinc-200" : "bg-primary/0"} hover:bg-zinc-200/90 transition-all duration-200 hover:text-primary/60 cursor-pointer`}
                        variant={"ghost"}
                        type="button"
                        onClick={handleEraserClick}
                    >
                        <Eraser />
                        {isErasing && <span className="absolute top-[50px] z-50 bg-zinc-50 rounded-sm shadow-sm py-1 px-2 text-primary left-2 text-xs">Eraser active</span>}
                    </Button>

                    <Button
                        title='Brush size'
                        className={` hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  bg-primary/0 hover:text-primary/60 cursor-pointer`}
                        variant={"ghost"}
                        type="button"
                        ref={brushIconRef}
                        onClick={handleBrushIconClick}
                    >
                        <CircleDot />
                    </Button>
                    <Button
                        title='download'
                        className={`mr-1 hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  bg-primary/0 hover:text-primary/60 cursor-pointer`}
                        variant={"ghost"}
                        type="button"
                        onClick={handleExportIconClick}
                    >
                        <Download />
                    </Button>
                </div>
                <div ref={sliderBoxRef} className={`sliderContainer ${showBrushSlider ? "block" : "hidden"} z-50 absolute top-[50px] border-zinc-300 border rounded-sm right-[5px] w-[150px] h-[120px] p-5 bg-zinc-100 flex flex-col justify-between items-center`}>
                    <Slider
                        value={[brushRadius]}
                        onValueChange={([val]) => setBrushRadius(val)}
                        className='cursor-pointer' defaultValue={[5]} min={2} max={70} step={1}
                    />
                    <Circle size={brushRadius} />
                    <span className="text-gray-700 text-xs font-medium">{brushRadius}px</span>
                </div>
            </div>
            <div className="canvasContainer overflow-hidden w-full rounded-md relative">
                <ReactSketchCanvas
                    ref={canvasRef}
                    strokeColor={brushColor}
                    strokeWidth={brushRadius}
                    eraserWidth={brushRadius}
                    canvasColor={"#cacaca"}
                    // width={'300px'}
                    height={"500px"}
                    style={{ border: '0px transparent' }}
                />
            </div>
        </div>
    )
})

export default SketchPanel;
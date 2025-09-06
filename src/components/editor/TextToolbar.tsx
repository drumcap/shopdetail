'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter, 
  AlignRight,
  Palette,
  Plus,
  Minus
} from 'lucide-react'

interface TextToolbarProps {
  fontSize: number
  fontWeight: number
  textAlign: string
  color: string
  onFontSizeChange: (size: number) => void
  onFontWeightChange: (weight: number) => void
  onTextAlignChange: (align: string) => void
  onColorChange: (color: string) => void
  className?: string
}

export function TextToolbar({
  fontSize = 16,
  fontWeight = 400,
  textAlign = 'left',
  color = '#000000',
  onFontSizeChange,
  onFontWeightChange,
  onTextAlignChange,
  onColorChange,
  className
}: TextToolbarProps) {
  
  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, fontSize + delta))
    onFontSizeChange(newSize)
  }

  const toggleBold = () => {
    const newWeight = fontWeight >= 600 ? 400 : 600
    onFontWeightChange(newWeight)
  }

  return (
    <div className={cn(
      "flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2",
      className
    )}>
      {/* 폰트 크기 조절 */}
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded">
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0"
          onClick={() => handleFontSizeChange(-2)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="text-xs font-mono min-w-6 text-center">
          {fontSize}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0"
          onClick={() => handleFontSizeChange(2)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* 굵기 */}
      <Button
        size="sm"
        variant={fontWeight >= 600 ? "default" : "ghost"}
        className="w-8 h-8 p-0"
        onClick={toggleBold}
      >
        <Bold className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200" />

      {/* 정렬 */}
      <Button
        size="sm"
        variant={textAlign === 'left' ? "default" : "ghost"}
        className="w-8 h-8 p-0"
        onClick={() => onTextAlignChange('left')}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={textAlign === 'center' ? "default" : "ghost"}
        className="w-8 h-8 p-0"
        onClick={() => onTextAlignChange('center')}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={textAlign === 'right' ? "default" : "ghost"}
        className="w-8 h-8 p-0"
        onClick={() => onTextAlignChange('right')}
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200" />

      {/* 색상 */}
      <div className="flex items-center gap-1">
        <Palette className="w-4 h-4 text-gray-500" />
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
        />
      </div>
    </div>
  )
}
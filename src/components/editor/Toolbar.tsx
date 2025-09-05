'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { useEditorStore, useCanUndo, useCanRedo } from '@/lib/store'
import { ElementType } from '@/lib/types'
import {
  Type,
  Heading1,
  Image,
  Square,
  Minus,
  Package,
  MousePointer,
  Undo2,
  Redo2,
  Save,
  Download,
  Trash2
} from 'lucide-react'

const elementTypes: Array<{
  type: ElementType
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { type: 'text', label: '텍스트', icon: Type },
  { type: 'heading', label: '제목', icon: Heading1 },
  { type: 'image', label: '이미지', icon: Image },
  { type: 'button', label: '버튼', icon: Square },
  { type: 'divider', label: '구분선', icon: Minus },
  { type: 'product-info', label: '상품정보', icon: Package },
]

export function Toolbar() {
  const { 
    addElement, 
    selectedElementId,
    deleteElement,
    undo, 
    redo,
    // clearCanvas // 추후 필요시 사용
  } = useEditorStore()
  
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const handleAddElement = (type: ElementType) => {
    // 캔버스 중앙에 요소 추가
    addElement(type, { x: 100, y: 100 })
  }

  const handleDeleteSelected = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId)
    }
  }

  const handleSave = () => {
    // TODO: 저장 기능 구현
    console.log('저장 기능은 추후 구현 예정')
  }

  const handleExport = () => {
    // TODO: 내보내기 기능 구현
    console.log('내보내기 기능은 추후 구현 예정')
  }

  return (
    <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
      {/* 선택 도구 */}
      <Tooltip content="선택 도구">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <MousePointer className="w-4 h-4" />
        </Button>
      </Tooltip>

      <div className="w-8 border-t border-gray-300" />

      {/* 요소 추가 도구들 */}
      {elementTypes.map(({ type, label, icon: Icon }) => (
        <Tooltip key={type} content={label}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10"
            onClick={() => handleAddElement(type)}
          >
            <Icon className="w-4 h-4" />
          </Button>
        </Tooltip>
      ))}

      <div className="w-8 border-t border-gray-300" />

      {/* 실행 취소/다시 실행 */}
      <Tooltip content="실행 취소">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10"
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
      </Tooltip>

      <Tooltip content="다시 실행">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10"
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </Tooltip>

      <div className="w-8 border-t border-gray-300" />

      {/* 삭제 */}
      <Tooltip content="선택된 요소 삭제">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10 text-red-500 hover:text-red-600"
          onClick={handleDeleteSelected}
          disabled={!selectedElementId}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </Tooltip>

      <div className="flex-1" />

      {/* 저장/내보내기 */}
      <Tooltip content="저장">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10"
          onClick={handleSave}
        >
          <Save className="w-4 h-4" />
        </Button>
      </Tooltip>

      <Tooltip content="내보내기">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10"
          onClick={handleExport}
        >
          <Download className="w-4 h-4" />
        </Button>
      </Tooltip>
    </div>
  )
}
'use client'

import React from 'react'
import { useEditorStore } from '@/lib/store'
import { EditorElement } from '@/lib/types'
import { ElementRenderer } from './ElementRenderer'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface CanvasProps {
  className?: string
}

export function Canvas({ className }: CanvasProps) {
  const { 
    elements, 
    selectedElementId, 
    draggedElement,
    selectElement, 
    moveElement,
    startDrag,
    endDrag 
  } = useEditorStore()

  const [activeId, setActiveId] = React.useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const elementId = active.id as string
    const element = elements.find(el => el.id === elementId)
    
    if (element) {
      setActiveId(elementId)
      startDrag(element)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const elementId = active.id as string
    const element = elements.find(el => el.id === elementId)
    
    if (element && delta) {
      const newPosition = {
        x: Math.max(0, element.position.x + delta.x),
        y: Math.max(0, element.position.y + delta.y)
      }
      
      moveElement(elementId, newPosition)
    }
    
    setActiveId(null)
    endDrag()
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 캔버스 자체를 클릭했을 때만 선택 해제
    if (e.target === e.currentTarget) {
      selectElement(null)
    }
  }

  const handleElementClick = (element: EditorElement, e: React.MouseEvent) => {
    e.stopPropagation()
    selectElement(element.id)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={cn(
          "relative w-full h-full bg-white overflow-auto",
          "border-2 border-dashed border-gray-200",
          className
        )}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* 캔버스 안내 메시지 */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">에디터 캔버스</div>
              <div className="text-sm">
                왼쪽 도구 모음에서 요소를 드래그하여 추가하거나<br />
                AI로 페이지를 생성해보세요
              </div>
            </div>
          </div>
        )}

        {/* 요소들 렌더링 */}
        {elements.map((element) => (
          <div
            key={element.id}
            className={cn(
              "absolute cursor-move",
              selectedElementId === element.id && "ring-2 ring-blue-500",
              activeId === element.id && "opacity-50"
            )}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              zIndex: element.zIndex,
            }}
            onClick={(e) => handleElementClick(element, e)}
          >
            <ElementRenderer element={element} />
            
            {/* 선택된 요소의 조작 핸들 */}
            {selectedElementId === element.id && (
              <div className="absolute inset-0 pointer-events-none">
                {/* 모서리 핸들들 */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-sm" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-sm" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-sm" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-sm" />
                
                {/* 크기 표시 */}
                <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1 rounded">
                  {element.size.width} x {element.size.height}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 드래그 오버레이 */}
        <DragOverlay>
          {activeId && draggedElement && (
            <div className="opacity-80">
              <ElementRenderer element={draggedElement} />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
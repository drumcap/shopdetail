'use client'

import React from 'react'
import { useEditorStore } from '@/lib/store'
import { EditorElement } from '@/lib/types'
import { ElementRenderer } from './ElementRenderer'
import { TextToolbar } from './TextToolbar'
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent, 
  useDraggable,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface CanvasProps {
  className?: string
}

// 리사이즈 핸들 컴포넌트
function ResizeHandle({ 
  position, 
  onMouseDown 
}: { 
  position: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
  onMouseDown: (e: React.MouseEvent, direction: string) => void 
}) {
  const getPositionClasses = () => {
    switch (position) {
      case 'nw': return 'absolute -top-1 -left-1 cursor-nw-resize'
      case 'ne': return 'absolute -top-1 -right-1 cursor-ne-resize'
      case 'sw': return 'absolute -bottom-1 -left-1 cursor-sw-resize'
      case 'se': return 'absolute -bottom-1 -right-1 cursor-se-resize'
      case 'n': return 'absolute -top-1 left-1/2 -translate-x-1/2 cursor-n-resize'
      case 's': return 'absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-s-resize'
      case 'e': return 'absolute top-1/2 -right-1 -translate-y-1/2 cursor-e-resize'
      case 'w': return 'absolute top-1/2 -left-1 -translate-y-1/2 cursor-w-resize'
      default: return ''
    }
  }

  return (
    <div
      className={cn(getPositionClasses(), "w-2 h-2 bg-blue-500 rounded-sm pointer-events-auto")}
      onMouseDown={(e) => onMouseDown(e, position)}
    />
  )
}

// 드래그 가능한 요소 컴포넌트
function DraggableElement({ element, isSelected, onClick }: {
  element: EditorElement
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  const { resizeElement, updateElement } = useEditorStore()
  const [isResizing, setIsResizing] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: element.id,
    disabled: isResizing || isEditing, // 리사이즈 또는 편집 중일 때는 드래그 비활성화
  })

  const style = {
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    zIndex: element.zIndex,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  }

  // 리사이즈 핸들 드래그 시작
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    setIsResizing(true)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = element.size.width
    const startHeight = element.size.height

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight

      // 방향에 따른 크기 계산
      if (direction.includes('e')) newWidth = Math.max(50, startWidth + deltaX)
      if (direction.includes('w')) newWidth = Math.max(50, startWidth - deltaX)
      if (direction.includes('s')) newHeight = Math.max(30, startHeight + deltaY)
      if (direction.includes('n')) newHeight = Math.max(30, startHeight - deltaY)

      resizeElement(element.id, { width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 텍스트 편집 핸들러
  const handleEditStart = () => {
    if (element.type === 'text' || element.type === 'heading') {
      setIsEditing(true)
    }
  }

  const handleEditEnd = () => {
    setIsEditing(false)
  }

  const handleTextEdit = (newText: string) => {
    if (element.type === 'text' || element.type === 'heading') {
      updateElement(element.id, {
        content: {
          ...(element as any).content,
          text: newText
        }
      })
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isResizing ? {} : listeners)}
      {...(isResizing ? {} : attributes)}
      className={cn(
        "absolute",
        !isResizing && !isEditing && "cursor-move",
        isSelected && "ring-2 ring-blue-500",
        isDragging && "opacity-50"
      )}
      onClick={onClick}
    >
      <ElementRenderer 
        element={element} 
        isEditing={isEditing}
        onEdit={handleTextEdit}
        onEditStart={handleEditStart}
        onEditEnd={handleEditEnd}
      />
      
      {/* 선택된 요소의 조작 핸들 */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 모서리 핸들들 */}
          <ResizeHandle position="nw" onMouseDown={handleResizeStart} />
          <ResizeHandle position="ne" onMouseDown={handleResizeStart} />
          <ResizeHandle position="sw" onMouseDown={handleResizeStart} />
          <ResizeHandle position="se" onMouseDown={handleResizeStart} />
          <ResizeHandle position="n" onMouseDown={handleResizeStart} />
          <ResizeHandle position="s" onMouseDown={handleResizeStart} />
          <ResizeHandle position="e" onMouseDown={handleResizeStart} />
          <ResizeHandle position="w" onMouseDown={handleResizeStart} />
          
          {/* 크기 표시 */}
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1 rounded pointer-events-none">
            {element.size.width} x {element.size.height}
          </div>

          {/* 텍스트 툴바 */}
          {(element.type === 'text' || element.type === 'heading') && (
            <TextToolbar
              className="absolute -top-14 left-0 pointer-events-auto"
              fontSize={element.style.fontSize || 16}
              fontWeight={element.style.fontWeight || 400}
              textAlign={element.style.textAlign || 'left'}
              color={element.style.color || '#000000'}
              onFontSizeChange={(size) => updateElement(element.id, {
                style: { ...element.style, fontSize: size }
              })}
              onFontWeightChange={(weight) => updateElement(element.id, {
                style: { ...element.style, fontWeight: weight }
              })}
              onTextAlignChange={(align) => updateElement(element.id, {
                style: { ...element.style, textAlign: align }
              })}
              onColorChange={(color) => updateElement(element.id, {
                style: { ...element.style, color: color }
              })}
            />
          )}
        </div>
      )}
    </div>
  )
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

  // 센서 설정 - 클릭과 드래그를 구분하기 위해 활성화 거리 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const elementId = active.id as string
    const element = elements.find(el => el.id === elementId)
    
    if (element) {
      setActiveId(elementId)
      startDrag(element)
    }
  }

  // 그리드 스냅 함수 (20px 단위)
  const snapToGrid = (value: number, gridSize: number = 20) => {
    return Math.round(value / gridSize) * gridSize
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const elementId = active.id as string
    const element = elements.find(el => el.id === elementId)
    
    if (element && delta) {
      // 그리드에 스냅된 새 위치 계산
      const rawX = element.position.x + delta.x
      const rawY = element.position.y + delta.y
      
      const newPosition = {
        x: Math.max(0, snapToGrid(rawX)),
        y: Math.max(0, snapToGrid(rawY))
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
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
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
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onClick={(e) => handleElementClick(element, e)}
          />
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
'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button' // 추후 필요시 사용
import { useEditorStore, useSelectedElement } from '@/lib/store'
import { TextElement, ImageElement, ButtonElement, ProductInfoElement } from '@/lib/types'

export function PropertiesPanel() {
  const selectedElement = useSelectedElement()
  const { updateElement } = useEditorStore()

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">속성</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              편집할 요소를 선택하세요
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<EditorElement>) => {
    updateElement(selectedElement.id, updates)
  }

  const handleStyleUpdate = (styleUpdates: Partial<EditorElement['style']>) => {
    handleUpdate({
      style: {
        ...selectedElement.style,
        ...styleUpdates
      }
    })
  }

  const handleContentUpdate = (contentUpdates: Record<string, unknown>) => {
    handleUpdate({
      content: {
        ...selectedElement.content,
        ...contentUpdates
      }
    })
  }

  const renderElementProperties = () => {
    switch (selectedElement.type) {
      case 'text':
      case 'heading': {
        const textElement = selectedElement as TextElement
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                텍스트
              </label>
              <Input
                value={textElement.content.text}
                onChange={(e) => handleContentUpdate({ text: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                글꼴 크기
              </label>
              <Input
                type="number"
                value={textElement.style.fontSize || 16}
                onChange={(e) => handleStyleUpdate({ fontSize: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                글꼴 색상
              </label>
              <Input
                type="color"
                value={textElement.style.color || '#000000'}
                onChange={(e) => handleStyleUpdate({ color: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                배경색
              </label>
              <Input
                type="color"
                value={textElement.style.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
              />
            </div>
          </div>
        )
      }

      case 'image': {
        const imageElement = selectedElement as ImageElement
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                이미지 URL
              </label>
              <Input
                value={imageElement.content.src}
                onChange={(e) => handleContentUpdate({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                대체 텍스트
              </label>
              <Input
                value={imageElement.content.alt}
                onChange={(e) => handleContentUpdate({ alt: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                캡션
              </label>
              <Input
                value={imageElement.content.caption || ''}
                onChange={(e) => handleContentUpdate({ caption: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                테두리 반경
              </label>
              <Input
                type="number"
                value={imageElement.style.borderRadius || 0}
                onChange={(e) => handleStyleUpdate({ borderRadius: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )
      }

      case 'button': {
        const buttonElement = selectedElement as ButtonElement
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                버튼 텍스트
              </label>
              <Input
                value={buttonElement.content.text}
                onChange={(e) => handleContentUpdate({ text: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                링크 URL
              </label>
              <Input
                value={buttonElement.content.href || ''}
                onChange={(e) => handleContentUpdate({ href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                배경색
              </label>
              <Input
                type="color"
                value={buttonElement.style.backgroundColor || '#007bff'}
                onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                텍스트 색상
              </label>
              <Input
                type="color"
                value={buttonElement.style.color || '#ffffff'}
                onChange={(e) => handleStyleUpdate({ color: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                테두리 반경
              </label>
              <Input
                type="number"
                value={buttonElement.style.borderRadius || 6}
                onChange={(e) => handleStyleUpdate({ borderRadius: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )
      }

      case 'product-info': {
        const productElement = selectedElement as ProductInfoElement
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                상품명
              </label>
              <Input
                value={productElement.content.name}
                onChange={(e) => handleContentUpdate({ name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                가격
              </label>
              <Input
                type="number"
                value={productElement.content.price}
                onChange={(e) => handleContentUpdate({ price: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                원래 가격 (선택)
              </label>
              <Input
                type="number"
                value={productElement.content.originalPrice || ''}
                onChange={(e) => handleContentUpdate({ 
                  originalPrice: e.target.value ? parseInt(e.target.value) : undefined 
                })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                상품 설명
              </label>
              <textarea
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none"
                rows={3}
                value={productElement.content.description}
                onChange={(e) => handleContentUpdate({ description: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                주요 특징 (줄바꿈으로 구분)
              </label>
              <textarea
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none"
                rows={4}
                value={productElement.content.features.join('\n')}
                onChange={(e) => handleContentUpdate({ 
                  features: e.target.value.split('\n').filter(f => f.trim()) 
                })}
              />
            </div>
          </div>
        )
      }

      default:
        return (
          <p className="text-sm text-gray-500">
            이 요소는 편집 가능한 속성이 없습니다
          </p>
        )
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {selectedElement.type} 속성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 기본 속성 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-3">위치 및 크기</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">X</label>
                <Input
                  type="number"
                  value={selectedElement.position.x}
                  onChange={(e) => handleUpdate({
                    position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Y</label>
                <Input
                  type="number"
                  value={selectedElement.position.y}
                  onChange={(e) => handleUpdate({
                    position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">너비</label>
                <Input
                  type="number"
                  value={selectedElement.size.width}
                  onChange={(e) => handleUpdate({
                    size: { ...selectedElement.size, width: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">높이</label>
                <Input
                  type="number"
                  value={selectedElement.size.height}
                  onChange={(e) => handleUpdate({
                    size: { ...selectedElement.size, height: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>
          </div>

          {/* 요소별 속성 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-3">콘텐츠 설정</h4>
            {renderElementProperties()}
          </div>

          {/* 패딩 */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              패딩
            </label>
            <Input
              type="number"
              value={selectedElement.style.padding || 0}
              onChange={(e) => handleStyleUpdate({ padding: parseInt(e.target.value) || 0 })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
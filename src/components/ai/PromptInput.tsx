'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useEditorStore } from '@/lib/store'
import { AIPrompt } from '@/lib/types'
import { Sparkles, Loader2 } from 'lucide-react'

const toneOptions = [
  { value: 'professional', label: '전문적' },
  { value: 'casual', label: '캐주얼' },
  { value: 'luxury', label: '럭셔리' },
  { value: 'tech', label: '기술적' },
] as const

const styleOptions = [
  { value: 'modern', label: '모던' },
  { value: 'classic', label: '클래식' },
  { value: 'minimal', label: '미니멀' },
  { value: 'colorful', label: '컬러풀' },
] as const

export function PromptInput() {
  const { isGenerating, setGenerating, setElements } = useEditorStore()
  
  const [prompt, setPrompt] = useState<AIPrompt>({
    productName: '',
    productCategory: '',
    targetAudience: '',
    keyFeatures: [],
    tone: 'professional',
    style: 'modern',
    additionalInstructions: '',
  })

  const [featuresInput, setFeaturesInput] = useState('')

  const handleInputChange = (field: keyof AIPrompt, value: string | string[]) => {
    setPrompt(prev => ({ ...prev, [field]: value }))
  }

  const handleFeaturesChange = (value: string) => {
    setFeaturesInput(value)
    const features = value.split(',').map(f => f.trim()).filter(f => f.length > 0)
    handleInputChange('keyFeatures', features)
  }

  const handleGenerate = async () => {
    if (!prompt.productName.trim()) {
      alert('상품명을 입력해주세요')
      return
    }

    setGenerating(true)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      })

      if (!response.ok) {
        throw new Error('AI 생성에 실패했습니다')
      }

      const result = await response.json()
      
      if (result.elements && result.elements.length > 0) {
        setElements(result.elements)
      }
      
    } catch (error) {
      console.error('AI 생성 오류:', error)
      alert('AI 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI 페이지 생성
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 상품 기본 정보 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상품명 *
          </label>
          <Input
            value={prompt.productName}
            onChange={(e) => handleInputChange('productName', e.target.value)}
            placeholder="예: 프리미엄 무선 이어폰"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상품 카테고리
          </label>
          <Input
            value={prompt.productCategory}
            onChange={(e) => handleInputChange('productCategory', e.target.value)}
            placeholder="예: 전자기기, 패션, 뷰티"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            타겟 고객
          </label>
          <Input
            value={prompt.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="예: 20-30대 직장인, 스포츠 애호가"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주요 특징 (쉼표로 구분)
          </label>
          <Input
            value={featuresInput}
            onChange={(e) => handleFeaturesChange(e.target.value)}
            placeholder="예: 노이즈 캔슬링, 30시간 배터리, 방수"
            className="w-full"
          />
        </div>

        {/* 스타일 설정 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              톤앤매너
            </label>
            <select
              value={prompt.tone}
              onChange={(e) => handleInputChange('tone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              디자인 스타일
            </label>
            <select
              value={prompt.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {styleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            추가 요청사항
          </label>
          <textarea
            value={prompt.additionalInstructions}
            onChange={(e) => handleInputChange('additionalInstructions', e.target.value)}
            placeholder="예: 할인 정보 강조, 리뷰 섹션 포함"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
            rows={3}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.productName.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI로 페이지 생성하기
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              AI가 상세페이지를 생성하고 있습니다...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              보통 10-20초가 소요됩니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
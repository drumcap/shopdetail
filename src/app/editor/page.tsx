'use client'

import React from 'react'
import { Toolbar } from '@/components/editor/Toolbar'
import { Canvas } from '@/components/editor/Canvas'
import { PropertiesPanel } from '@/components/editor/PropertiesPanel'
import { PromptInput } from '@/components/ai/PromptInput'
// import { Button } from '@/components/ui/button' // 추후 필요시 사용
import { Card, CardContent } from '@/components/ui/card'
import { useEditorStore } from '@/lib/store'
import { useState } from 'react'
import { 
  Sparkles, 
  Layers, 
  // Settings, // 추후 필요시 사용
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react'
import Link from 'next/link'

type PanelMode = 'ai' | 'templates' | 'properties'

export default function EditorPage() {
  const { elements, isGenerating } = useEditorStore()
  const [leftPanelMode, setLeftPanelMode] = useState<PanelMode>('ai')
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span className="font-semibold">홈으로</span>
          </Link>
          <div className="text-gray-300">|</div>
          <h1 className="text-lg font-semibold">쇼핑몰 상세페이지 에디터</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            요소 {elements.length}개
          </span>
          {isGenerating && (
            <div className="flex items-center gap-2 text-purple-600">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
              <span className="text-sm">AI 생성 중...</span>
            </div>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽 패널 */}
        <div className={`transition-all duration-300 ${isLeftPanelOpen ? 'w-80' : 'w-0'}`}>
          {isLeftPanelOpen && (
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              {/* 패널 탭 */}
              <div className="border-b border-gray-200 p-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setLeftPanelMode('ai')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      leftPanelMode === 'ai'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI 생성
                  </button>
                  
                  <button
                    onClick={() => setLeftPanelMode('templates')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      leftPanelMode === 'templates'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    템플릿
                  </button>
                </div>
              </div>

              {/* 패널 컨텐츠 */}
              <div className="flex-1 overflow-y-auto p-4">
                {leftPanelMode === 'ai' && <PromptInput />}
                
                {leftPanelMode === 'templates' && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-gray-500">
                        <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm mb-2">템플릿 기능</p>
                        <p className="text-xs text-gray-400">
                          추후 업데이트 예정입니다
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 왼쪽 패널 토글 버튼 */}
        <button
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          className="w-4 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors border-r border-gray-300"
        >
          {isLeftPanelOpen ? (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          )}
        </button>

        {/* 도구 모음 */}
        <Toolbar />

        {/* 캔버스 영역 */}
        <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Canvas />
          </div>
        </div>

        {/* 오른쪽 패널 토글 버튼 */}
        <button
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          className="w-4 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors border-l border-gray-300"
        >
          {isRightPanelOpen ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>

        {/* 오른쪽 속성 패널 */}
        <div className={`transition-all duration-300 ${isRightPanelOpen ? 'w-80' : 'w-0'}`}>
          {isRightPanelOpen && <PropertiesPanel />}
        </div>
      </div>
    </div>
  )
}
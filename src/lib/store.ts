import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { EditorElement, EditorState, Template, Position, Size } from './types'
import { createDefaultElement } from './utils'

interface EditorStore extends EditorState {
  // Actions
  addElement: (type: EditorElement['type'], position?: Position) => void
  updateElement: (id: string, updates: Partial<EditorElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  moveElement: (id: string, position: Position) => void
  resizeElement: (id: string, size: Size) => void
  setElements: (elements: EditorElement[]) => void
  duplicateElement: (id: string) => void
  
  // History
  undo: () => void
  redo: () => void
  addToHistory: () => void
  
  // Drag & Drop
  startDrag: (element: EditorElement) => void
  endDrag: () => void
  
  // Template
  loadTemplate: (template: Template) => void
  clearCanvas: () => void
  
  // AI Generation
  setGenerating: (isGenerating: boolean) => void
  
  // Z-Index management
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
}

// 초기 상태
const initialState: EditorState = {
  elements: [],
  selectedElementId: null,
  history: {
    past: [],
    present: [],
    future: []
  },
  draggedElement: null,
  isGenerating: false,
  currentTemplate: null,
}

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // 요소 추가
    addElement: (type, position) => {
      const newElement = {
        ...createDefaultElement(type),
        position: position || { x: 50, y: 50 },
      } as EditorElement

      set((state) => ({
        elements: [...state.elements, newElement],
        selectedElementId: newElement.id,
      }))
      get().addToHistory()
    },

    // 요소 업데이트
    updateElement: (id, updates) => {
      set((state) => ({
        elements: state.elements.map((element) =>
          element.id === id ? { ...element, ...updates } : element
        ),
      }))
      get().addToHistory()
    },

    // 요소 삭제
    deleteElement: (id) => {
      set((state) => ({
        elements: state.elements.filter((element) => element.id !== id),
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
      }))
      get().addToHistory()
    },

    // 요소 선택
    selectElement: (id) => {
      set({ selectedElementId: id })
    },

    // 요소 이동
    moveElement: (id, position) => {
      set((state) => ({
        elements: state.elements.map((element) =>
          element.id === id ? { ...element, position } : element
        ),
      }))
    },

    // 요소 크기 조정
    resizeElement: (id, size) => {
      set((state) => ({
        elements: state.elements.map((element) =>
          element.id === id ? { ...element, size } : element
        ),
      }))
    },

    // 요소 배열 설정
    setElements: (elements) => {
      set({ elements })
      get().addToHistory()
    },

    // 요소 복제
    duplicateElement: (id) => {
      const state = get()
      const element = state.elements.find((el) => el.id === id)
      if (!element) return

      const duplicated = {
        ...element,
        id: Math.random().toString(36).substr(2, 9),
        position: {
          x: element.position.x + 20,
          y: element.position.y + 20
        }
      }

      set((state) => ({
        elements: [...state.elements, duplicated],
        selectedElementId: duplicated.id,
      }))
      get().addToHistory()
    },

    // 히스토리에 추가
    addToHistory: () => {
      const state = get()
      set((prevState) => ({
        history: {
          past: [...prevState.history.past, prevState.history.present],
          present: [...state.elements],
          future: []
        }
      }))
    },

    // 실행 취소
    undo: () => {
      set((state) => {
        if (state.history.past.length === 0) return state

        const previous = state.history.past[state.history.past.length - 1]
        const newPast = state.history.past.slice(0, -1)

        return {
          elements: previous,
          history: {
            past: newPast,
            present: previous,
            future: [state.history.present, ...state.history.future]
          }
        }
      })
    },

    // 다시 실행
    redo: () => {
      set((state) => {
        if (state.history.future.length === 0) return state

        const next = state.history.future[0]
        const newFuture = state.history.future.slice(1)

        return {
          elements: next,
          history: {
            past: [...state.history.past, state.history.present],
            present: next,
            future: newFuture
          }
        }
      })
    },

    // 드래그 시작
    startDrag: (element) => {
      set({ draggedElement: element })
    },

    // 드래그 종료
    endDrag: () => {
      set({ draggedElement: null })
      get().addToHistory()
    },

    // 템플릿 로드
    loadTemplate: (template) => {
      set({
        elements: [...template.elements],
        currentTemplate: template,
        selectedElementId: null,
      })
      get().addToHistory()
    },

    // 캔버스 초기화
    clearCanvas: () => {
      set({
        elements: [],
        selectedElementId: null,
        currentTemplate: null,
      })
      get().addToHistory()
    },

    // AI 생성 상태 설정
    setGenerating: (isGenerating) => {
      set({ isGenerating })
    },

    // Z-index 관리
    bringToFront: (id) => {
      const state = get()
      const maxZIndex = Math.max(...state.elements.map(el => el.zIndex), 0)
      
      set((state) => ({
        elements: state.elements.map((element) =>
          element.id === id ? { ...element, zIndex: maxZIndex + 1 } : element
        ),
      }))
      get().addToHistory()
    },

    sendToBack: (id) => {
      const state = get()
      const minZIndex = Math.min(...state.elements.map(el => el.zIndex), 1)
      
      set((state) => ({
        elements: state.elements.map((element) =>
          element.id === id ? { ...element, zIndex: minZIndex - 1 } : element
        ),
      }))
      get().addToHistory()
    },
  }))
)

// 선택된 요소 가져오기 (셀렉터)
export const useSelectedElement = () => {
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const elements = useEditorStore((state) => state.elements)
  
  return elements.find((element) => element.id === selectedElementId)
}

// 히스토리 상태 가져오기
export const useCanUndo = () => {
  return useEditorStore((state) => state.history.past.length > 0)
}

export const useCanRedo = () => {
  return useEditorStore((state) => state.history.future.length > 0)
}
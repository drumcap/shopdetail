import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EditorElement, ElementType } from "./types"

// Tailwind CSS 클래스 병합
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 고유 ID 생성
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 요소 기본값 생성
export function createDefaultElement(type: ElementType): Partial<EditorElement> {
  const baseElement = {
    id: generateId(),
    type,
    position: { x: 0, y: 0 },
    size: { width: 200, height: 50 },
    style: {},
    zIndex: 1,
  }

  switch (type) {
    case 'text':
      return {
        ...baseElement,
        content: {
          text: '텍스트를 입력하세요',
          tag: 'p'
        },
        style: {
          fontSize: 16,
          color: '#000000',
        }
      }

    case 'heading':
      return {
        ...baseElement,
        size: { width: 300, height: 40 },
        content: {
          text: '제목을 입력하세요',
          tag: 'h2'
        },
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000000',
        }
      }

    case 'image':
      return {
        ...baseElement,
        size: { width: 300, height: 200 },
        content: {
          src: '/placeholder-image.jpg',
          alt: '이미지',
          caption: ''
        }
      }

    case 'button':
      return {
        ...baseElement,
        size: { width: 120, height: 40 },
        content: {
          text: '버튼',
          variant: 'primary' as const
        },
        style: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          borderRadius: 6,
        }
      }

    case 'container':
      return {
        ...baseElement,
        size: { width: 400, height: 200 },
        content: {
          children: [],
          layout: 'flex-col' as const,
          gap: 10
        },
        style: {
          backgroundColor: '#f8f9fa',
          padding: 20,
          borderRadius: 8,
        }
      }

    case 'product-info':
      return {
        ...baseElement,
        size: { width: 400, height: 300 },
        content: {
          name: '상품명',
          price: 99000,
          description: '상품 설명을 입력하세요',
          features: ['특징 1', '특징 2', '특징 3']
        },
        style: {
          padding: 20,
        }
      }

    default:
      return baseElement
  }
}

// 요소 복제
export function cloneElement(element: EditorElement): EditorElement {
  return {
    ...element,
    id: generateId(),
    position: {
      x: element.position.x + 20,
      y: element.position.y + 20
    }
  }
}

// 가격 포맷팅
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

// 요소 정렬 (z-index 기준)
export function sortElementsByZIndex(elements: EditorElement[]): EditorElement[] {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex)
}

// 요소가 영역 안에 있는지 확인
export function isElementInBounds(
  element: EditorElement, 
  bounds: { x: number; y: number; width: number; height: number }
): boolean {
  const elementRight = element.position.x + element.size.width
  const elementBottom = element.position.y + element.size.height
  const boundsRight = bounds.x + bounds.width
  const boundsBottom = bounds.y + bounds.height

  return (
    element.position.x >= bounds.x &&
    element.position.y >= bounds.y &&
    elementRight <= boundsRight &&
    elementBottom <= boundsBottom
  )
}

// 두 요소가 겹치는지 확인
export function doElementsOverlap(element1: EditorElement, element2: EditorElement): boolean {
  return !(
    element1.position.x + element1.size.width < element2.position.x ||
    element2.position.x + element2.size.width < element1.position.x ||
    element1.position.y + element1.size.height < element2.position.y ||
    element2.position.y + element2.size.height < element1.position.y
  )
}

// 스타일 객체를 CSS 문자열로 변환
export function styleToCss(style: Record<string, string | number>): string {
  return Object.entries(style)
    .map(([key, value]) => {
      // camelCase를 kebab-case로 변환
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}${typeof value === 'number' ? 'px' : ''}`
    })
    .join('; ')
}
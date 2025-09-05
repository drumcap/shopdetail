// 에디터의 핵심 타입 정의

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementStyle {
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  border?: string;
  textAlign?: 'left' | 'center' | 'right';
}

// 에디터 요소의 기본 인터페이스
export interface EditorElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  style: ElementStyle;
  content: Record<string, unknown>; // 타입별로 다른 콘텐츠
  zIndex: number;
}

// 요소 타입들
export type ElementType = 
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'divider'
  | 'container'
  | 'product-info'
  | 'review-section'
  | 'spec-table';

// 텍스트 요소
export interface TextElement extends EditorElement {
  type: 'text' | 'heading';
  content: {
    text: string;
    tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
}

// 이미지 요소
export interface ImageElement extends EditorElement {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption?: string;
  };
}

// 버튼 요소
export interface ButtonElement extends EditorElement {
  type: 'button';
  content: {
    text: string;
    href?: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
}

// 컨테이너 요소
export interface ContainerElement extends EditorElement {
  type: 'container';
  content: {
    children: string[]; // 자식 요소들의 ID
    layout: 'flex-row' | 'flex-col' | 'grid';
    gap?: number;
  };
}

// 상품 정보 요소
export interface ProductInfoElement extends EditorElement {
  type: 'product-info';
  content: {
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    features: string[];
  };
}

// 템플릿 정의
export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
  elements: EditorElement[];
  createdAt: Date;
}

// 페이지 정의
export interface Page {
  id: string;
  title: string;
  elements: EditorElement[];
  template?: Template;
  createdAt: Date;
  updatedAt: Date;
}

// AI 프롬프트 관련
export interface AIPrompt {
  productName: string;
  productCategory: string;
  targetAudience: string;
  keyFeatures: string[];
  tone: 'professional' | 'casual' | 'luxury' | 'tech';
  style: 'modern' | 'classic' | 'minimal' | 'colorful';
  additionalInstructions?: string;
}

export interface AIGenerationResult {
  elements: EditorElement[];
  suggestions: string[];
}

// 에디터 상태
export interface EditorState {
  elements: EditorElement[];
  selectedElementId: string | null;
  history: {
    past: EditorElement[][];
    present: EditorElement[];
    future: EditorElement[][];
  };
  draggedElement: EditorElement | null;
  isGenerating: boolean;
  currentTemplate: Template | null;
}

// 에디터 액션들
export type EditorAction = 
  | { type: 'ADD_ELEMENT'; element: EditorElement }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<EditorElement> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'SELECT_ELEMENT'; id: string | null }
  | { type: 'MOVE_ELEMENT'; id: string; position: Position }
  | { type: 'RESIZE_ELEMENT'; id: string; size: Size }
  | { type: 'SET_ELEMENTS'; elements: EditorElement[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'START_DRAG'; element: EditorElement }
  | { type: 'END_DRAG' }
  | { type: 'SET_GENERATING'; isGenerating: boolean }
  | { type: 'LOAD_TEMPLATE'; template: Template };
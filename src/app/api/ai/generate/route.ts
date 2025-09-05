import { NextRequest, NextResponse } from 'next/server'
import { AIPrompt, EditorElement } from '@/lib/types'
import { generateId } from '@/lib/utils'

// 데모용 AI 응답 생성 함수
function generateDemoElements(prompt: AIPrompt): EditorElement[] {
  const elements: EditorElement[] = []

  // 제목
  elements.push({
    id: generateId(),
    type: 'heading',
    position: { x: 50, y: 50 },
    size: { width: 600, height: 50 },
    style: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1a1a1a',
      textAlign: 'center'
    },
    content: {
      text: prompt.productName,
      tag: 'h1'
    },
    zIndex: 1
  })

  // 메인 이미지
  elements.push({
    id: generateId(),
    type: 'image',
    position: { x: 50, y: 120 },
    size: { width: 400, height: 300 },
    style: {
      borderRadius: 12
    },
    content: {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      alt: prompt.productName,
      caption: ''
    },
    zIndex: 1
  })

  // 상품 정보
  const features = prompt.keyFeatures.length > 0 ? prompt.keyFeatures : [
    '고품질 재료 사용',
    '현대적 디자인',
    '우수한 성능'
  ]

  elements.push({
    id: generateId(),
    type: 'product-info',
    position: { x: 480, y: 120 },
    size: { width: 350, height: 300 },
    style: {
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 20
    },
    content: {
      name: prompt.productName,
      price: Math.floor(Math.random() * 500000) + 50000, // 랜덤 가격 (5만원~55만원)
      originalPrice: Math.floor(Math.random() * 100000) + 600000, // 할인가 시뮬레이션
      description: `${prompt.targetAudience || '모든 고객'}을 위한 프리미엄 ${prompt.productCategory || '제품'}입니다. 최고의 품질과 성능을 자랑합니다.`,
      features: features
    },
    zIndex: 1
  })

  // 제품 설명 텍스트
  const descriptionText = getDescriptionByTone(prompt)
  elements.push({
    id: generateId(),
    type: 'text',
    position: { x: 50, y: 450 },
    size: { width: 780, height: 100 },
    style: {
      fontSize: 16,
      color: '#4a5568',
      padding: 20,
      backgroundColor: '#ffffff',
      borderRadius: 8
    },
    content: {
      text: descriptionText,
      tag: 'p'
    },
    zIndex: 1
  })

  // 구매 버튼
  const buttonColor = getButtonColorByStyle(prompt.style)
  elements.push({
    id: generateId(),
    type: 'button',
    position: { x: 50, y: 580 },
    size: { width: 200, height: 50 },
    style: {
      backgroundColor: buttonColor,
      color: '#ffffff',
      borderRadius: 8,
      fontSize: 16,
      fontWeight: 'bold'
    },
    content: {
      text: '지금 구매하기',
      variant: 'primary' as const
    },
    zIndex: 1
  })

  // 추가 이미지 (스타일에 따라)
  if (prompt.style === 'colorful') {
    elements.push({
      id: generateId(),
      type: 'image',
      position: { x: 300, y: 580 },
      size: { width: 200, height: 100 },
      style: {
        borderRadius: 8
      },
      content: {
        src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
        alt: '제품 상세 이미지',
        caption: ''
      },
      zIndex: 1
    })
  }

  return elements
}

function getDescriptionByTone(prompt: AIPrompt): string {
  const baseDescription = `${prompt.productName}은(는) 혁신적인 기술과 세련된 디자인이 완벽하게 결합된 제품입니다.`
  
  switch (prompt.tone) {
    case 'professional':
      return `${baseDescription} 전문가들이 인정하는 뛰어난 품질과 성능으로 비즈니스 환경에서도 완벽한 솔루션을 제공합니다. 신뢰할 수 있는 브랜드의 검증된 기술력을 경험해보세요.`
    
    case 'casual':
      return `${baseDescription} 일상생활을 더욱 편리하고 즐겁게 만들어주는 똑똑한 선택이에요! 누구나 쉽게 사용할 수 있고, 생활의 질을 확실히 높여줄 거예요.`
    
    case 'luxury':
      return `${baseDescription} 최고급 소재와 장인정신이 만나 탄생한 프리미엄 컬렉션입니다. 품격 있는 라이프스타일을 추구하는 분들을 위한 특별한 경험을 선사합니다.`
    
    case 'tech':
      return `${baseDescription} 최신 기술이 집약된 혁신적인 솔루션으로, 뛰어난 성능 지표와 고도화된 기능을 통해 사용자 경험을 극대화합니다. 기술적 우수성이 입증된 차세대 제품입니다.`
    
    default:
      return baseDescription
  }
}

function getButtonColorByStyle(style: string): string {
  switch (style) {
    case 'modern':
      return '#2563eb' // Blue
    case 'classic':
      return '#1f2937' // Dark gray
    case 'minimal':
      return '#374151' // Gray
    case 'colorful':
      return '#dc2626' // Red
    default:
      return '#2563eb'
  }
}

export async function POST(request: NextRequest) {
  try {
    const prompt: AIPrompt = await request.json()

    // 입력 검증
    if (!prompt.productName?.trim()) {
      return NextResponse.json(
        { error: '상품명을 입력해주세요' },
        { status: 400 }
      )
    }

    // 실제 환경에서는 여기서 OpenAI API를 호출하겠지만,
    // 데모용으로 하드코딩된 응답을 반환합니다.
    
    // OpenAI API 호출 예시 (실제 구현 시):
    /*
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `당신은 쇼핑몰 상세페이지를 생성하는 전문가입니다. 
    사용자의 요청에 따라 EditorElement 형태의 JSON 배열을 생성해주세요.`

    const userPrompt = `
    상품명: ${prompt.productName}
    카테고리: ${prompt.productCategory}
    타겟 고객: ${prompt.targetAudience}
    주요 특징: ${prompt.keyFeatures.join(', ')}
    톤앤매너: ${prompt.tone}
    디자인 스타일: ${prompt.style}
    추가 요청: ${prompt.additionalInstructions}
    
    위 정보를 바탕으로 상품 상세페이지의 요소들을 생성해주세요.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    })

    const elements = JSON.parse(completion.choices[0].message.content)
    */

    // 데모용 응답
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 지연 (실제 API 호출 시뮬레이션)
    
    const elements = generateDemoElements(prompt)

    return NextResponse.json({
      elements,
      suggestions: [
        '이미지를 더 추가해보세요',
        '고객 리뷰 섹션을 추가하면 좋을 것 같아요',
        '할인 정보를 더 강조해보세요'
      ]
    })

  } catch (error) {
    console.error('AI 생성 오류:', error)
    
    return NextResponse.json(
      { error: 'AI 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
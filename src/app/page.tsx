'use client'

// import Image from "next/image"; // 추후 필요시 사용
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sparkles, 
  MousePointer, 
  Type, 
  Image as ImageIcon,
  Layout,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopDetail AI
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-6">
            AI로 쇼핑몰 상세페이지를 쉽고 빠르게 만드세요
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/editor">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Sparkles className="w-5 h-5 mr-2" />
                에디터 시작하기
              </Button>
            </Link>
            
            <Button variant="outline" size="lg">
              데모 보기
            </Button>
          </div>
        </div>

        {/* 주요 기능 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>AI 자동 생성</CardTitle>
              <CardDescription>
                상품 정보를 입력하면 AI가 자동으로 매력적인 상세페이지를 생성합니다
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MousePointer className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>드래그 앤 드롭</CardTitle>
              <CardDescription>
                마우스로 요소들을 자유롭게 이동하고 배치하여 완벽한 레이아웃을 만드세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>실시간 편집</CardTitle>
              <CardDescription>
                텍스트, 이미지, 색상을 실시간으로 수정하고 즉시 결과를 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 지원 요소들 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">지원하는 요소들</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Type, label: '텍스트 & 제목', desc: '다양한 텍스트 스타일' },
              { icon: ImageIcon, label: '이미지', desc: '상품 이미지 & 갤러리' },
              { icon: Layout, label: '버튼', desc: '구매/문의 버튼' },
              { icon: Sparkles, label: '상품 정보', desc: '가격, 특징, 설명' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-semibold mb-1">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작해보세요!
          </h2>
          <p className="text-lg mb-8 opacity-90">
            몇 번의 클릭만으로 전문적인 상품 상세페이지를 만들 수 있습니다
          </p>
          
          <Link href="/editor">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              <Sparkles className="w-5 h-5 mr-2" />
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 ShopDetail AI. Made with ❤️ for e-commerce.</p>
        </div>
      </footer>
    </div>
  );
}
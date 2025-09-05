'use client'

import React from 'react'
import Image from 'next/image'
import { EditorElement, TextElement, ImageElement, ButtonElement, ProductInfoElement } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface ElementRendererProps {
  element: EditorElement
}

export function ElementRenderer({ element }: ElementRendererProps) {
  const commonStyles = {
    ...element.style,
    fontSize: element.style.fontSize ? `${element.style.fontSize}px` : undefined,
    padding: element.style.padding ? `${element.style.padding}px` : undefined,
    margin: element.style.margin ? `${element.style.margin}px` : undefined,
    borderRadius: element.style.borderRadius ? `${element.style.borderRadius}px` : undefined,
  }

  switch (element.type) {
    case 'text':
    case 'heading': {
      const textElement = element as TextElement
      const Tag = textElement.content.tag || 'p'
      
      return (
        <Tag
          style={commonStyles}
          className="w-full h-full resize-none border-none outline-none bg-transparent"
        >
          {textElement.content.text}
        </Tag>
      )
    }

    case 'image': {
      const imageElement = element as ImageElement
      
      return (
        <div style={commonStyles} className="w-full h-full overflow-hidden relative">
          <Image
            src={imageElement.content.src}
            alt={imageElement.content.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {imageElement.content.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
              {imageElement.content.caption}
            </div>
          )}
        </div>
      )
    }

    case 'button': {
      const buttonElement = element as ButtonElement
      
      const buttonStyles = {
        ...commonStyles,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        border: 'none',
      }

      return (
        <button
          style={buttonStyles}
          className="w-full h-full font-medium text-sm rounded transition-colors hover:opacity-90"
          onClick={(e) => e.preventDefault()}
        >
          {buttonElement.content.text}
        </button>
      )
    }

    case 'product-info': {
      const productElement = element as ProductInfoElement
      
      return (
        <div style={commonStyles} className="w-full h-full">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">
              {productElement.content.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-red-500">
                {formatPrice(productElement.content.price)}
              </span>
              {productElement.content.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(productElement.content.originalPrice)}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {productElement.content.description}
            </p>
            
            <div className="space-y-1">
              {productElement.content.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    case 'container': {
      return (
        <div 
          style={commonStyles}
          className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center"
        >
          <span className="text-gray-400 text-sm">컨테이너</span>
        </div>
      )
    }

    case 'divider': {
      return (
        <div 
          style={commonStyles}
          className="w-full h-full flex items-center"
        >
          <hr className="w-full border-gray-300" />
        </div>
      )
    }

    default:
      return (
        <div 
          style={commonStyles}
          className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center"
        >
          <span className="text-gray-400 text-sm">알 수 없는 요소</span>
        </div>
      )
  }
}
"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FestivalCardProps {
  title: string
  titleHindi?: string
  description?: string
  descriptionHindi?: string
  icon?: string
  children?: ReactNode
  className?: string
  onClick?: () => void
}

export default function FestivalCard({
  title,
  titleHindi,
  description,
  descriptionHindi,
  icon,
  children,
  className = "",
  onClick,
}: FestivalCardProps) {
  return (
    <Card className={`festival-card cursor-pointer ${className}`} onClick={onClick}>
      <CardHeader className="text-center">
        {icon && <div className="text-4xl mb-2 floating-element">{icon}</div>}
        <CardTitle className="text-lg">
          <div className="bilingual-text">
            <span className="english">{title}</span>
            {titleHindi && <span className="hindi text-base">{titleHindi}</span>}
          </div>
        </CardTitle>
        {(description || descriptionHindi) && (
          <CardDescription className="text-sm">
            <div className="bilingual-text">
              {description && <span className="english">{description}</span>}
              {descriptionHindi && <span className="hindi">{descriptionHindi}</span>}
            </div>
          </CardDescription>
        )}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}

"use client"

import Link from "next/link"

interface MessageCardProps {
  id: string
  preview: string
  senderName: string
  createdAt: string
}

export function MessageCard({ id, preview, senderName, createdAt }: MessageCardProps) {
  return (
    <Link href={`/message/${id}`}>
      <div className="p-6 bg-white border border-muted rounded-2xl hover:shadow-md transition-all duration-300 ease-out cursor-pointer shadow-sm">
        <div className="mb-4">
          <p className="font-caveat text-lg text-foreground line-clamp-3 leading-relaxed">{preview}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">from {senderName}</p>
            <p className="text-xs">{createdAt}</p>
          </div>
          <div className="text-2xl">→</div>
        </div>
      </div>
    </Link>
  )
}

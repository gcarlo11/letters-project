"use client"

import Link from "next/link"

interface SessionCardProps {
  id: string
  recipientName: string
  messageCount: number
}

export function SessionCard({ id, recipientName, messageCount }: SessionCardProps) {
  return (
    <Link href={`/session/${id}`}>
      <div className="p-8 bg-white border border-muted rounded-2xl hover:shadow-md transition-all duration-300 ease-out cursor-pointer shadow-sm">
        <h3 className="font-caveat text-3xl font-bold text-foreground mb-2">{recipientName}</h3>
        <p className="text-muted-foreground text-sm">
          {messageCount} {messageCount === 1 ? "letter" : "letters"}
        </p>
      </div>
    </Link>
  )
}

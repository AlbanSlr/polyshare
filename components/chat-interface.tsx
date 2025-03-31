"use client"

import React, { useRef, useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Group {
  id: number
  name: string
  members: number
  documents: number
  isJoined: boolean
}

export interface Message {
  id: string
  content: string
  sender: {
    id: number
    username: string
  }
  timestamp: Date
}

interface ChatInterfaceProps {
  group: Group
  messages: Message[]
  onSendMessage: (content: string) => void
  onBack?: () => void
  userId: number
}

export function ChatInterface({ group, messages, onSendMessage, onBack, userId }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // on scroll jusqu'en bas quand on reçoit un nouveau message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    onSendMessage(inputValue.trim())
    setInputValue("")
  }

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }


  const isCurrentUserMessage = (message: Message) => {
    const messageId = typeof message.sender.id === 'string' ? parseInt(message.sender.id) : message.sender.id;
    const currentId = typeof userId === 'string' ? parseInt(userId) : userId;
    return messageId === currentId;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{group.name}</h3>
            <p className="text-xs text-muted-foreground">
              {group.members} membres • {group.documents} documents
            </p>
          </div>
        </div>
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            Retour
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea
          className="h-full p-4 bg-[#f0f2f5]"
          ref={scrollAreaRef}
        >
          <div className="space-y-4 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  isCurrentUserMessage(message) ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                    isCurrentUserMessage(message)
                      ? "bg-[#d9fdd3] text-black"
                      : "bg-white text-black"
                  )}
                >
                  <div className="font-medium text-xs mb-1">
                    {message.sender.username}
                  </div>
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="p-3 border-t bg-background flex items-center gap-2 flex-shrink-0">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tapez votre message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          ref={inputRef}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

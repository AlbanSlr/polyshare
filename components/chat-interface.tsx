"use client"

import * as React from "react"
import { Send, MoreVertical, Phone, Video, Search, Paperclip, Smile, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
}

interface Contact {
  id: string
  name: string
  avatar?: string
  lastSeen: string
  status?: string
}

export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: "1", content: "Hey there! How are you doing?", sender: "contact", timestamp: new Date(Date.now() - 3600000) },
    {
      id: "2",
      content: "I'm good, thanks! Just working on some new features.",
      sender: "user",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      content: "That sounds interesting. What are you building?",
      sender: "contact",
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: "4",
      content: "A chat interface similar to WhatsApp desktop using Next.js and shadcn/ui.",
      sender: "user",
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: "5",
      content: "That's awesome! I'd love to see it when it's done.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3200000),
    },
  ])

  const [currentContact, setCurrentContact] = React.useState<Contact>({
    id: "1",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastSeen: "online",
    status: "typing...",
  })

  const [inputValue, setInputValue] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      setInputValue("")

      // Simulate reply after 1 second
      setTimeout(() => {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your message! This is an automated reply.",
          sender: "contact",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, replyMessage])
      }, 1000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full border-l">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 border-b bg-background">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentContact.avatar} alt={currentContact.name} />
            <AvatarFallback>{currentContact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{currentContact.name}</h3>
            <p className="text-xs text-muted-foreground">{currentContact.status || currentContact.lastSeen}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4 bg-[#f0f2f5]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                  message.sender === "user" ? "bg-[#d9fdd3] text-black" : "bg-white text-black",
                )}
              >
                <p>{message.content}</p>
                <p className="text-xs text-right mt-1 text-muted-foreground">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat input */}
      <div className="p-3 border-t bg-background flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage()
            }
          }}
        />
        <Button variant="ghost" size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
          {inputValue.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}


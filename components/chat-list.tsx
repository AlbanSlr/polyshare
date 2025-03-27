"use client"

import * as React from "react"
import { Search, Archive, Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ChatContact {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount?: number
}

export function ChatList({ onSelectChat }: { onSelectChat: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [contacts, setContacts] = React.useState<ChatContact[]>([
    {
      id: "1",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "That's awesome! I'd love to see it when it's done.",
      timestamp: new Date(Date.now() - 3200000),
    },
    {
      id: "2",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hey, are we still meeting tomorrow?",
      timestamp: new Date(Date.now() - 86400000),
      unreadCount: 2,
    },
    {
      id: "3",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I just sent you the files you requested.",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "4",
      name: "Team Project",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Alex: Let's schedule a call to discuss the next steps.",
      timestamp: new Date(Date.now() - 259200000),
      unreadCount: 5,
    },
    {
      id: "5",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help!",
      timestamp: new Date(Date.now() - 345600000),
    },
  ])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full border-r">
      {/* Search header */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search or start new chat"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <Archive className="h-4 w-4 mr-2" />
            Archived
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Filter className="h-4 w-4 mr-2" />
            Unread
          </Button>
        </div>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              className="w-full text-left p-3 hover:bg-muted/50 transition-colors"
              onClick={() => onSelectChat(contact.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span
                      className={cn(
                        "text-xs",
                        contact.unreadCount ? "text-green-600 font-medium" : "text-muted-foreground",
                      )}
                    >
                      {formatTime(contact.timestamp)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unreadCount ? (
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-green-600 text-white text-xs">
                        {contact.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
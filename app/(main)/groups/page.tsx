"use client"

import * as React from "react"
import { ChatInterface } from "@/components/chat-interface"
import { ChatList } from "@/components/chat-list"

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(null)
  const isMobile = useIsMobile()

  // On mobile, show either the chat list or the chat interface
  // On desktop, show both side by side
  return (
    <div className="flex h-screen w-full
    ">
      {/* This is where your existing sidebar would be */}
      {/* <YourExistingSidebar /> */}

      <div className="flex flex-1 h-full">
        {(!isMobile || !selectedChatId) && (
          <div className={`${isMobile ? "w-full" : "w-80"}`}>
            <ChatList onSelectChat={(id) => setSelectedChatId(id)} />
          </div>
        )}

        {(!isMobile || selectedChatId) && (
          <div className="flex-1">
            <ChatInterface />
          </div>
        )}
      </div>
    </div>
  )
}

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}


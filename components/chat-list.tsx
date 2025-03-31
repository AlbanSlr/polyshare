"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Group {
    id: number
    name: string
    members: number
    documents: number
    isJoined: boolean
    lastMessage?: string
}

interface ChatListProps {
    groups: Group[]
    selectedGroupId: number | null
    onSelectGroup: (groupId: number) => void
    searchQuery: string
    onSearchChange: (query: string) => void
}

export function ChatList({
    groups,
    selectedGroupId,
    onSelectGroup,
    searchQuery,
    onSearchChange
}: ChatListProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-3 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un groupe..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="divide-y">
                    {groups.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                            Aucun groupe trouvé
                        </div>
                    )}

                    {groups.map((group) => (
                        <button
                            key={group.id}
                            className={cn(
                                "w-full text-left p-3 hover:bg-muted/50 transition-colors",
                                selectedGroupId === group.id ? "bg-muted" : ""
                            )}
                            onClick={() => onSelectGroup(group.id)}
                        >
                            <div className="flex items-start gap-3">
                                <Avatar>
                                    <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-medium truncate">{group.name}</h3>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm text-muted-foreground truncate">
                                            {group.members} membres • {group.documents} documents
                                        </p>
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
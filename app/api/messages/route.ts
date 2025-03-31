import { NextResponse } from "next/server";
import { getSession } from "@/lib/userSession";
import { prisma } from "@/lib/db";


//Fonction pour poster un message
export async function POST(request: Request) {
    try {
        const { groupId, content } = await request.json();

        // Validate input
        if (!groupId || !content.trim()) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user is logged in
        const session = await getSession();
        if (!session?.user?.isLoggedIn) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if user is member of the group
        const isMember = await prisma.chatRoom.findFirst({
            where: {
                id: groupId,
                users: {
                    some: {
                        id: userId
                    }
                }
            }
        });

        if (!isMember) {
            return NextResponse.json({ error: "Not a member of this group" }, { status: 403 });
        }

        // Save message to database
        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                chatRoomId: groupId,
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        // Format the response for client
        const formattedMessage = {
            id: message.id.toString(),
            content: message.content,
            sender: {
                id: message.user.id,
                username: message.user.name
            },
            timestamp: message.createdAt
        };

        // Broadcast via Socket.IO if available
        try {
            // Import the socket module dynamically
            const socketModule = await import('../../../pages/api/socket');
            const io = socketModule.getIO();

            if (io) {
                const roomName = `group:${groupId}`;

                // IMPORTANT: This broadcast will now reach all sockets in the room
                io.to(roomName).emit('new-message', formattedMessage);


            }
        } catch (error) {
            console.warn("Socket notification failed, continuing with HTTP response:", error);
        }

        return NextResponse.json(formattedMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
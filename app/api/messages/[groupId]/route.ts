import { NextResponse } from "next/server";
import { getSession } from "@/lib/userSession";
import { prisma } from "@/lib/db";


//Fonction pour récupérer les messages
export async function GET(
    request: Request,
    { params }: { params: { groupId: string } }
) {
    try {
        const groupId = parseInt(params.groupId);
        if (isNaN(groupId)) {
            return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
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

        // Get ALL messages for this group with their senders
        const messages = await prisma.message.findMany({
            where: {
                chatRoomId: groupId
            },
            orderBy: {
                createdAt: "asc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            // Remove the limit if there was one
        });

        // Format messages for client
        const formattedMessages = messages.map(message => ({
            id: message.id.toString(),
            content: message.content,
            sender: {
                id: message.user.id,
                username: message.user.name
            },
            timestamp: message.createdAt
        }));

        return NextResponse.json(formattedMessages);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
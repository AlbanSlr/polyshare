import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/userSession";

//Fonction POST pour récupérer les membres d'un groupe
export async function POST(req: Request) {
    try {
        const { groupId } = await req.json();

        // On récupère l'utilisateur actuel de la session
        const session = await getSession();

        if (!session.user || !session.user.isLoggedIn) {
            return NextResponse.json({ error: "Vous devez être connecté" }, { status: 401 });
        }

        const userId = session.user.id;

        // On regarde si l'utilisateur est déjà un membre du groupe
        const membership = await prisma.chatRoom.findFirst({
            where: {
                id: groupId,
                users: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        users: true
                    }
                }
            }
        });

        if (membership) {
            // Si l'utilisateur est déjà un membre

            // On regarde si c'est le dernier membre
            if (membership._count.users <= 1) {
                // Si c'est le dernier membre, alors on supprime tout
                await prisma.chatRoom.delete({
                    where: { id: groupId }
                });
                return NextResponse.json({
                    isJoined: false,
                    groupDeleted: true,
                    message: "Groupe supprimé car vous étiez le dernier membre"
                });
            } else {
                // Sinon on supprime juste le membre du groupe
                await prisma.chatRoom.update({
                    where: { id: groupId },
                    data: {
                        users: {
                            disconnect: { id: userId }
                        }
                    }
                });

                return NextResponse.json({
                    isJoined: false,
                    groupDeleted: false,
                    message: "Vous avez quitté le groupe"
                });
            }
        } else {
            // L'utilisateur n'est pas un mambre, on l'ajoute donc
            await prisma.chatRoom.update({
                where: { id: groupId },
                data: {
                    users: {
                        connect: { id: userId }
                    }
                }
            });

            return NextResponse.json({
                isJoined: true,
                groupDeleted: false,
                message: "Vous avez rejoint le groupe"
            });
        }
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
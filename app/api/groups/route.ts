import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/userSession";


//Fonction pour récupérer une instance de groupe.
export async function GET() {
    try {
        // On récupère l'utilisateur actuel
        const session = await getSession();
        const userId = session.user?.id;

        const groups = await prisma.chatRoom.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                        files: true
                    }
                },
                users: userId ? {
                    where: {
                        id: userId
                    }
                } : undefined
            }
        });

        // On transforme les datas pour que ça corresponde avec le groupe en front-end
        const transformedGroups = groups.map(group => ({
            id: group.id,
            name: group.name,
            members: group._count.users,
            documents: group._count.files,
            isJoined: group.users && group.users.length > 0 // On regarde si l'utilisateur est un membre
        }));

        return NextResponse.json(transformedGroups);
    } catch (error) {
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}

//Fonction pour POST un groupe
export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        // On récupère l'utilisateur de la session
        const session = await getSession();

        if (!session.user || !session.user.isLoggedIn) {
            return NextResponse.json({ error: "Vous devez être connecté" }, { status: 401 });
        }

        if (!name || name.trim() === "") {
            return NextResponse.json({ error: "Le nom du groupe est requis" }, { status: 400 });
        }

        // On crée le groupe et on le connecte avec l'utilisateur
        const newGroup = await prisma.$transaction(async (tx) => {
            // Création du groupe
            const group = await tx.chatRoom.create({
                data: {
                    name,
                    users: {
                        connect: { id: session.user?.id }
                    }
                },
                include: {
                    _count: {
                        select: {
                            users: true,
                            files: true
                        }
                    }
                }
            });

            //On retourne l'instance du groupe pour que ça matche avec le front-end.
            return {
                id: group.id,
                name: group.name,
                members: group._count.users,
                documents: group._count.files,
                isJoined: true // l'utilisateur est déjà membre du groupe
            };
        });

        return NextResponse.json(newGroup);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

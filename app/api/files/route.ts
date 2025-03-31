import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/userSession';
import { prisma } from '@/lib/db'; 
import fs from "fs";
import path from "path";


//API pour DELETE un fichier dans la BDD et dans le dossier public/uploads
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const fileId = searchParams.get("id");

        if (!fileId) {
            return NextResponse.json({ error: "ID du fichier requis" }, { status: 400 });
        }

        // Récupérer le fichier depuis la base de données
        const file = await prisma.file.findUnique({
            where: { id: parseInt(fileId) },
        });

        if (!file) {
            return NextResponse.json({ error: "Fichier non trouvé" }, { status: 404 });
        }

        const fileName = file.name;

        // Supprimer l'entrée du fichier dans ce groupe
        await prisma.file.delete({
            where: { id: parseInt(fileId) },
        });

        // Vérifier si le fichier est encore utilisé par d'autres groupes
        const remainingFiles = await prisma.file.findMany({
            where: { name: fileName },
        });

        if (remainingFiles.length === 0) {
            // Si plus aucun fichier ne référence ce nom, on le supprime physiquement dans public/uploads
            const filePath = path.join(process.cwd(), "public/uploads", fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return NextResponse.json({ message: "Fichier supprimé avec succès" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

//API GET pour récupérer les fichiers dans un groupe
export async function GET(req: Request) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // Récupérer le chatRoomId (groupe) à partir de la query string
    const url = new URL(req.url);
    const chatRoomId = url.searchParams.get("chatRoomId");

    if (session.user) {
        // Vérifie si le chatRoomId est fourni
        if (chatRoomId) {
            try {
                // Récupérer les fichiers associés à ce chatRoomId depuis la base de données
                const files = await prisma.file.findMany({
                    where: {
                        chatRoomId: parseInt(chatRoomId),
                    },
                });
                return NextResponse.json(files); // On renvoit les fichiers en réponse
            } catch (error) {
                return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "chatRoomId manquant" }, { status: 400 });
        }
    } else {
        console.log("User not found");
        return NextResponse.json({
            id: 0,
            username: '',
            email: '',
            isLoggedIn: false,
        });
    }
}

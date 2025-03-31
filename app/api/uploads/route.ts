import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/userSession';
import { prisma } from "@/lib/db";
import fs from 'fs';
import path from 'path';


//Fonction pour upload un fichier
export async function POST(req: Request) {
    try {
        //On récupère la session avec un cookie
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.user) {
            return NextResponse.json({ error: "Utilisateur non connecté" }, { status: 401 });
        }

        const user = session.user; // Extraction de l'utilisateur

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "Fichier manquant ou invalide" }, { status: 400 });
        }

        const fileName = `${Date.now()}-${file.name}`; // Ajouter un horodatage au nom du fichier
        const uploadsDir = path.join(process.cwd(), "public", "uploads");

        // Créer le répertoire s'il n'existe pas
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, fileName);

        // Sauvegarder le fichier sur le serveur
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        // Enregistrer le fichier dans la base de données
        const newFile = await prisma.file.create({
            data: {
                name: file.name,
                size: file.size,
                url: `/uploads/${fileName}`,  // Utilisation du nouveau nom de fichier
                chatRoomId: parseInt(formData.get("chatRoomId") as string),
                userId: parseInt(formData.get("userId") as string),
            },
            include: {
                chatRoom: true, // Inclure les données du groupe
                user: true,     // Inclure les données de l'utilisateur
            }
        });

        return NextResponse.json(newFile);
    } catch (error) {
        console.error("Erreur inattendue lors de l'upload :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

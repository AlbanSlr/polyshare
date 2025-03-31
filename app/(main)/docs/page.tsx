"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, Upload } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

//C'est ici que ce trouve la page des documents
//Elle permet d'upload un fichier, mais aussi le supprimer.
export default function Page() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    useEffect(() => {
        fetch("/api/groups").then(res => res.json()).then(data => setGroups(data));
        fetch("/api/sessionUser").then(res => res.json()).then(data => setUserId(data.id));
    }, []);

    useEffect(() => {
        if (selectedGroup === null) return;
    
        fetch(`/api/files?chatRoomId=${selectedGroup}`)
            .then((res) => res.json())
            .then((data) => setDocuments(Array.isArray(data) ? data : []))
            .catch(() => setDocuments([])); 
    }, [selectedGroup]);

    //Fonction pour gérer l'upload des fichiers.
    const handleFileUpload = async () => {
        if (!file || !selectedGroup || !userId) {
            alert("Veuillez sélectionner un fichier et un groupe.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("chatRoomId", selectedGroup.toString());
        formData.append("userId", userId.toString());
    
        try {
            const response = await fetch("/api/uploads", { method: "POST", body: formData });
    
            if (!response.ok) {
                const errorResult = await response.json(); // Si la réponse est un échec, on tente de récupérer le JSON
                console.error("Erreur côté serveur :", errorResult);
                alert(`Erreur ${response.status}: ${errorResult.error || "Erreur inconnue"}`);
                return;
            }

            // Utilisation de .json() pour traiter la réponse
            const result = await response.json(); 
    
            if (response.ok) {
                const newFile = result;
                setDocuments([...documents, newFile]);
                setShowUploadDialog(false);
                setFile(null);
            }
        } catch (error) {
            console.error("Erreur inattendue :", error);
            alert("Une erreur inattendue est survenue.");
        }
    };

    //Fonction pour gérer la suppression d'un fichier
    const handleDelete = async (fileId: number) => {
        if (!fileId) return;
    
        try {
            const response = await fetch(`/api/files?id=${fileId}`, { method: "DELETE" });
    
            const result = await response.json();
    
            if (response.ok) {
                setDocuments(documents.filter((doc) => doc.id !== fileId));
            } else {
                console.error("Erreur lors de la suppression du fichier :", result.error);
                alert(`Erreur ${response.status} : ${result.error}`);
            }
        } catch (error) {
            console.error("⚠️ Erreur inattendue :", error);
            alert("Une erreur inattendue est survenue.");
        }
    };


    //Et voici le corps de la page.
    return (
        <div className="w-full h-full min-h-screen p-6">
            <div className="flex flex-col items-center justify-center text-center w-full p-6">
                <CardTitle className="text-3xl font-semibold">Documents</CardTitle>
                <p className="text-lg text-gray-600">Gérez vos documents partagés.</p>
            </div>

            <Card className="mt-6">
                <CardContent>
                <div className="flex gap-6 mb-6">
                        <Select onValueChange={(value) => setSelectedGroup(value === "all" ? null : parseInt(value))}>
                            <SelectTrigger className="text-xl font-semibold text-blue-700">
                                <SelectValue placeholder="Filtrer par groupe" />
                            </SelectTrigger>
                            <SelectContent className="w-full sm:w-72 md:w-96 lg:w-96 xl:w-96 bg-blue-100 border-2 border-blue-500 rounded-lg p-2 shadow-md hover:shadow-xl focus:ring-2 focus:ring-blue-500 transition-all">
                                <SelectItem value="all">Tous</SelectItem>
                                {groups.map(group => (
                                    <SelectItem key={group.id} value={group.id.toString()}>{group.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input 
                            placeholder="Rechercher un document..." 
                            className="w-full sm:w-72 md:w-96 lg:w-96 xl:w-96 p-2 border-2 border-gray-300 rounded-lg" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>

                    <Button onClick={() => setShowUploadDialog(true)}>
                        <Upload className="h-5 w-5 mr-2" /> Upload
                    </Button>
                    
                    <Table className="w-full mt-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Taille</TableHead>
                                <TableHead>Ajouté par</TableHead>
                                <TableHead>Groupe</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <a href={doc.url} download={doc.name} className="text-blue-600 underline">{doc.name}</a>
                                    </TableCell>
                                    <TableCell>{(doc.size / 1024).toFixed(2)} KB</TableCell>
                                    <TableCell>{doc.user?.name || "Inconnu"}</TableCell>
                                    <TableCell>{doc.chatRoom?.name || "Non spécifié"}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon" onClick={() => handleDelete(doc.id)}>
                                            <Trash className="h-5 w-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {showUploadDialog && (
                <AlertDialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>Uploader un fichier</AlertDialogHeader>
                        <AlertDialogTitle>Choisir un groupe</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Select onValueChange={(value) => setSelectedGroup(parseInt(value))}>
                                <SelectTrigger><SelectValue placeholder="Sélectionner un groupe" /></SelectTrigger>
                                <SelectContent>
                                    {groups.map(group => <SelectItem key={group.id} value={group.id.toString()}>{group.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-4" />
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Annuler</Button>
                            <Button onClick={handleFileUpload}>Uploader</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
        
    );
}

'use client'


import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react"; // Import de l'icône Trash
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Exemple de données de documents
const initialDocuments = [
    { id: 1, name: "Document 1", size: "2 MB", uploadedBy: "Alice", group: "Groupe A" },
    { id: 2, name: "Document 2", size: "3 MB", uploadedBy: "Bob", group: "Groupe B" },
    { id: 3, name: "Document 3", size: "1.5 MB", uploadedBy: "Charlie", group: "Groupe A" },
  ];


  export default function Page() {
    const [documents, setDocuments] = useState(initialDocuments);
    const [searchQuery, setSearchQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

    // Filtrer les documents en fonction de la recherche
    const filteredDocuments = documents.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (docId: number) => {
        setSelectedDocId(docId);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        if (selectedDocId !== null) {
        setDocuments(documents.filter((doc) => doc.id !== selectedDocId));
        setSelectedDocId(null);
        setOpenDialog(false);
        }
    };

    return (
        <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                </header>
                <div className="max-w-full mx-auto p-6">
                            <CardTitle className="text-3xl font-semibold">Documents</CardTitle>
                            <p className="text-lg text-gray-600">Voici les différents documents que vous avez partagés.</p>


                    <Card className="mt-6">
                        <CardContent>
                            <div className="flex justify-between mb-4">
                                <Input
                                    placeholder="Rechercher un document..."
                                    className="w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Taille</TableHead>
                                        <TableHead>Ajouté par</TableHead>
                                        <TableHead>Groupe</TableHead> {/* Nouvelle colonne Groupe */}
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell>{doc.name}</TableCell>
                                            <TableCell>{doc.size}</TableCell>
                                            <TableCell>{doc.uploadedBy}</TableCell>
                                            <TableCell>{doc.group}</TableCell> {/* Affichage du groupe */}
                                            <TableCell>
                                                <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="icon" onClick={() => handleDelete(doc.id)}>
                                                            <Trash className="h-5 w-5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
                                                        </AlertDialogHeader>
                                                        <AlertDialogDescription>
                                                            Êtes-vous sûr de vouloir supprimer ce document ?
                                                        </AlertDialogDescription>
                                                        <AlertDialogFooter>
                                                            <Button variant="outline" onClick={() => setOpenDialog(false)}>
                                                                Annuler
                                                            </Button>
                                                            <Button onClick={confirmDelete}>Supprimer</Button>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
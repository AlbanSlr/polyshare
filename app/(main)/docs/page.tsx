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
import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AuthGuard from "@/components/auth-guard";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

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
    <>
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold mb-2">Documents partagés</h2>
              <p className="text-muted-foreground">
                Voici les différents documents que vous avez partagés.
              </p>
            </div>
            
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Liste des documents</CardTitle>
                  <Input
                    placeholder="Rechercher un document..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Groupe</TableHead>
                        <TableHead>Ajouté par</TableHead>
                        <TableHead>Taille</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
                            <TableCell>{doc.group}</TableCell>
                            <TableCell>{doc.uploadedBy}</TableCell>
                            <TableCell>{doc.size}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleDelete(doc.id)}
                                className="h-8 w-8"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            Aucun document trouvé.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Dialog de confirmation déplacé en dehors pour éviter les problèmes de rendu */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogTitle>Supprimer le document</AlertDialogTitle>
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
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
  );
}
"use client"

import type React from "react"

import { useState } from "react"
import { useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, UserPlus, Filter, Plus, FileText, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"


//C'est ici que la page des groupes est géré, on peut y créer un groupe et le rejoindre.
export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")

  // Exemple de données pour les groupes disponibles
  interface Group {
    id: number;
    name: string;
    members: number;
    documents: number;
    isJoined: boolean;
  }

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/groups");
        if (!response.ok) throw new Error("Erreur lors de la récupération des groupes");

        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, []);


  //Fonction qui sert à rejoindre un groupe
  const handleJoinGroup = async (id: number) => {
    try {
      const response = await fetch("/api/groups/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: id }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la gestion de l'adhésion au groupe");
      }

      const data = await response.json();

      //On regarde si le groupe a été supprimé
      if (data.groupDeleted) {
        setGroups(prevGroups => prevGroups.filter(group => group.id !== id));
        toast.success("Vous avez quitté le groupe et il a été supprimé");
      } else {
        setGroups(prevGroups =>
          prevGroups.map(group =>
            group.id === id
              ? {
                ...group,
                isJoined: data.isJoined,
                members: data.isJoined ? group.members + 1 : group.members - 1
              }
              : group
          )
        );

        toast.success(data.isJoined
          ? "Vous avez rejoint le groupe"
          : "Vous avez quitté le groupe"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  };

  //Fonction pour gérer la création d'un groupe.
  const handleCreateGroup = async () => {
    if (newGroupName.trim()) {
      try {
        const response = await fetch("/api/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newGroupName.trim() }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la création du groupe");
        }

        const newGroup = await response.json();

        setGroups([newGroup, ...groups]); // Mise à jour locale
        setNewGroupName("");
        setIsDialogOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "joined") return matchesSearch && group.isJoined
    if (filter === "available") return matchesSearch && !group.isJoined

    return matchesSearch
  })


  //Et voici le corps de la page.
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="relative w-full h-full">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Gestion des groupes</h1>
              <p className="text-gray-600 mt-2">Découvrez, rejoignez ou créez des groupes pour collaborer</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" /> Créer un groupe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau groupe</DialogTitle>
                  <DialogDescription>
                    Donnez un nom à votre groupe. Vous pourrez inviter des membres après sa création.
                  </DialogDescription>
                </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nom
                        </Label>
                        <Input
                          id="name"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="col-span-3"
                          placeholder="Nom du groupe"
                        />
                      </div>
                    </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Rechercher un groupe</CardTitle>
              <CardDescription>Trouvez un groupe par nom</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    className="pl-10"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les groupes</SelectItem>
                      <SelectItem value="joined">Groupes rejoints</SelectItem>
                      <SelectItem value="available">Groupes disponibles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className={`overflow-hidden transition-all ${group.isJoined ? "border-indigo-200 shadow-md" : ""}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{group.members} membres</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>{group.documents} documents</span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant={group.isJoined ? "destructive" : "outline"}
                    className={
                      group.isJoined
                        ? "" // The destructive variant already provides red styling
                        : "text-indigo-600 hover:text-indigo-700 border-indigo-200"
                    }
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    {group.isJoined ? (
                      <>
                        <LogOut className="mr-2 h-4 w-4" /> Quitter
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" /> Rejoindre
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


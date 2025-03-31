"use client";

import Image from "next/image";
import { Github } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2, Users, MessageSquare } from "lucide-react";


//Voici directement le corps de la page info.
export default function Info() {
    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col items-center gap-6">
                <div className="text-center space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-bold tracking-tight">PolyShare</h1>
                    <Badge variant="outline" className="px-3 py-1 text-sm">Projet IIM 2025</Badge>
                    <p className="text-muted-foreground text-xl">
                        La plateforme de discussion et de partage pour les étudiants de Polytech Paris-Saclay
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <Share2 className="h-10 w-10 text-primary mb-4" />
                            <CardTitle>Partage rapide</CardTitle>
                            <CardDescription>
                                Partagez vos fichiers en quelques clics sans aucune limitation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Téléchargez et partagez des fichiers de toutes tailles instantanément avec n'importe qui à Polytech.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader>
                            <MessageSquare className="h-10 w-10 text-primary mb-4" />
                            <CardTitle>Communication optimale</CardTitle>
                            <CardDescription>
                                Discutez en temps réel avec votre classe, votre promotion ou un club.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Créez des salons de discussion pour discuter de vos projets, poser des questions ou simplement discuter.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader>
                            <Users className="h-10 w-10 text-primary mb-4" />
                            <CardTitle>Collaboration facile</CardTitle>
                            <CardDescription>
                                Echangez avec des élèves des années supérieures.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Demandez de l'aide, partagez des ressources ou collaborez sur des projets avec des étudiants plus expérimentés.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="w-full max-w-3xl border-primary/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">À propos du projet</CardTitle>
                        <CardDescription>Projet réalisé dans le cadre du cursus à l'IIM</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            PolyShare est une application web conçue pour concentrer la communication et le partage entre les étudiants de Polytech Paris-Saclay.
                            Ce projet se base sur des technologies modernes telles que React, Next.js et Tailwind CSS pour offrir une expérience utilisateur fluide et réactive.
                        </p>
                        <p>
                            L'application permet de créer des groupes de discussion, d'échanger des messages en temps réel et de partager des fichiers facilement.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Separator />
                        <div className="flex justify-between items-center w-full">
                            <p className="text-sm text-muted-foreground">
                                Projet réalisé par Rémi Géraud et Alban Sellier
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                asChild
                            >
                                <a
                                    href="https://github.com/AlbanSlr/polyshare"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <Github size={16} />
                                    GitHub
                                </a>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <div className="flex gap-8 items-center justify-center mt-8">
                    <div className="text-center">
                        <Image
                            src="/polytech-logo.png"
                            alt="Logo Polytech Paris-Saclay"
                            width={120}
                            height={80}
                            className="mx-auto opacity-80"
                        />
                        <p className="text-sm text-muted-foreground mt-2">Paris-Saclay</p>
                    </div>
                    <div className="text-center">
                        <Image
                            src="/upsaclay-logo.png"
                            alt="Logo IIM"
                            width={120}
                            height={80}
                            className="mx-auto opacity-80"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Share2, Users, MessageSquare, ArrowRight } from "lucide-react";


//C'est ici que va apparaître l'utilisateur dans un premier temps, dans la racine du site
// Il est possible de se connecter et s'inscrire. Ce qui est obligatoire avant d'accéder au site.
export default function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center overflow-x-hidden w-full">
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
        <div className="container flex h-16 items-center justify-between max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Share2 className="h-6 w-6" />
            <span>PolyShare</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Se connecter</Button>
            </Link>
            <Link href="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <section className="w-full py-24 sm:py-32 md:py-40">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Partagez vos fichiers et <span className="text-primary">discutez avec PoPS</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              PolyShare est une plateforme de partage de fichiers et de discussion pour les cours ou l'associatif à Polytech Paris-Saclay.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12">
                  Inscrivez-vous maintenant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="mx-auto grid w-full justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-3xl w-full">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Prêt à commencer avec PolyShare ?</CardTitle>
                <CardDescription className="text-center text-lg">
                  Créez un compte en quelques secondes et commencez à échanger dès aujourd'hui.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pb-8 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-12">
                    S'inscrire maintenant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-6 md:py-0 w-full">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 sm:px-6 lg:px-8 max-w-full px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 PolyShare. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
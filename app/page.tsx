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
import { Share2, Users, Lock, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center overflow-x-hidden w-full">
      {/* Header/Hero Section */}
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

      {/* Main content wrapper */}
      <main className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="w-full py-24 sm:py-32 md:py-40">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Partagez vos fichiers <span className="text-primary">facilement</span> et <span className="text-primary">en toute sécurité</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              PolyShare est une plateforme de partage de fichiers simple, rapide et sécurisée pour tous vos besoins personnels et professionnels.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12">
                  Commencer gratuitement
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

        {/* Features Section */}
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
                  Téléchargez et partagez des fichiers de toutes tailles instantanément avec n'importe qui dans le monde.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Sécurité garantie</CardTitle>
                <CardDescription>
                  Vos fichiers sont chiffrés et protégés en permanence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Nous utilisons un chiffrement de bout en bout pour garantir que seuls les destinataires autorisés peuvent accéder à vos fichiers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Collaboration facile</CardTitle>
                <CardDescription>
                  Travaillez ensemble sur des projets en toute simplicité.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Créez des espaces de travail collaboratifs et partagez des fichiers avec votre équipe ou vos clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-3xl w-full">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Prêt à commencer avec PolyShare ?</CardTitle>
                <CardDescription className="text-center text-lg">
                  Créez un compte en quelques secondes et commencez à partager vos fichiers dès aujourd'hui.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pb-8 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-12">
                    S'inscrire gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-6 md:py-0 w-full">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 sm:px-6 lg:px-8 max-w-full px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 PolyShare. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">
              Confidentialité
            </Link>
            <Link href="#" className="hover:underline">
              Conditions d'utilisation
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
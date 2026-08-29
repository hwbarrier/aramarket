import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";

interface FooterProps {
  onPageChange: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "Tous les produits", action: () => onPageChange('products') },
        { name: "Electronics", action: () => onPageChange('products') },
        { name: "Fashion", action: () => onPageChange('products') },
        { name: "Home & Garden", action: () => onPageChange('products') },
        { name: "Sports", action: () => onPageChange('products') }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Centre d'aide", action: () => {} },
        { name: "Service client", action: () => {} },
        { name: "Retours & échanges", action: () => {} },
        { name: "Guide des tailles", action: () => {} },
        { name: "Livraison", action: () => {} }
      ]
    },
    {
      title: "Entreprise",
      links: [
        { name: "À propos", action: () => {} },
        { name: "Carrières", action: () => {} },
        { name: "Presse", action: () => {} },
        { name: "Partenaires", action: () => {} },
        { name: "Durabilité", action: () => {} }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, name: "Facebook" },
    { icon: <Twitter className="h-4 w-4" />, name: "Twitter" },
    { icon: <Instagram className="h-4 w-4" />, name: "Instagram" },
    { icon: <Youtube className="h-4 w-4" />, name: "YouTube" }
  ];

  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-2">
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent mb-4"
              onClick={() => onPageChange('home')}
            >
              <Logo />
            </Button>
            <p className="text-muted-foreground mb-6 max-w-md text-sm md:text-base">
              Découvrez des produits exceptionnels à des prix imbattables sur AraMarket. 
              Votre satisfaction est notre priorité avec une livraison rapide et un service client de qualité.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+228 92 70 97 08</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>agbokpeablamvi@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Lomé, Togo</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 hover:bg-primary hover:text-primary-foreground"
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-semibold">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto hover:bg-transparent hover:text-primary justify-start text-left"
                      onClick={link.action}
                    >
                      <span className="text-sm text-muted-foreground hover:text-primary">
                        {link.name}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="text-center lg:text-left">
              <h4 className="mb-2 font-semibold">Restez informé</h4>
              <p className="text-sm text-muted-foreground max-w-md">
                Recevez nos dernières offres et nouveautés directement dans votre boîte mail.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 min-w-[200px]"
              />
              <Button className="whitespace-nowrap">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
              <span className="hover:text-primary text-xs md:text-sm">Conditions d'utilisation</span>
            </Button>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
              <span className="hover:text-primary text-xs md:text-sm">Politique de confidentialité</span>
            </Button>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
              <span className="hover:text-primary text-xs md:text-sm">Cookies</span>
            </Button>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
              <span className="hover:text-primary text-xs md:text-sm">Mentions légales</span>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground text-center lg:text-right">
            © {currentYear} AraMarket. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
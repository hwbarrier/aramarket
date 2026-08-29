import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalization } from "../contexts/LocalizationContext";

interface Slide {
  id: number;
  image: string;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
}

interface HeroBannerProps {
  onPageChange: (page: string) => void;
}

export function HeroBanner({ onPageChange }: HeroBannerProps) {
  const { t } = useLocalization();
  
  const slides: Slide[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1736722354549-e8ebb9f615b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hcmtldHBsYWNlJTIwYmFubmVyfGVufDF8fHx8MTc1ODA1NDYwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      badge: t('home.newCollection'),
      title: t('home.discoverAramarket'),
      description: t('home.marketplaceDescription'),
      buttonText: t('home.explore'),
      buttonAction: () => onPageChange('products')
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1539278383962-a7774385fa02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb25saW5lJTIwc2hvcHBpbmd8ZW58MXx8fHwxNzU4MDE1NDQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      badge: t('home.fashionStyle'),
      title: t('home.fashionCollection'),
      description: t('home.fashionDescription'),
      buttonText: t('home.viewFashion'),
      buttonAction: () => onPageChange('products')
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1582018960590-f3bc3ea25c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMHN0b3JlJTIwYmFubmVyfGVufDF8fHx8MTc1ODA1NDYwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      badge: t('home.highTech'),
      title: t('home.electronicsTitle'),
      description: t('home.electronicsDescription'),
      buttonText: t('home.highTech'),
      buttonAction: () => onPageChange('products')
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1707586834647-128c7f27d209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NTgwNTQ2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      badge: t('home.homeDecor'),
      title: t('home.decorationTitle'),
      description: t('home.decorationDescription'),
      buttonText: t('home.decorate'),
      buttonAction: () => onPageChange('products')
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play every 10 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section 
      className="relative overflow-hidden w-full h-[250px] xs:h-[280px] sm:h-[320px] md:h-[350px] lg:h-[400px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].image})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-start p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
            <motion.div 
              className="max-w-md sm:max-w-lg md:max-w-xl text-white"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="mb-3 sm:mb-4 bg-primary text-primary-foreground text-xs sm:text-sm">
                {slides[currentSlide].badge}
              </Badge>
              <h2 className="mb-3 sm:mb-4 text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="mb-4 sm:mb-6 text-white/90 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-2 sm:line-clamp-3">
                {slides[currentSlide].description}
              </p>
              <Button 
                onClick={slides[currentSlide].buttonAction} 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-6"
              >
                {slides[currentSlide].buttonText}
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Hidden on mobile for better touch experience */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border-white/20 h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border-white/20 h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-100' 
                : 'bg-white/50 hover:bg-white/75 scale-90'
            } ${index === currentSlide ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-2 h-2 sm:w-3 sm:h-3'}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: isAutoPlaying ? "100%" : "0%" }}
          transition={{ 
            duration: isAutoPlaying ? 10 : 0,
            ease: "linear",
            repeat: isAutoPlaying ? Infinity : 0 
          }}
          key={`${currentSlide}-${isAutoPlaying}`}
        />
      </div>
    </section>
  );
}

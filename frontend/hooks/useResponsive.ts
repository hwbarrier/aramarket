import { useState, useEffect } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointKey = keyof BreakpointConfig;

export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints) {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [activeBreakpoints, setActiveBreakpoints] = useState({
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      setActiveBreakpoints({
        isSm: width >= breakpoints.sm,
        isMd: width >= breakpoints.md,
        isLg: width >= breakpoints.lg,
        isXl: width >= breakpoints.xl,
        is2Xl: width >= breakpoints['2xl'],
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      });
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  const isBreakpoint = (breakpoint: BreakpointKey): boolean => {
    return screenSize.width >= breakpoints[breakpoint];
  };

  const getColumnsForBreakpoint = (
    cols: {
      default: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      '2xl'?: number;
    }
  ): number => {
    const { width } = screenSize;
    
    if (width >= breakpoints['2xl'] && cols['2xl']) return cols['2xl'];
    if (width >= breakpoints.xl && cols.xl) return cols.xl;
    if (width >= breakpoints.lg && cols.lg) return cols.lg;
    if (width >= breakpoints.md && cols.md) return cols.md;
    if (width >= breakpoints.sm && cols.sm) return cols.sm;
    
    return cols.default;
  };

  return {
    screenSize,
    ...activeBreakpoints,
    isBreakpoint,
    getColumnsForBreakpoint,
  };
}

// Hook spécialisé pour les grilles de produits
export function useProductGrid() {
  const { getColumnsForBreakpoint, isMobile, isTablet } = useResponsive();
  
  const getGridColumns = (viewMode: 'grid' | 'list' = 'grid') => {
    if (viewMode === 'list') return 1;
    
    return getColumnsForBreakpoint({
      default: 1,
      sm: 2,
      lg: 3,
      xl: 4,
    });
  };

  const getItemsPerPage = () => {
    if (isMobile) return 8;
    if (isTablet) return 12;
    return 16;
  };

  return {
    getGridColumns,
    getItemsPerPage,
    isMobile,
    isTablet,
  };
}
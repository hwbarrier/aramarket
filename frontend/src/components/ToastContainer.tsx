import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2
};

const colorMap = {
  success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
  error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  loading: 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800'
};

const iconColorMap = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
  loading: 'text-gray-600 dark:text-gray-400'
};

export function ToastContainer() {
  const { toasts, hideToast } = useNotifications();

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  // Grouper les toasts par position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, typeof toasts>);

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={cn(
            'fixed z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none',
            getPositionClasses(position)
          )}
        >
          <AnimatePresence>
            {positionToasts.map((toast) => {
              const Icon = toast.icon ? () => toast.icon : iconMap[toast.type];
              const isLoading = toast.type === 'loading';

              return (
                <motion.div
                  key={toast.id}
                  initial={{ 
                    opacity: 0, 
                    y: position.includes('top') ? -50 : 50,
                    scale: 0.9 
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1 
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: position.includes('top') ? -50 : 50,
                    scale: 0.9 
                  }}
                  transition={{ 
                    type: "spring", 
                    damping: 20, 
                    stiffness: 300 
                  }}
                  className={cn(
                    'pointer-events-auto relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
                    colorMap[toast.type]
                  )}
                >
                  {/* Icône */}
                  <div className={cn('flex-shrink-0 mt-0.5', iconColorMap[toast.type])}>
                    <Icon 
                      className={cn(
                        'h-5 w-5',
                        isLoading && 'animate-spin'
                      )} 
                    />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    {toast.title && (
                      <div className="font-medium text-sm text-foreground mb-1">
                        {toast.title}
                      </div>
                    )}
                    {toast.description && (
                      <div className="text-sm text-muted-foreground">
                        {toast.description}
                      </div>
                    )}

                    {/* Image si présente */}
                    {toast.image && (
                      <div className="mt-2">
                        <img
                          src={toast.image}
                          alt="Notification"
                          className="w-full h-24 object-cover rounded border"
                        />
                      </div>
                    )}

                    {/* Action button */}
                    {toast.action && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toast.action.onClick}
                          className="h-8 text-xs"
                        >
                          {toast.action.label}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Bouton fermer */}
                  {toast.closable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-background/20"
                      onClick={() => hideToast(toast.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Fermer</span>
                    </Button>
                  )}

                  {/* Barre de progression pour les toasts temporaires */}
                  {toast.duration > 0 && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-primary/30 rounded-b-lg"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ 
                        duration: toast.duration / 1000,
                        ease: 'linear'
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}
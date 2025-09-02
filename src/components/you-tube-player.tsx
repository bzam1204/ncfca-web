'use client';

import {useEffect, useRef, useState} from 'react';
import {Play} from 'lucide-react';
import {cn} from '@/infrastructure/utils';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  className?: string;
  showTitle?: boolean;
}

export function YouTubePlayer({videoId, title, className, showTitle = false}: YouTubePlayerProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!isClicked) {
      setIsClicked(true);
    }
  };

  const handleIframeLoad = () => {
    setIsLoaded(true);
  };

  // Limpa o background quando o iframe carrega
  useEffect(() => {
    if (isLoaded && containerRef.current) {
      containerRef.current.style.background = 'transparent';
    }
  }, [isLoaded]);

  return (
      <div className={cn("relative w-full", className)}>
        {showTitle && title && (
            <div className="mb-2">
              <h3 className="text-sm font-medium text-foreground">{title}</h3>
            </div>
        )}

        <div
            ref={containerRef}
            className={cn(
                "relative w-full aspect-video cursor-pointer rounded-lg overflow-hidden",
                "bg-muted transition-all duration-300",
            )}
            style={{
              backgroundImage : !isClicked ? `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` : undefined,
              backgroundSize : 'cover',
              backgroundPosition : 'center',
              backgroundRepeat : 'no-repeat'
            }}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
            aria-label={`Reproduzir vídeo: ${title || 'Vídeo do YouTube'}`}
        >
          {/* Botão de play que aparece sobre a miniatura */}
          {!isClicked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn(
                    "flex items-center justify-center",
                    "w-16 h-16 bg-black/70 rounded-full",
                    "transition-all duration-300 hover:bg-black/80",
                    "shadow-lg backdrop-blur-sm"
                )}>
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
          )}

          {/* Overlay escuro sutil para melhor contraste */}
          {!isClicked && (
              <div className="absolute inset-0 bg-black/20 transition-opacity hover:bg-black/10" />
          )}

          {/* Iframe do YouTube - só renderiza após o clique */}
          {isClicked && (
              <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                  title={title || 'Vídeo do YouTube'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={handleIframeLoad}
              />
          )}

          {/* Loading spinner enquanto o iframe carrega */}
          {isClicked && !isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
          )}
        </div>
      </div>
  );
}
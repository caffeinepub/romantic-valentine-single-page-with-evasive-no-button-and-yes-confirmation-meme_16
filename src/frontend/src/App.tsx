import { useState, useRef, useCallback, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function App() {
  const [answered, setAnswered] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isNoButtonPositioned, setIsNoButtonPositioned] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate safe position for No button that doesn't overlap with Yes button or question
  const calculateSafePosition = useCallback(() => {
    if (!containerRef.current || !noButtonRef.current || !yesButtonRef.current || !questionRef.current) {
      return { x: 0, y: 0 };
    }

    const container = containerRef.current.getBoundingClientRect();
    const noButton = noButtonRef.current.getBoundingClientRect();
    const yesButton = yesButtonRef.current.getBoundingClientRect();
    const question = questionRef.current.getBoundingClientRect();

    const padding = 20;
    const maxAttempts = 50;
    
    for (let i = 0; i < maxAttempts; i++) {
      // Generate random position within container bounds
      const maxX = container.width - noButton.width - padding * 2;
      const maxY = container.height - noButton.height - padding * 2;
      
      const newX = Math.random() * maxX + padding;
      const newY = Math.random() * maxY + padding;

      // Check if this position overlaps with Yes button or question
      const noRect = {
        left: container.left + newX,
        right: container.left + newX + noButton.width,
        top: container.top + newY,
        bottom: container.top + newY + noButton.height,
      };

      const overlapsYes = !(
        noRect.right < yesButton.left - padding ||
        noRect.left > yesButton.right + padding ||
        noRect.bottom < yesButton.top - padding ||
        noRect.top > yesButton.bottom + padding
      );

      const overlapsQuestion = !(
        noRect.right < question.left - padding ||
        noRect.left > question.right + padding ||
        noRect.bottom < question.top - padding ||
        noRect.top > question.bottom + padding
      );

      if (!overlapsYes && !overlapsQuestion) {
        return { x: newX, y: newY };
      }
    }

    // Fallback: position at bottom right
    return {
      x: container.width - noButton.width - padding,
      y: container.height - noButton.height - padding,
    };
  }, []);

  const moveNoButton = useCallback(() => {
    const newPosition = calculateSafePosition();
    setNoButtonPosition(newPosition);
    setIsNoButtonPositioned(true);
  }, [calculateSafePosition]);

  // Handle Yes click
  const handleYesClick = () => {
    setAnswered(true);
  };

  // Handle No button evasion (hover and touch)
  const handleNoInteraction = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    moveNoButton();
  };

  // Initialize No button position after mount
  useEffect(() => {
    if (!answered && !isNoButtonPositioned) {
      // Small delay to ensure all elements are rendered
      const timer = setTimeout(() => {
        moveNoButton();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [answered, isNoButtonPositioned, moveNoButton]);

  if (answered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-romantic-light via-romantic-lighter to-white p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in duration-700">
          <div className="space-y-4">
            <Heart className="w-20 h-20 mx-auto text-romantic-primary fill-romantic-primary animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-romantic-dark">
              Perfect Choice! 💕
            </h1>
            <p className="text-xl md:text-2xl text-romantic-medium">
              I knew you'd say yes!
            </p>
          </div>
          
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-romantic-primary/20 bg-white">
            <img
              src="/assets/generated/valentine-good-choice-meme.dim_1024x1024.png"
              alt="Good choice meme"
              className="w-full h-auto"
            />
          </div>

          <p className="text-lg text-romantic-medium italic">
            Can't wait to celebrate with you! ❤️
          </p>
        </div>

        <footer className="fixed bottom-4 text-center text-sm text-romantic-medium/60">
          © 2026. Built with <Heart className="inline w-4 h-4 fill-romantic-primary text-romantic-primary" /> using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-romantic-primary transition-colors">
            caffeine.ai
          </a>
        </footer>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-romantic-light via-romantic-lighter to-white p-4 relative overflow-hidden"
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-10 left-10 w-8 h-8 text-romantic-primary/10 animate-float" />
        <Heart className="absolute top-20 right-20 w-12 h-12 text-romantic-primary/10 animate-float-delayed" />
        <Heart className="absolute bottom-20 left-20 w-10 h-10 text-romantic-primary/10 animate-float" />
        <Heart className="absolute bottom-32 right-32 w-6 h-6 text-romantic-primary/10 animate-float-delayed" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-12 z-10">
        <div className="space-y-6 animate-in fade-in slide-in-from-top duration-700">
          <Heart className="w-24 h-24 mx-auto text-romantic-primary fill-romantic-primary animate-pulse" />
          <h1 
            ref={questionRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-romantic-dark leading-tight"
          >
            Will you be my Valentine?
          </h1>
          <p className="text-xl md:text-2xl text-romantic-medium">
            There's only one right answer... 💝
          </p>
        </div>

        <div className="relative h-32 md:h-40">
          {/* Yes button - static position */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Button
              ref={yesButtonRef}
              onClick={handleYesClick}
              size="lg"
              className="text-2xl md:text-3xl px-12 md:px-16 py-6 md:py-8 h-auto rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-romantic-primary hover:bg-romantic-primary-dark text-white font-bold"
            >
              Yes! 💕
            </Button>
          </div>

          {/* No button - moves away on interaction */}
          <Button
            ref={noButtonRef}
            onPointerEnter={handleNoInteraction}
            onPointerMove={handleNoInteraction}
            onPointerDown={handleNoInteraction}
            onTouchStart={handleNoInteraction}
            onMouseEnter={handleNoInteraction}
            size="lg"
            variant="outline"
            className="absolute text-xl md:text-2xl px-8 md:px-12 py-4 md:py-6 h-auto rounded-full shadow-lg transition-all duration-300 border-2 border-romantic-medium/30 hover:border-romantic-medium/50 text-romantic-medium bg-white/80 backdrop-blur-sm"
            style={{
              left: isNoButtonPositioned ? `${noButtonPosition.x}px` : '50%',
              top: isNoButtonPositioned ? `${noButtonPosition.y}px` : '50%',
              transform: isNoButtonPositioned ? 'none' : 'translate(-50%, -50%)',
              transition: isNoButtonPositioned ? 'all 0.3s ease-out' : 'none',
            }}
          >
            No
          </Button>
        </div>

        <p className="text-sm md:text-base text-romantic-medium/70 italic animate-in fade-in duration-700 delay-500">
          (Hint: The "No" button is a bit shy... 😊)
        </p>
      </div>

      <footer className="fixed bottom-4 text-center text-sm text-romantic-medium/60">
        © 2026. Built with <Heart className="inline w-4 h-4 fill-romantic-primary text-romantic-primary" /> using{' '}
        <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-romantic-primary transition-colors">
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

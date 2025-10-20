import { Button } from "./ui/button";

interface CardActionsProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function CardActions({ onComplete, onSkip }: CardActionsProps) {
  return (
    <div className="flex gap-3 pt-4 border-t mt-4" role="group" aria-label="Step actions">
      <Button 
        onClick={onComplete} 
        className="flex-1 h-12"
        aria-label="Mark this step as complete"
      >
        Complete
      </Button>
      <Button 
        onClick={onSkip} 
        variant="outline" 
        className="flex-1 h-12"
        aria-label="Skip this step for now"
      >
        Skip for now
      </Button>
    </div>
  );
}

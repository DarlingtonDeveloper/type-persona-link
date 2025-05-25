import React, { useState, useEffect } from "react";
import { ComponentProps } from "@/types";
import { ANIMATION_DURATIONS } from "@/constants";

interface TypewriterBioProps extends ComponentProps {
  textArray: string[];
  typingDelay?: number;
  erasingDelay?: number;
  newTextDelay?: number;
  showCursor?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  onTextChange?: (currentText: string, index: number) => void;
}

const TypewriterBio: React.FC<TypewriterBioProps> = ({
  textArray,
  typingDelay = 100,
  erasingDelay = 50,
  newTextDelay = 2000,
  showCursor = true,
  loop = true,
  className = "",
  onComplete,
  onTextChange
}) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(typingDelay);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (textArray.length === 0) return;

    const timer = setTimeout(() => {
      handleType();
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, textArray]);

  useEffect(() => {
    if (onTextChange) {
      onTextChange(text, loopNum % textArray.length);
    }
  }, [text, loopNum, onTextChange]);

  const handleType = () => {
    if (textArray.length === 0) return;

    const i = loopNum % textArray.length;
    const fullText = textArray[i];

    setText(
      isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
    );

    setTypingSpeed(isDeleting ? erasingDelay : typingDelay);

    if (!isDeleting && text === fullText) {
      // Finished typing current text
      if (!loop && loopNum === textArray.length - 1) {
        // Don't loop and we're at the last text
        setIsCompleted(true);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setTimeout(() => setIsDeleting(true), newTextDelay);
    } else if (isDeleting && text === "") {
      // Finished erasing
      setIsDeleting(false);
      setLoopNum(prev => prev + 1);
    }
  };

  const getCursorClasses = () => {
    return `inline-block w-0.5 h-5 ml-0.5 bg-linkdark ${isCompleted ? '' : 'animate-blink'
      }`;
  };

  if (textArray.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-center text-lg sm:text-xl font-medium text-gray-500">
          No bio text available
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <p
        className="text-center text-lg sm:text-xl font-medium"
        aria-live="polite"
        aria-label={`Bio text: ${text}`}
      >
        {text}
        {showCursor && (
          <span
            className={getCursorClasses()}
            aria-hidden="true"
          />
        )}
      </p>
    </div>
  );
};

export default TypewriterBio;

import React, { useState, useEffect } from "react";

interface TypewriterBioProps {
  textArray: string[];
  typingDelay?: number;
  erasingDelay?: number;
  newTextDelay?: number;
}

const TypewriterBio: React.FC<TypewriterBioProps> = ({
  textArray,
  typingDelay = 100,
  erasingDelay = 50,
  newTextDelay = 2000,
}) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(typingDelay);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleType();
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  const handleType = () => {
    const i = loopNum % textArray.length;
    const fullText = textArray[i];

    setText(
      isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
    );

    setTypingSpeed(isDeleting ? erasingDelay : typingDelay);

    if (!isDeleting && text === fullText) {
      setTimeout(() => setIsDeleting(true), newTextDelay);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-center text-lg sm:text-xl font-medium">
        {text}
        <span className="inline-block w-0.5 h-5 ml-0.5 bg-linkdark animate-blink" />
      </p>
    </div>
  );
};

export default TypewriterBio;

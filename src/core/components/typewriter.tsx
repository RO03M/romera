import { Typography } from "@mui/joy";
import { useEffect, useState } from "preact/hooks";

enum TypeMode {
    ERASING,
    WRITING
}

interface TypewriterProps {
    texts: string[];
}

export function Typewriter(props: TypewriterProps) {
    const { texts } = props;

    const [displayText, setDisplayText] = useState("");
    const [typingMode, setTypingMode] = useState<TypeMode>(TypeMode.WRITING);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(function() {
            setDisplayText((displayText) => {
                if (typingMode === TypeMode.WRITING) {
                    const currentText = texts[currentTextIndex];
                    displayText = currentText.slice(0, displayText.length + 1);
                    if (displayText.length === currentText.length) {
                        setTypingMode(TypeMode.ERASING);
                        setCurrentTextIndex(function (prevIndex) {
                            if (prevIndex + 1 > texts.length - 1) {
                                return 0;
                            }

                            return prevIndex + 1;
                        });
                    }
                } else {
                    displayText = displayText.slice(0, -1);
                    if (displayText.length === 0) {
                        setTypingMode(TypeMode.WRITING);
                    }
                }

                return displayText;
            });
        }, 150);

        return () => {
            clearInterval(interval);
        }
    }, [texts, typingMode, currentTextIndex]);

    return (
        <Typography
            level={"h3"}
            sx={{
                "&:after": {
                    content: '""',
                    // height: 1,
                    borderRight: "1px solid white"
                }
            }}
        >
            {displayText}
        </Typography>
    )
}
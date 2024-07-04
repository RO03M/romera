import { motion } from "framer-motion";
import { ReactNode } from "preact/compat";

interface FadeInTextProps {
    delay?: number;
    duration?: number;
    children: ReactNode;
}

export function FadeInText(props: FadeInTextProps) {
    const { delay = 0, duration = .7, children } = props;

    return (
        <motion.div
            initial={{
                x: -10,
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            transition={{
                duration,
                delay
            }}
        >
            {children}
        </motion.div>
    );
}
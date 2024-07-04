import { Icon } from "@iconify/react/dist/iconify.js";
import { Box } from "@mui/joy";
import { motion } from "framer-motion";

export function ScrollDownAnimation() {
    return (
        <Box
            sx={{
                width: 30,
                height: 50,
                borderRadius: 15,
                border: `3px solid white`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
            }}
        >
            <motion.div
                initial={{
                    y: 10
                }}
                animate={{
                    y: [10, 0, 10]
                }}
                transition={{
                    repeat: Infinity,
                    repeatDelay: 2
                }}
            >
                <Icon icon={"formkit:arrowdown"} fontSize={20}/>
            </motion.div>
        </Box>
    );
}
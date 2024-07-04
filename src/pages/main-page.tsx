import { Box, IconButton, Typography } from "@mui/joy";

import { motion } from "framer-motion";

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { FadeInText } from "../core/components/fade-in-text";

export function MainPage() {
    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Box
                sx={{
                    width: 700,
                    height: 400,
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    padding: 4
                }}
            >
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box>
                        <Typography level={"h1"}>romera</Typography>
                        {/* <Typography level={"title-lg"}>Desenvolvedor de Software</Typography> */}
                    </Box>
                    <Box gap={2} display={"flex"} alignItems={"center"}>
                        <IconButton variant="solid">
                            <GitHubIcon />
                        </IconButton>
                        <IconButton variant="solid">
                            <LinkedInIcon />
                        </IconButton>
                    </Box>
                </Box>
                <FadeInText>
                    <Typography level={"body-md"}>teste</Typography>
                </FadeInText>
                <FadeInText delay={.1}>
                    <Typography level={"body-md"}>teste</Typography>
                </FadeInText>
                <FadeInText delay={.15}>
                    <Typography level={"body-md"}>teste</Typography>
                </FadeInText>
                <FadeInText delay={.2}>
                    <Typography level={"body-md"}>teste</Typography>
                </FadeInText>
            </Box>
        </Box>
    );
}
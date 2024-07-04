import { Box, Button, IconButton, Typography } from "@mui/joy";
import { ageDiff } from "../../core/utils/age-diff";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Icon } from "@iconify/react/dist/iconify.js";
import { blue } from "@mui/material/colors";
import { Typewriter } from "../../core/components/typewriter";
import { ScrollDownAnimation } from "../../core/components/scroll-down-animation";

export function PresentationPage() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 30,
                pb: 20
            }}
        >
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                mb={30}
            >
                <Typography level={"h1"} textTransform={"uppercase"} fontWeight={900}>HEY, I'M GABRIEL ROMERA</Typography>
                <Typography
                    level={"title-md"}
                    my={2}
                    maxWidth={500}
                    textAlign={"center"}
                    sx={{
                        wordBreak: "break-word"
                    }}
                >
                    Sou um Desenvolvedor de Software que gosta do que faz e busca resolver problemas da melhor maneira possível
                </Typography>
                <Box mb={2} display={"flex"} gap={2}>
                    <IconButton variant={"solid"}>
                        <GitHubIcon />
                    </IconButton>
                    <IconButton variant={"solid"}>
                        <LinkedInIcon />
                    </IconButton>
                </Box>
                <Button startDecorator={<Icon icon={"material-symbols:download"}/>}>
                    RESUME
                </Button>

            </Box>
                <ScrollDownAnimation />
        </Box>
    );
}

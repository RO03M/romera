import { Box, Button, IconButton, Typography } from "@mui/joy";
import { ageDiff } from "../../core/utils/age-diff";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Icon } from "@iconify/react/dist/iconify.js";
import { blue } from "@mui/material/colors";
import { Typewriter } from "../../core/components/typewriter";

export function PresentationPage() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: blue[400],
                pt: 30,
                pb: 20
            }}
        >
            <Box>
                <Typography level={"h1"}>Hi! I am Gabriel Romera</Typography>
                {/* <Typography level={"h2"}>Software Developer</Typography> */}
                <Typewriter texts={["Hello", "", "", "", "Leticia"]} />
                <Typography level={"title-md"} my={2}>
                    I am a {ageDiff(new Date("7/19/2003"))} y.o Software Developer, with experience in FullStack Development
                </Typography>
                <Box mb={2}>
                    <IconButton>
                        <GitHubIcon />
                    </IconButton>
                    <IconButton>
                        <LinkedInIcon />
                    </IconButton>
                </Box>
                <Button startDecorator={<Icon icon={"material-symbols:download"}/>}>
                    Resume
                </Button>
            </Box>
        </Box>
    );
}

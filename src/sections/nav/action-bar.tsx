import { Box, Button, IconButton } from "@mui/joy";
import { Icon } from "@iconify/react";

export function ActionBar() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1
            }}
        >
            <Button variant={"plain"}>About</Button>
            <Button variant={"plain"}>Projects</Button>
            <Button variant={"plain"}>Experience</Button>
            <Button variant={"plain"}>Contact</Button>
            <IconButton>
                <Icon icon={"material-symbols:dark-mode-outline"}/>
            </IconButton>
        </Box>
    );
}

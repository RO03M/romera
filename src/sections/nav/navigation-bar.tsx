import { Box, Typography } from "@mui/joy";
import { ActionBar } from "./action-bar";

const BAR_HEIGHT = 70;

export function NavigationBar() {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                display: "flex",
                width: "100%",
                height: BAR_HEIGHT,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "white",
                    px: 2
                }}
            >
                <Typography level={"h1"}>romera</Typography>
                <ActionBar />
            </Box>
        </Box>
    );
}
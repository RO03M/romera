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
                justifyContent: "center"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "white",
                    px: 2,
                    m: 1,
                    height: "100%",
                    width: "85%",
                    maxWidth: 1400,
                    borderRadius: 5
                }}
            >
                <Typography
                    level={"h1"}
                    sx={{
                        userSelect: "none",
                        color: "black"
                    }}
                >
                    romera
                </Typography>
                <ActionBar />
            </Box>
        </Box>
    );
}
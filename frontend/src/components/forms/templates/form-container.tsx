import { Box } from "@mui/material";
import { JSX } from "react";

export default function FormContainer({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 1,
                minWidth: 400
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: 3,
                    borderRadius: 1,
                    boxShadow: 24,
                    minWidth: 400,
                    alignSelf: 'flex-start',
                    bgcolor: (theme) =>
                        theme.palette.mode === "light"
                            ? theme.palette.common.white
                            : theme.palette.common.black,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
import { Box } from "@mui/material";
import { JSX, useState } from "react";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import { useTheme } from "@mui/material/styles";

export default function FormContainer({ children }: { children: React.ReactNode }): JSX.Element {
    const [openFom, setOpenForm] = useState(false);
    const theme = useTheme()
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 1,
                minWidth: openFom ? 400 : 100
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: 3,
                    borderRadius: 1,
                    boxShadow: 0,
                    alignSelf: 'flex-start',
                    bgcolor: (theme) =>
                        theme.palette.mode === "light"
                            ? theme.palette.common.white
                            : theme.palette.common.black,
                }}
            > {
                    openFom ? (
                       <>
                       <Box sx={{ display: 'flex', flexGrow: 0, flexShrink: 1, height: '100%'}}>
                            <Box onClick={() => setOpenForm(false)} >
                                <CloseFullscreenIcon color="inherit" sx={{ color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.contrastText, cursor: 'pointer' }} />
                            </Box>
                        </Box>
                    {children}
                    </>
                ) :

                (
                <Box onClick={() => setOpenForm(true)} >
                    <DynamicFormIcon color="inherit" sx={{ color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.contrastText, cursor: 'pointer' }} />
                </Box>

                )
            }


            </Box>
        </Box>
    );
}

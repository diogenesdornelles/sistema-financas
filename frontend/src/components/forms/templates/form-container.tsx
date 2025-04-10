import { Box } from "@mui/material";
import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import { useTheme } from "@mui/material/styles";


const MotionBox = motion(Box)

export default function FormContainer({ children }: { children: React.ReactNode }): JSX.Element {
    const [openForm, setOpenForm] = useState(false);
    const theme = useTheme();

    const contentVariants = {
        hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    const collapsedWidth = 70;
    const expandedWidth = 600;

    return (
        <MotionBox 
            layout 
            initial={false}
            animate={{
                width: openForm ? expandedWidth : collapsedWidth,
            }}
            transition={{
                duration: 0.4,
                ease: "easeInOut",
            }}
            style={{
                padding: theme.spacing(1),
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    padding: openForm ? 2 : 0,
                    gap: theme.spacing(2),
                    borderRadius: 1,
                    boxShadow: 0,
                    bgcolor: (theme) =>
                        theme.palette.mode === "light"
                            ? theme.palette.common.white
                            : theme.palette.grey[900],
                    overflow: "hidden",
                    height: '100%',
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: "flex-start",
                }}
            >
                <AnimatePresence initial={false} mode="wait">
                    {openForm ? (
                        <MotionBox
                            key="form-content"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: theme.spacing(2),
                            }}
                        >
                            <Box
                                onClick={() => setOpenForm(false)}
                                sx={{
                                    alignSelf: 'flex-end',
                                    cursor: 'pointer',
                                    lineHeight: 0,
                                    mb: 1,
                                    color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.common.white
                                }}
                            >
                                <CloseFullscreenIcon />
                            </Box>
                            {children}
                        </MotionBox>
                    ) : (
                        <MotionBox
                            key="form-icon"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                            sx={{alignSelf: 'center'}}
                        >
                             <Box
                                 onClick={() => setOpenForm(true)}
                                 sx={{
                                     cursor: 'pointer',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                     lineHeight: 0,
                                     color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.common.white
                                 }}
                            >
                                <DynamicFormIcon />
                             </Box>
                        </MotionBox>
                    )}
                </AnimatePresence>
            </Box>
        </MotionBox>
    );
}
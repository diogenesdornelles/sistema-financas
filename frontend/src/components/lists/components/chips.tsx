import { Box, Stack } from "@mui/material";



export default function ButtonUpdateForm({ children }: { children: React.ReactElement }) {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="row" spacing={1}>
                {children}
            </Stack>
        </Box>
    )
}
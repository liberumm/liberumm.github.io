// Footer.js
const { Box, Typography } = MaterialUI;

function Footer() {
    return (
        <Box component="footer" sx={{ padding: 2, textAlign: 'center', backgroundColor: '#1976d2', color: 'white', marginTop: 'auto' }}>
            <Typography variant="body2">
                © 2024 店舗管理システム. All rights reserved.
            </Typography>
        </Box>
    );
}

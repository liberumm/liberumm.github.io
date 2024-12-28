const { Box, Typography, Container, Grid, Link } = MaterialUI;

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 1 }}>
            <Container maxWidth="md">
                <Box mt={0} textAlign="center">
                    <Typography variant="body2">
                        © {new Date().getFullYear()} SUMMIT,INC. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

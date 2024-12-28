const { Box, Typography, Container, Grid, Link } = MaterialUI;

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 1 }}>
            <Container maxWidth="md">
                <Box mt={0} textAlign="center">
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Sense of Wonder,org. All rights reserved. Powerd by R.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

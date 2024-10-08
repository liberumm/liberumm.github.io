const { Box, Typography, Container, Grid, Link } = MaterialUI;

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 4 }}>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                        サミット株式会社 SUMMIT,INC.
                        </Typography>
                        <Typography variant="body2">
                            ここに会社の紹介文を入れることができます。
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            クイックリンク
                        </Typography>
                        <Link href="/" color="inherit" variant="body2" underline="hover" display="block">
                            ホーム
                        </Link>
                        <Link href="/about" color="inherit" variant="body2" underline="hover" display="block">
                            会社概要
                        </Link>
                        <Link href="/contact" color="inherit" variant="body2" underline="hover" display="block">
                            お問い合わせ
                        </Link>
                    </Grid>
                </Grid>
                <Box mt={4} textAlign="center">
                    <Typography variant="body2">
                        © {new Date().getFullYear()} SUMMIT,INC. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

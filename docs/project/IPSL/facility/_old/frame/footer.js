const { Box, Typography, Container, Grid, Link } = MaterialUI;

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 4 }}>
            <Container maxWidth="md">
          {/* フッター */}
          <Box className="footer">
            <Typography variant="body2">
              © 2024 設備管理システム. All rights reserved.
            </Typography>
          </Box>
            </Container>
        </Box>
    );
}

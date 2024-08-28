const { AppBar, Toolbar, Typography, Button, IconButton, Container, Box, Menu, MenuItem } = MaterialUI;

function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ bgcolor: '#1976d2', boxShadow: 3 }}>
            <Container maxWidth="md">
                <Toolbar disableGutters>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                        Appbar
                    </Typography>

                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                            <span class="material-icons">menu</span>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose} component="a" href="/">Home</MenuItem>
                            <MenuItem onClick={handleMenuClose} component="a" href="/about">About</MenuItem>
                            <MenuItem onClick={handleMenuClose} component="a" href="/contact">Contact</MenuItem>
                        </Menu>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button color="inherit" href="/">Home</Button>
                        <Button color="inherit" href="/about">About</Button>
                        <Button color="inherit" href="/contact">Contact</Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

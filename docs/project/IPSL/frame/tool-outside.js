const { Box, Grid, Button, ButtonGroup } = MaterialUI;
const { useState } = React;

function Tool() {
    const [open, setOpen] = useState(false);
    return (
        <Grid container spacing={2} justifyContent="center" mb={2}>
            <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button>Import</Button>
                        <Button>Export CSV</Button>
                        <Button>Export Excel</Button>
                    </ButtonGroup>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => setOpen(!open)}>
                        Toggle Area
                    </Button>
                </Box>
                {open && (
                    <Box sx={{ width: '100%', mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <p>Expanded Area Content</p>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}
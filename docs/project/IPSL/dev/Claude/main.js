const { Container, Grid } = MaterialUI;

function MainContent() {
    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <SummaryInfo />
                </Grid>
                <Grid item xs={12}>
                    <Filter />
                </Grid>
                <Grid item xs={12}>
                    <ProductTable />
                </Grid>
            </Grid>
        </Container>
    );
}


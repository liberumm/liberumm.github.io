const { Grid } = MaterialUI;

function MainContent() {
    return (
        <Grid container spacing={3} style={{ marginTop: '16px' }}>
            <Grid item xs={12}>
                <div>ここにメインコンテンツが表示されます。</div>
            </Grid>
        </Grid>
    );
}


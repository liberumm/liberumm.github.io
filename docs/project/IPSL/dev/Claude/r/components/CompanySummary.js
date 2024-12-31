const { Paper, Typography, Grid, Box, useTheme } = MaterialUI;

function CompanySummary() {
    const theme = useTheme();
    const summaryItems = [
        {
            title: '売上高',
            value: 1500000,
            metrics: [
                { label: '予算比', value: 95 },
                { label: '前年比', value: 100 }
            ]
        },
        {
            title: '在庫高',
            value: 500000,
            metrics: [
                { label: '計画比', value: 90 },
                { label: '前年比', value: 95 }
            ]
        },
        {
            title: '売上総利益高',
            value: 300000,
            metrics: [
                { label: '予算比', value: 92 },
                { label: '前年比', value: 98 }
            ]
        }
    ];

    const formatValue = (value) => {
        return new Intl.NumberFormat('ja-JP').format(value);
    };

    return (
        <Paper elevation={2} sx={{ p: 1.5 }}>
            <Typography variant="subtitle1" gutterBottom>全社合計</Typography>
            <Grid container spacing={1.5}>
                {summaryItems.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box sx={{ 
                            p: 1.5,
                            textAlign: 'center',
                            borderRight: {
                                sm: index !== summaryItems.length - 1 ? 1 : 0
                            },
                            borderColor: 'divider'
                        }}>
                            <Typography variant="body2" color="primary" gutterBottom>
                                {item.title}
                            </Typography>                            
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {formatValue(item.value)+"千円"}
                            </Typography>

                            <Box sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 1
                            }}>
                                {item.metrics.map((metric, i) => (
                                    <Typography 
                                        key={i} 
                                        variant="caption"
                                        align="center"
                                        sx={{
                                            bgcolor: 'action.hover',
                                            p: 0.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        {metric.label} {metric.value > 0 ? '' : ''}{metric.value}%
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

const { Grid, Paper, Typography, Box, useTheme, IconButton, Collapse } = MaterialUI;
const { useState, memo } = React;

const SummaryInfo = memo(function SummaryInfo() {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(true);
    
    const summaryCards = [
        { status: '提案中', color: theme.palette.info.main },
        { status: '確定済', color: theme.palette.success.main },
        { status: '発注済', color: theme.palette.warning.main },
        { status: '納品済', color: theme.palette.secondary.main },
        { status: '差し戻し', color: theme.palette.error.main }
    ];

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 2, 
                mb: 2,
                bgcolor: theme.palette.background.paper,
                borderTop: `4px solid ${theme.palette.primary.main}`
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ 
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <span className="material-icons">assessment</span>
                    集計情報
                </Typography>
                <IconButton 
                    onClick={() => setIsExpanded(!isExpanded)}
                    sx={{ color: 'black' }}
                >
                    <span className="material-icons">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                </IconButton>
            </Box>
            <Collapse in={isExpanded}>
                <Grid container spacing={2}>
                    {summaryCards.map(({ status, color }) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={status}>
                            <Paper 
                                elevation={2} 
                                sx={{ 
                                    p: 2,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderLeft: `4px solid ${color}`,
                                    '&:hover': {
                                        bgcolor: theme.palette.action.hover,
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s'
                                    }
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ mb: 1, color: color }}>{status}</Typography>
                                <Box sx={{ display: 'grid', gap: 1 }}>
                                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>数量:</span>
                                        <span>1,234</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>原価計:</span>
                                        <span>¥123,456</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>売価計:</span>
                                        <span>¥234,567</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>値入率:</span>
                                        <span>25%</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>平均売価:</span>
                                        <span>¥1,234</span>
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Collapse>
        </Paper>
    );
});

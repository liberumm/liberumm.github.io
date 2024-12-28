const { Paper, Typography, Box, useTheme, IconButton, Collapse } = MaterialUI;
const { useState, useEffect } = React;

function SalesChart({ chartType = "day" }) {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        const ctx = document.getElementById('infographic-chart').getContext('2d');

        if (window.infographicChart) {
            window.infographicChart.destroy();
        }

        let labels = [];
        let data = {
            sales: [],
            budgetRatio: [],
            yoySales: [],
            inventory: [],
            planComparison: [],
            grossProfit: [],
            grossProfitRatio: []
        };

        // チャートデータを期間ごとに準備
        if (chartType === "day") {
            labels = ["2024/08/01", "2024/08/02", "2024/08/03", "2024/08/04", "2024/08/05"];
            data = {
                sales: [100, 110, 120, 115, 130],
                budgetRatio: [95, 98, 99, 97, 100],
                yoySales: [105, 110, 108, 106, 109],
                inventory: [50, 52, 54, 51, 55],
                planComparison: [90, 92, 94, 89, 93],
                grossProfit: [30, 32, 31, 33, 35],
                grossProfitRatio: [12, 12.5, 13, 12.7, 13.5]
            };
        }

        window.infographicChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '売上高',
                        data: data.sales,
                        borderColor: 'blue',
                        yAxisID: 'y-axis-1',
                        fill: false,
                    },
                    {
                        label: '在庫高',
                        data: data.inventory,
                        borderColor: 'orange',
                        yAxisID: 'y-axis-1',
                        fill: false,
                    },
                    {
                        label: '売上総利益高',
                        data: data.grossProfit,
                        borderColor: 'cyan',
                        yAxisID: 'y-axis-1',
                        fill: false,
                    },
                    {
                        label: '予算比',
                        data: data.budgetRatio,
                        borderColor: 'green',
                        yAxisID: 'y-axis-2',
                        fill: false,
                    },
                    {
                        label: '前年比',
                        data: data.yoySales,
                        borderColor: 'red',
                        yAxisID: 'y-axis-2',
                        fill: false,
                    },
                    {
                        label: '計画比',
                        data: data.planComparison,
                        borderColor: 'purple',
                        yAxisID: 'y-axis-2',
                        fill: false,
                    },
                    {
                        label: '売上総利益率',
                        data: data.grossProfitRatio,
                        borderColor: 'magenta',
                        yAxisID: 'y-axis-2',
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    'y-axis-1': {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true,
                    },
                    'y-axis-2': {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + "%";
                            }
                        }
                    }
                }
            }
        });
    }, [chartType]);

    return (
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Typography variant="h6" color="primary">
                    数値推移
                </Typography>
                <IconButton
                    onClick={() => setExpanded(!expanded)}
                    sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    <span className="material-icons">expand_more</span>
                </IconButton>
            </Box>
            <Collapse in={expanded}>
                <Box sx={{ 
                    height: { xs: '300px', sm: '400px' },
                    p: 2
                }}>
                    <canvas id="infographic-chart" />
                </Box>
            </Collapse>
        </Paper>
    );
}

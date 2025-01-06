const { CssBaseline, ThemeProvider, createTheme, Box, Select, MenuItem, FormControl, InputLabel, Button, useTheme, Paper, Typography, Grid } = MaterialUI;

// サンプルデータ
const sampleData = [
    { category: 'A', type: 'X', value: 10 },
    { category: 'A', type: 'Y', value: 15 },
    { category: 'B', type: 'X', value: 20 },
    { category: 'B', type: 'Y', value: 25 },
];

function DimensionChart() {
    const theme = useTheme();
    const [rowKey, setRowKey] = React.useState('');
    const [columnKey, setColumnKey] = React.useState('');
    const [valueKey, setValueKey] = React.useState('');
    const [result, setResult] = React.useState(null);

    // クロス集計のデータを生成
    const handleGenerate = () => {
        const tableData = {};
        sampleData.forEach(item => {
            const row = item[rowKey];
            const col = item[columnKey];
            const val = item[valueKey];
            if (!tableData[row]) tableData[row] = {};
            tableData[row][col] = (tableData[row][col] || 0) + val;
        });
        setResult(tableData);
    };

    // テーブル描画
    const renderTable = () => {
        if (!result) return null;
        const columns = Array.from(new Set(sampleData.map(item => item[columnKey])));
        return (
            <Box sx={{ overflowX: 'auto', mt: 2 }}>
                <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    backgroundColor: theme.palette.background.paper
                }}>
                    <thead>
                        <tr>
                            <th style={{ 
                                padding: '12px',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                backgroundColor: theme.palette.grey[100]
                            }}>{rowKey || '行'}</th>
                            {columns.map(col => (
                                <th key={col} style={{ 
                                    padding: '12px',
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    backgroundColor: theme.palette.grey[100]
                                }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(result).map(row => (
                            <tr key={row}>
                                <td style={{ 
                                    padding: '12px',
                                    borderBottom: `1px solid ${theme.palette.divider}`
                                }}>{row}</td>
                                {columns.map(col => (
                                    <td key={col} style={{ 
                                        padding: '12px',
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        textAlign: 'right'
                                    }}>{result[row][col] || 0}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        );
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 2, 
                mb: 2,
                borderTop: `4px solid ${theme.palette.primary.main}`,
                backgroundColor: theme.palette.background.paper,
                overflow: 'hidden'
            }}
        >
            <Typography variant="subtitle1" sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: theme.palette.text.primary
            }}>
                <span className="material-icons">table_chart</span>
                クロス集計表
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="row-select-label">行項目</InputLabel>
                        <Select
                            labelId="row-select-label"
                            value={rowKey}
                            onChange={(e) => setRowKey(e.target.value)}
                        >
                            <MenuItem value="category">カテゴリー</MenuItem>
                            <MenuItem value="type">タイプ</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="column-select-label">列項目</InputLabel>
                        <Select
                            labelId="column-select-label"
                            value={columnKey}
                            onChange={(e) => setColumnKey(e.target.value)}
                        >
                            <MenuItem value="type">タイプ</MenuItem>
                            <MenuItem value="category">カテゴリー</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="value-select-label">値</InputLabel>
                        <Select
                            labelId="value-select-label"
                            value={valueKey}
                            onChange={(e) => setValueKey(e.target.value)}
                        >
                            <MenuItem value="value">値</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ 
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1
                }}>
                    <Button
                        variant="contained"
                        startIcon={<span className="material-icons">auto_graph</span>}
                        onClick={handleGenerate}
                        size="small"
                        sx={{ minWidth: 120 }}
                    >
                        集計表を生成
                    </Button>
                </Grid>
            </Grid>
            {renderTable()}
        </Paper>
    );
}

window.DimensionChart = DimensionChart;

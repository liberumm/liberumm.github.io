const { useState, useEffect } = React;
const { 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, TextField, 
    Grid, Box, Typography, Button, MenuItem 
} = MaterialUI;

// MaterialUIアイコンの参照を修正
const FilterListIcon = MaterialUI.Icon; // または必要に応じてアイコンを別の方法で表示

// 店舗係数確認タブ用の列幅設定
const coefficientColumnWidths = {
    storeCode: "80px",
    storeName: "150px",
    pattern: "80px"
};

// その他の定数
const rowHeight = 45;
const years = [2022, 2023, 2024];
const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

// スタイル定数を追加
const styles = {
    filterContainer: {
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    tableContainer: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        marginTop: '20px',
        border: '1px solid #e0e0e0',
        backgroundColor: '#ffffff'
    },
    headerCell: {
        backgroundColor: '#f5f5f5',
        color: '#333',
        fontWeight: 'bold',
        padding: '12px 8px',
        borderRight: '1px solid #e0e0e0',
        borderBottom: '2px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    cell: {
        padding: '0',
        borderRight: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
        '&:hover': {
            backgroundColor: '#f8f9fa'
        }
    },
    input: {
        height: '100%',
        padding: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        textAlign: 'center',
        fontSize: '14px',
        '&:hover': {
            backgroundColor: '#f8f9fa'
        },
        '&:focus': {
            outline: '2px solid #1976d2',
            outlineOffset: '-2px',
            backgroundColor: '#fff'
        }
    },
    tableWrapper: {
        margin: '20px 0',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
};

// 空の係数行を作成する関数を追加
const createEmptyCoefficientRow = () => ({
    storeCode: '',
    storeName: '',
    patterns: [0, 0],
    year: new Date().getFullYear(),
    month: '1月',
    date: new Date().toISOString().split('T')[0]
});

// グローバルスコープに定義
window.CoefficientTable = function CoefficientTable({ sharedState, onStateChange }) {
    // 状態管理
    const [coefficientData, setCoefficientData] = useState([createEmptyCoefficientRow()]);
    const [patternHeaders, setPatternHeaders] = useState(["パターン1", "パターン2"]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState("選択しない");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // データ初期化用のuseEffect追加
    useEffect(() => {
        if (!coefficientData.length) {
            setCoefficientData([createEmptyCoefficientRow()]);
        }
    }, []);

    // 係数データのフィルタリング処理
    const filterCoefficientData = () => {
        if (!coefficientData.length) return;
        
        const filteredData = coefficientData.filter((row) => {
            const isYearMatch = row.year === year;
            const isMonthMatch = month === "選択しない" || row.month === month;
            const isStartDateMatch = !startDate || new Date(row.date) >= new Date(startDate);
            const isEndDateMatch = !endDate || new Date(row.date) <= new Date(endDate);

            return isYearMatch && isMonthMatch && isStartDateMatch && isEndDateMatch;
        });

        setCoefficientData(filteredData.length ? filteredData : [createEmptyCoefficientRow()]);
    };

    // 係数データの変更処理
    const handleCoefficientInputChange = (rowIndex, field, value) => {
        const newData = [...coefficientData];
        if (field === 0) {
            newData[rowIndex].storeCode = value;
        } else if (field === 1) {
            newData[rowIndex].storeName = value;
        } else {
            const patternIndex = field - 2;
            newData[rowIndex].patterns[patternIndex] = parseFloat(value) || 0;
        }
        setCoefficientData(newData);
    };

    return (
        <Box mt={2}>
            <Typography variant="h5" gutterBottom style={{ color: '#1976d2', fontWeight: 'bold' }}>
                店舗係数確認
            </Typography>
            
            <Paper elevation={2} style={styles.filterContainer}>
                <Grid container spacing={3}>
                    <Grid item xs={4} md={2}>
                        <TextField
                            label="年度"
                            select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            variant="outlined"
                            fullWidth
                            size="small"
                        >
                            {years.map(y => (
                                <MenuItem key={y} value={y}>{y}年</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <TextField
                            label="月度"
                            select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="選択しない">選択しない</MenuItem>
                            {months.map(m => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <TextField
                            label="開始日"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <TextField
                            label="終了日"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={filterCoefficientData}
                        style={styles.button}
                    >
                        フィルター適用
                    </Button>
                    </Grid>
                    <Grid item xs={6} md={2}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            setYear(new Date().getFullYear());
                            setMonth("選択しない");
                            setStartDate("");
                            setEndDate("");
                        }}
                        style={styles.button}
                    >
                        リセット
                    </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Box style={styles.tableWrapper}>
                <TableContainer style={styles.tableContainer}>
                    <Table 
                        size="small" 
                        style={{ 
                            minWidth: '1200px', 
                            tableLayout: 'fixed',
                            borderCollapse: 'separate',
                            borderSpacing: 0
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ ...styles.headerCell, width: coefficientColumnWidths.storeCode }}>
                                    店舗コード
                                </TableCell>
                                <TableCell style={{ ...styles.headerCell, width: coefficientColumnWidths.storeName }}>
                                    店舗名
                                </TableCell>
                                {(patternHeaders && patternHeaders.length > 0 ? patternHeaders : ["パターン1", "パターン2"]).map((header, index) =>
                                    <TableCell key={index} style={styles.headerCell}>
                                        {header}
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(coefficientData && coefficientData.length > 0) ? coefficientData.map((row, rowIndex) =>
                                <TableRow 
                                    key={rowIndex}
                                    hover
                                >
                                    <TableCell style={styles.cell}>
                                        <TextField
                                            type="text"
                                            value={row.storeCode}
                                            onChange={(e) => handleCoefficientInputChange(rowIndex, 0, e.target.value)}
                                            fullWidth
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: true,
                                                style: styles.input
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell style={styles.cell}>
                                        <TextField
                                            type="text"
                                            value={row.storeName}
                                            onChange={(e) => handleCoefficientInputChange(rowIndex, 1, e.target.value)}
                                            fullWidth
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: true,
                                                style: styles.input
                                            }}
                                        />
                                    </TableCell>
                                    {(row.patterns && row.patterns.length > 0 ? row.patterns : Array(2).fill(0)).map((patternValue, patternIndex) =>
                                        <TableCell key={patternIndex} style={styles.cell}>
                                            <TextField
                                                type="number"
                                                step="any"
                                                value={patternValue}
                                                onChange={(e) => handleCoefficientInputChange(rowIndex, patternIndex + 2, e.target.value)}
                                                fullWidth
                                                variant="standard"
                                                InputProps={{
                                                    disableUnderline: true,
                                                    style: styles.input
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell 
                                        colSpan={patternHeaders.length + 2} 
                                        align="center"
                                        style={styles.cell}
                                    >
                                        データがありません
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

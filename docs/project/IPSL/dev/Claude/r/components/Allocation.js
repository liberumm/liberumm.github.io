const { useState, useEffect, useMemo, useCallback, useRef } = React;
const { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Checkbox, Button, ButtonGroup, Grid, Box, 
    Typography, Slider, MenuItem, Select, Alert, Tab, Tabs, 
    Dialog, DialogTitle, DialogContent, DialogActions
} = MaterialUI;

// スタイル定義
const styles = {
    filterContainer: {
        padding: '16px',
        marginBottom: '16px'
    },
    tableWrapper: {
        marginTop: '16px',
        overflowX: 'auto'
    },
    tableContainer: {
        maxHeight: 'calc(100vh - 300px)'
    },
    headerCell: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '8px',
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    cell: {
        padding: '4px 8px',
        borderBottom: '1px solid #e0e0e0'
    },
    input: {
        textAlign: 'center',
        padding: '4px'
    },
    button: {
        width: '100%',
        height: '100%'
    }
};

// Column width definitions
const productColumnWidths = {
    checkbox: '40px',
    no: '60px',
    status: '120px',
    deliveryAvailableDate: '120px',
    deliveryDate: '120px',
    productCode: '120px',
    productName: '200px',
    cost: '100px',
    price: '100px',
    profit: '100px',
    coefficientPattern: '120px',
    totalPlanQuantity: '100px',
    distribution: '100px',
    unit: '80px',
    minimumQuantity: '100px',
    bulkQuantity: '100px',
    totalCostAmount: '120px',
    totalPriceAmount: '120px',
    totalPlanCostAmount: '120px',
    totalPlanPriceAmount: '120px'
};

// Also add missing constants
const statusOptions = [
    "",
    "未処理",
    "処理中",
    "完了",
    "エラー",
    "保留"
];

const rowHeight = 40;

// Constants and Utils definitions...
// ...existing code...

// 補助関数の定義
const createEmptyRow = (id) => ({
    id,
    selected: false,
    status: "",
    deliveryAvailableDate: "",
    deliveryDate: "",
    productCode: "",
    productName: "",
    cost: 0,
    price: 0,
    profit: 0,
    coefficientPattern: "",
    totalPlanQuantity: 0,
    distribution: 0,
    unit: 1,
    minimumQuantity: 0,
    bulkQuantity: 0,
    totalPriceAmount: 0,
    totalCostAmount: 0,
    totalPlanPriceAmount: 0,
    totalPlanCostAmount: 0
});

const createEmptyCoefficientRow = (id = 1) => ({
    id,
    storeCode: "",
    storeName: "",
    patterns: [0, 0] // パターン1とパターン2の初期値
});

// メインのAllocationコンポーネント - エクスポートを修正
const Allocation = function Allocation() {
    const [activeTab, setActiveTab] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showImportControls, setShowImportControls] = useState(false);
    
    // 共有ステート
    const [sharedState, setSharedState] = useState({
        products: [],
        coefficients: [],
        allocations: [],
        stores: []
    });

    // 設定
    const [settings, setSettings] = useState({
        rowCount: 10,
        numberOfStores: 5,
        showFilters: true,
        autoCalculate: true,
        year: new Date().getFullYear(),
        month: "選択しない",
        week: "選択しない",
        startDate: "",
        endDate: ""
    });

    return (
        <Box>
            {/* タブ */}
            <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="商品リスト" />
                <Tab label="配分表" />
                <Tab label="店舗係数" />
            </Tabs>

            {/* タブパネル */}
            {activeTab === 0 && (
                <DataTable 
                    sharedState={sharedState}
                    onStateChange={setSharedState}
                    settings={settings}
                />
            )}
            {activeTab === 1 && (
                <AllocationTable 
                    sharedState={sharedState}
                    onStateChange={setSharedState}
                    settings={settings}
                    showSettings={showSettings}
                    onToggleSettings={() => setShowSettings(!showSettings)}
                />
            )}
            {activeTab === 2 && (
                <CoefficientTable 
                    sharedState={sharedState}
                    onStateChange={setSharedState}
                    settings={settings}
                />
            )}
        </Box>
    );
};

// インポートコントロールコンポーネント
const ImportControls = ({ show, onStateChange }) => {
    // インポート処理の実装
    const handleFileImport = useCallback((event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // タイプに応じたデータ処理
            switch (type) {
                case 'productList':
                    // ...existing code...
                    break;
                case 'storeMaster':
                    // ...existing code...
                    break;
                case 'coefficient':
                    // ...existing code...
                    break;
            }
        };
        reader.readAsArrayBuffer(file);
    }, [onStateChange]);

    // テンプレートダウンロード処理
    const handleTemplateDownload = useCallback((type) => {
        // ...existing code...
    }, []);

    if (!show) return null;

    return (
        <Box mt={2}>
            {/* インポートコントロールのUI */}
            {/* ...existing code... */}
        </Box>
    );
};

// AllocationTable component implementation
function AllocationTable({ sharedState, onStateChange, settings, showSettings, onToggleSettings }) {
    const [data, setData] = useState([]);

    // 初期データ作成
    useEffect(() => {
        const initialData = Array(settings.rowCount).fill(null).map((_, index) => ({
            id: index + 1,
            selected: false,
            deliveryDate: '',
            productCode: '',
            productName: '',
            cost: 0,
            price: 0,
            distribution: 0,
            stores: Array(settings.numberOfStores).fill(0)
        }));
        setData(initialData);
    }, [settings.rowCount, settings.numberOfStores]);

    // データ変更ハンドラ
    const handleChange = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = value;
        setData(newData);
        onStateChange?.({ ...sharedState, allocationData: newData });
    };

    // 配分処理
    const distribute = () => {
        const newData = data.map(row => {
            if (row.selected && row.distribution > 0) {
                const storeCount = settings.numberOfStores;
                const baseAmount = Math.floor(row.distribution / storeCount);
                const remainder = row.distribution % storeCount;
                
                const stores = Array(storeCount).fill(baseAmount);
                for (let i = 0; i < remainder; i++) {
                    stores[i]++;
                }
                
                return { ...row, stores };
            }
            return row;
        });
        setData(newData);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                    <TextField
                        type="number"
                        label="店舗数"
                        value={settings.numberOfStores}
                        onChange={(e) => setSettings({ ...settings, numberOfStores: parseInt(e.target.value) || 1 })}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={distribute}>配分実行</Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox />
                            </TableCell>
                            <TableCell>納品日</TableCell>
                            <TableCell>商品コード</TableCell>
                            <TableCell>商品名</TableCell>
                            <TableCell>原価</TableCell>
                            <TableCell>売価</TableCell>
                            <TableCell>配分数</TableCell>
                            {Array(settings.numberOfStores).fill(0).map((_, i) => (
                                <TableCell key={i}>店舗{i + 1}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={row.selected}
                                        onChange={() => handleChange(index, 'selected', !row.selected)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="date"
                                        value={row.deliveryDate}
                                        onChange={(e) => handleChange(index, 'deliveryDate', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={row.productCode}
                                        onChange={(e) => handleChange(index, 'productCode', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={row.productName}
                                        onChange={(e) => handleChange(index, 'productName', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={row.cost}
                                        onChange={(e) => handleChange(index, 'cost', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={row.price}
                                        onChange={(e) => handleChange(index, 'price', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={row.distribution}
                                        onChange={(e) => handleChange(index, 'distribution', parseInt(e.target.value) || 0)}
                                    />
                                </TableCell>
                                {row.stores.map((store, storeIndex) => (
                                    <TableCell key={storeIndex}>
                                        <TextField
                                            type="number"
                                            value={store}
                                            onChange={(e) => {
                                                const newStores = [...row.stores];
                                                newStores[storeIndex] = parseInt(e.target.value) || 0;
                                                handleChange(index, 'stores', newStores);
                                            }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

// DataTable component implementation
function DataTable({ sharedState, onStateChange, settings }) {
    const [tableData, setTableData] = useState([createEmptyRow(1)]);
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filterTab, setFilterTab] = useState(0);

    // ファイルインポート処理
    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const importedProductData = json.slice(1).map((row, index) => ({
                id: index + 1,
                selected: false,
                deliveryAvailableDate: row[1] || '',
                deliveryDate: row[2] || '',
                productCode: row[3] || '',
                productName: row[4] || '',
                cost: row[5] || 0,
                price: row[6] || 0,
                coefficientPattern: row[7] || '',
                totalPlanQuantity: row[8] || 0,
                distribution: row[9] || 0,
                unit: row[10] || 1,
                minimumQuantity: row[11] || 0,
                bulkQuantity: row[12] || 0
            }));
            setTableData(importedProductData);
        };
        reader.readAsArrayBuffer(file);
    };

    // テンプレートダウンロード
    const downloadTemplate = () => {
        const templateData = [
            ["ID", "納品可能日", "納品日", "商品コード", "商品名", "原価", "売価", "係数パターン", "総計画数", "配分数", "単位", "最低導入数", "一括導入数"],
            [1, "2024-08-01", "2024-08-02", "P001", "商品A", 100, 150, "パターン1", 100, 200, 1, 10, 50]
        ];

        const ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "productList_template.xlsx");
    };

    // 行の入力変更を処理
    const handleInputChange = (index, field, value) => {
        const newData = [...tableData];
        const row = newData[index];
        row[field] = value;

        // 計算が必要なフィールドの更新
        const price = parseFloat(row.price) || 0;
        const distribution = parseFloat(row.distribution) || 0;
        const cost = parseFloat(row.cost) || 0;
        const totalPlanQuantity = parseFloat(row.totalPlanQuantity) || 0;

        row.totalPriceAmount = price * distribution;
        row.totalCostAmount = cost * distribution;
        row.totalPlanPriceAmount = price * totalPlanQuantity;
        row.totalPlanCostAmount = cost * totalPlanQuantity;

        if (index === tableData.length - 1 && value !== "") {
            newData.push(createEmptyRow(tableData.length + 1));
        }

        setTableData(newData);
    };

    // 行の選択状態を変更
    const handleSelectRow = (index) => {
        const newData = [...tableData];
        newData[index].selected = !newData[index].selected;
        setTableData(newData);
    };

    // 選択された行を削除
    const handleDeleteSelectedRows = () => {
        setTableData(tableData.filter(row => !row.selected));
    };

    // フィルタ変更処理
    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }));
    };

    // フィルタリング処理
    const filteredTableData = tableData.filter(row => {
        for (const key in filters) {
            if (filters[key] && !String(row[key]).includes(filters[key])) {
                return false;
            }
        }
        return true;
    });

    return (
        <Box mt={1}>
            <Typography variant="h6" gutterBottom>商品リスト</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ButtonGroup fullWidth variant="contained">
                        <Button component="label">
                            商品リスト取込
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                hidden
                                onChange={handleFileImport}
                            />
                        </Button>
                        <Button color="secondary" onClick={downloadTemplate}>
                            テンプレートを出力
                        </Button>
                        <Button color="primary" onClick={() => onStateChange?.('transferSelected', tableData.filter(row => row.selected))}>
                            選択された商品を配分
                        </Button>
                        <Button color="warning" onClick={handleDeleteSelectedRows}>
                            選択した商品を削除
                        </Button>
                    </ButtonGroup>
                </Grid>

                {/* テーブル本体 */}
                <Grid item xs={12}>
                    <Box mt={2} style={{ overflowX: 'auto', width: '100%' }}>
                        <TableContainer component={Paper} style={{ width: '100%' }}>
                            <Table size="small" style={{ minWidth: '1800px' }}>
                                <TableHead>
                                    {/* フィルター行 */}
                                    <TableRow>
                                        <TableCell padding="none" style={{ width: productColumnWidths.checkbox }} align="center">
                                            <Checkbox
                                                inputProps={{ 'aria-label': 'select all rows' }}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setTableData(tableData.map(row => ({ ...row, selected: checked })));
                                                }}
                                            />
                                        </TableCell>
                                        {/* フィルター入力フィールド */}
                                        {["No", "status", "deliveryAvailableDate", "deliveryDate", "productCode", "productName", 
                                          "cost", "price", "coefficientPattern", "distribution", "unit", "minimumQuantity", 
                                          "bulkQuantity"].map((key, i) => (
                                            <TableCell key={i} padding="none" style={{ width: productColumnWidths[key] }} align="center">
                                                <TextField
                                                    placeholder="フィルタ"
                                                    variant="standard"
                                                    onChange={(e) => handleFilterChange(key, e.target.value)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {/* 列ヘッダー行 */}
                                    <TableRow>
                                        <TableCell padding="none" style={{ width: productColumnWidths.checkbox }} align="center" />
                                        <TableCell padding="none" style={{ width: productColumnWidths.no }} align="center">No</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.status }} align="center">ステータス</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.deliveryAvailableDate }} align="center">納品可能日</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.deliveryDate }} align="center">納品日</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.productCode }} align="center">商品コード</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.productName }} align="center">商品名</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.cost }} align="center">原価</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.price }} align="center">売価</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.profit }} align="center">値入</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.coefficientPattern }} align="center">パターン</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.totalPlanQuantity }} align="center">総計画数</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.distribution }} align="center">配分数</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.unit }} align="center">単位</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.minimumQuantity }} align="center">最低導入数</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.bulkQuantity }} align="center">一括導入数</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.totalCostAmount }} align="center">原価額計</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.totalPriceAmount }} align="center">売価額計</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.totalPlanCostAmount }} align="center">合計原価額</TableCell>
                                        <TableCell padding="none" style={{ width: productColumnWidths.totalPlanPriceAmount }} align="center">合計売価額</TableCell>
                                    </TableRow>
                                </TableHead>
                                {/* テーブルボディ */}
                                <TableBody>
                                    {filteredTableData.map((row, index) => (
                                        <TableRow key={row.id} style={{ height: `${rowHeight}px` }}>
                                            <TableCell padding="none" style={{ width: productColumnWidths.checkbox }} align="center">
                                                <Checkbox
                                                    checked={row.selected}
                                                    onChange={() => handleSelectRow(index)}
                                                />
                                            </TableCell>
                                            <TableCell padding="none" align="center">{index + 1}</TableCell>
                                            <TableCell padding="none" align="center">
                                                <Select
                                                    value={row.status}
                                                    onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                                    fullWidth
                                                    style={{ height: '40px', padding: 0 }}
                                                >
                                                    {statusOptions.map(option => (
                                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            {/* 入力フィールド */}
                                            {["deliveryAvailableDate", "deliveryDate", "productCode", "productName", 
                                              "cost", "price", "profit", "coefficientPattern", "totalPlanQuantity", 
                                              "distribution", "unit", "minimumQuantity", "bulkQuantity"].map((key, i) => (
                                                <TableCell key={i} padding="none" align="center">
                                                    <TextField
                                                        type={["cost", "price", "distribution", "minimumQuantity", 
                                                              "bulkQuantity", "totalPlanQuantity"].includes(key) ? "number" : "text"}
                                                        value={row[key]}
                                                        onChange={(e) => handleInputChange(index, key, e.target.value)}
                                                        fullWidth
                                                        inputProps={{ 
                                                            style: { 
                                                                height: '40px', 
                                                                padding: '0 8px',
                                                                textAlign: ["cost", "price", "distribution", "minimumQuantity", 
                                                                          "bulkQuantity", "totalPlanQuantity"].includes(key) ? "right" : "left"
                                                            } 
                                                        }}
                                                    />
                                                </TableCell>
                                            ))}
                                            {/* 計算フィールド */}
                                            <TableCell padding="none" align="center">{(row.distribution * row.cost).toFixed(0)}</TableCell>
                                            <TableCell padding="none" align="center">{(row.distribution * row.price).toFixed(0)}</TableCell>
                                            <TableCell padding="none" align="center">{(row.totalPlanQuantity * row.cost).toFixed(0)}</TableCell>
                                            <TableCell padding="none" align="center">{(row.totalPlanQuantity * row.price).toFixed(0)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

// CoefficientTable component implementation
function CoefficientTable({ sharedState, onStateChange, settings }) {
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
}

// Make sure components are available globally
window.Allocation = Allocation;
window.AllocationTable = AllocationTable;
window.DataTable = DataTable;
window.CoefficientTable = CoefficientTable;

// React要素としても使用できるようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Allocation,
        AllocationTable,
        DataTable,
        CoefficientTable
    };
}


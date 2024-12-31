const { useState, useEffect } = React;
const { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Checkbox, Select, MenuItem, ButtonGroup, Button,
    Grid, Box, Typography
} = MaterialUI;

// 商品リストタブ用の列幅を定義するオブジェクト
const productColumnWidths = {
    checkbox: "50px",
    no: "50px",
    status: "100px",
    deliveryAvailableDate: "125px",
    deliveryDate: "125px",
    productCode: "125px",
    productName: "200px",
    cost: "75px",
    price: "75px",
    profit: "75px",
    coefficientPattern: "100px",
    totalPlanQuantity: "100px",
    distribution: "100px",
    unit: "75px",
    minimumQuantity: "100px",
    bulkQuantity: "100px",
    totalPriceAmount: "125px",
    totalCostAmount: "125px",
    totalPlanPriceAmount: "125px",
    totalPlanCostAmount: "125px"
};

const rowHeight = 45;
const statusOptions = ["配分済", "未配分"];

// 商品リストテーブルの各行データを初期化する関数
const createEmptyRow = (id) => ({
    id: id,
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

// コンポーネント定義
window.DataTable = function DataTable({ sharedState, onStateChange }) {
    // 状態管理
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
};

// filepath: /c:/Users/brain/Desktop/dev/git/liberumm.github.io/docs/project/IPSL/dev/Claude/r/components/CoefficientTable.js
function CoefficientTable() {
    const [settings] = useState({
        rowCount: 10 // 初期行数を10に設定
    });

    // 初期データ生成を最適化
    useEffect(() => {
        const initialData = Array(settings.rowCount)
            .fill(null)
            .map((_, index) => createEmptyCoefficientRow(index + 1));
        setCoefficientData(initialData);
    }, []);

    // ...existing code...
}

// components/DimensionSpreadsheet.js
function DimensionSpreadsheet(props) {
    const { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Tabs, Tab } = MaterialUI;
    const [currentTab, setCurrentTab] = React.useState(0);

    // タブのラベル
    const tabLabels = ['全社', '部門', 'コーナー', 'ライン', 'カテゴリ', 'アイテム', 'SKU'];

    // タブの変更ハンドラ
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    // フィルタリングされたデータを取得
    const filteredData = React.useMemo(() => {
        return props.data.filter(item => {
            const matchesProduct = props.filters.product === '' || item.productName.includes(props.filters.product);
            const matchesStatus = props.filters.status === '' || item.status.includes(props.filters.status);
            const matchesStore = props.filters.store === '' || item.store.includes(props.filters.store);
            return matchesProduct && matchesStatus && matchesStore;
        });
    }, [props.filters, props.data]);

    // ステータスに応じたカラー
    const statusColor = {
        "予定": "default",
        "出荷中": "warning",
        "完了": "success",
    };

    // 在庫価値と粗利益の計算
    const enrichedData = React.useMemo(() => {
        let inventoryLevel = 0;
        const dataWithInventory = filteredData.map(item => {
            inventoryLevel += item.quantity; // 納品
            // ここでは簡易的に納品後すぐに販売する前提
            // 実際の在庫回転率を考慮するには販売データとのリンクが必要
            const grossProfit = item.quantity * (item.sellingPrice - item.costPerUnit);
            const inventoryValue = inventoryLevel * item.costPerUnit;
            return {
                ...item,
                grossProfit,
                inventoryValue
            };
        });
        return dataWithInventory;
    }, [filteredData]);

    // データのグループ化関数
    const groupData = (key) => {
        const grouped = {};
        enrichedData.forEach(item => {
            const groupKey = item[key] || '未設定';
            if (!grouped[groupKey]) {
                grouped[groupKey] = { totalQuantity: 0, totalInventoryValue: 0, totalGrossProfit: 0 };
            }
            grouped[groupKey].totalQuantity += item.quantity;
            grouped[groupKey].totalInventoryValue += item.inventoryValue;
            grouped[groupKey].totalGrossProfit += item.grossProfit;
        });
        return grouped;
    };

    // 表示データの取得
    const getDisplayData = () => {
        switch (currentTab) {
            case 0: // 全社
                return enrichedData;
            case 1: // 部門
                return groupData('department'); // 'department' フィールドが必要
            case 2: // コーナー
                return groupData('corner'); // 'corner' フィールドが必要
            case 3: // ライン
                return groupData('line'); // 'line' フィールドが必要
            case 4: // カテゴリ
                return groupData('category'); // 'category' フィールドが必要
            case 5: // アイテム
                return groupData('item'); // 'item' フィールドが必要
            case 6: // SKU
                return enrichedData.filter(item => item.SKU); // 'SKU' フィールドが必要
            default:
                return enrichedData;
        }
    };

    // Excelエクスポート機能の追加
    const handleExportExcel = () => {
        const dataToExport = getDisplayData();
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "dimension_spreadsheet.xlsx");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // CSVエクスポート機能の追加
    const handleExportCSV = () => {
        const dataToExport = getDisplayData();
        const csvData = Papa.unparse(dataToExport);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "dimension_spreadsheet.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box component={Paper} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                データスプレッドシート
            </Typography>
            <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
                {tabLabels.map((label, index) => (
                    <Tab key={index} label={label} />
                ))}
            </Tabs>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleExportCSV}>
                    CSVとしてエクスポート
                </Button>
                <Button variant="contained" color="primary" onClick={handleExportExcel}>
                    Excelとしてエクスポート
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {currentTab === 0 || currentTab === 6 ? (
                                <>
                                    <TableCell>商品名</TableCell>
                                    <TableCell align="right">数量</TableCell>
                                    <TableCell>納品予定日</TableCell>
                                    <TableCell>ステータス</TableCell>
                                    <TableCell>店舗</TableCell>
                                    <TableCell align="right">在庫価値 (円)</TableCell>
                                    <TableCell align="right">粗利益 (円)</TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{tabLabels[currentTab]}</TableCell>
                                    <TableCell align="right">総数量</TableCell>
                                    <TableCell align="right">総在庫価値 (円)</TableCell>
                                    <TableCell align="right">総粗利益 (円)</TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentTab === 0 ? (
                            // 全社タブ: 全データを表示
                            enrichedData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.productName}</TableCell>
                                    <TableCell align="right">{row.quantity}</TableCell>
                                    <TableCell>{row.expectedDate}</TableCell>
                                    <TableCell>
                                        <Chip label={row.status} color={statusColor[row.status]} />
                                    </TableCell>
                                    <TableCell>{row.store}</TableCell>
                                    <TableCell align="right">{row.inventoryValue.toLocaleString()}円</TableCell>
                                    <TableCell align="right">{row.grossProfit.toLocaleString()}円</TableCell>
                                </TableRow>
                            ))
                        ) : currentTab === 6 ? (
                            // SKUタブ: 単品データを表示
                            enrichedData.filter(item => item.SKU).map((row) => (
                                <TableRow key={row.SKU}>
                                    <TableCell>{row.SKU}</TableCell>
                                    <TableCell align="right">{row.quantity}</TableCell>
                                    <TableCell>{row.expectedDate}</TableCell>
                                    <TableCell>
                                        <Chip label={row.status} color={statusColor[row.status]} />
                                    </TableCell>
                                    <TableCell>{row.store}</TableCell>
                                    <TableCell align="right">{row.inventoryValue.toLocaleString()}円</TableCell>
                                    <TableCell align="right">{row.grossProfit.toLocaleString()}円</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // サマリータブ: グループ化されたデータを表示
                            Object.entries(getDisplayData()).map(([key, value], index) => (
                                <TableRow key={index}>
                                    <TableCell>{key}</TableCell>
                                    <TableCell align="right">{value.totalQuantity}</TableCell>
                                    <TableCell align="right">{value.totalInventoryValue.toLocaleString()}円</TableCell>
                                    <TableCell align="right">{value.totalGrossProfit.toLocaleString()}円</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    window.DimensionSpreadsheet = DimensionSpreadsheet;
}

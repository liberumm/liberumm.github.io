const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, ButtonGroup, TextField, TablePagination, Tabs, Tab, Typography } = MaterialUI;
const { useState } = React;

function ProductTable() {
    const [data, setData] = useState([
        { id: 1, status: '提案中', availableDeliveryDate: '2023-08-30', orderDate: '2023-08-28', deliveryDate: '2023-09-01', productName: 'Product A', corner: 'Electronics', line: 'Line 1', category: 'Category A', itemCode: 'P001', cost: 500, price: 1000, markup: 50, quantity: 100, totalCost: 50000, totalPrice: 100000, confirmationDate: '2023-08-25', supplier: 'Supplier A' },
        { id: 2, status: '確定済', availableDeliveryDate: '2023-08-31', orderDate: '2023-08-29', deliveryDate: '2023-09-02', productName: 'Product B', corner: 'Home Appliances', line: 'Line 2', category: 'Category B', itemCode: 'P002', cost: 300, price: 600, markup: 50, quantity: 200, totalCost: 60000, totalPrice: 120000, confirmationDate: '2023-08-26', supplier: 'Supplier B' },
        { id: 3, status: '発注済', availableDeliveryDate: '2023-09-01', orderDate: '2023-08-30', deliveryDate: '2023-09-03', productName: 'Product C', corner: 'Furniture', line: 'Line 3', category: 'Category C', itemCode: 'P003', cost: 400, price: 800, markup: 50, quantity: 150, totalCost: 60000, totalPrice: 120000, confirmationDate: '2023-08-27', supplier: 'Supplier C' },
        { id: 4, status: '納品済', availableDeliveryDate: '2023-09-02', orderDate: '2023-08-31', deliveryDate: '2023-09-04', productName: 'Product D', corner: 'Clothing', line: 'Line 4', category: 'Category D', itemCode: 'P004', cost: 200, price: 400, markup: 50, quantity: 300, totalCost: 60000, totalPrice: 120000, confirmationDate: '2023-08-28', supplier: 'Supplier D' },
        { id: 5, status: '差し戻し', availableDeliveryDate: '2023-09-03', orderDate: '2023-09-01', deliveryDate: '2023-09-05', productName: 'Product E', corner: 'Grocery', line: 'Line 5', category: 'Category E', itemCode: 'P005', cost: 100, price: 200, markup: 50, quantity: 400, totalCost: 40000, totalPrice: 80000, confirmationDate: '2023-08-29', supplier: 'Supplier E' },
        { id: 6, status: '提案中', availableDeliveryDate: '2023-09-04', orderDate: '2023-09-02', deliveryDate: '2023-09-06', productName: 'Product F', corner: 'Electronics', line: 'Line 6', category: 'Category F', itemCode: 'P006', cost: 600, price: 1200, markup: 50, quantity: 50, totalCost: 30000, totalPrice: 60000, confirmationDate: '2023-08-30', supplier: 'Supplier F' },
        { id: 7, status: '確定済', availableDeliveryDate: '2023-09-05', orderDate: '2023-09-03', deliveryDate: '2023-09-07', productName: 'Product G', corner: 'Home Appliances', line: 'Line 7', category: 'Category G', itemCode: 'P007', cost: 350, price: 700, markup: 50, quantity: 150, totalCost: 52500, totalPrice: 105000, confirmationDate: '2023-08-31', supplier: 'Supplier G' },
        { id: 8, status: '発注済', availableDeliveryDate: '2023-09-06', orderDate: '2023-09-04', deliveryDate: '2023-09-08', productName: 'Product H', corner: 'Furniture', line: 'Line 8', category: 'Category H', itemCode: 'P008', cost: 450, price: 900, markup: 50, quantity: 100, totalCost: 45000, totalPrice: 90000, confirmationDate: '2023-09-01', supplier: 'Supplier H' },
        { id: 9, status: '納品済', availableDeliveryDate: '2023-09-07', orderDate: '2023-09-05', deliveryDate: '2023-09-09', productName: 'Product I', corner: 'Clothing', line: 'Line 9', category: 'Category I', itemCode: 'P009', cost: 250, price: 500, markup: 50, quantity: 250, totalCost: 62500, totalPrice: 125000, confirmationDate: '2023-09-02', supplier: 'Supplier I' },
        { id: 10, status: '差し戻し', availableDeliveryDate: '2023-09-08', orderDate: '2023-09-06', deliveryDate: '2023-09-10', productName: 'Product J', corner: 'Grocery', line: 'Line 10', category: 'Category J', itemCode: 'P010', cost: 150, price: 300, markup: 50, quantity: 350, totalCost: 52500, totalPrice: 105000, confirmationDate: '2023-09-03', supplier: 'Supplier J' },
    ]);
    const [filters, setFilters] = useState({ status: '', availableDeliveryDate: '', orderDate: '', deliveryDate: '', productName: '', corner: '', line: '', category: '', itemCode: '', cost: '', price: '', markup: '', quantity: '', totalCost: '', totalPrice: '', confirmationDate: '', supplier: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        setPage(0);
    };

    const filteredData = data.filter(row => {
        return (
            (selectedTab === 0 || (selectedTab === 1 && row.status === '依頼中') || (selectedTab === 2 && row.status === '提案中') || (selectedTab === 3 && row.status === '確定済') || (selectedTab === 4 && row.status === '発注済') || (selectedTab === 5 && row.status === '発注残') || (selectedTab === 6 && row.status === '納品済') || (selectedTab === 7 && row.status === '差し戻し') || (selectedTab === 8 && row.status === '削除予定')) &&
            row.status.toLowerCase().includes(filters.status.toLowerCase()) &&
            row.availableDeliveryDate.includes(filters.availableDeliveryDate) &&
            row.orderDate.includes(filters.orderDate) &&
            row.deliveryDate.includes(filters.deliveryDate) &&
            row.productName.toLowerCase().includes(filters.productName.toLowerCase()) &&
            row.corner.toLowerCase().includes(filters.corner.toLowerCase()) &&
            row.line.toLowerCase().includes(filters.line.toLowerCase()) &&
            row.category.toLowerCase().includes(filters.category.toLowerCase()) &&
            row.itemCode.toLowerCase().includes(filters.itemCode.toLowerCase()) &&
            row.cost.toString().includes(filters.cost) &&
            row.price.toString().includes(filters.price) &&
            row.markup.toString().includes(filters.markup) &&
            row.quantity.toString().includes(filters.quantity) &&
            row.totalCost.toString().includes(filters.totalCost) &&
            row.totalPrice.toString().includes(filters.totalPrice) &&
            row.confirmationDate.includes(filters.confirmationDate) &&
            row.supplier.toLowerCase().includes(filters.supplier.toLowerCase())
        );
    });

    const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Grid container spacing={1} justifyContent="center">
            <Typography variant="h6" align="center" gutterBottom>
                Product Table
            </Typography>
            <Grid item xs={12}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {['提案中', '確定済', '発注済', '納品済', '差し戻し'].map(status => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={status}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="subtitle2">ステータス: {status}</Typography>
                                <Typography variant="body2">数量: {filteredData.filter(item => item.status === status).reduce((acc, item) => acc + item.quantity, 0)}</Typography>
                                <Typography variant="body2">原価計: {filteredData.filter(item => item.status === status).reduce((acc, item) => acc + item.totalCost, 0)}</Typography>
                                <Typography variant="body2">売価計: {filteredData.filter(item => item.status === status).reduce((acc, item) => acc + item.totalPrice, 0)}</Typography>
                                <Typography variant="body2">値入: {filteredData.filter(item => item.status === status).reduce((acc, item) => acc + (item.price - item.cost), 0)}</Typography>
                                <Typography variant="body2">平均売価: {filteredData.filter(item => item.status === status).length > 0 ? (filteredData.filter(item => item.status === status).reduce((acc, item) => acc + item.price, 0) / filteredData.filter(item => item.status === status).length).toFixed(2) : 0}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button>削除</Button>
                        <Button>商品登録（提案）</Button>
                        <Button>Import</Button>
                        <Button>Download Template</Button>
                        <Button>Export CSV</Button>
                        <Button>Export Excel</Button>
                    </ButtonGroup>
                </Box>
                <Tabs value={selectedTab} onChange={handleTabChange} centered>
                    <Tab label="全て" />
                    <Tab label="依頼中" />
                    <Tab label="提案中" />
                    <Tab label="確定済" />
                    <Tab label="発注済" />
                    <Tab label="発注残" />
                    <Tab label="納品済" />
                    <Tab label="差し戻し" />
                    <Tab label="削除予定" />
                </Tabs>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small" aria-label="compact table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary" size="small" />
                                </TableCell>
                                <TableCell>No</TableCell>
                                <TableCell>ステータス</TableCell>
                                <TableCell>納期可能日</TableCell>
                                <TableCell>注文日</TableCell>
                                <TableCell>納品日</TableCell>
                                <TableCell>商品名</TableCell>
                                <TableCell>コーナー</TableCell>
                                <TableCell>ライン</TableCell>
                                <TableCell>カテゴリ</TableCell>
                                <TableCell>商品コード</TableCell>
                                <TableCell>コスト</TableCell>
                                <TableCell>価格</TableCell>
                                <TableCell>マークアップ</TableCell>
                                <TableCell>数量</TableCell>
                                <TableCell>合計コスト</TableCell>
                                <TableCell>合計価格</TableCell>
                                <TableCell>確認日</TableCell>
                                <TableCell>サプライヤー</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary" size="small" />
                                </TableCell>
                                <TableCell>No</TableCell>
                                {['status', 'availableDeliveryDate', 'orderDate', 'deliveryDate', 'productName', 'corner', 'line', 'category', 'itemCode', 'cost', 'price', 'markup', 'quantity', 'totalCost', 'totalPrice', 'confirmationDate', 'supplier'].map((key) => (
                                    <TableCell key={key} sx={{ p: 1 }}>
                                        <TextField
                                            placeholder={key}
                                            variant="outlined"
                                            size="small"
                                            value={filters[key]}
                                            onChange={(e) => handleFilterChange(key, e.target.value)}
                                            sx={{ width: '100%' }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedData.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox color="primary" size="small" />
                                    </TableCell>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.status}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.availableDeliveryDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.orderDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.deliveryDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.productName}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.corner}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.line}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.category}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.itemCode}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.cost}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.price}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.markup}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.quantity}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.totalCost}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.totalPrice}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.confirmationDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.supplier}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
}
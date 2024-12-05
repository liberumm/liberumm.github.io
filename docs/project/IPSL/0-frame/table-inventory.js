const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, ButtonGroup, TextField, TablePagination, Typography } = MaterialUI;
const { useState } = React;

function InveTable() {
    const [data, setData] = useState([
        { id: 1, itemCode: 'A001', sku: 'SKU001', storeCode: 'S001', costPrice: 1000, salePrice: 1500, marginRate: 20, stock: 50, totalCost: 50000, totalSale: 75000, timestamp: '2023-10-01' },
        { id: 2, itemCode: 'A002', sku: 'SKU002', storeCode: 'S002', costPrice: 1200, salePrice: 1700, marginRate: 25, stock: 30, totalCost: 36000, totalSale: 51000, timestamp: '2023-10-02' },
        { id: 3, itemCode: 'A003', sku: 'SKU003', storeCode: 'S003', costPrice: 900, salePrice: 1300, marginRate: 15, stock: 20, totalCost: 18000, totalSale: 26000, timestamp: '2023-10-03' },
    ]);
    const [filters, setFilters] = useState({ itemCode: '', sku: '', storeCode: '', costPrice: '', salePrice: '', marginRate: '', stock: '', totalCost: '', totalSale: '', timestamp: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredData = data.filter(row => {
        return (
            row.itemCode.toLowerCase().includes(filters.itemCode.toLowerCase()) &&
            row.sku.toLowerCase().includes(filters.sku.toLowerCase()) &&
            row.storeCode.toLowerCase().includes(filters.storeCode.toLowerCase()) &&
            row.costPrice.toString().includes(filters.costPrice) &&
            row.salePrice.toString().includes(filters.salePrice) &&
            row.marginRate.toString().includes(filters.marginRate) &&
            row.stock.toString().includes(filters.stock) &&
            row.totalCost.toString().includes(filters.totalCost) &&
            row.totalSale.toString().includes(filters.totalSale) &&
            row.timestamp.toLowerCase().includes(filters.timestamp.toLowerCase())
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
            Inventory Table
            </Typography>
            <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button>Import</Button>
                        <Button>Download Template</Button>
                        <Button>Export CSV</Button>
                        <Button>Export Excel</Button>
                    </ButtonGroup>
                </Box>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small" aria-label="compact table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary" size="small" />
                                </TableCell>
                                <TableCell>No</TableCell>
                                {['itemCode', 'sku', 'storeCode', 'costPrice (円)', 'salePrice (円)', 'marginRate (%)', 'stock', 'totalCost (円)', 'totalSale (円)', 'timestamp'].map((key) => (
                                    <TableCell key={key} sx={{ p: 1 }}>
                                        <TextField
                                            placeholder={key}
                                            variant="outlined"
                                            size="small"
                                            value={filters[key.split(' ')[0]]}
                                            onChange={(e) => handleFilterChange(key.split(' ')[0], e.target.value)}
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
                                    <TableCell sx={{ p: 1 }}>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.itemCode}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.sku}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.storeCode}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.costPrice}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.salePrice}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.marginRate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.stock}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.totalCost}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.totalSale}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.timestamp}</TableCell>
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
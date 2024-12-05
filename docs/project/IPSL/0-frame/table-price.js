const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, ButtonGroup, TextField, TablePagination, Typography } = MaterialUI;
const { useState } = React;

function PriceTable() {
    const [data, setData] = useState([
        { id: 1, priority: 1, startDate: '2023-09-01', endDate: '2023-09-30', itemCode: 'A001', sku: 'SKU001', storeCode: 'S001', costPrice: 1000, salePrice: 1500, marginRate: 20, finalSalePrice: 1400, taxRate: 10 },
        { id: 2, priority: 2, startDate: '2023-10-01', endDate: '2023-10-31', itemCode: 'A002', sku: 'SKU002', storeCode: 'S002', costPrice: 1200, salePrice: 1700, marginRate: 18, finalSalePrice: 1600, taxRate: 10 },
        { id: 3, priority: 3, startDate: '2023-11-01', endDate: '2023-11-30', itemCode: 'A003', sku: 'SKU003', storeCode: 'S003', costPrice: 1100, salePrice: 1600, marginRate: 15, finalSalePrice: 1500, taxRate: 8 },
    ]);
    const [filters, setFilters] = useState({ priority: '', startDate: '', endDate: '', itemCode: '', sku: '', storeCode: '', costPrice: '', salePrice: '', marginRate: '', finalSalePrice: '', taxRate: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredData = data.filter(row => {
        return (
            row.priority.toString().includes(filters.priority) &&
            row.startDate.toLowerCase().includes(filters.startDate.toLowerCase()) &&
            row.endDate.toLowerCase().includes(filters.endDate.toLowerCase()) &&
            row.itemCode.toLowerCase().includes(filters.itemCode.toLowerCase()) &&
            row.sku.toLowerCase().includes(filters.sku.toLowerCase()) &&
            row.storeCode.toLowerCase().includes(filters.storeCode.toLowerCase()) &&
            row.costPrice.toString().includes(filters.costPrice) &&
            row.salePrice.toString().includes(filters.salePrice) &&
            row.marginRate.toString().includes(filters.marginRate) &&
            row.finalSalePrice.toString().includes(filters.finalSalePrice) &&
            row.taxRate.toString().includes(filters.taxRate)
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
            <Grid item xs={12}>
                <Typography variant="h6" align="center" gutterBottom>
                    Price Table
                </Typography>
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
                                {['priority', 'startDate', 'endDate', 'itemCode', 'sku', 'storeCode', 'costPrice', 'salePrice', 'marginRate', 'finalSalePrice', 'taxRate'].map((key) => (
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
                                    <TableCell sx={{ p: 1 }}>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.priority}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.startDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.endDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.itemCode}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.sku}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.storeCode}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.costPrice} (円)</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.salePrice} (円)</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.marginRate} (%)</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.finalSalePrice} (円)</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.taxRate} (%)</TableCell>
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
const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, ButtonGroup, TextField, TablePagination } = MaterialUI;
const { useState } = React;

function OrderTable() {
    const [data, setData] = useState([
        { id: 1, deliveryDate: '2023-09-01', orderDate: '2023-08-25', itemCode: 'P001', sku: 'SKU001', quantity: 100, supplier: 'Supplier A', orderedBy: 'User A', remarks: 'Sample Remark 1' },
        { id: 2, deliveryDate: '2023-09-02', orderDate: '2023-08-26', itemCode: 'P002', sku: 'SKU002', quantity: 200, supplier: 'Supplier B', orderedBy: 'User B', remarks: 'Sample Remark 2' },
        { id: 3, deliveryDate: '2023-09-03', orderDate: '2023-08-27', itemCode: 'P003', sku: 'SKU003', quantity: 150, supplier: 'Supplier C', orderedBy: 'User C', remarks: 'Sample Remark 3' },
    ]);
    const [filters, setFilters] = useState({ deliveryDate: '', orderDate: '', itemCode: '', sku: '', quantity: '', supplier: '', orderedBy: '', remarks: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredData = data.filter(row => {
        return (
            row.deliveryDate.toLowerCase().includes(filters.deliveryDate.toLowerCase()) &&
            row.orderDate.toLowerCase().includes(filters.orderDate.toLowerCase()) &&
            row.itemCode.toLowerCase().includes(filters.itemCode.toLowerCase()) &&
            row.sku.toLowerCase().includes(filters.sku.toLowerCase()) &&
            row.quantity.toString().includes(filters.quantity) &&
            row.supplier.toLowerCase().includes(filters.supplier.toLowerCase()) &&
            row.orderedBy.toLowerCase().includes(filters.orderedBy.toLowerCase()) &&
            row.remarks.toLowerCase().includes(filters.remarks.toLowerCase())
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
                Order Table
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
                                {['deliveryDate', 'orderDate', 'itemCode', 'sku', 'quantity', 'supplier', 'orderedBy', 'remarks'].map((key) => (
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
                                    <TableCell sx={{ p: 1 }}>{row.deliveryDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.orderDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.itemCode}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.sku}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.quantity}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.supplier}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.orderedBy}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.remarks}</TableCell>
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
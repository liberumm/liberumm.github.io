const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, ButtonGroup, TextField, TablePagination } = MaterialUI;
const { useState } = React;

function DataTable() {
    const [data, setData] = useState([
        { id: 1, itemCode: 'A001', sku: 'SKU001', jan: '1234567890123', remarks: 'Sample Remark 1' },
        { id: 2, itemCode: 'A002', sku: 'SKU002', jan: '1234567890124', remarks: 'Sample Remark 2' },
        { id: 3, itemCode: 'A003', sku: 'SKU003', jan: '1234567890125', remarks: 'Sample Remark 3' },
    ]);
    const [filters, setFilters] = useState({ itemCode: '', sku: '', jan: '', remarks: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredData = data.filter(row => {
        return (
            row.itemCode.toLowerCase().includes(filters.itemCode.toLowerCase()) &&
            row.sku.toLowerCase().includes(filters.sku.toLowerCase()) &&
            row.jan.toLowerCase().includes(filters.jan.toLowerCase()) &&
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
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button>Import</Button>
                        <Button>Download Template</Button>
                        <Button>Export CSV</Button>
                        <Button>Export Excel</Button>
                    </ButtonGroup>
                </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary" />
                                </TableCell>
                                <TableCell>No</TableCell>
                                {['itemCode', 'sku', 'jan', 'remarks'].map((key) => (
                                    <TableCell key={key}>
                                        <TextField
                                            placeholder={key}
                                            variant="outlined"
                                            size="small"
                                            value={filters[key]}
                                            onChange={(e) => handleFilterChange(key, e.target.value)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedData.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox color="primary" />
                                    </TableCell>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{row.itemCode}</TableCell>
                                    <TableCell>{row.sku}</TableCell>
                                    <TableCell>{row.jan}</TableCell>
                                    <TableCell>{row.remarks}</TableCell>
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
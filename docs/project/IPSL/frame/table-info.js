const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, ButtonGroup, TextField, TablePagination, Typography } = MaterialUI;
const { useState } = React;

function InfoTable() {
    const [data, setData] = useState([
        { id: 1, applicableDate: '2023-10-01', costPrice: 1000, salePrice: 1500, changeHistory: 'Initial Entry' },
        { id: 2, applicableDate: '2023-10-02', costPrice: 1200, salePrice: 1700, changeHistory: 'Updated sale price' },
        { id: 3, applicableDate: '2023-10-03', costPrice: 900, salePrice: 1300, changeHistory: 'Updated cost price' },
    ]);
    const [filters, setFilters] = useState({ applicableDate: '', costPrice: '', salePrice: '', changeHistory: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredData = data.filter(row => {
        return (
            row.applicableDate.toLowerCase().includes(filters.applicableDate.toLowerCase()) &&
            row.costPrice.toString().includes(filters.costPrice) &&
            row.salePrice.toString().includes(filters.salePrice) &&
            row.changeHistory.toLowerCase().includes(filters.changeHistory.toLowerCase())
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
            Info Table
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
                                {['applicableDate', 'costPrice (円)', 'salePrice (円)', 'changeHistory'].map((key) => (
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
                                    <TableCell sx={{ p: 1 }}>{row.applicableDate}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.costPrice}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.salePrice}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.changeHistory}</TableCell>
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
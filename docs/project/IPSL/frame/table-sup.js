const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, ButtonGroup, TextField, TablePagination, Typography } = MaterialUI;
const { useState } = React;

function SupTable() {
    const [data, setData] = useState([
        { id: 1, supplierCode: 'S001', supplierName: 'Supplier A', destination: 'Location A', orderAvailability: 'Yes', additionalCategory: 'Category 1', autoOrder: 'Yes', orderQuantity: 100, maxOrderQuantity: 500 },
        { id: 2, supplierCode: 'S002', supplierName: 'Supplier B', destination: 'Location B', orderAvailability: 'No', additionalCategory: 'Category 2', autoOrder: 'No', orderQuantity: 200, maxOrderQuantity: 400 },
        { id: 3, supplierCode: 'S003', supplierName: 'Supplier C', destination: 'Location C', orderAvailability: 'Yes', additionalCategory: 'Category 3', autoOrder: 'Yes', orderQuantity: 150, maxOrderQuantity: 450 },
    ]);
    const [filters, setFilters] = useState({ supplierCode: '', supplierName: '', destination: '', orderAvailability: '', additionalCategory: '', autoOrder: '', orderQuantity: '', maxOrderQuantity: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredData = data.filter(row => {
        return (
            row.supplierCode.toLowerCase().includes(filters.supplierCode.toLowerCase()) &&
            row.supplierName.toLowerCase().includes(filters.supplierName.toLowerCase()) &&
            row.destination.toLowerCase().includes(filters.destination.toLowerCase()) &&
            row.orderAvailability.toLowerCase().includes(filters.orderAvailability.toLowerCase()) &&
            row.additionalCategory.toLowerCase().includes(filters.additionalCategory.toLowerCase()) &&
            row.autoOrder.toLowerCase().includes(filters.autoOrder.toLowerCase()) &&
            row.orderQuantity.toString().includes(filters.orderQuantity) &&
            row.maxOrderQuantity.toString().includes(filters.maxOrderQuantity)
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
                    Supplier Table
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
                                <TableCell padding="checkbox" sx={{ p: 1 }}>
                                    <Checkbox color="primary" size="small" />
                                </TableCell>
                                <TableCell sx={{ p: 1 }}>No</TableCell>
                                {['supplierCode', 'supplierName', 'destination', 'orderAvailability', 'additionalCategory', 'autoOrder', 'orderQuantity', 'maxOrderQuantity'].map((key) => (
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
                                    <TableCell padding="checkbox" sx={{ p: 1 }}>
                                        <Checkbox color="primary" size="small" />
                                    </TableCell>
                                    <TableCell sx={{ p: 1 }}>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.supplierCode}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.supplierName}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.destination}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.orderAvailability}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.additionalCategory}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.autoOrder}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.orderQuantity}</TableCell>
                                    <TableCell sx={{ p: 1 }}>{row.maxOrderQuantity}</TableCell>
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
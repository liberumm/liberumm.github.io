const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, TextField } = MaterialUI;
const { useState } = React;

function MatrixTable() {
    const rows = 10;
    const cols = 10;

    const matrixData = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));
    const columnHeaderData = Array.from({ length: cols }, () => '');

    return (
        <Grid container spacing={1} justifyContent="center" mb={4}>
            <Typography variant="h6" align="center" gutterBottom>
                SKU Matrix
            </Typography>
            <Grid item xs={12} display="flex" justifyContent="center">
                <TableContainer component={Paper} sx={{ maxWidth: '1000px' }}>
                    <Table size="small" aria-label="10x10 matrix table" sx={{ tableLayout: 'fixed', width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>Size/Color</TableCell>
                                <TableCell sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>Drop List</TableCell>
                                {Array.from({ length: cols }, (_, colIndex) => (
                                    <TableCell key={colIndex} sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>{colIndex}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>Drop List</TableCell>
                                <TableCell sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}></TableCell>
                                {columnHeaderData.map((_, colIndex) => (
                                    <TableCell key={colIndex} sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>
                                        <Select variant="outlined" size="small" fullWidth>
                                            <MenuItem value="">None</MenuItem>
                                            <MenuItem value="Option 1">Option 1</MenuItem>
                                            <MenuItem value="Option 2">Option 2</MenuItem>
                                            <MenuItem value="Option 3">Option 3</MenuItem>
                                        </Select>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matrixData.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>{rowIndex}</TableCell>
                                    <TableCell sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>
                                        <Select variant="outlined" size="small" fullWidth>
                                            <MenuItem value="">None</MenuItem>
                                            <MenuItem value="Option 1">Option 1</MenuItem>
                                            <MenuItem value="Option 2">Option 2</MenuItem>
                                            <MenuItem value="Option 3">Option 3</MenuItem>
                                        </Select>
                                    </TableCell>
                                    {row.map((cell, colIndex) => (
                                        <TableCell key={colIndex} sx={{ p: 0.5, textAlign: 'center', fontSize: '0.75rem' }}>
                                            <TextField variant="outlined" size="small" fullWidth />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
}

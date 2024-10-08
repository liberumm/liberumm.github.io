const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Tabs, Tab, TablePagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, ButtonGroup, TextField, FormControlLabel, Switch, Snackbar, Alert, Slider } = MaterialUI;
const { useState, useEffect } = React;

function DataTable() {
    const [initialData, setInitialData] = useState([
        { id: 1, displayName: 'Alice Johnson', firstName: 'Alice', lastName: 'Johnson', organization: 'Tech Co', department: 'Development', role: 'Engineer', status: '有効' },
        { id: 2, displayName: 'Bob Smith', firstName: 'Bob', lastName: 'Smith', organization: 'Design LLC', department: 'Creative', role: 'Designer', status: '無効' },
        { id: 3, displayName: 'Carol Davis', firstName: 'Carol', lastName: 'Davis', organization: 'Artworks', department: 'Art', role: 'Artist', status: '有効' },
        { id: 4, displayName: 'Dave Wilson', firstName: 'Dave', lastName: 'Wilson', organization: 'Tech Co', department: 'Management', role: 'Manager', status: '無効' },
        { id: 5, displayName: 'Eve Brown', firstName: 'Eve', lastName: 'Brown', organization: 'Tech Co', department: 'Development', role: 'Developer', status: '有効' },
        { id: 6, displayName: 'Frank Miller', firstName: 'Frank', lastName: 'Miller', organization: 'Analytics Inc', department: 'Analysis', role: 'Analyst', status: '無効' },
        { id: 7, displayName: 'Grace Lee', firstName: 'Grace', lastName: 'Lee', organization: 'Design LLC', department: 'Creative', role: 'Designer', status: '有効' },
        { id: 8, displayName: 'Henry Adams', firstName: 'Henry', lastName: 'Adams', organization: 'Tech Co', department: 'Executive', role: 'CEO', status: '無効' }
    ]);

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [filters, setFilters] = useState({
        status: '',
        id: '',
        displayName: '',
        lastName: '',
        firstName: '',
        organization: '',
        department: '',
        role: ''
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const isAllSelected = selectedRows.length === initialData.length;
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEmptyRows, setShowEmptyRows] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedRows, setEditedRows] = useState({});
    const [confirmedEdits, setConfirmedEdits] = useState({});
    const [history, setHistory] = useState([initialData]);
    const [generation, setGeneration] = useState(0);
    const [maxGenerations, setMaxGenerations] = useState(5);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const sortedData = [...initialData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredData = sortedData.filter(row => {
        return (
            (selectedTab === 0 || row.status === (selectedTab === 1 ? '有効' : '無効')) &&
            row.status.includes(filters.status) &&
            row.id.toString().includes(filters.id) &&
            row.displayName.toLowerCase().includes(filters.displayName.toLowerCase()) &&
            row.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
            row.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
            row.organization.toLowerCase().includes(filters.organization.toLowerCase()) &&
            row.department.toLowerCase().includes(filters.department.toLowerCase()) &&
            row.role.toLowerCase().includes(filters.role.toLowerCase())
        );
    });

    const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const emptyRows = rowsPerPage - displayedData.length;

    const handleChangeTab = (event, newValue) => {
        setSelectedRows([]); 
        setSelectedTab(newValue);
        setPage(0); 
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    const handleCheckboxClick = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const handleSelectAllClick = () => {
        if (isAllSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(initialData.map(row => row.id));
        }
    };

    const handleRowClick = (row) => {
        if (!editMode) {
            setSelectedRow(row);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleExportCSV = () => {
        const headers = ["ID", "表示名", "姓", "名", "組織", "部署", "役割", "ステータス"];
        const rows = filteredData.map(row => [row.id, row.displayName, row.lastName, row.firstName, row.organization, row.department, row.role, row.status]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "table_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const headers = ["ID", "表示名", "姓", "名", "組織", "部署", "役割", "ステータス"];
        const rows = filteredData.map(row => [row.id, row.displayName, row.lastName, row.firstName, row.organization, row.department, row.role, row.status]);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        XLSX.utils.book_append_sheet(wb, ws, "データ");
        XLSX.writeFile(wb, "table_data.xlsx");
    };

    const handleToggleEmptyRows = (event) => {
        setShowEmptyRows(event.target.checked);
    };

    const toggleEditMode = () => {
        if (editMode) {
            setConfirmDialogOpen(true); 
        } else {
            setEditMode(true);
        }
    };

    const handleCellEdit = (id, field, value) => {
        setEditedRows({
            ...editedRows,
            [id]: {
                ...editedRows[id],
                [field]: value !== undefined ? value : '', 
            }
        });
    };

    const handleConfirmClose = (confirmed) => {
        setConfirmDialogOpen(false);
        if (confirmed) {
            const newData = initialData.map(row => {
                if (editedRows[row.id]) {
                    return { ...row, ...editedRows[row.id] };
                }
                return row;
            });
    
            const confirmed = {};
            Object.keys(editedRows).forEach(id => {
                confirmed[id] = { ...editedRows[id] };
                Object.keys(editedRows[id]).forEach(field => {
                    confirmed[id][field] = editedRows[id][field] || ''; 
                });
            });
    
            setInitialData(newData);
            setConfirmedEdits(confirmed);
            setSnackbarOpen(true);
    
            const newHistory = [...history.slice(0, generation + 1), newData];
            if (newHistory.length > maxGenerations) {
                newHistory.shift(); 
            }
            setHistory(newHistory);
            setGeneration(newHistory.length - 1);
        }
        setEditedRows({});
        setEditMode(false);
    };
    

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSliderChange = (event, newValue) => {
        setGeneration(newValue);
        setInitialData(history[newValue]);
    };

    const handleMaxGenerationsChange = (event) => {
        setMaxGenerations(parseInt(event.target.value, 10));
    };

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button onClick={handleExportCSV}>CSVに出力</Button>
                        <Button onClick={handleExportExcel}>Excelに出力</Button>
                    </ButtonGroup>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <FormControlLabel
                        control={<Switch checked={showEmptyRows} onChange={handleToggleEmptyRows} />}
                        label="空の行を表示"
                    />
                    <FormControlLabel
                        control={<Switch checked={editMode} onChange={toggleEditMode} />}
                        label="編集モード"
                    />
                    <Box>
                    <TextField sx={{ width: 80, mx: 2, mt:1 }}
                        label="保持世代数"
                        type="number"
                        value={maxGenerations}
                        onChange={handleMaxGenerationsChange}
                        variant="outlined"
                        size="small"
                    />
                    </Box>
                    <Box sx={{ width: 100, mx: 2 ,mt:1 }}>
                            <Slider
                            value={generation}
                            onChange={handleSliderChange}
                            step={1}
                            marks
                            min={0}
                            max={history.length - 1}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Tabs value={selectedTab} onChange={handleChangeTab} centered>
                        <Tab label="全て" />
                        <Tab label="有効" />
                        <Tab label="無効" />
                    </Tabs>
                </Box>
                <Box sx={{ py: 2, display: 'block', width: '100%' }}>
                    <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
                        <Table aria-label="simple table" sx={{ borderCollapse: 'collapse' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox" sx={{ textAlign: 'center', padding: '4px' }}>
                                        <Checkbox
                                            color="secondary"
                                            indeterminate={selectedRows.length > 0 && !isAllSelected}
                                            checked={isAllSelected}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', padding: '4px' }}>#</TableCell>
                                    {['status', 'id', 'displayName', 'lastName', 'firstName', 'organization', 'department', 'role'].map((key) => (
                                        <TableCell 
                                            key={key} 
                                            sx={{ textAlign: 'center', padding: '4px', cursor: 'pointer' }}
                                            onClick={(event) => !event.target.classList.contains('MuiInputBase-input') && handleSort(key)}
                                        >
                                            <TextField
                                                placeholder={key}
                                                variant="outlined"
                                                size="small"
                                                value={filters[key]}
                                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                                sx={{ width: '100%' }}
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'center'
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()} 
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                    <TableCell padding="checkbox" sx={{ textAlign: 'center', padding: '4px' }}>
                                        <Checkbox
                                            color="secondary"
                                            indeterminate={selectedRows.length > 0 && !isAllSelected}
                                            checked={isAllSelected}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px' }}>#</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('status')}>ステータス</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('id')}>ID</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('displayName')}>表示名</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('lastName')}>姓</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('firstName')}>名</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('organization')}>組織</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('department')}>部署</TableCell>
                                    <TableCell sx={{ color: 'white', textAlign: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => handleSort('role')}>役割</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedData.map((row, index) => (
                                    <TableRow 
                                        key={index} 
                                        onClick={() => handleRowClick(row)}
                                        sx={{
                                            cursor: editMode ? 'default' : 'pointer',
                                            '&:hover': {
                                                backgroundColor: !editMode ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                                            }
                                        }}
                                    >
                                        <TableCell 
                                            padding="checkbox" 
                                            sx={{ textAlign: 'center', padding: '4px' }} 
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <Checkbox
                                                color="primary"
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleCheckboxClick(row.id)}
                                                disabled={editMode}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.status !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.status !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.status !== undefined ? editedRows[row.id]?.status : row.status}
                                                    onChange={(e) => handleCellEdit(row.id, 'status', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.status
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.id !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.id !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.id !== undefined ? editedRows[row.id]?.id : row.id}
                                                    onChange={(e) => handleCellEdit(row.id, 'id', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.id
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.displayName !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.displayName !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.displayName !== undefined ? editedRows[row.id]?.displayName : row.displayName}
                                                    onChange={(e) => handleCellEdit(row.id, 'displayName', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.displayName
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.lastName !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.lastName !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.lastName !== undefined ? editedRows[row.id]?.lastName : row.lastName}
                                                    onChange={(e) => handleCellEdit(row.id, 'lastName', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.lastName
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.firstName !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.firstName !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.firstName !== undefined ? editedRows[row.id]?.firstName : row.firstName}
                                                    onChange={(e) => handleCellEdit(row.id, 'firstName', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.firstName
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.organization !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.organization !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.organization !== undefined ? editedRows[row.id]?.organization : row.organization}
                                                    onChange={(e) => handleCellEdit(row.id, 'organization', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.organization
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.department !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.department !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.department !== undefined ? editedRows[row.id]?.department : row.department}
                                                    onChange={(e) => handleCellEdit(row.id, 'department', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.department
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: editedRows[row.id]?.role !== undefined ? 'lightyellow' : (confirmedEdits[row.id]?.role !== undefined ? 'lightgray' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.role !== undefined ? editedRows[row.id]?.role : row.role}
                                                    onChange={(e) => handleCellEdit(row.id, 'role', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.role
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {showEmptyRows && emptyRows > 0 && (
                                    Array.from({ length: emptyRows }).map((_, index) => (
                                        <TableRow key={`empty-${index}`}>
                                            <TableCell padding="checkbox" sx={{ textAlign: 'center', padding: '4px' }}>
                                                <Checkbox disabled />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{page * rowsPerPage + displayedData.length + index + 1}</TableCell>
                                            <TableCell colSpan={8} style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }} />
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 20]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Grid>

            <Dialog open={confirmDialogOpen} onClose={() => handleConfirmClose(false)}>
                <DialogTitle>編集の確定</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        変更を確定しますか？確定すると元に戻せません。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmClose(false)} color="secondary">
                        破棄
                    </Button>
                    <Button onClick={() => handleConfirmClose(true)} color="primary">
                        確定
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    変更が確定されました！
                </Alert>
            </Snackbar>
        </Grid>
    );
}

const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Tabs, Tab, TablePagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } = MaterialUI;
const { useState } = React;

function DataTable() {
    // テーブルデータ
    const initialData = [
        { id: 1, displayName: 'Alice Johnson', firstName: 'Alice', lastName: 'Johnson', organization: 'Tech Co', department: 'Development', role: 'Engineer', status: '有効' },
        { id: 2, displayName: 'Bob Smith', firstName: 'Bob', lastName: 'Smith', organization: 'Design LLC', department: 'Creative', role: 'Designer', status: '無効' },
        { id: 3, displayName: 'Carol Davis', firstName: 'Carol', lastName: 'Davis', organization: 'Artworks', department: 'Art', role: 'Artist', status: '有効' },
        { id: 4, displayName: 'Dave Wilson', firstName: 'Dave', lastName: 'Wilson', organization: 'Tech Co', department: 'Management', role: 'Manager', status: '無効' },
        { id: 5, displayName: 'Eve Brown', firstName: 'Eve', lastName: 'Brown', organization: 'Tech Co', department: 'Development', role: 'Developer', status: '有効' },
        { id: 6, displayName: 'Frank Miller', firstName: 'Frank', lastName: 'Miller', organization: 'Analytics Inc', department: 'Analysis', role: 'Analyst', status: '無効' },
        { id: 7, displayName: 'Grace Lee', firstName: 'Grace', lastName: 'Lee', organization: 'Design LLC', department: 'Creative', role: 'Designer', status: '有効' },
        { id: 8, displayName: 'Henry Adams', firstName: 'Henry', lastName: 'Adams', organization: 'Tech Co', department: 'Executive', role: 'CEO', status: '無効' }
    ];

    // ソート状態
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    // フィルタ用の状態
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

    // ページネーションの状態
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    // タブの選択状態
    const [selectedTab, setSelectedTab] = useState(0);

    // チェックボックスの選択状態
    const [selectedRows, setSelectedRows] = useState([]);

    // ヘッダーのチェックボックス状態
    const isAllSelected = selectedRows.length === initialData.length;

    // モーダルの状態
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // フィルター用のハンドラー
    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    // ソート処理
    const sortedData = [...initialData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // フィルタリング処理
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

    // 表示するデータのスライス
    const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // タブの変更ハンドラー
    const handleChangeTab = (event, newValue) => {
        setSelectedRows([]); // タブ変更時に選択をクリア
        setSelectedTab(newValue);
        setPage(0); // タブを変更したらページをリセット
    };

    // ページの変更ハンドラー
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // 1ページあたりの行数を変更するハンドラー
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // ページネーションをリセット
    };

    // 行のチェックボックスをクリックしたときのハンドラー
    const handleCheckboxClick = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    // ヘッダーのチェックボックスをクリックしたときのハンドラー
    const handleSelectAllClick = () => {
        if (isAllSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(initialData.map(row => row.id));
        }
    };

    // 行をクリックしたときにモーダルを開くハンドラー（チェックボックス列以外）
    const handleRowClick = (row) => {
        setSelectedRow(row);
        setOpen(true);
    };

    // モーダルを閉じるハンドラー
    const handleClose = () => {
        setOpen(false);
    };

    // ヘッダークリック時のソート変更ハンドラー
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // CSV出力のハンドラー
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

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleExportCSV}>
                        CSVに出力
                    </Button>
                </Box>
                <Box sx={{ width: '100%' }}>
                    {/* タブの設定 */}
                    <Tabs value={selectedTab} onChange={handleChangeTab} centered>
                        <Tab label="全て" />
                        <Tab label="有効" />
                        <Tab label="無効" />
                    </Tabs>
                </Box>
                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
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
                                    {['status', 'id', 'displayName', 'lastName', 'firstName', 'organization', 'department', 'role'].map((key) => (
                                        <TableCell 
                                            key={key} 
                                            sx={{ textAlign: 'center', padding: '4px', cursor: 'pointer' }}
                                            onClick={() => handleSort(key)}
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
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
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
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.status}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.id}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.displayName}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.lastName}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.firstName}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.organization}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.department}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{row.role}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* ページネーションの追加 */}
                        <Box sx={{ backgroundColor: 'secondary.light' }}> {/* フッターの背景色を変更 */}
                            <TablePagination
                                rowsPerPageOptions={[4, 8, 12]}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Box>
                    </TableContainer>
                </Box>
            </Grid>

            {/* モーダルの設定 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>行の詳細</DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <DialogContentText>
                            <strong>ID:</strong> {selectedRow.id}<br />
                            <strong>表示名:</strong> {selectedRow.displayName}<br />
                            <strong>姓:</strong> {selectedRow.lastName}<br />
                            <strong>名:</strong> {selectedRow.firstName}<br />
                            <strong>組織:</strong> {selectedRow.organization}<br />
                            <strong>部署:</strong> {selectedRow.department}<br />
                            <strong>役割:</strong> {selectedRow.role}<br />
                            <strong>ステータス:</strong> {selectedRow.status}
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

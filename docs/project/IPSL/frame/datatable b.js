const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Tabs, Tab, TablePagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, ButtonGroup, TextField, FormControlLabel, Switch, Snackbar, Alert } = MaterialUI;
const { useState } = React;

function DataTable() {
    // テーブルデータ
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
    const [rowsPerPage, setRowsPerPage] = useState(10); // デフォルト行数を10に設定

    // タブの選択状態
    const [selectedTab, setSelectedTab] = useState(0);

    // チェックボックスの選択状態
    const [selectedRows, setSelectedRows] = useState([]);

    // ヘッダーのチェックボックス状態
    const isAllSelected = selectedRows.length === initialData.length;

    // モーダルの状態
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // 空行を表示するかどうかの状態
    const [showEmptyRows, setShowEmptyRows] = useState(true);

    // 編集モードの状態
    const [editMode, setEditMode] = useState(false);

    // 編集されたセルの追跡
    const [editedRows, setEditedRows] = useState({});

    // 確定された編集の追跡
    const [confirmedEdits, setConfirmedEdits] = useState({});

    // 確認ダイアログの表示状態
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    // 編集確定時のスナックバーの状態
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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

    // 空行の追加
    const emptyRows = rowsPerPage - displayedData.length;

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
        if (!editMode) {
            setSelectedRow(row);
            setOpen(true);
        }
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

    // Excel出力のハンドラー
    const handleExportExcel = () => {
        const headers = ["ID", "表示名", "姓", "名", "組織", "部署", "役割", "ステータス"];
        const rows = filteredData.map(row => [row.id, row.displayName, row.lastName, row.firstName, row.organization, row.department, row.role, row.status]);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        XLSX.utils.book_append_sheet(wb, ws, "データ");
        XLSX.writeFile(wb, "table_data.xlsx");
    };

    // 空行表示の切り替え
    const handleToggleEmptyRows = (event) => {
        setShowEmptyRows(event.target.checked);
    };

    // 編集モードのトグル
    const toggleEditMode = () => {
        if (editMode) {
            setConfirmDialogOpen(true); // 編集モード終了時に確認ダイアログを表示
        } else {
            setEditMode(true);
        }
    };

    // セル編集のハンドラー
    const handleCellEdit = (id, field, value) => {
        setEditedRows({
            ...editedRows,
            [id]: {
                ...editedRows[id],
                [field]: value
            }
        });
    };

    // 確認ダイアログを閉じるハンドラー
    const handleConfirmClose = (confirmed) => {
        setConfirmDialogOpen(false);
        if (confirmed) {
            // 確定した場合、編集内容を反映する
            const newData = initialData.map(row => {
                if (editedRows[row.id]) {
                    return { ...row, ...editedRows[row.id] };
                }
                return row;
            });
            setInitialData(newData);
            setConfirmedEdits(editedRows); // 編集内容を確定
            setSnackbarOpen(true); // スナックバーを表示
        }
        setEditedRows({}); // 編集内容をリセット
        setEditMode(false);
    };

    // スナックバーを閉じるハンドラー
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // 元に戻す機能のハンドラー
    const handleUndo = () => {
        setEditedRows({});  // 編集したセルをリセット
    };

    return (
        <Grid container spacing={1} justifyContent="center"> {/* spacingを1にして余白を減らす */}
            <Grid item xs={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}> {/* mbを1にして下マージンを減らす */}
                    <ButtonGroup variant="contained" color="primary">
                        <Button onClick={handleExportCSV}>
                            CSVに出力
                        </Button>
                        <Button onClick={handleExportExcel}>
                            Excelに出力
                        </Button>
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
                    {editMode && <Button onClick={handleUndo} variant="outlined" color="secondary" sx={{ ml: 2 }}>元に戻す</Button>}
                </Box>
                <Box sx={{ width: '100%' }}>
                    {/* タブの設定 */}
                    <Tabs value={selectedTab} onChange={handleChangeTab} centered>
                        <Tab label="全て" />
                        <Tab label="有効" />
                        <Tab label="無効" />
                    </Tabs>
                </Box>
                <Box sx={{ py: 2, display: 'block', width: '100%' }}> {/* pyを2にして上下のパディングを減らす */}
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
                                            onClick={(event) => {
                                                if (event.target.tagName !== 'INPUT') {
                                                    handleSort(key);
                                                }
                                            }}
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
                                                onClick={(event) => event.stopPropagation()} // フィルター行のクリック時にソートを防止
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
                                                disabled={editMode} // 編集モード時はチェックボックスを無効化
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.status ? 'lightgray' : (editedRows[row.id]?.status ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.status || row.status}
                                                    onChange={(e) => handleCellEdit(row.id, 'status', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.status
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.id ? 'lightgray' : (editedRows[row.id]?.id ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.id || row.id}
                                                    onChange={(e) => handleCellEdit(row.id, 'id', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.id
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.displayName ? 'lightgray' : (editedRows[row.id]?.displayName ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.displayName || row.displayName}
                                                    onChange={(e) => handleCellEdit(row.id, 'displayName', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.displayName
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.lastName ? 'lightgray' : (editedRows[row.id]?.lastName ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.lastName || row.lastName}
                                                    onChange={(e) => handleCellEdit(row.id, 'lastName', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.lastName
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.firstName ? 'lightgray' : (editedRows[row.id]?.firstName ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.firstName || row.firstName}
                                                    onChange={(e) => handleCellEdit(row.id, 'firstName', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.firstName
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.organization ? 'lightgray' : (editedRows[row.id]?.organization ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.organization || row.organization}
                                                    onChange={(e) => handleCellEdit(row.id, 'organization', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.organization
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.department ? 'lightgray' : (editedRows[row.id]?.department ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.department || row.department}
                                                    onChange={(e) => handleCellEdit(row.id, 'department', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                row.department
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', padding: '4px', backgroundColor: confirmedEdits[row.id]?.role ? 'lightgray' : (editedRows[row.id]?.role ? 'yellow' : 'inherit') }}>
                                            {editMode ? (
                                                <TextField
                                                    value={editedRows[row.id]?.role || row.role}
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
                                {/* 空行を追加してページネーションの行数を維持 */}
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
                        {/* テーブルフッター */}
                        <Box sx={{ backgroundColor: 'secondary.light' }}>
                            {/* テーブルフッターの内容があればここに追加 */}
                        </Box>
                    </TableContainer>
                </Box>
                {/* ページネーションの追加 */}
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}> {/* mtで上マージンを追加 */}
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

            {/* 編集モード終了確認のダイアログ */}
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

            {/* 確定後のスナックバー */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    変更が確定されました！
                </Alert>
            </Snackbar>
        </Grid>
    );
}

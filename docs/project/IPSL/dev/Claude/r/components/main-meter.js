const {
    Box, Container, Paper, Grid, Button, Typography, FormControl, Select, MenuItem, TablePagination,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
    InputAdornment
} = MaterialUI;

// Material Iconsコンポーネントの定義を削除し、IconButtonを追加
function IconWrapper({ children }) {
    return (
        <span className="material-icons" style={{ fontSize: '20px' }}>
            {children}
        </span>
    );
}

function MainContent() {
    // windowオブジェクトから初期データを取得
    const [meters, setMeters] = React.useState(window.initialMeters || []);
    const [selectedMeterIds, setSelectedMeterIds] = React.useState([]);
    const [editStates, setEditStates] = React.useState({});
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);  // デフォルトを20に変更
    const [filterCriteria, setFilterCriteria] = React.useState({
        year: '',
        month: '',
        location: '',
        category: '',
        searchTerm: ''
    });
    const [columnFilters, setColumnFilters] = React.useState({});
    const [openDialog, setOpenDialog] = React.useState(false);
    const [newEquipment, setNewEquipment] = React.useState({
        equipmentId: '',
        equipmentName: '',
        equipmentType: '',
        installationPlace: '',
        locationName: '',
        manager: '',
        previousValue: '',
        currentValue: '',
        confirmationDate: '',
        registrant: ''
    });
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

    // フィルター適用後のメーター
    const filteredMeters = React.useMemo(() => {
        return meters.filter(meter => {
            if (!meter) return false;
            
            // 検索フィルター
            const matchesSearch = (meter.equipmentId?.includes(filterCriteria.searchTerm) || 
                                 meter.equipmentName?.includes(filterCriteria.searchTerm)) ?? false;

            // 列フィルター
            const matchesColumnFilters = Object.entries(columnFilters).every(([column, value]) => {
                if (!value) return true;
                const meterValue = String(meter[column] || '').toLowerCase();
                return meterValue.includes(value.toLowerCase());
            });

            return matchesSearch && matchesColumnFilters;
        });
    }, [meters, filterCriteria, columnFilters]);

    // イベントハンドラー
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelectedMeterIds(filteredMeters.map(meter => meter.id));
        } else {
            setSelectedMeterIds([]);
        }
    };

    const handleRowClick = (event, id) => {
        const selectedIndex = selectedMeterIds.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedMeterIds, id];
        } else {
            newSelected = selectedMeterIds.filter(selectedId => selectedId !== id);
        }

        setSelectedMeterIds(newSelected);
    };

    const handleCellValueChange = (meterId, field, value) => {
        setEditStates(prev => {
            const updatedState = {
                ...prev,
                [meterId]: {
                    ...prev[meterId],
                    [field]: value
                }
            };

            // メーター値から前回値を引いて利用量を計算
            if (field === 'currentValue' || field === 'previousValue') {
                const meter = meters.find(m => m.id === meterId);
                const currentValue = parseFloat(field === 'currentValue' ? value : (updatedState[meterId]?.currentValue ?? meter.currentValue));
                const previousValue = parseFloat(field === 'previousValue' ? value : (updatedState[meterId]?.previousValue ?? meter.previousValue));
                
                if (!isNaN(currentValue) && !isNaN(previousValue)) {
                    updatedState[meterId].usage = currentValue - previousValue;
                }
            }

            return updatedState;
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleFilterChange = (criteria) => {
        setFilterCriteria(criteria);
        setPage(0); // フィルター変更時にページをリセット
    };

    const handleChangeRowsPerPage = (event) => {
        const value = event.target.value;
        setRowsPerPage(value === 'all' ? filteredMeters.length : parseInt(value, 10));
        setPage(0);
    };

    const handleColumnFilterChange = (column, value) => {
        setColumnFilters(prev => ({
            ...prev,
            [column]: value
        }));
    };

    const handleAddEquipment = () => {
        if (!newEquipment.equipmentId || !newEquipment.equipmentName) {
            setSnackbar({ open: true, message: '必須項目を入力してください', severity: 'error' });
            return;
        }

        const newId = meters.length > 0 ? Math.max(...meters.map(m => m.id)) + 1 : 1;
        const newMeter = {
            id: newId,
            ...newEquipment,
            usage: parseFloat(newEquipment.currentValue || 0) - parseFloat(newEquipment.previousValue || 0)
        };

        setMeters([...meters, newMeter]);
        setOpenDialog(false);
        setNewEquipment({
            equipmentId: '',
            equipmentName: '',
            equipmentType: '',
            installationPlace: '',
            locationName: '',
            manager: '',
            previousValue: '',
            currentValue: '',
            confirmationDate: '',
            registrant: ''
        });
        setSnackbar({ open: true, message: '設備を追加しました', severity: 'success' });
    };

    // CSVエクスポートハンドラー
    const handleExport = () => {
        const headers = [
            'No.', '設備ID', '設備名', '設備タイプ', '設置場所', '拠点名', '管理者',
            '利用量', '前回メーター値', '前回確認日', '前回登録者', 'メーター値',
            '確認日', '登録者'
        ];

        const csvData = filteredMeters.map((meter, index) => ([
            index + 1,
            meter.equipmentId,
            meter.equipmentName,
            meter.equipmentType,
            meter.installationPlace,
            meter.locationName,
            meter.manager,
            meter.usage,
            meter.previousValue,
            meter.previousConfirmationDate,
            meter.previousRegistrant,
            meter.currentValue,
            meter.confirmationDate,
            meter.registrant
        ]));

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'equipment_data.csv';
        link.click();
    };

    // CSVインポートハンドラー
    const handleImport = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            const headers = rows[0];
            const data = rows.slice(1).filter(row => row.length === headers.length);

            const newMeters = data.map((row, index) => ({
                id: meters.length + index + 1,
                equipmentId: row[1],
                equipmentName: row[2],
                equipmentType: row[3],
                installationPlace: row[4],
                locationName: row[5],
                manager: row[6],
                previousValue: parseFloat(row[8]) || 0,
                previousConfirmationDate: row[9],
                previousRegistrant: row[10],
                currentValue: parseFloat(row[11]) || 0,
                confirmationDate: row[12],
                registrant: row[13],
                usage: parseFloat(row[7]) || 0
            }));

            setMeters([...meters, ...newMeters]);
            setSnackbar({ open: true, message: 'データをインポートしました', severity: 'success' });
        };

        reader.readAsText(file);
    };

    // テンプレートダウンロードハンドラー
    const handleDownloadTemplate = () => {
        const headers = [
            '設備ID', '設備名', '設備タイプ', '設置場所', '拠点名', '管理者',
            '前回メーター値', '前回確認日', '前回登録者', 'メーター値',
            '確認日', '登録者'
        ];
        
        const csvContent = headers.join(',');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'equipment_template.csv';
        link.click();
    };

    React.useEffect(() => {
        console.log("Current meters:", meters);
    }, [meters]);

    return (
       
            <Box sx={{ my: 4 }}>
                {/* ヘッダー部分 */}
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2 
                    }}>
                        <Typography variant="h5" component="h1">
                            設備管理
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<IconWrapper>add</IconWrapper>}
                                onClick={() => setOpenDialog(true)}
                            >
                                設備追加
                            </Button>
                            <Button 
                                variant="outlined"
                                startIcon={<IconWrapper>download</IconWrapper>}
                                onClick={handleDownloadTemplate}
                            >
                                テンプレート
                            </Button>
                            <input
                            accept=".csv"
                            style={{ display: 'none' }}
                            id="csv-file-input"
                            type="file"
                            onChange={handleImport}
                            />
                            <label htmlFor="csv-file-input">
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    component="span"
                                    startIcon={<IconWrapper>file_upload</IconWrapper>}
                                >
                                    インポート
                                </Button>
                            </label>
                        </Box>
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        gap: 1,
                        flexWrap: 'wrap'
                    }}>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            startIcon={<IconWrapper>file_download</IconWrapper>}
                            onClick={handleExport}
                        >
                            エクスポート
                        </Button>
                    </Box>
                </Paper>

                {/* メインコンテンツ */}
                <Paper elevation={3} sx={{ p: 2 }}>
                    {/* フィルター部分 */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    placeholder="検索..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconWrapper>search</IconWrapper>
                                            </InputAdornment>
                                        )
                                    }}
                                    value={filterCriteria.searchTerm}
                                    onChange={(e) => handleFilterChange({
                                        ...filterCriteria,
                                        searchTerm: e.target.value
                                    })}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* テーブル */}
                    <TableMeter
                        filteredMeters={filteredMeters}
                        selectedMeterIds={selectedMeterIds}
                        editStates={editStates}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleSelectAllClick={handleSelectAllClick}
                        handleRowClick={handleRowClick}
                        handleCellValueChange={handleCellValueChange}
                        handleColumnFilterChange={handleColumnFilterChange}
                    />

                    {/* ページネーション */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center',
                        mt: 2,
                        gap: 2
                    }}>
                        <FormControl size="small">
                            <Select
                                value={rowsPerPage === filteredMeters.length ? 'all' : rowsPerPage}
                                onChange={handleChangeRowsPerPage}
                                sx={{ minWidth: 100 }}
                            >
                                <MenuItem value={10}>10件</MenuItem>
                                <MenuItem value={20}>20件</MenuItem>
                                <MenuItem value={30}>30件</MenuItem>
                                <MenuItem value="custom">
                                    <TextField
                                        size="small"
                                        type="number"
                                        placeholder="件数入力"
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value > 0) {
                                                setRowsPerPage(value);
                                            }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{ width: '80px' }}
                                    />
                                </MenuItem>
                                <MenuItem value="all">全て</MenuItem>
                            </Select>
                        </FormControl>
                        <TablePagination
                            component="div"
                            count={filteredMeters.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[]}
                            labelDisplayedRows={({ from, to, count }) => 
                                `${from}-${to} / ${count}`}
                        />
                    </Box>
                </Paper>

                {/* 設備追加ダイアログ */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>設備追加</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                            <TextField
                                label="設備ID"
                                required
                                value={newEquipment.equipmentId}
                                onChange={(e) => setNewEquipment({...newEquipment, equipmentId: e.target.value})}
                            />
                            <TextField
                                label="設備名"
                                required
                                value={newEquipment.equipmentName}
                                onChange={(e) => setNewEquipment({...newEquipment, equipmentName: e.target.value})}
                            />
                            {/* ...other input fields... */}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
                        <Button onClick={handleAddEquipment} variant="contained">追加</Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                >
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({...snackbar, open: false})}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>

    );
}

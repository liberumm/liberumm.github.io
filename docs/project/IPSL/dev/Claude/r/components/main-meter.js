// グローバルスコープにinitialMetersを設定
window.initialMeters = [
    {
        id: 1,
        equipmentId: "EQ-001",
        equipmentName: "コンプレッサー1",
        equipmentType: "電気設備",
        locationName: "東京営業所",
        installationPlace: "1F機械室",
        manager: "山田 太郎",
        previousValue: 1000,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "山田 太郎",
        currentValue: 1200,
        confirmationDate: "2024-01-01",
        registrant: "佐藤 花子",
        usage: 200
    },
    {
        id: 2,
        equipmentId: "EQ-002",
        equipmentName: "ポンプ1",
        equipmentType: "水道設備",
        locationName: "大阪支店",
        installationPlace: "地下機械室",
        manager: "鈴木 一郎",
        previousValue: 500,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "鈴木 一郎",
        currentValue: 580,
        confirmationDate: "2024-01-01",
        registrant: "田中 次郎",
        usage: 80
    },
    {
        id: 3,
        equipmentId: "EQ-003",
        equipmentName: "ボイラー1",
        equipmentType: "ガス設備",
        locationName: "名古屋支店",
        installationPlace: "厨房",
        manager: "高橋 三郎",
        previousValue: 300,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "高橋 三郎",
        currentValue: 350,
        confirmationDate: "2024-01-01",
        registrant: "伊藤 四郎",
        usage: 50
    },
    {
        id: 4,
        equipmentId: "EQ-004",
        equipmentName: "コンプレッサー2",
        equipmentType: "電気設備",
        locationName: "福岡支店",
        installationPlace: "2F事務所",
        manager: "渡辺 五郎",
        previousValue: 800,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "渡辺 五郎",
        currentValue: 950,
        confirmationDate: "2024-01-01",
        registrant: "小林 六郎",
        usage: 150
    },
    {
        id: 5,
        equipmentId: "EQ-005",
        equipmentName: "ポンプ2",
        equipmentType: "水道設備",
        locationName: "札幌支店",
        installationPlace: "給湯室",
        manager: "中村 七郎",
        previousValue: 400,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "中村 七郎",
        currentValue: 460,
        confirmationDate: "2024-01-01",
        registrant: "加藤 八郎",
        usage: 60
    },
    {
        id: 6,
        equipmentId: "EQ-006",
        equipmentName: "ボイラー2",
        equipmentType: "ガス設備",
        locationName: "仙台支店",
        installationPlace: "休憩室",
        manager: "山本 九郎",
        previousValue: 200,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "山本 九郎",
        currentValue: 240,
        confirmationDate: "2024-01-01",
        registrant: "佐々木 十郎",
        usage: 40
    },
    {
        id: 7,
        equipmentId: "EQ-007",
        equipmentName: "コンプレッサー3",
        equipmentType: "電気設備",
        locationName: "広島支店",
        installationPlace: "3F事務所",
        manager: "斎藤 春子",
        previousValue: 600,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "斎藤 春子",
        currentValue: 700,
        confirmationDate: "2024-01-01",
        registrant: "松本 夏子",
        usage: 100
    },
    {
        id: 8,
        equipmentId: "EQ-008",
        equipmentName: "ポンプ3",
        equipmentType: "水道設備",
        locationName: "横浜支店",
        installationPlace: "1F洗面所",
        manager: "井上 秋子",
        previousValue: 300,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "井上 秋子",
        currentValue: 350,
        confirmationDate: "2024-01-01",
        registrant: "木村 冬子",
        usage: 50
    },
    {
        id: 9,
        equipmentId: "EQ-009",
        equipmentName: "ボイラー3",
        equipmentType: "ガス設備",
        locationName: "神戸支店",
        installationPlace: "2F給湯室",
        manager: "林 正男",
        previousValue: 150,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "林 正男",
        currentValue: 180,
        confirmationDate: "2024-01-01",
        registrant: "山田 昭子",
        usage: 30
    },
    {
        id: 10,
        equipmentId: "EQ-010",
        equipmentName: "コンプレッサー4",
        equipmentType: "電気設備",
        locationName: "京都支店",
        installationPlace: "4F事務所",
        manager: "清水 勇",
        previousValue: 900,
        previousConfirmationDate: "2023-12-01",
        previousRegistrant: "清水 勇",
        currentValue: 1100,
        confirmationDate: "2024-01-01",
        registrant: "近藤 智子",
        usage: 200
    }
];

const {
    Box, Container, Paper, Grid, Button, Typography, FormControl, Select, MenuItem, TablePagination,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert,
    InputAdornment, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, IconButton, Tooltip
} = MaterialUI;

function IconWrapper({ children }) {
    return (
        <span className="material-icons" style={{ fontSize: '20px' }}>
            {children}
        </span>
    );
}

// TableMeterコンポーネントをMainContentの前に配置
function TableMeter({
    filteredMeters = window.initialMeters,
    selectedMeterIds = [],
    editStates = {},
    page = 0,
    rowsPerPage = 10,
    handleSelectAllClick = () => {},
    handleRowClick = () => {},
    handleCellValueChange = () => {},
    handleEditMeter = () => {},
    handleMenuClick = () => {},
    handleChangePage = () => {},
    handleChangeRowsPerPage = () => {},
    handleColumnFilterChange = () => {},
    onEditClick = () => {},
    showEditableFields = true, // 編集可能モードのデフォルトをtrueに設定
    isEquipmentList = false, // 設備一覧表示モード判定用
    isRecordList = false    // 設備メーター履歴表示モード判定用
}) {
    const [columnFilters, setColumnFilters] = React.useState({
        equipmentId: '',
        equipmentName: '',
        equipmentType: '',
        installationPlace: '',
        locationName: '',
        manager: '',
        usage: '',
        previousValue: '',
        previousConfirmationDate: '',
        previousRegistrant: '',
        currentValue: '',
        confirmationDate: '',
        registrant: ''
    });

    const handleFilterChange = (column, value) => {
        setColumnFilters(prev => ({
            ...prev,
            [column]: value
        }));
        handleColumnFilterChange(column, value);
    };

    const isSelected = (id) => selectedMeterIds.includes(id);

    // 月度の期間を生成（3月始まり14カ月）
    const periods = React.useMemo(() => {
        const months = [];
        const today = new Date();
        const startYear = today.getMonth() < 2 ? today.getFullYear() - 1 : today.getFullYear();
        
        for (let i = 0; i < 14; i++) {
            const month = (i + 2) % 12 + 1; // 3月から開始
            const year = startYear + Math.floor((i + 2) / 12);
            months.push(`${year}年${month}月`);
        }
        return months;
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
                <TableHead>
                    {/* フィルター行 */}
                    <TableRow>
                        <TableCell padding="checkbox" />
                        <TableCell />
                        {isEquipmentList ? (
                            // 設備一覧用のフィルター列
                            ['locationId', 'locationName', 'equipmentId', 'equipmentCategory', 
                             'equipmentName', 'installationPlace', 'managementOrg', 'manager',
                             'manufacturer', 'modelNumber', 'purchaseDate', 'purchaseCost',
                             'maintenanceContract', 'usageContract', 'status', 'nextMaintenanceDate',
                             'lastMaintenanceDate', 'maintenanceCycle', 'serviceLife',
                             'renewalDate', 'isActive', 'photo'].map(column => (
                                <TableCell key={`filter-${column}`} sx={{ whiteSpace: 'nowrap' }}>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        value={columnFilters[column] || ''}
                                        onChange={(e) => handleFilterChange(column, e.target.value)}
                                        placeholder="フィルター..."
                                        sx={{ marginBottom: 1 }}
                                    />
                                </TableCell>
                            ))
                        ) : isRecordList ? (
                            // 設備メーター履歴用のフィルター列
                            ['equipmentId', 'equipmentName', 'equipmentType', 'installationPlace', 
                             'locationName', 'manager', ...periods].map(column => (
                                <TableCell key={`filter-${column}`} sx={{ whiteSpace: 'nowrap' }}>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        value={columnFilters[column] || ''}
                                        onChange={(e) => handleFilterChange(column, e.target.value)}
                                        placeholder="フィルター..."
                                        sx={{ marginBottom: 1 }}
                                    />
                                </TableCell>
                            ))
                        ) : (
                            // 既存の設備情報入力用フィルター列
                            ['equipmentId', 'equipmentName', 'equipmentType', 'installationPlace', 
                             'locationName', 'manager', 'usage', 'previousValue', 'previousConfirmationDate',
                             'previousRegistrant', 'currentValue', 'confirmationDate', 'registrant'].map(column => (
                                <TableCell key={`filter-${column}`} sx={{ whiteSpace: 'nowrap' }}>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        value={columnFilters[column]}
                                        onChange={(e) => handleFilterChange(column, e.target.value)}
                                        placeholder="フィルター..."
                                        sx={{ marginBottom: 1 }}
                                    />
                                </TableCell>
                            ))
                        )}
                        <TableCell />
                    </TableRow>

                    {/* ヘッダー行 */}
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedMeterIds.length > 0 && selectedMeterIds.length < filteredMeters.length}
                                checked={filteredMeters.length > 0 && selectedMeterIds.length === filteredMeters.length}
                                onChange={handleSelectAllClick}
                            />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>No.</TableCell>
                        {isEquipmentList ? (
                            // 設備一覧用のヘッダー
                            <>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>拠点ID</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>拠点名</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備ID</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備カテゴリー</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備名</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設置場所</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>管理組織</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>担当者</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>メーカー</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>型番</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>購入日</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>購入費用</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>保守契約</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>利用契約</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>状態</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>メンテナンス予定日</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>メンテナンス前回実施日</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>メンテナンス周期（月）</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>耐用年数（月）</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>更新予定日</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>有効／無効</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>写真</TableCell>
                            </>
                        ) : isRecordList ? (
                            // 設備メーター履歴用のヘッダー
                            <>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備ID</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備名</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備タイプ</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設置場所</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>拠点名</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>管理者</TableCell>
                                {periods.map(period => (
                                    <TableCell key={period} sx={{ whiteSpace: 'nowrap' }}>{period}</TableCell>
                                ))}
                            </>
                        ) : (
                            // 既存の設備情報入力用ヘッダー
                            <>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備ID</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備名</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設備タイプ</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>設置場所</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>拠点名</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>管理者</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>利用量</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>前回メーター値</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>前回確認日</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>前回登録者</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>今回メーター値</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>今回確認日</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>今回登録者</TableCell>
                            </>
                        )}
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>操作</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {(rowsPerPage > 0
                        ? filteredMeters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : filteredMeters
                    ).map((meter, index) => {
                        const isItemSelected = isSelected(meter.id);
                        const editedMeter = editStates[meter.id] || {};
                        const currentValue = editedMeter.currentValue !== undefined ? editedMeter.currentValue : meter.currentValue;
                        const previousValue = editedMeter.previousValue !== undefined ? editedMeter.previousValue : meter.previousValue;
                        const usage = parseFloat(currentValue || 0) - parseFloat(previousValue || 0);

                        return (
                            <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={meter.id}
                                selected={isItemSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isItemSelected}
                                        onChange={(event) => handleRowClick(event, meter.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{page * rowsPerPage + index + 1}</TableCell>
                                {isEquipmentList ? (
                                    // 設備一覧用のデータ行
                                    <>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.locationId || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.locationName || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentId || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentCategory || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentName || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.installationPlace || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.managementOrg || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.manager || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.manufacturer || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.modelNumber || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.purchaseDate || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.purchaseCost || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.maintenanceContract || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.usageContract || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.status || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.nextMaintenanceDate || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.lastMaintenanceDate || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.maintenanceCycle || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.serviceLife || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.renewalDate || ''}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.isActive ? '有効' : '無効'}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {meter.photo && (
                                                <IconButton onClick={() => window.open(meter.photo, '_blank')}>
                                                    <span className="material-icons">image</span>
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </>
                                ) : isRecordList ? (
                                    // 設備メーター履歴用のデータ行
                                    <>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentId}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentName}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentType}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.installationPlace}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.locationName}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.manager}</TableCell>
                                        {periods.map(period => (
                                            <TableCell key={`${meter.id}-${period}`}>
                                                {meter.records?.[period] || ''}
                                            </TableCell>
                                        ))}
                                    </>
                                ) : (
                                    // 既存の設備情報入力用データ行
                                    <>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentId}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentName}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.equipmentType}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.installationPlace}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.locationName}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{meter.manager}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{usage}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {showEditableFields ? (
                                                <TextField
                                                    type="number"
                                                    value={previousValue || ''}
                                                    onChange={(e) => handleCellValueChange(meter.id, 'previousValue', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                meter.previousValue
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {showEditableFields ? (
                                                <TextField
                                                    type="date"
                                                    value={editedMeter.previousConfirmationDate || meter.previousConfirmationDate || ''}
                                                    onChange={(e) => handleCellValueChange(meter.id, 'previousConfirmationDate', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                meter.previousConfirmationDate
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {showEditableFields ? (
                                                <TextField
                                                    value={editedMeter.previousRegistrant || meter.previousRegistrant || ''}
                                                    onChange={(e) => handleCellValueChange(meter.id, 'previousRegistrant', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                meter.previousRegistrant
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {showEditableFields ? (
                                                <TextField
                                                    type="number"
                                                    value={currentValue || ''}
                                                    onChange={(e) => handleCellValueChange(meter.id, 'currentValue', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                meter.currentValue
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {showEditableFields ? (
                                                <TextField
                                                    type="date"
                                                    value={editedMeter.confirmationDate || meter.confirmationDate || ''}
                                                    onChange={(e) => handleCellValueChange(meter.id, 'confirmationDate', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                meter.confirmationDate
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {showEditableFields ? (
                                                <TextField
                                                    value={editedMeter.registrant || meter.registrant || ''}
                                                    onChange={(e) => handleCellValueChange(meter.id, 'registrant', e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                meter.registrant
                                            )}
                                        </TableCell>
                                    </>
                                )}
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    <IconButton onClick={(e) => {
                                        e.stopPropagation();
                                        onEditClick(meter);
                                    }}>
                                        <span className="material-icons">edit</span>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function MainContent() {
    // windowオブジェクトから初期データを取得
    const [meters, setMeters] = React.useState(() => {
        // 初期データが存在しない場合はサンプルデータを使用
        return window.initialMeters || [];
    });
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
    const [tabValue, setTabValue] = React.useState(0);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingMeter, setEditingMeter] = React.useState(null);
    const [mainTabValue, setMainTabValue] = React.useState(0); // メインタブの状態管理を追加

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

            // タブフィルター
            const isInputted = meter.currentValue && meter.confirmationDate;
            if (tabValue === 1) { // 未入力タブ
                return !isInputted && matchesSearch && matchesColumnFilters;
            } else if (tabValue === 2) { // 入力済タブ
                return isInputted && matchesSearch && matchesColumnFilters;
            }
            
            return matchesSearch && matchesColumnFilters; // 全てタブ
        });
    }, [meters, filterCriteria, columnFilters, tabValue]);

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
            '利用量', '前回メーター値', '前回確認日', '前回登録者', '今回メーター値',
            '今回確認日', '今回登録者'
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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0); // タブ切替時にページをリセット
    };

    const handleEditClick = (meter) => {
        setEditingMeter({ ...meter });
        setEditDialogOpen(true);
    };

    const handleEditSave = () => {
        if (!editingMeter) return;

        setMeters(meters.map(meter => 
            meter.id === editingMeter.id ? { ...meter, ...editingMeter } : meter
        ));
        setEditDialogOpen(false);
        setEditingMeter(null);
        setSnackbar({ open: true, message: '設備情報を更新しました', severity: 'success' });
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
                    height: '100%'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h5" component="h1">
                            設備管理
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            </Paper>

            {/* メインタブ */}
            <Paper elevation={3} sx={{ p: 2 }}>
                <Tabs
                    value={mainTabValue}
                    onChange={(event, newValue) => setMainTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
                >
                    <Tab label="設備一覧" />
                    <Tab label="設備情報入力" />
                    <Tab label="設備情報" />
                    <Tab label="設備メーター履歴" />
                </Tabs>

                {/* 設備一覧タブ */}
                {mainTabValue === 0 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>設備一覧</Typography>
                        {/* フィルター部分 */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextField
                                size="small"
                                placeholder="検索..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconWrapper>search</IconWrapper>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: 300 }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<IconWrapper>file_download</IconWrapper>}
                                onClick={handleExport}
                            >
                                エクスポート
                            </Button>
                        </Box>
                        {/* テーブル（設備一覧表示用にカスタマイズ） */}
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
                            onEditClick={handleEditClick}
                            showEditableFields={false} // 編集不可モード
                            isEquipmentList={true} // 設備一覧表示モードを有効化
                        />
                    </Box>
                )}

                {/* 設備情報入力タブ */}
                {mainTabValue === 1 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>設備情報入力</Typography>
                        {/* フィルター部分 */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextField
                                size="small"
                                placeholder="検索..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconWrapper>search</IconWrapper>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: 300 }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<IconWrapper>file_download</IconWrapper>}
                                onClick={handleExport}
                            >
                                エクスポート
                            </Button>
                        </Box>
                        {/* 入力状態を示すサブタブ */}
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                            <Tab label={`全て (${meters.length})`} />
                            <Tab label={`未入力 (${meters.filter(m => !(m.currentValue && m.confirmationDate)).length})`} />
                            <Tab label={`入力済 (${meters.filter(m => m.currentValue && m.confirmationDate).length})`} />
                        </Tabs>
                        {/* メーター値入力用テーブル */}
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
                            onEditClick={handleEditClick}
                            showEditableFields={true} // 編集可能モード
                        />
                    </Box>
                )}

                {/* 設備情報タブ */}
                {mainTabValue === 2 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>設備情報</Typography>
                        {/* 設備情報編集用のフォーム */}
                        <Grid container spacing={3}>
                            {filteredMeters.map((meter) => (
                                <Grid item xs={12} sm={6} md={4} key={meter.id}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {meter.equipmentName}
                                        </Typography>
                                        <Box sx={{ display: 'grid', gap: 1 }}>
                                            <TextField
                                                label="設備ID"
                                                value={meter.equipmentId}
                                                size="small"
                                                fullWidth
                                            />
                                            <TextField
                                                label="設置場所"
                                                value={meter.installationPlace}
                                                size="small"
                                                fullWidth
                                            />
                                            <TextField
                                                label="管理者"
                                                value={meter.manager}
                                                size="small"
                                                fullWidth
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* 設備メーター履歴タブ */}
                {mainTabValue === 3 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>設備メーター履歴</Typography>
                        {/* フィルター部分 */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextField
                                size="small"
                                placeholder="検索..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconWrapper>search</IconWrapper>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: 300 }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<IconWrapper>file_download</IconWrapper>}
                                onClick={handleExport}
                            >
                                エクスポート
                            </Button>
                        </Box>
                        {/* 設備記録テーブル */}
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
                            onEditClick={handleEditClick}
                            showEditableFields={true}
                            isRecordList={true}
                        />
                    </Box>
                )}

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

            {/* 編集ダイアログ */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>設備情報編集</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                        <TextField
                            label="設備ID"
                            required
                            value={editingMeter?.equipmentId || ''}
                            onChange={(e) => setEditingMeter({...editingMeter, equipmentId: e.target.value})}
                        />
                        <TextField
                            label="設備名"
                            required
                            value={editingMeter?.equipmentName || ''}
                            onChange={(e) => setEditingMeter({...editingMeter, equipmentName: e.target.value})}
                        />
                        <TextField
                            label="設備タイプ"
                            value={editingMeter?.equipmentType || ''}
                            onChange={(e) => setEditingMeter({...editingMeter, equipmentType: e.target.value})}
                        />
                        <TextField
                            label="設置場所"
                            value={editingMeter?.installationPlace || ''}
                            onChange={(e) => setEditingMeter({...editingMeter, installationPlace: e.target.value})}
                        />
                        <TextField
                            label="拠点名"
                            value={editingMeter?.locationName || ''}
                            onChange={(e) => setEditingMeter({...editingMeter, locationName: e.target.value})}
                        />
                        <TextField
                            label="管理者"
                            value={editingMeter?.manager || ''}
                            onChange={(e) => setEditingMeter({...editingMeter, manager: e.target.value})}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
                    <Button onClick={handleEditSave} variant="contained" color="primary">
                        保存
                    </Button>
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

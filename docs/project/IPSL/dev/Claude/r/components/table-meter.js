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
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, IconButton, TextField, Tooltip, TablePagination
} = MaterialUI;

function TableMeter({
    filteredMeters = window.initialMeters,  // デフォルト値を初期データに変更
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
    handleColumnFilterChange = () => {},  // 列フィルター用のハンドラーを追加
    onEditClick = () => {}  // onEditClickを追加
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

    return (
        <TableContainer component={Paper}>
            <Table
                size="small"
                stickyHeader
                sx={{
                    '& .MuiTableCell-root': {
                        whiteSpace: 'nowrap'
                    }
                }}
            >
                <TableHead>
                    {/* フィルター行 */}
                    <TableRow>
                        <TableCell padding="checkbox" />
                        <TableCell />  {/* No.列 */}
                        {/* フィルター入力フィールド */}
                        {['equipmentId', 'equipmentName', 'equipmentType', 'installationPlace', 
                          'locationName', 'manager', 'usage', 'previousValue', 'previousConfirmationDate',
                          'previousRegistrant', 'currentValue', 'confirmationDate', 'registrant'].map(column => (
                            <TableCell key={`filter-${column}`}>
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
                        ))}
                        <TableCell /> {/* 操作列 */}
                    </TableRow>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedMeterIds.length > 0 && selectedMeterIds.length < filteredMeters.length}
                                checked={filteredMeters.length > 0 && selectedMeterIds.length === filteredMeters.length}
                                onChange={handleSelectAllClick}
                                color="primary"
                            />
                        </TableCell>
                        <TableCell>No.</TableCell>
                        <TableCell>設備ID</TableCell>
                        <TableCell>設備名</TableCell>
                        <TableCell>設備タイプ</TableCell>
                        <TableCell>設置場所</TableCell>
                        <TableCell>拠点名</TableCell>
                        <TableCell>管理者</TableCell>
                        <TableCell>利用量</TableCell>
                        <TableCell>前回メーター値</TableCell>
                        <TableCell>前回確認日</TableCell>
                        <TableCell>前回登録者</TableCell>
                        <TableCell>メーター値</TableCell>
                        <TableCell>確認日</TableCell>
                        <TableCell>登録者</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? filteredMeters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : filteredMeters
                    ).map((meter, index) => {
                        const isItemSelected = isSelected(meter.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        const editedMeter = editStates[meter.id] || {};
                        const currentValue = editedMeter.currentValue !== undefined ? parseFloat(editedMeter.currentValue) : parseFloat(meter.currentValue);
                        const previousValue = editedMeter.previousValue !== undefined ? parseFloat(editedMeter.previousValue) : parseFloat(meter.previousValue);
                        const usage = currentValue - previousValue; // メーター値から前回値を引く

                        return (
                            <TableRow 
                                key={meter.id} 
                                hover 
                                role="checkbox"
                                aria-checked={isItemSelected}
                                selected={isItemSelected}
                                onClick={() => handleRowClick(null, meter.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Checkbox cell */}
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isItemSelected}
                                        onChange={(event) => handleRowClick(event, meter.id)}
                                        color="primary"
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </TableCell>
                                
                                {/* Static cells */}
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{meter.equipmentId}</TableCell>
                                <TableCell>{meter.equipmentName}</TableCell>
                                <TableCell>{meter.equipmentType}</TableCell>
                                <TableCell>{meter.installationPlace}</TableCell>
                                <TableCell>{meter.locationName}</TableCell>
                                <TableCell>{meter.manager}</TableCell>
                                <TableCell>{usage}</TableCell>

                                {/* Editable cells */}
                                {['previousValue', 'previousConfirmationDate', 'previousRegistrant', 'currentValue', 'confirmationDate', 'registrant'].map(field => {
                                    const hasEdit = editStates[meter.id] && field in editStates[meter.id];
                                    const cellValue = hasEdit ? editStates[meter.id][field] : meter[field];
                                    const isChanged = hasEdit;

                                    return (
                                        <TableCell key={field} className={isChanged ? 'changed-cell' : ''}>
                                            <Tooltip title={isChanged ? `元の値: ${meter[field]}` : ''}>
                                                {field.includes('Date') ? (
                                                    <TextField
                                                        type="date"
                                                        value={cellValue}
                                                        onChange={(e) => handleCellValueChange(meter.id, field, e.target.value)}
                                                        className="editable-input"
                                                        InputLabelProps={{ shrink: true }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <TextField
                                                        type={field.includes('Value') ? 'number' : 'text'}
                                                        value={cellValue}
                                                        onChange={(e) => handleCellValueChange(meter.id, field, e.target.value)}
                                                        className="editable-input"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                    );
                                })}

                                {/* Action cell */}
                                <TableCell>
                                    <IconButton onClick={(e) => { 
                                        e.stopPropagation(); 
                                        onEditClick(meter);  // handleEditMeterをonEditClickに変更
                                    }}>
                                        <span className="material-icons">edit</span>
                                    </IconButton>
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleMenuClick(e, meter); }}>
                                        <span className="material-icons">more_vert</span>
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

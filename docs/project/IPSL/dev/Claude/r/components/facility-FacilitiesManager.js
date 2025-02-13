// components/FacilitiesManager.js
const {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} = MaterialUI;
const { useState } = React;

// 設備種別（カテゴリ）の定義（追加：レジ・売場、冷凍設備の表示を変更）
const FACILITY_TYPES = {
  workspace: '作業場・保管施設',
  parking: '駐車・駐輪設備',
  elevator: 'エレベーター・エスカレーター',
  climate: '空調・換気・照明',
  sales: '販売・サービス設備',
  employee: '従業員関連設備',
  refrigeration: '冷凍設備',      // 表示ラベル変更
  cash_register: 'レジ',         // 新規追加
  sales_floor: '売場',           // 新規追加
};

// 各設備種別ごとに、詳細項目の定義（表示ラベルとキー）
const DETAILS_FIELDS = {
  workspace: [
    { key: 'floor_material', label: '床材' },
    { key: 'equipment', label: '設備（カンマ区切り）' },
    { key: 'drainage', label: '排水' },
  ],
  parking: [
    { key: 'disabled_spots', label: '障害者用台数' },
    { key: 'bicycle_spots', label: '自転車台数' },
    { key: 'motorcycle_spots', label: '原付台数' },
    { key: 'charge', label: '料金' },
  ],
  elevator: [
    { key: 'manufacturer', label: 'メーカー' },
    { key: 'units', label: 'ユニット数' },
    { key: 'capacity', label: '定員/容量' },
    { key: 'remote_monitoring', label: '遠隔監視 (true/false)' },
    { key: 'new_law_compliant', label: '新法対応 (true/false)' },
  ],
  climate: [
    { key: 'manufacturer', label: 'メーカー' },
    { key: 'type', label: 'タイプ' },
    { key: 'ventilation', label: '換気' },
  ],
  sales: [
    { key: 'regular', label: 'レギュラー台数' },
    { key: 'express', label: 'エクスプレス台数' },
    { key: 'self', label: 'セルフ台数' },
    { key: 'payment_methods', label: '支払方法（カンマ区切り）' },
    { key: 'point_system', label: 'ポイントシステム (true/false)' },
  ],
  employee: [
    { key: 'seating', label: '座席数' },
    { key: 'tables', label: 'テーブル数' },
    { key: 'amenities', label: '設備（カンマ区切り）' },
  ],
  refrigeration: [
    { key: 'manufacturer', label: 'メーカー' },
    { key: 'units', label: '台数' },
    { key: 'height', label: '高さ' },
    { key: 'lighting', label: '照明' },
    { key: 'temperature', label: '温度' },
  ],
  cash_register: [
    { key: 'num_registers', label: '台数' },
    { key: 'payment_methods', label: '支払方法（カンマ区切り）' },
    { key: 'self_service', label: 'セルフレジ (true/false)' },
  ],
  sales_floor: [
    { key: 'area', label: '面積' },
    { key: 'shelves', label: '棚数' },
  ],
};

// 選択された設備種別に応じた詳細項目の初期値を返す
function getDefaultDetails(facilityType) {
  if (!DETAILS_FIELDS[facilityType]) return {};
  const details = {};
  DETAILS_FIELDS[facilityType].forEach(field => {
    details[field.key] = "";
  });
  return details;
}

function FacilitiesManager() {
  // サンプルデータ（details は JSON文字列）
  const [facilities, setFacilities] = useState([
    {
      facility_id: 1,
      store_id: 1,
      facility_type: "workspace",
      facility_name: "青果作業場",
      location_info: "1F青果コーナー奥",
      capacity_or_size: "20㎡",
      details: JSON.stringify({
        floor_material: "塩ビシート",
        equipment: "まな板殺菌庫, 野菜洗浄機",
        drainage: "床排水あり"
      }),
      created_at: "2023-03-01T09:00:00",
      updated_at: "2023-03-01T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 2,
      store_id: 1,
      facility_type: "parking",
      facility_name: "立体駐車場",
      location_info: "店舗屋上",
      capacity_or_size: "150台",
      details: JSON.stringify({
        disabled_spots: "5",
        bicycle_spots: "100",
        motorcycle_spots: "20",
        charge: "無料"
      }),
      created_at: "2023-03-02T09:00:00",
      updated_at: "2023-03-02T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 3,
      store_id: 1,
      facility_type: "elevator",
      facility_name: "お客様用エレベーター",
      location_info: "正面入口横",
      capacity_or_size: "17人乗り",
      details: JSON.stringify({
        manufacturer: "日立",
        units: "2",
        capacity: "1150kg",
        remote_monitoring: "true",
        new_law_compliant: "true"
      }),
      created_at: "2023-03-03T09:00:00",
      updated_at: "2023-03-03T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 4,
      store_id: 1,
      facility_type: "refrigeration",
      facility_name: "青果用冷凍ケース",
      location_info: "1F青果売場",
      capacity_or_size: "12m",
      details: JSON.stringify({
        manufacturer: "福島工業",
        units: "4",
        height: "1800mm",
        lighting: "LED",
        temperature: "5℃"
      }),
      created_at: "2023-03-04T09:00:00",
      updated_at: "2023-03-04T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 5,
      store_id: 1,
      facility_type: "sales",
      facility_name: "レジ・売場兼用設備",
      location_info: "1F正面出口付近",
      capacity_or_size: "10台",
      details: JSON.stringify({
        regular: "6",
        express: "2",
        self: "2",
        payment_methods: "現金, クレジット, 電子マネー",
        point_system: "true"
      }),
      created_at: "2023-03-05T09:00:00",
      updated_at: "2023-03-05T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 6,
      store_id: 1,
      facility_type: "climate",
      facility_name: "中央空調",
      location_info: "2F事務所",
      capacity_or_size: "5kW",
      details: JSON.stringify({
        manufacturer: "ダイキン",
        type: "セントラル空調",
        ventilation: "良好"
      }),
      created_at: "2023-03-06T09:00:00",
      updated_at: "2023-03-06T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 7,
      store_id: 1,
      facility_type: "employee",
      facility_name: "従業員休憩室",
      location_info: "地下1階",
      capacity_or_size: "30人収容",
      details: JSON.stringify({
        seating: "20",
        tables: "5",
        amenities: "冷蔵庫, 電子レンジ, コーヒーメーカー"
      }),
      created_at: "2023-03-07T09:00:00",
      updated_at: "2023-03-07T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 8,
      store_id: 1,
      facility_type: "cash_register",
      facility_name: "レジ設備",
      location_info: "1F正面出口",
      capacity_or_size: "8台",
      details: JSON.stringify({
        num_registers: "8",
        payment_methods: "現金, クレジット",
        self_service: "false"
      }),
      created_at: "2023-03-08T09:00:00",
      updated_at: "2023-03-08T09:00:00",
      created_by: 1,
      updated_by: 1
    },
    {
      facility_id: 9,
      store_id: 1,
      facility_type: "sales_floor",
      facility_name: "売場エリア",
      location_info: "1F売場",
      capacity_or_size: "200㎡",
      details: JSON.stringify({
        area: "200㎡",
        shelves: "15"
      }),
      created_at: "2023-03-09T09:00:00",
      updated_at: "2023-03-09T09:00:00",
      created_by: 1,
      updated_by: 1
    }
  ]);

  // JSON文字列の詳細情報を整形（ツールチップ用）
  const formatDetails = (details) => {
    try {
      const parsed = JSON.parse(details);
      return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    } catch (e) {
      return details;
    }
  };

  // 新規追加／編集ダイアログ用の状態
  const [openDialog, setOpenDialog] = useState(false);
  const [newFacility, setNewFacility] = useState({
    store_id: "",
    facility_type: "",
    facility_name: "",
    location_info: "",
    capacity_or_size: "",
    details: {},
    created_by: 1,
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [facilityToEdit, setFacilityToEdit] = useState(null);

  // ページネーション用の状態
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 設備種別フィルター（Chips）【複数選択可能】
  const [selectedFilters, setSelectedFilters] = useState([]);

  // JSON項目による追加フィルター（※選択されている設備種別が1件のみの場合のみ表示）
  const [selectedDetailField, setSelectedDetailField] = useState("");
  const [detailFieldFilterValue, setDetailFieldFilterValue] = useState("");

  // まず、設備種別フィルターに基づく絞り込み
  let filteredFacilities = selectedFilters.length > 0
    ? facilities.filter((f) => selectedFilters.includes(f.facility_type))
    : facilities;

  // さらに、選択中の設備種別が1件のみかつ、JSON項目フィルターが設定されていれば、その項目の値でフィルタリング
  if (selectedFilters.length === 1 && selectedDetailField && detailFieldFilterValue) {
    filteredFacilities = filteredFacilities.filter((f) => {
      try {
        const details = JSON.parse(f.details);
        return String(details[selectedDetailField] || "")
          .toLowerCase()
          .includes(detailFieldFilterValue.toLowerCase());
      } catch (e) {
        return false;
      }
    });
  }

  // ページネーション用のデータ
  const paginatedFacilities =
    rowsPerPage === -1
      ? filteredFacilities
      : filteredFacilities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ページ変更イベント
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 表示件数変更イベント
  const handleChangeRowsPerPage = (event) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(0);
  };

  // 新規追加処理
  const handleAddFacility = () => {
    const newId = facilities.length > 0 ? Math.max(...facilities.map((f) => f.facility_id)) + 1 : 1;
    const now = new Date().toISOString();
    const facility = {
      ...newFacility,
      facility_id: newId,
      details: JSON.stringify(newFacility.details),
      created_at: now,
      updated_at: now,
      updated_by: 1,
    };
    setFacilities([...facilities, facility]);
    setOpenDialog(false);
    setNewFacility({
      store_id: "",
      facility_type: "",
      facility_name: "",
      location_info: "",
      capacity_or_size: "",
      details: {},
      created_by: 1,
    });
  };

  // 削除処理
  const handleDelete = (facility_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setFacilities(facilities.filter((f) => f.facility_id !== facility_id));
    }
  };

  // 編集開始処理
  const handleEdit = (facility) => {
    try {
      setFacilityToEdit({
        ...facility,
        details: JSON.parse(facility.details),
      });
    } catch (e) {
      setFacilityToEdit({ ...facility, details: {} });
    }
    setOpenEditDialog(true);
  };

  // 編集更新処理
  const handleUpdateFacility = () => {
    const now = new Date().toISOString();
    const updatedFacility = {
      ...facilityToEdit,
      details: JSON.stringify(facilityToEdit.details),
      updated_at: now,
      updated_by: 1,
    };
    setFacilities(facilities.map(f =>
      f.facility_id === updatedFacility.facility_id ? updatedFacility : f
    ));
    setOpenEditDialog(false);
    setFacilityToEdit(null);
  };

  // ヘッダー部分のレイアウト調整（余計な余白が出ないように）
  return (
    <Box p={2}>
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">設備管理</Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            新規追加
          </Button>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>設備種別フィルター:</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {Object.entries(FACILITY_TYPES).map(([value, label]) => (
              <Chip
                key={value}
                label={label}
                clickable
                size="small"
                color={selectedFilters.includes(value) ? "primary" : "default"}
                onClick={() => {
                  if (selectedFilters.includes(value)) {
                    setSelectedFilters(selectedFilters.filter((v) => v !== value));
                    setSelectedDetailField("");
                    setDetailFieldFilterValue("");
                  } else {
                    setSelectedFilters([...selectedFilters, value]);
                  }
                }}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* JSON項目フィルター：選択されている設備種別が1件の場合のみ表示 */}
      {selectedFilters.length === 1 && (
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <Typography variant="subtitle2">JSON項目フィルター:</Typography>
          <TextField
            select
            label="項目選択"
            value={selectedDetailField}
            onChange={(e) => setSelectedDetailField(e.target.value)}
            size="small"
          >
            {DETAILS_FIELDS[selectedFilters[0]].map((field) => (
              <MenuItem key={field.key} value={field.key}>
                {field.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="値でフィルター"
            value={detailFieldFilterValue}
            onChange={(e) => setDetailFieldFilterValue(e.target.value)}
            size="small"
          />
        </Box>
      )}

      {/* テーブル */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>設備種別</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>設備名</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>設置場所</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>容量/サイズ</TableCell>
              {selectedFilters.length === 1 ? (
                // 選択されている設備種別が1件の場合、詳細項目（JSONの各キー）を列として展開
                DETAILS_FIELDS[selectedFilters[0]].map((field) => (
                  <TableCell key={field.key} sx={{ whiteSpace: 'nowrap' }}>
                    {field.label}
                  </TableCell>
                ))
              ) : (
                <TableCell sx={{ whiteSpace: 'nowrap' }}>備考</TableCell>
              )}
              <TableCell sx={{ whiteSpace: 'nowrap' }}>作成日</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFacilities.map((facility) => (
              <TableRow key={facility.facility_id} sx={{ "&:hover": { backgroundColor: "grey.100" } }}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.facility_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{FACILITY_TYPES[facility.facility_type]}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.facility_name}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.location_info}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.capacity_or_size}</TableCell>
                {selectedFilters.length === 1 ? (
                  // JSON項目を各列に展開（※対象の設備種別に対応したDETAILS_FIELDS順に表示）
                  DETAILS_FIELDS[selectedFilters[0]].map((field) => {
                    let value = "";
                    try {
                      const detailsObj = JSON.parse(facility.details);
                      value = detailsObj[field.key] || "";
                    } catch (e) {
                      value = facility.details;
                    }
                    return (
                      <TableCell key={field.key} sx={{ whiteSpace: 'nowrap' }}>
                        {String(value)}
                      </TableCell>
                    );
                  })
                ) : (
                  <TableCell>
                    <Tooltip title={<pre style={{ whiteSpace: 'pre-wrap' }}>{formatDetails(facility.details)}</pre>}>
                      <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formatDetails(facility.details)}
                      </Box>
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {new Date(facility.created_at).toLocaleString('ja-JP')}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Button size="small" color="primary" onClick={() => handleEdit(facility)}>編集</Button>
                  <Button size="small" color="secondary" onClick={() => handleDelete(facility.facility_id)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* ページネーション */}
        <TablePagination
          component="div"
          count={filteredFacilities.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage === -1 ? filteredFacilities.length : rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 30, { label: '全て', value: -1 }]}
          labelRowsPerPage="表示件数："
        />
      </TableContainer>

      {/* 新規追加ダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>新規設備登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newFacility.store_id}
            onChange={(e) => setNewFacility({ ...newFacility, store_id: e.target.value })}
          />
          <TextField
            select
            label="設備種別"
            fullWidth
            margin="dense"
            value={newFacility.facility_type}
            onChange={(e) => {
              const newType = e.target.value;
              setNewFacility({
                ...newFacility,
                facility_type: newType,
                details: getDefaultDetails(newType)
              });
            }}
          >
            {Object.entries(FACILITY_TYPES).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="設備名"
            fullWidth
            margin="dense"
            value={newFacility.facility_name}
            onChange={(e) => setNewFacility({ ...newFacility, facility_name: e.target.value })}
          />
          <TextField
            label="設置場所"
            fullWidth
            margin="dense"
            value={newFacility.location_info}
            onChange={(e) => setNewFacility({ ...newFacility, location_info: e.target.value })}
          />
          <TextField
            label="容量/サイズ"
            fullWidth
            margin="dense"
            value={newFacility.capacity_or_size}
            onChange={(e) => setNewFacility({ ...newFacility, capacity_or_size: e.target.value })}
          />
          {/* 設備種別に合わせた詳細項目 */}
          {newFacility.facility_type ? (
            <Box mt={2}>
              <Typography variant="subtitle1">詳細項目</Typography>
              {DETAILS_FIELDS[newFacility.facility_type].map((field) => (
                <TextField
                  key={field.key}
                  label={field.label}
                  fullWidth
                  margin="dense"
                  value={newFacility.details[field.key] || ""}
                  onChange={(e) =>
                    setNewFacility({
                      ...newFacility,
                      details: { ...newFacility.details, [field.key]: e.target.value },
                    })
                  }
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary" mt={2}>
              設備種別を選択すると、詳細項目が入力可能になります
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddFacility}>登録</Button>
        </DialogActions>
      </Dialog>

      {/* 編集ダイアログ */}
      {facilityToEdit && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>設備編集</DialogTitle>
          <DialogContent>
            <TextField
              label="店舗ID"
              fullWidth
              margin="dense"
              value={facilityToEdit.store_id}
              onChange={(e) => setFacilityToEdit({ ...facilityToEdit, store_id: e.target.value })}
            />
            <TextField
              select
              label="設備種別"
              fullWidth
              margin="dense"
              value={facilityToEdit.facility_type}
              onChange={(e) => {
                const newType = e.target.value;
                setFacilityToEdit({
                  ...facilityToEdit,
                  facility_type: newType,
                  details: getDefaultDetails(newType)
                });
              }}
            >
              {Object.entries(FACILITY_TYPES).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="設備名"
              fullWidth
              margin="dense"
              value={facilityToEdit.facility_name}
              onChange={(e) => setFacilityToEdit({ ...facilityToEdit, facility_name: e.target.value })}
            />
            <TextField
              label="設置場所"
              fullWidth
              margin="dense"
              value={facilityToEdit.location_info}
              onChange={(e) => setFacilityToEdit({ ...facilityToEdit, location_info: e.target.value })}
            />
            <TextField
              label="容量/サイズ"
              fullWidth
              margin="dense"
              value={facilityToEdit.capacity_or_size}
              onChange={(e) => setFacilityToEdit({ ...facilityToEdit, capacity_or_size: e.target.value })}
            />
            {/* 設備種別に合わせた詳細項目 */}
            {facilityToEdit.facility_type ? (
              <Box mt={2}>
                <Typography variant="subtitle1">詳細項目</Typography>
                {DETAILS_FIELDS[facilityToEdit.facility_type].map((field) => (
                  <TextField
                    key={field.key}
                    label={field.label}
                    fullWidth
                    margin="dense"
                    value={facilityToEdit.details[field.key] || ""}
                    onChange={(e) =>
                      setFacilityToEdit({
                        ...facilityToEdit,
                        details: { ...facilityToEdit.details, [field.key]: e.target.value },
                      })
                    }
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" mt={2}>
                設備種別を選択すると、詳細項目が入力可能になります
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>キャンセル</Button>
            <Button variant="contained" onClick={handleUpdateFacility}>更新</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

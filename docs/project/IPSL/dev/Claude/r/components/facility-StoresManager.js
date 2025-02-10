// components/StoresManager.js
const {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  Checkbox,
  FormControlLabel,
  TablePagination,
} = MaterialUI;
const { useState } = React;

function StoresManager() {
  // サンプルデータ：10件
  const [stores, setStores] = useState([
    {
      store_id: 1,
      store_code: "STORE001",
      store_name: "店舗1",
      building_type: "RC造",
      land_type: "都市計画区域内",
      year_built: "2001",
      year_renovation: "",
      constructor_name: "建設会社1",
      architect_name: "設計者1",
      structure_type: "RC造",
      land_use_zone: "商業地域",
      location_regulation: "届出済み",
      old_heart_building_law: true,
      barrier_free_law: false,
      universal_design: true,
      submit_date: "2023-01-01",
      created_at: "2023-01-01T12:00:00",
      updated_at: "2023-01-01T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 2,
      store_code: "STORE002",
      store_name: "店舗2",
      building_type: "鉄骨造",
      land_type: "市街化調整区域",
      year_built: "2002",
      year_renovation: "2006",
      constructor_name: "建設会社2",
      architect_name: "設計者2",
      structure_type: "鉄骨造",
      land_use_zone: "準工業地域",
      location_regulation: "準届出",
      old_heart_building_law: false,
      barrier_free_law: true,
      universal_design: false,
      submit_date: "2023-01-02",
      created_at: "2023-01-02T12:00:00",
      updated_at: "2023-01-02T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 3,
      store_code: "STORE003",
      store_name: "店舗3",
      building_type: "RC造",
      land_type: "都市計画区域内",
      year_built: "2003",
      year_renovation: "",
      constructor_name: "建設会社3",
      architect_name: "設計者3",
      structure_type: "RC造",
      land_use_zone: "商業地域",
      location_regulation: "届出済み",
      old_heart_building_law: true,
      barrier_free_law: false,
      universal_design: true,
      submit_date: "2023-01-03",
      created_at: "2023-01-03T12:00:00",
      updated_at: "2023-01-03T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 4,
      store_code: "STORE004",
      store_name: "店舗4",
      building_type: "鉄骨造",
      land_type: "市街化調整区域",
      year_built: "2004",
      year_renovation: "2008",
      constructor_name: "建設会社1",
      architect_name: "設計者1",
      structure_type: "鉄骨造",
      land_use_zone: "準工業地域",
      location_regulation: "準届出",
      old_heart_building_law: false,
      barrier_free_law: true,
      universal_design: false,
      submit_date: "2023-01-04",
      created_at: "2023-01-04T12:00:00",
      updated_at: "2023-01-04T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 5,
      store_code: "STORE005",
      store_name: "店舗5",
      building_type: "RC造",
      land_type: "都市計画区域内",
      year_built: "2005",
      year_renovation: "",
      constructor_name: "建設会社2",
      architect_name: "設計者2",
      structure_type: "RC造",
      land_use_zone: "商業地域",
      location_regulation: "届出済み",
      old_heart_building_law: true,
      barrier_free_law: false,
      universal_design: true,
      submit_date: "2023-01-05",
      created_at: "2023-01-05T12:00:00",
      updated_at: "2023-01-05T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 6,
      store_code: "STORE006",
      store_name: "店舗6",
      building_type: "鉄骨造",
      land_type: "市街化調整区域",
      year_built: "2006",
      year_renovation: "2010",
      constructor_name: "建設会社3",
      architect_name: "設計者3",
      structure_type: "鉄骨造",
      land_use_zone: "準工業地域",
      location_regulation: "準届出",
      old_heart_building_law: false,
      barrier_free_law: true,
      universal_design: false,
      submit_date: "2023-01-06",
      created_at: "2023-01-06T12:00:00",
      updated_at: "2023-01-06T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 7,
      store_code: "STORE007",
      store_name: "店舗7",
      building_type: "RC造",
      land_type: "都市計画区域内",
      year_built: "2007",
      year_renovation: "",
      constructor_name: "建設会社1",
      architect_name: "設計者1",
      structure_type: "RC造",
      land_use_zone: "商業地域",
      location_regulation: "届出済み",
      old_heart_building_law: true,
      barrier_free_law: false,
      universal_design: true,
      submit_date: "2023-01-07",
      created_at: "2023-01-07T12:00:00",
      updated_at: "2023-01-07T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 8,
      store_code: "STORE008",
      store_name: "店舗8",
      building_type: "鉄骨造",
      land_type: "市街化調整区域",
      year_built: "2008",
      year_renovation: "2012",
      constructor_name: "建設会社2",
      architect_name: "設計者2",
      structure_type: "鉄骨造",
      land_use_zone: "準工業地域",
      location_regulation: "準届出",
      old_heart_building_law: false,
      barrier_free_law: true,
      universal_design: false,
      submit_date: "2023-01-08",
      created_at: "2023-01-08T12:00:00",
      updated_at: "2023-01-08T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 9,
      store_code: "STORE009",
      store_name: "店舗9",
      building_type: "RC造",
      land_type: "都市計画区域内",
      year_built: "2009",
      year_renovation: "",
      constructor_name: "建設会社3",
      architect_name: "設計者3",
      structure_type: "RC造",
      land_use_zone: "商業地域",
      location_regulation: "届出済み",
      old_heart_building_law: true,
      barrier_free_law: false,
      universal_design: true,
      submit_date: "2023-01-09",
      created_at: "2023-01-09T12:00:00",
      updated_at: "2023-01-09T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      store_id: 10,
      store_code: "STORE010",
      store_name: "店舗10",
      building_type: "鉄骨造",
      land_type: "市街化調整区域",
      year_built: "2010",
      year_renovation: "2014",
      constructor_name: "建設会社1",
      architect_name: "設計者1",
      structure_type: "鉄骨造",
      land_use_zone: "準工業地域",
      location_regulation: "準届出",
      old_heart_building_law: false,
      barrier_free_law: true,
      universal_design: false,
      submit_date: "2023-01-10",
      created_at: "2023-01-10T12:00:00",
      updated_at: "2023-01-10T12:00:00",
      created_by: 1,
      updated_by: 1,
    },
  ]);

  // ページネーション用の状態
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20); // デフォルトは20件

  // 新規追加ダイアログの表示制御
  const [openDialog, setOpenDialog] = useState(false);
  // 編集ダイアログの表示制御と編集対象の店舗情報
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editStore, setEditStore] = useState(null);

  // 新規店舗登録用の情報
  const [newStore, setNewStore] = useState({
    store_code: "",
    store_name: "",
    building_type: "",
    land_type: "",
    year_built: "",
    year_renovation: "",
    constructor_name: "",
    architect_name: "",
    structure_type: "",
    land_use_zone: "",
    location_regulation: "",
    submit_date: "",
    old_heart_building_law: false,
    barrier_free_law: false,
    universal_design: false,
  });

  // ページネーション用ハンドラ
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // 表示する店舗リスト（rowsPerPage が -1 の場合は全件表示）
  const displayedStores =
    rowsPerPage > 0 ? stores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stores;

  // 新規店舗登録処理
  const handleAddStore = () => {
    const newId = stores.length > 0 ? Math.max(...stores.map((s) => s.store_id)) + 1 : 1;
    const now = new Date().toISOString();
    const store = {
      ...newStore,
      store_id: newId,
      created_at: now,
      updated_at: now,
      created_by: 1, // 仮の登録者ID
      updated_by: 1,
    };
    setStores([...stores, store]);
    setOpenDialog(false);
    setNewStore({
      store_code: "",
      store_name: "",
      building_type: "",
      land_type: "",
      year_built: "",
      year_renovation: "",
      constructor_name: "",
      architect_name: "",
      structure_type: "",
      land_use_zone: "",
      location_regulation: "",
      submit_date: "",
      old_heart_building_law: false,
      barrier_free_law: false,
      universal_design: false,
    });
  };

  // 編集開始処理（行クリックまたは編集ボタン）
  const handleEditClick = (store) => {
    setEditStore({ ...store });
    setOpenEditDialog(true);
  };

  // 編集保存処理
  const handleSaveEdit = () => {
    const now = new Date().toISOString();
    setStores(
      stores.map((s) =>
        s.store_id === editStore.store_id ? { ...editStore, updated_at: now } : s
      )
    );
    setOpenEditDialog(false);
    setEditStore(null);
  };

  // 削除処理
  const handleDelete = (store_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setStores(stores.filter((s) => s.store_id !== store_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">店舗管理</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          新規追加
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗コード</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗名</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>建物区分</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>土地区分</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>建築年</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>大改装年</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>建設業者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>設計者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>構造種別</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>用途地域</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>立地法届出、準立地法</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>旧ハートビル法対応有無</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>現バリアフリー新法対応有無</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>ユニバーサルデザイン対応有無</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>提出日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>作成日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>登録者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedStores.map((store) => (
              <TableRow
                key={store.store_id}
                sx={{
                  "&:hover": { backgroundColor: "action.hover", cursor: "pointer" },
                }}
                onClick={() => handleEditClick(store)}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.store_code}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.store_name}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.building_type}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.land_type}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.year_built}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.year_renovation || "-"}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.constructor_name}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.architect_name}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.structure_type}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.land_use_zone}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.location_regulation}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {store.old_heart_building_law ? "はい" : "いいえ"}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {store.barrier_free_law ? "はい" : "いいえ"}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {store.universal_design ? "はい" : "いいえ"}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.submit_date}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.created_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.updated_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.created_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{store.updated_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(store);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(store.store_id);
                    }}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
                colSpan={21}
                component="div"
                count={stores.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 30, { label: "全て", value: -1 }]}
                labelRowsPerPage="表示件数:"
        />
      </TableContainer>

      {/* 新規追加ダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>新規店舗登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗コード"
            fullWidth
            margin="dense"
            value={newStore.store_code}
            onChange={(e) =>
              setNewStore({ ...newStore, store_code: e.target.value })
            }
          />
          <TextField
            label="店舗名"
            fullWidth
            margin="dense"
            value={newStore.store_name}
            onChange={(e) =>
              setNewStore({ ...newStore, store_name: e.target.value })
            }
          />
          <TextField
            label="建物区分"
            fullWidth
            margin="dense"
            value={newStore.building_type}
            onChange={(e) =>
              setNewStore({ ...newStore, building_type: e.target.value })
            }
          />
          <TextField
            label="土地区分"
            fullWidth
            margin="dense"
            value={newStore.land_type}
            onChange={(e) =>
              setNewStore({ ...newStore, land_type: e.target.value })
            }
          />
          <TextField
            label="建築年"
            fullWidth
            margin="dense"
            value={newStore.year_built}
            onChange={(e) =>
              setNewStore({ ...newStore, year_built: e.target.value })
            }
            type="number"
          />
          <TextField
            label="大改装年"
            fullWidth
            margin="dense"
            value={newStore.year_renovation}
            onChange={(e) =>
              setNewStore({ ...newStore, year_renovation: e.target.value })
            }
            type="number"
          />
          <TextField
            label="建設業者"
            fullWidth
            margin="dense"
            value={newStore.constructor_name}
            onChange={(e) =>
              setNewStore({ ...newStore, constructor_name: e.target.value })
            }
          />
          <TextField
            label="設計者"
            fullWidth
            margin="dense"
            value={newStore.architect_name}
            onChange={(e) =>
              setNewStore({ ...newStore, architect_name: e.target.value })
            }
          />
          <TextField
            label="構造種別"
            fullWidth
            margin="dense"
            value={newStore.structure_type}
            onChange={(e) =>
              setNewStore({ ...newStore, structure_type: e.target.value })
            }
          />
          <TextField
            label="用途地域"
            fullWidth
            margin="dense"
            value={newStore.land_use_zone}
            onChange={(e) =>
              setNewStore({ ...newStore, land_use_zone: e.target.value })
            }
          />
          <TextField
            label="立地法届出、準立地法"
            fullWidth
            margin="dense"
            value={newStore.location_regulation}
            onChange={(e) =>
              setNewStore({ ...newStore, location_regulation: e.target.value })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newStore.old_heart_building_law}
                onChange={(e) =>
                  setNewStore({ ...newStore, old_heart_building_law: e.target.checked })
                }
              />
            }
            label="旧ハートビル法対応有無"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newStore.barrier_free_law}
                onChange={(e) =>
                  setNewStore({ ...newStore, barrier_free_law: e.target.checked })
                }
              />
            }
            label="現バリアフリー新法対応有無"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newStore.universal_design}
                onChange={(e) =>
                  setNewStore({ ...newStore, universal_design: e.target.checked })
                }
              />
            }
            label="ユニバーサルデザイン対応有無"
          />
          <TextField
            label="提出日"
            fullWidth
            margin="dense"
            value={newStore.submit_date}
            onChange={(e) => setNewStore({ ...newStore, submit_date: e.target.value })}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddStore}>
            登録
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>店舗情報編集</DialogTitle>
        <DialogContent>
          {editStore && (
            <>
              <TextField
                label="店舗コード"
                fullWidth
                margin="dense"
                value={editStore.store_code}
                onChange={(e) => setEditStore({ ...editStore, store_code: e.target.value })}
              />
              <TextField
                label="店舗名"
                fullWidth
                margin="dense"
                value={editStore.store_name}
                onChange={(e) => setEditStore({ ...editStore, store_name: e.target.value })}
              />
              <TextField
                label="建物区分"
                fullWidth
                margin="dense"
                value={editStore.building_type}
                onChange={(e) => setEditStore({ ...editStore, building_type: e.target.value })}
              />
              <TextField
                label="土地区分"
                fullWidth
                margin="dense"
                value={editStore.land_type}
                onChange={(e) => setEditStore({ ...editStore, land_type: e.target.value })}
              />
              <TextField
                label="建築年"
                fullWidth
                margin="dense"
                value={editStore.year_built}
                onChange={(e) => setEditStore({ ...editStore, year_built: e.target.value })}
                type="number"
              />
              <TextField
                label="大改装年"
                fullWidth
                margin="dense"
                value={editStore.year_renovation}
                onChange={(e) => setEditStore({ ...editStore, year_renovation: e.target.value })}
                type="number"
              />
              <TextField
                label="建設業者"
                fullWidth
                margin="dense"
                value={editStore.constructor_name}
                onChange={(e) => setEditStore({ ...editStore, constructor_name: e.target.value })}
              />
              <TextField
                label="設計者"
                fullWidth
                margin="dense"
                value={editStore.architect_name}
                onChange={(e) => setEditStore({ ...editStore, architect_name: e.target.value })}
              />
              <TextField
                label="構造種別"
                fullWidth
                margin="dense"
                value={editStore.structure_type}
                onChange={(e) => setEditStore({ ...editStore, structure_type: e.target.value })}
              />
              <TextField
                label="用途地域"
                fullWidth
                margin="dense"
                value={editStore.land_use_zone}
                onChange={(e) => setEditStore({ ...editStore, land_use_zone: e.target.value })}
              />
              <TextField
                label="立地法届出、準立地法"
                fullWidth
                margin="dense"
                value={editStore.location_regulation}
                onChange={(e) => setEditStore({ ...editStore, location_regulation: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editStore.old_heart_building_law}
                    onChange={(e) =>
                      setEditStore({ ...editStore, old_heart_building_law: e.target.checked })
                    }
                  />
                }
                label="旧ハートビル法対応有無"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editStore.barrier_free_law}
                    onChange={(e) =>
                      setEditStore({ ...editStore, barrier_free_law: e.target.checked })
                    }
                  />
                }
                label="現バリアフリー新法対応有無"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editStore.universal_design}
                    onChange={(e) =>
                      setEditStore({ ...editStore, universal_design: e.target.checked })
                    }
                  />
                }
                label="ユニバーサルデザイン対応有無"
              />
              <TextField
                label="提出日"
                fullWidth
                margin="dense"
                value={editStore.submit_date}
                onChange={(e) => setEditStore({ ...editStore, submit_date: e.target.value })}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

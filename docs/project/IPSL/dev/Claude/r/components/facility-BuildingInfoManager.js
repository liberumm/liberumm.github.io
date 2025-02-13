// components/BuildingInfoManager.js
const {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  TablePagination,
} = MaterialUI;
const { useState } = React;

function BuildingInfoManager() {
  // サンプルデータ：10件
  const [infos, setInfos] = useState([
    {
      building_info_id: 1,
      store_id: 1,
      floors_above: 3,
      floors_below: 1,
      occupied_floors: "1F,2F,3F",
      site_area: 500.0,
      building_area: 300.0,
      total_floor_area: 800.0,
      sales_area: 400.0,
      backyard_area: 100.0,
      smoke_exhaust_method: "機械排煙",
      rooftop_waterproof: "シート防水",
      firefighting_equipment: "スプリンクラー",
      guidance_sign: "看板あり",
      created_at: "2023-03-01",
      updated_at: "2023-03-01",
      created_by: 1,
      updated_by: 1,
    },
    {
      building_info_id: 2,
      store_id: 2,
      floors_above: 4,
      floors_below: 0,
      occupied_floors: "1F～4F",
      site_area: 600.0,
      building_area: 350.0,
      total_floor_area: 950.0,
      sales_area: 500.0,
      backyard_area: 150.0,
      smoke_exhaust_method: "自然排煙",
      rooftop_waterproof: "コーティング防水",
      firefighting_equipment: "消火器",
      guidance_sign: "LED看板",
      created_at: "2023-03-02",
      updated_at: "2023-03-02",
      created_by: 2,
      updated_by: 2,
    },
    {
      building_info_id: 3,
      store_id: 3,
      floors_above: 2,
      floors_below: 1,
      occupied_floors: "1F, B1",
      site_area: 400.0,
      building_area: 250.0,
      total_floor_area: 650.0,
      sales_area: 300.0,
      backyard_area: 80.0,
      smoke_exhaust_method: "機械排煙",
      rooftop_waterproof: "シート防水",
      firefighting_equipment: "スプリンクラー",
      guidance_sign: "看板あり",
      created_at: "2023-03-03",
      updated_at: "2023-03-03",
      created_by: 3,
      updated_by: 3,
    },
    {
      building_info_id: 4,
      store_id: 4,
      floors_above: 5,
      floors_below: 1,
      occupied_floors: "1F～5F",
      site_area: 800.0,
      building_area: 500.0,
      total_floor_area: 1300.0,
      sales_area: 700.0,
      backyard_area: 200.0,
      smoke_exhaust_method: "機械排煙",
      rooftop_waterproof: "シート防水",
      firefighting_equipment: "消火器, スプリンクラー",
      guidance_sign: "LED看板",
      created_at: "2023-03-04",
      updated_at: "2023-03-04",
      created_by: 4,
      updated_by: 4,
    },
    {
      building_info_id: 5,
      store_id: 5,
      floors_above: 3,
      floors_below: 2,
      occupied_floors: "1F,2F,3F, B1, B2",
      site_area: 700.0,
      building_area: 400.0,
      total_floor_area: 1100.0,
      sales_area: 600.0,
      backyard_area: 250.0,
      smoke_exhaust_method: "自然排煙",
      rooftop_waterproof: "塗膜防水",
      firefighting_equipment: "消火器",
      guidance_sign: "看板あり",
      created_at: "2023-03-05",
      updated_at: "2023-03-05",
      created_by: 5,
      updated_by: 5,
    },
    {
      building_info_id: 6,
      store_id: 6,
      floors_above: 4,
      floors_below: 0,
      occupied_floors: "1F～4F",
      site_area: 550.0,
      building_area: 320.0,
      total_floor_area: 870.0,
      sales_area: 430.0,
      backyard_area: 120.0,
      smoke_exhaust_method: "機械排煙",
      rooftop_waterproof: "シート防水",
      firefighting_equipment: "スプリンクラー",
      guidance_sign: "LED看板",
      created_at: "2023-03-06",
      updated_at: "2023-03-06",
      created_by: 6,
      updated_by: 6,
    },
    {
      building_info_id: 7,
      store_id: 7,
      floors_above: 2,
      floors_below: 1,
      occupied_floors: "1F, B1",
      site_area: 450.0,
      building_area: 280.0,
      total_floor_area: 730.0,
      sales_area: 350.0,
      backyard_area: 90.0,
      smoke_exhaust_method: "自然排煙",
      rooftop_waterproof: "コーティング防水",
      firefighting_equipment: "消火器",
      guidance_sign: "看板あり",
      created_at: "2023-03-07",
      updated_at: "2023-03-07",
      created_by: 7,
      updated_by: 7,
    },
    {
      building_info_id: 8,
      store_id: 8,
      floors_above: 5,
      floors_below: 2,
      occupied_floors: "1F～5F, B1, B2",
      site_area: 900.0,
      building_area: 600.0,
      total_floor_area: 1500.0,
      sales_area: 800.0,
      backyard_area: 300.0,
      smoke_exhaust_method: "機械排煙",
      rooftop_waterproof: "塗膜防水",
      firefighting_equipment: "消火器, スプリンクラー",
      guidance_sign: "LED看板",
      created_at: "2023-03-08",
      updated_at: "2023-03-08",
      created_by: 8,
      updated_by: 8,
    },
    {
      building_info_id: 9,
      store_id: 9,
      floors_above: 3,
      floors_below: 0,
      occupied_floors: "1F～3F",
      site_area: 650.0,
      building_area: 400.0,
      total_floor_area: 1050.0,
      sales_area: 550.0,
      backyard_area: 180.0,
      smoke_exhaust_method: "自然排煙",
      rooftop_waterproof: "コーティング防水",
      firefighting_equipment: "スプリンクラー",
      guidance_sign: "看板あり",
      created_at: "2023-03-09",
      updated_at: "2023-03-09",
      created_by: 9,
      updated_by: 9,
    },
    {
      building_info_id: 10,
      store_id: 10,
      floors_above: 4,
      floors_below: 1,
      occupied_floors: "1F～4F, B1",
      site_area: 750.0,
      building_area: 450.0,
      total_floor_area: 1200.0,
      sales_area: 650.0,
      backyard_area: 210.0,
      smoke_exhaust_method: "機械排煙",
      rooftop_waterproof: "シート防水",
      firefighting_equipment: "消火器, スプリンクラー",
      guidance_sign: "LED看板",
      created_at: "2023-03-10",
      updated_at: "2023-03-10",
      created_by: 10,
      updated_by: 10,
    },
  ]);

  // 新規登録用ダイアログの状態
  const [openDialog, setOpenDialog] = useState(false);
  const [newInfo, setNewInfo] = useState({
    store_id: "",
    floors_above: "",
    floors_below: "",
    occupied_floors: "",
    site_area: "",
    building_area: "",
    total_floor_area: "",
    sales_area: "",
    backyard_area: "",
    smoke_exhaust_method: "",
    rooftop_waterproof: "",
    firefighting_equipment: "",
    guidance_sign: "",
  });

  // 編集用ダイアログの状態
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInfo, setEditInfo] = useState(null);

  // ページネーションの状態
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 新規登録処理
  const handleAddInfo = () => {
    const newId =
      infos.length > 0 ? Math.max(...infos.map((i) => i.building_info_id)) + 1 : 1;
    const currentDate = new Date().toISOString().slice(0, 10);
    const info = {
      ...newInfo,
      building_info_id: newId,
      created_at: currentDate,
      updated_at: currentDate,
      created_by: 1, // 仮のユーザーID
      updated_by: 1,
    };
    setInfos([...infos, info]);
    setOpenDialog(false);
    setNewInfo({
      store_id: "",
      floors_above: "",
      floors_below: "",
      occupied_floors: "",
      site_area: "",
      building_area: "",
      total_floor_area: "",
      sales_area: "",
      backyard_area: "",
      smoke_exhaust_method: "",
      rooftop_waterproof: "",
      firefighting_equipment: "",
      guidance_sign: "",
    });
  };

  // 削除処理
  const handleDelete = (id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setInfos(infos.filter((i) => i.building_info_id !== id));
    }
  };

  // 編集ボタン押下時：対象データを編集用状態にセットしてダイアログを表示
  const handleEditClick = (info) => {
    setEditInfo(info);
    setEditDialogOpen(true);
  };

  // 編集更新処理
  const handleUpdateInfo = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const updatedInfo = {
      ...editInfo,
      updated_at: currentDate,
      updated_by: 1, // 仮のユーザーID
    };
    setInfos(
      infos.map((info) =>
        info.building_info_id === updatedInfo.building_info_id ? updatedInfo : info
      )
    );
    setEditDialogOpen(false);
    setEditInfo(null);
  };

  // ページネーションで表示する行を算出（rowsPerPageが-1の場合は全件表示）
  const displayedRows =
    rowsPerPage > 0 ? infos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : infos;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">建物情報管理</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          新規追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>地上階数</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>地下階数</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>入居フロア</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>敷地面積</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>建築面積</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>延床面積</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>売場面積</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>バックヤード面積</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>排煙方式</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>屋上防水</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>消防設備</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>誘導看板</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>作成日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>登録者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((info) => (
              <TableRow
                key={info.building_info_id}
                onClick={() => handleEditClick(info)}
                // 行ホバー時の背景色変更
                sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)", cursor: "pointer" } }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.building_info_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.floors_above}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.floors_below}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.occupied_floors}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.site_area}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.building_area}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.total_floor_area}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.sales_area}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.backyard_area}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.smoke_exhaust_method}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.rooftop_waterproof}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.firefighting_equipment}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.guidance_sign}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.created_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.updated_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.created_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{info.updated_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(info);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(info.building_info_id);
                    }}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* ページネーション */}
      <TablePagination
        component="div"
        count={infos.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          const value = parseInt(event.target.value, 10);
          setRowsPerPage(value);
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 30, { label: "全て", value: -1 }]}
        labelRowsPerPage="表示件数:"
      />

      {/* 新規登録用ダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>新規建物情報登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newInfo.store_id}
            onChange={(e) => setNewInfo({ ...newInfo, store_id: e.target.value })}
          />
          <TextField
            label="地上階数"
            fullWidth
            margin="dense"
            value={newInfo.floors_above}
            onChange={(e) => setNewInfo({ ...newInfo, floors_above: e.target.value })}
          />
          <TextField
            label="地下階数"
            fullWidth
            margin="dense"
            value={newInfo.floors_below}
            onChange={(e) => setNewInfo({ ...newInfo, floors_below: e.target.value })}
          />
          <TextField
            label="入居フロア"
            fullWidth
            margin="dense"
            value={newInfo.occupied_floors}
            onChange={(e) => setNewInfo({ ...newInfo, occupied_floors: e.target.value })}
          />
          <TextField
            label="敷地面積"
            fullWidth
            margin="dense"
            value={newInfo.site_area}
            onChange={(e) => setNewInfo({ ...newInfo, site_area: e.target.value })}
          />
          <TextField
            label="建築面積"
            fullWidth
            margin="dense"
            value={newInfo.building_area}
            onChange={(e) => setNewInfo({ ...newInfo, building_area: e.target.value })}
          />
          <TextField
            label="延床面積"
            fullWidth
            margin="dense"
            value={newInfo.total_floor_area}
            onChange={(e) => setNewInfo({ ...newInfo, total_floor_area: e.target.value })}
          />
          <TextField
            label="売場面積"
            fullWidth
            margin="dense"
            value={newInfo.sales_area}
            onChange={(e) => setNewInfo({ ...newInfo, sales_area: e.target.value })}
          />
          <TextField
            label="バックヤード面積"
            fullWidth
            margin="dense"
            value={newInfo.backyard_area}
            onChange={(e) => setNewInfo({ ...newInfo, backyard_area: e.target.value })}
          />
          <TextField
            label="排煙方式"
            fullWidth
            margin="dense"
            value={newInfo.smoke_exhaust_method}
            onChange={(e) => setNewInfo({ ...newInfo, smoke_exhaust_method: e.target.value })}
          />
          <TextField
            label="屋上防水"
            fullWidth
            margin="dense"
            value={newInfo.rooftop_waterproof}
            onChange={(e) => setNewInfo({ ...newInfo, rooftop_waterproof: e.target.value })}
          />
          <TextField
            label="消防設備"
            fullWidth
            margin="dense"
            value={newInfo.firefighting_equipment}
            onChange={(e) =>
              setNewInfo({ ...newInfo, firefighting_equipment: e.target.value })
            }
          />
          <TextField
            label="誘導看板"
            fullWidth
            margin="dense"
            value={newInfo.guidance_sign}
            onChange={(e) => setNewInfo({ ...newInfo, guidance_sign: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddInfo}>
            登録
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集用ダイアログ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>建物情報編集</DialogTitle>
        <DialogContent>
          {editInfo && (
            <>
              <TextField
                label="店舗ID"
                fullWidth
                margin="dense"
                value={editInfo.store_id}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, store_id: e.target.value })
                }
              />
              <TextField
                label="地上階数"
                fullWidth
                margin="dense"
                value={editInfo.floors_above}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, floors_above: e.target.value })
                }
              />
              <TextField
                label="地下階数"
                fullWidth
                margin="dense"
                value={editInfo.floors_below}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, floors_below: e.target.value })
                }
              />
              <TextField
                label="入居フロア"
                fullWidth
                margin="dense"
                value={editInfo.occupied_floors}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, occupied_floors: e.target.value })
                }
              />
              <TextField
                label="敷地面積"
                fullWidth
                margin="dense"
                value={editInfo.site_area}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, site_area: e.target.value })
                }
              />
              <TextField
                label="建築面積"
                fullWidth
                margin="dense"
                value={editInfo.building_area}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, building_area: e.target.value })
                }
              />
              <TextField
                label="延床面積"
                fullWidth
                margin="dense"
                value={editInfo.total_floor_area}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, total_floor_area: e.target.value })
                }
              />
              <TextField
                label="売場面積"
                fullWidth
                margin="dense"
                value={editInfo.sales_area}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, sales_area: e.target.value })
                }
              />
              <TextField
                label="バックヤード面積"
                fullWidth
                margin="dense"
                value={editInfo.backyard_area}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, backyard_area: e.target.value })
                }
              />
              <TextField
                label="排煙方式"
                fullWidth
                margin="dense"
                value={editInfo.smoke_exhaust_method}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, smoke_exhaust_method: e.target.value })
                }
              />
              <TextField
                label="屋上防水"
                fullWidth
                margin="dense"
                value={editInfo.rooftop_waterproof}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, rooftop_waterproof: e.target.value })
                }
              />
              <TextField
                label="消防設備"
                fullWidth
                margin="dense"
                value={editInfo.firefighting_equipment}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, firefighting_equipment: e.target.value })
                }
              />
              <TextField
                label="誘導看板"
                fullWidth
                margin="dense"
                value={editInfo.guidance_sign}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, guidance_sign: e.target.value })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleUpdateInfo}>
            更新
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

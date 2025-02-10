// components/CompetitorsManager.js
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

function CompetitorsManager() {
  // サンプルデータ（10件）
  const [competitors, setCompetitors] = useState([
    {
      competitor_id: 1,
      store_id: 101,
      competitor_name: "ライバル店A",
      competitor_rank: 1,
      notes: "備考A",
      created_at: "2023-05-01 10:00:00",
      updated_at: "2023-05-01 10:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 2,
      store_id: 102,
      competitor_name: "ライバル店B",
      competitor_rank: 2,
      notes: "備考B",
      created_at: "2023-05-02 11:00:00",
      updated_at: "2023-05-02 11:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 3,
      store_id: 103,
      competitor_name: "ライバル店C",
      competitor_rank: 1,
      notes: "備考C",
      created_at: "2023-05-03 12:00:00",
      updated_at: "2023-05-03 12:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 4,
      store_id: 104,
      competitor_name: "ライバル店D",
      competitor_rank: 2,
      notes: "備考D",
      created_at: "2023-05-04 13:00:00",
      updated_at: "2023-05-04 13:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 5,
      store_id: 105,
      competitor_name: "ライバル店E",
      competitor_rank: 1,
      notes: "備考E",
      created_at: "2023-05-05 14:00:00",
      updated_at: "2023-05-05 14:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 6,
      store_id: 106,
      competitor_name: "ライバル店F",
      competitor_rank: 2,
      notes: "備考F",
      created_at: "2023-05-06 15:00:00",
      updated_at: "2023-05-06 15:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 7,
      store_id: 107,
      competitor_name: "ライバル店G",
      competitor_rank: 1,
      notes: "備考G",
      created_at: "2023-05-07 16:00:00",
      updated_at: "2023-05-07 16:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 8,
      store_id: 108,
      competitor_name: "ライバル店H",
      competitor_rank: 2,
      notes: "備考H",
      created_at: "2023-05-08 17:00:00",
      updated_at: "2023-05-08 17:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 9,
      store_id: 109,
      competitor_name: "ライバル店I",
      competitor_rank: 1,
      notes: "備考I",
      created_at: "2023-05-09 18:00:00",
      updated_at: "2023-05-09 18:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      competitor_id: 10,
      store_id: 110,
      competitor_name: "ライバル店J",
      competitor_rank: 2,
      notes: "備考J",
      created_at: "2023-05-10 19:00:00",
      updated_at: "2023-05-10 19:00:00",
      created_by: 1,
      updated_by: 1,
    },
  ]);

  // 新規登録用ダイアログ用状態
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    store_id: "",
    competitor_name: "",
    competitor_rank: "",
    notes: "",
  });

  // 編集用ダイアログ用状態
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState(null);

  // ページネーション用状態
  const [page, setPage] = useState(0);
  // デフォルトは20件表示（-1の場合は「全件」表示）
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 新規登録処理
  const handleAddCompetitor = () => {
    const newId =
      competitors.length > 0
        ? Math.max(...competitors.map((c) => c.competitor_id)) + 1
        : 1;
    // 日付は「YYYY-MM-DD HH:MM:SS」形式に整形
    const now = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const competitor = {
      ...newCompetitor,
      competitor_id: newId,
      created_at: now,
      updated_at: now,
      created_by: 1,
      updated_by: 1,
    };
    setCompetitors([...competitors, competitor]);
    setOpenAddDialog(false);
    setNewCompetitor({ store_id: "", competitor_name: "", competitor_rank: "", notes: "" });
  };

  // 編集保存処理
  const handleSaveEditCompetitor = () => {
    const now = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const updatedCompetitor = {
      ...editingCompetitor,
      updated_at: now,
      updated_by: 1,
    };
    setCompetitors(
      competitors.map((c) =>
        c.competitor_id === updatedCompetitor.competitor_id ? updatedCompetitor : c
      )
    );
    setOpenEditDialog(false);
    setEditingCompetitor(null);
  };

  // 削除処理
  const handleDelete = (competitor_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setCompetitors(competitors.filter((c) => c.competitor_id !== competitor_id));
    }
  };

  // ページ変更ハンドラ
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 表示件数変更ハンドラ
  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
  };

  // rowsPerPageが-1の場合は全件表示
  const paginatedCompetitors =
    rowsPerPage > 0
      ? competitors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : competitors;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">競合管理</Typography>
        <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
          新規追加
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>競合店名</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>順位</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>備考</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>作成日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>登録者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCompetitors.map((c) => (
              <TableRow
                key={c.competitor_id}
                // ホバー時の背景色変更とクリック可能なカーソルを指定
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
                // 行クリックで編集ダイアログを表示（内部の削除ボタンはstopPropagation）
                onClick={() => {
                  setEditingCompetitor(c);
                  setOpenEditDialog(true);
                }}
              >
                <TableCell>{c.competitor_id}</TableCell>
                <TableCell>{c.store_id}</TableCell>
                <TableCell>{c.competitor_name}</TableCell>
                <TableCell>{c.competitor_rank}</TableCell>
                <TableCell>{c.notes}</TableCell>
                <TableCell>{c.created_at}</TableCell>
                <TableCell>{c.updated_at}</TableCell>
                <TableCell>{c.created_by}</TableCell>
                <TableCell>{c.updated_by}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.competitor_id);
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
          component="div"
          count={competitors.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage > 0 ? rowsPerPage : competitors.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 30, { label: "全て", value: -1 }]}
        />
      </TableContainer>

      {/* 新規登録ダイアログ */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>新規競合登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newCompetitor.store_id}
            onChange={(e) =>
              setNewCompetitor({ ...newCompetitor, store_id: e.target.value })
            }
          />
          <TextField
            label="競合店名"
            fullWidth
            margin="dense"
            value={newCompetitor.competitor_name}
            onChange={(e) =>
              setNewCompetitor({ ...newCompetitor, competitor_name: e.target.value })
            }
          />
          <TextField
            label="順位"
            fullWidth
            margin="dense"
            type="number"
            value={newCompetitor.competitor_rank}
            onChange={(e) =>
              setNewCompetitor({ ...newCompetitor, competitor_rank: e.target.value })
            }
          />
          <TextField
            label="備考"
            fullWidth
            margin="dense"
            value={newCompetitor.notes}
            onChange={(e) =>
              setNewCompetitor({ ...newCompetitor, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddCompetitor}>
            登録
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集用ダイアログ */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setEditingCompetitor(null);
        }}
      >
        <DialogTitle>競合情報編集</DialogTitle>
        {editingCompetitor && (
          <DialogContent>
            <TextField
              label="店舗ID"
              fullWidth
              margin="dense"
              value={editingCompetitor.store_id}
              onChange={(e) =>
                setEditingCompetitor({
                  ...editingCompetitor,
                  store_id: e.target.value,
                })
              }
            />
            <TextField
              label="競合店名"
              fullWidth
              margin="dense"
              value={editingCompetitor.competitor_name}
              onChange={(e) =>
                setEditingCompetitor({
                  ...editingCompetitor,
                  competitor_name: e.target.value,
                })
              }
            />
            <TextField
              label="順位"
              fullWidth
              margin="dense"
              type="number"
              value={editingCompetitor.competitor_rank}
              onChange={(e) =>
                setEditingCompetitor({
                  ...editingCompetitor,
                  competitor_rank: e.target.value,
                })
              }
            />
            <TextField
              label="備考"
              fullWidth
              margin="dense"
              value={editingCompetitor.notes}
              onChange={(e) =>
                setEditingCompetitor({
                  ...editingCompetitor,
                  notes: e.target.value,
                })
              }
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              setEditingCompetitor(null);
            }}
          >
            キャンセル
          </Button>
          <Button variant="contained" onClick={handleSaveEditCompetitor}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

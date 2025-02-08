// components/SalesConditionManager.js
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

function SalesConditionManager() {
  // サンプルデータ（各レコードは営業条件を表す）
  const [conditions, setConditions] = useState([
    {
      sales_condition_id: 1,
      store_id: "101",
      business_days: "月〜金",
      business_hours: "09:00〜18:00",
      event_info: "セール開催",
      created_at: "2023-01-15",
    },
    {
      sales_condition_id: 2,
      store_id: "102",
      business_days: "土日祝",
      business_hours: "10:00〜20:00",
      event_info: "新商品イベント",
      created_at: "2023-02-10",
    },
    {
      sales_condition_id: 3,
      store_id: "103",
      business_days: "毎日",
      business_hours: "08:00〜22:00",
      event_info: "通常営業",
      created_at: "2023-03-05",
    },
  ]);

  // ダイアログ（新規追加／編集）用の状態管理
  const [openDialog, setOpenDialog] = useState(false);
  // 編集モードかどうか（true: 編集、false: 新規追加）
  const [isEditing, setIsEditing] = useState(false);
  const [currentCondition, setCurrentCondition] = useState({
    store_id: "",
    business_days: "",
    business_hours: "",
    event_info: "",
  });

  // ページネーション用の状態管理
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 「新規追加」ボタン押下時の処理
  const handleOpenNewDialog = () => {
    setIsEditing(false);
    setCurrentCondition({
      store_id: "",
      business_days: "",
      business_hours: "",
      event_info: "",
    });
    setOpenDialog(true);
  };

  // 「編集」ボタン押下時の処理（既存データをダイアログにセット）
  const handleOpenEditDialog = (condition) => {
    setIsEditing(true);
    setCurrentCondition(condition);
    setOpenDialog(true);
  };

  // ダイアログの「保存」ボタン押下時の処理
  const handleSaveCondition = () => {
    if (isEditing) {
      // 編集の場合は対象のレコードを更新
      setConditions(
        conditions.map((cond) =>
          cond.sales_condition_id === currentCondition.sales_condition_id
            ? currentCondition
            : cond
        )
      );
    } else {
      // 新規追加の場合は新しいIDを付与して追加
      const newId =
        conditions.length > 0
          ? Math.max(...conditions.map((c) => c.sales_condition_id)) + 1
          : 1;
      const newCondition = {
        ...currentCondition,
        sales_condition_id: newId,
        created_at: new Date().toISOString().slice(0, 10),
      };
      setConditions([...conditions, newCondition]);
    }
    setOpenDialog(false);
    setCurrentCondition({
      store_id: "",
      business_days: "",
      business_hours: "",
      event_info: "",
    });
    setIsEditing(false);
  };

  // 削除処理
  const handleDelete = (id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setConditions(conditions.filter((cond) => cond.sales_condition_id !== id));
    }
  };

  // ページ変更時の処理
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 表示件数変更時の処理
  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
  };

  // rowsPerPageが-1（全件表示）の場合は全件を表示
  const displayedConditions =
    rowsPerPage > 0
      ? conditions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : conditions;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">営業条件管理</Typography>
        <Button variant="contained" onClick={handleOpenNewDialog}>
          新規追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>営業日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>営業時間</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>イベント情報</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedConditions.map((cond) => (
              <TableRow
                key={cond.sales_condition_id}
                sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>{cond.sales_condition_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{cond.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{cond.business_days}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{cond.business_hours}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{cond.event_info}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Button size="small" onClick={() => handleOpenEditDialog(cond)}>
                    編集
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(cond.sales_condition_id)}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* MaterialUIのTablePaginationコンポーネントを利用 */}
      <TablePagination
        component="div"
        count={conditions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        // 表示件数選択肢：10,20,30,全て（-1の場合は全件表示）
        rowsPerPageOptions={[10, 20, 30, { label: "全て", value: -1 }]}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? "営業条件編集" : "新規営業条件登録"}</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={currentCondition.store_id}
            onChange={(e) =>
              setCurrentCondition({ ...currentCondition, store_id: e.target.value })
            }
          />
          <TextField
            label="営業日"
            fullWidth
            margin="dense"
            value={currentCondition.business_days}
            onChange={(e) =>
              setCurrentCondition({ ...currentCondition, business_days: e.target.value })
            }
          />
          <TextField
            label="営業時間"
            fullWidth
            margin="dense"
            value={currentCondition.business_hours}
            onChange={(e) =>
              setCurrentCondition({ ...currentCondition, business_hours: e.target.value })
            }
          />
          <TextField
            label="イベント情報"
            fullWidth
            margin="dense"
            value={currentCondition.event_info}
            onChange={(e) =>
              setCurrentCondition({ ...currentCondition, event_info: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveCondition}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// components/HistoryManager.js
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
} = MaterialUI;
const { useState } = React;

function HistoryManager() {
  const [histories, setHistories] = useState([
    {
      history_id: 1,
      store_id: 1,
      category: "complaint",
      title: "騒音クレーム",
      event_date: "2023-06-15",
      status: "open",
      details: "夜間の荷捌き音",
      cost: 0,
      location_info: "荷捌き場",
      vendor_id: 1,
      responsible_user_id: 2,
      created_at: "2023-06-15",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newHistory, setNewHistory] = useState({
    store_id: "",
    category: "",
    title: "",
    event_date: "",
    status: "",
    details: "",
    cost: "",
    location_info: "",
    vendor_id: "",
    responsible_user_id: "",
  });

  const handleAddHistory = () => {
    const newId =
      histories.length > 0 ? Math.max(...histories.map((h) => h.history_id)) + 1 : 1;
    const history = {
      ...newHistory,
      history_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setHistories([...histories, history]);
    setOpenDialog(false);
    setNewHistory({
      store_id: "",
      category: "",
      title: "",
      event_date: "",
      status: "",
      details: "",
      cost: "",
      location_info: "",
      vendor_id: "",
      responsible_user_id: "",
    });
  };

  const handleDelete = (history_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setHistories(histories.filter((h) => h.history_id !== history_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">履歴管理</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          新規追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>店舗ID</TableCell>
              <TableCell>カテゴリ</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>発生日</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>詳細</TableCell>
              <TableCell>費用</TableCell>
              <TableCell>場所</TableCell>
              <TableCell>業者ID</TableCell>
              <TableCell>担当者ID</TableCell>
              <TableCell>作成日</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {histories.map((h) => (
              <TableRow key={h.history_id}>
                <TableCell>{h.history_id}</TableCell>
                <TableCell>{h.store_id}</TableCell>
                <TableCell>{h.category}</TableCell>
                <TableCell>{h.title}</TableCell>
                <TableCell>{h.event_date}</TableCell>
                <TableCell>{h.status}</TableCell>
                <TableCell>{h.details}</TableCell>
                <TableCell>{h.cost}</TableCell>
                <TableCell>{h.location_info}</TableCell>
                <TableCell>{h.vendor_id}</TableCell>
                <TableCell>{h.responsible_user_id}</TableCell>
                <TableCell>{h.created_at}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(h.history_id)}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>新規履歴登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newHistory.store_id}
            onChange={(e) => setNewHistory({ ...newHistory, store_id: e.target.value })}
          />
          <TextField
            label="カテゴリ"
            fullWidth
            margin="dense"
            value={newHistory.category}
            onChange={(e) => setNewHistory({ ...newHistory, category: e.target.value })}
          />
          <TextField
            label="タイトル"
            fullWidth
            margin="dense"
            value={newHistory.title}
            onChange={(e) => setNewHistory({ ...newHistory, title: e.target.value })}
          />
          <TextField
            label="発生日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newHistory.event_date}
            onChange={(e) => setNewHistory({ ...newHistory, event_date: e.target.value })}
          />
          <TextField
            label="ステータス"
            fullWidth
            margin="dense"
            value={newHistory.status}
            onChange={(e) => setNewHistory({ ...newHistory, status: e.target.value })}
          />
          <TextField
            label="詳細"
            fullWidth
            margin="dense"
            value={newHistory.details}
            onChange={(e) => setNewHistory({ ...newHistory, details: e.target.value })}
          />
          <TextField
            label="費用"
            fullWidth
            margin="dense"
            value={newHistory.cost}
            onChange={(e) => setNewHistory({ ...newHistory, cost: e.target.value })}
          />
          <TextField
            label="場所"
            fullWidth
            margin="dense"
            value={newHistory.location_info}
            onChange={(e) => setNewHistory({ ...newHistory, location_info: e.target.value })}
          />
          <TextField
            label="業者ID"
            fullWidth
            margin="dense"
            value={newHistory.vendor_id}
            onChange={(e) => setNewHistory({ ...newHistory, vendor_id: e.target.value })}
          />
          <TextField
            label="担当者ID"
            fullWidth
            margin="dense"
            value={newHistory.responsible_user_id}
            onChange={(e) => setNewHistory({ ...newHistory, responsible_user_id: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddHistory}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} = MaterialUI;
const { useState } = React;

function StoresManager() {
  const [stores, setStores] = useState([
    { store_id: 1, store_code: "OSK001", store_name: "大阪本店", building_type: "RC造", created_at: "2023-01-01" },
    { store_id: 2, store_code: "TKY001", store_name: "東京支店", building_type: "鉄骨造", created_at: "2023-02-01" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newStore, setNewStore] = useState({ store_code: "", store_name: "", building_type: "" });

  const handleAddStore = () => {
    const newId = stores.length > 0 ? Math.max(...stores.map((s) => s.store_id)) + 1 : 1;
    const store = {
      ...newStore,
      store_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setStores([...stores, store]);
    setOpenDialog(false);
    setNewStore({ store_code: "", store_name: "", building_type: "" });
  };

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
              <TableCell sx={{ whiteSpace: 'nowrap' }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>店舗コード</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>店舗名</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>建物区分</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>作成日</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.store_id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{store.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{store.store_code}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{store.store_name}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{store.building_type}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{store.created_at}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(store.store_id)}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 新規追加ダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddStore}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

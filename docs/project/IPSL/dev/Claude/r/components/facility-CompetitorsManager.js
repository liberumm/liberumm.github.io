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
} = MaterialUI;
const { useState } = React;

function CompetitorsManager() {
  const [competitors, setCompetitors] = useState([
    { competitor_id: 1, store_id: 1, competitor_name: "ライバル店XYZ", competitor_rank: 1, notes: "", created_at: "2023-05-01" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ store_id: "", competitor_name: "", competitor_rank: "", notes: "" });

  const handleAddCompetitor = () => {
    const newId =
      competitors.length > 0 ? Math.max(...competitors.map((c) => c.competitor_id)) + 1 : 1;
    const competitor = {
      ...newCompetitor,
      competitor_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setCompetitors([...competitors, competitor]);
    setOpenDialog(false);
    setNewCompetitor({ store_id: "", competitor_name: "", competitor_rank: "", notes: "" });
  };

  const handleDelete = (competitor_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setCompetitors(competitors.filter((c) => c.competitor_id !== competitor_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">競合管理</Typography>
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
              <TableCell>競合店名</TableCell>
              <TableCell>順位</TableCell>
              <TableCell>備考</TableCell>
              <TableCell>作成日</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competitors.map((c) => (
              <TableRow key={c.competitor_id}>
                <TableCell>{c.competitor_id}</TableCell>
                <TableCell>{c.store_id}</TableCell>
                <TableCell>{c.competitor_name}</TableCell>
                <TableCell>{c.competitor_rank}</TableCell>
                <TableCell>{c.notes}</TableCell>
                <TableCell>{c.created_at}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(c.competitor_id)}
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
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddCompetitor}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

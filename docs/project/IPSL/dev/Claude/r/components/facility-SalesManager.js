// components/SalesManager.js
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

function SalesManager() {
  const [sales, setSales] = useState([
    { sales_id: 1, store_id: 1, year: 2023, annual_sales: 123456789, created_at: "2023-05-01" },
    { sales_id: 2, store_id: 2, year: 2023, annual_sales: 987654321, created_at: "2023-05-01" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newSale, setNewSale] = useState({ store_id: "", year: "", annual_sales: "" });

  const handleAddSale = () => {
    const newId = sales.length > 0 ? Math.max(...sales.map((s) => s.sales_id)) + 1 : 1;
    const sale = {
      ...newSale,
      sales_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setSales([...sales, sale]);
    setOpenDialog(false);
    setNewSale({ store_id: "", year: "", annual_sales: "" });
  };

  const handleDelete = (sales_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setSales(sales.filter((s) => s.sales_id !== sales_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">売上管理</Typography>
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
              <TableCell>年度</TableCell>
              <TableCell>年間売上</TableCell>
              <TableCell>作成日</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.sales_id}>
                <TableCell>{sale.sales_id}</TableCell>
                <TableCell>{sale.store_id}</TableCell>
                <TableCell>{sale.year}</TableCell>
                <TableCell>{sale.annual_sales}</TableCell>
                <TableCell>{sale.created_at}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(sale.sales_id)}
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
        <DialogTitle>新規売上登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newSale.store_id}
            onChange={(e) => setNewSale({ ...newSale, store_id: e.target.value })}
          />
          <TextField
            label="年度"
            fullWidth
            margin="dense"
            type="number"
            value={newSale.year}
            onChange={(e) => setNewSale({ ...newSale, year: e.target.value })}
          />
          <TextField
            label="年間売上"
            fullWidth
            margin="dense"
            value={newSale.annual_sales}
            onChange={(e) => setNewSale({ ...newSale, annual_sales: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddSale}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

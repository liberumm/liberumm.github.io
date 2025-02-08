// components/VendorsManager.js
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

function VendorsManager() {
  const [vendors, setVendors] = useState([
    { vendor_id: 1, vendor_name: "〇〇電気", vendor_type: "設備", contact_info: "06-1234-5678", notes: "", created_at: "2023-04-01" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newVendor, setNewVendor] = useState({ vendor_name: "", vendor_type: "", contact_info: "", notes: "" });

  const handleAddVendor = () => {
    const newId = vendors.length > 0 ? Math.max(...vendors.map((v) => v.vendor_id)) + 1 : 1;
    const vendor = {
      ...newVendor,
      vendor_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setVendors([...vendors, vendor]);
    setOpenDialog(false);
    setNewVendor({ vendor_name: "", vendor_type: "", contact_info: "", notes: "" });
  };

  const handleDelete = (vendor_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setVendors(vendors.filter((v) => v.vendor_id !== vendor_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">業者管理</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          新規追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>業者名</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>業者種別</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>連絡先</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>備考</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>作成日</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.vendor_id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{vendor.vendor_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{vendor.vendor_name}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{vendor.vendor_type}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{vendor.contact_info}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{vendor.notes}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{vendor.created_at}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(vendor.vendor_id)}
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
        <DialogTitle>新規業者登録</DialogTitle>
        <DialogContent>
          <TextField
            label="業者名"
            fullWidth
            margin="dense"
            value={newVendor.vendor_name}
            onChange={(e) => setNewVendor({ ...newVendor, vendor_name: e.target.value })}
          />
          <TextField
            label="業者種別"
            fullWidth
            margin="dense"
            value={newVendor.vendor_type}
            onChange={(e) => setNewVendor({ ...newVendor, vendor_type: e.target.value })}
          />
          <TextField
            label="連絡先"
            fullWidth
            margin="dense"
            value={newVendor.contact_info}
            onChange={(e) => setNewVendor({ ...newVendor, contact_info: e.target.value })}
          />
          <TextField
            label="備考"
            fullWidth
            margin="dense"
            value={newVendor.notes}
            onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddVendor}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

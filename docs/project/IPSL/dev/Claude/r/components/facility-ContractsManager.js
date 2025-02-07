// components/ContractsManager.js
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

function ContractsManager() {
  const [contracts, setContracts] = useState([
    {
      contract_id: 1,
      store_id: 1,
      contract_type: "普通借家",
      contract_start_date: "2020-01-01",
      contract_end_date: "2025-12-31",
      monthly_rent: 500000,
      created_at: "2020-01-01",
    },
    {
      contract_id: 2,
      store_id: 2,
      contract_type: "定期借家",
      contract_start_date: "2021-03-01",
      contract_end_date: "2026-02-28",
      monthly_rent: 600000,
      created_at: "2021-03-01",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newContract, setNewContract] = useState({
    store_id: "",
    contract_type: "",
    contract_start_date: "",
    contract_end_date: "",
    monthly_rent: "",
  });

  const handleAddContract = () => {
    const newId =
      contracts.length > 0
        ? Math.max(...contracts.map((c) => c.contract_id)) + 1
        : 1;
    const contract = {
      ...newContract,
      contract_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setContracts([...contracts, contract]);
    setOpenDialog(false);
    setNewContract({
      store_id: "",
      contract_type: "",
      contract_start_date: "",
      contract_end_date: "",
      monthly_rent: "",
    });
  };

  const handleDelete = (contract_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setContracts(contracts.filter((c) => c.contract_id !== contract_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">契約管理</Typography>
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
              <TableCell>契約種別</TableCell>
              <TableCell>開始日</TableCell>
              <TableCell>終了日</TableCell>
              <TableCell>月額賃料</TableCell>
              <TableCell>作成日</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.contract_id}>
                <TableCell>{contract.contract_id}</TableCell>
                <TableCell>{contract.store_id}</TableCell>
                <TableCell>{contract.contract_type}</TableCell>
                <TableCell>{contract.contract_start_date}</TableCell>
                <TableCell>{contract.contract_end_date}</TableCell>
                <TableCell>{contract.monthly_rent}</TableCell>
                <TableCell>{contract.created_at}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(contract.contract_id)}
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
        <DialogTitle>新規契約登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newContract.store_id}
            onChange={(e) => setNewContract({ ...newContract, store_id: e.target.value })}
          />
          <TextField
            label="契約種別"
            fullWidth
            margin="dense"
            value={newContract.contract_type}
            onChange={(e) => setNewContract({ ...newContract, contract_type: e.target.value })}
          />
          <TextField
            label="開始日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newContract.contract_start_date}
            onChange={(e) => setNewContract({ ...newContract, contract_start_date: e.target.value })}
          />
          <TextField
            label="終了日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newContract.contract_end_date}
            onChange={(e) => setNewContract({ ...newContract, contract_end_date: e.target.value })}
          />
          <TextField
            label="月額賃料"
            fullWidth
            margin="dense"
            value={newContract.monthly_rent}
            onChange={(e) => setNewContract({ ...newContract, monthly_rent: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddContract}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

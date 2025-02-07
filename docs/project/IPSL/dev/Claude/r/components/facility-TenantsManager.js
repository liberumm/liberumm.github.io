// components/TenantsManager.js
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

function TenantsManager() {
  const [tenants, setTenants] = useState([
    {
      tenant_id: 1,
      store_id: 1,
      tenant_name: "テナントA",
      tenant_industry: "雑貨",
      tenant_rent: 200000,
      contract_start_date: "2021-05-01",
      contract_end_date: "2024-04-30",
      created_at: "2021-05-01",
    },
    {
      tenant_id: 2,
      store_id: 2,
      tenant_name: "テナントB",
      tenant_industry: "飲食",
      tenant_rent: 300000,
      contract_start_date: "2022-01-01",
      contract_end_date: "2025-12-31",
      created_at: "2022-01-01",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newTenant, setNewTenant] = useState({
    store_id: "",
    tenant_name: "",
    tenant_industry: "",
    tenant_rent: "",
    contract_start_date: "",
    contract_end_date: "",
  });

  const handleAddTenant = () => {
    const newId =
      tenants.length > 0 ? Math.max(...tenants.map((t) => t.tenant_id)) + 1 : 1;
    const tenant = {
      ...newTenant,
      tenant_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setTenants([...tenants, tenant]);
    setOpenDialog(false);
    setNewTenant({
      store_id: "",
      tenant_name: "",
      tenant_industry: "",
      tenant_rent: "",
      contract_start_date: "",
      contract_end_date: "",
    });
  };

  const handleDelete = (tenant_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setTenants(tenants.filter((t) => t.tenant_id !== tenant_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">テナント管理</Typography>
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
              <TableCell>テナント名</TableCell>
              <TableCell>業種</TableCell>
              <TableCell>賃料</TableCell>
              <TableCell>開始日</TableCell>
              <TableCell>終了日</TableCell>
              <TableCell>作成日</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.tenant_id}>
                <TableCell>{tenant.tenant_id}</TableCell>
                <TableCell>{tenant.store_id}</TableCell>
                <TableCell>{tenant.tenant_name}</TableCell>
                <TableCell>{tenant.tenant_industry}</TableCell>
                <TableCell>{tenant.tenant_rent}</TableCell>
                <TableCell>{tenant.contract_start_date}</TableCell>
                <TableCell>{tenant.contract_end_date}</TableCell>
                <TableCell>{tenant.created_at}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(tenant.tenant_id)}
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
        <DialogTitle>新規テナント登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newTenant.store_id}
            onChange={(e) =>
              setNewTenant({ ...newTenant, store_id: e.target.value })
            }
          />
          <TextField
            label="テナント名"
            fullWidth
            margin="dense"
            value={newTenant.tenant_name}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_name: e.target.value })
            }
          />
          <TextField
            label="業種"
            fullWidth
            margin="dense"
            value={newTenant.tenant_industry}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_industry: e.target.value })
            }
          />
          <TextField
            label="賃料"
            fullWidth
            margin="dense"
            value={newTenant.tenant_rent}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_rent: e.target.value })
            }
          />
          <TextField
            label="開始日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTenant.contract_start_date}
            onChange={(e) =>
              setNewTenant({ ...newTenant, contract_start_date: e.target.value })
            }
          />
          <TextField
            label="終了日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTenant.contract_end_date}
            onChange={(e) =>
              setNewTenant({ ...newTenant, contract_end_date: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddTenant}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

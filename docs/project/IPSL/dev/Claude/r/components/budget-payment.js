const { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } = MaterialUI;

const paymentStatusList = [
  { value: "advance", label: "前払い金", color: "warning" },
  { value: "recorded", label: "計上済み", color: "success" },
  { value: "unrecorded", label: "未計上", color: "default" }
];

const samplePayments = [
  { id: 'PM001', vendor: '○○建設', date: '2024-06-07', amount: 800000, department: '店舗開発部', status: 'advance', statusDate: '2024-06-07' },
  { id: 'PM002', vendor: '△△設備', date: '2024-06-15', amount: 300000, department: 'サイト開発部', status: 'recorded', statusDate: '2024-06-20' },
  { id: 'PM003', vendor: '□□サービス', date: '2024-06-18', amount: 150000, department: '店舗開発部', status: 'unrecorded', statusDate: '' }
];

const PaymentTab = () => {
  const [payments, setPayments] = React.useState(samplePayments);
  const [selected, setSelected] = React.useState(null);
  const [edit, setEdit] = React.useState(null);

  const handleRowClick = (p) => {
    setSelected(p);
    setEdit({ ...p });
  };

  const handleEditChange = (field, value) => {
    setEdit(prev => ({ ...prev, [field]: value }));
  };

  const handleDialogClose = () => {
    setSelected(null);
    setEdit(null);
  };

  const handleSave = () => {
    setPayments(prev =>
      prev.map(p => p.id === edit.id ? { ...edit, amount: Number(edit.amount) } : p)
    );
    handleDialogClose();
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,日付,支払先,金額,部署,経理処理ステータス,処理日\n";
    payments.forEach((p, index) => {
      const statusObj = paymentStatusList.find(s => s.value === p.status);
      const statusLabel = statusObj ? statusObj.label : '';
      const row = [
        index + 1,
        p.date,
        p.vendor,
        p.amount,
        p.department,
        statusLabel,
        p.statusDate || ''
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "支払管理.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        支払管理（前払い金・計上済み・未計上）
      </Typography>
      <Button variant="contained" size="small" onClick={exportCSV} sx={{ mb: 1 }}>
        エクスポート
      </Button>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>No.</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>日付</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>支払先</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>金額</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>部署</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>経理処理ステータス</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>処理日</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p, index) => {
              const statusObj = paymentStatusList.find(s => s.value === p.status);
              return (
                <TableRow key={p.id} hover style={{ cursor: 'pointer' }} onClick={() => handleRowClick(p)}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.vendor}</TableCell>
                  <TableCell>{p.amount.toLocaleString()}</TableCell>
                  <TableCell>{p.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusObj ? statusObj.label : ''}
                      color={statusObj ? statusObj.color : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{p.statusDate || ''}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 編集ダイアログ */}
      <Dialog open={!!selected} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>支払詳細・編集</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {edit && (
            <>
              <TextField label="ID" value={edit.id} fullWidth margin="dense" InputProps={{ readOnly: true }} />
              <TextField label="日付" type="date" value={edit.date} onChange={e => handleEditChange('date', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
              <TextField label="支払先" value={edit.vendor} onChange={e => handleEditChange('vendor', e.target.value)} fullWidth margin="dense" />
              <TextField label="金額" type="number" value={edit.amount} onChange={e => handleEditChange('amount', e.target.value)} fullWidth margin="dense" />
              <TextField label="部署" value={edit.department} onChange={e => handleEditChange('department', e.target.value)} fullWidth margin="dense" />
              <FormControl fullWidth margin="dense">
                <InputLabel>経理処理ステータス</InputLabel>
                <Select
                  value={edit.status}
                  label="経理処理ステータス"
                  onChange={e => handleEditChange('status', e.target.value)}
                >
                  {paymentStatusList.map(s => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="処理日" type="date" value={edit.statusDate || ''} onChange={e => handleEditChange('statusDate', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

window.PaymentTab = PaymentTab;
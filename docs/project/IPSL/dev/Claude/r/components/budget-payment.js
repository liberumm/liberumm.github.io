const { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } = MaterialUI;

const paymentStatusList = [
  { value: "advance", label: "前払い金", color: "warning" },
  { value: "recorded", label: "計上済み", color: "success" },
  { value: "unrecorded", label: "未計上", color: "default" }
];

const tableSx = {
  borderRadius: 2,
  boxShadow: 1,
  border: '1px solid #b0bec5',
  mb: 2,
  background: '#fff',
  '& table': {
    borderCollapse: 'separate',
    borderSpacing: 0
  },
  '& th, & td': {
    borderRight: '1px solid #b0bec5'
  },
  '& th:last-of-type, & td:last-of-type': {
    borderRight: 'none'
  },
  '& .MuiTableHead-root th': {
    background: '#e3eafc',
    fontWeight: 'bold',
    fontSize: 15,
    borderBottom: '2px solid #90caf9',
    color: '#1a237e',
    letterSpacing: 0.5,
    padding: '8px 12px',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    textAlign: 'center'
  },
  '& .MuiTableBody-root td': {
    background: '#fff',
    fontSize: 13,
    borderBottom: '1px solid #b0bec5',
    borderRight: '1px solid #b0bec5',
    padding: '7px 10px'
  },
  '& .MuiTableRow-root:nth-of-type(even) td': {
    background: '#f6f9fc'
  },
  '& .MuiTableRow-root:hover td': {
    background: '#e3f2fd'
  },
  '& .amount-cell': {
    color: '#1976d2',
    fontWeight: 700,
    textAlign: 'right'
  },
  '& .MuiTableCell-root': {
    padding: '6px 10px'
  }
};
const paymentTableCellSx = [
  {width: 100, textAlign: 'center'}, // 支払ID
  {width: 100, textAlign: 'center'}, // 日付
  {width: 100, textAlign: 'center'}, // 見積ID
  {width: 100, textAlign: 'center'}, // 請求ID
  {width: 100, textAlign: 'center'}, // 支払日
  {width: 100, textAlign: 'center'}, // 計上日
  {width: 160, textAlign: 'center'}, // 支払名
  {width: 120, textAlign: 'center'}, // 負担部署
  {width: 110, textAlign: 'center'}, // 勘定科目
  {width: 110, textAlign:'right'}, // 金額
  {width: 140, textAlign: 'center'}  // 取引先
];

const PaymentTab = () => {
  const [payments, setPayments] = React.useState([
    // 案件詳細の列構成に合わせてサンプルデータも拡張
    { paymentId: 'PM001', date: '2024-06-07', estimateId: 'E001', invoiceId: 'I001', paymentDate: '2024-06-10', postingDate: '2024-06-11', paymentName: '什器支払A', department: '店舗開発部', account: '資産', amount: 800000, vendor: '○○建設' },
    { paymentId: 'PM002', date: '2024-06-15', estimateId: 'E002', invoiceId: 'I002', paymentDate: '2024-06-18', postingDate: '2024-06-19', paymentName: '工事支払', department: 'サイト開発部', account: '工事費', amount: 300000, vendor: '△△設備' }
  ]);
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
      prev.map(p => p.paymentId === edit.paymentId ? { ...edit, amount: Number(edit.amount) } : p)
    );
    handleDialogClose();
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,支払ID,日付,見積ID,請求ID,支払日,計上日,支払名,負担部署,勘定科目,金額,取引先\n";
    payments.forEach((p, index) => {
      const row = [
        index + 1,
        p.paymentId,
        p.date,
        p.estimateId,
        p.invoiceId,
        p.paymentDate,
        p.postingDate,
        p.paymentName,
        p.department,
        p.account,
        p.amount,
        p.vendor
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
        支払管理
      </Typography>
      <Button variant="contained" size="small" onClick={exportCSV} sx={{ mb: 1 }}>
        エクスポート
      </Button>
      <TableContainer sx={{ maxHeight: 440, overflowX: 'auto', ...tableSx }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48, textAlign: 'center' }}>No.</TableCell>
              {['支払ID','日付','見積ID','請求ID','支払日','計上日','支払名','負担部署','勘定科目','金額','取引先']
                .map((h,idx)=>
                  <TableCell key={h} sx={paymentTableCellSx[idx]}>{h}</TableCell>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p, index) => (
              <TableRow key={p.paymentId} hover style={{ cursor: 'pointer' }} onClick={() => handleRowClick(p)}>
                <TableCell sx={{ width: 48, textAlign: 'center' }}>{index + 1}</TableCell>
                <TableCell sx={paymentTableCellSx[0]}>{p.paymentId}</TableCell>
                <TableCell sx={paymentTableCellSx[1]}>{p.date}</TableCell>
                <TableCell sx={paymentTableCellSx[2]}>{p.estimateId}</TableCell>
                <TableCell sx={paymentTableCellSx[3]}>{p.invoiceId}</TableCell>
                <TableCell sx={paymentTableCellSx[4]}>{p.paymentDate}</TableCell>
                <TableCell sx={paymentTableCellSx[5]}>{p.postingDate}</TableCell>
                <TableCell sx={paymentTableCellSx[6]}>{p.paymentName}</TableCell>
                <TableCell sx={paymentTableCellSx[7]}>{p.department}</TableCell>
                <TableCell sx={paymentTableCellSx[8]}>{p.account}</TableCell>
                <TableCell sx={paymentTableCellSx[9]} className="amount-cell">{p.amount.toLocaleString()}</TableCell>
                <TableCell sx={paymentTableCellSx[10]}>{p.vendor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 編集ダイアログ */}
      <Dialog open={!!selected} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>支払詳細・編集</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {edit && (
            <>
              <TextField label="支払ID" value={edit.paymentId} fullWidth margin="dense" InputProps={{ readOnly: true }} />
              <TextField label="日付" type="date" value={edit.date} onChange={e => handleEditChange('date', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
              <TextField label="見積ID" value={edit.estimateId} onChange={e => handleEditChange('estimateId', e.target.value)} fullWidth margin="dense" />
              <TextField label="請求ID" value={edit.invoiceId} onChange={e => handleEditChange('invoiceId', e.target.value)} fullWidth margin="dense" />
              <TextField label="支払日" type="date" value={edit.paymentDate} onChange={e => handleEditChange('paymentDate', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
              <TextField label="計上日" type="date" value={edit.postingDate} onChange={e => handleEditChange('postingDate', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
              <TextField label="支払名" value={edit.paymentName} onChange={e => handleEditChange('paymentName', e.target.value)} fullWidth margin="dense" />
              <TextField label="負担部署" value={edit.department} onChange={e => handleEditChange('department', e.target.value)} fullWidth margin="dense" />
              <TextField label="勘定科目" value={edit.account} onChange={e => handleEditChange('account', e.target.value)} fullWidth margin="dense" />
              <TextField label="金額" type="number" value={edit.amount} onChange={e => handleEditChange('amount', e.target.value)} fullWidth margin="dense" />
              <TextField label="取引先" value={edit.vendor} onChange={e => handleEditChange('vendor', e.target.value)} fullWidth margin="dense" />
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
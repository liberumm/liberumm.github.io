const {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton
} = MaterialUI;

// 各ステータス一覧
const estimateStatusList = [
  { value: "draft",    label: "作成中",   color: "default" },
  { value: "pending",  label: "承認待ち", color: "warning" },
  { value: "approved", label: "承認済",   color: "success" },
];
const billingStatusList = [
  { value: "unbilled", label: "未請求", color: "default" },
  { value: "billed",   label: "請求済", color: "info" },
];
const paymentStatusList = [
  { value: "advance",   label: "前払い金", color: "warning" },
  { value: "recorded",  label: "計上済み", color: "success" },
  { value: "unrecorded",label: "未計上",   color: "default" }
];

// テーブル全体のスタイル
const tableSx = {
  borderRadius: 2,
  boxShadow: 1,
  border: '1px solid #b0bec5',
  mb: 2,
  background: '#fff',
  '& table': { borderCollapse: 'separate', borderSpacing: 0 },
  '& th, & td': { borderRight: '1px solid #b0bec5' },
  '& th:last-of-type, & td:last-of-type': { borderRight: 'none' },
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
    padding: '7px 10px'
  },
  '& .MuiTableRow-root:nth-of-type(even) td': { background: '#f6f9fc' },
  '& .MuiTableRow-root:hover td': { background: '#e3f2fd' },
  '& .amount-cell': { color: '#1976d2', fontWeight: 700, textAlign: 'right' },
  '& .MuiTableCell-root': { padding: '6px 10px' }
};

// 既存フィールド用の列幅定義
const paymentTableCellSx = [
  { width: 100, textAlign: 'center' }, // 支払ID
  { width: 100, textAlign: 'center' }, // 日付
  { width: 100, textAlign: 'center' }, // 見積ID
  { width: 100, textAlign: 'center' }, // 請求ID
  { width: 100, textAlign: 'center' }, // 支払日
  { width: 100, textAlign: 'center' }, // 計上日
  { width: 160, textAlign: 'center' }, // 支払名
  { width: 120, textAlign: 'center' }, // 負担部署
  { width: 110, textAlign: 'center' }, // 勘定科目
  { width: 110, textAlign:'right' },   // 金額
  { width: 140, textAlign: 'center' }, // 取引先
  { width: 120, textAlign: 'center' }, // 担当部署（追加）
  { width: 120, textAlign: 'center' }  // 取引先請求ID（追加）
];

function PaymentTab() {
  // --- 支払データ（Estimate/Billing/Payment ステータス + 添付ファイル）---
  const [payments, setPayments] = React.useState([
    {
      paymentId: 'PM001',
      date: '2024-06-07',
      estimateId: 'E001',
      invoiceId: 'I001',
      paymentDate: '2024-06-10',
      postingDate: '2024-06-11',
      paymentName: '什器支払A',
      department: '店舗開発部',
      account: '資産',
      amount: 800000,
      vendor: '○○建設',
      estimateStatus: 'approved',
      billingStatus: 'billed',
      status: 'recorded',
      attachment: null,
      assigneeDepartment: '店舗開発部', // 例
      vendorInvoiceId: 'VI001-001'     // 例
    },
    {
      paymentId: 'PM002',
      date: '2024-06-15',
      estimateId: 'E002',
      invoiceId: 'I002',
      paymentDate: '2024-06-18',
      postingDate: '',
      paymentName: '工事支払',
      department: 'サイト開発部',
      account: '工事費',
      amount: 300000,
      vendor: '△△設備',
      estimateStatus: 'draft',
      billingStatus: 'unbilled',
      status: 'unrecorded',
      attachment: null,
      assigneeDepartment: 'サイト開発部',
      vendorInvoiceId: 'VI002-001'
    }
  ]);

  // --- 編集・新規追加用ステート ---
  const [selected, setSelected]   = React.useState(null);
  const [edit, setEdit]           = React.useState(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const emptyPayment = {
    paymentId: '',
    date: '',
    estimateId: '',
    invoiceId: '',
    paymentDate: '',
    postingDate: '',
    paymentName: '',
    department: '',
    account: '',
    amount: 0,
    vendor: '',
    estimateStatus: 'draft',
    billingStatus: 'unbilled',
    status: 'unrecorded',
    attachment: null,
    assigneeDepartment: '', // 担当部署追加
    vendorInvoiceId: ''     // 取引先請求ID追加
  };
  const [newPayment, setNewPayment] = React.useState(emptyPayment);

  // --- ページネーション ---
  const [page, setPage]               = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const totalCount = payments.length;
  const startIdx   = totalCount === 0 ? 0 : page * rowsPerPage + 1;
  const endIdx     = Math.min((page + 1) * rowsPerPage, totalCount);
  const pagedPayments = React.useMemo(
    () => payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [payments, page, rowsPerPage]
  );

  // --- 行クリックで編集ダイアログを開く ---
  const handleRowClick = (p) => {
    setSelected(p);
    setEdit({ ...p });
  };

  // --- 編集用変更ハンドラ ---
  const handleEditChange = (field, val) => {
    setEdit(prev => ({ ...prev, [field]: val }));
  };
  // --- 新規追加用変更ハンドラ ---
  const handleNewChange = (field) => (e) => {
    const v = field === 'amount' ? Number(e.target.value) : e.target.value;
    setNewPayment(prev => ({ ...prev, [field]: v }));
  };
  // --- ファイル添付 ---
  const handleFileChange = (field, file) => {
    setEdit(prev => ({ ...prev, [field]: file || null }));
  };
  const handleNewFile = (e) => {
    setNewPayment(prev => ({ ...prev, attachment: e.target.files?.[0] || null }));
  };

  const handleDialogClose = () => {
    setSelected(null);
    setEdit(null);
  };
  // --- 編集保存 ---
  const handleSave = () => {
    setPayments(prev =>
      prev.map(p =>
        p.paymentId === edit.paymentId
          ? { ...edit, amount: Number(edit.amount) }
          : p
      )
    );
    handleDialogClose();
  };
  // --- 追加 ---
  const addPayment = () => {
    setPayments(prev => [...prev, newPayment]);
    setNewPayment(emptyPayment);
    setIsAddOpen(false);
  };

  // --- CSVエクスポート ---
  const exportCSV = () => {
    let csv = 'No.,見積ステータス,請求ステータス,支払ステータス,添付ファイル,支払ID,日付,見積ID,請求ID,支払日,計上日,支払名,負担部署,勘定科目,金額,取引先,担当部署,取引先請求ID\n';
    payments.forEach((p, i) => {
      csv += [
        i + 1,
        p.estimateStatus,
        p.billingStatus,
        p.status,
        p.attachment?.name || '',
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
        p.vendor,
        p.assigneeDepartment || '',
        p.vendorInvoiceId || ''
      ].join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = '支払管理.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- テンプレートCSVダウンロード ---
  const downloadTemplate = () => {
    const header = [
      '見積ステータス','請求ステータス','支払ステータス','添付ファイル',
      '支払ID','日付','見積ID','請求ID','支払日','計上日','支払名','負担部署','勘定科目','金額','取引先','担当部署','取引先請求ID'
    ];
    const csv = header.join(',') + '\n' + header.map(() => '').join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = '支払インポートテンプレート.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- CSVインポート ---
  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = (evt.target.result ?? '').trim().split('\n').slice(1);
      const rows = lines.map(line => {
        const [
          , estSt, billSt, paySt, att,
          paymentId, date, estimateId, invoiceId,
          paymentDate, postingDate, paymentName,
          department, account, amount, vendor,
          assigneeDepartment, vendorInvoiceId
        ] = line.split(',');
        return {
          estimateStatus: estSt || 'draft',
          billingStatus: billSt || 'unbilled',
          status: paySt || 'unrecorded',
          attachment: null,
          paymentId,
          date,
          estimateId,
          invoiceId,
          paymentDate,
          postingDate,
          paymentName,
          department,
          account,
          amount: Number(amount),
          vendor,
          assigneeDepartment: assigneeDepartment || '',
          vendorInvoiceId: vendorInvoiceId || ''
        };
      });
      setPayments(prev => [...prev, ...rows]);
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = null;
  };

  // --- ステータス表示用 ---
  const getStatus = (list, p, field) =>
    (list.find(s => s.value === p[field]) || { label: '未定義', color: 'default' });

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>支払管理</Typography>

      <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small" onClick={exportCSV}>エクスポート</Button>
        <label>
          <Button variant="contained" size="small" component="span">インポート</Button>
          <input hidden accept=".csv" type="file" onChange={handleImportCSV} />
        </label>
        <Button variant="contained" size="small" onClick={downloadTemplate}>テンプレートDL</Button>
        <Button variant="contained" size="small" onClick={() => setIsAddOpen(true)}>新規追加</Button>
      </Box>

      <TableContainer sx={{ maxHeight: 440, overflowX: 'auto', ...tableSx }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48, textAlign: 'center' }}>No.</TableCell>
              <TableCell sx={{ width:120, textAlign:'center' }}>見積ステータス</TableCell>
              <TableCell sx={{ width:120, textAlign:'center' }}>請求ステータス</TableCell>
              <TableCell sx={{ width:120, textAlign:'center' }}>支払ステータス</TableCell>
              <TableCell sx={{ width:140, textAlign:'center' }}>添付ファイル</TableCell>
              {['支払ID','日付','見積ID','請求ID','支払日','計上日','支払名','負担部署','勘定科目','金額','取引先']
                .map((h, idx) => (
                  <TableCell key={h} sx={paymentTableCellSx[idx]}>{h}</TableCell>
                ))}
              <TableCell sx={{ width:120, textAlign:'center' }}>担当部署</TableCell>
              <TableCell sx={{ width:120, textAlign:'center' }}>取引先請求ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedPayments.map((p, i) => (
              <TableRow
                key={p.paymentId}
                hover
                onClick={() => handleRowClick(p)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ textAlign: 'center' }}>{startIdx + i}</TableCell>
                <TableCell sx={{ textAlign:'center' }}>
                  <Chip {...getStatus(estimateStatusList,p,'estimateStatus')} size="small" />
                </TableCell>
                <TableCell sx={{ textAlign:'center' }}>
                  <Chip {...getStatus(billingStatusList,p,'billingStatus')} size="small" />
                </TableCell>
                <TableCell sx={{ textAlign:'center' }}>
                  <Chip {...getStatus(paymentStatusList,p,'status')} size="small" />
                </TableCell>
                <TableCell sx={{ textAlign:'center' }}>
                  {p.attachment
                    ? <a href={URL.createObjectURL(p.attachment)} download={p.attachment.name}>
                        {p.attachment.name}
                      </a>
                    : '-'}
                </TableCell>
                <TableCell sx={paymentTableCellSx[0]}>{p.paymentId}</TableCell>
                <TableCell sx={paymentTableCellSx[1]}>{p.date}</TableCell>
                <TableCell sx={paymentTableCellSx[2]}>{p.estimateId}</TableCell>
                <TableCell sx={paymentTableCellSx[3]}>{p.invoiceId}</TableCell>
                <TableCell sx={paymentTableCellSx[4]}>{p.paymentDate}</TableCell>
                <TableCell sx={paymentTableCellSx[5]}>{p.postingDate}</TableCell>
                <TableCell sx={paymentTableCellSx[6]}>{p.paymentName}</TableCell>
                <TableCell sx={paymentTableCellSx[7]}>{p.department}</TableCell>
                <TableCell sx={paymentTableCellSx[8]}>{p.account}</TableCell>
                <TableCell className="amount-cell" sx={paymentTableCellSx[9]}>
                  {p.amount.toLocaleString()}
                </TableCell>
                <TableCell sx={paymentTableCellSx[10]}>{p.vendor}</TableCell>
                <TableCell sx={{ width:120, textAlign:'center' }}>{p.assigneeDepartment||"-"}</TableCell>
                <TableCell sx={{ width:120, textAlign:'center' }}>{p.vendorInvoiceId||"-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ページネーション */}
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:1, mb:1 }}>
        <Box sx={{ display:'flex', alignItems:'center' }}>
          <Typography variant="body2">1ページあたり：</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={e=>{ setRowsPerPage(Number(e.target.value)); setPage(0); }}
            sx={{ ml:1, width:64 }}
          >
            {[10,20,30,50].map(n=><MenuItem key={n} value={n}>{n}</MenuItem>)}
          </Select>
        </Box>
        <Typography variant="body2">
          {startIdx}～{endIdx}件を表示（全 {totalCount} 件）
        </Typography>
        <IconButton size="small" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>{'‹'}</IconButton>
        <IconButton size="small" onClick={()=>setPage(p=>Math.min(Math.ceil(totalCount/rowsPerPage)-1,p+1))} disabled={page>=Math.ceil(totalCount/rowsPerPage)-1}>{'›'}</IconButton>
      </Box>

      {/* 編集ダイアログ */}
      <Dialog open={!!selected} onClose={handleDialogClose} fullWidth maxWidth="xs">
        <DialogTitle>支払詳細・編集</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, mt:1 }}>
          {edit && <>
            <TextField label="支払ID" value={edit.paymentId} InputProps={{ readOnly:true }} fullWidth margin="dense"/>
            <TextField label="日付" type="date" value={edit.date} onChange={e=>handleEditChange('date', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink:true }}/>
            <FormControl fullWidth margin="dense">
              <InputLabel>見積ステータス</InputLabel>
              <Select value={edit.estimateStatus} label="見積ステータス" onChange={e=>handleEditChange('estimateStatus', e.target.value)}>
                {estimateStatusList.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>請求ステータス</InputLabel>
              <Select value={edit.billingStatus} label="請求ステータス" onChange={e=>handleEditChange('billingStatus', e.target.value)}>
                {billingStatusList.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>支払ステータス</InputLabel>
              <Select value={edit.status} label="支払ステータス" onChange={e=>handleEditChange('status', e.target.value)}>
                {paymentStatusList.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
            <label>
              <Button component="span" size="small">証憑添付</Button>
              <input type="file" hidden onChange={e=>handleFileChange('attachment', e.target.files?.[0])}/>
            </label>
            {edit.attachment && <Typography variant="body2">{edit.attachment.name}</Typography>}

            <TextField label="見積ID" value={edit.estimateId} onChange={e=>handleEditChange('estimateId', e.target.value)} fullWidth margin="dense"/>
            <TextField label="請求ID" value={edit.invoiceId} onChange={e=>handleEditChange('invoiceId', e.target.value)} fullWidth margin="dense"/>
            <TextField label="支払日" type="date" value={edit.paymentDate} onChange={e=>handleEditChange('paymentDate', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink:true }}/>
            <TextField label="計上日" type="date" value={edit.postingDate} onChange={e=>handleEditChange('postingDate', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink:true }}/>
            <TextField label="支払名" value={edit.paymentName} onChange={e=>handleEditChange('paymentName', e.target.value)} fullWidth margin="dense"/>
            <TextField label="負担部署" value={edit.department} onChange={e=>handleEditChange('department', e.target.value)} fullWidth margin="dense"/>
            <TextField label="勘定科目" value={edit.account} onChange={e=>handleEditChange('account', e.target.value)} fullWidth margin="dense"/>
            <TextField label="金額" type="number" value={edit.amount} onChange={e=>handleEditChange('amount', e.target.value)} fullWidth margin="dense"/>
            <TextField label="取引先" value={edit.vendor} onChange={e=>handleEditChange('vendor', e.target.value)} fullWidth margin="dense"/>
            <TextField label="担当部署" value={edit.assigneeDepartment||""} onChange={e=>handleEditChange('assigneeDepartment', e.target.value)} fullWidth margin="dense"/>
            <TextField label="取引先請求ID" value={edit.vendorInvoiceId||""} onChange={e=>handleEditChange('vendorInvoiceId', e.target.value)} fullWidth margin="dense"/>
          </>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>

      {/* 新規追加ダイアログ */}
      <Dialog open={isAddOpen} onClose={()=>setIsAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>支払データ追加</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, mt:1 }}>
          <TextField label="支払ID" value={newPayment.paymentId} onChange={handleNewChange('paymentId')} fullWidth margin="dense"/>
          <TextField label="日付" type="date" value={newPayment.date} onChange={handleNewChange('date')} fullWidth margin="dense" InputLabelProps={{ shrink:true }}/>
          <FormControl fullWidth margin="dense">
            <InputLabel>見積ステータス</InputLabel>
            <Select value={newPayment.estimateStatus} label="見積ステータス" onChange={handleNewChange('estimateStatus')}>
              {estimateStatusList.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>請求ステータス</InputLabel>
            <Select value={newPayment.billingStatus} label="請求ステータス" onChange={handleNewChange('billingStatus')}>
              {billingStatusList.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>支払ステータス</InputLabel>
            <Select value={newPayment.status} label="支払ステータス" onChange={handleNewChange('status')}>
              {paymentStatusList.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
          <label>
            <Button component="span" size="small">証憑添付</Button>
            <input type="file" hidden onChange={handleNewFile}/>
          </label>
          {newPayment.attachment && <Typography variant="body2">{newPayment.attachment.name}</Typography>}

          <TextField label="見積ID" value={newPayment.estimateId} onChange={handleNewChange('estimateId')} fullWidth margin="dense"/>
          <TextField label="請求ID" value={newPayment.invoiceId} onChange={handleNewChange('invoiceId')} fullWidth margin="dense"/>
          <TextField label="支払日" type="date" value={newPayment.paymentDate} onChange={handleNewChange('paymentDate')} fullWidth margin="dense" InputLabelProps={{ shrink:true }}/>
          <TextField label="計上日" type="date" value={newPayment.postingDate} onChange={handleNewChange('postingDate')} fullWidth margin="dense" InputLabelProps={{ shrink:true }}/>
          <TextField label="支払名" value={newPayment.paymentName} onChange={handleNewChange('paymentName')} fullWidth margin="dense"/>
          <TextField label="負担部署" value={newPayment.department} onChange={handleNewChange('department')} fullWidth margin="dense"/>
          <TextField label="勘定科目" value={newPayment.account} onChange={handleNewChange('account')} fullWidth margin="dense"/>
          <TextField label="金額" type="number" value={newPayment.amount} onChange={handleNewChange('amount')} fullWidth margin="dense"/>
          <TextField label="取引先" value={newPayment.vendor} onChange={handleNewChange('vendor')} fullWidth margin="dense"/>
          <TextField label="担当部署" value={newPayment.assigneeDepartment||""} onChange={handleNewChange('assigneeDepartment')} fullWidth margin="dense"/>
          <TextField label="取引先請求ID" value={newPayment.vendorInvoiceId||""} onChange={handleNewChange('vendorInvoiceId')} fullWidth margin="dense"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setIsAddOpen(false)}>キャンセル</Button>
          <Button onClick={addPayment} variant="contained">追加</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

window.PaymentTab = PaymentTab;

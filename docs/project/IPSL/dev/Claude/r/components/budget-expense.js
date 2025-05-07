const { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Button, LinearProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, MenuItem, Select, InputLabel, FormControl } = MaterialUI;

// サンプルデータ（見積・請求を配列で持つ）
const sampleExpenses = [
  {
    id: 'E001',
    name: '什器購入',
    department: '店舗開発部',
    estimates: [
      { amount: 500000, date: '2024-06-01', vendor: '○○建設' },
      { amount: 300000, date: '2024-06-02', vendor: '△△設備' }
    ],
    orders: [
      { amount: 800000, date: '2024-06-03' }
    ],
    invoices: [
      { amount: 400000, date: '2024-06-10' },
      { amount: 400000, date: '2024-06-15' }
    ],
    payments: [
      { amount: 800000, date: '2024-06-20' }
    ],
    vendor: '○○建設',
    date: '2024-06-03',
    budgetId: 'B003',
    projectId: 'P001',
    projectName: '新店舗開発',
    taskId: 'T001'
  },
  {
    id: 'E002',
    name: '設備工事',
    department: 'サイト開発部',
    estimates: [
      { amount: 300000, date: '2024-06-05', vendor: '△△設備' }
    ],
    orders: [
      { amount: 300000, date: '2024-06-11' }
    ],
    invoices: [
      { amount: 300000, date: '2024-06-15' }
    ],
    payments: [
      { amount: 300000, date: '2024-06-25' }
    ],
    vendor: '△△設備',
    date: '2024-06-11',
    budgetId: 'B002',
    projectId: 'P002',
    projectName: '改装プロジェクト',
    taskId: 'T002'
  },
  {
    id: 'E003',
    name: '外注業務',
    department: '店舗開発部',
    estimates: [
      { amount: 200000, date: '2024-06-07', vendor: '□□サービス' }
    ],
    orders: [
      { amount: 180000, date: '2024-06-10' }
    ],
    invoices: [
      { amount: 180000, date: '2024-06-18' }
    ],
    payments: [
      { amount: 150000, date: '2024-06-28' }
    ],
    vendor: '□□サービス',
    date: '2024-06-15',
    budgetId: 'B004',
    projectId: 'P001',
    projectName: '新店舗開発',
    taskId: 'T003'
  }
  // ...他データも同様に...
];

// ステータス判定関数（合計値で判定）
function getStatus(expense) {
  const estimate = (expense.estimates || []).reduce((s, e) => s + (e.amount || 0), 0);
  const order = (expense.orders || []).reduce((s, o) => s + (o.amount || 0), 0);
  const invoice = (expense.invoices || []).reduce((s, i) => s + (i.amount || 0), 0);
  const payment = (expense.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
  if (payment && payment >= invoice && invoice > 0) {
    return { label: "支払完了", color: "success", value: "支払完了" };
  }
  if (invoice && invoice >= order && order > 0) {
    return { label: "請求完了", color: "info", value: "請求完了" };
  }
  if (order && order >= estimate && estimate > 0) {
    return { label: "発注完了", color: "warning", value: "発注完了" };
  }
  if (estimate > 0) {
    return { label: "見積完了", color: "default", value: "見積完了" };
  }
  return { label: "未処理", color: "default", value: "未処理" };
}

const ExpenseTab = () => {
  const [expenses, setExpenses] = React.useState(sampleExpenses);
  const [selected, setSelected] = React.useState(null);
  const [edit, setEdit] = React.useState(null);

  // フィルタ・検索用
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [projectFilter, setProjectFilter] = React.useState('');

  // 一覧からユニークな部署・案件名を抽出
  const departmentList = Array.from(new Set(expenses.map(e => e.department)));
  const projectList = Array.from(new Set(expenses.map(e => e.projectName)));

  // ステータスごとのフィルタ
  const statusChips = [
    { label: "全て", value: "ALL", color: "default" },
    { label: "見積完了", value: "見積完了", color: "default" },
    { label: "発注完了", value: "発注完了", color: "warning" },
    { label: "請求完了", value: "請求完了", color: "info" },
    { label: "支払完了", value: "支払完了", color: "success" }
  ];

  // フィルタ適用
  const filtered = expenses.filter(e => {
    const status = getStatus(e).value;
    return (statusFilter === 'ALL' || status === statusFilter)
      && (!departmentFilter || e.department === departmentFilter)
      && (!projectFilter || e.projectName === projectFilter);
  });

  const handleRowClick = (expense) => {
    setSelected(expense);
    setEdit({ ...expense }); // 編集用にコピー
  };

  const handleEditChange = (field, value) => {
    setEdit(prev => ({ ...prev, [field]: value }));
  };

  const handleDialogClose = () => {
    setSelected(null);
    setEdit(null);
  };

  const handleSave = () => {
    setExpenses(prev =>
      prev.map(e => e.id === edit.id ? { ...edit } : e)
    );
    handleDialogClose();
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,日付,経費名,部署,業者,案件名,予算ID,案件ID,作業ID,見積合計,最新見積日,発注合計,最新発注日,請求合計,最新請求日,支払合計,最新支払日,進捗率,ステータス\n";
    filtered.forEach((e, idx) => {
      const estimateSum = getSum(e.estimates);
      const orderSum = getSum(e.orders);
      const invoiceSum = getSum(e.invoices);
      const paymentSum = getSum(e.payments);
      const progress = estimateSum > 0 ? (paymentSum / estimateSum) * 100 : 0;
      const status = getStatus(e).label;
      const row = [
        idx + 1,
        e.date,
        e.name,
        e.department,
        e.vendor,
        e.projectName || '',
        e.budgetId || '',
        e.projectId || '',
        e.taskId || '',
        estimateSum,
        getLatestDate(e.estimates) || '',
        orderSum,
        getLatestDate(e.orders) || '',
        invoiceSum,
        getLatestDate(e.invoices) || '',
        paymentSum,
        getLatestDate(e.payments) || '',
        progress.toFixed(1) + '%',
        status
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "経費一覧.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // テーブル表示用：合計金額・最新日付
  function getSum(arr) {
    return (arr || []).reduce((s, x) => s + (x.amount || 0), 0);
  }
  function getLatestDate(arr) {
    if (!arr || arr.length === 0) return '';
    return arr.map(x => x.date).sort().reverse()[0];
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        経費一覧（見積・発注・請求・支払 進捗管理）
      </Typography>
      {/* フィルタUI */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {statusChips.map(chip => (
          <Chip
            key={chip.value}
            label={chip.label}
            color={statusFilter === chip.value ? chip.color : "default"}
            variant={statusFilter === chip.value ? "filled" : "outlined"}
            clickable
            onClick={() => setStatusFilter(chip.value)}
          />
        ))}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>部署</InputLabel>
          <Select
            value={departmentFilter}
            label="部署"
            onChange={e => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="">全て</MenuItem>
            {departmentList.map(dep => (
              <MenuItem key={dep} value={dep}>{dep}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>案件名</InputLabel>
          <Select
            value={projectFilter}
            label="案件名"
            onChange={e => setProjectFilter(e.target.value)}
          >
            <MenuItem value="">全て</MenuItem>
            {projectList.map(proj => (
              <MenuItem key={proj} value={proj}>{proj}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" size="small" onClick={exportCSV}>
          エクスポート
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>日付</TableCell>
              <TableCell>経費名</TableCell>
              <TableCell>部署</TableCell>
              <TableCell>業者</TableCell>
              <TableCell>案件名</TableCell>
              <TableCell>予算ID</TableCell>
              <TableCell>案件ID</TableCell>
              <TableCell>作業ID</TableCell>
              <TableCell>見積合計</TableCell>
              <TableCell>最新見積日</TableCell>
              <TableCell>発注合計</TableCell>
              <TableCell>最新発注日</TableCell>
              <TableCell>請求合計</TableCell>
              <TableCell>最新請求日</TableCell>
              <TableCell>支払合計</TableCell>
              <TableCell>最新支払日</TableCell>
              <TableCell>進捗率</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((e, idx) => {
              const estimateSum = getSum(e.estimates);
              const orderSum = getSum(e.orders);
              const invoiceSum = getSum(e.invoices);
              const paymentSum = getSum(e.payments);
              const progress = estimateSum > 0 ? (paymentSum / estimateSum) * 100 : 0;
              const status = getStatus(e);
              return (
                <TableRow key={e.id} hover style={{ cursor: 'pointer' }} onClick={() => handleRowClick(e)}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.department}</TableCell>
                  <TableCell>{e.vendor}</TableCell>
                  <TableCell>{e.projectName}</TableCell>
                  <TableCell>{e.budgetId}</TableCell>
                  <TableCell>{e.projectId}</TableCell>
                  <TableCell>{e.taskId}</TableCell>
                  <TableCell>{estimateSum.toLocaleString()}</TableCell>
                  <TableCell>{getLatestDate(e.estimates)}</TableCell>
                  <TableCell>{orderSum.toLocaleString()}</TableCell>
                  <TableCell>{getLatestDate(e.orders)}</TableCell>
                  <TableCell>{invoiceSum.toLocaleString()}</TableCell>
                  <TableCell>{getLatestDate(e.invoices)}</TableCell>
                  <TableCell>{paymentSum.toLocaleString()}</TableCell>
                  <TableCell>{getLatestDate(e.payments)}</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <span>{progress.toFixed(1)}%</span>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={status.label} color={status.color} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 詳細編集ダイアログ */}
      <Dialog open={!!selected} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>経費詳細・編集</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {edit && (
            <>
              <TextField label="ID" value={edit.id} fullWidth margin="dense" InputProps={{ readOnly: true }} />
              <TextField label="日付" type="date" value={edit.date} onChange={e => handleEditChange('date', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
              <TextField label="経費名" value={edit.name} onChange={e => handleEditChange('name', e.target.value)} fullWidth margin="dense" />
              <TextField label="部署" value={edit.department} onChange={e => handleEditChange('department', e.target.value)} fullWidth margin="dense" />
              <TextField label="業者" value={edit.vendor} onChange={e => handleEditChange('vendor', e.target.value)} fullWidth margin="dense" />
              <TextField label="案件名" value={edit.projectName || ''} onChange={e => handleEditChange('projectName', e.target.value)} fullWidth margin="dense" />
              <TextField label="予算ID" value={edit.budgetId || ''} onChange={e => handleEditChange('budgetId', e.target.value)} fullWidth margin="dense" />
              <TextField label="案件ID" value={edit.projectId || ''} onChange={e => handleEditChange('projectId', e.target.value)} fullWidth margin="dense" />
              <TextField label="作業ID" value={edit.taskId || ''} onChange={e => handleEditChange('taskId', e.target.value)} fullWidth margin="dense" />
              {/* 見積リスト編集 */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>見積一覧</Typography>
              {(edit.estimates || []).map((est, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <TextField label="金額" type="number" value={est.amount} onChange={e => {
                    const arr = [...edit.estimates];
                    arr[i].amount = Number(e.target.value);
                    handleEditChange('estimates', arr);
                  }} size="small" sx={{ width: 120 }} />
                  <TextField label="日付" type="date" value={est.date} onChange={e => {
                    const arr = [...edit.estimates];
                    arr[i].date = e.target.value;
                    handleEditChange('estimates', arr);
                  }} size="small" sx={{ width: 140 }} InputLabelProps={{ shrink: true }} />
                  <TextField label="業者" value={est.vendor || ''} onChange={e => {
                    const arr = [...edit.estimates];
                    arr[i].vendor = e.target.value;
                    handleEditChange('estimates', arr);
                  }} size="small" sx={{ width: 140 }} />
                  <Button size="small" color="error" onClick={() => {
                    const arr = [...edit.estimates];
                    arr.splice(i, 1);
                    handleEditChange('estimates', arr);
                  }}>削除</Button>
                </Box>
              ))}
              <Button size="small" onClick={() => handleEditChange('estimates', [...(edit.estimates || []), { amount: 0, date: '', vendor: '' }])}>見積追加</Button>
              {/* 請求リスト編集 */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>請求一覧</Typography>
              {(edit.invoices || []).map((inv, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <TextField label="金額" type="number" value={inv.amount} onChange={e => {
                    const arr = [...edit.invoices];
                    arr[i].amount = Number(e.target.value);
                    handleEditChange('invoices', arr);
                  }} size="small" sx={{ width: 120 }} />
                  <TextField label="日付" type="date" value={inv.date} onChange={e => {
                    const arr = [...edit.invoices];
                    arr[i].date = e.target.value;
                    handleEditChange('invoices', arr);
                  }} size="small" sx={{ width: 140 }} InputLabelProps={{ shrink: true }} />
                  <Button size="small" color="error" onClick={() => {
                    const arr = [...edit.invoices];
                    arr.splice(i, 1);
                    handleEditChange('invoices', arr);
                  }}>削除</Button>
                </Box>
              ))}
              <Button size="small" onClick={() => handleEditChange('invoices', [...(edit.invoices || []), { amount: 0, date: '' }])}>請求追加</Button>
              {/* ...他の編集フィールド（orders, payments等）も同様に追加可能... */}
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

window.ExpenseTab = ExpenseTab;

const { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Box } = MaterialUI;

// シンプルな部署リスト
const departmentList = ['店舗開発部', 'サイト開発部', '施設活性化部'];

const BudgetList = () => {
  const [budgets, setBudgets] = React.useState([
    { id: 'B001', name: '広告宣伝費', amount: 1000000, date: '2024-06-01', department: '店舗開発部', year: '2024', planned: true },
    { id: 'B002', name: '販促費', amount: 500000, date: '2024-06-10', department: 'サイト開発部', year: '2024', planned: false },
    { id: 'B003', name: '什器購入', amount: 300000, date: '2024-06-15', department: '施設活性化部', year: '2024', planned: true },
    { id: 'B004', name: '外注業務', amount: 200000, date: '2024-06-18', department: '店舗開発部', year: '2024', planned: false }
  ]);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    id: '', name: '', amount: '', date: '', department: '', year: '', planned: false
  });

  // フィルター用
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [yearFilter, setYearFilter] = React.useState('');
  const [plannedFilter, setPlannedFilter] = React.useState('ALL');

  // ユニークな年度リスト
  const yearList = Array.from(new Set(budgets.map(b => b.year)));

  // フィルタ適用
  const filtered = budgets.filter(b =>
    (!departmentFilter || b.department === departmentFilter) &&
    (!yearFilter || b.year === yearFilter) &&
    (plannedFilter === 'ALL' || (plannedFilter === 'PLANNED' ? b.planned : !b.planned))
  );

  // 新規作成ダイアログを開く
  const handleOpen = () => {
    setForm({ id: '', name: '', amount: '', date: '', department: '', year: '', planned: false });
    setOpen(true);
  };
  // 入力変更
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  // 保存
  const handleSave = () => {
    if (!form.id || !form.name || !form.amount || !form.date || !form.department || !form.year) return;
    setBudgets(prev => [
      ...prev,
      { ...form, amount: Number(form.amount), planned: !!form.planned }
    ]);
    setOpen(false);
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,日付,予算名,部署,金額,年度,計画状況\n";
    budgets.forEach(b => {
      const row = [
        b.id,
        new Date(b.date).toLocaleDateString('ja-JP'),
        b.name,
        b.department,
        b.amount,
        b.year,
        b.planned ? '計画済み' : '未計画'
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "予算一覧.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        予算一覧
      </Typography>
      {/* フィルターUI */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>年度</InputLabel>
          <Select
            value={yearFilter}
            label="年度"
            onChange={e => setYearFilter(e.target.value)}
          >
            <MenuItem value="">全て</MenuItem>
            {yearList.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Chip
          label="全て"
          color={plannedFilter === 'ALL' ? 'primary' : 'default'}
          variant={plannedFilter === 'ALL' ? 'filled' : 'outlined'}
          clickable
          onClick={() => setPlannedFilter('ALL')}
        />
        <Chip
          label="計画済み"
          color={plannedFilter === 'PLANNED' ? 'success' : 'default'}
          variant={plannedFilter === 'PLANNED' ? 'filled' : 'outlined'}
          clickable
          onClick={() => setPlannedFilter('PLANNED')}
        />
        <Chip
          label="未計画"
          color={plannedFilter === 'UNPLANNED' ? 'default' : 'default'}
          variant={plannedFilter === 'UNPLANNED' ? 'filled' : 'outlined'}
          clickable
          onClick={() => setPlannedFilter('UNPLANNED')}
        />
        <Button variant="contained" size="small" onClick={handleOpen}>
          新規作成
        </Button>
        <Button variant="contained" size="small" onClick={exportCSV}>
          エクスポート
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>日付</TableCell>
              <TableCell>予算名</TableCell>
              <TableCell>部署</TableCell>
              <TableCell align="right">金額</TableCell>
              <TableCell>年度</TableCell>
              <TableCell>計画状況</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell>{b.id}</TableCell>
                <TableCell>{new Date(b.date).toLocaleDateString('ja-JP')}</TableCell>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.department}</TableCell>
                <TableCell align="right">{b.amount.toLocaleString('ja-JP')}</TableCell>
                <TableCell>{b.year}</TableCell>
                <TableCell>
                  <Chip
                    label={b.planned ? '計画済み' : '未計画'}
                    color={b.planned ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* 新規作成ダイアログ */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>予算新規作成</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="ID" value={form.id} onChange={e => handleChange('id', e.target.value)} fullWidth margin="dense" />
          <TextField label="日付" type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="予算名" value={form.name} onChange={e => handleChange('name', e.target.value)} fullWidth margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel>部署</InputLabel>
            <Select value={form.department} label="部署" onChange={e => handleChange('department', e.target.value)}>
              {departmentList.map(dep => (
                <MenuItem key={dep} value={dep}>{dep}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="金額" type="number" value={form.amount} onChange={e => handleChange('amount', e.target.value)} fullWidth margin="dense" />
          <TextField label="年度" value={form.year} onChange={e => handleChange('year', e.target.value)} fullWidth margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel>計画状況</InputLabel>
            <Select value={form.planned ? '計画済み' : '未計画'} label="計画状況" onChange={e => handleChange('planned', e.target.value === '計画済み')}>
              <MenuItem value="計画済み">計画済み</MenuItem>
              <MenuItem value="未計画">未計画</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

// グローバルに登録
window.BudgetList = BudgetList;

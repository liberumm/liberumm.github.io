const {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Avatar,
  LinearProgress
} = MaterialUI;

// フラット＆ライトトーンの配色設定
const deptColors = {
  '店舗開発部':   { bg: '#e3f2fd', iconColor: '#1976d2', icon: 'store' },
  'サイト開発部': { bg: '#f3e5f5', iconColor: '#9c27b0', icon: 'web' },
  '施設活性化部': { bg: '#e8f5e9', iconColor: '#43a047', icon: 'domain' }
};
const companyColor = { bg: '#fff3e0', iconColor: '#fb8c00', icon: 'business' };

const BudgetView = () => {
  // ─── サンプルデータ：開始日・終了日を復活 ───
  const budgets = [
    { id: 'B001', amount: 1000000, start: '2024-06-01', end: '2024-06-30', department: '店舗開発部' },
    { id: 'B002', amount:  500000, start: '2024-06-01', end: '2024-06-30', department: 'サイト開発部' },
    { id: 'B003', amount:  300000, start: '2024-06-01', end: '2024-06-30', department: '施設活性化部' },
    { id: 'B004', amount:  200000, start: '2024-06-01', end: '2024-06-30', department: '店舗開発部' }
  ];
  const estimates = [
    { id: 'E001', amount: 800000, department: '店舗開発部' },
    { id: 'E002', amount: 300000, department: 'サイト開発部' }
  ];
  const invoices = [
    { id: 'I001', amount: 800000, department: '店舗開発部' },
    { id: 'I002', amount: 300000, department: 'サイト開発部' }
  ];
  const payments = [
    { id: 'PM001', amount: 800000, department: '店舗開発部' },
    { id: 'PM002', amount: 300000, department: 'サイト開発部' }
  ];

  // ─── 部署別サマリー計算 ───
  const departments = Object.keys(deptColors);
  const deptPanels = departments.map(dept => {
    const bs = budgets.filter(b => b.department === dept);
    const budgetSum   = bs.reduce((s,b) => s + b.amount, 0);
    const estimateSum = estimates.filter(e => e.department === dept).reduce((s,e) => s + e.amount, 0);
    const invoiceSum  = invoices.filter(i => i.department === dept).reduce((s,i) => s + i.amount, 0);
    const paymentSum  = payments.filter(p => p.department === dept).reduce((s,p) => s + p.amount, 0);
    return { dept, budgetSum, estimateSum, invoiceSum, paymentSum, budgets: bs };
  });

  // ─── 全社サマリー ───
  const companyPanel = {
    dept: '全社合計',
    budgetSum:   budgets.reduce((s,b) => s + b.amount, 0),
    estimateSum: estimates.reduce((s,e) => s + e.amount, 0),
    invoiceSum:  invoices.reduce((s,i) => s + i.amount, 0),
    paymentSum:  payments.reduce((s,p) => s + p.amount, 0)
  };

  // ─── サマリーパネル ───
  const SummaryPanel = ({ panel, color }) => {
    const progress = panel.budgetSum > 0
      ? (panel.paymentSum / panel.budgetSum) * 100
      : 0;
    return (
      <Card sx={{
        height: '100%',
        boxShadow: 1,
        borderRadius: 2,
        backgroundColor: color.bg,
        color: '#333',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{
              bgcolor: color.iconColor,
              color: '#fff',
              mr: 1,
              width: 32, height: 32
            }}>
              <span className="material-icons">{color.icon}</span>
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {panel.dept}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>予算合計</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {panel.budgetSum.toLocaleString()} 円
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="caption" display="block">見積</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {panel.estimateSum.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" display="block">請求</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {panel.invoiceSum.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" display="block">支払</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {panel.paymentSum.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              進捗率：{progress.toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  // ─── テーブル用：1部署＝1行、No.・期間を復活 ───
  const tableRows = deptPanels.map((panel, idx) => {
    const starts = panel.budgets.map(b => b.start).sort();
    const ends   = panel.budgets.map(b => b.end).sort();
    const period = starts.length
      ? `${starts[0]} - ${ends[ends.length - 1]}`
      : '';
    const diff = panel.budgetSum - panel.paymentSum;
    const progress = panel.budgetSum > 0
      ? (panel.paymentSum / panel.budgetSum) * 100
      : 0;
    return {
      no: idx + 1,
      period,
      department: panel.dept,
      progress,
      budget: panel.budgetSum,
      estimate: panel.estimateSum,
      invoice: panel.invoiceSum,
      payment: panel.paymentSum,
      diff
    };
  });

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        会社全体・部署別 予実ダッシュボード
      </Typography>

      {/* 全社パネル */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <SummaryPanel panel={companyPanel} color={companyColor} />
        </Grid>
      </Grid>

      {/* 部署別パネル（横3列表示） */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {deptPanels.map(panel => (
          <Grid item xs={12} sm={6} md={4} key={panel.dept}>
            <SummaryPanel panel={panel} color={deptColors[panel.dept]} />
          </Grid>
        ))}
      </Grid>

      {/* 予実一覧テーブル（1部署＝1行、No.・期間あり） */}
      <Paper sx={{ p: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          予実一覧
        </Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>期間</TableCell>
                <TableCell>部署</TableCell>
                <TableCell>進捗率</TableCell>
                <TableCell>予算</TableCell>
                <TableCell>見積</TableCell>
                <TableCell>請求</TableCell>
                <TableCell>支払</TableCell>
                <TableCell>差異</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map(row => (
                <TableRow key={row.department} hover>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.period}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.progress.toFixed(1)}%</TableCell>
                  <TableCell>{row.budget.toLocaleString()}</TableCell>
                  <TableCell>{row.estimate.toLocaleString()}</TableCell>
                  <TableCell>{row.invoice.toLocaleString()}</TableCell>
                  <TableCell>{row.payment.toLocaleString()}</TableCell>
                  <TableCell sx={{ color: row.diff < 0 ? '#d32f2f' : 'inherit' }}>
                    {row.diff.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

window.DashboardTab = BudgetView;

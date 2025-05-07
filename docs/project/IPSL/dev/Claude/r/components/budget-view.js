// 全体で MaterialUI をグローバル読み込みしている前提
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

// 今月文字列取得用
const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = now.getMonth() + 1;
const currentMonthStr = `${thisYear}-${String(thisMonth).padStart(2, '0')}`;
function getMonthFromDate(d) { return d?.slice(0,7) || ''; }

// ─── サマリービュー ───
const BudgetView = () => {
  // サンプルデータ
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
    { id: 'PM001', amount: 800000, department: '店舗開発部', paymentDate: '2024-06-20', recordedDate: '2024-06-25', status: 'advance' },
    { id: 'PM002', amount: 300000, department: 'サイト開発部', paymentDate: '2024-06-22', recordedDate: '2024-06-28', status: 'recorded' }
  ];

  const departments = Object.keys(deptColors);
  const deptPanels = departments.map(dept => {
    const bs = budgets.filter(b => b.department === dept && getMonthFromDate(b.start) === currentMonthStr);
    const budgetSum   = bs.reduce((s,b) => s + b.amount, 0);
    const estimateSum = estimates.filter(e => e.department === dept).reduce((s,e) => s + e.amount, 0);
    const invoiceSum  = invoices.filter(i => i.department === dept).reduce((s,i) => s + i.amount, 0);
    const paymentSum  = payments.filter(p => p.department === dept && getMonthFromDate(p.paymentDate) === currentMonthStr).reduce((s,p) => s + p.amount, 0);
    return { dept, budgetSum, estimateSum, invoiceSum, paymentSum };
  });

  const companyPanel = {
    dept: '全社合計',
    budgetSum:   budgets.filter(b => getMonthFromDate(b.start) === currentMonthStr).reduce((s,b) => s + b.amount, 0),
    estimateSum: estimates.reduce((s,e) => s + e.amount, 0),
    invoiceSum:  invoices.reduce((s,i) => s + i.amount, 0),
    paymentSum:  payments.filter(p => getMonthFromDate(p.paymentDate) === currentMonthStr).reduce((s,p) => s + p.amount, 0)
  };

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
            <Avatar sx={{ bgcolor: color.iconColor, color: '#fff', mr: 1, width: 32, height: 32 }}>
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
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        会社全体・部署別 予実ダッシュボード（当月）
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <SummaryPanel panel={companyPanel} color={companyColor} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {deptPanels.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.dept}>
            <SummaryPanel panel={p} color={deptColors[p.dept]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ─── テーブルビュー ───
const DashboardTabTable = () => {
  const departments = ["店舗開発部", "サイト開発部", "施設活性化部"];
  const months = ["2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03"];
  const dummyData = {
    "店舗開発部":   { budget:1000000, invoice:800000, payment:750000, recorded:700000 },
    "サイト開発部": { budget:500000,  invoice:400000, payment:370000, recorded:350000 },
    "施設活性化部": { budget:300000,  invoice:250000, payment:240000, recorded:220000 }
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
        予実一覧（12か月：各月6行/部）
      </Typography>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table
          size="small"
          sx={{
            minWidth: 1200,
            borderCollapse: 'collapse',
            '& td, & th': { borderRight: '1px solid #ddd' }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ borderRight: '1px solid #ddd' }}>部署</TableCell>
              <TableCell rowSpan={2} sx={{ borderRight: '1px solid #ddd' }}>項目</TableCell>
              {months.map(m => (
                <TableCell key={m} align="center">{m}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              {months.map(m => (
                <TableCell key={m} align="center" sx={{ borderRight: '1px solid #ddd' }} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map(dept => {
              const d = dummyData[dept];
              const budgetProg = d.budget > 0 ? (d.recorded / d.budget * 100).toFixed(1) + '%' : '-';
              const payProg    = d.invoice > 0 ? (d.payment / d.invoice * 100).toFixed(1) + '%' : '-';
              return (
                <React.Fragment key={dept}>
                  {[
                    ['予算',   d.budget.toLocaleString()],
                    ['請求',   d.invoice.toLocaleString()],
                    ['支払',   d.payment.toLocaleString()],
                    ['計上',   d.recorded.toLocaleString()],
                    ['予算進捗', budgetProg],
                    ['支払進捗', payProg]
                  ].map(([label, value], idx) => (
                    <TableRow key={label} sx={{ '& td': { borderRight: '1px solid #ddd' } }}>
                      {idx === 0 && (
                        <TableCell
                          rowSpan={6}
                          sx={{
                            fontWeight: 700,
                            background: '#f5f5f5',
                            borderRight: '1px solid #ddd'
                          }}
                        >
                          {dept}
                        </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: 700 }}>{label}</TableCell>
                      {months.map(m => (
                        <TableCell key={m} align="right">
                          {/* 数値行以外はラベル列と同一表示 */}
                          {idx < 4 ? /* 金額 */ d[['budget','invoice','payment','recorded'][idx]].toLocaleString()
                                     : /* 進捗% */ (idx === 4 ? budgetProg : payProg)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// グローバルにアタッチ
window.DashboardTab = BudgetView;
window.DashboardTabTable = DashboardTabTable;

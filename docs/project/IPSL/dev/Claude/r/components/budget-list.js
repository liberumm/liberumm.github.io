const { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, TableContainer } = MaterialUI;

// 部署ごとのChipカラー設定
const departmentColors = {
  '店舗開発部': 'secondary',
  'サイト開発部': 'success',
  '施設活性化部': 'warning',
};

// 勘定科目ごとのChipカラー設定
const accountColors = {
  '修繕費': 'primary',
  '機器購入費': 'info',
  '業務委託費': 'error',
};

const BudgetList = () => {
  // サンプル予算データ
  const [budgets] = React.useState([
    { id: 'B001', name: '広告宣伝費', account: '業務委託費', amount: 1000000, date: '2024-06-01', department: '店舗開発部' },
    { id: 'B002', name: '販促費',   account: '修繕費',    amount:  500000, date: '2024-06-10', department: 'サイト開発部' },
    { id: 'B003', name: '什器購入', account: '機器購入費', amount:  300000, date: '2024-06-15', department: '施設活性化部' },
    { id: 'B004', name: '外注業務', account: '業務委託費', amount:  200000, date: '2024-06-18', department: '店舗開発部' }
  ]);

  return (
    <Paper sx={{ p: 2 }}>
      {/* タイトル */}
      <Typography variant="h6" gutterBottom>
        予算一覧
      </Typography>

      {/* テーブルをスクロール可能にし、ヘッダーを固定 */}
      <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>日付</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>予算名</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>部署</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>勘定科目</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>金額 (¥)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((b) => (
              <TableRow key={b.id} hover>
                {/* 日本形式の日付表示 */}
                <TableCell>{new Date(b.date).toLocaleDateString('ja-JP')}</TableCell>
                {/* 識別しやすいID表示 */}
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.name}</TableCell>
                {/* 部署Chip */}
                <TableCell>
                  <Chip label={b.department} color={departmentColors[b.department] || 'default'} size="small" />
                </TableCell>
                {/* 勘定科目Chip */}
                <TableCell>
                  <Chip label={b.account} color={accountColors[b.account] || 'default'} size="small" />
                </TableCell>
                {/* 金額を右寄せで三桁区切り表示 */}
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {b.amount.toLocaleString('ja-JP')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// グローバルに登録
window.BudgetList = BudgetList;

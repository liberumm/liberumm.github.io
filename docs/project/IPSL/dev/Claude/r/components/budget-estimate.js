const EstimateTab = () => {
  const [estimates] = React.useState([
    { id: 'E001', vendor: '○○建設', date: '2024-06-03', amount: 800000, department: '店舗開発部' },
    { id: 'E002', vendor: '△△設備', date: '2024-06-11', amount: 300000, department: 'サイト開発部' }
  ]);
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        見積管理
      </MaterialUI.Typography>
      <MaterialUI.TableContainer sx={{ overflowX: 'auto' }}>
        <MaterialUI.Table size="small">
          <MaterialUI.TableHead>
            <MaterialUI.TableRow>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>No.</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>日付</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>業者</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>金額</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>部署</MaterialUI.TableCell>
            </MaterialUI.TableRow>
          </MaterialUI.TableHead>
          <MaterialUI.TableBody>
            {estimates.map((e, index) => (
              <MaterialUI.TableRow key={e.id} hover>
                <MaterialUI.TableCell>{index + 1}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{e.date}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{e.vendor}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{e.amount.toLocaleString()}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{e.department}</MaterialUI.TableCell>
              </MaterialUI.TableRow>
            ))}
          </MaterialUI.TableBody>
        </MaterialUI.Table>
      </MaterialUI.TableContainer>
    </MaterialUI.Paper>
  );
};

window.EstimateTab = EstimateTab;
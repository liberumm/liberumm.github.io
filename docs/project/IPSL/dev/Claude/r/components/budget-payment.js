const PaymentTab = () => {
  const [payments] = React.useState([
    { id: 'PM001', vendor: '○○建設', date: '2024-06-07', amount: 800000, department: '店舗開発部' },
    { id: 'PM002', vendor: '△△設備', date: '2024-06-15', amount: 300000, department: 'サイト開発部' }
  ]);
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        支払管理
      </MaterialUI.Typography>
      <MaterialUI.TableContainer sx={{ overflowX: 'auto' }}>
        <MaterialUI.Table size="small">
          <MaterialUI.TableHead>
            <MaterialUI.TableRow>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>No.</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>日付</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>支払先</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>金額</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>部署</MaterialUI.TableCell>
            </MaterialUI.TableRow>
          </MaterialUI.TableHead>
          <MaterialUI.TableBody>
            {payments.map((p, index) => (
              <MaterialUI.TableRow key={p.id} hover>
                <MaterialUI.TableCell>{index + 1}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{p.date}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{p.vendor}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{p.amount.toLocaleString()}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{p.department}</MaterialUI.TableCell>
              </MaterialUI.TableRow>
            ))}
          </MaterialUI.TableBody>
        </MaterialUI.Table>
      </MaterialUI.TableContainer>
    </MaterialUI.Paper>
  );
};

window.PaymentTab = PaymentTab;
const BudgetTab = () => {
  const [budgets] = React.useState([
    { id: 'B001', name: '広告宣伝費', amount: 1000000, date: '2024-06-01', department: '店舗開発部' },
    { id: 'B002', name: '販促費', amount: 500000, date: '2024-06-10', department: 'サイト開発部' }
  ]);
  
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,日付,予算名,金額,部署\n";
    budgets.forEach((b, index) => {
      const row = [index + 1, b.date, b.name, b.amount, b.department].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "予算管理.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        予算管理
      </MaterialUI.Typography>
      <MaterialUI.Button variant="contained" size="small" onClick={exportCSV} sx={{ mb: 1 }}>
        エクスポート
      </MaterialUI.Button>
      <MaterialUI.TableContainer sx={{ overflowX: 'auto' }}>
        <MaterialUI.Table size="small">
          <MaterialUI.TableHead>
            <MaterialUI.TableRow>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>No.</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>日付</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>予算名</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>金額</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>部署</MaterialUI.TableCell>
            </MaterialUI.TableRow>
          </MaterialUI.TableHead>
          <MaterialUI.TableBody>
            {budgets.map((b, index) => (
              <MaterialUI.TableRow key={b.id} hover>
                <MaterialUI.TableCell>{index + 1}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{b.date}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{b.name}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{b.amount.toLocaleString()}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{b.department}</MaterialUI.TableCell>
              </MaterialUI.TableRow>
            ))}
          </MaterialUI.TableBody>
        </MaterialUI.Table>
      </MaterialUI.TableContainer>
    </MaterialUI.Paper>
  );
};

window.BudgetTab = BudgetTab;
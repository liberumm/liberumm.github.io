const InvoiceTab = () => {
  const [invoices] = React.useState([
    { id: 'I001', vendor: '○○建設', date: '2024-06-05', amount: 800000, department: '店舗開発部' },
    { id: 'I002', vendor: '△△設備', date: '2024-06-13', amount: 300000, department: 'サイト開発部' }
  ]);
  
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,日付,業者,金額,部署\n";
    invoices.forEach((i, index) => {
      const row = [index + 1, i.date, i.vendor, i.amount, i.department].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "請求管理.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        請求管理
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
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>業者</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>金額</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>部署</MaterialUI.TableCell>
            </MaterialUI.TableRow>
          </MaterialUI.TableHead>
          <MaterialUI.TableBody>
            {invoices.map((i, index) => (
              <MaterialUI.TableRow key={i.id} hover>
                <MaterialUI.TableCell>{index + 1}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{i.date}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{i.vendor}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{i.amount.toLocaleString()}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{i.department}</MaterialUI.TableCell>
              </MaterialUI.TableRow>
            ))}
          </MaterialUI.TableBody>
        </MaterialUI.Table>
      </MaterialUI.TableContainer>
    </MaterialUI.Paper>
  );
};

window.InvoiceTab = InvoiceTab;
const ProjectTab = () => {
  const [projects] = React.useState([
    { id: 'P001', name: '新店舗開発', date: '2024-06-01' },
    { id: 'P002', name: '改装プロジェクト', date: '2024-06-10' }
  ]);
  
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,日付,案件名\n";
    projects.forEach((p, index) => {
      const row = [index + 1, p.date, p.name].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "案件管理.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        案件管理
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
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>案件名</MaterialUI.TableCell>
            </MaterialUI.TableRow>
          </MaterialUI.TableHead>
          <MaterialUI.TableBody>
            {projects.map((p, index) => (
              <MaterialUI.TableRow key={p.id} hover>
                <MaterialUI.TableCell>{index + 1}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{p.date}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{p.name}</MaterialUI.TableCell>
              </MaterialUI.TableRow>
            ))}
          </MaterialUI.TableBody>
        </MaterialUI.Table>
      </MaterialUI.TableContainer>
    </MaterialUI.Paper>
  );
};

window.ProjectTab = ProjectTab;
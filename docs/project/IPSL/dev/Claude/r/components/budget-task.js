const TaskTab = () => {
  const [tasks] = React.useState([
    { id: 'T001', name: '現地調査', date: '2024-06-02', projectId: 'P001' },
    { id: 'T002', name: '設計打合せ', date: '2024-06-12', projectId: 'P002' }
  ]);
  
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,日付,作業名,案件ID\n";
    tasks.forEach((t, index) => {
      const row = [index + 1, t.date, t.name, t.projectId].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "作業管理.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        作業管理
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
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>作業名</MaterialUI.TableCell>
              <MaterialUI.TableCell sx={{ fontWeight: 700 }}>案件ID</MaterialUI.TableCell>
            </MaterialUI.TableRow>
          </MaterialUI.TableHead>
          <MaterialUI.TableBody>
            {tasks.map((t, index) => (
              <MaterialUI.TableRow key={t.id} hover>
                <MaterialUI.TableCell>{index + 1}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{t.date}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{t.name}</MaterialUI.TableCell>
                <MaterialUI.TableCell>{t.projectId}</MaterialUI.TableCell>
              </MaterialUI.TableRow>
            ))}
          </MaterialUI.TableBody>
        </MaterialUI.Table>
      </MaterialUI.TableContainer>
    </MaterialUI.Paper>
  );
};

window.TaskTab = TaskTab;
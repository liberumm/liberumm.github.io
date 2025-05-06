const TaskTab = () => {
  const [tasks] = React.useState([
    { id: 'T001', name: '現地調査', date: '2024-06-02', projectId: 'P001' },
    { id: 'T002', name: '設計打合せ', date: '2024-06-12', projectId: 'P002' }
  ]);
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        作業管理
      </MaterialUI.Typography>
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
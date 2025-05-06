const ProjectTab = () => {
  const [projects] = React.useState([
    { id: 'P001', name: '新店舗開発', date: '2024-06-01' },
    { id: 'P002', name: '改装プロジェクト', date: '2024-06-10' }
  ]);
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        案件管理
      </MaterialUI.Typography>
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
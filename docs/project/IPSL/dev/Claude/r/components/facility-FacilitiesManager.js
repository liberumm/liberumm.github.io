// components/FacilitiesManager.js
const {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} = MaterialUI;
const { useState } = React;

function FacilitiesManager() {
  const [facilities, setFacilities] = useState([
    {
      facility_id: 1,
      store_id: 1,
      facility_type: "parking",
      facility_name: "立体駐車場",
      location_info: "店舗横",
      capacity_or_size: "50台",
      details: "身障者用3台",
      created_at: "2023-03-01",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newFacility, setNewFacility] = useState({
    store_id: "",
    facility_type: "",
    facility_name: "",
    location_info: "",
    capacity_or_size: "",
    details: "",
  });

  const handleAddFacility = () => {
    const newId =
      facilities.length > 0 ? Math.max(...facilities.map((f) => f.facility_id)) + 1 : 1;
    const facility = {
      ...newFacility,
      facility_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setFacilities([...facilities, facility]);
    setOpenDialog(false);
    setNewFacility({
      store_id: "",
      facility_type: "",
      facility_name: "",
      location_info: "",
      capacity_or_size: "",
      details: "",
    });
  };

  const handleDelete = (facility_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setFacilities(facilities.filter((f) => f.facility_id !== facility_id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">設備管理</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          新規追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>設備種別</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>設備名</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>設置場所</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>容量/サイズ</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>備考</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>作成日</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow key={facility.facility_id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.facility_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.facility_type}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.facility_name}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.location_info}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.capacity_or_size}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.details}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{facility.created_at}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(facility.facility_id)}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>新規設備登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newFacility.store_id}
            onChange={(e) =>
              setNewFacility({ ...newFacility, store_id: e.target.value })
            }
          />
          <TextField
            label="設備種別"
            fullWidth
            margin="dense"
            value={newFacility.facility_type}
            onChange={(e) =>
              setNewFacility({ ...newFacility, facility_type: e.target.value })
            }
          />
          <TextField
            label="設備名"
            fullWidth
            margin="dense"
            value={newFacility.facility_name}
            onChange={(e) =>
              setNewFacility({ ...newFacility, facility_name: e.target.value })
            }
          />
          <TextField
            label="設置場所"
            fullWidth
            margin="dense"
            value={newFacility.location_info}
            onChange={(e) =>
              setNewFacility({ ...newFacility, location_info: e.target.value })
            }
          />
          <TextField
            label="容量/サイズ"
            fullWidth
            margin="dense"
            value={newFacility.capacity_or_size}
            onChange={(e) =>
              setNewFacility({ ...newFacility, capacity_or_size: e.target.value })
            }
          />
          <TextField
            label="備考"
            fullWidth
            margin="dense"
            value={newFacility.details}
            onChange={(e) =>
              setNewFacility({ ...newFacility, details: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddFacility}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

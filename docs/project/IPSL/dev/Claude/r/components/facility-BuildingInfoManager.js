// components/BuildingInfoManager.js
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

function BuildingInfoManager() {
  const [infos, setInfos] = useState([
    {
      building_info_id: 1,
      store_id: 1,
      floors_above: 3,
      floors_below: 1,
      occupied_floors: "1F,2F,3F",
      site_area: 500,
      building_area: 300,
      total_floor_area: 800,
      sales_area: 400,
      backyard_area: 100,
      smoke_exhaust_method: "機械排煙",
      rooftop_waterproof: "シート防水",
      firefighting_equipment: "スプリンクラー",
      guidance_sign: "看板あり",
      created_at: "2023-03-01",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newInfo, setNewInfo] = useState({
    store_id: "",
    floors_above: "",
    floors_below: "",
    occupied_floors: "",
    site_area: "",
    building_area: "",
    total_floor_area: "",
    sales_area: "",
    backyard_area: "",
    smoke_exhaust_method: "",
    rooftop_waterproof: "",
    firefighting_equipment: "",
    guidance_sign: "",
  });

  const handleAddInfo = () => {
    const newId =
      infos.length > 0 ? Math.max(...infos.map((i) => i.building_info_id)) + 1 : 1;
    const info = {
      ...newInfo,
      building_info_id: newId,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setInfos([...infos, info]);
    setOpenDialog(false);
    setNewInfo({
      store_id: "",
      floors_above: "",
      floors_below: "",
      occupied_floors: "",
      site_area: "",
      building_area: "",
      total_floor_area: "",
      sales_area: "",
      backyard_area: "",
      smoke_exhaust_method: "",
      rooftop_waterproof: "",
      firefighting_equipment: "",
      guidance_sign: "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setInfos(infos.filter((i) => i.building_info_id !== id));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">建物情報管理</Typography>
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
              <TableCell sx={{ whiteSpace: 'nowrap' }}>地上階数</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>地下階数</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>入居フロア</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>敷地面積</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>建築面積</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>延床面積</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>売場面積</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>バックヤード面積</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {infos.map((info) => (
              <TableRow key={info.building_info_id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.building_info_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.floors_above}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.floors_below}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.occupied_floors}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.site_area}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.building_area}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.total_floor_area}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.sales_area}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{info.backyard_area}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(info.building_info_id)}
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
        <DialogTitle>新規建物情報登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newInfo.store_id}
            onChange={(e) => setNewInfo({ ...newInfo, store_id: e.target.value })}
          />
          <TextField
            label="地上階数"
            fullWidth
            margin="dense"
            value={newInfo.floors_above}
            onChange={(e) => setNewInfo({ ...newInfo, floors_above: e.target.value })}
          />
          <TextField
            label="地下階数"
            fullWidth
            margin="dense"
            value={newInfo.floors_below}
            onChange={(e) => setNewInfo({ ...newInfo, floors_below: e.target.value })}
          />
          <TextField
            label="入居フロア"
            fullWidth
            margin="dense"
            value={newInfo.occupied_floors}
            onChange={(e) => setNewInfo({ ...newInfo, occupied_floors: e.target.value })}
          />
          <TextField
            label="敷地面積"
            fullWidth
            margin="dense"
            value={newInfo.site_area}
            onChange={(e) => setNewInfo({ ...newInfo, site_area: e.target.value })}
          />
          <TextField
            label="建築面積"
            fullWidth
            margin="dense"
            value={newInfo.building_area}
            onChange={(e) => setNewInfo({ ...newInfo, building_area: e.target.value })}
          />
          <TextField
            label="延床面積"
            fullWidth
            margin="dense"
            value={newInfo.total_floor_area}
            onChange={(e) => setNewInfo({ ...newInfo, total_floor_area: e.target.value })}
          />
          <TextField
            label="売場面積"
            fullWidth
            margin="dense"
            value={newInfo.sales_area}
            onChange={(e) => setNewInfo({ ...newInfo, sales_area: e.target.value })}
          />
          <TextField
            label="バックヤード面積"
            fullWidth
            margin="dense"
            value={newInfo.backyard_area}
            onChange={(e) => setNewInfo({ ...newInfo, backyard_area: e.target.value })}
          />
          <TextField
            label="排煙方式"
            fullWidth
            margin="dense"
            value={newInfo.smoke_exhaust_method}
            onChange={(e) =>
              setNewInfo({ ...newInfo, smoke_exhaust_method: e.target.value })
            }
          />
          <TextField
            label="屋上防水"
            fullWidth
            margin="dense"
            value={newInfo.rooftop_waterproof}
            onChange={(e) =>
              setNewInfo({ ...newInfo, rooftop_waterproof: e.target.value })
            }
          />
          <TextField
            label="消防設備"
            fullWidth
            margin="dense"
            value={newInfo.firefighting_equipment}
            onChange={(e) =>
              setNewInfo({ ...newInfo, firefighting_equipment: e.target.value })
            }
          />
          <TextField
            label="誘導看板"
            fullWidth
            margin="dense"
            value={newInfo.guidance_sign}
            onChange={(e) =>
              setNewInfo({ ...newInfo, guidance_sign: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddInfo}>
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// NeighborhoodInfo.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } = MaterialUI;

function NeighborhoodInfo({ filters }) {
    const [neighborhoods, setNeighborhoods] = useState([
        { id: 1, type: '近隣協定', details: '協定内容A' },
        { id: 2, type: '自治会', details: '自治会内容B' },
        { id: 3, type: '商工会', details: '商工会内容C' },
        // 他の近隣情報もここに追加
    ]);

    const [open, setOpen] = useState(false);
    const [currentNeighborhood, setCurrentNeighborhood] = useState(null);

    const handleOpen = (neighborhoodItem = null) => {
        setCurrentNeighborhood(neighborhoodItem);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentNeighborhood(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentNeighborhood({
            ...currentNeighborhood,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentNeighborhood.id) {
            // 更新
            setNeighborhoods(neighborhoods.map(nh => nh.id === currentNeighborhood.id ? currentNeighborhood : nh));
        } else {
            // 追加
            const newId = neighborhoods.length > 0 ? Math.max(...neighborhoods.map(nh => nh.id)) + 1 : 1;
            setNeighborhoods([...neighborhoods, { ...currentNeighborhood, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setNeighborhoods(neighborhoods.filter(nh => nh.id !== id));
        }
    };

    // フィルター適用
    const filteredNeighborhoods = neighborhoods.filter(nh => {
        const matchesSearch = filters.search === '' || nh.type.includes(filters.search) || nh.details.includes(filters.search);
        // 他のフィルター条件を追加する場合はここに記述
        return matchesSearch;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>種類</TableCell>
                        <TableCell>内容</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredNeighborhoods.map((nh) => (
                        <TableRow key={nh.id}>
                            <TableCell>{nh.type}</TableCell>
                            <TableCell>{nh.details}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(nh)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(nh.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredNeighborhoods.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">該当する近隣情報がありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                近隣情報追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentNeighborhood && currentNeighborhood.id ? '近隣情報編集' : '近隣情報追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="種類"
                                name="type"
                                value={currentNeighborhood ? currentNeighborhood.type : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="内容"
                                name="details"
                                value={currentNeighborhood ? currentNeighborhood.details : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">キャンセル</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">保存</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}

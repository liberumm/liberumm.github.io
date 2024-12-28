// datatable.js
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } = MaterialUI;

function DataTable() {
    const [data, setData] = React.useState([
        { id: 1, category: '売場設備', name: 'サミカフェ・私の喫茶室', seats: '〇', available: '〇' },
        { id: 2, category: '売場設備', name: '給茶機', seats: '〇', available: '〇' },
        { id: 3, category: '売場設備', name: 'コーヒー', seats: '〇', available: '〇' },
        // 他の設備もここに追加
    ]);

    const [open, setOpen] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(null);

    const handleOpen = (item = null) => {
        setCurrentItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentItem(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentItem.id) {
            // 更新
            setData(data.map(d => d.id === currentItem.id ? currentItem : d));
        } else {
            // 追加
            const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
            setData([...data, { ...currentItem, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setData(data.filter(d => d.id !== id));
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>カテゴリ</TableCell>
                        <TableCell>設備名</TableCell>
                        <TableCell>備考1</TableCell>
                        <TableCell>備考2</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.seats}</TableCell>
                            <TableCell>{item.available}</TableCell>
                            <TableCell className="action-buttons">
                                <Button size="small" onClick={() => handleOpen(item)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(item.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                設備追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentItem && currentItem.id ? '設備編集' : '設備追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="カテゴリ"
                                name="category"
                                value={currentItem ? currentItem.category : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="設備名"
                                name="name"
                                value={currentItem ? currentItem.name : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="備考1"
                                name="seats"
                                value={currentItem ? currentItem.seats : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="備考2"
                                name="available"
                                value={currentItem ? currentItem.available : ''}
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

window.DataTable = DataTable;

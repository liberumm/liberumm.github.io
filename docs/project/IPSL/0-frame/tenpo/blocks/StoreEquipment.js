// StoreEquipment.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Select, MenuItem, InputLabel, FormControl } = MaterialUI;

function StoreEquipment({ filters }) {
    const [equipment, setEquipment] = useState([
        { id: 1, category: '売場設備', name: 'サミカフェ・私の喫茶室', seats: '〇', available: '〇' },
        { id: 2, category: '売場設備', name: '給茶機', seats: '〇', available: '〇' },
        { id: 3, category: '売場設備', name: 'コーヒー', seats: '〇', available: '〇' },
        // 他の設備もここに追加
    ]);

    const [open, setOpen] = useState(false);
    const [currentEquipment, setCurrentEquipment] = useState(null);

    const handleOpen = (equipmentItem = null) => {
        setCurrentEquipment(equipmentItem);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentEquipment(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEquipment({
            ...currentEquipment,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentEquipment.id) {
            // 更新
            setEquipment(equipment.map(eq => eq.id === currentEquipment.id ? currentEquipment : eq));
        } else {
            // 追加
            const newId = equipment.length > 0 ? Math.max(...equipment.map(eq => eq.id)) + 1 : 1;
            setEquipment([...equipment, { ...currentEquipment, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setEquipment(equipment.filter(eq => eq.id !== id));
        }
    };

    // フィルター適用
    const filteredEquipment = equipment.filter(eq => {
        const matchesCategory = filters.equipmentCategory === 'all' || eq.category === filters.equipmentCategory;
        const matchesSearch = filters.search === '' || eq.name.includes(filters.search);
        // 他のフィルター条件を追加する場合はここに記述
        return matchesCategory && matchesSearch;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>カテゴリ</TableCell>
                        <TableCell>設備名</TableCell>
                        <TableCell>備考1</TableCell>
                        <TableCell>備考2</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredEquipment.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.seats}</TableCell>
                            <TableCell>{item.available}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(item)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(item.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredEquipment.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">該当する設備がありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                設備追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentEquipment && currentEquipment.id ? '設備編集' : '設備追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel>カテゴリ</InputLabel>
                                <Select
                                    label="カテゴリ"
                                    name="category"
                                    value={currentEquipment ? currentEquipment.category : ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="売場設備">売場設備</MenuItem>
                                    <MenuItem value="給茶機">給茶機</MenuItem>
                                    {/* 必要に応じて追加 */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="設備名"
                                name="name"
                                value={currentEquipment ? currentEquipment.name : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="備考1"
                                name="seats"
                                value={currentEquipment ? currentEquipment.seats : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="備考2"
                                name="available"
                                value={currentEquipment ? currentEquipment.available : ''}
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

// RenovationHistory.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } = MaterialUI;

function RenovationHistory({ filters }) {
    const [history, setHistory] = useState([
        {
            id: 1,
            date: '2023-05-10',
            content: '賃料改定',
            duration: '10日',
            contractor: '施工会社A',
            cost: '¥200,000',
            interiorCost: '',
            equipmentCost: '',
            otherOrders: '',
            additionalCost: '',
            totalCost: '¥200,000'
        },
        {
            id: 2,
            date: '2024-01-15',
            content: '契約更新',
            duration: '5日',
            contractor: '施工会社B',
            cost: '¥100,000',
            interiorCost: '',
            equipmentCost: '',
            otherOrders: '',
            additionalCost: '',
            totalCost: '¥100,000'
        },
        // 他の改修履歴もここに追加
    ]);

    const [open, setOpen] = useState(false);
    const [currentHistory, setCurrentHistory] = useState(null);

    const handleOpen = (historyItem = null) => {
        setCurrentHistory(historyItem);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentHistory(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentHistory({
            ...currentHistory,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentHistory.id) {
            // 更新
            setHistory(history.map(hh => hh.id === currentHistory.id ? currentHistory : hh));
        } else {
            // 追加
            const newId = history.length > 0 ? Math.max(...history.map(hh => hh.id)) + 1 : 1;
            setHistory([...history, { ...currentHistory, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setHistory(history.filter(hh => hh.id !== id));
        }
    };

    // フィルター適用
    const filteredHistory = history.filter(hh => {
        const matchesSearch = filters.search === '' || hh.content.includes(filters.search) || hh.contractor.includes(filters.search);
        // 他のフィルター条件を追加する場合はここに記述
        return matchesSearch;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>日付</TableCell>
                        <TableCell>内容</TableCell>
                        <TableCell>工事日数</TableCell>
                        <TableCell>施工業者</TableCell>
                        <TableCell>建築費</TableCell>
                        <TableCell>内装費</TableCell>
                        <TableCell>設備費</TableCell>
                        <TableCell>他部発注分</TableCell>
                        <TableCell>追加工事費</TableCell>
                        <TableCell>コスト計</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredHistory.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.content}</TableCell>
                            <TableCell>{item.duration}</TableCell>
                            <TableCell>{item.contractor}</TableCell>
                            <TableCell>{item.cost}</TableCell>
                            <TableCell>{item.interiorCost}</TableCell>
                            <TableCell>{item.equipmentCost}</TableCell>
                            <TableCell>{item.otherOrders}</TableCell>
                            <TableCell>{item.additionalCost}</TableCell>
                            <TableCell>{item.totalCost}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(item)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(item.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredHistory.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={11} align="center">該当する改修履歴がありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                改修履歴追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>{currentHistory && currentHistory.id ? '改修履歴編集' : '改修履歴追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="日付"
                                name="date"
                                type="date"
                                value={currentHistory ? currentHistory.date : ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="内容"
                                name="content"
                                type="text"
                                value={currentHistory ? currentHistory.content : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="工事日数"
                                name="duration"
                                type="text"
                                value={currentHistory ? currentHistory.duration : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="施工業者"
                                name="contractor"
                                type="text"
                                value={currentHistory ? currentHistory.contractor : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="建築費"
                                name="cost"
                                type="text"
                                value={currentHistory ? currentHistory.cost : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="内装費"
                                name="interiorCost"
                                type="text"
                                value={currentHistory ? currentHistory.interiorCost : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="設備費"
                                name="equipmentCost"
                                type="text"
                                value={currentHistory ? currentHistory.equipmentCost : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="他部発注分"
                                name="otherOrders"
                                type="text"
                                value={currentHistory ? currentHistory.otherOrders : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="追加工事費"
                                name="additionalCost"
                                type="text"
                                value={currentHistory ? currentHistory.additionalCost : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="コスト計"
                                name="totalCost"
                                type="text"
                                value={currentHistory ? currentHistory.totalCost : ''}
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

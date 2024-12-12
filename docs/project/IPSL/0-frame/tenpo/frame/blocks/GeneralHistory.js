// GeneralHistory.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } = MaterialUI;

function GeneralHistory({ filters }) {
    const [generalHistory, setGeneralHistory] = useState([
        {
            id: 1,
            date: '2023-03-10',
            meeting: '全体会議',
            personInCharge: '佐藤 花子',
            content: '新店舗開店に伴う準備状況報告'
        },
        // 他の履歴もここに追加
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
            setGeneralHistory(generalHistory.map(gh => gh.id === currentHistory.id ? currentHistory : gh));
        } else {
            // 追加
            const newId = generalHistory.length > 0 ? Math.max(...generalHistory.map(gh => gh.id)) + 1 : 1;
            setGeneralHistory([...generalHistory, { ...currentHistory, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setGeneralHistory(generalHistory.filter(gh => gh.id !== id));
        }
    };

    // フィルター適用
    const filteredGeneralHistory = generalHistory.filter(gh => {
        const matchesSearch = filters.search === '' || gh.meeting.includes(filters.search) || gh.content.includes(filters.search);
        // 他のフィルター条件を追加する場合はここに記述
        return matchesSearch;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>日付</TableCell>
                        <TableCell>会議</TableCell>
                        <TableCell>担当</TableCell>
                        <TableCell>内容</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredGeneralHistory.map((gh) => (
                        <TableRow key={gh.id}>
                            <TableCell>{gh.date}</TableCell>
                            <TableCell>{gh.meeting}</TableCell>
                            <TableCell>{gh.personInCharge}</TableCell>
                            <TableCell>{gh.content}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(gh)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(gh.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredGeneralHistory.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">該当する全般履歴がありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                全般履歴追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentHistory && currentHistory.id ? '全般履歴編集' : '全般履歴追加'}</DialogTitle>
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
                                label="会議"
                                name="meeting"
                                type="text"
                                value={currentHistory ? currentHistory.meeting : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="担当"
                                name="personInCharge"
                                type="text"
                                value={currentHistory ? currentHistory.personInCharge : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="内容"
                                name="content"
                                type="text"
                                value={currentHistory ? currentHistory.content : ''}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
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

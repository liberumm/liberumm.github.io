// Issues.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Select, MenuItem, InputLabel, FormControl } = MaterialUI;

function Issues({ filters }) {
    const [issues, setIssues] = useState([
        { id: 1, title: '設備故障', description: '給茶機が故障しました。修理が必要です。', status: '未解決' },
        { id: 2, title: '清掃不足', description: '店舗内の清掃が不十分です。改善をお願いします。', status: '解決済み' },
        // 他の課題もここに追加
    ]);

    const [open, setOpen] = useState(false);
    const [currentIssue, setCurrentIssue] = useState(null);

    const handleOpen = (issueItem = null) => {
        setCurrentIssue(issueItem);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentIssue(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentIssue({
            ...currentIssue,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentIssue.id) {
            // 更新
            setIssues(issues.map(iss => iss.id === currentIssue.id ? currentIssue : iss));
        } else {
            // 追加
            const newId = issues.length > 0 ? Math.max(...issues.map(iss => iss.id)) + 1 : 1;
            setIssues([...issues, { ...currentIssue, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setIssues(issues.filter(iss => iss.id !== id));
        }
    };

    // フィルター適用
    const filteredIssues = issues.filter(iss => {
        const matchesSearch = filters.search === '' || iss.title.includes(filters.search) || iss.description.includes(filters.search);
        // 他のフィルター条件を追加する場合はここに記述
        return matchesSearch;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>タイトル</TableCell>
                        <TableCell>説明</TableCell>
                        <TableCell>ステータス</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredIssues.map((issue) => (
                        <TableRow key={issue.id}>
                            <TableCell>{issue.title}</TableCell>
                            <TableCell>{issue.description}</TableCell>
                            <TableCell>{issue.status}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(issue)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(issue.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredIssues.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">該当する課題がありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                課題追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentIssue && currentIssue.id ? '課題編集' : '課題追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="タイトル"
                                name="title"
                                value={currentIssue ? currentIssue.title : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="説明"
                                name="description"
                                value={currentIssue ? currentIssue.description : ''}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel>ステータス</InputLabel>
                                <Select
                                    label="ステータス"
                                    name="status"
                                    value={currentIssue ? currentIssue.status : ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="未解決">未解決</MenuItem>
                                    <MenuItem value="解決済み">解決済み</MenuItem>
                                </Select>
                            </FormControl>
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

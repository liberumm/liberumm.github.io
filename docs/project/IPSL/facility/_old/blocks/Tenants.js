// Tenants.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } = MaterialUI;

function Tenants({ filters }) {
    const [tenants, setTenants] = useState([
        {
            id: 1,
            name: '100円均一',
            industry: '雑貨',
            businessHours: '9:00 ～ 21:00',
            contractType: '普通',
            startDate: '2023-04-01',
            endDate: '2024-03-31',
            rent: '¥100,000',
            parkingFee: '¥10,000',
            commission: '〇',
            notes: '特記事項なし',
        },
        // 他のテナントもここに追加
    ]);

    const [open, setOpen] = useState(false);
    const [currentTenant, setCurrentTenant] = useState(null);

    const handleOpen = (tenantItem = null) => {
        setCurrentTenant(tenantItem);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentTenant(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTenant({
            ...currentTenant,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentTenant.id) {
            // 更新
            setTenants(tenants.map(tn => tn.id === currentTenant.id ? currentTenant : tn));
        } else {
            // 追加
            const newId = tenants.length > 0 ? Math.max(...tenants.map(tn => tn.id)) + 1 : 1;
            setTenants([...tenants, { ...currentTenant, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setTenants(tenants.filter(tn => tn.id !== id));
        }
    };

    // フィルター適用
    const filteredTenants = tenants.filter(tn => {
        const matchesSearch = filters.search === '' || tn.name.includes(filters.search) || tn.industry.includes(filters.search);
        const matchesLocation = filters.location === 'all' || tn.contractType === filters.location; // 仮のロジック
        // 他のフィルター条件を追加する場合はここに記述
        return matchesSearch && matchesLocation;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>テナント名</TableCell>
                        <TableCell>業種</TableCell>
                        <TableCell>営業時間</TableCell>
                        <TableCell>契約タイプ</TableCell>
                        <TableCell>契約開始日</TableCell>
                        <TableCell>契約終了日</TableCell>
                        <TableCell>賃料</TableCell>
                        <TableCell>駐車料</TableCell>
                        <TableCell>事務手数料</TableCell>
                        <TableCell>特記事項</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredTenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                            <TableCell>{tenant.name}</TableCell>
                            <TableCell>{tenant.industry}</TableCell>
                            <TableCell>{tenant.businessHours}</TableCell>
                            <TableCell>{tenant.contractType}</TableCell>
                            <TableCell>{tenant.startDate}</TableCell>
                            <TableCell>{tenant.endDate}</TableCell>
                            <TableCell>{tenant.rent}</TableCell>
                            <TableCell>{tenant.parkingFee}</TableCell>
                            <TableCell>{tenant.commission}</TableCell>
                            <TableCell>{tenant.notes}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(tenant)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(tenant.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredTenants.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={11} align="center">該当するテナントがありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                テナント追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentTenant && currentTenant.id ? 'テナント編集' : 'テナント追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="テナント名"
                                name="name"
                                value={currentTenant ? currentTenant.name : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="業種"
                                name="industry"
                                value={currentTenant ? currentTenant.industry : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="営業時間"
                                name="businessHours"
                                value={currentTenant ? currentTenant.businessHours : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>契約タイプ</InputLabel>
                                <Select
                                    label="契約タイプ"
                                    name="contractType"
                                    value={currentTenant ? currentTenant.contractType : ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="普通">普通</MenuItem>
                                    <MenuItem value="定借">定借</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="契約開始日"
                                name="startDate"
                                type="date"
                                value={currentTenant ? currentTenant.startDate : ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="契約終了日"
                                name="endDate"
                                type="date"
                                value={currentTenant ? currentTenant.endDate : ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="賃料"
                                name="rent"
                                type="text"
                                value={currentTenant ? currentTenant.rent : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="駐車料"
                                name="parkingFee"
                                type="text"
                                value={currentTenant ? currentTenant.parkingFee : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={currentTenant ? currentTenant.commission === '〇' : false}
                                        onChange={(e) => setCurrentTenant({
                                            ...currentTenant,
                                            commission: e.target.checked ? '〇' : '✕'
                                        })}
                                        name="commission"
                                        color="primary"
                                    />
                                }
                                label="事務手数料"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="特記事項"
                                name="notes"
                                value={currentTenant ? currentTenant.notes : ''}
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

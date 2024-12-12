// ContractDetails.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Select, MenuItem, InputLabel, FormControl } = MaterialUI;

function ContractDetails({ filters }) {
    const [contracts, setContracts] = useState([
        {
            id: 1,
            contractType: '普通',
            startDate: '2023-01-01',
            endDate: '2024-12-31',
            rentTotal: '¥500,000',
            leasedAreaTotal: '100㎡',
            rentPerTsubo: '¥50,000',
            deposit: '¥1,000,000',
            guaranty: '¥1,000,000',
            renewalConditions: '条件A',
        },
        // 他の契約もここに追加
    ]);

    const [open, setOpen] = useState(false);
    const [currentContract, setCurrentContract] = useState(null);

    const handleOpen = (contractItem = null) => {
        setCurrentContract(contractItem);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentContract(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentContract({
            ...currentContract,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentContract.id) {
            // 更新
            setContracts(contracts.map(ct => ct.id === currentContract.id ? currentContract : ct));
        } else {
            // 追加
            const newId = contracts.length > 0 ? Math.max(...contracts.map(ct => ct.id)) + 1 : 1;
            setContracts([...contracts, { ...currentContract, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setContracts(contracts.filter(ct => ct.id !== id));
        }
    };

    // フィルター適用
    const filteredContracts = contracts.filter(ct => {
        const matchesType = filters.equipmentCategory === 'all' || ct.contractType === filters.equipmentCategory; // 仮のロジック
        const matchesSearch = filters.search === '' || ct.contractType.includes(filters.search) || ct.renewalConditions.includes(filters.search);
        // 他のフィルター条件を追加する場合はここに記述
        return matchesType && matchesSearch;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>契約タイプ</TableCell>
                        <TableCell>契約開始日</TableCell>
                        <TableCell>契約終了日</TableCell>
                        <TableCell>賃料合計</TableCell>
                        <TableCell>賃借面積合計</TableCell>
                        <TableCell>坪単価</TableCell>
                        <TableCell>敷金</TableCell>
                        <TableCell>保証金</TableCell>
                        <TableCell>更新条件</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                            <TableCell>{contract.contractType}</TableCell>
                            <TableCell>{contract.startDate}</TableCell>
                            <TableCell>{contract.endDate}</TableCell>
                            <TableCell>{contract.rentTotal}</TableCell>
                            <TableCell>{contract.leasedAreaTotal}</TableCell>
                            <TableCell>{contract.rentPerTsubo}</TableCell>
                            <TableCell>{contract.deposit}</TableCell>
                            <TableCell>{contract.guaranty}</TableCell>
                            <TableCell>{contract.renewalConditions}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(contract)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(contract.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredContracts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={10} align="center">該当する契約がありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                契約追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentContract && currentContract.id ? '契約編集' : '契約追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>契約タイプ</InputLabel>
                                <Select
                                    label="契約タイプ"
                                    name="contractType"
                                    value={currentContract ? currentContract.contractType : ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="普通">普通</MenuItem>
                                    <MenuItem value="定借">定借</MenuItem>
                                    <MenuItem value="事業用定期借地">事業用定期借地</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="契約開始日"
                                name="startDate"
                                type="date"
                                value={currentContract ? currentContract.startDate : ''}
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
                                value={currentContract ? currentContract.endDate : ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="賃料合計"
                                name="rentTotal"
                                type="text"
                                value={currentContract ? currentContract.rentTotal : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="賃借面積合計"
                                name="leasedAreaTotal"
                                type="text"
                                value={currentContract ? currentContract.leasedAreaTotal : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="坪単価"
                                name="rentPerTsubo"
                                type="text"
                                value={currentContract ? currentContract.rentPerTsubo : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="敷金"
                                name="deposit"
                                type="text"
                                value={currentContract ? currentContract.deposit : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="保証金"
                                name="guaranty"
                                type="text"
                                value={currentContract ? currentContract.guaranty : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="更新条件"
                                name="renewalConditions"
                                type="text"
                                value={currentContract ? currentContract.renewalConditions : ''}
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

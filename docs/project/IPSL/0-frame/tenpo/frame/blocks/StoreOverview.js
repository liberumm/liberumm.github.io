// StoreOverview.js
const { useState } = React;
const { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
    Grid, Checkbox, FormControlLabel, Typography, Switch 
} = MaterialUI;

function StoreOverview({ filters }) {
    const [data, setData] = useState({
        openDate: '2020-01',
        renovationDate: '2022-06',
        submissionDate: '2023-04-15',
        businessHours: '9:00 ～ 23:00',
        parkingRequired: 10,
        parkingSubmitted: 8,
        bicycleParkingRequired: 5,
        bicycleParkingSubmitted: 3,
        deliveryAvailableTime: '6:00 ～ 21:00',
        zoningArea: ['第一種中高層住居専用地域', '準立地法'],
        zoningApproved: [true, false],
        floorInfo: {
            aboveGround: 6,
            underground: 1,
            occupiedFloors: '1～2',
            ceilingHeight: '3m'
        },
        parkingDetails: {
            onSite: {
                total: 20,
                handicap: 2,
                paid: false,
                paymentMachine: true,
                partnerParking: 'タイムズ24',
                partnerParkingCount: 15,
                motorcycleCount: 5,
                management: '自社',
                usageConditions: '1,000円で2時間無料',
                excessFee: '30分200円'
            },
            offSite: {
                total: 30,
                handicap: 3,
                paid: true,
                paymentMachine: true,
                partnerParking: 'ナビパーク',
                partnerParkingCount: 20,
                motorcycleCount: 10,
                management: '自社',
                usageConditions: '1,000円で3時間無料',
                excessFee: '30分201円'
            }
        },
        // 他のフィールドもここに追加
    });

    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(data);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setEditData(data);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('zoningApproved')) {
            const index = parseInt(name.split('_')[1]);
            const updatedApproved = [...editData.zoningApproved];
            updatedApproved[index] = checked;
            setEditData({
                ...editData,
                zoningApproved: updatedApproved
            });
        } else if (name.startsWith('zoningArea')) {
            const index = parseInt(name.split('_')[1]);
            const updatedAreas = [...editData.zoningArea];
            updatedAreas[index] = value;
            setEditData({
                ...editData,
                zoningArea: updatedAreas
            });
        } else if (name.startsWith('parkingDetails')) {
            const [_, detailType, field] = name.split('_');
            setEditData({
                ...editData,
                parkingDetails: {
                    ...editData.parkingDetails,
                    [detailType]: {
                        ...editData.parkingDetails[detailType],
                        [field]: type === 'checkbox' ? checked : value
                    }
                }
            });
        } else if (name.startsWith('floorInfo')) {
            const field = name.split('_')[1];
            setEditData({
                ...editData,
                floorInfo: {
                    ...editData.floorInfo,
                    [field]: value
                }
            });
        } else {
            setEditData({
                ...editData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSave = () => {
        setData(editData);
        setOpen(false);
    };

    // フィルター適用
    const filteredZoningArea = data.zoningArea.filter((area, index) => {
        const matchesSearch = filters.search === '' || area.includes(filters.search);
        // 他のフィルター条件を追加する場合はここに記述
        return matchesSearch;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>項目</TableCell>
                        <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>内容</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>開店年月</TableCell>
                        <TableCell>{data.openDate}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>改装年月</TableCell>
                        <TableCell>{data.renovationDate}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>提出日</TableCell>
                        <TableCell>{data.submissionDate}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>営業時間</TableCell>
                        <TableCell>{data.businessHours}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>駐車場必要台数</TableCell>
                        <TableCell>{data.parkingRequired} 台</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>駐車場届出台数</TableCell>
                        <TableCell>{data.parkingSubmitted} 台</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>駐輪場必要台数</TableCell>
                        <TableCell>{data.bicycleParkingRequired} 台</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>駐輪場届出台数</TableCell>
                        <TableCell>{data.bicycleParkingSubmitted} 台</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>納品可能時間</TableCell>
                        <TableCell>{data.deliveryAvailableTime}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>用途地域</TableCell>
                        <TableCell>
                            {filteredZoningArea.map((area, index) => (
                                <div key={index}>
                                    <TextField
                                        name={`zoningArea_${index}`}
                                        value={editData.zoningArea[index]}
                                        onChange={handleChange}
                                        size="small"
                                        style={{ marginRight: 8 }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={editData.zoningApproved[index]}
                                                onChange={handleChange}
                                                name={`zoningApproved_${index}`}
                                                color="primary"
                                            />
                                        }
                                        label="〇/×"
                                    />
                                </div>
                            ))}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>階数</TableCell>
                        <TableCell>
                            地上: {data.floorInfo.aboveGround} 階,<br />
                            地下: {data.floorInfo.underground} 階,<br />
                            入居階: {data.floorInfo.occupiedFloors},<br />
                            天井高: {data.floorInfo.ceilingHeight}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>駐車場（敷地内）</TableCell>
                        <TableCell>
                            台数: {data.parkingDetails.onSite.total} 台<br />
                            身障者用台数: {data.parkingDetails.onSite.handicap} 台<br />
                            有料／無料: {data.parkingDetails.onSite.paid ? '有料' : '無料'}<br />
                            精算機: {data.parkingDetails.onSite.paymentMachine ? 'あり' : 'なし'}<br />
                            提携駐車場: {data.parkingDetails.onSite.partnerParking} ({data.parkingDetails.onSite.partnerParkingCount} 台)<br />
                            バイク台数: {data.parkingDetails.onSite.motorcycleCount} 台<br />
                            管理: {data.parkingDetails.onSite.management}<br />
                            利用条件: {data.parkingDetails.onSite.usageConditions}<br />
                            超過料金: {data.parkingDetails.onSite.excessFee}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>駐車場（敷地外）</TableCell>
                        <TableCell>
                            台数: {data.parkingDetails.offSite.total} 台<br />
                            身障者用台数: {data.parkingDetails.offSite.handicap} 台<br />
                            有料／無料: {data.parkingDetails.offSite.paid ? '有料' : '無料'}<br />
                            精算機: {data.parkingDetails.offSite.paymentMachine ? 'あり' : 'なし'}<br />
                            提携駐車場: {data.parkingDetails.offSite.partnerParking} ({data.parkingDetails.offSite.partnerParkingCount} 台)<br />
                            バイク台数: {data.parkingDetails.offSite.motorcycleCount} 台<br />
                            管理: {data.parkingDetails.offSite.management}<br />
                            利用条件: {data.parkingDetails.offSite.usageConditions}<br />
                            超過料金: {data.parkingDetails.offSite.excessFee}
                        </TableCell>
                    </TableRow>
                    {/* 必要に応じて他のフィールドも追加 */}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ margin: 16 }}>
                編集
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>店舗概要編集</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="開店年月"
                                name="openDate"
                                type="month"
                                value={editData.openDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="改装年月"
                                name="renovationDate"
                                type="month"
                                value={editData.renovationDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="提出日"
                                name="submissionDate"
                                type="date"
                                value={editData.submissionDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="営業時間"
                                name="businessHours"
                                value={editData.businessHours}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="駐車場必要台数"
                                name="parkingRequired"
                                type="number"
                                value={editData.parkingRequired}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="駐車場届出台数"
                                name="parkingSubmitted"
                                type="number"
                                value={editData.parkingSubmitted}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="駐輪場必要台数"
                                name="bicycleParkingRequired"
                                type="number"
                                value={editData.bicycleParkingRequired}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="駐輪場届出台数"
                                name="bicycleParkingSubmitted"
                                type="number"
                                value={editData.bicycleParkingSubmitted}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="納品可能時間"
                                name="deliveryAvailableTime"
                                type="text"
                                value={editData.deliveryAvailableTime}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        {/* 用途地域の編集フィールド */}
                        {editData.zoningArea.map((area, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label={`用途地域 ${index + 1}`}
                                        name={`zoningArea_${index}`}
                                        value={editData.zoningArea[index]}
                                        onChange={handleChange}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={editData.zoningApproved[index]}
                                                onChange={handleChange}
                                                name={`zoningApproved_${index}`}
                                                color="primary"
                                            />
                                        }
                                        label="〇/×"
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}
                        {/* 駐車場（敷地内）の編集フィールド */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">駐車場（敷地内）</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="台数"
                                name="parkingDetails_onSite_total"
                                type="number"
                                value={editData.parkingDetails.onSite.total}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="身障者用台数"
                                name="parkingDetails_onSite_handicap"
                                type="number"
                                value={editData.parkingDetails.onSite.handicap}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editData.parkingDetails.onSite.paid}
                                        onChange={handleChange}
                                        name="parkingDetails_onSite_paid"
                                        color="primary"
                                    />
                                }
                                label="有料／無料"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editData.parkingDetails.onSite.paymentMachine}
                                        onChange={handleChange}
                                        name="parkingDetails_onSite_paymentMachine"
                                        color="primary"
                                    />
                                }
                                label="精算機"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="提携駐車場名"
                                name="parkingDetails_onSite_partnerParking"
                                value={editData.parkingDetails.onSite.partnerParking}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="提携駐車場台数"
                                name="parkingDetails_onSite_partnerParkingCount"
                                type="number"
                                value={editData.parkingDetails.onSite.partnerParkingCount}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="バイク台数"
                                name="parkingDetails_onSite_motorcycleCount"
                                type="number"
                                value={editData.parkingDetails.onSite.motorcycleCount}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="管理"
                                name="parkingDetails_onSite_management"
                                type="text"
                                value={editData.parkingDetails.onSite.management}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="利用条件"
                                name="parkingDetails_onSite_usageConditions"
                                type="text"
                                value={editData.parkingDetails.onSite.usageConditions}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="超過料金"
                                name="parkingDetails_onSite_excessFee"
                                type="text"
                                value={editData.parkingDetails.onSite.excessFee}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        {/* 駐車場（敷地外）の編集フィールド */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">駐車場（敷地外）</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="台数"
                                name="parkingDetails_offSite_total"
                                type="number"
                                value={editData.parkingDetails.offSite.total}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="身障者用台数"
                                name="parkingDetails_offSite_handicap"
                                type="number"
                                value={editData.parkingDetails.offSite.handicap}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editData.parkingDetails.offSite.paid}
                                        onChange={handleChange}
                                        name="parkingDetails_offSite_paid"
                                        color="primary"
                                    />
                                }
                                label="有料／無料"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editData.parkingDetails.offSite.paymentMachine}
                                        onChange={handleChange}
                                        name="parkingDetails_offSite_paymentMachine"
                                        color="primary"
                                    />
                                }
                                label="精算機"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="提携駐車場名"
                                name="parkingDetails_offSite_partnerParking"
                                value={editData.parkingDetails.offSite.partnerParking}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="提携駐車場台数"
                                name="parkingDetails_offSite_partnerParkingCount"
                                type="number"
                                value={editData.parkingDetails.offSite.partnerParkingCount}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="バイク台数"
                                name="parkingDetails_offSite_motorcycleCount"
                                type="number"
                                value={editData.parkingDetails.offSite.motorcycleCount}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="管理"
                                name="parkingDetails_offSite_management"
                                type="text"
                                value={editData.parkingDetails.offSite.management}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="利用条件"
                                name="parkingDetails_offSite_usageConditions"
                                type="text"
                                value={editData.parkingDetails.offSite.usageConditions}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="超過料金"
                                name="parkingDetails_offSite_excessFee"
                                type="text"
                                value={editData.parkingDetails.offSite.excessFee}
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

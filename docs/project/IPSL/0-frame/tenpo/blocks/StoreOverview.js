// StoreOverview.js
const { useState } = React;
const { 
    Grid, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
    TextField, FormControlLabel, Switch, IconButton, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow 
} = MaterialUI;
const { Add, Remove } = MaterialUIIcons;

function StoreOverview({ filters }) {
    const [data, setData] = useState({
        basicInfo: {
            storeNumber: '001',
            storeName: 'サンプル店舗',
            openDate: '2020-01',
            renovationDate: '2022-06',
            updateDate: '2024-04-20',
        },
        addressInfo: {
            prefecture: '東京都',
            city: '新宿区',
            address: '西新宿2-8-1',
        },
        contactInfo: {
            phoneNumber: '03-1234-5678',
            faxNumber: '03-8765-4321',
            email: 'sample@store.com',
        },
        businessInfo: {
            basicBusinessHours: {
                startTime: '09:00',
                endTime: '21:00',
            },
            specialBusinessDays: [
                {
                    isOpen: true,
                    reason: '祝日営業',
                    businessHours: '10:00 ～ 18:00',
                    startTime: '10:00',
                    endTime: '18:00',
                },
                // 初期値として1つの特殊営業日を追加
            ],
        },
        buildingInfo: {
            floorArea: {
                totalArea: '500㎡',
                salesArea: '300㎡',
                workArea: '150㎡',
                parkingArea: '50㎡',
            },
            buildingDetails: {
                aboveGround: 6,       // 地上階数
                underground: 1,       // 地下階数
                numberOfFloors: 7,    // 階数（地上 + 地下）
                use: '商業用',         // 用途
                ceilingHeight: 3.0,   // 天井高(m)
                remarks: '特になし',   // 備考
            },
        },
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
        const nameParts = name.split('_');
        const category = nameParts[0];
        const field = nameParts[1];
        const subField = nameParts[2];

        if (category === 'businessInfo' && field === 'specialBusinessDays') {
            const index = parseInt(nameParts[3]);
            const dayField = nameParts[4];
            const updatedSpecialDays = [...editData.businessInfo.specialBusinessDays];
            if (dayField === 'isOpen') {
                updatedSpecialDays[index][dayField] = checked;
            } else {
                updatedSpecialDays[index][dayField] = value;
            }
            setEditData({
                ...editData,
                businessInfo: {
                    ...editData.businessInfo,
                    specialBusinessDays: updatedSpecialDays,
                },
            });
        } else if (category === 'buildingInfo' && field === 'buildingDetails') {
            const buildingField = nameParts[3];
            setEditData({
                ...editData,
                buildingInfo: {
                    ...editData.buildingInfo,
                    buildingDetails: {
                        ...editData.buildingInfo.buildingDetails,
                        [buildingField]: type === 'checkbox' ? checked : value
                    }
                }
            });
        } else {
            setEditData({
                ...editData,
                [category]: {
                    ...editData[category],
                    [field]: type === 'checkbox' ? checked : value
                }
            });
        }
    };

    const handleAddSpecialDay = () => {
        setEditData({
            ...editData,
            businessInfo: {
                ...editData.businessInfo,
                specialBusinessDays: [
                    ...editData.businessInfo.specialBusinessDays,
                    {
                        isOpen: true,
                        reason: '',
                        businessHours: '',
                        startTime: '',
                        endTime: '',
                    },
                ],
            },
        });
    };

    const handleRemoveSpecialDay = (index) => {
        const updatedSpecialDays = [...editData.businessInfo.specialBusinessDays];
        updatedSpecialDays.splice(index, 1);
        setEditData({
            ...editData,
            businessInfo: {
                ...editData.businessInfo,
                specialBusinessDays: updatedSpecialDays,
            },
        });
    };

    const handleSave = () => {
        setData(editData);
        setOpen(false);
    };

    return (
        <div>
            <Grid container spacing={3}>
                {/* 店舗基本情報 */}
                <Grid item xs={12} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>店舗基本情報</Typography>
                        <Typography><strong>店番:</strong> {data.basicInfo.storeNumber}</Typography>
                        <Typography><strong>店舗名:</strong> {data.basicInfo.storeName}</Typography>
                        <Typography><strong>開店年月:</strong> {data.basicInfo.openDate}</Typography>
                        <Typography><strong>改装年月:</strong> {data.basicInfo.renovationDate}</Typography>
                        <Typography><strong>データ更新日:</strong> {data.basicInfo.updateDate}</Typography>
                    </Paper>
                </Grid>

                {/* 住所情報 */}
                <Grid item xs={12} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>住所情報</Typography>
                        <Typography><strong>都道府県:</strong> {data.addressInfo.prefecture}</Typography>
                        <Typography><strong>市区町村:</strong> {data.addressInfo.city}</Typography>
                        <Typography><strong>番地・建物名:</strong> {data.addressInfo.address}</Typography>
                    </Paper>
                </Grid>

                {/* 連絡情報 */}
                <Grid item xs={12} md={4}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>連絡情報</Typography>
                        <Typography><strong>電話番号:</strong> {data.contactInfo.phoneNumber}</Typography>
                        <Typography><strong>FAX番号:</strong> {data.contactInfo.faxNumber}</Typography>
                        <Typography><strong>メールアドレス:</strong> {data.contactInfo.email}</Typography>
                    </Paper>
                </Grid>

                {/* 営業情報 */}
                <Grid item xs={12} md={6}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>営業情報</Typography>
                        <Typography variant="subtitle1" gutterBottom>基本営業時間</Typography>
                        <Typography><strong>開始時間:</strong> {data.businessInfo.basicBusinessHours.startTime}</Typography>
                        <Typography><strong>終了時間:</strong> {data.businessInfo.basicBusinessHours.endTime}</Typography>

                        <Typography variant="subtitle1" gutterBottom style={{ marginTop: 16 }}>特殊営業日</Typography>
                        {data.businessInfo.specialBusinessDays.length === 0 ? (
                            <Typography>特殊営業日が設定されていません。</Typography>
                        ) : (
                            <TableContainer component={Paper} style={{ marginTop: 8 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>日</strong></TableCell>
                                            <TableCell><strong>営業状況</strong></TableCell>
                                            <TableCell><strong>理由</strong></TableCell>
                                            <TableCell><strong>営業時間</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.businessInfo.specialBusinessDays.map((day, index) => (
                                            <TableRow key={index}>
                                                <TableCell>日 {index + 1}</TableCell>
                                                <TableCell>{day.isOpen ? '営業' : '休業'}</TableCell>
                                                <TableCell>{day.reason || '-'}</TableCell>
                                                <TableCell>{day.businessHours || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>

                {/* 建物情報 */}
                <Grid item xs={12} md={6}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>建物情報</Typography>
                        <Typography variant="subtitle1" gutterBottom>フロア面積</Typography>
                        <Typography><strong>総面積:</strong> {data.buildingInfo.floorArea.totalArea}</Typography>
                        <Typography><strong>売場面積:</strong> {data.buildingInfo.floorArea.salesArea}</Typography>
                        <Typography><strong>作業場面積:</strong> {data.buildingInfo.floorArea.workArea}</Typography>
                        <Typography><strong>駐車場面積:</strong> {data.buildingInfo.floorArea.parkingArea}</Typography>

                        <Typography variant="subtitle1" gutterBottom style={{ marginTop: 16 }}>建物詳細</Typography>
                        <TableContainer component={Paper} style={{ marginTop: 8 }}>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>地上階数</strong></TableCell>
                                        <TableCell>{data.buildingInfo.buildingDetails.aboveGround} 階</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>地下階数</strong></TableCell>
                                        <TableCell>{data.buildingInfo.buildingDetails.underground} 階</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>階数</strong></TableCell>
                                        <TableCell>{data.buildingInfo.buildingDetails.numberOfFloors} 階</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>用途</strong></TableCell>
                                        <TableCell>{data.buildingInfo.buildingDetails.use}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>天井高(m)</strong></TableCell>
                                        <TableCell>{data.buildingInfo.buildingDetails.ceilingHeight} m</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>備考</strong></TableCell>
                                        <TableCell>{data.buildingInfo.buildingDetails.remarks}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ margin: 16 }}>
                編集
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>店舗情報編集</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* 店舗基本情報 */}
                        <Grid item xs={12}>
                            <Typography variant="h6">店舗基本情報</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="店番"
                                name="basicInfo_storeNumber"
                                value={editData.basicInfo.storeNumber}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="店舗名"
                                name="basicInfo_storeName"
                                value={editData.basicInfo.storeName}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="開店年月"
                                name="basicInfo_openDate"
                                type="month"
                                value={editData.basicInfo.openDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="改装年月"
                                name="basicInfo_renovationDate"
                                type="month"
                                value={editData.basicInfo.renovationDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="データ更新日"
                                name="basicInfo_updateDate"
                                type="date"
                                value={editData.basicInfo.updateDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        {/* 住所情報 */}
                        <Grid item xs={12}>
                            <Typography variant="h6">住所情報</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="都道府県"
                                name="addressInfo_prefecture"
                                value={editData.addressInfo.prefecture}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="市区町村"
                                name="addressInfo_city"
                                value={editData.addressInfo.city}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="番地・建物名"
                                name="addressInfo_address"
                                value={editData.addressInfo.address}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        {/* 連絡情報 */}
                        <Grid item xs={12}>
                            <Typography variant="h6">連絡情報</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="電話番号"
                                name="contactInfo_phoneNumber"
                                value={editData.contactInfo.phoneNumber}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="FAX番号"
                                name="contactInfo_faxNumber"
                                value={editData.contactInfo.faxNumber}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="メールアドレス"
                                name="contactInfo_email"
                                type="email"
                                value={editData.contactInfo.email}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        {/* 営業情報 */}
                        <Grid item xs={12}>
                            <Typography variant="h6">営業情報</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">基本営業時間</Typography>
                            <TextField
                                label="開始時間"
                                name="businessInfo_basicBusinessHours_startTime"
                                type="time"
                                value={editData.businessInfo.basicBusinessHours.startTime}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 300 }} // 5分刻み
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="終了時間"
                                name="businessInfo_basicBusinessHours_endTime"
                                type="time"
                                value={editData.businessInfo.basicBusinessHours.endTime}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 300 }}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        {/* 特殊営業日 */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">特殊営業日</Typography>
                            {editData.businessInfo.specialBusinessDays.map((day, index) => (
                                <Grid container spacing={2} key={index} alignItems="center" style={{ marginBottom: 8 }}>
                                    <Grid item xs={12} sm={1}>
                                        <Typography>日 {index + 1}:</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={day.isOpen}
                                                    onChange={handleChange}
                                                    name={`businessInfo_specialBusinessDays_${index}_isOpen`}
                                                    color="primary"
                                                />
                                            }
                                            label={day.isOpen ? '営業' : '休業'}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="理由"
                                            name={`businessInfo_specialBusinessDays_${index}_reason`}
                                            value={day.reason}
                                            onChange={handleChange}
                                            fullWidth
                                            size="small"
                                            disabled={!day.isOpen}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            label="開始時間"
                                            name={`businessInfo_specialBusinessDays_${index}_startTime`}
                                            type="time"
                                            value={day.startTime}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ step: 300 }}
                                            fullWidth
                                            size="small"
                                            disabled={!day.isOpen}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            label="終了時間"
                                            name={`businessInfo_specialBusinessDays_${index}_endTime`}
                                            type="time"
                                            value={day.endTime}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ step: 300 }}
                                            fullWidth
                                            size="small"
                                            disabled={!day.isOpen}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            label="営業時間"
                                            name={`businessInfo_specialBusinessDays_${index}_businessHours`}
                                            value={day.businessHours}
                                            onChange={handleChange}
                                            fullWidth
                                            size="small"
                                            disabled={!day.isOpen}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <IconButton color="secondary" onClick={() => handleRemoveSpecialDay(index)}>
                                            <Remove />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button variant="outlined" color="primary" onClick={handleAddSpecialDay} startIcon={<Add />}>
                                特殊営業日を追加
                            </Button>
                        </Grid>

                        {/* 建物情報 */}
                        <Grid item xs={12}>
                            <Typography variant="h6">建物情報</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>項目</strong></TableCell>
                                            <TableCell><strong>内容</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>地上階数</TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="buildingInfo_buildingDetails_aboveGround"
                                                    type="number"
                                                    value={editData.buildingInfo.buildingDetails.aboveGround}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>地下階数</TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="buildingInfo_buildingDetails_underground"
                                                    type="number"
                                                    value={editData.buildingInfo.buildingDetails.underground}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>階数</TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="buildingInfo_buildingDetails_numberOfFloors"
                                                    type="number"
                                                    value={editData.buildingInfo.buildingDetails.numberOfFloors}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>用途</TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="buildingInfo_buildingDetails_use"
                                                    type="text"
                                                    value={editData.buildingInfo.buildingDetails.use}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>天井高(m)</TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="buildingInfo_buildingDetails_ceilingHeight"
                                                    type="number"
                                                    value={editData.buildingInfo.buildingDetails.ceilingHeight}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>備考</TableCell>
                                            <TableCell>
                                                <TextField
                                                    name="buildingInfo_buildingDetails_remarks"
                                                    type="text"
                                                    value={editData.buildingInfo.buildingDetails.remarks}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">キャンセル</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">保存</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

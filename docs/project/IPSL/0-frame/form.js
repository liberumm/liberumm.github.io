const { Box, Typography, Container, Grid, Link, TextField, Button } = MaterialUI;

function Form() {
    const [formState, setFormState] = React.useState({
        applicableDate: '',
        newEstablishmentDate: '',
        changeDate: '',
        abolitionDate: '',
        postDate: '',
        classCode: '',
        itemCode: '',
        priceTagType: '',
        posCode: '',
        specialSaleType: '',
        specialSaleCategory: '',
        purchaseCondition: '',
        discountExclusion: '',
        orderQuantity: '',
        maxOrderQuantity: '',
        orderUnitQuantity: '',
        regularType: '',
        additionalType: '',
        autoOrder: '',
        seasonType: '',
        salesPeriodStart: '',
        salesPeriodEnd: '',
        specialSalesPeriodStart: '',
        specialSalesPeriodEnd: '',
        attributeA: '',
        attributeB: '',
        attributeC: '',
        attributeD: '',
        attributeE: '',
        attributeF: '',
        attributeG: '',
        attributeH: '',
        attributeI: '',
        attributeJ: '',
        attributeK: '',
        attributeL: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formState);
    };

    return (
        <Container maxWidth="md" >
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 1 }}>
                商品情報管理
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="適用日"
                                name="applicableDate"
                                value={formState.applicableDate}
                                onChange={handleChange}
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h7" sx={{ mb: 2 }}>管理情報</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="新設年月日"
                                name="newEstablishmentDate"
                                value={formState.newEstablishmentDate}
                                onChange={handleChange}
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="変更年月日"
                                name="changeDate"
                                value={formState.changeDate}
                                onChange={handleChange}
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="廃止年月日"
                                name="abolitionDate"
                                value={formState.abolitionDate}
                                onChange={handleChange}
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="先付年月日"
                                name="postDate"
                                value={formState.postDate}
                                onChange={handleChange}
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h7" sx={{ mb: 2 }}>基本情報</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="クラスコード"
                                name="classCode"
                                size="small"
                                value={formState.classCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="アイテムコード"
                                name="itemCode"
                                size="small"
                                value={formState.itemCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={2} sm={2} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="値札区分"
                                name="priceTagType"
                                size="small"
                                value={formState.priceTagType}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>2段バーコード</option>
                                <option value={1}>JAN</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={10} sm={4} md={4}>
                            <TextField
                                fullWidth
                                label="POSコード"
                                name="posCode"
                                size="small"
                                value={formState.posCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                label="品番"
                                name="classCode"
                                size="small"
                                value={formState.classCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                label="商品名（漢）"
                                name="itemCode"
                                size="small"
                                value={formState.itemCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                label="商品名（カナ）"
                                name="itemCode"
                                size="small"
                                value={formState.itemCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <TextField
                                fullWidth
                                label="規格（漢）"
                                name="itemCode"
                                size="small"
                                value={formState.itemCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <TextField
                                fullWidth
                                label="規格（カナ）"
                                name="itemCode"
                                size="small"
                                value={formState.itemCode}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h7" sx={{ mb: 2 }}>販売管理情報</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="陳列記号"
                                name="posCode"
                                size="small"
                                value={formState.posCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="値札メッセージ"
                                name="priceTagType"
                                size="small"
                                value={formState.priceTagType}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>AAAAAA</option>
                                <option value={1}>BBBBBB</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={10} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="レシート品名"
                                name="posCode"
                                size="small"
                                value={formState.posCode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="シェルフラベル区分"
                                name="priceTagType"
                                size="small"
                                value={formState.priceTagType}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>AAAAAA</option>
                                <option value={1}>BBBBBB</option>
                            </TextField>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h7" sx={{ mb: 2 }}>発注情報</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="計画区分"
                                name="specialSaleType"
                                size="small"
                                value={formState.specialSaleType}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                label="計画数量"
                                name="orderQuantity"
                                size="small"
                                value={formState.orderQuantity}
                                onChange={handleChange}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="重点管理区分"
                                name="purchaseCondition"
                                size="small"
                                value={formState.purchaseCondition}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="割引除外"
                                name="discountExclusion"
                                size="small"
                                value={formState.discountExclusion}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="仕入条件"
                                name="purchaseCondition"
                                size="small"
                                value={formState.purchaseCondition}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="定番区分"
                                name="regularType"
                                size="small"
                                value={formState.regularType}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="追加区分"
                                name="additionalType"
                                size="small"
                                value={formState.additionalType}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <TextField
                                fullWidth
                                select
                                label="自動発注"
                                name="autoOrder"
                                size="small"
                                value={formState.autoOrder}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4}>
                            <TextField
                                fullWidth
                                label="発注入数"
                                name="orderUnitQuantity"
                                size="small"
                                value={formState.orderUnitQuantity}
                                onChange={handleChange}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={4} sm={4} md={4}>
                            <TextField
                                fullWidth
                                label="発注最大数"
                                name="maxOrderQuantity"
                                size="small"
                                value={formState.maxOrderQuantity}
                                onChange={handleChange}
                                type="number"
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h7" sx={{ mb: 2 }}>販売期間</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={2} sm={2} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="季節区分"
                                name="seasonType"
                                size="small"
                                value={formState.seasonType}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>年間</option>
                                <option value={1}>春</option>
                                <option value={2}>夏</option>
                                <option value={3}>秋</option>
                                <option value={4}>冬</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={5} sm={5} md={5}>
                            <TextField
                                fullWidth
                                label="販売期間開始"
                                name="salesPeriodStart"
                                size="small"
                                value={formState.salesPeriodStart}
                                onChange={handleChange}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={5} sm={5} md={5}>
                            <TextField
                                fullWidth
                                label="販売期間終了"
                                name="salesPeriodEnd"
                                size="small"
                                value={formState.salesPeriodEnd}
                                onChange={handleChange}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h7" sx={{ mb: 2 }}>特売期間</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={2} sm={2} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="特売区分"
                                name="specialSaleCategory"
                                size="small"
                                value={formState.specialSaleCategory}
                                onChange={handleChange}
                                SelectProps={{
                                    native: false,
                                }}
                            >
                                <option value={0}>対象外</option>
                                <option value={1}>対象</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={5} sm={5} md={5}>
                            <TextField
                                fullWidth
                                label="特売期間開始"
                                name="specialSalesPeriodStart"
                                size="small"
                                value={formState.specialSalesPeriodStart}
                                onChange={handleChange}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={5} sm={5} md={5}>
                            <TextField
                                fullWidth
                                label="特売期間終了"
                                size="small"
                                name="specialSalesPeriodEnd"
                                value={formState.specialSalesPeriodEnd}
                                onChange={handleChange}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h7" sx={{ mb: 2 }}>MD情報</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性A"
                                name="attributeA"
                                size="small"
                                value={formState.attributeA}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性B"
                                name="attributeB"
                                size="small"
                                value={formState.attributeB}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性C"
                                name="attributeC"
                                size="small"
                                value={formState.attributeC}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性D"
                                name="attributeD"
                                size="small"
                                value={formState.attributeD}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性E"
                                name="attributeE"
                                size="small"
                                value={formState.attributeE}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性F"
                                name="attributeF"
                                size="small"
                                value={formState.attributeF}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性G"
                                name="attributeG"
                                size="small"
                                value={formState.attributeG}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性H"
                                name="attributeH"
                                size="small"
                                value={formState.attributeH}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性I"
                                name="attributeI"
                                size="small"
                                value={formState.attributeI}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性J"
                                name="attributeJ"
                                size="small"
                                value={formState.attributeJ}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性K"
                                name="attributeK"
                                size="small"
                                value={formState.attributeK}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                            <TextField
                                fullWidth
                                label="商品属性L"
                                name="attributeL"
                                size="small"
                                value={formState.attributeL}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 1 }}>
                    <Button type="submit" variant="contained" color="primary">
                        登録
                    </Button>
                </Box>
            </form>
        </Container>
    );
}
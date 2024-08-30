const { useState } = React;
const { Grid, TextField, MenuItem, Box, Button, Collapse, Typography } = MaterialUI;

function FilterAdd() {
    // 各軸に対応するステート
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [city, setCity] = useState('');
    const [store, setStore] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [customerAge, setCustomerAge] = useState('');
    const [sales, setSales] = useState('');
    const [profitMargin, setProfitMargin] = useState('');
    const [weatherCondition, setWeatherCondition] = useState('');
    const [customerBehavior, setCustomerBehavior] = useState('');

    // 各フィルタの選択肢データ（サンプル）
    const years = [2021, 2022, 2023];
    const months = ['1月', '2月', '3月', '4月', '5月'];
    const cities = ['東京', '大阪', '名古屋', '福岡'];
    const stores = ['店舗A', '店舗B', '店舗C'];
    const productCategories = ['家電', '衣料品', '食品'];
    const customerAges = ['18-25', '26-35', '36-45', '46-60'];
    const weatherConditions = ['晴れ', '雨', '曇り'];
    const customerBehaviors = ['初回購入', 'リピート購入', 'ウェブ閲覧のみ'];

    // フィルタセクションの表示/非表示を管理するステート
    const [showFilters, setShowFilters] = useState(false);  // デフォルトを閉じた状態に変更

    // フィルタ適用の関数
    const applyFilters = () => {
        console.log('Filters applied:', {
            year, month, city, store, productCategory, customerAge, sales, profitMargin, weatherCondition, customerBehavior
        });
    };

    return (
        <Box px={3} py={2}>
            {/* フィルタセクションのトグルボタン */}
            <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => setShowFilters(!showFilters)}>
                <span className="material-icons">filter_list</span>
                <Typography variant="h6" ml={1}>フィルター</Typography>
                <span className="material-icons">
                    {showFilters ? "expand_less" : "expand_more"}
                </span>
            </Box>

            <Collapse in={showFilters}>
                <Grid container spacing={2} mt={2}>
                    {/* 時間軸 */}
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="年度"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            fullWidth
                        >
                            {years.map(y => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="月度"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            fullWidth
                        >
                            {months.map(m => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* 空間軸 */}
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="都市"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            fullWidth
                        >
                            {cities.map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="店舗"
                            value={store}
                            onChange={(e) => setStore(e.target.value)}
                            fullWidth
                        >
                            {stores.map(s => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* 属性軸 */}
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="商品カテゴリ"
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                            fullWidth
                        >
                            {productCategories.map(pc => (
                                <MenuItem key={pc} value={pc}>{pc}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="顧客年齢"
                            value={customerAge}
                            onChange={(e) => setCustomerAge(e.target.value)}
                            fullWidth
                        >
                            {customerAges.map(age => (
                                <MenuItem key={age} value={age}>{age}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* 測定軸 */}
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            label="売上高"
                            type="number"
                            value={sales}
                            onChange={(e) => setSales(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            label="利益率"
                            type="number"
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    {/* 条件軸 */}
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="天候条件"
                            value={weatherCondition}
                            onChange={(e) => setWeatherCondition(e.target.value)}
                            fullWidth
                        >
                            {weatherConditions.map(wc => (
                                <MenuItem key={wc} value={wc}>{wc}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* 顧客行動軸 */}
                    <Grid item xs={6} sm={4} md={2}>
                        <TextField
                            select
                            label="顧客行動"
                            value={customerBehavior}
                            onChange={(e) => setCustomerBehavior(e.target.value)}
                            fullWidth
                        >
                            {customerBehaviors.map(cb => (
                                <MenuItem key={cb} value={cb}>{cb}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* 適用ボタン */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={applyFilters}
                            fullWidth
                        >
                            フィルタを適用
                        </Button>
                    </Grid>
                </Grid>
            </Collapse>
        </Box>
    );
}

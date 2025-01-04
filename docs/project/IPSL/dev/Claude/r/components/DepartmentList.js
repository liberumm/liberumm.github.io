const { Grid, Paper, Typography, Box, useTheme, Tabs, Tab, ToggleButtonGroup, ToggleButton, Divider } = MaterialUI;
const { useState } = React;

function DepartmentList() {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    // 各指標ごとのフィルター状態
    const [filters, setFilters] = useState({
        sales: { budget: 'all', yoy: 'all' },
        inventory: { budget: 'all', yoy: 'all' },
        profit: { budget: 'all', yoy: 'all' }
    });

    // フィルター変更ハンドラ
    const handleFilterChange = (metric, type, value) => {
        if (value) {
            setFilters(prev => ({
                ...prev,
                [metric]: {
                    ...prev[metric],
                    [type]: value
                }
            }));
        }
    };

    const metrics = [
        { value: 'sales', label: '売上高', planLabel: '予算比' },
        { value: 'inventory', label: '在庫高', planLabel: '計画比' },
        { value: 'profit', label: '売上総利益高', planLabel: '予算比' }
    ];

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const hierarchyData = {
        bumon: [
            { code: 'X1', name: '青果', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },
            { code: 'X2', name: '鮮魚', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },
            { code: 'X3', name: '精肉', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },
            { code: 'X4', name: '総菜', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },
            { code: 'X5', name: '家庭用品', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },
            { code: 'X6', name: 'ベーカリー', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },
            { code: 'X7', name: '衣料', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },

        ],
        corner: [
            { 
                code: '070', 
                name: 'レディースヤング＆ベーシック', 
                sales: 100000,
                salesBudgetRatio: 95,
                salesYoyRatio: 100,
                inventory: 50000,
                inventoryPlanRatio: 92,
                inventoryYoyRatio: 98,
                profit: 30000,
                profitBudgetRatio: 94,
                profitYoyRatio: 101
            },
            { code: '071', name: 'レディースエルダー＆プラスサイズ', sales: 150000, salesBudgetRatio: 92, salesYoyRatio: 101, inventory: 75000, inventoryPlanRatio: 90, inventoryYoyRatio: 99, profit: 45000, profitBudgetRatio: 93, profitYoyRatio: 102 },
            { code: '072', name: 'ファッショングッズ', sales: 80000, salesBudgetRatio: 88, salesYoyRatio: 95, inventory: 40000, inventoryPlanRatio: 85, inventoryYoyRatio: 94, profit: 24000, profitBudgetRatio: 89, profitYoyRatio: 96 },
            { code: '073', name: 'メンズ', sales: 120000, salesBudgetRatio: 94, salesYoyRatio: 98, inventory: 60000, inventoryPlanRatio: 91, inventoryYoyRatio: 97, profit: 36000, profitBudgetRatio: 92, profitYoyRatio: 99 },
            { code: '074', name: 'キッズ', sales: 70000, salesBudgetRatio: 91, salesYoyRatio: 102, inventory: 35000, inventoryPlanRatio: 88, inventoryYoyRatio: 101, profit: 21000, profitBudgetRatio: 90, profitYoyRatio: 103 },
            { code: '075', name: 'ベビー', sales: 60000, salesBudgetRatio: 89, salesYoyRatio: 101, inventory: 30000, inventoryPlanRatio: 86, inventoryYoyRatio: 100, profit: 18000, profitBudgetRatio: 88, profitYoyRatio: 102 },
            { code: '076', name: 'ナイティー', sales: 40000, salesBudgetRatio: 87, salesYoyRatio: 100, inventory: 20000, inventoryPlanRatio: 84, inventoryYoyRatio: 99, profit: 12000, profitBudgetRatio: 86, profitYoyRatio: 101 },
            { code: '077', name: 'レディースインナー', sales: 90000, salesBudgetRatio: 93, salesYoyRatio: 104, inventory: 45000, inventoryPlanRatio: 90, inventoryYoyRatio: 103, profit: 27000, profitBudgetRatio: 92, profitYoyRatio: 105 },
            { code: '078', name: 'メンズ・キッズインナー', sales: 85000, salesBudgetRatio: 90, salesYoyRatio: 97, inventory: 42500, inventoryPlanRatio: 87, inventoryYoyRatio: 96, profit: 25500, profitBudgetRatio: 89, profitYoyRatio: 98 },
            { code: '079', name: 'ソックス', sales: 30000, salesBudgetRatio: 86, salesYoyRatio: 95, inventory: 15000, inventoryPlanRatio: 83, inventoryYoyRatio: 94, profit: 9000, profitBudgetRatio: 85, profitYoyRatio: 96 },
            { code: '080', name: 'リビング', sales: 110000, salesBudgetRatio: 100, salesYoyRatio: 100, inventory: 55000, inventoryPlanRatio: 97, inventoryYoyRatio: 99, profit: 33000, profitBudgetRatio: 98, profitYoyRatio: 101 },
            { code: '082', name: 'シューズ＆バッグ', sales: 95000, salesBudgetRatio: 92, salesYoyRatio: 100, inventory: 47500, inventoryPlanRatio: 89, inventoryYoyRatio: 99, profit: 28500, profitBudgetRatio: 91, profitYoyRatio: 101 }
        ],
        line: [
            { code: 'L01', name: 'カジュアル', sales: 80000, salesBudgetRatio: 100, salesYoyRatio: 102, inventory: 40000, inventoryPlanRatio: 97, inventoryYoyRatio: 101, profit: 24000, profitBudgetRatio: 99, profitYoyRatio: 103 },
            { code: 'L02', name: 'フォーマル', sales: 60000, salesBudgetRatio: 91, salesYoyRatio: 98, inventory: 30000, inventoryPlanRatio: 88, inventoryYoyRatio: 97, profit: 18000, profitBudgetRatio: 90, profitYoyRatio: 99 },
            { code: 'L03', name: 'スポーツ', sales: 40000, salesBudgetRatio: 89, salesYoyRatio: 101, inventory: 20000, inventoryPlanRatio: 86, inventoryYoyRatio: 100, profit: 12000, profitBudgetRatio: 88, profitYoyRatio: 102 },
        ],
        category: [
            { code: 'C01', name: 'トップス', sales: 50000, salesBudgetRatio: 94, salesYoyRatio: 99, inventory: 25000, inventoryPlanRatio: 91, inventoryYoyRatio: 98, profit: 15000, profitBudgetRatio: 93, profitYoyRatio: 100 },
            { code: 'C02', name: 'ボトムス', sales: 45000, salesBudgetRatio: 100, salesYoyRatio: 97, inventory: 22500, inventoryPlanRatio: 97, inventoryYoyRatio: 96, profit: 13500, profitBudgetRatio: 99, profitYoyRatio: 98 },
            { code: 'C03', name: 'ワンピース', sales: 35000, salesBudgetRatio: 90, salesYoyRatio: 103, inventory: 17500, inventoryPlanRatio: 87, inventoryYoyRatio: 102, profit: 10500, profitBudgetRatio: 89, profitYoyRatio: 104 },
        ],
        item: [
            { code: 'I01', name: 'Tシャツ', sales: 30000, salesBudgetRatio: 96, salesYoyRatio: 101, inventory: 15000, inventoryPlanRatio: 93, inventoryYoyRatio: 100, profit: 9000, profitBudgetRatio: 95, profitYoyRatio: 102 },
            { code: 'I02', name: 'シャツ', sales: 25000, salesBudgetRatio: 100, salesYoyRatio: 98, inventory: 12500, inventoryPlanRatio: 97, inventoryYoyRatio: 97, profit: 7500, profitBudgetRatio: 99, profitYoyRatio: 99 },
            { code: 'I03', name: 'パンツ', sales: 20000, salesBudgetRatio: 91, salesYoyRatio: 100, inventory: 10000, inventoryPlanRatio: 88, inventoryYoyRatio: 99, profit: 6000, profitBudgetRatio: 90, profitYoyRatio: 101 },
        ],
        sku: [
            { code: 'S01', name: 'Tシャツ白M', sales: 15000, salesBudgetRatio: 95, salesYoyRatio: 99, inventory: 7500, inventoryPlanRatio: 92, inventoryYoyRatio: 98, profit: 4500, profitBudgetRatio: 94, profitYoyRatio: 100 },
            { code: 'S02', name: 'Tシャツ黒L', sales: 12000, salesBudgetRatio: 100, salesYoyRatio: 97, inventory: 6000, inventoryPlanRatio: 97, inventoryYoyRatio: 96, profit: 3600, profitBudgetRatio: 99, profitYoyRatio: 98 },
            { code: 'S03', name: 'シャツ青M', sales: 10000, salesBudgetRatio: 90, salesYoyRatio: 102, inventory: 5000, inventoryPlanRatio: 87, inventoryYoyRatio: 101, profit: 3000, profitBudgetRatio: 89, profitYoyRatio: 103 },
        ]
    };

    const formatValue = (value) => {
        return new Intl.NumberFormat('ja-JP').format(value);
    };

    const filterData = (data) => {
        return data.filter(item => {
            // 売上高フィルター
            const salesBudgetMatch = filters.sales.budget === 'all' ? true :
                filters.sales.budget === 'achieved' ? item.salesBudgetRatio >= 100 : item.salesBudgetRatio < 100;
            const salesYoyMatch = filters.sales.yoy === 'all' ? true :
                filters.sales.yoy === 'increased' ? item.salesYoyRatio >= 100 : item.salesYoyRatio < 100;

            // 在庫高フィルター
            const inventoryBudgetMatch = filters.inventory.budget === 'all' ? true :
                filters.inventory.budget === 'achieved' ? item.inventoryPlanRatio >= 100 : item.inventoryPlanRatio < 100;
            const inventoryYoyMatch = filters.inventory.yoy === 'all' ? true :
                filters.inventory.yoy === 'increased' ? item.inventoryYoyRatio >= 100 : item.inventoryYoyRatio < 100;

            // 売上総利益高フィルター
            const profitBudgetMatch = filters.profit.budget === 'all' ? true :
                filters.profit.budget === 'achieved' ? item.profitBudgetRatio >= 100 : item.profitBudgetRatio < 100;
            const profitYoyMatch = filters.profit.yoy === 'all' ? true :
                filters.profit.yoy === 'increased' ? item.profitYoyRatio >= 100 : item.profitYoyRatio < 100;

            return (salesBudgetMatch && salesYoyMatch) &&
                   (inventoryBudgetMatch && inventoryYoyMatch) &&
                   (profitBudgetMatch && profitYoyMatch);
        });
    };

    const getCurrentData = () => {
        let data;
        switch (tabValue) {
            case 0: data = hierarchyData.bumon; break;
            case 1: data = hierarchyData.corner; break;
            case 2: data = hierarchyData.line; break;
            case 3: data = hierarchyData.category; break;
            case 4: data = hierarchyData.item; break;
            case 5: data = hierarchyData.sku; break;
            default: data = hierarchyData.corner;
        }
        return filterData(data);
    };

    const MetricDisplay = ({ label, value, planRatio, yoyRatio, planLabel = '予算比' }) => (
        <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="primary" gutterBottom>
                {label}
            </Typography>
            <Typography variant="h6" align="right" sx={{ mb: 0.5 }}>
                {formatValue(value)}千円
            </Typography>
            <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1
            }}>
                <Typography 
                    variant="caption" 
                    align="center"
                    sx={{
                        bgcolor: planRatio >= 100 ? 'success.light' : 'error.light',
                        color: 'white',
                        p: 0.5,
                        borderRadius: 1
                    }}
                >
                    {planLabel} {planRatio}%
                </Typography>
                <Typography 
                    variant="caption" 
                    align="center"
                    sx={{
                        bgcolor: yoyRatio >= 100 ? 'success.light' : 'error.light',
                        color: 'white',
                        p: 0.5,
                        borderRadius: 1
                    }}
                >
                    前年比 {yoyRatio}%
                </Typography>
            </Box>
        </Box>
    );

    // フィルターコントロールコンポーネントを修正
    const FilterControls = ({ metric, label, planLabel }) => (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1,
            alignItems: 'center', 
            width: '100%'
        }}>
            <Typography variant="subtitle2" color="primary">{label}</Typography>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 }
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    minWidth: { sm: '200px' }
                    
                }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ width: '60px' }}
                        
                    >
                        {planLabel}:
                    </Typography>
                    <ToggleButtonGroup
                        size="small"
                        value={filters[metric].budget}
                        exclusive
                        onChange={(e, value) => handleFilterChange(metric, 'budget', value)}
                        sx={{ flex: 1 }}
                    >
                        <ToggleButton value="all">全て</ToggleButton>
                        <ToggleButton value="achieved">以上</ToggleButton>
                        <ToggleButton value="unachieved">未満</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    minWidth: { sm: '200px' }
                }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ width: '60px' }}
                    >
                        前年比:
                    </Typography>
                    <ToggleButtonGroup
                        size="small"
                        value={filters[metric].yoy}
                        exclusive
                        onChange={(e, value) => handleFilterChange(metric, 'yoy', value)}
                        sx={{ flex: 1 }}
                    >
                        <ToggleButton value="all">全て</ToggleButton>
                        <ToggleButton value="increased">以上</ToggleButton>
                        <ToggleButton value="decreased">未満</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={2} sx={{ mb: 2 }}>
                <Box sx={{ borderBottom: 1, bgcolor: theme.palette.grey[100], borderColor: 'divider' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                minWidth: { xs: 'auto', sm: 120 },
                                px: { xs: 1, sm: 2 }
                            }
                        }}
                    >
                        <Tab label="部門" />
                        <Tab label="コーナー" />
                        <Tab label="ライン" />
                        <Tab label="カテゴリ" />
                        <Tab label="アイテム" />
                        <Tab label="SKU" />
                    </Tabs>
                </Box>

                <Box sx={{ 
                    p: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2
                }}>
                    <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        gap: 2
                    }}>
                        <FilterControls metric="sales" label="売上高" planLabel="予算比" />
                    </Box>
                    <Divider orientation={{ xs: 'horizontal', md: 'vertical' }} flexItem />
                    <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        gap: 2
                    }}>
                        <FilterControls metric="inventory" label="在庫高" planLabel="計画比" />
                    </Box>
                    <Divider orientation={{ xs: 'horizontal', md: 'vertical' }} flexItem />
                    <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        gap: 2
                    }}>
                        <FilterControls metric="profit" label="売上総利益高" planLabel="予算比" />
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={1}>
                {getCurrentData().map((item) => (
                    <Grid item xs={6} sm={3} md={2} key={item.code}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 2,
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                            onClick={() => window.location.href = `/${tabValue}/${item.code}`}
                        >
                            <Typography 
                                variant="subtitle1" 
                                sx={{   
                                    mb: 1,
                                    height: '3em',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                    }}
                            >
                                {item.code}: {item.name}
                            </Typography>

                            <MetricDisplay 
                                label="売上高"
                                value={item.sales}
                                planRatio={item.salesBudgetRatio}
                                yoyRatio={item.salesYoyRatio}
                                planLabel="予算比"
                            />
                            <MetricDisplay 
                                label="在庫高"
                                value={item.inventory}
                                planRatio={item.inventoryPlanRatio}
                                yoyRatio={item.inventoryYoyRatio}
                                planLabel="計画比"
                            />
                            <MetricDisplay 
                                label="売上総利益高"
                                value={item.profit}
                                planRatio={item.profitBudgetRatio}
                                yoyRatio={item.profitYoyRatio}
                                planLabel="予算比"
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
window.DepartmentList = DepartmentList;
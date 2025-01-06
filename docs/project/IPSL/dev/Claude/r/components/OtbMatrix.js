// components/OTBMatrix.js
function OTBMatrix(props) {
    const {
        Box,
        Paper,
        Typography,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Select,
        MenuItem,
        InputLabel,
        FormControl,
        Button,
        Tabs,
        Tab,
        Grid
    } = MaterialUI;

    const [viewMode, setViewMode] = React.useState('weekly'); // 'daily', 'weekly', 'monthly'
    const [classificationUnit, setClassificationUnit] = React.useState('department'); // デフォルトは部門
    const [timeUnit, setTimeUnit] = React.useState('weekly'); // 'daily', 'weekly', 'monthly'

    // タブラベルと対応するデータキー
    const classificationOptions = [
        { label: '全社', value: 'all' },
        { label: '部門', value: 'department' },
        { label: 'コーナー', value: 'corner' },
        { label: 'ライン', value: 'line' },
        { label: 'カテゴリ', value: 'category' },
        { label: 'アイテム', value: 'item' },
        { label: 'SKU', value: 'SKU' },
    ];

    // 各項目ラベル
    const itemLabels = ['期初在庫', '売上', '売価変更', '仕入', '期末在庫'];

    // 期間ごとのデータを作成する関数
    const createDailyPeriods = (year) => {
        const periods = [];
        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                periods.push({
                    period: `${month + 1}月${day}日`,
                    start: formatDateToJST(date),
                    end: formatDateToJST(date),
                    businessDays: 1 // 営業日を全ての日とするため1
                });
            }
        }
        return periods;
    };

    const createWeeklyPeriods = (year) => {
        const periods = [];
        const firstDayOfYear = new Date(year, 0, 1);
        let currentStart = getMonday(firstDayOfYear);
        const lastDayOfYear = new Date(year, 11, 31);

        while (currentStart <= lastDayOfYear) {
            let periodStart = new Date(currentStart);
            let periodEnd = new Date(currentStart);
            periodEnd.setDate(periodEnd.getDate() + 6);

            if (periodEnd > lastDayOfYear) {
                periodEnd = new Date(lastDayOfYear);
            }

            // 営業日を全ての日とするため、businessDaysは7
            const businessDays = Math.min(7, Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24)) + 1);

            periods.push({
                period: `第${periods.length + 1}週`,
                start: formatDateToJST(periodStart),
                end: formatDateToJST(periodEnd),
                businessDays: businessDays
            });

            currentStart.setDate(currentStart.getDate() + 7);
        }

        return periods;
    };

    const createMonthlyPeriods = (year) => {
        const periods = [];
        for (let month = 0; month < 12; month++) {
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0); // 月の最終日
            const businessDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // 全日数
            periods.push({
                period: `${month + 1}月`,
                start: formatDateToJST(start),
                end: formatDateToJST(end),
                businessDays: businessDays
            });
        }
        return periods;
    };

    // 営業日を計算する関数（全ての日を営業日とする）
    const calculateBusinessDays = (start, end) => {
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // 全日数
    };

    // 分類単位のリストを取得する関数を分離
    const getClassifications = React.useCallback((data, unit) => {
        if (unit === 'all') {
            return ['全社'];
        }
        const unique = new Set();
        data.forEach(item => {
            unique.add(item[unit] || '未設定');
        });
        return Array.from(unique);
    }, []);

    // 日付をJST形式にフォーマットする関数
    const formatDateToJST = (date) => {
        const options = {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        return new Intl.DateTimeFormat('ja-JP', options).format(date);
    };

    // 月曜日を取得する関数
    const getMonday = (date) => {
        const day = date.getDay();
        const diff = day === 0 ? -6 : 1 - day; // Sunday=0 => -6, Monday=1 => 0, etc.
        const monday = new Date(date);
        monday.setDate(monday.getDate() + diff);
        return monday;
    };

    // 営業日判定関数（全ての日を営業日とするため不要）
    // const isBusinessDay = (date) => {
    //     const day = date.getDay();
    //     return day !== 0 && day !== 6;
    // };

    // データの集計ロジック
    const aggregatedData = React.useMemo(() => {
        if (!props.data || props.data.length === 0) return { periods: [], matrix: [] };

        // データの日付範囲を取得
        const dates = props.data.map(item => new Date(item.expectedDate)).filter(date => !isNaN(date));
        if (dates.length === 0) return { periods: [], matrix: [] };

        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        const currentYear = minDate.getFullYear();
        const previousYear = currentYear - 1;

        let periods = [];
        if (timeUnit === 'daily') {
            periods = createDailyPeriods(currentYear);
        } else if (timeUnit === 'weekly') {
            periods = createWeeklyPeriods(currentYear);
        } else {
            periods = createMonthlyPeriods(currentYear);
        }

        // 分類単位のリストを取得
        const classifications = getClassifications(props.data, classificationUnit);
        
        // 期末在庫の履歴を保持するオブジェクト
        const inventoryHistory = {};
        classifications.forEach(classItem => {
            inventoryHistory[classItem] = {};
        });

        // 集計
        const matrix = classifications.map(classItem => {
            const row = { classification: classItem };
            
            periods.forEach((period, periodIndex) => {
                // 当年の期間内のデータをフィルタリング
                const currentPeriodData = props.data.filter(item => {
                    const itemDate = new Date(item.expectedDate);
                    return !isNaN(itemDate) && 
                           itemDate >= new Date(period.start) && 
                           itemDate <= new Date(period.end) &&
                           (classificationUnit === 'all' || item[classificationUnit] === classItem);
                });

                // 前年の同期間のデータをフィルタリング
                const previousPeriodStart = new Date(new Date(period.start).setFullYear(previousYear));
                const previousPeriodEnd = new Date(new Date(period.end).setFullYear(previousYear));
                const previousPeriodData = props.data.filter(item => {
                    const itemDate = new Date(item.expectedDate);
                    return !isNaN(itemDate) && 
                           itemDate >= previousPeriodStart && 
                           itemDate <= previousPeriodEnd &&
                           (classificationUnit === 'all' || item[classificationUnit] === classItem);
                });

                // 期初在庫の計算
                const previousEndingInventory = periodIndex === 0 ? 0 : 
                    inventoryHistory[classItem][`期末在庫_${period.period}`] || 0;
                row[`期初在庫_${period.period}`] = previousEndingInventory;

                // 各値の計算 (当年)
                const sales = currentPeriodData.reduce((sum, item) => sum + (Number(item.sales) || 0), 0);
                const priceChanges = currentPeriodData.reduce((sum, item) => sum + (Number(item.priceChanges) || 0), 0);
                const purchases = currentPeriodData.reduce((sum, item) => sum + (Number(item.purchases) || 0), 0);
                const endingInventory = previousEndingInventory - sales - priceChanges + purchases;

                row[`売上_${period.period}`] = sales;
                row[`売価変更_${period.period}`] = priceChanges;
                row[`仕入_${period.period}`] = purchases;
                row[`期末在庫_${period.period}`] = endingInventory >= 0 ? endingInventory : 0;

                // 前年の値の計算
                const prevSales = previousPeriodData.reduce((sum, item) => sum + (Number(item.sales) || 0), 0);
                const prevPriceChanges = previousPeriodData.reduce((sum, item) => sum + (Number(item.priceChanges) || 0), 0);
                const prevPurchases = previousPeriodData.reduce((sum, item) => sum + (Number(item.purchases) || 0), 0);
                const prevEndingInventory = previousPeriodData.length > 0 
                    ? prevPurchases - prevSales - prevPriceChanges 
                    : 0;

                // 前年の期末在庫
                const prevPeriodEndingInventory = prevEndingInventory >= 0 ? prevEndingInventory : 0;
                row[`期末在庫_prev_${period.period}`] = prevPeriodEndingInventory;

                // 前年比と差異額の計算
                const yoy = prevEndingInventory !== 0 ? ((endingInventory - prevEndingInventory) / Math.abs(prevEndingInventory)) * 100 : 0;
                const difference = endingInventory - prevEndingInventory;

                row[`前年比_${period.period}`] = yoy.toFixed(2) + '%';
                row[`差異額_${period.period}`] = difference;
                
                // 期末在庫の履歴を保存
                inventoryHistory[classItem][`期末在庫_${period.period}`] = endingInventory >= 0 ? endingInventory : 0;
            });

            return row;
        });

        return { periods, matrix };
    }, [props.data, viewMode, classificationUnit, timeUnit, getClassifications]);

    // 早期リターン
    if (!aggregatedData || !aggregatedData.periods || !aggregatedData.matrix) {
        return (
            <Box component={Paper} sx={{ p: 2 }}>
                <Typography variant="h6">データが存在しません</Typography>
            </Box>
        );
    }

    // Excelエクスポート機能
    const handleExportExcel = () => {
        // カスタムヘッダーを含めるため、データを加工
        const exportData = [];
        aggregatedData.matrix.forEach(row => {
            aggregatedData.periods.forEach(period => {
                exportData.push({
                    '分類単位': row.classification,
                    '期間': period.period,
                    '当年期初在庫': row[`期初在庫_${period.period}`],
                    '当年売上': row[`売上_${period.period}`],
                    '当年売価変更': row[`売価変更_${period.period}`],
                    '当年仕入': row[`仕入_${period.period}`],
                    '当年期末在庫': row[`期末在庫_${period.period}`],
                    '前年期末在庫': row[`期末在庫_prev_${period.period}`],
                    '前年比': row[`前年比_${period.period}`],
                    '差異額': row[`差異額_${period.period}`],
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = { Sheets: { 'OTBMatrix': worksheet }, SheetNames: ['OTBMatrix'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "OTBMatrix.xlsx");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 分類単位タブの切り替えハンドラ
    const handleClassificationTabChange = (event, newValue) => {
        setClassificationUnit(newValue);
    };

    // ビューモードタブの切り替えハンドラ
    const handleViewModeTabChange = (event, newValue) => {
        setViewMode(newValue);
    };

    // 列の単位切り替えハンドラ
    const handleTimeUnitChange = (event) => {
        setTimeUnit(event.target.value);
    };

    return (
        <Box component={Paper} sx={{ p: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                OTB計画マトリックス
            </Typography>

            {/* 二行タブの実装 */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                {/* 1行目: 分類単位 */}
                <Tabs
                    value={classificationUnit}
                    onChange={handleClassificationTabChange}
                    aria-label="Classification Unit Tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {classificationOptions.map(option => (
                        <Tab key={option.value} label={option.label} value={option.value} />
                    ))}
                </Tabs>
                {/* 2行目: ビューモード */}
                <Tabs
                    value={viewMode}
                    onChange={handleViewModeTabChange}
                    aria-label="View Mode Tabs"
                    variant="fullWidth"
                    sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#f0f0f0' }} // 背景色を追加
                >
                    <Tab value="annual" label="年間ビュー" />
                    <Tab value="monthly" label="月度ビュー" />
                    <Tab value="weekly" label="週次ビュー" />
                </Tabs>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2, alignItems: 'center' }}>
                {/* 列の単位選択 */}
                <FormControl variant="outlined" size="small">
                    <InputLabel id="time-unit-label">期間単位</InputLabel>
                    <Select
                        labelId="time-unit-label"
                        value={timeUnit}
                        onChange={handleTimeUnitChange}
                        label="期間単位"
                    >
                        <MenuItem value="daily">日</MenuItem>
                        <MenuItem value="weekly">週</MenuItem>
                        <MenuItem value="monthly">月</MenuItem>
                    </Select>
                </FormControl>

                {/* エクスポートボタン */}
                <Button variant="contained" color="primary" onClick={handleExportExcel}>
                    Excelとしてエクスポート
                </Button>
            </Box>

            {/* マトリックス表示 */}
            <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
                <Table size="small" stickyHeader sx={{ whiteSpace: 'nowrap', borderCollapse: 'collapse', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2} sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>分類単位</TableCell>
                            <TableCell rowSpan={2} sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>項目</TableCell>
                            <TableCell colSpan={5} align="center" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                <Typography variant="caption">期間合計</Typography>
                            </TableCell>
                            {aggregatedData.periods.map((period, index) => (
                                <TableCell key={index} colSpan={5} align="center" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                    <Typography variant="caption">
                                        {`開始日: ${period.start}`}
                                        <br />
                                        {`終了日: ${period.end}`}
                                        <br />
                                        {`営業日: ${period.businessDays}`}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {/* 期間合計の列 */}
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>計画</TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>当年</TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>前年</TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>前年比</TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>差異額</TableCell>
                            {/* 各期間の列 */}
                            {aggregatedData.periods.map((period, index) => (
                                <React.Fragment key={index}>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>計画</TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>当年</TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>前年</TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>前年比</TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>差異額</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 期間合計のデータ表示を追加 */}
                        {aggregatedData.matrix.map((row, rowIndex) => (
                            itemLabels.map((itemLabel, itemIndex) => (
                                <TableRow key={`${rowIndex}-${itemIndex}`} sx={itemLabel === '期末在庫' ? { backgroundColor: '#f5f5f5' } : {}}>
                                    {itemIndex === 0 ? (
                                        <TableCell rowSpan={itemLabels.length} sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                            {row.classification}
                                        </TableCell>
                                    ) : null}
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>{itemLabel}</TableCell>
                                    {/* 期間合計のセル */}
                                    <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
                                        {row[`計画合計_${itemLabel}`] || 0}
                                    </TableCell>
                                    <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        {row[`当年合計_${itemLabel}`] || 0}
                                    </TableCell>
                                    <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        {row[`前年合計_${itemLabel}`] || 0}
                                    </TableCell>
                                    <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        {row[`前年比合計_${itemLabel}`] || '0%'}
                                    </TableCell>
                                    <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        {row[`差異額合計_${itemLabel}`] || 0}
                                    </TableCell>
                                    {/* 各期間のデータ */}
                                    {aggregatedData.periods.map((period, periodIndex) => (
                                        <React.Fragment key={periodIndex}>
                                            <TableCell align="right" sx={{ 
                                                padding: '4px 8px', 
                                                border: '1px solid #ddd',
                                                backgroundColor: '#f5f5f5'
                                            }}>
                                                {row[`計画_${period.period}`] || 0}
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                                {row[`${itemLabel}_${period.period}`]}
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                                {row[`${itemLabel}_prev_${period.period}`]}
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                                {row[`前年比_${period.period}`]}
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                                {row[`差異額_${period.period}`]}
                                            </TableCell>
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    window.OTBMatrix = OTBMatrix;
}

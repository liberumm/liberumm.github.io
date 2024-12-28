const { useState, useEffect } = React;
const { Grid, TextField, MenuItem, Box, Button } = MaterialUI;

const Filter = () => {
    // フィルタに必要なステートの定義
    const years = [2022, 2023, 2024];
    const months = ["選択しない", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const weeks = ["選択しない", ...Array.from({ length: 52 }).map((_, i) => `${i + 1}`)];
    const locations = ["全社", "東京本店", "大阪支店", "名古屋支店", "福岡支店"];
    const departments = ["全部門", "営業部", "企画部", "開発部", "総務部"];

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState("選択しない");
    const [weekNumber, setWeekNumber] = useState("選択しない");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [department, setDepartment] = useState("");

    // 月度変更時の処理
    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        setWeekNumber("選択しない");

        const { startDate, endDate } = getMonthRange(year, parseInt(newMonth.replace('月', ''), 10));
        setStartDate(startDate.toISOString().split('T')[0]);
        setEndDate(endDate.toISOString().split('T')[0]);
    };

    // 週番号に基づいて開始日と終了日を計算する関数
    const calculateWeekRange = (year, week) => {
        const fiscalYearStart = new Date(year, 3, 1); // 4月1日
        const dayOfWeek = fiscalYearStart.getDay();
        const firstMonday = new Date(fiscalYearStart);
        firstMonday.setDate(fiscalYearStart.getDate() + (1 - dayOfWeek + 7) % 7);

        const startOfWeek = new Date(firstMonday);
        startOfWeek.setDate(firstMonday.getDate() + (week - 1) * 7);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return { startDate: startOfWeek, endDate: endOfWeek };
    };

    // 月度に基づいて開始日と終了日を計算する関数
    const getMonthRange = (year, month) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // 月の最終日
        return { startDate, endDate };
    };

    // 年度全体の期間を計算する関数
    const getYearRange = (year) => {
        const startDate = new Date(year, 3, 1); // 4月1日
        const endDate = new Date(year + 1, 2, 31); // 翌年の3月31日
        return { startDate, endDate };
    };

    // 年度、月度、週番号の選択によって開始日と終了日を更新する処理
    useEffect(() => {
        let newStartDate, newEndDate;

        if (weekNumber !== "選択しない" && weekNumber) {
            const { startDate, endDate } = calculateWeekRange(year, parseInt(weekNumber, 10));
            newStartDate = startDate;
            newEndDate = endDate;
            setMonth(`${startDate.getMonth() + 1}月`);
        } else if (month !== "選択しない" && month) {
            const { startDate, endDate } = getMonthRange(year, parseInt(month.replace('月', ''), 10));
            newStartDate = startDate;
            newEndDate = endDate;
        } else {
            const { startDate, endDate } = getYearRange(year);
            newStartDate = startDate;
            newEndDate = endDate;
        }

        setStartDate(newStartDate.toISOString().split('T')[0]);
        setEndDate(newEndDate.toISOString().split('T')[0]);

    }, [year, month, weekNumber]);

    return (
        <Box px={3} py={2}>
            <Grid container spacing={2}>
                {/* 年度選択 */}
                <Grid item xs={4} sm={4} md={1.5}>
                    <TextField
                        select
                        label="年度"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        fullWidth
                        size="small"
                    >
                        {years.map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* 月度選択 */}
                <Grid item xs={4} sm={4} md={1.5}>
                    <TextField
                        select
                        label="月度"
                        value={month}
                        onChange={handleMonthChange}
                        fullWidth
                        size="small"
                    >
                        {months.map(month => (
                            <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* 週の選択 */}
                <Grid item xs={4} sm={4} md={1.5}>
                    <TextField
                        select
                        label="週"
                        value={weekNumber}
                        onChange={(e) => setWeekNumber(e.target.value)}
                        fullWidth
                        size="small"
                    >
                        {weeks.map(week => (
                            <MenuItem key={week} value={week}>{week}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* 開始日 */}
                <Grid item xs={6} sm={6} md={2}>
                    <TextField
                        label="開始日"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                </Grid>

                {/* 終了日 */}
                <Grid item xs={6} sm={6} md={2}>
                    <TextField
                        label="終了日"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                    />
                </Grid>

                {/* 店舗/部署の選択 */}
                <Grid item xs={6} sm={6} md={2}>
                    <TextField
                        select
                        label="店舗/部署"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        fullWidth
                        size="small"
                    >
                        {locations.map(loc => (
                            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* 部門の選択 */}
                <Grid item xs={6} sm={6} md={1.5}>
                    <TextField
                        select
                        label="部門"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        fullWidth
                        size="small"
                    >
                        {departments.map(dep => (
                            <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* 適用ボタン */}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" fullWidth size="small" >
                        適用
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

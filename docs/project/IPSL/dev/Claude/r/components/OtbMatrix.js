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
        Grid,
        FormControlLabel,
        Switch
    } = MaterialUI; // Material-UIをグローバル変数として想定

    // ================================
    // 1) 既存ステート + 追加ステート
    // ================================
    const [viewMode, setViewMode] = React.useState('weekly');
    const [classificationUnit, setClassificationUnit] = React.useState('department');
    const [timeUnit, setTimeUnit] = React.useState('weekly');
    const [isDragging, setIsDragging] = React.useState(false);

    // 追加: 計画 / 当年 / 前年 / 分類マスタ を保持
    const [PlanData, setPlanData] = React.useState([]);
    const [currentYearData, setCurrentYearData] = React.useState([]);
    const [lastYearData, setLastYearData] = React.useState([]);
    const [classificationMasterData, setClassificationMasterData] = React.useState([]);

    const [showMasterImportControls, setShowMasterImportControls] = React.useState(false);
    const [showByStore, setShowByStore] = React.useState(false); // 店舗別表示の切り替え用

    // ================================
    // 2) 分類オプション & 表示項目 (既存)
    // ================================
    const classificationOptions = [
        { label: '全社', value: 'all' },
        { label: '部門', value: 'department' },
        { label: 'コーナー', value: 'corner' },
        { label: 'ライン', value: 'line' },
        { label: 'カテゴリ', value: 'category' },
        { label: 'アイテム', value: 'item' },
        { label: 'SKU', value: 'SKU' },
    ];
    const itemLabels = ['期初在庫', '売上', '売価変更', '仕入', '期末在庫'];

    // ================================
    // 3) 期間生成ロジック (既存)
    // ================================
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
                    businessDays: 1
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

            const businessDays = Math.min(
                7, 
                Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24)) + 1
            );

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
            const end = new Date(year, month + 1, 0);
            const businessDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            periods.push({
                period: `${month + 1}月`,
                start: formatDateToJST(start),
                end: formatDateToJST(end),
                businessDays: businessDays
            });
        }
        return periods;
    };

    const formatDateToJST = (date) => {
        const options = {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        return new Intl.DateTimeFormat('ja-JP', options).format(date);
    };

    const getMonday = (date) => {
        const day = date.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const monday = new Date(date);
        monday.setDate(monday.getDate() + diff);
        return monday;
    };

    // ================================
    // 4) 分類抽出 / 集計
    // ================================
    const getClassifications = React.useCallback((data, unit) => {
        if (unit === 'all') {
            return ['全社'];
        }
        const unique = new Set();
        data.forEach(item => {
            if (showByStore) {
                // 店舗別表示の場合は「店舗-分類」の形式で保持
                const store = item.store || '未設定店舗';
                const classification = item[unit] || '未設定';
                unique.add(`${store}-${classification}`);
            } else {
                // 店舗合計の場合は従来通り
                unique.add(item[unit] || '未設定');
            }
        });
        return Array.from(unique);
    }, [showByStore]); // showByStore依存を追加

    const aggregatedData = React.useMemo(() => {
        // a) インポートしていない場合 (分類マスタ含め全て空) → props.data のみ
        const noPlan  = PlanData.length === 0;
        const noCurr  = currentYearData.length === 0;
        const noLast  = lastYearData.length === 0;
        const noClass = classificationMasterData.length === 0;

        const isAllEmpty = (noPlan && noCurr && noLast && noClass);

        // b) インポートが何かあれば props.data + 各種インポート
        //    さらに、分類マスタがあれば「カテゴリ→部門/コーナー/ライン/…」を補完
        let mergedData = [];
        if (isAllEmpty) {
            // 従来どおり
            mergedData = [...props.data];
        } else {
            // plan/currentYear/lastYear データ合体
            mergedData = [
                ...props.data,
                ...PlanData,
                ...currentYearData,
                ...lastYearData
            ];
            // 分類マスタがあるなら、カテゴリ 等をキーに突き合わせ
            if (classificationMasterData.length > 0) {
                mergedData = mergedData.map((row) => mergeClassificationFromMaster(row));
            }
        }

        if (!mergedData || mergedData.length === 0) {
            return { periods: [], matrix: [] };
        }

        // 日付抽出
        const dates = mergedData
            .map(item => new Date(item.expectedDate))
            .filter(date => !isNaN(date));

        if (dates.length === 0) {
            return { periods: [], matrix: [] };
        }

        const minDate = new Date(Math.min(...dates));
        const currentYear = minDate.getFullYear();
        const previousYear = currentYear - 1;

        // timeUnitに応じて期間を生成
        let periods = [];
        if (timeUnit === 'daily') {
            periods = createDailyPeriods(currentYear);
        } else if (timeUnit === 'weekly') {
            periods = createWeeklyPeriods(currentYear);
        } else {
            periods = createMonthlyPeriods(currentYear);
        }

        // 分類単位
        const classifications = getClassifications(mergedData, classificationUnit);

        // 在庫履歴
        const inventoryHistory = {};
        classifications.forEach(classItem => {
            inventoryHistory[classItem] = {};
        });

        // 集計
        const matrix = classifications.map(classItem => {
            const row = { classification: classItem };

            periods.forEach((period, periodIndex) => {
                // 当年期間
                const currentPeriodData = mergedData.filter(item => {
                    const itemDate = new Date(item.expectedDate);
                    if (isNaN(itemDate)) return false;

                    const dateMatch = itemDate >= new Date(period.start) && 
                                    itemDate <= new Date(period.end);

                    if (showByStore) {
                        // 店舗別表示の場合は「店舗-分類」で比較
                        const itemClassKey = `${item.store || '未設定店舗'}-${item[classificationUnit] || '未設定'}`;
                        return dateMatch && (classificationUnit === 'all' || itemClassKey === classItem);
                    } else {
                        // 店舗合計の場合は従来通り
                        return dateMatch && (classificationUnit === 'all' || item[classificationUnit] === classItem);
                    }
                });

                // 前年期間
                const previousPeriodStart = new Date(new Date(period.start).setFullYear(previousYear));
                const previousPeriodEnd = new Date(new Date(period.end).setFullYear(previousYear));
                const previousPeriodData = mergedData.filter(item => {
                    const itemDate = new Date(item.expectedDate);
                    if (isNaN(itemDate)) return false;

                    const dateMatch = itemDate >= previousPeriodStart && 
                                    itemDate <= previousPeriodEnd;

                    if (showByStore) {
                        const itemClassKey = `${item.store || '未設定店舗'}-${item[classificationUnit] || '未設定'}`;
                        return dateMatch && (classificationUnit === 'all' || itemClassKey === classItem);
                    } else {
                        return dateMatch && (classificationUnit === 'all' || item[classificationUnit] === classItem);
                    }
                });

                // 計画
                const beginningInventoryPlan = currentPeriodData.reduce(
                    (sum, d) => sum + (Number(d['期初在庫計画']) || 0),
                    0
                );
                const salesPlan = currentPeriodData.reduce(
                    (sum, d) => sum + (Number(d['売上計画']) || 0),
                    0
                );
                const priceChangesPlan = currentPeriodData.reduce(
                    (sum, d) => sum + (Number(d['売価変更計画']) || 0),
                    0
                );
                const purchasesPlan = currentPeriodData.reduce(
                    (sum, d) => sum + (Number(d['仕入計画']) || 0),
                    0
                );
                const endingInventoryPlan = beginningInventoryPlan - salesPlan - priceChangesPlan + purchasesPlan;
                row[`計画_期初在庫_${period.period}`] = beginningInventoryPlan;
                row[`計画_売上_${period.period}`] = salesPlan;
                row[`計画_売価変更_${period.period}`] = priceChangesPlan;
                row[`計画_仕入_${period.period}`] = purchasesPlan;
                row[`計画_期末在庫_${period.period}`] = Math.max(endingInventoryPlan, 0);

                // 当年
                const prevEndingInv = (periodIndex === 0)
                    ? 0
                    : inventoryHistory[classItem][`期末在庫_${period.period}`] || 0;
                row[`当年_期初在庫_${period.period}`] = prevEndingInv;

                const sales = currentPeriodData.reduce((s, d) => s + (Number(d.sales) || 0), 0);
                const priceChanges = currentPeriodData.reduce((s, d) => s + (Number(d.priceChanges) || 0), 0);
                const purchases = currentPeriodData.reduce((s, d) => s + (Number(d.purchases) || 0), 0);
                const endingInventory = prevEndingInv - sales - priceChanges + purchases;
                row[`当年_売上_${period.period}`] = sales;
                row[`当年_売価変更_${period.period}`] = priceChanges;
                row[`当年_仕入_${period.period}`] = purchases;
                row[`当年_期末在庫_${period.period}`] = Math.max(endingInventory, 0);

                // inventoryHistory記憶
                inventoryHistory[classItem][`期末在庫_${period.period}`] = Math.max(endingInventory, 0);

                // 前年
                const prevSales = previousPeriodData.reduce((s, d) => s + (Number(d.sales) || 0), 0);
                const prevPriceChanges = previousPeriodData.reduce((s, d) => s + (Number(d.priceChanges) || 0), 0);
                const prevPurchases = previousPeriodData.reduce((s, d) => s + (Number(d.purchases) || 0), 0);
                const prevEndInv = 0 - prevSales - prevPriceChanges + prevPurchases;
                row[`前年_期初在庫_${period.period}`] = 0;
                row[`前年_売上_${period.period}`] = prevSales;
                row[`前年_売価変更_${period.period}`] = prevPriceChanges;
                row[`前年_仕入_${period.period}`] = prevPurchases;
                row[`前年_期末在庫_${period.period}`] = Math.max(prevEndInv, 0);
            });

            return row;
        });

        return { periods, matrix };
    }, [
        props.data,
        PlanData,
        currentYearData,
        lastYearData,
        classificationMasterData,
        timeUnit,
        classificationUnit,
        showByStore, // showByStore依存を追加
        getClassifications
    ]);

    // -------------------------------------------------
    // (A) 分類マスタを使って row の部門/コーナー/ライン/... を補完
    // -------------------------------------------------
    const mergeClassificationFromMaster = (row) => {
        if (!row.category) {
            return row;
        }
        const found = classificationMasterData.find(m => m.category === row.category);
        if (!found) {
            return row;
        }
        const newRow = { ...row };
        if (found.department) newRow.department = found.department;
        if (found.corner)     newRow.corner     = found.corner;
        if (found.line)       newRow.line       = found.line;
        if (found.category)   newRow.category   = found.category;
        if (found.item)       newRow.item       = found.item;
        if (found.SKU)        newRow.SKU        = found.SKU;
        return newRow;
    };

    const splitClassification = (classification) => {
        if (!showByStore) return { store: '', classification };
        const [store, ...rest] = classification.split('-');
        return {
            store: store || '未設定店舗',
            classification: rest.join('-') || '未設定'
        };
    };

    // ================================
    // 5) 表示が無い場合の処理
    // ================================
    if (!aggregatedData.periods?.length || !aggregatedData.matrix?.length) {
        return (
            <Box component={Paper} sx={{ p: 2 }}>
                <Typography variant="h6">データが存在しません</Typography>
            </Box>
        );
    }

    // ================================
    // 6) エクスポート & テンプレ
    // ================================
    const handleExportExcel = () => {
        const exportData = [];
        const { periods, matrix } = aggregatedData;
        matrix.forEach(row => {
            periods.forEach(period => {
                itemLabels.forEach(itemLabel => {
                    exportData.push({
                        '分類単位': row.classification,
                        '期間': period.period,
                        '項目': itemLabel,
                        '計画': row[`計画_${itemLabel}_${period.period}`] || 0,
                        '当年': row[`当年_${itemLabel}_${period.period}`] || 0,
                        '前年': row[`前年_${itemLabel}_${period.period}`] || 0,
                        '前年比': (() => {
                            const thisYearVal = row[`当年_${itemLabel}_${period.period}`] || 0;
                            const lastYearVal = row[`前年_${itemLabel}_${period.period}`] || 0;
                            return lastYearVal
                                ? ((thisYearVal - lastYearVal) / Math.abs(lastYearVal) * 100).toFixed(2) + '%'
                                : '0%';
                        })(),
                        '差異額': (row[`当年_${itemLabel}_${period.period}`] || 0)
                                  - (row[`前年_${itemLabel}_${period.period}`] || 0)
                    });
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

    const handleDownloadTemplate = () => {
        // テンプレートに新しい列構成を反映
        const templateData = [{
            '日付': 'YYYY/MM/DD',
            '時間': 'HH:MM',
            'カテゴリ': '',
            'アイテム': '',
            'SKU': '',
            '店舗': '',
            '期初在庫': 0,
            '期初在庫（数量）': 0,
            '売上': 0,
            '売上（数量）': 0,
            '売価変更': 0,
            '売価変更（数量）': 0,
            '仕入': 0,
            '仕入（数量）': 0,
            '期末在庫': 0,
            '期末在庫（数量）': 0
        }];
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = { Sheets: { 'Template': worksheet }, SheetNames: ['Template'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "ImportTemplate.xlsx");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ================================
    // 7) インポート用パーサ (計画/当年/前年/分類マスタ)
    // ================================
    const parsePlanRow = (row) => {
        const parseNum = (v) => isNaN(Number(v)) ? 0 : Number(v);
        const dateString = row['日付'] || '';
        const timeString = row['時間'] || '';
        const d = new Date(dateString + ' ' + timeString);
        const newRow = {};
        if (!isNaN(d)) newRow.expectedDate = d;
        newRow.category = row['カテゴリ'] || '';
        newRow.item     = row['アイテム'] || '';
        newRow.SKU      = row['SKU'] || '';
        newRow.store    = row['店舗'] || '';
        newRow['期初在庫計画']        = parseNum(row['期初在庫']);
        newRow['期初在庫数量計画']    = parseNum(row['期初在庫（数量）']);
        newRow['売上計画']            = parseNum(row['売上']);
        newRow['売上数量計画']        = parseNum(row['売上（数量）']);
        newRow['売価変更計画']        = parseNum(row['売価変更']);
        newRow['売価変更数量計画']    = parseNum(row['売価変更（数量）']);
        newRow['仕入計画']            = parseNum(row['仕入']);
        newRow['仕入数量計画']        = parseNum(row['仕入（数量）']);
        newRow['期末在庫計画']        = parseNum(row['期末在庫']);
        newRow['期末在庫数量計画']    = parseNum(row['期末在庫（数量）']);
        return newRow;
    };

    const parseCurrentYearRow = (row) => {
        const parseNum = (v) => isNaN(Number(v)) ? 0 : Number(v);
        const dateString = row['日付'] || '';
        const timeString = row['時間'] || '';
        const d = new Date(dateString + ' ' + timeString);
        
        const newRow = {};
        if (!isNaN(d)) newRow.expectedDate = d;

        newRow.category = row['カテゴリ'] || '';
        newRow.item     = row['アイテム'] || '';
        newRow.SKU      = row['SKU'] || '';
        newRow.store    = row['店舗'] || '';

        newRow.sales              = parseNum(row['売上']);
        newRow.sales数量          = parseNum(row['売上（数量）']);
        newRow.priceChanges       = parseNum(row['売価変更']);
        newRow.priceChanges数量   = parseNum(row['売価変更（数量）']);
        newRow.purchases          = parseNum(row['仕入']);
        newRow.purchases数量      = parseNum(row['仕入（数量）']);

        newRow['期初在庫']        = parseNum(row['期初在庫']);
        newRow['期初在庫数量']    = parseNum(row['期初在庫（数量）']);
        newRow['期末在庫']        = parseNum(row['期末在庫']);
        newRow['期末在庫数量']    = parseNum(row['期末在庫（数量）']);

        return newRow;
    };

    const parseLastYearRow = (row) => {
        const parseNum = (v) => isNaN(Number(v)) ? 0 : Number(v);
        const dateString = row['日付'] || '';
        const timeString = row['時間'] || '';
        const d = new Date(dateString + ' ' + timeString);
        
        const newRow = {};
        if (!isNaN(d)) newRow.expectedDate = d;

        newRow.category = row['カテゴリ'] || '';
        newRow.item     = row['アイテム'] || '';
        newRow.SKU      = row['SKU'] || '';
        newRow.store    = row['店舗'] || '';

        newRow.sales              = parseNum(row['売上']);
        newRow.sales数量          = parseNum(row['売上（数量）']);
        newRow.priceChanges       = parseNum(row['売価変更']);
        newRow.priceChanges数量   = parseNum(row['売価変更（数量）']);
        newRow.purchases          = parseNum(row['仕入']);
        newRow.purchases数量      = parseNum(row['仕入（数量）']);

        newRow['期初在庫']        = parseNum(row['期初在庫']);
        newRow['期初在庫数量']    = parseNum(row['期初在庫（数量）']);
        newRow['期末在庫']        = parseNum(row['期末在庫']);
        newRow['期末在庫数量']    = parseNum(row['期末在庫（数量）']);

        return newRow;
    };

    const parseClassificationMasterRow = (row) => {
        return {
            department: row['部門'] || '',
            corner:     row['コーナー'] || '',
            line:       row['ライン'] || '',
            category:   row['カテゴリ'] || '',
            item:       row['アイテム'] || '',
            SKU:        row['SKU'] || ''
        };
    };

    // ================================
    // 8) handleFileImport: 計画/当年/前年/分類マスタを識別
    // ================================
    const handleFileImport = (e, importType) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                const data = new Uint8Array(ev.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                let mappedRows = [];
                if (importType === 'plan') {
                    mappedRows = jsonData.map(parsePlanRow);
                    setPlanData(mappedRows);
                } else if (importType === 'currentYear') {
                    mappedRows = jsonData.map(parseCurrentYearRow);
                    setCurrentYearData(mappedRows);
                } else if (importType === 'lastYear') {
                    mappedRows = jsonData.map(parseLastYearRow);
                    setLastYearData(mappedRows);
                } else if (importType === 'classificationMaster') {
                    mappedRows = jsonData.map(parseClassificationMasterRow);
                    setClassificationMasterData(mappedRows);
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('ファイルの読み込みエラー:', error);
            alert('ファイルの読み込みに失敗しました。');
        }
    };

    const handleFileDrop = (e, importType) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
         && file.type !== "application/vnd.ms-excel") {
            alert('Excelファイル(.xlsx, .xls)のみ対応しています。');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const data = new Uint8Array(ev.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            let mappedRows = [];
            if (importType === 'plan') {
                mappedRows = jsonData.map(parsePlanRow);
                setPlanData(mappedRows);
            } else if (importType === 'currentYear') {
                mappedRows = jsonData.map(parseCurrentYearRow);
                setCurrentYearData(mappedRows);
            } else if (importType === 'lastYear') {
                mappedRows = jsonData.map(parseLastYearRow);
                setLastYearData(mappedRows);
            } else if (importType === 'classificationMaster') {
                mappedRows = jsonData.map(parseClassificationMasterRow);
                setClassificationMasterData(mappedRows);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // ================================
    // 9) DnD UI用ドラッグ中ハンドラ等
    // ================================
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // ================================
    // 10) イベントハンドラ (タブ類)
    // ================================
    const handleClassificationTabChange = (event, newValue) => {
        setClassificationUnit(newValue);
    };
    const handleViewModeTabChange = (event, newValue) => {
        setViewMode(newValue);
    };
    const handleTimeUnitChange = (event) => {
        setTimeUnit(event.target.value);
    };

    // ================================
    // 11) レンダリング
    // ================================
    return (
        <Box component={Paper} sx={{ p: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                OTB計画マトリックス
            </Typography>

            {/* 分類単位タブ */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Tabs
                        value={classificationUnit}
                        onChange={handleClassificationTabChange}
                        aria-label="Classification Unit Tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ flexGrow: 1 }}
                    >
                        {classificationOptions.map(option => (
                            <Tab key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Tabs>

                    {/* 店舗別表示切り替えスイッチを追加 */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showByStore}
                                onChange={(e) => setShowByStore(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body2" color="textSecondary">
                                店舗別表示
                            </Typography>
                        }
                        sx={{ ml: 2, mr: 2 }}
                    />
                </Box>

                {/* ビューモードタブ */}
                <Tabs
                    value={viewMode}
                    onChange={handleViewModeTabChange}
                    aria-label="View Mode Tabs"
                    variant="fullWidth"
                    sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#f0f0f0' }}
                >
                    <Tab value="annual" label="年間ビュー" />
                    <Tab value="monthly" label="月度ビュー" />
                    <Tab value="weekly" label="週次ビュー" />
                </Tabs>
            </Box>

            {/* 期間セレクト & エクスポート */}
            <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleExportExcel}
                >
                    Excelとしてエクスポート
                </Button>
            </Box>

            {/* ===================== インポートセクション (例) ===================== */}
            <Box mt={2}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    {/* ヘッダー部分 */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs>
                            <Typography variant="subtitle1" component="h2">
                                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                                    upload_file
                                </span>
                                データ取込
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setShowMasterImportControls(!showMasterImportControls)}
                                startIcon={<span className="material-icons">
                                    {showMasterImportControls ? 'expand_less' : 'expand_more'}
                                </span>}
                            >
                                {showMasterImportControls ? "閉じる" : "開く"}
                            </Button>
                        </Grid>
                    </Grid>

                    {/* インポートコントロール */}
                    {showMasterImportControls && (
                        <Grid container spacing={2}>
                            {[
                                { title: "計画ファイル",              type: 'plan',                 icon: 'analytics' },
                                { title: "当年ファイル",              type: 'currentYear',          icon: 'event' },
                                { title: "前年ファイル",              type: 'lastYear',             icon: 'history' },
                                { title: "分類マスタ",               type: 'classificationMaster', icon: 'account_tree' }
                            ].map((item) => (
                                <Grid item xs={12} md={3} key={item.type}>
                                    <Paper
                                        elevation={0}
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            backgroundColor: '#f8f9fa',
                                            '&:hover': { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <span className="material-icons" style={{ marginRight: '8px' }}>
                                                {item.icon}
                                            </span>
                                            {item.title}
                                        </Typography>

                                        {/* ドロップエリアとファイル選択を統合 */}
                                        <Box
                                            component="label"
                                            sx={{
                                                display: 'block',
                                                border: '1px dashed #bdbdbd',
                                                borderRadius: 1,
                                                p: 3,
                                                textAlign: 'center',
                                                backgroundColor: '#ffffff',
                                                cursor: 'pointer',
                                                mb: 2,
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }}
                                            onDrop={(e) => handleFileDrop(e, item.type)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onClick={() => document.getElementById(`file-input-${item.type}`).click()}
                                        >
                                            <input
                                                id={`file-input-${item.type}`}
                                                type="file"
                                                accept=".xlsx, .xls"
                                                hidden
                                                onChange={(e) => handleFileImport(e, item.type)}
                                            />
                                            <span className="material-icons" style={{ fontSize: '48px', color: '#757575', marginBottom: '8px' }}>
                                                upload_file
                                            </span>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                ファイルをドラッグ＆ドロップ
                                            </Typography>
                                            <Typography variant="body2" color="primary">
                                                またはクリックして選択
                                            </Typography>
                                        </Box>

                                        {/* テンプレートダウンロードボタン */}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={handleDownloadTemplate}
                                            startIcon={<span className="material-icons">download</span>}
                                            size="small"
                                        >
                                            テンプレートをダウンロード
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Box>
            {/* =========================================================== */}

            {/* ===================== 集計マトリックステーブル (既存) ===================== */}
            <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
                <Table size="small" stickyHeader sx={{ whiteSpace: 'nowrap', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            {/* 店舗列を追加 */}
                            {showByStore && (
                                <TableCell rowSpan={2} sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                    店舗
                                </TableCell>
                            )}
                            <TableCell rowSpan={2} sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                分類単位
                            </TableCell>
                            <TableCell rowSpan={2} sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                項目
                            </TableCell>
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
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
                                計画
                            </TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                当年
                            </TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                前年
                            </TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                前年比
                            </TableCell>
                            <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                差異額
                            </TableCell>
                            {aggregatedData.periods.map((period, index) => (
                                <React.Fragment key={index}>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
                                        計画
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        当年
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        前年
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        前年比
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                        差異額
                                    </TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {aggregatedData.matrix.map((row, rowIndex) => (
                            itemLabels.map((itemLabel, itemIndex) => {
                                const { store, classification } = splitClassification(row.classification);
                                
                                return (
                                    <TableRow 
                                        key={`${rowIndex}-${itemIndex}`} 
                                        sx={itemLabel === '期末在庫' ? { backgroundColor: '#f5f5f5' } : {}}
                                    >
                                        {itemIndex === 0 && (
                                            <>
                                                {/* 店舗列を追加 */}
                                                {showByStore && (
                                                    <TableCell 
                                                        rowSpan={itemLabels.length} 
                                                        sx={{ padding: '2px 4px', border: '1px solid #ddd' }}
                                                    >
                                                        {store}
                                                    </TableCell>
                                                )}
                                                <TableCell 
                                                    rowSpan={itemLabels.length} 
                                                    sx={{ padding: '2px 4px', border: '1px solid #ddd' }}
                                                >
                                                    {classification}
                                                </TableCell>
                                            </>
                                        )}
                                        <TableCell sx={{ padding: '4px 8px', border: '1px solid #ddd' }}>
                                            {itemLabel}
                                        </TableCell>

                                        {/* 期間合計（ダミーセル） */}
                                        <TableCell
                                            align="right"
                                            sx={{ padding: '4px 8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                        >
                                            0%
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                        >
                                            0
                                        </TableCell>

                                        {/* 各期間のデータ */}
                                        {aggregatedData.periods.map((period, periodIndex) => {
                                            const planVal = row[`計画_${itemLabel}_${period.period}`] || 0;
                                            const thisYearVal = row[`当年_${itemLabel}_${period.period}`] || 0;
                                            const lastYearVal = row[`前年_${itemLabel}_${period.period}`] || 0;
                                            const yoy = lastYearVal
                                                ? ((thisYearVal - lastYearVal) / Math.abs(lastYearVal) * 100).toFixed(2) + '%'
                                                : '0%';
                                            const diff = thisYearVal - lastYearVal;

                                            return (
                                                <React.Fragment key={periodIndex}>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ padding: '4px 8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}
                                                    >
                                                        {planVal}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                                    >
                                                        {thisYearVal}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                                    >
                                                        {lastYearVal}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                                    >
                                                        {yoy}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ padding: '4px 8px', border: '1px solid #ddd' }}
                                                    >
                                                        {diff}
                                                    </TableCell>
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

// 必要に応じてグローバルへ
window.OTBMatrix = OTBMatrix;

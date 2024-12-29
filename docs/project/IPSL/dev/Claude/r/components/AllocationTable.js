const { useState, useEffect, useMemo, useCallback, useRef } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Checkbox, Button, ButtonGroup, Grid, Box, Typography, Slider, MenuItem } = MaterialUI;
const debounce = _.debounce;

// カラム幅の定義
const allocationColumnWidths = {
    checkbox: '50px',
    deliveryDate: '150px',
    productCode: '150px',
    productName: '200px',
    cost: '100px',
    price: '100px',
    coefficientPattern: '120px',
    remainingPlan: '100px',
    distribution: '100px',
    totalPriceAmount: '150px',
    totalCostAmount: '150px',
    unit: '80px',
    minimumQuantity: '100px',
    bulkQuantity: '100px',
    storeName: '100px',
    total: '100px'
};

// 初期データの作成関数をコンポーネントの外で定義し、グローバルスコープで利用可能にする
window.createEmptyAllocationRow = (id, numberOfStores) => {
    return {
        id: id,
        selected: false,
        deliveryDate: '',
        productCode: '',
        productName: '',
        cost: 0,
        price: 0,
        coefficientPattern: '',
        remainingPlan: 0,
        distribution: 0,
        unit: 1,
        minimumQuantity: 0,
        bulkQuantity: 0,
        stores: Array(numberOfStores).fill(0),
        total: 0,
        totalCostAmount: 0,
        totalPriceAmount: 0
    };
};

// スタイル定数の定義
const tableStyles = {
    checkbox: { width: "50px" },
    cell: { 
        padding: "6px",
        textAlign: "center",
        verticalAlign: "middle"
    }
};

// その他の定数
const rowHeight = 45;

// EditableCell コンポーネントをグローバルスコープで定義
window.EditableCell = React.memo(function EditableCell({ 
    rowId, 
    field, 
    value, 
    inputValue, 
    onInputChange, 
    onInputCommit, 
    type = "text", 
    disabled = false 
}) {
    // 状態管理を追加
    const [localValue, setLocalValue] = useState(value);

    // 値が外部から更新された場合の処理
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onInputChange?.(rowId, field, newValue);
    };

    const handleBlur = () => {
        onInputCommit?.(rowId, field, localValue);
    };

    return (
        <TextField
            type={type}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            size="small"
            disabled={disabled}
        />
    );
});

// AllocationTableRow コンポーネントをグローバルスコープで定義
window.AllocationTableRow = React.memo(function AllocationTableRow({ 
    row, 
    rowIndex,
    onSelect,
    inputValues,
    onInputChange,
    onInputCommit,
    numberOfStores 
}) {
    const handleCellChange = React.useCallback((field, value) => {
        onInputCommit(row.id, field, value);
    }, [row.id, onInputCommit]);

    const rowTotal = React.useMemo(() => {
        return (row.stores || []).reduce((sum, value) => sum + (parseInt(value) || 0), 0);
    }, [row.stores]);

    return (
        <TableRow>
            <TableCell padding="none" style={{ width: allocationColumnWidths.checkbox }}>
                <Checkbox
                    checked={row.selected || false}
                    onChange={() => onSelect(rowIndex)}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="deliveryDate"
                    value={row.deliveryDate}
                    inputValue={inputValues[`${row.id}-deliveryDate`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                    type="date"
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="productCode"
                    value={row.productCode || ''}
                    inputValue={inputValues[`${row.id}-productCode`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="productName"
                    value={row.productName || ''}
                    inputValue={inputValues[`${row.id}-productName`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="cost"
                    type="number"
                    value={row.cost || 0}
                    inputValue={inputValues[`${row.id}-cost`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="price"
                    type="number"
                    value={row.price || 0}
                    inputValue={inputValues[`${row.id}-price`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="coefficientPattern"
                    value={row.coefficientPattern || ''}
                    inputValue={inputValues[`${row.id}-coefficientPattern`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="remainingPlan"
                    type="number"
                    value={row.remainingPlan || 0}
                    inputValue={inputValues[`${row.id}-remainingPlan`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="distribution"
                    type="number"
                    value={row.distribution || 0}
                    inputValue={inputValues[`${row.id}-distribution`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="totalCostAmount"
                    type="number"
                    value={row.totalCostAmount || 0}
                    inputValue={inputValues[`${row.id}-totalCostAmount`]}
                    disabled
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="totalPriceAmount"
                    type="number"
                    value={row.totalPriceAmount || 0}
                    inputValue={inputValues[`${row.id}-totalPriceAmount`]}
                    disabled
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="unit"
                    type="number"
                    value={row.unit || 1}
                    inputValue={inputValues[`${row.id}-unit`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="minimumQuantity"
                    type="number"
                    value={row.minimumQuantity || 0}
                    inputValue={inputValues[`${row.id}-minimumQuantity`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="bulkQuantity"
                    type="number"
                    value={row.bulkQuantity || 0}
                    inputValue={inputValues[`${row.id}-bulkQuantity`]}
                    onInputChange={onInputChange}
                    onInputCommit={onInputCommit}
                />
            </TableCell>
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="total"
                    type="number"
                    value={rowTotal}
                    disabled={true}
                />
            </TableCell>
            {(row.stores || Array(numberOfStores).fill(0)).map((value, storeIndex) => (
                <TableCell key={`${rowIndex}-${storeIndex}`}>
                    <EditableCell
                        rowId={row.id}
                        field={`stores-${storeIndex}`}
                        type="number"
                        value={value}
                        inputValue={inputValues[`${row.id}-stores-${storeIndex}`]}
                        onInputChange={onInputChange}
                        onInputCommit={onInputCommit}
                    />
                </TableCell>
            ))}
            <TableCell>
                <EditableCell
                    rowId={row.id}
                    field="total"
                    type="number"
                    value={rowTotal}
                    disabled={true}
                />
            </TableCell>
        </TableRow>
    );
});

// AllocationTable コンポーネントをグローバルスコープで定義
window.AllocationTable = function AllocationTable({ sharedState = {}, onStateChange }) {
    // 入力値の状態管理を追加
    const [inputValues, setInputValues] = useState({});
    const [coefficientData, setCoefficientData] = useState([]);
    const [patternHeaders, setPatternHeaders] = useState([]);
    const [dragActiveArea, setDragActiveArea] = useState(null);
    const [importError, setImportError] = useState(null); // 追加

    // 入力変更ハンドラーを追加
    const handleInputChange = useCallback((rowId, field, value) => {
        setInputValues(prev => ({
            ...prev,
            [`${rowId}-${field}`]: value
        }));
    }, []);

    // 入力確定ハンドラーを追加
    const handleInputCommit = useCallback((rowId, field, value) => {
        const updatedData = localData.map(row => {
            if (row.id === rowId) {
                if (field.startsWith('stores-')) {
                    const storeIndex = parseInt(field.split('-')[1]);
                    const newStores = [...row.stores];
                    newStores[storeIndex] = parseFloat(value) || 0;
                    return {
                        ...row,
                        stores: newStores,
                        total: newStores.reduce((a, b) => a + b, 0)
                    };
                }
                return {
                    ...row,
                    [field]: value
                };
            }
            return row;
        });

        setLocalData(updatedData);
        onStateChange?.({
            ...sharedState,
            allocationData: updatedData
        });
    }, [localData, sharedState, onStateChange]);

    // sharedState の初期値を設定
    const initialSharedState = {
        allocationData: [],
        settings: {
            numberOfStores: 5,
            rowCount: 10  // 初期行数を追加
        },
        ...sharedState
    };

    // settings の初期値を設定 (重複した宣言を削除)
    const [settings, setSettings] = useState(() => ({
        showSettings: false,
        rowCount: initialSharedState.settings.rowCount || 10,
        numberOfStores: initialSharedState.settings.numberOfStores || 5
    }));

    // 店舗数変更時の処理を改善
    const handleStoreCountChange = useCallback((newValue) => {
        const storeCount = Math.max(1, Math.min(100, parseInt(newValue) || 1));
        
        // 設定を更新
        setSettings(prev => ({
            ...prev,
            numberOfStores: storeCount
        }));

        // 既存のデータの店舗列を調整
        setLocalData(prevData => 
            prevData.map(row => ({
                ...row,
                stores: adjustStoresArray(row.stores || [], storeCount)
            }))
        );

        // 店舗チェックボックスの状態を更新
        setStoreCheckboxState(prev => {
            const newState = Array(storeCount).fill(true);
            return prev.length <= storeCount 
                ? [...prev, ...Array(storeCount - prev.length).fill(true)]
                : prev.slice(0, storeCount);
        });

        // テーブルデータを更新
        setAllocationData(prevData => 
            prevData.map(row => ({
                ...row,
                stores: adjustStoresArray(row.stores || [], storeCount)
            }))
        );

        // sharedStateの更新
        onStateChange?.({
            ...sharedState,
            settings: {
                ...sharedState.settings,
                numberOfStores: storeCount
            }
        });
    }, [sharedState, onStateChange]);

    // 店舗配列を調整するヘルパー関数
    const adjustStoresArray = (currentStores, newCount) => {
        const stores = currentStores || [];
        if (stores.length === newCount) {
            return stores;
        }
        if (stores.length > newCount) {
            return stores.slice(0, newCount);
        }
        return [...stores, ...Array(newCount - stores.length).fill(0)];
    };

    // ローカルのテーブルデータ状態を修正
    const [localData, setLocalData] = useState(() => {
        const initialData = initialSharedState.allocationData;
        if (initialData && initialData.length > 0) {
            return initialData;
        }
        // 初期データがない場合は設定された行数分のデータを作成
        return Array(settings.rowCount).fill(null).map((_, index) => 
            window.createEmptyAllocationRow(index + 1, settings.numberOfStores)
        );
    });

    // コンポーネントマウント時とsettings変更時のデータ更新
    useEffect(() => {
        // データが空の場合のみ初期化
        if (localData.length === 0 || localData.length !== settings.rowCount) {
            const newData = Array(settings.rowCount)
                .fill(null)
                .map((_, index) => window.createEmptyAllocationRow(index + 1, settings.numberOfStores));
            
            setLocalData(newData);
            onStateChange?.({
                ...sharedState,
                allocationData: newData,
                settings: {
                    ...sharedState.settings,
                    rowCount: settings.rowCount,
                    numberOfStores: settings.numberOfStores
                }
            });
        }
    }, [settings.rowCount, settings.numberOfStores]);

    // sharedState の変更を監視
    useEffect(() => {
        if (sharedState?.allocationData && sharedState.allocationData.length > 0) {
            setLocalData(sharedState.allocationData);
        }
    }, [sharedState?.allocationData]);

    // データの変更を遅延させる
    const debouncedUpdate = useCallback(
        debounce((newData) => {
            onStateChange?.({
                ...sharedState,
                allocationData: newData
            });
        }, 500),
        [sharedState, onStateChange]
    );

    // 行選択の処理
    const handleRowSelect = useCallback((index) => {
        setLocalData(prevData => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                selected: !newData[index].selected
            };
            return newData;
        });
    }, []);

    // 全選択の処理
    const handleSelectAll = useCallback((e) => {
        const checked = e.target.checked;
        setLocalData(prevData => 
            prevData.map(row => ({
                ...row,
                selected: checked
            }))
        );
    }, []);

    // 日付関連の処理を追加
    const [allocationData, setAllocationData] = useState([]);

    // インポート関連の状態を追加
    const [isDragging, setIsDragging] = useState(false);
    const [storeMasterData, setStoreMasterData] = useState([]);
    const [storeCheckboxState, setStoreCheckboxState] = useState([]);

    // インポート機能の表示/非表示を管理するステート
    const [showMasterImportControls, setShowMasterImportControls] = useState(false);

    // すべての行に対して一括で納品日を設定する関数
    const setAllDeliveryDates = () => {
        const newData = allocationData.map(row => ({
            ...row,
            deliveryDate: sharedState.deliveryDate
        }));
        setAllocationData(newData);
    };

    // すべての行に対して一括で納品日をクリアする関数
    const clearAllDeliveryDates = () => {
        const newData = allocationData.map(row => ({
            ...row,
            deliveryDate: ''
        }));
        setAllocationData(newData);
    };

    // テーブルをクリアする関数
    const clearTable = () => {
        setAllocationData([]);
    };

    // 選択された行を削除する関数
    const handleDeleteSelected = () => {
        const newData = allocationData.filter(row => !row.selected);
        setAllocationData(newData);
    };

    // ExcelとCSVエクスポート処理
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(allocationData);
        XLSX.utils.book_append_sheet(wb, ws, "Allocation");
        XLSX.writeFile(wb, `allocation_data_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const exportToCsv = async () => {
        const headers = [
            "納品日", "商品コード", "商品名", "原価", "売価", "係数パターン",
            "計画残数", "配分数", "単位", "最低導入数", "一括導入数", "合計",
            ...Array.from({ length: settings.numberOfStores }, (_, i) => `店舗${i + 1}`),
            "原価計", "売価計"
        ];

        const rows = allocationData.map(row => [
            row.deliveryDate,
            row.productCode,
            row.productName,
            row.cost,
            row.price,
            row.coefficientPattern,
            row.remainingPlan,
            row.distribution,
            row.unit,
            row.minimumQuantity,
            row.bulkQuantity,
            row.total,
            ...row.stores,
            row.totalCostAmount,
            row.totalPriceAmount
        ]);

        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `配分データ_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // 配分処理
    const distributeAllocations = (onlySelected = false) => {
        // coefficientDataが未設定の場合は係数を1として扱う
        const coefficientMap = coefficientData.length > 0 ? 
            createCoefficientMapFromData(coefficientData, patternHeaders) : 
            createDefaultCoefficientMap(settings.numberOfStores);

        const updatedData = allocationData.map(row => {
            if (!onlySelected || (onlySelected && row.selected)) {
                if (!row.stores) {
                    row.stores = Array(settings.numberOfStores).fill(0);
                }

                const totalStores = row.stores.length;
                
                let coefficients;
                if (row.coefficientPattern && coefficientMap) {
                    coefficients = Array(totalStores).fill(1).map((_, i) => {
                        const storeCode = storeMasterData[i]?.storeCode || `store${i + 1}`;
                        return coefficientMap[storeCode]?.[row.coefficientPattern] || 1;
                    });
                } else {
                    coefficients = Array(totalStores).fill(1);
                }

                if (row.distribution <= 0 || row.unit <= 0) {
                    return {
                        ...row,
                        stores: Array(totalStores).fill(0),
                        total: 0
                    };
                }

                const minimumQuantity = isNaN(Number(row.minimumQuantity)) ? 0 : Number(row.minimumQuantity);
                const totalCoefficient = coefficients.reduce((acc, coef) => acc + coef, 0);
                const baseQuantity = Math.floor((row.distribution - (totalStores * minimumQuantity)) / row.unit);

                const initialAllocation = coefficients.map(coef => 
                    Math.floor((baseQuantity * coef) / totalCoefficient)
                );

                let remainingQuantity = baseQuantity - initialAllocation.reduce((acc, qty) => acc + qty, 0);

                const sortedIndices = coefficients
                    .map((coef, index) => ({ index, coef }))
                    .sort((a, b) => b.coef - a.coef);

                for (let i = 0; remainingQuantity > 0; i++) {
                    initialAllocation[sortedIndices[i % totalStores].index]++;
                    remainingQuantity--;
                }

                const finalAllocation = initialAllocation.map(value => 
                    (value * row.unit) + minimumQuantity
                );

                return {
                    ...row,
                    stores: finalAllocation,
                    total: finalAllocation.reduce((acc, val) => acc + val, 0)
                };
            }
            return row;
        });

        setAllocationData(updatedData);
        onStateChange({
            ...sharedState,
            allocationData: updatedData
        });
    };

    // 係数マップ作成関数を追加
    const createCoefficientMapFromData = (coefficientData, patternHeaders) => {
        const coefficientMap = {};
        
        if (!coefficientData || !patternHeaders || coefficientData.length === 0) {
            return createDefaultCoefficientMap(settings.numberOfStores);
        }

        coefficientData.forEach((row) => {
            const storeCode = (row.storeCode || '').trim();
            if (!storeCode) return;

            coefficientMap[storeCode] = {};
            patternHeaders.forEach((pattern, index) => {
                const coefficient = parseFloat(row.patterns?.[index]) || 1;
                coefficientMap[storeCode][pattern] = coefficient;
            });
        });

        return coefficientMap;
    };

    // デフォルトの係数マップを作成する関数を追加
    const createDefaultCoefficientMap = (storeCount) => {
        const defaultMap = {};
        for (let i = 0; i < storeCount; i++) {
            defaultMap[`store${i + 1}`] = {
                'default': 1
            };
        }
        return defaultMap;
    };

    // 選択行の配分をクリア
    const clearSelectedAllocations = () => {
        const updatedData = allocationData.map(row => {
            if (row.selected) {
                return {
                    ...row,
                    distribution: 0,
                    stores: Array(settings.numberOfStores).fill(0),
                    total: 0
                };
            }
            return row;
        });
        setAllocationData(updatedData);
        onStateChange({
            ...sharedState,
            allocationData: updatedData
        });
    };

    // データの初期化
    useEffect(() => {
        if (sharedState?.allocationData) {
            setAllocationData(sharedState.allocationData);
        }
    }, [sharedState?.allocationData]);

    // 設定変更時の処理
    useEffect(() => {
        // 行数または店舗数が変更された場合のデータ更新
        const updateData = () => {
            const newData = allocationData.map(row => ({
                ...row,
                stores: Array(settings.numberOfStores).fill(0)
            }));
            setAllocationData(newData);
            onStateChange({
                ...sharedState,
                allocationData: newData
            });
        };

        updateData();
    }, [settings.rowCount, settings.numberOfStores]);

    // データ行の更新処理を最適化
    const handleDataChange = useCallback((index, field, value) => {
        setAllocationData(prevData => {
            const updatedData = [...prevData];
            const row = { ...updatedData[index] };

            if (field === 'stores') {
                row.stores = value;
                row.total = value.reduce((a, b) => a + b, 0);
            } else {
                row[field] = value;
                
                // 数値フィールドの計算
                if (['price', 'cost', 'distribution'].includes(field)) {
                    row.totalPriceAmount = parseFloat(row.price || 0) * parseFloat(row.distribution || 0);
                    row.totalCostAmount = parseFloat(row.cost || 0) * parseFloat(row.distribution || 0);
                }
            }

            updatedData[index] = row;
            return updatedData;
        });
    }, []);

    // 操作パネルのレンダリング
const renderOperationPanel = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3 
        }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <span className="material-icons" style={{ marginRight: '8px' }}>settings</span>
                操作パネル
            </Typography>
        </Box>

        <Grid container spacing={3}>
            {/* 納品日設定セクション */}
            <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <span className="material-icons" style={{ marginRight: '8px', fontSize: '20px' }}>event</span>
                        納品日設定
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                        <TextField
                            label="納品日"
                            type="date"
                            value={sharedState.deliveryDate || ''}
                            onChange={(e) => onStateChange({...sharedState, deliveryDate: e.target.value})}
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 1 }}
                        />
                        <ButtonGroup fullWidth>
                            <Button 
                                onClick={setAllDeliveryDates}
                                variant="contained"
                                color="primary"
                                startIcon={<span className="material-icons">date_range</span>}
                            >
                                一括設定
                            </Button>
                            <Button 
                                onClick={clearAllDeliveryDates}
                                variant="outlined"
                                color="primary"
                                startIcon={<span className="material-icons">clear_all</span>}
                            >
                                クリア
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Paper>
            </Grid>

            {/* 配分操作セクション */}
            <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <span className="material-icons" style={{ marginRight: '8px', fontSize: '20px' }}>calculate</span>
                        配分操作
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<span className="material-icons">all_inclusive</span>}
                            onClick={() => distributeAllocations()}
                        >
                            全行配分
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            startIcon={<span className="material-icons">playlist_add_check</span>}
                            onClick={() => distributeAllocations(true)}
                        >
                            選択行配分
                        </Button>
                        <Button
                            variant="outlined"
                            color="warning"
                            fullWidth
                            startIcon={<span className="material-icons">clear</span>}
                            onClick={clearSelectedAllocations}
                        >
                            配分クリア
                        </Button>
                    </Box>
                </Paper>
            </Grid>

            {/* データ操作セクション */}
            <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <span className="material-icons" style={{ marginRight: '8px', fontSize: '20px' }}>data_object</span>
                        データ操作
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <ButtonGroup fullWidth>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}
                                startIcon={<span className="material-icons">description</span>}
                                onClick={exportToExcel}
                            >
                                Excel
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#9e9e9e', '&:hover': { backgroundColor: '#8e8e8e' } }}
                                startIcon={<span className="material-icons">table_view</span>}
                                onClick={exportToCsv}
                            >
                                CSV
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup fullWidth>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<span className="material-icons">delete_sweep</span>}
                                onClick={clearTable}
                            >
                                全クリア
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                startIcon={<span className="material-icons">delete</span>}
                                onClick={handleDeleteSelected}
                            >
                                選択削除
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    </Paper>
);

    // 行のセルコンポーネントをメモ化
    const MemoizedCell = React.memo(({ value, onChange, type = "text", disabled = false }) => (
        <TextField
            type={type}
            value={value}
            onChange={onChange}
            fullWidth
            size="small"
            disabled={disabled}
        />
    ));

    // 店舗セルのレンダリングを最適化
    const renderStoreCells = useCallback((row, rowIndex) => {
        const stores = Array(settings.numberOfStores).fill(0).map((_, i) => 
            row.stores && row.stores[i] !== undefined ? row.stores[i] : 0
        );

        return stores.map((value, storeIndex) => (
            <TableCell key={`${rowIndex}-${storeIndex}`}>
                <MemoizedCell
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        const newStores = [...stores];
                        newStores[storeIndex] = newValue;
                        handleDataChange(rowIndex, 'stores', newStores);
                    }}
                />
            </TableCell>
        ));
    }, [settings.numberOfStores, handleDataChange]);

    // 行の合計を計算
    const calculateRowTotal = useCallback((stores) => {
        return stores ? stores.reduce((sum, value) => sum + (parseInt(value) || 0), 0) : 0;
    }, []);

    // 行のメインセルのレンダリングを最適化
    const renderRowCells = useCallback((row, rowIndex) => {
        const rowTotal = calculateRowTotal(row.stores);
        
        return (
            <>
                <TableCell>
                    <TextField
                        type="date"
                        value={row.deliveryDate || ''}
                        onChange={(e) => handleDataChange(rowIndex, 'deliveryDate', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        value={row.productCode || ''}
                        onChange={(e) => handleDataChange(rowIndex, 'productCode', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        value={row.productName || ''}
                        onChange={(e) => handleDataChange(rowIndex, 'productName', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.cost || 0}
                        onChange={(e) => handleDataChange(rowIndex, 'cost', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.price || 0}
                        onChange={(e) => handleDataChange(rowIndex, 'price', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        value={row.coefficientPattern || ''}
                        onChange={(e) => handleDataChange(rowIndex, 'coefficientPattern', e.target.value)}
                        select
                        fullWidth
                        size="small"
                    >
                        {(sharedState.coefficientPatterns || []).map((pattern, index) => (
                            <MenuItem key={index} value={pattern}>{pattern}</MenuItem>
                        ))}
                    </TextField>
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.remainingPlan || 0}
                        onChange={(e) => handleDataChange(rowIndex, 'remainingPlan', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.distribution || 0}
                        onChange={(e) => handleDataChange(rowIndex, 'distribution', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.totalCostAmount || 0}
                        disabled
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.totalPriceAmount || 0}
                        disabled
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.unit || 1}
                        onChange={(e) => handleDataChange(rowIndex, 'unit', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.minimumQuantity || 0}
                        onChange={(e) => handleDataChange(rowIndex, 'minimumQuantity', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        value={row.bulkQuantity || 0}
                        onChange={(e) => handleDataChange(rowIndex, 'bulkQuantity', e.target.value)}
                        fullWidth
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <MemoizedCell
                        type="number"
                        value={rowTotal}
                        disabled={true}
                    />
                </TableCell>
                {renderStoreCells(row, rowIndex)}
                <TableCell>
                    <MemoizedCell
                        type="number"
                        value={rowTotal}
                        disabled={true}
                    />
                </TableCell>
            </>
        );
    }, [renderStoreCells, calculateRowTotal]);

    // テーブル行コンポーネントをメモ化
    const TableRowMemo = React.memo(({ row, rowIndex, onSelect }) => (
        <TableRow>
            <TableCell padding="none">
                <Checkbox
                    checked={row.selected || false}
                    onChange={() => onSelect(rowIndex)}
                />
            </TableCell>
            {renderRowCells(row, rowIndex)}
        </TableRow>
    ));

    // テーブルボディの再レンダリングを最適化
    const renderTableBody = useMemo(() => (
        <TableBody>
            {localData.map((row, rowIndex) => (
                <AllocationTableRow
                    key={row.id}
                    row={row}
                    rowIndex={rowIndex} // rowIndex を渡す
                    onSelect={handleRowSelect}
                    inputValues={inputValues}
                    onInputChange={handleInputChange}
                    onInputCommit={handleInputCommit}
                    numberOfStores={settings.numberOfStores}
                />
            ))}
        </TableBody>
    ), [localData, handleRowSelect, inputValues, handleInputChange, handleInputCommit, settings.numberOfStores]);

    // toggleSettings 関数を追加
    const toggleSettings = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            showSettings: !prev.showSettings
        }));
    }, []);

    // テーブルのレンダリング
    const renderTable = useCallback(() => (
        <Box>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    size="medium"
                    onClick={toggleSettings}
                    startIcon={<span className="material-icons">
                        {settings.showSettings ? 'settings_off' : 'settings'}
                    </span>}
                    sx={{
                        mb: 2,
                        backgroundColor: settings.showSettings ? '#ff9800' : '#2196f3',
                        '&:hover': {
                            backgroundColor: settings.showSettings ? '#f57c00' : '#1976d2'
                        }
                    }}
                >
                    {settings.showSettings ? "設定を閉じる" : "テーブル設定"}
                </Button>

                {settings.showSettings && (
                    <Box sx={{ 
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        backgroundColor: '#fafafa'
                    }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            color: '#424242'
                        }}>
                            <span className="material-icons" style={{ marginRight: 8 }}>tune</span>
                            テーブル表示設定
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#1976d2'
                                    }}>
                                        <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>view_list</span>
                                        商品行数設定
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <TextField
                                            type="number"
                                            value={settings.rowCount}
                                            onChange={(e) => {
                                                const newValue = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                                                setSettings(prev => ({
                                                    ...prev,
                                                    rowCount: newValue
                                                }));
                                                updateTableRows(newValue);
                                            }}
                                            size="small"
                                            sx={{ width: '100px', mr: 2 }}
                                            InputProps={{
                                                inputProps: { min: 1, max: 100 },
                                                startAdornment: <Typography variant="caption" sx={{ mr: 1 }}>行数:</Typography>
                                            }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            現在の行数: {settings.rowCount}行
                                        </Typography>
                                    </Box>
                                    <Slider
                                        value={settings.rowCount}
                                        min={1}
                                        max={100}
                                        onChange={(e, value) => {
                                            setSettings(prev => ({
                                                ...prev,
                                                rowCount: value
                                            }));
                                            updateTableRows(value);
                                        }}
                                        valueLabelDisplay="auto"
                                        marks={[
                                            { value: 1, label: '1' },
                                            { value: 50, label: '50' },
                                            { value: 100, label: '100' }
                                        ]}
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#1976d2'
                                    }}>
                                        <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>store</span>
                                        店舗列数設定
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <TextField
                                            type="number"
                                            value={settings.numberOfStores}
                                            onChange={(e) => {
                                                const newValue = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                                                handleStoreCountChange(newValue);
                                            }}
                                            size="small"
                                            sx={{ width: '100px', mr: 2 }}
                                            InputProps={{
                                                inputProps: { min: 1, max: 100 },
                                                startAdornment: <Typography variant="caption" sx={{ mr: 1 }}>店舗数:</Typography>
                                            }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            現在の店舗数: {settings.numberOfStores}店舗
                                        </Typography>
                                    </Box>
                                    <Slider
                                        value={settings.numberOfStores}
                                        min={1}
                                        max={100}
                                        onChange={(e, value) => handleStoreCountChange(value)}
                                        valueLabelDisplay="auto"
                                        marks={[
                                            { value: 1, label: '1' },
                                            { value: 50, label: '50' },
                                            { value: 100, label: '100' }
                                        ]}
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>
            {/* テーブル本体 */}
            <TableContainer component={Paper}>
                <Table size="small" style={{ minWidth: '1500px', tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.checkbox }}>
                                <Checkbox onChange={handleSelectAll} />
                            </TableCell>
                            {renderColumnHeaders()}
                        </TableRow>
                    </TableHead>
                    {renderTableBody}
                </Table>
            </TableContainer>
        </Box>
    ), [settings, localData, handleSelectAll, toggleSettings]);

    // カラムヘッダーのレンダリング
    const renderColumnHeaders = () => {
        const headers = [
            { id: 'deliveryDate', label: '納品日' },
            { id: 'productCode', label: '商品コード' },
            { id: 'productName', label: '商品名' },
            { id: 'cost', label: '原価' },
            { id: 'price', label: '売価' },
            { id: 'coefficientPattern', label: '係数パターン' },
            { id: 'remainingPlan', label: '計画残数' },
            { id: 'distribution', label: '配分数' },
            { id: 'totalPriceAmount', label: '売価計' },
            { id: 'totalCostAmount', label: '原価計' },
            { id: 'unit', label: '単位' },
            { id: 'minimumQuantity', label: '最低導入数' },
            { id: 'bulkQuantity', label: '一括導入数' },
            { id: 'total', label: '合計' }
        ];

        return (
            <>
                {headers.map(header => (
                    <TableCell 
                        key={header.id}
                        style={{ width: allocationColumnWidths[header.id] }}
                    >
                        {header.label}
                    </TableCell>
                ))}
                {/* 店舗列のヘッダー */}
                {renderStoreHeaders()}
                <TableCell style={{ width: allocationColumnWidths.total }}>合計（確認）</TableCell>
            </>
        );
    };

    // 店舗ヘッダーのレンダリング
    const renderStoreHeaders = () => {
        return (storeMasterData.length > 0 ? storeMasterData : Array(settings.numberOfStores).fill({}))
            .map((store, i) => (
                <TableCell key={i} style={{ width: allocationColumnWidths.storeName }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Checkbox
                            checked={storeCheckboxState[i] || false}
                            onChange={(e) => {
                                const newState = [...storeCheckboxState];
                                newState[i] = e.target.checked;
                                setStoreCheckboxState(newState);
                            }}
                        />
                        <Typography variant="caption">
                            {store.storeCode ? 
                                <>{store.storeCode}<br/>{store.storeName}</> : 
                                `店舗${i + 1}`
                            }
                        </Typography>
                    </Box>
                </TableCell>
            ));
    };

    // 行数更新処理
    const updateTableRows = (newRowCount) => {
        let newData = [...allocationData];
        
        if (newRowCount > allocationData.length) {
            // 行を追加
            const additionalRows = Array(newRowCount - allocationData.length)
                .fill(null)
                .map((_, index) => 
                    window.createEmptyAllocationRow(allocationData.length + index + 1, settings.numberOfStores)
                );
            newData = [...newData, ...additionalRows];
        } else {
            // 行を削減
            newData = newData.slice(0, newRowCount);
        }

        setAllocationData(newData);
        onStateChange({
            ...sharedState,
            allocationData: newData
        });
    };

    // ファイルインポート関連の処理を追加
    const handleFileImport = (event, type) => {
        const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            switch (type) {
                case 'productList':
                    handleProductListImport(json);
                    break;
                case 'storeMaster':
                    handleStoreMasterImport(json);
                    break;
                case 'coefficient':
                    handleCoefficientImport(json);
                    break;
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // 商品リストのインポート処理
    const handleProductListImport = (json) => {
        try {
            if (!json || json.length < 2) {
                throw new Error('無効なデータ形式です');
            }
    
            const requiredFields = [
                '商品コード', '商品名', '原価', '売価',
                '係数パターン', '計画残数', '配分数'
            ];
    
            // ヘッダー行の検証
            const headers = json[0];
            requiredFields.forEach(field => {
                if (!headers.includes(field)) {
                    throw new Error(`必要なフィールド「${field}」が含まれていません`);
                }
            });
    
            // データ行の処理
            const products = json.slice(1).map((row, index) => {
                const product = {
                    id: index + 1,
                    selected: false,
                    deliveryDate: row[headers.indexOf('納品日')] || '',
                    productCode: row[headers.indexOf('商品コード')] || '',
                    productName: row[headers.indexOf('商品名')] || '',
                    cost: parseFloat(row[headers.indexOf('原価')]) || 0,
                    price: parseFloat(row[headers.indexOf('売価')]) || 0,
                    coefficientPattern: row[headers.indexOf('係数パターン')] || '',
                    remainingPlan: parseInt(row[headers.indexOf('計画残数')]) || 0,
                    distribution: parseInt(row[headers.indexOf('配分数')]) || 0,
                    unit: parseInt(row[headers.indexOf('単位')]) || 1,
                    minimumQuantity: parseInt(row[headers.indexOf('最低導入数')]) || 0,
                    bulkQuantity: parseInt(row[headers.indexOf('一括導入数')]) || 0,
                    stores: Array(settings.numberOfStores).fill(0),
                    total: 0,
                    totalCostAmount: 0,
                    totalPriceAmount: 0
                };
    
                // 数値の検証
                if (product.cost < 0 || product.price < 0) {
                    throw new Error(`商品コード ${product.productCode} の価格が不正です`);
                }
    
                return product;
            });
    
            setAllocationData(products);
            setImportError(null);
        } catch (error) {
            setImportError(`商品リストのインポートに失敗しました: ${error.message}`);
        }
    };

    // ドラッグ&ドロップ関連のハンドラ
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileImport(e, type);
    };

    // テンプレートダウンロード機能
    const downloadTemplate = (type) => {
        let templateData;
        switch (type) {
            case 'productList':
                templateData = [
                    ["ID", "納品可能日", "納品日", "商品コード", "商品名", "原価", "売価", "係数パターン", "計画残数", "配分数", "単位", "最低導入数", "一括導入数"],
                    [1, "2024-08-01", "2024-08-02", "P001", "商品A", 100, 150, "パターン1", 100, 200, 1, 10, 50]
                ];
                break;
            case 'storeMaster':
                templateData = [
                    ["店舗コード", "店舗名"],
                    ["S001", "東京本店"]
                ];
                break;
            default:
                return;
        }

        const ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, `${type}_template.xlsx`);
    };

    // 店舗係数テンプレートのダウンロード
    const downloadCoefficientMasterTemplate = () => {
        const templateData = [
            ["店舗コード", "店舗名", "パターン1", "パターン2"],
            ["001", "東京本店", 1.0, 1.5],
            ["002", "大阪支店", 1.0, 1.0],
            ["003", "名古屋支店", 0.8, 1.2]
        ];

        const ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CoefficientMasterTemplate");
        XLSX.writeFile(wb, "coefficient_master_template.xlsx");
    };

    // ドラッグ&ドロップ機能の実装
    const handleFileDrop = (event, type) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);

            handleImportData(json, type);
        };
        reader.readAsArrayBuffer(file);
    };

    // インポートデータの処理
    const handleImportData = (data, type) => {
        switch (type) {
            case 'productList':
                const formattedProductData = data.map((row, index) => ({
                    id: index + 1,
                    selected: false,
                    deliveryDate: row['納品日'] || '',
                    productCode: row['商品コード'] || '',
                    productName: row['商品名'] || '',
                    // ...他の必要なフィールド
                }));
                setAllocationData(formattedProductData);
                break;

            case 'storeMaster':
            case 'coefficient':
                // 既存のhandleFileImportの処理を使用
                handleFileImport({ target: { files: [new File([JSON.stringify(data)], 'data.json')] }}, type);
                break;
        }
    };

    // 係数データのインポート処理を追加
    const handleCoefficientImport = (json) => {
        try {
            if (!json || json.length < 2) {
                throw new Error('無効なデータ形式です');
            }
    
            // ヘッダー行の処理（店舗コード、店舗名を除いた部分が係数パターン）
            const headers = json[0];
            const patterns = headers.slice(2);
            
            if (patterns.length === 0) {
                throw new Error('係数パターンが定義されていません');
            }
    
            // データ行の処理
            const coefficients = json.slice(1).map(row => {
                if (!row[0] || !row[1]) {
                    throw new Error('店舗コードまたは店舗名が不正です');
                }
    
                return {
                    storeCode: row[0].toString(),
                    storeName: row[1].toString(),
                    patterns: row.slice(2).map(val => {
                        const num = parseFloat(val);
                        if (isNaN(num)) throw new Error('不正な係数値が含まれています');
                        return num;
                    })
                };
            });
    
            setCoefficientData(coefficients);
            setPatternHeaders(patterns);
            setImportError(null);
    
            // パターンを共有状態に追加
            onStateChange({
                ...sharedState,
                coefficientPatterns: patterns
            });
        } catch (error) {
            setImportError(`係数データのインポートに失敗しました: ${error.message}`);
        }
    };

    // インポートセクションのレンダリング
    const renderImportSection = () => (
        <Box mt={2}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowMasterImportControls(!showMasterImportControls)}
                fullWidth
                style={{ marginBottom: '16px' }}
                startIcon={<span className="material-icons">
                    {showMasterImportControls ? 'expand_less' : 'expand_more'}
                </span>}
            >
                {showMasterImportControls ? "インポート機能を非表示" : "インポート機能を表示"}
            </Button>
            
            {showMasterImportControls && (
                <>
                    {importError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setImportError(null)}>
                            {importError}
                        </Alert>
                    )}
                    
                    <Grid container spacing={2}>
                        {/* 商品リスト */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper 
                                elevation={3}
                                sx={{ 
                                    p: 2,
                                    border: dragActiveArea === 'productList' ? '2px dashed #2196f3' : '2px dashed #cccccc',
                                    backgroundColor: dragActiveArea === 'productList' ? '#e3f2fd' : 'transparent'
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <span className="material-icons" style={{ marginRight: 8 }}>inventory_2</span>
                                    商品リスト
                                </Typography>
                                <Box
                                    sx={{
                                        border: '1px dashed #cccccc',
                                        borderRadius: '4px',
                                        p: 2,
                                        textAlign: 'center',
                                        mb: 2,
                                        minHeight: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s'
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        setDragActiveArea('productList');
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            setDragActiveArea(null);
                                        }
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragActiveArea(null);
                                        handleFileDrop(e, 'productList');
                                    }}
                                >
                                    <span className="material-icons" style={{ fontSize: 40, color: '#666', marginBottom: 8 }}>
                                        cloud_upload
                                    </span>
                                    <Typography>ここにファイルをドロップ</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        または
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component="label"
                                        sx={{ mt: 1 }}
                                    >
                                        ファイルを選択
                                        <input
                                            type="file"
                                            hidden
                                            accept=".xlsx,.xls"
                                            onChange={(e) => handleFileImport(e, 'productList')}
                                        />
                                    </Button>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    startIcon={<span className="material-icons">download</span>}
                                    onClick={() => downloadTemplate('productList')}
                                >
                                    テンプレート出力
                                </Button>
                            </Paper>
                        </Grid>

                        {/* 店舗マスタ */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper 
                                elevation={3}
                                sx={{ 
                                    p: 2,
                                    border: dragActiveArea === 'storeMaster' ? '2px dashed #2196f3' : '2px dashed #cccccc',
                                    backgroundColor: dragActiveArea === 'storeMaster' ? '#e3f2fd' : 'transparent'
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <span className="material-icons" style={{ marginRight: 8 }}>store</span>
                                    店舗マスタ
                                </Typography>
                                <Box
                                    sx={{
                                        border: '1px dashed #cccccc',
                                        borderRadius: '4px',
                                        p: 2,
                                        textAlign: 'center',
                                        mb: 2,
                                        minHeight: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s'
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        setDragActiveArea('storeMaster');
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            setDragActiveArea(null);
                                        }
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragActiveArea(null);
                                        handleFileDrop(e, 'storeMaster');
                                    }}
                                >
                                    <span className="material-icons" style={{ fontSize: 40, color: '#666', marginBottom: 8 }}>
                                        cloud_upload
                                    </span>
                                    <Typography>ここに店舗マスタをドロップ</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        または
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component="label"
                                        sx={{ mt: 1 }}
                                    >
                                        ファイルを選択
                                        <input
                                            type="file"
                                            hidden
                                            accept=".xlsx,.xls"
                                            onChange={(e) => handleFileImport(e, 'storeMaster')}
                                        />
                                    </Button>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    startIcon={<span className="material-icons">download</span>}
                                    onClick={() => downloadTemplate('storeMaster')}
                                >
                                    店舗マスタテンプレート
                                </Button>
                            </Paper>
                        </Grid>

                        {/* 店舗係数 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper 
                                elevation={3}
                                sx={{ 
                                    p: 2,
                                    border: dragActiveArea === 'coefficient' ? '2px dashed #2196f3' : '2px dashed #cccccc',
                                    backgroundColor: dragActiveArea === 'coefficient' ? '#e3f2fd' : 'transparent'
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <span className="material-icons" style={{ marginRight: 8 }}>calculate</span>
                                    店舗係数マスタ
                                </Typography>
                                <Box
                                    sx={{
                                        border: '1px dashed #cccccc',
                                        borderRadius: '4px',
                                        p: 2,
                                        textAlign: 'center',
                                        mb: 2,
                                        minHeight: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s'
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        setDragActiveArea('coefficient');
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            setDragActiveArea(null);
                                        }
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragActiveArea(null);
                                        handleFileDrop(e, 'coefficient');
                                    }}
                                >
                                    <span className="material-icons" style={{ fontSize: 40, color: '#666', marginBottom: 8 }}>
                                        cloud_upload
                                    </span>
                                    <Typography>ここに店舗係数マスタをドロップ</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        または
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component="label"
                                        sx={{ mt: 1 }}
                                    >
                                        ファイルを選択
                                        <input
                                            type="file"
                                            hidden
                                            accept=".xlsx,.xls"
                                            onChange={(e) => handleFileImport(e, 'coefficient')}
                                        />
                                    </Button>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    startIcon={<span className="material-icons">download</span>}
                                    onClick={() => downloadCoefficientMasterTemplate()}
                                >
                                    係数マスタテンプレート
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );

    // 初期データの作成関数
    const createEmptyAllocationRow = (id, numberOfStores) => ({
        id: id,
        selected: false,
        deliveryDate: '',
        productCode: '',
        productName: '',
        cost: 0,
        price: 0,
        coefficientPattern: '',
        remainingPlan: 0,
        distribution: 0,
        unit: 1,
        minimumQuantity: 0,
        bulkQuantity: 0,
        stores: Array(numberOfStores).fill(0),
        total: 0,
        totalCostAmount: 0,
        totalPriceAmount: 0
    });

    // 初期データの設定を修正
    useEffect(() => {
        if (!allocationData.length) {
            const initialData = Array(settings.rowCount)
                .fill(null)
                .map((_, index) => ({
                    id: index + 1,
                    selected: false,
                    deliveryDate: '',
                    productCode: '',
                    productName: '',
                    cost: 0,
                    price: 0,
                    coefficientPattern: '',
                    remainingPlan: 0,
                    distribution: 0,
                    unit: 1,
                    minimumQuantity: 0,
                    bulkQuantity: 0,
                    stores: Array(settings.numberOfStores).fill(0),
                    total: 0,
                    totalCostAmount: 0,
                    totalPriceAmount: 0
                }));
            setAllocationData(initialData);
            onStateChange({
                ...sharedState,
                allocationData: initialData
            });
        }
    }, []);

    // TableCell のレンダリングを修正
    const renderTableCell = useCallback((width, children) => (
        <TableCell 
            style={{ 
                width, 
                ...tableStyles.cell 
            }}
        >
            {children}
        </TableCell>
    ), []);

    // チェックボックスセルのレンダリングを修正
    const renderCheckboxCell = useCallback(() => (
        <TableCell 
            padding="none" 
            style={{ width: tableStyles.checkbox.width }}
        >
            <Checkbox />
        </TableCell>
    ), []);

    // メインレイアウトを改善
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>納品数配分</Typography>
            
            {/* インポートセクション */}
            <Paper sx={{ p: 2, mb: 3 }}>
                {renderImportSection()}
            </Paper>

            {/* 操作パネル */}
            {renderOperationPanel()}

            {/* テーブルセクション */}
            <Paper sx={{ overflow: 'hidden' }}>
                <TableContainer>
                    {renderTable()}
                </TableContainer>
            </Paper>
        </Box>
    );
}

// インポート機能用のヘルパー関数を追加
const validateImportFile = (data, requiredFields) => {
    if (!data || data.length < 2) {
        throw new Error('データが空または不正な形式です');
    }

    const headers = data[0];
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    if (missingFields.length > 0) {
        throw new Error(`必須フィールドが不足しています: ${missingFields.join(', ')}`);
    }
    return headers;
};

// 店舗マスタのインポート処理
const handleStoreMasterImport = (json) => {
    try {
        const requiredFields = ['店舗コード', '店舗名'];
        const headers = validateImportFile(json, requiredFields);

        const stores = json.slice(1).map(row => ({
            storeCode: row[headers.indexOf('店舗コード')].toString(),
            storeName: row[headers.indexOf('店舗名')].toString(),
        }));

        setStoreMasterData(stores);
        setStoreCheckboxState(Array(stores.length).fill(true));
        handleStoreCountChange(stores.length);
        setImportError(null);
    } catch (error) {
        setImportError(`店舗マスタのインポートに失敗しました: ${error.message}`);
    }
};

// 係数マスタのインポート処理の改善
const handleCoefficientImport = (json) => {
    try {
        const headers = json[0];
        if (!headers.includes('店舗コード') || !headers.includes('店舗名')) {
            throw new Error('店舗コードと店舗名は必須です');
        }

        // パターン列の取得（店舗コードと店舗名を除く）
        const patterns = headers.slice(2);
        if (patterns.length === 0) {
            throw new Error('係数パターンが定義されていません');
        }

        const coefficientData = json.slice(1).map(row => {
            const storeCode = row[0]?.toString();
            const storeName = row[1]?.toString();
            if (!storeCode || !storeName) {
                throw new Error('店舗コードまたは店舗名が不正です');
            }

            const coefficients = row.slice(2).map(val => {
                const num = parseFloat(val);
                if (isNaN(num) || num < 0) {
                    throw new Error(`不正な係数値が含まれています: ${val}`);
                }
                return num;
            });

            return {
                storeCode,
                storeName,
                patterns: coefficients
            };
        });

        setCoefficientData(coefficientData);
        setPatternHeaders(patterns);
        
        // 共有状態に係数パターンを追加
        onStateChange({
            ...sharedState,
            coefficientPatterns: patterns
        });
        
        setImportError(null);
    } catch (error) {
        setImportError(`係数マスタのインポートに失敗しました: ${error.message}`);
    }
};

// 商品リストのインポート処理の改善
const handleProductListImport = (json) => {
    try {
        const requiredFields = ['商品コード', '商品名', '原価', '売価', '係数パターン', '計画残数', '配分数'];
        const headers = validateImportFile(json, requiredFields);

        const products = json.slice(1).map((row, index) => {
            const product = {
                id: index + 1,
                selected: false,
                productCode: row[headers.indexOf('商品コード')]?.toString() || '',
                productName: row[headers.indexOf('商品名')]?.toString() || '',
                cost: parseFloat(row[headers.indexOf('原価')]) || 0,
                price: parseFloat(row[headers.indexOf('売価')]) || 0,
                coefficientPattern: row[headers.indexOf('係数パターン')]?.toString() || '',
                remainingPlan: parseInt(row[headers.indexOf('計画残数')]) || 0,
                distribution: parseInt(row[headers.indexOf('配分数')]) || 0,
                unit: parseInt(row[headers.indexOf('単位')]) || 1,
                minimumQuantity: parseInt(row[headers.indexOf('最低導入数')]) || 0,
                bulkQuantity: parseInt(row[headers.indexOf('一括導入数')]) || 0,
                stores: Array(settings.numberOfStores).fill(0),
                total: 0,
                totalCostAmount: 0,
                totalPriceAmount: 0
            };

            // バリデーション
            if (product.cost < 0 || product.price < 0) {
                throw new Error(`商品コード ${product.productCode} の価格が不正です`);
            }
            if (product.remainingPlan < 0) {
                throw new Error(`商品コード ${product.productCode} の計画残数が不正です`);
            }

            return product;
        });

        setLocalData(products);
        onStateChange({
            ...sharedState,
            allocationData: products
        });
        setImportError(null);
    } catch (error) {
        setImportError(`商品リストのインポートに失敗しました: ${error.message}`);
    }
};

// インポートセクションのUIを改善
const renderImportSection = () => (
    <Box mt={2}>
        <Button
            variant="outlined"
            color="primary"
            onClick={() => setShowMasterImportControls(!showMasterImportControls)}
            fullWidth
            startIcon={<span className="material-icons">
                {showMasterImportControls ? 'expand_less' : 'expand_more'}
            </span>}
            sx={{ mb: 2 }}
        >
            {showMasterImportControls ? "インポート機能を非表示" : "インポート機能を表示"}
        </Button>

        {showMasterImportControls && (
            <Grid container spacing={2}>
                {/* インポートエラー表示 */}
                {importError && (
                    <Grid item xs={12}>
                        <Alert 
                            severity="error" 
                            onClose={() => setImportError(null)}
                            sx={{ mb: 2 }}
                        >
                            {importError}
                        </Alert>
                    </Grid>
                )}

                {/* インポートセクション */}
                {['productList', 'storeMaster', 'coefficient'].map((type) => (
                    <Grid item xs={12} md={4} key={type}>
                        <ImportSection
                            type={type}
                            onDrop={(e) => handleFileDrop(e, type)}
                            onFileSelect={(e) => handleFileImport(e, type)}
                            onTemplateDownload={() => downloadTemplate(type)}
                            dragActive={dragActiveArea === type}
                            setDragActive={setDragActiveArea}
                        />
                    </Grid>
                ))}
            </Grid>
        )}
    </Box>
);

// インポートセクションのコンポーネント
const ImportSection = React.memo(({ type, onDrop, onFileSelect, onTemplateDownload, dragActive, setDragActive }) => {
    const titles = {
        productList: '商品リスト',
        storeMaster: '店舗マスタ',
        coefficient: '店舗係数'
    };

    const icons = {
        productList: 'inventory_2',
        storeMaster: 'store',
        coefficient: 'calculate'
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                border: dragActive ? '2px dashed #2196f3' : '2px dashed #cccccc',
                backgroundColor: dragActive ? '#e3f2fd' : 'transparent'
            }}
        >
            <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <span className="material-icons" style={{ marginRight: 8 }}>{icons[type]}</span>
                {titles[type]}
            </Typography>

            <Box
                sx={{
                    border: '1px dashed #cccccc',
                    borderRadius: '4px',
                    p: 2,
                    textAlign: 'center',
                    mb: 2,
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setDragActive(type);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => {
                    e.preventDefault();
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setDragActive(null);
                    }
                }}
                onDrop={onDrop}
            >
                <span className="material-icons" style={{ fontSize: 40, color: '#666', mb: 1 }}>
                    cloud_upload
                </span>
                <Typography variant="body2">ここにファイルをドロップ</Typography>
                <Typography variant="caption" color="textSecondary">または</Typography>
                <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{ mt: 1 }}
                >
                    ファイルを選択
                    <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={onFileSelect}
                    />
                </Button>
            </Box>

            <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<span className="material-icons">download</span>}
                onClick={onTemplateDownload}
            >
                テンプレート出力
            </Button>
        </Paper>
    );
});

const { useState, useEffect } = React;
const { 
    theme, 
    isMobile, 
    useMediaQuery, 
    useTheme, 
    Button, 
    ButtonGroup, 
    Container, 
    Grid, 
    TextField, 
    Typography, 
    Box, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    TableContainer, 
    Paper, 
    Checkbox, 
    Tabs, 
    Tab, 
    Menu, 
    MenuItem, 
    Select, 
    AppBar, 
    Toolbar, 
    IconButton, 
    Slider 
} = MaterialUI;

// このオブジェクトは、テーブルの各列に対して適切な幅を指定します。
// 各プロパティは列の名前で、その値が幅をピクセル単位で指定しています。
// 商品リストタブ用の列幅を定義するオブジェクト
const productColumnWidths = {
    checkbox: "50px",           // チェックボックス列の幅
    no: "50px",                 // No列の幅
    status: "100px",            // ステータス列の幅
    deliveryAvailableDate: "125px", // 納品可能日列の幅
    deliveryDate: "125px",      // 納品日列の幅
    productCode: "125px",       // 商品コード列の幅
    productName: "200px",       // 商品名列の幅
    cost: "75px",               // 原価列の幅
    price: "75px",              // 売価列の幅
    profit: "75px",             // 値入（利益）列の幅
    coefficientPattern: "100px", // パターン列の幅
    totalPlanQuantity: "100px", // 総計画数列の幅
    distribution: "100px",      // 配分数列の幅
    unit: "75px",               // 単位列の幅
    minimumQuantity: "100px",   // 最低導入数列の幅
    bulkQuantity: "100px",      // 一括導入数列の幅
    totalPriceAmount: "125px",  // 売価額計列の幅
    totalCostAmount: "125px",   // 原価額計列の幅
    totalPlanPriceAmount: "125px", // 合計売価額列の幅
    totalPlanCostAmount: "125px"  // 合計原価額列の幅
};

// 納品数配分タブ用の列幅設定
const allocationColumnWidths = {
    checkbox: "40px",
    deliveryDate: "130px",
    productCode: "125px",
    productName: "150px",
    cost: "75px",
    price: "75px",
    coefficientPattern: "80px",
    remainingPlan: "80px",
    distribution: "80px",
    totalPriceAmount: "125px",  // 売価額計列の幅
    totalCostAmount: "125px",   // 原価額計列の幅
    unit: "65px",
    minimumQuantity: "65px",
    bulkQuantity: "65px",
    storeName: "65px",
    total: "80px"
};

// 店舗係数確認タブ用の列幅設定
const coefficientColumnWidths = {
    storeCode: "80px",
    storeName: "150px",
    pattern: "80px"  // パターン列の幅を指定
};

const rowHeight = 45; // 行の高さ

const statusOptions = ["配分済", "未配分"];
const coefficientPatterns = ["パターン1", "パターン2"];
const years = [2022, 2023, 2024];
const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const periods = ["週", "月", "年"];

// 商品リストテーブルの各行データを初期化する関数
const createEmptyRow = (id) => ({
    id: id,                     // 行のID
    selected: false,            // チェックボックスの選択状態
    status: "",                 // ステータス
    deliveryAvailableDate: "",  // 納品可能日
    deliveryDate: "",           // 納品日
    productCode: "",            // 商品コード
    productName: "",            // 商品名
    cost: 0,                    // 原価
    price: 0,                   // 売価
    profit: 0,                  // 値入（利益）
    coefficientPattern: "",     // 係数パターン
    totalPlanQuantity: 0,       // 総計画数
    distribution: 0,            // 配分数
    unit: 1,                   // 単位
    minimumQuantity: 0,         // 最低導入数
    bulkQuantity: 0,            // 一括導入数
    totalPriceAmount: 0,        // 売価額計（配分数×売価）
    totalCostAmount: 0,         // 原価額計（配分数×原価）
    totalPlanPriceAmount: 0,    // 合計売価額（総計画数×売価）
    totalPlanCostAmount: 0      // 合計原価額（総計画数×原価）
});

const createEmptyAllocationRow = (id, numberOfStores) => ({
        id: id,
        deliveryDate: '',
        productCode: '',
        productName: '',
        cost: 0,
        price: 0,
        coefficientPattern: '',
        remainingPlan: 0,
        distribution: 0,
        unit: '',
        minimumQuantity: 0,
        bulkQuantity: 0,
        stores: Array(numberOfStores).fill(0),  // numberOfStoresに基づいて初期化
        selected: false
});

function createEmptyCoefficientRow(id) {
    return {
        id: id,
        storeCode: "",
        storeName: "",
        pattern1: 0,
        pattern2: 0
    };
}

    const Distribution = () => {    
        // タブ管理のステート
        const [activeTab, setActiveTab] = useState(1); // 現在のアクティブなタブのインデックス
        const [filterTab, setFilterTab] = useState(0); // フィルタタブのインデックス

        // 設定セクションの表示/非表示を管理するためのステート
        const [showSettings, setShowSettings] = useState(false);

        // コンポーネントが初めてレンダリングされたときに実行される処理
        useEffect(() => {
            // 現在の日付を取得
            const currentDate = new Date();

            // 現在の日付から7日後の日付を計算
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() );

            // 納品日の初期値として7日後の日付をセット
            setStartDate(futureDate.toISOString().split('T')[0]);
        }, []);  // 空の依存配列を渡すことで、この処理はコンポーネントの初回レンダリング時にのみ実行される

        // allocationTableData ステートの定義
        const [allocationTableData, setAllocationTableData] = useState(() => {
            return Array(rowCount).fill().map((_, idx) => createEmptyAllocationRow(idx + 1, numberOfStores));
        });

        // ステートの定義
        const [availableCoefficientPatterns, setAvailableCoefficientPatterns] = useState([]); // 利用可能な係数パターンを保存するステート
        const [storeHeaders, setStoreHeaders] = useState([]); // 店舗ヘッダー情報を管理するステート

        // テーブル関連のステート
        const [rowCount, setRowCount] = useState(10); // テーブルの行数
        const [tableData, setTableData] = useState([createEmptyRow(1)]); // 商品リストのデータ
        const [allocationData, setAllocationData] = useState([]); // 納品数配分データ

        // 納品日の状態を追加
        const [deliveryDate, setDeliveryDate] = useState('');
        
        //納品数配分タブ
        const [numberOfStores, setNumberOfStores] = useState(5);  // 店舗列数を管理
        const [storeMasterData, setStoreMasterData] = useState([]); // 店舗マスタデータ


        // チェックボックスの選択状態を管理するステート
        const [storeCheckboxState, setStoreCheckboxState] = useState(
            (storeMasterData && storeMasterData.length > 0) 
                ? Array(storeMasterData.length).fill(true)  // 全てのチェックボックスをfalseで初期化
                : Array(numberOfStores).fill(true)  // numberOfStoresが使用される場合もfalseで初期化
        );

        // ソートとフィルタのステート
        const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // ソート設定
        const [filters, setFilters] = useState({}); // フィルタ条件

        // 係数データのステート
        const [coefficientData, setCoefficientData] = useState([createEmptyCoefficientRow(1)]); // 店舗係数データ

        const [patternHeaders, setPatternHeaders] = useState([]);  // パターン名を格納

        // ステートの定義部分 (Reactコンポーネントの他のuseStateと一緒に)
        const [showMasterImportControls, setShowMasterImportControls] = useState(false); 

        // 年度や期間の設定ステート
        const currentDate = new Date();
        const [year, setYear] = useState(new Date().getFullYear());
        const [month, setMonth] = useState("選択しない");
        const [weekNumber, setWeekNumber] = useState("選択しない");
        const [startDate, setStartDate] = useState("");
        const [endDate, setEndDate] = useState("");
        const [location, setLocation] = useState("");
        const [department, setDepartment] = useState("");
        const [period, setPeriod] = useState("年");

        // テーマやレスポンシブ対応のためのフック
        // 現在の日時を yyyymmddHHMMSS 形式で取得する関数
        const getFormattedDate = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}${hours}${minutes}${seconds}`;
        };

        // Excelファイルとして配分データをエクスポートする関数
        const exportToExcel = async () => {
            const worksheetData = allocationData.map(row => ({
                "納品日": row.deliveryDate,
                "商品コード": row.productCode,
                "商品名": row.productName,
                "原価": row.cost,
                "売価": row.price,
                "係数パターン": row.coefficientPattern,
                "計画残数": row.remainingPlan,
                "配分数": row.distribution,
                "単位": row.unit,
                "最低導入数": row.minimumQuantity,
                "一括導入数": row.bulkQuantity,
                "合計": row.total,
                ...row.stores.reduce((acc, val, i) => ({ ...acc, [`店舗${i + 1}`]: val }), {})
            }));

            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "納品数配分");

            const defaultFileName = `配分データ_${getFormattedDate()}.xlsx`;

            const fileHandle = await window.showSaveFilePicker({
                suggestedName: defaultFileName,
                types: [{
                    description: 'Excel Files',
                    accept: {'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']}
                }]
            });

            const writableStream = await fileHandle.createWritable();
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            await writableStream.write(buffer);
            await writableStream.close();
        };

        // CSVファイルとして配分データをエクスポートする関数
        const exportToCsv = async () => {
            const header = [
                "納品日", "商品コード", "商品名", "原価", "売価", "係数パターン", "計画残数", "配分数", "単位", "最低導入数", "一括導入数", "合計",
                ...Array.from({ length: numberOfStores }).map((_, i) => `店舗${i + 1}`)
            ];

            const rows = allocationData.map(row => [
                row.deliveryDate, row.productCode, row.productName, row.cost, row.price, row.coefficientPattern,
                row.remainingPlan, row.distribution, row.unit, row.minimumQuantity, row.bulkQuantity, row.total,
                ...row.stores
            ]);

            const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");

            const defaultFileName = `配分データ_${getFormattedDate()}.csv`;

            const fileHandle = await window.showSaveFilePicker({
                suggestedName: defaultFileName ,
                types: [{
                    description: 'CSV Files',
                    accept: {'text/csv': ['.csv']}
                }]
            });

            const writableStream = await fileHandle.createWritable();
            await writableStream.write(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
            await writableStream.close();
        };

        // 選択された行を削除する関数
        const handleDeleteSelectedRows = () => {
            // 選択されていない行だけを残すようにデータをフィルタリング
            const updatedTableData = tableData.filter(row => !row.selected);
            setTableData(updatedTableData); // 更新されたデータをステートにセット
        };

        // 店舗/部署および部門の選択肢リストを定義します。
        // これらはユーザーがドロップダウンから選択できる選択肢です。
        const locations = [
            "全社",   // 例: 東京本店
            "東京本店",   // 例: 東京本店
            "大阪支店",   // 例: 大阪支店
            "名古屋支店", // 例: 名古屋支店
            "福岡支店"    // 例: 福岡支店
        ];

        const departments = [
            "全部門",   // 例: 営業部
            "営業部",   // 例: 営業部
            "企画部",   // 例: 企画部
            "開発部",   // 例: 開発部
            "総務部"    // 例: 総務部
        ];

        useEffect(() => {
            // storeMasterDataが変更されたときにコンポーネントが再レンダリングされる
        }, [storeMasterData]);
       
        // デフォルト行数を設定
        useEffect(() => {
            if (activeTab === 1) {
                // 既存のデータがある場合は初期化しない
                if (allocationData.length === 0) {
                    setAllocationData(Array(rowCount).fill().map((_, idx) => createEmptyRow(idx + 1)));
                }
            }
        }, [activeTab]); // rowCountを依存配列から除外

        // 商品行数や店舗列数が変更された際にテーブルデータを初期化するためのuseEffectフック
        useEffect(() => {
            // rowCount（行数）に基づいてallocationDataを初期化する
            const initialData = Array(rowCount).fill().map((_, idx) => ({
                id: idx + 1,
                selected: false, // 行の選択状態を管理するフラグ
                deliveryDate: "", // 納品日
                productCode: "",  // 商品コード
                productName: "",  // 商品名
                cost: 0,          // 原価
                price: 0,         // 売価
                coefficientPattern: "", // 係数パターン
                remainingPlan: 0,       // 計画残数
                distribution: 0,        // 配分数
                unit: 1,               // 単位
                minimumQuantity: 0,     // 最低導入数
                bulkQuantity: 0,        // 一括導入数
                stores: Array(numberOfStores).fill(0), // 店舗ごとの配分数を格納する配列
                total: 0  // 合計（確認用）
            }));

            // 初期化したデータをallocationDataステートにセットする
            setAllocationData(initialData);
        }, [rowCount, numberOfStores]); // rowCountまたはnumberOfStoresが変更されるたびに実行

        useEffect(() => {
            // 納品数配分タブがアクティブでない場合は処理をスキップ
            if (activeTab !== 1) return;
        
            // 店舗数が0以下の場合は処理をスキップ
            if (numberOfStores <= 0) return;
        
            setAllocationTableData(prevData => {
                // 既存データがない場合は処理をスキップ
                if (!prevData || prevData.length === 0) return prevData;
        
                // 最初の行の店舗数をチェックして、変更が必要かどうかを判断
                const currentStoreCount = prevData[0]?.stores?.length || 0;
                if (currentStoreCount === numberOfStores) return prevData;
        
                // メモリ効率を考慮して、必要な場合のみ新しい配列を生成
                const newStoresTemplate = new Array(numberOfStores).fill(0);
                
                return prevData.map(row => ({
                    ...row,
                    stores: newStoresTemplate.slice(), // 新しい店舗配列のコピーを使用
                    total: 0 // 店舗数が変更されたため、合計もリセット
                }));
            });
        }, [activeTab, numberOfStores]);

        //納品日
        useEffect(() => {
            const currentDate = new Date();
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() + 7);
            setDeliveryDate(futureDate.toISOString().split('T')[0]);
        }, []);

        // 店舗数が増減した際に storeCheckboxState を更新する useEffect フック
        useEffect(() => {
            setStoreCheckboxState((prevState) => {
                // 以前の状態と新しい店舗数が一致しているか確認
                if (prevState.length === numberOfStores) {
                    return prevState;
                }

                // 新しい店舗数に合わせて配列を更新
                const newState = [...prevState];
                if (newState.length < numberOfStores) {
                    // 店舗数が増えた場合、新しい店舗分を追加（デフォルトは true）
                    return newState.concat(Array(numberOfStores - newState.length).fill(true));
                } else if (newState.length > numberOfStores) {
                    // 店舗数が減った場合、余分な店舗分を削除
                    return newState.slice(0, numberOfStores);
                }
                return newState;
            });
        }, [numberOfStores]);

        // タブの切り替えを処理する関数
        const handleTabChange = (event, newValue) => {
            setActiveTab(newValue); // 新しいタブのインデックスをactiveTabステートにセット
        };

        // 納品数配分タブがアクティブになったとき、既存のデータを再利用し、必要に応じて再初期化する

        // フィルタタブの切り替え
        const handleFilterTabChange = (event, newValue) => {
            setFilterTab(newValue);
        };

        // 行数変更時の処理
        const handleRowCountChange = (value) => {
            // 入力値を数値に変換し、有効範囲内かチェック
            const count = Math.min(Math.max(parseInt(value, 10) || 0, 1), 100);
            
            setRowCount(count);
        
            // 現在のデータ長と新しい長さを比較
            if (count === allocationData.length) {
                return; // 長さが同じ場合は何もしない
            }
        
            // 新しい配列を生成する場合は、必要な分だけを生成
            if (count > allocationData.length) {
                // 追加が必要な要素数を計算
                const additionalRows = count - allocationData.length;
                const newRows = Array(additionalRows)
                    .fill(null)
                    .map((_, index) => createEmptyAllocationRow(
                        allocationData.length + index + 1, 
                        numberOfStores
                    ));
                    
                // 既存の配列に新しい要素を追加
                setAllocationData(prevData => [...prevData, ...newRows]);
            } else {
                // 配列を短くする場合は、単純にスライス
                setAllocationData(prevData => prevData.slice(0, count));
            }
        };

        // 商品リストタブの各行データの処理
        const handleInputChange = (index, field, value) => {
            const newData = [...tableData];
            const row = newData[index];

            // フィールドの値を更新
            row[field] = value;

            // 売価と配分数が有効な数値かどうかをチェックし、合計を計算
            const price = parseFloat(row.price) || 0;
            const distribution = parseFloat(row.distribution) || 0;
            const cost = parseFloat(row.cost) || 0;
            const totalPlanQuantity = parseFloat(row.totalPlanQuantity) || 0;

            row.totalPriceAmount = isNaN(price * distribution) ? 0 : price * distribution;
            row.totalCostAmount = isNaN(cost * distribution) ? 0 : cost * distribution;
            row.totalPlanPriceAmount = isNaN(price * totalPlanQuantity) ? 0 : price * totalPlanQuantity;
            row.totalPlanCostAmount = isNaN(cost * totalPlanQuantity) ? 0 : cost * totalPlanQuantity;

            // 最後の行に入力があった場合、新しい行を追加
            if (index === tableData.length - 1 && value !== "") {
                newData.push(createEmptyRow(tableData.length + 1));
            }

            setTableData(newData);
        };


        const handleAllocationInputChange = (index, key, value) => {
            setAllocationData(prevData => {
                // スプレッド演算子を使用して新しい配列を作成し、特定のインデックスの行だけを更新
                const updatedData = prevData.map((row, i) => {
                    if (i !== index) return row;  // 対象外の行はそのまま返す
                    
                    const updatedRow = { ...row };  // 更新対象の行のみコピー
                    
                    if (key === 'stores') {
                        updatedRow.stores = value;
                        updatedRow.total = value.reduce((acc, val) => acc + val, 0);
                    } else {
                        updatedRow[key] = value;
                    }
                    
                    return updatedRow;
                });
        
                // 最後の行が編集され、値が空でない場合のみ新しい行を追加
                if (index === prevData.length - 1 && value !== "") {
                    updatedData.push(createEmptyAllocationRow(prevData.length + 1, numberOfStores));
                }
        
                return updatedData;
            });
        };

        // 係数データの変更
        const handleCoefficientInputChange = (index, field, value) => {
            const newData = [...coefficientData];
            newData[index][field] = value;
            setCoefficientData(newData);
        };

        // 行の選択状態を変更
        const handleSelectRow = (index) => {
            const newData = [...tableData];
            newData[index].selected = !newData[index].selected;
            setTableData(newData);
        };

        // 商品リストから納品数配分タブに選択された商品を転送
        const handleTransferSelectedRows = () => {
            const selectedRows = tableData.filter(row => row.selected);
            setAllocationData([...selectedRows, ...allocationData]);
            setActiveTab(1);
        };

        // フィルタが変更された際に呼び出される関数
        const handleFilterChange = (key, value) => {
            setFilters(prevFilters => ({
                ...prevFilters,          // 以前のフィルタを維持
                [key]: value,            // 新しいフィルタ条件を追加または更新
            }));
        };

        // フィルタ条件に基づいてテーブルデータをフィルタリング
        const filteredTableData = tableData.filter(row => {
            for (const key in filters) {
                // 各フィルタ条件にマッチしない行は除外
                if (filters[key] && !row[key].toString().includes(filters[key])) {
                    return false;
                }
            }
            return true;  // すべての条件を満たす行のみを返す
        });

        // ソート処理
        const handleSort = (key) => {
            let direction = 'ascending';
            if (sortConfig.key === key && sortConfig.direction === 'ascending') {
                direction = 'descending';
            }
            setSortConfig({ key, direction });

            const sortedData = [...tableData].sort((a, b) => {
                if (a[key] < b[key]) {
                    return direction === 'ascending' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            setTableData(sortedData);
        };

        // すべての行に対して一括で納品日を設定する関数
        const setAllDeliveryDates = () => {
            // allocationDataをマップし、すべての行のdeliveryDateをdeliveryDate変数に設定
            const newData = allocationData.map(row => ({ ...row, deliveryDate: deliveryDate }));
            setAllocationData(newData); // 更新されたデータをallocationDataステートにセット
        };

        // すべての行に対して一括で納品日をクリアする関数
        const clearAllDeliveryDates = () => {
            // allocationDataをマップし、すべての行のdeliveryDateをクリア
            const newData = allocationData.map(row => ({ ...row, deliveryDate: '' }));
            setAllocationData(newData); // 更新されたデータをallocationDataステートにセット
        };

        // テーブルのクリア
        // 配分テーブルのデータをクリアする関数
        const clearTable = () => {
            // 行数に基づいてallocationDataを初期化し、全行を空にする
            const clearedData = Array(rowCount).fill().map((_, idx) => ({
                id: idx + 1,
                selected: false,
                deliveryDate: "",
                productCode: "",
                productName: "",
                cost: 0,
                price: 0,
                coefficientPattern: "",
                remainingPlan: 0,
                distribution: 0,
                unit: "1",
                minimumQuantity: 0,
                bulkQuantity: 0,
                stores: Array(numberOfStores).fill(0),
                total: 0
            }));
            setAllocationData(clearedData); // クリアしたデータをセット
        };

        const createCoefficientMapFromData = (coefficientData, patternHeaders) => {
            const coefficientMap = {}; // 店舗コードをキーとして、係数を格納するオブジェクト

            coefficientData.forEach((row) => {
                const storeCode = row.storeCode.trim(); // 店舗コードを取得
                coefficientMap[storeCode] = {}; // 店舗コードをキーとしてオブジェクトを初期化

                // 各パターンに対して係数を取得し、coefficientMapに格納
                patternHeaders.forEach((pattern, index) => {
                    const coefficient = row.patterns[index] || 1; // パターンの値を取得し、無い場合はデフォルトで1
                    coefficientMap[storeCode][pattern] = coefficient;
                });
            });

            console.log('Coefficient Map from Data:', coefficientMap); // coefficientMapをログに出力
            return coefficientMap;
        };

        // 選択された行または全ての行を配分する関数
        const distributeAllocations = (onlySelected = false) => {
            const coefficientMap = createCoefficientMapFromData(coefficientData, patternHeaders); // Coefficient Mapを生成

            // allocationData内の各行に対して処理を行う
            const distributedData = allocationData.map(row => {
                // 選択された行だけを処理するための条件分岐
                if (!onlySelected || (onlySelected && row.selected)) {
                    // storesプロパティが定義されていない場合に備えて初期化
                    if (!row.stores) {
                        row.stores = Array(numberOfStores).fill(0);
                    }

                    // 店舗数を取得
                    const totalStores = row.stores.length;

                    // 係数パターンの指定がある場合は、対応する係数を取得
                    let coefficients;
                    if (row.coefficientPattern && coefficientMap) {
                        coefficients = row.stores.map((store, i) => {
                            const storeCode = storeMasterData[i].storeCode; // 各店舗のコードを取得
                            const storeCoefficient = coefficientMap[storeCode] ? coefficientMap[storeCode][row.coefficientPattern] : 1; // 指定されたパターンに基づく係数を取得
                            console.log(`店舗コード: ${storeCode} の係数 (${row.coefficientPattern}): ${storeCoefficient}`);
                            return storeCoefficient;
                        });
                    } else {
                        coefficients = Array(totalStores).fill(1); // 指定がない場合、係数を1に初期化
                    }

                    // 配分数と単位が有効かどうかをチェック
                    if (row.distribution <= 0 || row.unit <= 0 || isNaN(row.distribution) || isNaN(row.unit)) {
                        console.log(`無効な配分数 (${row.distribution}) または単位 (${row.unit}) のため、計算をスキップします。`);
                        return {
                            ...row,
                            stores: Array(totalStores).fill(0),
                            total: 0
                        };
                    }

                    // 最低導入数が設定されているか確認
                    if (row.minimumQuantity >= 0 && !isNaN(row.minimumQuantity)) {
                        console.log(`最低導入数が設定されています (${row.minimumQuantity})`);

                        // 必要に応じて、他の処理をここに追加することができます
                    }

                    // 基本配分量を係数を使用して計算
                    const totalCoefficient = coefficients.reduce((acc, coef) => acc + coef, 0);
                    const baseQuantity = Math.floor((row.distribution -( totalStores * row.minimumQuantity ))/ row.unit);
                    let remainingQuantity = baseQuantity;

                    console.log(`商品コード: ${row.productCode}`);
                    console.log(`配分数: ${row.distribution}, 単位: ${row.unit}`);
                    console.log(`基本配分量 (配分数 / 単位): ${baseQuantity}`);
                    console.log(`店舗数: ${totalStores}`);

                    // 係数に基づいて初期配分を計算
                    const initialAllocation = coefficients.map(coef => Math.floor((baseQuantity * coef) / totalCoefficient));
                    remainingQuantity = baseQuantity - initialAllocation.reduce((acc, qty) => acc + qty, 0);

                    console.log(`初期配分結果 (係数考慮): `, initialAllocation);
                    console.log(`残りの基本配分量 (余り): ${remainingQuantity}`);

                    // 余りを係数が高い店舗順に配分
                    const sortedIndices = coefficients
                        .map((coef, index) => ({ index, coef }))   // インデックスと係数をペアにする
                        .sort((a, b) => b.coef - a.coef)           // 係数の降順でソート

                    for (let i = 0; i < remainingQuantity; i++) {
                        initialAllocation[sortedIndices[i % totalStores].index]++;
                    }

                    console.log(`余りを考慮した配分結果: `, initialAllocation);

                    // row.minimumQuantityを数値に変換し、無効な場合は0に設定
                    const minimumQuantity = isNaN(Number(row.minimumQuantity)) ? 0 : Number(row.minimumQuantity);

                    // 最終的な配分に単位を掛けて実際の配分数にし、最低導入数を足す
                    const finalAllocation = initialAllocation.map(value => (value * row.unit) + minimumQuantity);

                    console.log(`最終配分結果 (単位掛け + 最低導入数): `, finalAllocation);

                    const numericStores = finalAllocation.map(value => Number(value));

                    const total = numericStores.reduce((acc, val) => acc + val, 0);

                    console.log(`商品コード: ${row.productCode} の最終配分結果: `, numericStores);
                    console.log(`配分合計: ${total}\n`);

                    return {
                        ...row,
                        stores: numericStores,
                        total: total
                    };
                }
                return row; // 選択されていない行はそのまま返す
            });

            setAllocationData(distributedData); // 更新されたデータをセット
        };

        // 選択された行の配分をクリアする関数
        const clearSelectedAllocations = () => {
            const newData = allocationData.map(row => {
                if (row.selected) {
                    return {
                        ...row,
                        distribution: 0, // 配分数を0にリセット
                        stores: Array(row.stores.length).fill(0), // 店舗ごとの配分を0にリセット
                        total: 0 // 合計も0にリセット
                    };
                }
                return row;
            });
            setAllocationData(newData); // 更新されたデータをセット
        };

        // 配分数のみをクリアする関数を追加
        const clearDistributionOnly = () => {
            setAllocationData(allocationData.map(row => ({
                ...row,
                //distribution: 0,  // 配分数をクリア
                stores: Array(numberOfStores).fill(0),  // 店舗ごとの配分数もクリア
                total: 0  // 合計もクリア
            })));
        };

        // 店舗係数確認タブのフィルタリング処理
        const filterCoefficientData = () => {
            const filteredData = coefficientData.filter((row) => {
                const isYearMatch = row.year === year;
                const isMonthMatch = row.month === month;
                const isStartDateMatch = !startDate || new Date(row.date) >= new Date(startDate);
                const isEndDateMatch = !endDate || new Date(row.date) <= new Date(endDate);

                return isYearMatch && isMonthMatch && isStartDateMatch && isEndDateMatch;
            });

            setCoefficientData(filteredData);
        };

        // 店舗係数マスタテンプレートダウンロード
        const downloadCoefficientMasterTemplate = () => {
            const templateData = [
                ["店舗コード", "店舗名", "パターン1", "パターン2"],
                ["001", "東京本店", 1.0, 1.5],
                ["002", "大阪支店", 1.0, 1.0],
                ["003", "名古屋支店", 0.8, 1.2],
                ["004", "福岡支店", 1.1, 1.3]
            ];

            // テンプレートデータをシートに変換
            const ws = XLSX.utils.aoa_to_sheet(templateData);

            // 新しいワークブックを作成
            const wb = XLSX.utils.book_new();

            // ワークブックにシートを追加
            XLSX.utils.book_append_sheet(wb, ws, "CoefficientMasterTemplate");

            // ファイルを書き出し、ダウンロード
            XLSX.writeFile(wb, "coefficient_master_template.xlsx");
        };

        const [isDragging, setIsDragging] = useState(false); // ドラッグ中かどうかの状態
        
        // ファイルインポートを処理する統合関数
        const handleFileImport = (event, type) => {
            // ファイル選択またはドロップされたファイルを取得
            const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
            if (!file) return;  // ファイルがない場合は何もしない

            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // タイプごとの処理
                switch (type) {
                    case 'productList':
                        // 商品リストのデータを取得して保存
                        const importedProductData = json.slice(1).map((row, index) => ({
                            id: index + 1,
                            deliveryAvailableDate: row[1] || '',
                            deliveryDate: row[2] || '',
                            productCode: row[3] || '',
                            productName: row[4] || '',
                            cost: row[5] || 0,
                            price: row[6] || 0,
                            coefficientPattern: row[7] || '',
                            remainingPlan: row[8] || 0,
                            distribution: row[9] || 0,
                            unit: row[10] || '',
                            minimumQuantity: row[11] || 0,
                            bulkQuantity: row[12] || 0
                        }));
                        setTableData(importedProductData);
                        break;

                    case 'storeMaster':
                        // 店舗マスタデータを取得して保存
                        const storeData = json.slice(1).map((row) => ({
                            storeCode: row[0] || '',
                            storeName: row[1] || ''
                        }));
                        setStoreMasterData(storeData);
                        // 取り込んだ店舗数を店舗列数に反映
                        const storeCount1 = storeData.length;
                        setNumberOfStores(storeCount1);
                        break;

                    case 'coefficient':
                        // パターンのヘッダー行（1行目）を取得して保存
                        if (json.length > 0) {
                            setPatternHeaders(json[0].slice(2));  // 「店舗コード」と「店舗名」を除いたパターン部分を取得
                        } else {
                            setPatternHeaders([]); // デフォルトの空配列を設定
                        }

                        // 店舗係数データを取得して保存
                        const coefficientData = json.slice(1).map((row) => ({
                            storeCode: row[0] || '',  // 店舗コード
                            storeName: row[1] || '',  // 店舗名
                            patterns: row.slice(2).map(value => parseFloat(value) || 0)    // パターンの値を小数点付き数値として保存
                        }));
                        setCoefficientData(coefficientData);
                        // 取り込んだ係数の店舗数を店舗列数に反映
                        const storeCount2 = coefficientData.length;
                        setNumberOfStores(storeCount2);

                        // インポートされた店舗データを納品数配分タブに反映
                        const updatedAllocationData = allocationData.map((allocationRow) => {
                            const storeInfo = coefficientData.map((coefficientRow) => ({
                                storeCode: coefficientRow.storeCode,
                                storeName: coefficientRow.storeName,
                                coefficient: coefficientRow.patterns
                            }));
                            return {
                                ...allocationRow,
                                stores: storeInfo
                            };
                        });

                        // ステートを更新
                        setAllocationData(updatedAllocationData);
                        setStoreMasterData(coefficientData);
                        break;

                    default:
                        console.warn(`Unknown type: ${type}`);
                        break;
                }
            };
            reader.readAsArrayBuffer(file);  // ファイルを読み込む
        };

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
                        ["001", "東京本店"],
                        ["002", "大阪支店"],
                        ["003", "名古屋支店"],
                        ["004", "福岡支店"]
                    ];
                    break;

                case 'coefficientMaster':
                    templateData = [
                        ["店舗コード", "店舗名", "パターン1", "パターン2"],
                        ["001", "東京本店", 1.0, 1.5],
                        ["002", "大阪支店", 1.0, 1.0],
                        ["003", "名古屋支店", 0.8, 1.2],
                        ["004", "福岡支店", 1.1, 1.3]
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

        const handleFileDrop = (event, type) => {
            event.preventDefault();  // デフォルトのブラウザ動作を無効化
            handleFileImport(event, type);  // handleFileImport 関数を呼び出して、ファイルをインポート
        };

        // ドラッグオーバーイベントの処理（ドロップゾーンにドラッグしたときに発火）
        const handleDragOver = (event) => {
            event.preventDefault();  // デフォルトのブラウザ動作を無効化
        };

        // ドラッグリーブイベントの処理（ドロップゾーンからドラッグが離れたときに発火）
        const handleDragLeave = (event) => {
            event.preventDefault();  // デフォルトのブラウザ動作を無効化
        };

        const handleDrop = (e, type) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileImport(e, type); // ドロップされたファイルを処理
        };

        // 設定用の一時的な状態を保持するステートを追加
        const [tempRowCount, setTempRowCount] = useState(rowCount);
        const [tempNumberOfStores, setTempNumberOfStores] = useState(numberOfStores);

        // 設定変更を確定する関数を最適化
        const applySettings = () => {
            // 行数または店舗数が変更された場合のみ処理を実行
            if (tempRowCount !== rowCount || tempNumberOfStores !== numberOfStores) {
                // 行数と店舗数の変更を一度に適用
                setRowCount(tempRowCount);
                setNumberOfStores(tempNumberOfStores);
                
                // allocationDataを一括で更新
                setAllocationData(prevData => {
                    // 新しい配列を作成
                    const newData = new Array(tempRowCount);
                    
                    // 既存のデータを再利用
                    const existingLength = Math.min(prevData.length, tempRowCount);
                    
                    // 既存の行データを処理
                    for (let i = 0; i < existingLength; i++) {
                        const row = prevData[i];
                        newData[i] = {
                            ...row,
                            stores: row.stores ? [
                                ...row.stores.slice(0, tempNumberOfStores),
                                ...new Array(Math.max(0, tempNumberOfStores - row.stores.length)).fill(0)
                            ].slice(0, tempNumberOfStores) : new Array(tempNumberOfStores).fill(0),
                            total: 0 // 合計を初期化
                        };
                    }
                    
                    // 新しい行を追加
                    for (let i = existingLength; i < tempRowCount; i++) {
                        newData[i] = createEmptyAllocationRow(i + 1, tempNumberOfStores);
                    }
                    
                    return newData;
                });
            }
        };

        // 設定をキャンセルする関数
        const cancelSettings = () => {
            // 一時的な値を現在の設定値に戻す
            setTempRowCount(rowCount);
            setTempNumberOfStores(numberOfStores);
            setShowSettings(false);
        };

        return (
            <Container style={{ paddingLeft: '0px', paddingRight: '0px', maxWidth: '100%' }}>
                <Paper position="static" color="default">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab 
                            label="商品リスト"
                            icon={<span className="material-icons">list_alt</span>}
                            iconPosition="start"
                        />
                        <Tab 
                            label="納品数配分"
                            icon={<span className="material-icons">calculate</span>}
                            iconPosition="start"
                        />
                        <Tab 
                            label="店舗係数確認"
                            icon={<span className="material-icons">store</span>}
                            iconPosition="start"
                        />
                    </Tabs>
                </Paper>

                {/* インポートセクション */}
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
                                    {
                                        title: "商品リスト",
                                        type: 'productList',
                                        icon: 'inventory_2'
                                    },
                                    {
                                        title: "店舗マスタ",
                                        type: 'storeMaster',
                                        icon: 'store'
                                    },
                                    {
                                        title: "店舗係数",
                                        type: 'coefficientMaster',
                                        icon: 'calculate'
                                    }
                                ].map((item) => (
                                    <Grid item xs={12} md={4} key={item.type}>
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
                                                onClick={() => downloadTemplate(item.type)}
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

                {/* 商品リストタブがアクティブな場合の表示 */}
                {activeTab === 0 && (
                    <Box mt={1}>

                        {/* タブのタイトルを表示 */}
                        <Typography variant="h6" gutterBottom>商品リスト</Typography>

                        {/* 商品リストのアクションボタン */}
                        <Paper 
                            elevation={0} 
                            variant="outlined" 
                            sx={{ 
                                p: 2,
                                mb: 2,
                                backgroundColor: '#f8f9fa'
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <ButtonGroup 
                                        fullWidth 
                                        size="small"
                                        variant="contained"
                                        sx={{ 
                                            '& .MuiButton-root': {
                                                py: 1
                                            }
                                        }}
                                    >
                                        <Button
                                            component="label"
                                            startIcon={<span className="material-icons">cloud_upload</span>}
                                            sx={{ backgroundColor: '#1976d2' }}
                                        >
                                            取込
                                            <input
                                                type="file"
                                                accept=".xlsx, .xls"
                                                hidden
                                                onChange={handleFileImport}
                                            />
                                        </Button>
                                        <Button
                                            onClick={downloadTemplate}
                                            startIcon={<span className="material-icons">download</span>}
                                            sx={{ backgroundColor: '#757575' }}
                                        >
                                            テンプレート
                                        </Button>
                                    </ButtonGroup>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <ButtonGroup 
                                        fullWidth 
                                        size="small"
                                        variant="contained"
                                        sx={{ 
                                            '& .MuiButton-root': {
                                                py: 1
                                            }
                                        }}
                                    >
                                        <Button
                                            onClick={handleTransferSelectedRows}
                                            startIcon={<span className="material-icons">send</span>}
                                            sx={{ backgroundColor: '#2e7d32' }}
                                        >
                                            配分
                                        </Button>
                                        <Button
                                            onClick={handleDeleteSelectedRows}
                                            startIcon={<span className="material-icons">delete</span>}
                                            color="error"
                                        >
                                            削除
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* フィルタタブのセクション */}
                        <Grid item xs={12}>
                            {/* 全体、未配分、配分済みのフィルタタブ */}
                            <Tabs value={filterTab} onChange={handleFilterTabChange} indicatorColor="primary" textColor="primary" centered>
                                <Tab label="全て" />
                                <Tab label="未配分" />
                                <Tab label="配分済" />
                            </Tabs>
                        </Grid>

                        {/* 商品リストテーブルのセクション */}
                        <Grid item xs={12}>
                            <Box mt={2} style={{ overflowX: 'auto', width: '100%' }}>
                                <TableContainer component={Paper} style={{ width: '100%' }}>
                                    <Table size="small" style={{ minWidth: '1800px' }}>

                                        {/* フィルタ行の追加 */}
                                        <TableHead>
                                            <TableRow>

                                                {/* 全行選択用のチェックボックス */}
                                                <TableCell padding="none" style={{ width: productColumnWidths.checkbox }} align="center">
                                                    <Checkbox
                                                        inputProps={{ 'aria-label': 'select all rows' }}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            setTableData(tableData.map(row => ({ ...row, selected: checked })));  // 全行の選択状態を変更
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* 各列に対応するフィルタ入力欄を表示 */}
                                                {["No", "status", "deliveryAvailableDate", "deliveryDate", "productCode", "productName", "cost", "price", "coefficientPattern", "distribution", "unit", "minimumQuantity", "bulkQuantity"].map((key, i) =>
                                                    <TableCell key={i} padding="none" style={{ width: productColumnWidths[key] }} align="center">
                                                        <TextField
                                                            placeholder="フィルタ"
                                                            variant="standard"
                                                            onChange={(e) => handleFilterChange(key, e.target.value)}  // フィルタの条件を変更
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>

                                        {/* テーブルのデータ行のヘッダー */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="none" style={{ width: productColumnWidths.checkbox }} align="center" />
                                                <TableCell padding="none" style={{ width: productColumnWidths.no }} align="center">No</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.status }} align="center">ステータス</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.deliveryAvailableDate }} align="center">納品可能日</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.deliveryDate }} align="center">納品日</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.productCode }} align="center">商品コード</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.productName }} align="center">商品名</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.cost }} align="center">原価</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.price }} align="center">売価</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.profit }} align="center">値入</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.coefficientPattern }} align="center">パターン</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.totalPlanQuantity }} align="center">総計画数</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.distribution }} align="center">配分数</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.unit }} align="center">単位</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.minimumQuantity }} align="center">最低導入数</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.bulkQuantity }} align="center">一括導入数</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.totalCostAmount }} align="center">原価額計</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.totalPriceAmount }} align="center">売価額計</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.totalPlanCostAmount }} align="center">合計原価額</TableCell>
                                                <TableCell padding="none" style={{ width: productColumnWidths.totalPlanPriceAmount }} align="center">合計売価額</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* テーブルのデータ行を表示 */}
                                        <TableBody>
                                            {filteredTableData.map((row, index) =>
                                                <TableRow key={row.id} style={{ height: `${rowHeight}px` }}>

                                                    {/* 各行の選択用チェックボックス */}
                                                    <TableCell padding="none" style={{ width: productColumnWidths.checkbox }} align="center">
                                                        <Checkbox
                                                            checked={row.selected}
                                                            onChange={() => handleSelectRow(index)}  // 行の選択状態を変更
                                                        />
                                                    </TableCell>

                                                    {/* 行番号を表示 */}
                                                    <TableCell padding="none" align="center">{index + 1}</TableCell>

                                                    {/* ステータスのドロップダウンメニュー */}
                                                    <TableCell padding="none" align="center">
                                                        <Select
                                                            value={row.status}
                                                            onChange={(e) => handleInputChange(index, 'status', e.target.value)}  // ステータスの変更を処理
                                                            fullWidth
                                                            style={{ height: '40px', padding: 0 }}  // セレクトボックスの高さを調整
                                                            inputProps={{ style: { padding: '4px 0' } }}  // 余白を調整
                                                        >{statusOptions.map(option =>
                                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                                        )}</Select>
                                                    </TableCell>

                                                    {/* 他のフィールドも同様に処理 */}
                                                    {["deliveryAvailableDate", "deliveryDate", "productCode", "productName", "cost", "price", "profit", "coefficientPattern", "totalPlanQuantity", "distribution", "unit", "minimumQuantity", "bulkQuantity"].map((key, i) =>
                                                        <TableCell padding="none" key={i} align="center" width={productColumnWidths[key]}>
                                                            <TextField
                                                                type={key === "cost" || key === "price" || key === "distribution" || key === "minimumQuantity" || key === "bulkQuantity" || key === "totalPlanQuantity" ? "number" : "text"}
                                                                value={row[key]}
                                                                onBlur={(e) => {
                                                                    handleInputChange(index, key, e.target.value);  // 値の変更を処理

                                                                    // 最後の行が入力されている場合は新しい行を追加
                                                                    if (index === tableData.length - 1 && e.target.value !== "") {
                                                                        setTableData([...tableData, createEmptyRow(tableData.length + 1)]);
                                                                    }
                                                                }}
                                                                fullWidth
                                                                inputProps={{ style: { height: '40px', padding: '0 8px' } }}
                                                            />
                                                        </TableCell>
                                                    )}

                                                    {/* 原価額計（配分数×原価） */}
                                                    <TableCell padding="none" align="center">
                                                        {(row.distribution * row.cost).toFixed(0)}
                                                    </TableCell>

                                                    {/* 売価額計（配分数×売価） */}
                                                    <TableCell padding="none" align="center">
                                                        {(row.distribution * row.price).toFixed(0)}
                                                    </TableCell>

                                                    {/* 合計原価額（総計画数×原価） */}
                                                    <TableCell padding="none" align="center">
                                                        {(row.totalPlanQuantity * row.cost).toFixed(0)}
                                                    </TableCell>

                                                    {/* 合計売価額（総計画数×売価） */}
                                                    <TableCell padding="none" align="center">
                                                        {(row.totalPlanQuantity * row.price).toFixed(0)}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Grid>
                    </Box>
                )}
                {/* 納品数配分タブ */}
                {activeTab === 1 && (
    <Box mt={1}>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            {/* ヘッダー部分 */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs>
                    <Typography variant="h6" component="h2">納品数配分</Typography>
                </Grid>
                <Grid item>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowSettings(!showSettings)}
                        startIcon={<span className="material-icons">
                            {showSettings ? 'settings_off' : 'settings'}
                        </span>}
                    >
                        {showSettings ? "設定を閉じる" : "設定を開く"}
                    </Button>
                </Grid>
            </Grid>

            {/* 設定パネル */}
            {showSettings && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>商品行数</Typography>
                            <TextField
                                type="number"
                                value={tempRowCount}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value)) {
                                        setTempRowCount(value);
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 100) {
                                        setTempRowCount(value);
                                    } else {
                                        setTempRowCount(1); // 範囲外の値の場合は1にリセット
                                    }
                                }}
                                inputProps={{
                                    min: 1,
                                    max: 100,
                                    style: { textAlign: 'right' }
                                }}
                                fullWidth
                                size="small"
                                helperText="1から100までの数値を入力してください"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>店舗列数</Typography>
                            <TextField
                                type="number"
                                value={tempNumberOfStores}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value)) {
                                        setTempNumberOfStores(value);
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 100) {
                                        setTempNumberOfStores(value);
                                    } else {
                                        setTempNumberOfStores(1); // 範囲外の値の場合は1にリセット
                                    }
                                }}
                                inputProps={{
                                    min: 1,
                                    max: 100,
                                    style: { textAlign: 'right' }
                                }}
                                fullWidth
                                size="small"
                                helperText="1から100までの数値を入力してください"
                            />
                        </Grid>
                        {/* 設定変更のアクションボタン */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={cancelSettings}
                                    startIcon={<span className="material-icons">cancel</span>}
                                >
                                    キャンセル
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={applySettings}
                                    startIcon={<span className="material-icons">save</span>}
                                >
                                    設定を適用
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* メインアクションエリア */}
            <Grid container spacing={2}>
                {/* 納品日設定 */}
                <Grid item xs={12} md={4}>
                    <TextField
                        label="納品日"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <ButtonGroup fullWidth size="small">
                        <Button
                            onClick={setAllDeliveryDates}
                            startIcon={<span className="material-icons">event</span>}
                        >
                            一括設定
                        </Button>
                        <Button
                            onClick={clearAllDeliveryDates}
                            startIcon={<span className="material-icons">event_busy</span>}
                        >
                            クリア
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

            {/* アクションボタンエリア */}
            <Box sx={{ mt: 2, mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <ButtonGroup fullWidth size="small">
                            <Button
                                onClick={clearTable}
                                startIcon={<span className="material-icons">clear_all</span>}
                                color="error"
                            >
                                全クリア
                            </Button>
                            <Button
                                onClick={clearSelectedAllocations}
                                startIcon={<span className="material-icons">playlist_remove</span>}
                                color="warning"
                            >
                                選択クリア
                            </Button>
                            <Button
                                onClick={() => setAllocationData(allocationData.filter(row => !row.selected))}
                                startIcon={<span className="material-icons">delete</span>}
                                color="warning"
                            >
                                選択削除
                            </Button>
                            <Button
                                onClick={clearDistributionOnly}
                                startIcon={<span className="material-icons">exposure_zero</span>}
                                color="warning"
                            >
                                配分数クリア
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ButtonGroup fullWidth size="small">
                            <Button
                                onClick={() => distributeAllocations()}
                                startIcon={<span className="material-icons">all_inclusive</span>}
                                color="primary"
                            >
                                全配分
                            </Button>
                            <Button
                                onClick={() => distributeAllocations(true)}
                                startIcon={<span className="material-icons">checklist</span>}
                                color="primary"
                            >
                                選択配分
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                    <ButtonGroup fullWidth size="small">
                        <Button
                            onClick={exportToExcel}
                            startIcon={<span className="material-icons">description</span>}
                            sx={{ backgroundColor: '#2e7d32', color: 'white' }}
                        >
                            Excel
                        </Button>
                        <Button
                            onClick={exportToCsv}
                            startIcon={<span className="material-icons">table_view</span>}
                            sx={{ backgroundColor: '#616161', color: 'white' }}
                        >
                            CSV
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Paper>

        {/* テーブルセクション */}
        <Box mt={2} style={{ overflowX: 'auto', width: '100%' }}>
            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table size="small" style={{ minWidth: '1200px', tableLayout: 'fixed' }}>
                    {/* テーブルヘッダー */}
                    <TableHead>
                        <TableRow>
                            {/* 全行選択用のチェックボックスヘッダー */}
                            <TableCell padding="none" style={{ width: allocationColumnWidths.checkbox }} align="center">
                                <Checkbox
                                    inputProps={{ 'aria-label': 'select all rows' }}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setAllocationData(allocationData.map(row => ({ ...row, selected: checked })));
                                    }}
                                />
                            </TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.deliveryDate }} align="center">納品日</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.productCode }} align="center">商品コード</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.productName }} align="center">商品名</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.cost }} align="center">原価</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.price }} align="center">売価</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.coefficientPattern }} align="center">係数パターン</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.remainingPlan }} align="center">計画残数</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.distribution }} align="center">配分数</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.totalCostAmount }} align="center">原価計</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.totalPriceAmount }} align="center">売価計</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.unit }} align="center">単位</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.minimumQuantity }} align="center">最低導入数</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.bulkQuantity }} align="center">一括導入数</TableCell>
                            <TableCell padding="none" style={{ width: allocationColumnWidths.total }} align="center">合計</TableCell>

                            {/* 各店舗ごとの列ヘッダー */}
                            {(storeMasterData && storeMasterData.length > 0 ? storeMasterData : Array(numberOfStores).fill({ storeCode: '', storeName: '' })).map((store, i) =>
                                <TableCell key={i} padding="none" style={{ width: allocationColumnWidths.storeName }} align="center">
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Checkbox
                                            inputProps={{ 'aria-label': `select store ${i + 1}` }}
                                            checked={storeCheckboxState[i] || false} // undefined を避けるためにデフォルトで false を指定
                                            onChange={(e) => {
                                                const updatedCheckboxState = [...storeCheckboxState];
                                                updatedCheckboxState[i] = e.target.checked;
                                                setStoreCheckboxState(updatedCheckboxState);
                                            }}
                                        />
                                        <Typography variant="caption" align="center"> 
                                            {store.storeCode ? 
                                            <>
                                                {store.storeCode}<br />{store.storeName}
                                            </> : `店舗${i + 1}`}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            )}
                            <TableCell padding="none" style={{ width: allocationColumnWidths.total }} align="center">合計（確認）</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* テーブルボディ */}
                    <TableBody>
                        {allocationData.map((row, index) =>
                            <TableRow key={row.id} style={{ height: `${rowHeight}px` }}>
                                <TableCell padding="none" style={{ width: allocationColumnWidths.checkbox }} align="center">
                                    <Checkbox
                                        checked={row.selected}
                                        onChange={() => handleAllocationInputChange(index, 'selected', !row.selected)}
                                    />
                                </TableCell>
                                {/*納品日*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.deliveryDate }} align="center">
                                    <TextField
                                        type="date"
                                        value={row.deliveryDate}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], deliveryDate: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "deliveryDate", e.target.value)}
                                        fullWidth
                                        inputProps={{ style: { height: '40px', padding: '0 8px' } }}
                                    />
                                </TableCell>
                                {/*商品コード*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.productCode }} align="center">
                                    <TextField
                                        value={row.productCode}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], productCode: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "productCode", e.target.value)}
                                        inputProps={{ maxLength: 10, style: { height: '40px', padding: '0 8px', textAlign: "center" } }}
                                        fullWidth
                                    />
                                </TableCell>
                                {/*商品名*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.productName }} align="center">
                                    <TextField
                                        value={row.productName}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], productName: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "productName", e.target.value)}
                                        inputProps={{ maxLength: 20, style: { height: '40px', padding: '0 8px' } }}
                                        fullWidth
                                    />
                                </TableCell>
                                {/*原価*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.cost }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.cost}
                                        onChange={(e) => {
                                            // 入力中の値を即時反映
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], cost: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => {
                                            // フォーカスが外れたときに値を確定
                                            const value = parseFloat(e.target.value) || 0;
                                            handleAllocationInputChange(index, "cost", value);
                                        }}
                                        inputProps={{ maxLength: 5, style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                        fullWidth
                                    />
                                </TableCell>
                                {/*売価*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.price }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.price}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], price: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "price", e.target.value)}
                                        inputProps={{ maxLength: 5, style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                        fullWidth
                                    />
                                </TableCell>
                                 {/* 係数パターン選択のTableCell */}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.coefficientPattern }} align="center">
                                    <Select
                                        value={row.coefficientPattern}
                                        onChange={(e) => handleAllocationInputChange(index, 'coefficientPattern', e.target.value)}
                                        fullWidth
                                        style={{ height: '40px', padding: 0 }}
                                    >
                                        {patternHeaders.map((pattern, i) =>
                                            <MenuItem key={i} value={pattern}>
                                                {pattern}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </TableCell>
                                {/*計画数*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.remainingPlan }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.remainingPlan}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], remainingPlan: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "remainingPlan", e.target.value)}
                                        inputProps={{ maxLength: 5, style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                        fullWidth
                                    />
                                </TableCell>
                                {/*配分数*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.distribution }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.distribution}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], distribution: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "distribution", e.target.value)}
                                        fullWidth
                                        inputProps={{ maxLength: 5, style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                    />
                                </TableCell>
                                {/* 原価合計 */}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.totalCostAmount }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.cost && row.total ? row.cost * row.total : 0}  // 初期値0を表示
                                        disabled
                                        fullWidth
                                        inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                    />
                                </TableCell>
                                {/* 売価合計 */}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.totalPriceAmount }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.price && row.total ? row.price * row.total : 0}  // 初期値0を表示
                                        disabled
                                        fullWidth
                                        inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                    />
                                </TableCell>
                                {/*単位*/}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.unit }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.unit}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], unit: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "unit", e.target.value)}
                                        inputProps={{ maxLength: 5, style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                        fullWidth
                                    />
                                </TableCell>
                                {/* 最低導入数量 */}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.minimumQuantity }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.minimumQuantity}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], minimumQuantity: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => handleAllocationInputChange(index, "minimumQuantity", e.target.value)}
                                        inputProps={{ maxLength: 5, style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                        fullWidth
                                    />
                                </TableCell>
                                {/* 一括導入数量（この値を入力すると、すべての店舗にその数値が適用される） */}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.bulkQuantity }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.bulkQuantity}
                                        onChange={(e) => {
                                            const newData = [...allocationData];
                                            newData[index] = { ...newData[index], bulkQuantity: e.target.value };
                                            setAllocationData(newData);
                                        }}
                                        onBlur={(e) => {
                                            const bulkQuantity = parseInt(e.target.value, 10) || 0;
                                            // 一括導入数を全店舗に反映させる処理
                                            const updatedStores = Array(numberOfStores).fill(bulkQuantity);
                                            handleAllocationInputChange(index, "bulkQuantity", bulkQuantity);
                                            handleAllocationInputChange(index, "stores", updatedStores);
                                        }}
                                        inputProps={{ maxLength: 5, style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                        fullWidth
                                    />
                                </TableCell>
                                {/* 合計確認1セル */}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.total }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.total}
                                        disabled
                                        fullWidth
                                        inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                    />
                                </TableCell>
                                {/* 各店舗ごとの入力フィールド */}
                                {(storeMasterData.length > 0 ? storeMasterData : Array(numberOfStores).fill({ storeCode: '', storeName: '' })).map((store, i) =>
                                    <TableCell key={i} padding="none" style={{ width: allocationColumnWidths.storeName }} align="center">
                                        <Box>
                                            {/* 店舗コードと店舗名の表示 */}
                                            {/*React.createElement(Typography, { variant: "caption" }, store.storeCode ? `${store.storeCode}: ${store.storeName}` : `店舗${i + 1}`)*/}
                                            {/* 店舗ごとの配分数の入力フィールド */}
                                            <TextField
                                                type="number"
                                                value={(row.stores && row.stores[i] !== undefined) ? row.stores[i] : 0}  // stores配列が存在し、その要素が定義されていることを確認
                                                onChange={(e) => {
                                                    const newData = [...allocationData];
                                                    const updatedStores = row.stores ? [...row.stores] : Array(numberOfStores).fill(0);
                                                    updatedStores[i] = e.target.value;
                                                    newData[index] = { ...newData[index], stores: updatedStores };
                                                    setAllocationData(newData);
                                                }}
                                                onBlur={(e) => {
                                                    const updatedStores = row.stores ? [...row.stores] : Array(numberOfStores).fill(0);
                                                    updatedStores[i] = parseInt(e.target.value, 10) || 0;
                                                    handleAllocationInputChange(index, 'stores', updatedStores);
                                                }}
                                                fullWidth
                                                inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                            />
                                        </Box>
                                    </TableCell>
                                )}
                                {/* 合計確認セル */}
                                <TableCell padding="none" style={{ width: allocationColumnWidths.total }} align="center">
                                    <TextField
                                        type="number"
                                        value={row.total}
                                        disabled
                                        fullWidth
                                        inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "right" } }}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Box>
)}

                {/* 店舗係数確認タブ */}
                {activeTab === 2 && (
                    <Box mt={2}>
                        <Typography variant="h6" gutterBottom>店舗係数確認</Typography>
                        <Grid >
                            {/* フィルターセクション */}
                            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={8}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} sm={3}>
                                                <TextField
                                                    select
                                                    label="年度"
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                >
                                                    {years.map((y) => (
                                                        <MenuItem key={y} value={y}>{y}年</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField
                                                    select
                                                    label="月"
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                >
                                                    {months.map((m) => (
                                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField
                                                    label="開始日"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField
                                                    label="終了日"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Button
                                            variant="contained"
                                            onClick={filterCoefficientData}
                                            startIcon={<span className="material-icons">filter_alt</span>}
                                            size="medium"
                                            fullWidth
                                            sx={{ height: '40px' }}
                                        >
                                            フィルター適用
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                            {/* Coefficient Table Section */}
                            <Grid item xs={12}>
                                <Box mt={2} style={{ overflowX: 'auto', width: '100%' }}>
                                    <TableContainer component={Paper} style={{ width: '100%' }}>
                                        <Table size="small" style={{ minWidth: '1200px', tableLayout: 'fixed' }}>
                                            {/* パターンヘッダーを動的に表示するTableHead */}
                                            <TableHead>
                                                <TableRow style={{ height: `${rowHeight}px` }}>
                                                    <TableCell padding="none" style={{ width: coefficientColumnWidths.storeCode }} align="center">店舗コード</TableCell>
                                                    <TableCell padding="none" style={{ width: coefficientColumnWidths.storeName }} align="center">店舗名</TableCell>
                                                    {(patternHeaders && patternHeaders.length > 0 ? patternHeaders : ["パターン1", "パターン2"]).map((header, index) =>
                                                        <TableCell key={index} padding="none" align="center">{header}</TableCell>
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            {/* coefficientDataに基づくTableBody */}
                                            <TableBody>
                                                {(coefficientData && coefficientData.length > 0) ? coefficientData.map((row, rowIndex) =>
                                                    <TableRow key={rowIndex} style={{ height: `${rowHeight}px` }}>
                                                        <TableCell padding="none" style={{ width: coefficientColumnWidths.storeCode }} align="center">
                                                            <TextField
                                                                type="text"
                                                                value={row.storeCode}
                                                                onChange={(e) => {
                                                                    const newData = [...coefficientData];
                                                                    newData[rowIndex] = { ...newData[rowIndex], storeCode: e.target.value };
                                                                    setCoefficientData(newData);
                                                                }}
                                                                onBlur={(e) => handleCoefficientInputChange(rowIndex, 0, e.target.value)}
                                                                fullWidth
                                                                inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "center" } }}
                                                            />
                                                        </TableCell>
                                                        <TableCell padding="none" style={{ width: coefficientColumnWidths.storeName }} align="center">
                                                            <TextField
                                                                type="text"
                                                                value={row.storeName}
                                                                onChange={(e) => {
                                                                    const newData = [...coefficientData];
                                                                    newData[rowIndex] = { ...newData[rowIndex], storeName: e.target.value };
                                                                    setCoefficientData(newData);
                                                                }}
                                                                onBlur={(e) => handleCoefficientInputChange(rowIndex, 1, e.target.value)}
                                                                fullWidth
                                                                inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "center" } }}
                                                            />
                                                        </TableCell>
                                                        {(row.patterns && row.patterns.length > 0 ? row.patterns : Array(2).fill(0)).map((patternValue, patternIndex) =>
                                                            <TableCell key={patternIndex} padding="none" align="center">
                                                                <TextField
                                                                    type="number"
                                                                    step="any"
                                                                    value={patternValue}
                                                                    onChange={(e) => {
                                                                        const newData = [...coefficientData];
                                                                        const updatedPatterns = [...newData[rowIndex].patterns];
                                                                        updatedPatterns[patternIndex] = e.target.value;
                                                                        newData[rowIndex] = { ...newData[rowIndex], patterns: updatedPatterns };
                                                                        setCoefficientData(newData);
                                                                    }}
                                                                    onBlur={(e) => handleCoefficientInputChange(rowIndex, patternIndex + 2, e.target.value)}
                                                                    fullWidth
                                                                    inputProps={{ style: { height: '40px', padding: '0 8px', textAlign: "center" } }}
                                                                />
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={3} align="center">データがありません</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            
            </Container>
        );
    };
// グローバルスコープにDistributionコンポーネントを公開
window.Distribution = Distribution;
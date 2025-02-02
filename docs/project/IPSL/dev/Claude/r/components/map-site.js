function MapSite() {
    const {
      AppBar, Toolbar, Typography, CssBaseline, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button, Collapse, Checkbox, FormGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, InputLabel, Typography: MuiTypography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, TableSortLabel, RadioGroup, Radio, FormHelperText, Card, Icon, Tooltip, // 追加
    } = MaterialUI;

    // アイコンの定義
    const ExpandLessIcon = () => <Icon>expand_less</Icon>;
    const ExpandMoreIcon = () => <Icon>expand_more</Icon>;

    // カスタムテーマの作成
    const theme = MaterialUI.createTheme({
      palette: {
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#dc004e',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      },
      typography: {
        h5: {
          fontWeight: 500,
        },
        subtitle1: {
          fontSize: '1rem',
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
        },
      },
    });

    // コンポーネントの定義
    const SectionHeader = ({ title, expanded, onToggle }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onToggle} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
    );

    // テンプレートCSVデータ
    const csvContent = `店舗コード,店舗名,売上,予算,開始日,終了日,日数,住所,緯度,経度,事業区分,ブロック,面積,有効無効,POSコード,市場,市場ID
S1,東京スカイツリー（東京都）,0.00,0.00,2024-01-01,2024-12-31,365,東京都墨田区押上1-1-2,35.7100627,139.8107004,観光,押上,100㎡,有効,POS1,Market1,M1
S2,京都の金閣寺（鹿苑寺）（京都府）,0.00,0.00,2024-01-01,2024-12-31,365,京都府京都市北区金閣寺町1,35.0394,135.7292,観光,北山,150㎡,有効,POS2,Market2,M2
S3,清水寺（京都府）,0.00,0.00,2024-01-01,2024-12-31,365,京都府京都市東山区清水1丁目294,34.9949,135.7850,観光,東山,120㎡,有効,POS3,Market3,M3
S4,姫路城（兵庫県）,0.00,0.00,2024-01-01,2024-12-31,365,兵庫県姫路市本町68,34.8394,134.6939,観光,姫路,200㎡,有効,POS4,Market4,M4
S5,奈良の大仏（東大寺）（奈良県）,0.00,0.00,2024-01-01,2024-12-31,365,奈良県奈良市雑司町406-1,34.6851,135.8050,観光,奈良,180㎡,有効,POS5,Market5,M5
S6,渋谷スクランブル交差点（東京都）,0.00,0.00,2024-01-01,2024-12-31,365,東京都渋谷区渋谷スクランブル交差点,35.6595,139.7005,交通,渋谷,50㎡,有効,POS6,Market6,M6
S7,お台場のレインボーブリッジと自由の女神像（東京都）,0.00,0.00,2024-01-01,2024-12-31,365,東京都港区台場1-1,35.6308,139.7762,観光,お台場,100㎡,有効,POS7,Market7,M7
S8,東京ディズニーランド（千葉県）,0.00,0.00,2024-01-01,2024-12-31,365,千葉県浦安市舞浜1-1,35.6329,139.8804,エンターテイメント,舞浜,300㎡,有効,POS8,Market8,M8
S9,ユニバーサル・スタジオ・ジャパン（USJ）（大阪府）,0.00,0.00,2024-01-01,2024-12-31,365,大阪府大阪市此花区桜島2-1-33,34.6655,135.4321,エンターテイメント,桜島,350㎡,有効,POS9,Market9,M9
S10,東京タワー（東京都）,0.00,0.00,2024-01-01,2024-12-31,365,東京都港区芝公園4-2-8,35.6586,139.7454,観光,芝公園,120㎡,有効,POS10,Market10,M10
S11,札幌時計台（北海道）,0.00,0.00,2024-01-01,2024-12-31,365,北海道札幌市中央区北1条西2,43.0621,141.3544,観光,中央区,80㎡,有効,POS11,Market11,M11
`;

    // 初期店舗データをCSVからパースして設定
    const initialStores = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.replace(/^\ufeff/, '').trim(), // BOMを削除し、トリム
    }).data.map((row, idx) => {
      const {
        店舗コード: storeCode,
        店舗名: name,
        売上: sales,
        予算: budget,
        開始日: startDate,
        終了日: endDate,
        日数: days,
        住所: address,
        緯度: lat,
        経度: lng, // '経度'に修正
        事業区分: businessType,
        ブロック: block,
        面積: area,
        有効無効: isActive,
        POSコード: posCode,
        市場: market,
        市場ID: marketId,
      } = row;

      // 緯度と経度のパース
      let parsedLat = parseFloat(lat);
      let parsedLng = parseFloat(lng);
      if ((!parsedLat || !parsedLng) && address) {
        // デフォルトの座標を設定
        parsedLat = 35.6895;
        parsedLng = 139.6917;
      }

      // 面積のカンマを削除してパース
      let parsedArea = area ? parseFloat(area.replace(/,/g, '').replace("㎡","")) : 0;

      return {
        storeCode: storeCode || `CSV${idx + 1}`,
        name: name || `CSV Store ${idx + 1}`,
        sales: sales || "0.00",
        budget: budget || "0.00",
        startDate: startDate || "2024-01-01",
        endDate: endDate || "2024-12-31",
        days: days ? parseInt(days, 10) : 365,
        address: address || "Unknown",
        lat: parsedLat || 35.6895,
        lng: parsedLng || 139.6917,
        businessType: businessType || "Unknown",
        block: block || "Unknown",
        area: parsedArea ? `${parsedArea}㎡` : "0㎡",
        isActive: isActive || "無効",
        posCode: posCode || "Unknown",
        market: market || "Unknown",
        marketId: marketId || `M${idx + 1}`,
      };
    });

    const App = () => {
      // 初期選択状態を全選択に設定
      const [selectedStores, setSelectedStores] = React.useState(new Set(initialStores.map(store => store.storeCode)));

      const [stores, setStores] = React.useState(initialStores);
      const [filteredStores, setFilteredStores] = React.useState(initialStores);
      const [page, setPage] = React.useState(0);
      const [rowsPerPage, setRowsPerPage] = React.useState(10);
      const [globalFilterText, setGlobalFilterText] = React.useState("");
      const [expandedMap, setExpandedMap] = React.useState(true);
      const [expandedCircle, setExpandedCircle] = React.useState(true);
      const [expandedCSV, setExpandedCSV] = React.useState(false);
      const [expandedTable, setExpandedTable] = React.useState(true);

      const mapRef = React.useRef(null);
      const markersRef = React.useRef({}); // storeCode -> marker

      // 列フィルター用
      const [columnFilters, setColumnFilters] = React.useState({
        storeCode: "",
        name: "",
        sales: "",
        budget: "",
        startDate: "",
        endDate: "",
        days: "",
        address: "",
        lat: "",
        lng: "",
        businessType: "",
        block: "",
        area: "",
        isActive: "",
        posCode: "",
        market: "",
        marketId: "",
      });

      // フィルターモード（partial または exact）用の状態
      const [filterModes, setFilterModes] = React.useState({
        storeCode: "partial",
        name: "partial",
        sales: "partial",
        budget: "partial",
        startDate: "partial",
        endDate: "partial",
        days: "partial",
        address: "partial",
        lat: "partial",
        lng: "partial",
        businessType: "partial",
        block: "partial",
        area: "partial",
        isActive: "partial",
        posCode: "partial",
        market: "partial",
        marketId: "partial",
      });

      // サークル表示モード（複数選択可能）
      const [circleModes, setCircleModes] = React.useState({
        trade1: true,  // 初期は1次と2次商圏を有効
        trade2: true,
        trade3: false, // 3次商圏は初期では無効
        sales: false,
        budget: false,
        area: false,
      });
      // 商圏用設定（各レベルの半径と色）
      const [tradeSettings, setTradeSettings] = React.useState({
        trade1: { radius: 1500, color: '#77DD77' }, // 1次商圏: 1500m, パステルグリーン
        trade2: { radius: 3000, color: '#77DD77' }, // 2次商圏: 3000m, パステルグリーン
        trade3: { radius: 4500, color: '#77DD77' }, // 3次商圏: 4500m, パステルグリーン
      });

      // その他のサークル設定（売上、予算、面積）
      const [circleSettings, setCircleSettings] = React.useState({
        sales: { scale: 0.01, color: '#AEC6CF' },   // 売上: スケール 0.01, パステルブルー
        budget: { scale: 0.01, color: '#D3D3D3' },  // 予算: スケール 0.01, グレー
        area: { scale: 0.2, color: '#FFD1B3' },     // 面積: スケール 0.2, パステルオレンジ
      });

      // ドラッグオーバーの状態を管理
      const [isDragOver, setIsDragOver] = React.useState(false);

      // 詳細ダイアログの状態
      const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
      const [selectedStore, setSelectedStore] = React.useState(null);

      // 並び順の状態
      const [order, setOrder] = React.useState('asc');
      const [orderBy, setOrderBy] = React.useState('');

      // 定数: テーブル行の高さとヘッダーの高さ（px単位）
      const ROW_HEIGHT = 40; // テーブル行の高さを縮小
      const HEADER_HEIGHT = 48 * 2; // ヘッダーの高さも縮小

      // 各セクションの余白を縮小
      const sectionStyles = {
        mt: 1,  // marginTopを2から1に縮小
        '& .MuiCardContent-root': {
            p: 1,  // paddingを縮小
        },
        '& .MuiCollapse-root': {
            '& > div': {
                p: 1,  // Collapseの内部余白を縮小
            },
        },
      };

      // テーブルスタイルの更新
      const tableStyles = {
        '& .MuiTableCell-root': {
            padding: '2px 4px',  // セルの余白を縮小
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '150px',  // セル幅を縮小
            borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
            fontSize: '0.875rem',  // フォントサイズを小さく
        },
        '& .MuiTableCell-head': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            padding: '4px 4px',  // ヘッダーセルの余白
        },
      };

      React.useEffect(() => {
        if (!mapRef.current) {
          mapRef.current = L.map("map").setView([35.6895, 139.6917], 13);
          L.tileLayer(
            "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="https://www.gsi.go.jp/" target="_blank">国土地理院</a>',
            }
          ).addTo(mapRef.current);
        }

        const mapInstance = mapRef.current;
        // 既存マーカー・サークルを削除
        mapInstance.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Circle) {
            mapInstance.removeLayer(layer);
          }
        });

        // マーカーのリファレンスをリセット
        markersRef.current = {};

        // 地図に表示する店舗を選択された店舗に限定
        const storesToDisplay = filteredStores.filter(store => selectedStores.has(store.storeCode));

        storesToDisplay.forEach((store) => {
          // マーカー
          const marker = L.marker([store.lat, store.lng])
            .addTo(mapInstance)
            .bindPopup(generatePopupContent(store))
            .on('popupopen', () => {
              // Popupが開いた際のイベント（必要に応じて追加）
            });

          // マーカーをリファレンスに保存
          markersRef.current[store.storeCode] = marker;

          // 商圏サークルの描画
          Object.keys(tradeSettings).forEach((tradeLevel) => {
            if (circleModes[tradeLevel]) {
              const { radius, color } = tradeSettings[tradeLevel];
              if (radius && radius > 0) {
                L.circle([store.lat, store.lng], {
                  radius: radius,
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.2,
                }).addTo(mapInstance);
              }
            }
          });

          // その他のサークルモードの描画
          Object.keys(circleModes).forEach((mode) => {
            if (mode !== 'trade1' && mode !== 'trade2' && mode !== 'trade3' && circleModes[mode]) {
              let radius = null;
              let color = '#0000FF'; // デフォルト色

              if (mode === "sales") {
                // 売上ベース
                radius = parseFloat(store.sales) * (circleSettings.sales.scale || 1) || 0;
                color = circleSettings.sales.color || '#AEC6CF';
              } else if (mode === "budget") {
                // 予算ベース
                radius = parseFloat(store.budget) * (circleSettings.budget.scale || 1) || 0;
                color = circleSettings.budget.color || '#D3D3D3';
              } else if (mode === "area") {
                // 面積ベース (末尾の㎡を削除してパース)
                const areaVal = parseFloat(store.area.replace(/,/g, '').replace("㎡","")) || 0;
                radius = areaVal * (circleSettings.area.scale || 1) || 0;
                color = circleSettings.area.color || '#FFD1B3';
              }

              if (radius && radius > 0) {
                L.circle([store.lat, store.lng], {
                  radius: radius,
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.2,
                }).addTo(mapInstance);
              }
            }
          });
        });
      }, [filteredStores, circleModes, tradeSettings, circleSettings, selectedStores]);

      // ポップアップ内容の生成関数
      const generatePopupContent = (store) => {
        const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
        return `
          <div>
            <p><strong>店舗コード:</strong> ${store.storeCode}</p>
            <p><strong>店舗名:</strong> ${store.name}</p>
            <p><strong>住所:</strong> ${store.address}</p>
            <button onclick="window.dispatchEvent(new CustomEvent('openDetailDialog', { detail: '${store.storeCode}' }))">詳細</button>
            <button onclick="window.open('${googleMapLink}', '_blank')">Google Map</button>
          </div>
        `;
      };

      // ポップアップ内のボタンからのイベントリスナー
      React.useEffect(() => {
        const handleOpenDetailDialog = (event) => {
          const storeCode = event.detail;
          const store = stores.find(s => s.storeCode === storeCode);
          if (store) {
            setSelectedStore(store);
            setOpenDetailDialog(true);
          }
        };
        window.addEventListener('openDetailDialog', handleOpenDetailDialog);
        return () => {
          window.removeEventListener('openDetailDialog', handleOpenDetailDialog);
        };
      }, [stores]);

      // フィルタリング関数の改善
      const applyFilters = () => {
        let filtered = stores.filter((store) => {
          // グローバルフィルターの改善：複数のキーワードに対応
          const globalMatch = !globalFilterText || globalFilterText.toLowerCase().split(/\s+/).every(keyword =>
            Object.values(store).some(value => 
              String(value).toLowerCase().includes(keyword)
            )
          );

          // 列フィルターの処理
          const columnMatch = Object.entries(columnFilters).every(([col, val]) => {
            if (!val) return true;
            const storeValue = String(store[col]).toLowerCase();
            const filterValue = val.toLowerCase();
            const mode = filterModes[col];

            // 数値型とそれ以外で処理を分ける
            if (['sales', 'budget', 'days', 'lat', 'lng'].includes(col)) {
              const numericStoreValue = parseFloat(storeValue);
              const numericFilterValue = parseFloat(filterValue);
              if (isNaN(numericFilterValue)) return true;
              return mode === 'exact' 
                ? numericStoreValue === numericFilterValue
                : String(numericStoreValue).includes(filterValue);
            }
            
            return mode === 'exact' 
              ? storeValue === filterValue 
              : storeValue.includes(filterValue);
          });

          return globalMatch && columnMatch;
        });

        // 並び替えの適用
        if (orderBy) {
          filtered = stableSort(filtered, getComparator(order, orderBy));
        }

        setFilteredStores(filtered);
        setPage(0);
      };

      // フィルター適用のタイミングを修正
      const handleColumnFilterChange = (column) => (event) => {
        if (event.key === 'Enter' || event.type === 'blur') {
          const newFilters = {
            ...columnFilters,
            [column]: event.target.value,
          };
          setColumnFilters(newFilters);
          applyFilters();
        }
      };

      // フィルターモード変更時の処理を修正
      const handleFilterModeChange = (column) => (event) => {
        const newModes = {
          ...filterModes,
          [column]: event.target.value,
        };
        setFilterModes(newModes);
        applyFilters();
      };

      const handleFilterChange = (event) => {
        setGlobalFilterText(event.target.value);
      };

      const handleFilterApply = () => {
        applyFilters();
      };

      const handleFilterClear = () => {
        setGlobalFilterText("");
        setColumnFilters({
          storeCode: "",
          name: "",
          sales: "",
          budget: "",
          startDate: "",
          endDate: "",
          days: "",
          address: "",
          lat: "",
          lng: "",
          businessType: "",
          block: "",
          area: "",
          isActive: "",
          posCode: "",
          market: "",
          marketId: "",
        });
        setFilterModes({
          storeCode: "partial",
          name: "partial",
          sales: "partial",
          budget: "partial",
          startDate: "partial",
          endDate: "partial",
          days: "partial",
          address: "partial",
          lat: "partial",
          lng: "partial",
          businessType: "partial",
          block: "partial",
          area: "partial",
          isActive: "partial",
          posCode: "partial",
          market: "partial",
          marketId: "partial",
        });
        setFilteredStores(stores);
        setSelectedStores(new Set(stores.map(store => store.storeCode))); // 全選択にリセット
        setOrder('asc');
        setOrderBy('');
        setPage(0);
      };

      const fetchCoordinates = async (address) => {
        try {
          const response = await fetch(
            `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(
              address
            )}`
          );
          const data = await response.json();
          if (data.length > 0) {
            return {
              lat: data[0].geometry.coordinates[1],
              lng: data[0].geometry.coordinates[0],
            };
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
        return { lat: 35.6895, lng: 139.6917 }; 
      };

      const handleCSVUpload = async (file, encoding = 'UTF-8', uploadMethod = 'new') => {
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            let csvText = '';
            try {
              if (encoding.toUpperCase() === 'SHIFT_JIS' || encoding.toUpperCase() === 'JIS') {
                const decoder = new TextDecoder('shift_jis');
                const uint8Array = new Uint8Array(event.target.result);
                csvText = decoder.decode(uint8Array);
              } else {
                const decoder = new TextDecoder('utf-8');
                csvText = decoder.decode(event.target.result);
              }
            } catch (error) {
              console.error("Error decoding file:", error);
              alert("ファイルのデコードに失敗しました。エンコードを確認してください。");
              return;
            }

            Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              transformHeader: header => header.replace(/^\ufeff/, '').trim(), // BOMを削除し、トリム
              complete: async (results) => {
                const parsedData = results.data;
                console.log("Parsed Data:", parsedData); // デバッグ用

                const parsedStores = await Promise.all(
                  parsedData.map(async (row, idx) => {
                    // フィールド名に基づいてデータを取得
                    const {
                      店舗コード: storeCode,
                      店舗名: name,
                      売上: sales,
                      予算: budget,
                      開始日: startDate,
                      終了日: endDate,
                      日数: days,
                      住所: address,
                      緯度: lat,
                      経度: lng, // '経度'に修正
                      事業区分: businessType,
                      ブロック: block,
                      面積: area,
                      有効無効: isActive,
                      POSコード: posCode,
                      市場: market,
                      市場ID: marketId,
                    } = row;

                    // デバッグ用に各フィールドを確認
                    console.log(`Store ${idx + 1}:`, {
                      storeCode, name, sales, budget, startDate, endDate, days,
                      address, lat, lng, businessType, block, area, isActive,
                      posCode, market, marketId
                    });

                    // 緯度と経度のパース
                    let parsedLat = parseFloat(lat);
                    let parsedLng = parseFloat(lng);
                    if ((!parsedLat || !parsedLng) && address) {
                      const coordinates = await fetchCoordinates(address);
                      parsedLat = coordinates.lat;
                      parsedLng = coordinates.lng;
                    }

                    // 面積のカンマを削除してパース
                    let parsedArea = area ? parseFloat(area.replace(/,/g, '').replace("㎡","")) : 0;

                    return {
                      storeCode: storeCode || `CSV${idx + 1}`,
                      name: name || `CSV Store ${idx + 1}`,
                      sales: sales || "0.00",
                      budget: budget || "0.00",
                      startDate: startDate || "2024-01-01",
                      endDate: endDate || "2024-12-31",
                      days: days ? parseInt(days, 10) : 365,
                      address: address || "Unknown",
                      lat: parsedLat || 35.6895,
                      lng: parsedLng || 139.6917,
                      businessType: businessType || "Unknown",
                      block: block || "Unknown",
                      area: parsedArea ? `${parsedArea}㎡` : "0㎡",
                      isActive: isActive || "無効",
                      posCode: posCode || "Unknown",
                      market: market || "Unknown",
                      marketId: marketId || `M${idx + 1}`,
                    };
                  })
                );

                if (uploadMethod === 'new') {
                  setStores(parsedStores);
                  setFilteredStores(parsedStores);
                  setSelectedStores(new Set(parsedStores.map(store => store.storeCode))); // 全選択にリセット
                } else if (uploadMethod === 'append') {
                  // 既存の店舗コードと重複しないようにフィルタリング
                  const existingStoreCodes = new Set(stores.map(store => store.storeCode));
                  const newUniqueStores = parsedStores.filter(store => !existingStoreCodes.has(store.storeCode));
                  const updatedStores = [...stores, ...newUniqueStores];
                  setStores(updatedStores);
                  setFilteredStores(updatedStores);
                  setSelectedStores(new Set(updatedStores.map(store => store.storeCode))); // 全選択にリセット
                }

                setOrder('asc');
                setOrderBy('');
                setPage(0);
              },
              error: (error) => {
                console.error("Error parsing CSV:", error);
              }
            });
          };
          reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("ファイルの読み取りに失敗しました。");
          };
          reader.readAsArrayBuffer(file);
        }
      };

      const handleDrop = async (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file) {
          await handleCSVUpload(file, selectedEncoding, selectedUploadMethod);
        }
      };

      const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
      };

      const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
      };

      const handleDownloadTemplate = () => {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template.csv";
        a.click();
        URL.revokeObjectURL(url);
      };

      const toggleMap = () => {
        if (expandedMap) {
          // マップを折りたたむときはサークルも折りたたむ
          setExpandedMap(false);
          setExpandedCircle(false);
        } else {
          // マップを展開するときはサークルは以前の状態を保持
          setExpandedMap(true);
          // setExpandedCircle(true); // サークルの状態は保持
        }
      };

      const toggleCircle = () => {
        setExpandedCircle(prev => !prev);
      };

      const handleCircleModeChange = (event) => {
        const { name, checked } = event.target;
        setCircleModes((prev) => ({
          ...prev,
          [name]: checked,
        }));
      };

      // Trade Settings のハンドラー
      const handleTradeSettingChange = (level, key) => (event) => {
        const value = event.target.value;
        setTradeSettings((prev) => ({
          ...prev,
          [level]: {
            ...prev[level],
            [key]: key === 'radius' ? parseFloat(value) || prev[level][key] : value,
          },
        }));
      };

      // Circle Settings のハンドラー
      const handleCircleSettingChange = (mode, key) => (event) => {
        const value = event.target.value;
        setCircleSettings((prev) => ({
          ...prev,
          [mode]: {
            ...prev[mode],
            [key]: key === 'scale' ? parseFloat(value) || prev[mode][key] : value,
          },
        }));
      };

      const columns = [
        { key: "storeCode", label: "店舗コード" },
        { key: "name", label: "店舗名" },
        { key: "sales", label: "売上" },
        { key: "budget", label: "予算" },
        { key: "startDate", label: "開始日" },
        { key: "endDate", label: "終了日" },
        { key: "days", label: "日数" },
        { key: "address", label: "住所" },
        { key: "lat", label: "緯度" },
        { key: "lng", label: "経度" },
        { key: "businessType", label: "事業区分" },
        { key: "block", label: "ブロック" },
        { key: "area", label: "面積" },
        { key: "isActive", label: "有効無効" },
        { key: "posCode", label: "POSコード" },
        { key: "market", label: "市場" },
        { key: "marketId", label: "市場ID" },
      ];

      // ファイル入力のref
      const fileInputRef = React.useRef(null);

      const handleDropZoneClick = () => {
        fileInputRef.current.click();
      };

      // エンコード選択の状態
      const [selectedEncoding, setSelectedEncoding] = React.useState('UTF-8');

      // アップロード方法選択の状態
      const [selectedUploadMethod, setSelectedUploadMethod] = React.useState('new');

      // テーブル行クリックハンドラー
      const handleRowClick = (store) => {
        const marker = markersRef.current[store.storeCode];
        if (marker) {
          mapRef.current.setView([store.lat, store.lng], mapRef.current.getZoom());
          marker.openPopup();
        }
      };

      // チェックボックスのハンドラー
      const handleSelectStore = (storeCode) => (event) => {
        const newSelected = new Set(selectedStores);
        if (event.target.checked) {
          newSelected.add(storeCode);
        } else {
          newSelected.delete(storeCode);
        }
        setSelectedStores(newSelected);
      };

      // ヘッダーの全選択チェックボックスのハンドラー
      const handleSelectAll = (event) => {
        if (event.target.checked) {
          const newSelected = new Set(filteredStores.map(store => store.storeCode));
          setSelectedStores(new Set([...selectedStores, ...newSelected]));
        } else {
          const updatedSelected = new Set(selectedStores);
          filteredStores.forEach(store => updatedSelected.delete(store.storeCode));
          setSelectedStores(updatedSelected);
        }
      };

      // ヘッダーの全選択チェックボックスの状態
      const isAllSelected = filteredStores.length > 0 && filteredStores.every(store => selectedStores.has(store.storeCode));
      const isIndeterminate = selectedStores.size > 0 && selectedStores.size < filteredStores.length;

      // 並び替えのハンドラー
      const handleRequestSort = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

      // 並び替え用の関数を修正
      const descendingComparator = (a, b, orderBy) => {
        // 値が存在しない場合のチェックを追加
        const aValue = (a[orderBy] ?? '').toString();
        const bValue = (b[orderBy] ?? '').toString();

        if (bValue < aValue) {
            return -1;
        }
        if (bValue > aValue) {
            return 1;
        }
        return 0;
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

      return (
            <Box sx={{ gap: 1 }}>  {/* 全体の余白を縮小 */}
                {/* 地図セクション */}
                <Card sx={sectionStyles}>
                    <SectionHeader 
                        title="地図表示"
                        expanded={expandedMap}
                        onToggle={toggleMap}
                    />
                    <Collapse in={expandedMap}>
                        <Box 
                            id="map" 
                            sx={{
                                width: '100%',
                                height: '60vh',
                                margin: '0px 0'
                            }}
                        />
                        {/* サークルモード設定を地図セクション内に移動 */}
                        <Box sx={{ mt: 2 ,p:2 }}>
                            <SectionHeader 
                                title="サークルモード設定"
                                expanded={expandedCircle}
                                onToggle={toggleCircle}
                            />
                            <Collapse in={expandedCircle}>
                                <FormControl component="fieldset" sx={{ marginTop: 1 }}>
                                    <FormLabel component="legend">サークルモード</FormLabel>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={circleModes.trade1}
                                                    onChange={handleCircleModeChange}
                                                    name="trade1"
                                                />
                                            }
                                            label="1次商圏"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={circleModes.trade2}
                                                    onChange={handleCircleModeChange}
                                                    name="trade2"
                                                />
                                            }
                                            label="2次商圏"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={circleModes.trade3}
                                                    onChange={handleCircleModeChange}
                                                    name="trade3"
                                                />
                                            }
                                            label="3次商圏"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={circleModes.sales}
                                                    onChange={handleCircleModeChange}
                                                    name="sales"
                                                />
                                            }
                                            label="売上"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={circleModes.budget}
                                                    onChange={handleCircleModeChange}
                                                    name="budget"
                                                />
                                            }
                                            label="予算"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={circleModes.area}
                                                    onChange={handleCircleModeChange}
                                                    name="area"
                                                />
                                            }
                                            label="面積"
                                        />
                                    </FormGroup>
                                </FormControl>
                                {/* Circle Settings */}
                                <Box sx={{ display: "flex", gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                                    {/* 1次商圏設定 */}
                                    {circleModes.trade1 && (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <MuiTypography variant="subtitle1">1次商圏設定</MuiTypography>
                                            <TextField
                                                label="半径(m)"
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={tradeSettings.trade1.radius}
                                                onChange={handleTradeSettingChange('trade1', 'radius')}
                                                inputProps={{ min: "0", step: "100" }}
                                            />
                                            <input
                                                type="color"
                                                value={tradeSettings.trade1.color}
                                                onChange={handleTradeSettingChange('trade1', 'color')}
                                                style={{ width: '40px', height: '40px', border: 'none', padding: '0' }}
                                            />
                                        </Box>
                                    )}
                                    {/* 2次商圏設定 */}
                                    {circleModes.trade2 && (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <MuiTypography variant="subtitle1">2次商圏設定</MuiTypography>
                                            <TextField
                                                label="半径(m)"
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={tradeSettings.trade2.radius}
                                                onChange={handleTradeSettingChange('trade2', 'radius')}
                                                inputProps={{ min: "0", step: "100" }}
                                            />
                                            <input
                                                type="color"
                                                value={tradeSettings.trade2.color}
                                                onChange={handleTradeSettingChange('trade2', 'color')}
                                                style={{ width: '40px', height: '40px', border: 'none', padding: '0' }}
                                            />
                                        </Box>
                                    )}
                                    {/* 3次商圏設定 */}
                                    {circleModes.trade3 && (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <MuiTypography variant="subtitle1">3次商圏設定</MuiTypography>
                                            <TextField
                                                label="半径(m)"
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={tradeSettings.trade3.radius}
                                                onChange={handleTradeSettingChange('trade3', 'radius')}
                                                inputProps={{ min: "0", step: "100" }}
                                            />
                                            <input
                                                type="color"
                                                value={tradeSettings.trade3.color}
                                                onChange={handleTradeSettingChange('trade3', 'color')}
                                                style={{ width: '40px', height: '40px', border: 'none', padding: '0' }}
                                            />
                                        </Box>
                                    )}
                                    {/* 売上設定 */}
                                    {circleModes.sales && (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <MuiTypography variant="subtitle1">売上設定</MuiTypography>
                                            <TextField
                                                label="スケール"
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={circleSettings.sales.scale}
                                                onChange={handleCircleSettingChange('sales', 'scale')}
                                                inputProps={{ min: "0", step: "0.01" }}
                                            />
                                            <input
                                                type="color"
                                                value={circleSettings.sales.color}
                                                onChange={handleCircleSettingChange('sales', 'color')}
                                                style={{ width: '40px', height: '40px', border: 'none', padding: '0' }}
                                            />
                                        </Box>
                                    )}
                                    {/* 予算設定 */}
                                    {circleModes.budget && (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <MuiTypography variant="subtitle1">予算設定</MuiTypography>
                                            <TextField
                                                label="スケール"
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={circleSettings.budget.scale}
                                                onChange={handleCircleSettingChange('budget', 'scale')}
                                                inputProps={{ min: "0", step: "0.01" }}
                                            />
                                            <input
                                                type="color"
                                                value={circleSettings.budget.color}
                                                onChange={handleCircleSettingChange('budget', 'color')}
                                                style={{ width: '40px', height: '40px', border: 'none', padding: '0' }}
                                            />
                                        </Box>
                                    )}
                                    {/* 面積設定 */}
                                    {circleModes.area && (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <MuiTypography variant="subtitle1">面積設定</MuiTypography>
                                            <TextField
                                                label="スケール"
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={circleSettings.area.scale}
                                                onChange={handleCircleSettingChange('area', 'scale')}
                                                inputProps={{ min: "0", step: "0.1" }}
                                            />
                                            <input
                                                type="color"
                                                value={circleSettings.area.color}
                                                onChange={handleCircleSettingChange('area', 'color')}
                                                style={{ width: '40px', height: '40px', border: 'none', padding: '0' }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Collapse>
                        </Box>
                    </Collapse>
                </Card>

                {/* CSVアップロードセクション */}
                <Card sx={sectionStyles}>
                  <SectionHeader
                    title="データ管理"
                    expanded={expandedCSV}
                    onToggle={() => setExpandedCSV(!expandedCSV)}
                  />
                  <Collapse in={expandedCSV}>
                    <Box sx={{ p: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                    {/* エンコード選択 */}
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth component="fieldset">
                        <FormLabel component="legend">ファイルエンコード</FormLabel>
                        <RadioGroup
                          row
                          value={selectedEncoding}
                          onChange={(e) => setSelectedEncoding(e.target.value)}
                        >
                          <FormControlLabel value="UTF-8" control={<Radio />} label="UTF-8" />
                          <FormControlLabel value="Shift_JIS" control={<Radio />} label="Shift_JIS" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {/* アップロード方法選択 */}
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth component="fieldset">
                        <FormLabel component="legend">アップロード方法</FormLabel>
                        <RadioGroup
                          row
                          value={selectedUploadMethod}
                          onChange={(e) => setSelectedUploadMethod(e.target.value)}
                        >
                          <FormControlLabel value="new" control={<Radio />} label="新規アップロード" />
                          <FormControlLabel value="append" control={<Radio />} label="追加アップロード" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {/* ボタン */}
                    <Grid item xs={12} sm={4} container justifyContent="flex-end">
                      <Button variant="contained" color="primary" onClick={handleDownloadTemplate}>
                        Download Template
                      </Button>
                    </Grid>

                        {/* ドロップゾーン */}
                        <Grid item xs={12}>
                          <Box
                            className={`drop-zone ${isDragOver ? 'dragover' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={handleDropZoneClick}
                            sx={{
                              p: 2,
                              border: '2px dashed #ccc',
                              borderRadius: 1,
                              textAlign: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <input
                              type="file"
                              accept=".csv"
                              ref={fileInputRef}
                              onChange={(e) =>
                                handleCSVUpload(e.target.files[0], selectedEncoding, selectedUploadMethod)
                              }
                              style={{ display: "none" }}
                            />
                            Drag and drop a CSV file here or click to select a file
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Card>


                {/* テーブルセクション */}
                <Card sx={sectionStyles}>
                    <SectionHeader 
                        title="データ一覧"
                        expanded={expandedTable}
                        onToggle={() => setExpandedTable(!expandedTable)}
                    />
                    <Collapse in={expandedTable}>
                {/* 全体フィルター */}
                <Box sx={{ padding: 1, display: "flex", gap: 1, alignItems: "center", flexWrap: "flex" }}>
                  <TextField
                    label="キーワード検索 (スペース区切りで複数指定可)"
                    variant="outlined"
                    size="small"
                    value={globalFilterText}
                    onChange={handleFilterChange}
                    fullWidth
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleFilterApply}
                    sx={{ minWidth: 100 }}
                  >
                    検索
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleFilterClear}
                    sx={{ minWidth: 100 }}
                  >
                    リセット
                  </Button>
                </Box>
                    <TableContainer
                      component={Paper}
                      sx={{
                        marginTop: 1,
                        height: rowsPerPage === -1 
                          ? 'auto' 
                          : `${Math.min(rowsPerPage * ROW_HEIGHT + HEADER_HEIGHT, window.innerHeight * 0.6)}px`,
                        maxHeight: `${window.innerHeight * 0.6}px`,
                        '& .MuiTable-root': tableStyles
                      }}
                    >
                        <Table 
                            size="small" 
                        >
                            <TableHead>
                                {/* 1行目: フィルター行 */}
                                <TableRow>
                                    <TableCell padding="checkbox" />
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                <FormControl variant="standard" size="small" sx={{ minWidth: 80 }}>
                                                    <Select
                                                        value={filterModes[col.key]}
                                                        onChange={handleFilterModeChange(col.key)}
                                                        sx={{ '& .MuiSelect-select': { py: 0.5 } }}
                                                        disableUnderline
                                                    >
                                                        <MenuItem value="partial">部分一致</MenuItem>
                                                        <MenuItem value="exact">完全一致</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={columnFilters[col.key]}
                                                    onChange={(e) => setColumnFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleColumnFilterChange(col.key)(e);
                                                        }
                                                    }}
                                                    onBlur={handleColumnFilterChange(col.key)}
                                                    placeholder={`${col.label}でフィルター`}
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {/* 2行目: ヘッダーラベル行 */}
                                <TableRow
                                  sx={{
                                    // 子要素のTableCellに対して一括でスタイルを適用
                                    '& > th, & > td': {
                                      position: 'sticky',
                                      top: 0, // 固定位置。1行目がある場合は、1行目の高さ分だけオフセットする例: top: '56px'
                                      backgroundColor: 'background.paper',
                                      zIndex: 1,
                                    },
                                  }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={isIndeterminate}
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            inputProps={{ 'aria-label': 'select all stores' }}
                                        />
                                    </TableCell>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            <TableSortLabel
                                                active={orderBy === col.key}
                                                direction={orderBy === col.key ? order : 'asc'}
                                                onClick={handleRequestSort(col.key)}
                                            >
                                                {col.label}
                                                {orderBy === col.key ? (
                                                    <Box component="span" sx={{ visuallyHidden: true }}>
                                                        {order === 'desc' ? '>降順' : '>昇順'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                              {stableSort(filteredStores, getComparator(order, orderBy))
                                .slice(
                                  rowsPerPage === -1 ? 0 : page * rowsPerPage,
                                  rowsPerPage === -1 ? filteredStores.length : page * rowsPerPage + rowsPerPage
                                )
                                .map((store) => (
                                  <TableRow 
                                    key={store.storeCode} 
                                    hover 
                                    sx={{ 
                                        height: `${ROW_HEIGHT}px`,
                                        cursor: 'pointer',
                                        '& td': { 
                                            borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                                        }
                                    }}
                                  >
                                    <TableCell padding="checkbox">
                                      <Checkbox
                                        checked={selectedStores.has(store.storeCode)}
                                        onChange={handleSelectStore(store.storeCode)}
                                        inputProps={{ 'aria-labelledby': `checkbox-${store.storeCode}` }}
                                        size="small"
                                      />
                                    </TableCell>
                                    {columns.map((col) => (
                                      <Tooltip 
                                        key={col.key} 
                                        title={store[col.key]}
                                        enterDelay={500}
                                      >
                                        <TableCell 
                                            onClick={() => handleRowClick(store)}
                                        >
                                            {store[col.key]}
                                        </TableCell>
                                      </Tooltip>
                                    ))}
                                  </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                          component="div"
                          count={filteredStores.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={(event, newPage) => setPage(newPage)}
                          onRowsPerPageChange={(event) => {
                            const value = parseInt(event.target.value, 10);
                            setRowsPerPage(value === -1 ? filteredStores.length : value);
                            setPage(0);
                          }}
                          rowsPerPageOptions={[
                            { label: '10', value: 10 },
                            { label: '15', value: 20 },
                            { label: '30', value: 30 },
                            { label: '50', value: 50 },
                            { label: '全て', value: -1 },
                          ]}
                          sx={{
                            '.MuiTablePagination-toolbar': {
                                minHeight: '40px',  // 高さを縮小
                                pl: 1,
                            },
                            '.MuiTablePagination-select': {
                                py: 0,
                            }
                          }}
                        />
                    </TableContainer>
                  </Collapse>
                </Card>

                {/* 詳細ダイアログ */}
                <Dialog
                  open={openDetailDialog}
                  onClose={() => setOpenDetailDialog(false)}
                >
                  <DialogTitle>店舗詳細</DialogTitle>
                  <DialogContent>
                    {selectedStore && (
                      <>
                        <DialogContentText><strong>店舗コード:</strong> {selectedStore.storeCode}</DialogContentText>
                        <DialogContentText><strong>店舗名:</strong> {selectedStore.name}</DialogContentText>
                        <DialogContentText><strong>住所:</strong> {selectedStore.address}</DialogContentText>
                        {/* 追加の詳細情報があればここに追加 */}
                      </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDetailDialog(false)} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

          </Box>
      )
    };

    return <App />;
}


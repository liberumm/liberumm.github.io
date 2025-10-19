// features/ActionPanel.js
// 検索ボタン付き / MUI Grid v1方式（xs/sm/md指定）
// - 検索ボックス右に「検索」ボタン追加
// - レスポンシブ対応 / UMD互換（MaterialUI@5）

window.ActionPanel = (function(){
  const { Paper, Grid, Button, TextField } = MaterialUI;

  function Panel(props){
    const {
      filterAction, setFilterAction,
      searchTerm, setSearchTerm,
      columnFilters, setColumnFilters,
      checkedRows, setCheckedRows,
      onClear,
      onSearch // 🔍 検索ボタン押下時の処理を外部から渡せるように
    } = props;

    // クリアボタン動作
    const handleClear = () => {
      if (typeof onClear === "function") {
        onClear();
        return;
      }
      setFilterAction?.("all");
      setSearchTerm?.("");
      setColumnFilters?.({});
      setCheckedRows?.(new Set());
    };

    // 検索ボタン動作
    const handleSearch = () => {
      if (typeof onSearch === "function") {
        onSearch(searchTerm);
      } else {
        console.log("検索:", searchTerm);
      }
    };

    return (
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Grid container spacing={1} alignItems="center">
          {/* --- アクションボタン群 --- */}
          <Grid item xs={3} sm={2} md={2}>
            <Button
              fullWidth
              variant={filterAction === "all" ? "contained" : "outlined"}
              onClick={() => setFilterAction?.("all")}
            >
              すべて
            </Button>
          </Grid>

          <Grid item xs={3} sm={2} md={1}>
            <Button
              fullWidth
              color="primary"
              variant={filterAction === "発注" ? "contained" : "outlined"}
              onClick={() => setFilterAction?.("発注")}
            >
              発注
            </Button>
          </Grid>

          <Grid item xs={3} sm={2} md={1}>
            <Button
              fullWidth
              color="warning"
              variant={filterAction === "移管" ? "contained" : "outlined"}
              onClick={() => setFilterAction?.("移管")}
            >
              移管
            </Button>
          </Grid>

          <Grid item xs={3} sm={2} md={1}>
            <Button
              fullWidth
              color="error"
              variant={filterAction === "値下" ? "contained" : "outlined"}
              onClick={() => setFilterAction?.("値下")}
            >
              値下
            </Button>
          </Grid>

          {/* --- 分類フィルタ群 --- */}
          <Grid item xs={4} sm={2} md={1}>
            <TextField
              fullWidth
              size="small"
              label="部門"
              value={columnFilters?.dept || ""}
              onChange={(e) =>
                setColumnFilters?.((prev) => ({ ...prev, dept: e.target.value }))
              }
              placeholder="例）70衣料"
            />
          </Grid>

          <Grid item xs={4} sm={2} md={1}>
            <TextField
              fullWidth
              size="small"
              label="コーナー"
              value={columnFilters?.corner || ""}
              onChange={(e) =>
                setColumnFilters?.((prev) => ({
                  ...prev,
                  corner: e.target.value,
                }))
              }
              placeholder="例）070 レディス"
            />
          </Grid>

          <Grid item xs={4} sm={2} md={1}>
            <TextField
              fullWidth
              size="small"
              label="ライン"
              value={columnFilters?.line || ""}
              onChange={(e) =>
                setColumnFilters?.((prev) => ({
                  ...prev,
                  line: e.target.value,
                }))
              }
              placeholder="例）001 ベーシック"
            />
          </Grid>

          <Grid item xs={4} sm={2} md={1}>
            <TextField
              fullWidth
              size="small"
              label="カテゴリ"
              value={columnFilters?.category || ""}
              onChange={(e) =>
                setColumnFilters?.((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="例）0001 トップス"
            />
          </Grid>

          <Grid item xs={4} sm={2} md={1}>
            <TextField
              fullWidth
              size="small"
              label="アイテム"
              value={columnFilters?.item || ""}
              onChange={(e) =>
                setColumnFilters?.((prev) => ({
                  ...prev,
                  item: e.target.value,
                }))
              }
              placeholder="例）Tシャツ"
            />
          </Grid>

          <Grid item xs={4} sm={2} md={1}>
            <TextField
              fullWidth
              size="small"
              label="SKU"
              value={columnFilters?.sku || ""}
              onChange={(e) =>
                setColumnFilters?.((prev) => ({
                  ...prev,
                  sku: e.target.value,
                }))
              }
              placeholder="例）1234-5678-01"
            />
          </Grid>

          {/* --- 検索エリア（テキスト + ボタン） --- */}
          <Grid item xs={8} sm={4} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="商品検索（コード／名称）"
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </Grid>

          <Grid item xs={2} sm={2} md={1}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ whiteSpace: "nowrap" }}
            >
              検索
            </Button>
          </Grid>

          {/* --- クリアボタン --- */}
          <Grid item xs={2} sm={2} md={1}>
            <Button fullWidth variant="outlined" onClick={handleClear}>
              クリア
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return { Panel };
})();

// features/ActionPanel.js
// 検索ボタン付き / MUI Grid v1方式（xs/sm/md指定）
// - 検索ボックス右に「検索」ボタン追加
// - レスポンシブ対応 / UMD互換（MaterialUI@5）

window.ActionPanel = (function(){
  const { Paper, Grid, Button, TextField } = MaterialUI;

  function Panel(props){
    const {
      openActionModal,
      searchTerm,
      setSearchTerm,
      onSearch,
      onClear
    } = props;

    const [localSearchTerm, setLocalSearchTerm] = React.useState('');

    const open = (type) => {
      if(typeof openActionModal === 'function') openActionModal(type, null);
      else console.log('openActionModal not provided', type);
    };

    const handleSearch = () => {
      if(typeof setSearchTerm === 'function') setSearchTerm(localSearchTerm);
      if(typeof onSearch === 'function') onSearch(localSearchTerm);
      else console.log('検索:', localSearchTerm);
    };

    const handleClear = () => {
      setLocalSearchTerm('');
      if(typeof onClear === 'function') onClear();
      else if(typeof setSearchTerm === 'function') setSearchTerm('');
    };

    return (
      <Paper variant="outlined" sx={{ p: 1 }}>
        {/* 1段目: テキストフィールド、検索、クリア */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={8} sm={8} md={10}>
            <TextField
              fullWidth
              size="small"
              placeholder="商品コード／名称で検索"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={1}>
            <Button variant="contained" onClick={handleSearch} fullWidth>検索</Button>
          </Grid>
          <Grid item xs={2} sm={2} md={1}>
            <Button variant="outlined" onClick={handleClear} fullWidth>クリア</Button>
          </Grid>
        </Grid>
        
        {/* 2段目: 発注、移管、値下 */}
        <Grid container spacing={1}>
          <Grid item xs={4} sm={4} md={4}>
            <Button color="primary" variant="contained" onClick={() => open('発注')} fullWidth>発注</Button>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <Button color="warning" variant="contained" onClick={() => open('移管')} fullWidth>移管</Button>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <Button color="error" variant="contained" onClick={() => open('値下')} fullWidth>値下</Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return { Panel };
})();
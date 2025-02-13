window.EventDetailsModal = function EventDetailsModal({ open, onClose, eventData }) {
  const {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Button,
    Icon,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
  } = MaterialUI;

  // 各アコーディオンパネルは初期状態で展開（true）
  const [expanded, setExpanded] = React.useState({
    basic: true,
    review: true,
    attachments: true,
  });

  if (!eventData) return null;

  // クロス的に進捗状況を表示するコンポーネント
  function CrossProgressStepper() {
    // 横方向のステップ
    const steps = ['受付', '審査中', '承認待ち', '完了'];
    // 縦方向のタスク（ダミーデータ）
    // currentStep は 0 から始まるインデックスで、現在完了している最新のステップを表す
    const tasks = [
      { name: 'ヒアリングシート作成', currentStep: 1 },
      { name: '見積書提出', currentStep: 2 },
    ];

    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>タスク</TableCell>
            {steps.map((step) => (
              <TableCell align="center" key={step}>
                {step}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.name}>
              <TableCell>{task.name}</TableCell>
              {steps.map((step, index) => (
                <TableCell align="center" key={step}>
                  {index <= task.currentStep ? (
                    <Icon color="primary">check_circle</Icon>
                  ) : (
                    <Icon color="disabled">radio_button_unchecked</Icon>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>案件詳細情報</DialogTitle>
      <DialogContent>
        <Container>
          {/* TODOセクション：自分が対応するタスクが分かりやすいように「あなたのTODO」と表記 */}
          <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              あなたのTODO
            </Typography>
            {/* 横×縦の進捗状況をクロス的に表示 */}
            <Box sx={{ mb: 2 }}>
              <CrossProgressStepper />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  現在のTODO:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body1">
                    • ヒアリングシートの作成が必要です
                  </Typography>
                  <Typography variant="body1">
                    • 見積書の提出が必要です
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<Icon>assignment</Icon>}>
                  ヒアリング実施
                </Button>
                <Button variant="contained" startIcon={<Icon>description</Icon>}>
                  見積書作成
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* 案件基本情報（Accordion形式、初期状態で展開） */}
          <Paper sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 2,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'grey.200'
              }}
              onClick={() => setExpanded(prev => ({ ...prev, basic: !prev.basic }))}
            >
              <Typography variant="h6">案件基本情報</Typography>
              <Icon>{expanded.basic ? 'expand_less' : 'expand_more'}</Icon>
            </Box>
            {expanded.basic && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1">
                      タイトル: {eventData.title}
                    </Typography>
                    <Typography variant="body1">
                      開始日時: {new Date(eventData.start).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      場所: {eventData.extendedProps?.location}
                    </Typography>
                    <Typography variant="body1">
                      担当者: {eventData.extendedProps?.organizer}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1">ステータス: 受付中</Typography>
                    <Typography variant="body1">優先度: 高</Typography>
                    <Typography variant="body1">
                      詳細: {eventData.extendedProps?.description}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Button variant="contained" startIcon={<Icon>record_voice_over</Icon>}>
                      ヒアリング
                    </Button>
                    <Button variant="outlined" startIcon={<Icon>download</Icon>}>
                      ダウンロード
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>

          {/* 審査情報 */}
          <Paper sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 2,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'grey.200'
              }}
              onClick={() => setExpanded(prev => ({ ...prev, review: !prev.review }))}
            >
              <Typography variant="h6">審査情報</Typography>
              <Icon>{expanded.review ? 'expand_less' : 'expand_more'}</Icon>
            </Box>
            {expanded.review && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">審査状況: 審査中</Typography>
                    <Typography variant="body1">審査担当: 田中</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button variant="contained" startIcon={<Icon>check_circle</Icon>}>
                        承認依頼
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>

          {/* 添付資料 */}
          <Paper>
            <Box
              sx={{
                p: 2,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'grey.200'
              }}
              onClick={() => setExpanded(prev => ({ ...prev, attachments: !prev.attachments }))}
            >
              <Typography variant="h6">添付資料</Typography>
              <Icon>{expanded.attachments ? 'expand_less' : 'expand_more'}</Icon>
            </Box>
            {expanded.attachments && (
              <Box sx={{ p: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ファイル名</TableCell>
                      <TableCell>説明</TableCell>
                      <TableCell>ダウンロード</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>資料1.pdf</TableCell>
                      <TableCell>案件関連資料</TableCell>
                      <TableCell>
                        <Button variant="outlined" startIcon={<Icon>download</Icon>}>
                          DL
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

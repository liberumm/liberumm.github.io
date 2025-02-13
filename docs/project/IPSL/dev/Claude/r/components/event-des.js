export function EventDetailsModal({ open, onClose, eventData }) {
  // MaterialUI のコンポーネント（※実際は個別 import 推奨）
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
    DialogActions,
    TextField,
    Stepper,
    Step,
    StepLabel,
  } = MaterialUI;

  // --- 各種ステート ---
  // セクションの展開/折りたたみ状態
  const [expanded, setExpanded] = React.useState({
    basic: true,
    review: true,
    attachments: true,
  });

  // 案件タスクの状態（初期データ）
  const [tasks, setTasks] = React.useState([
    { 
      id: 1,
      dueDate: '2024-02-01',
      type: 'ヒアリング',
      task: 'ヒアリングシート作成',
      priority: '高',
      requester: '店舗開発部',
      createdAt: '2024-01-15',
      project: '店舗改装',
      currentStep: 1
    },
    { id: 2,
      dueDate: '2024-02-01',
      type: 'ヒアリング',
      task: 'ヒアリングシート作成',
      priority: '高',
      requester: '店舗開発部',
      createdAt: '2024-01-15',
      project: '店舗改装',
      currentStep: 1
    },
  ]);

  // タスクの進捗ステップ（タスク一覧表示用）
  const steps = ["受付", "審査中", "承認待ち", "完了"];

  // タスク作成／編集モーダルの表示状態と編集中のタスク
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);

  // 担当フェーズの定義（横軸：フェーズ）
  const phases = ["依頼", "見積", "承認", "調整", "施工", "請求", "支払", "完了"];

  // 担当フェーズの定義（縦軸：ロールと担当者、各ロールが対応するフェーズ）
  const roles = [
    {
      role: "店舗",
      person: "担当",
      responsibilities: ["依頼", "見積", "調整"],
    },
    {
      role: "取引先",
      person: "担当",
      responsibilities: ["見積", "調整", "施工", "請求"],
    },
    {
      role: "本部",
      person: "担当",
      responsibilities: ["承認", "支払", "完了"],
    },
  ];

  // 各ロールの各フェーズの進捗状態（true: 対応済み, false: 未対応）
  const [progress, setProgress] = React.useState({
    店舗: { 依頼: true, 見積: false, 調整: false },
    取引先: { 見積: true, 調整: false, 施工: false, 請求: false },
    本部: { 承認: false, 支払: false, 完了: false },
  });

  // 自分のTODOデータ（実際はAPIから取得）
  const [myTodos] = React.useState([
    {
      dueDate: '2024-02-01',
      type: '依頼',
      task: '設備改善依頼',
      priority: '高',
      requester: '店舗開発部',
      createdAt: '2024-01-15',
      project: '店舗改装',
      action: '依頼実施'
    },
    {
      dueDate: '2024-02-05',
      type: '承認',
      task: '見積書承認',
      priority: '中',
      requester: '東都ビル',
      createdAt: '2024-01-16',
      project: '店舗改装',
      action: '見積書承認'
    }
  ]);

  // --- モーダル表示前の eventData チェック ---
  if (!eventData) return null;

  // --- タスク作成／編集用ハンドラ ---
  const handleOpenTaskModal = () => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? taskData : t))
      );
    } else {
      setTasks((prev) => [...prev, taskData]);
    }
    setTaskModalOpen(false);
  };

  const handleCloseTaskModal = () => {
    setTaskModalOpen(false);
  };

  // --- サブコンポーネント：全体進捗ステッパー ---
  function OverallProgressStepper() {
    // 各フェーズの全体進捗を計算
    const overallStatus = phases.map((phase) => {
      // このフェーズを担当するロールを抽出
      const responsibleRoles = roles.filter((r) =>
        r.responsibilities.includes(phase)
      );
      if (responsibleRoles.length === 0) return true; // 担当ロールがなければ完了扱い
      // 担当ロールすべてが完了しているか
      return responsibleRoles.every(
        (r) => progress[r.role] && progress[r.role][phase] === true
      );
    });

    return (
      <Stepper alternativeLabel>
        {phases.map((phase, index) => (
          <Step key={phase} completed={overallStatus[index]}>
            <StepLabel>
              
              {/*overallStatus[index] ? (
                <Icon color="primary">check_circle</Icon>
              ) : (
                <Icon color="secondary">access_time</Icon>
              )*/} 
              
              {phase}
              
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  }

  // --- サブコンポーネント：ロール別進捗テーブル ---
  function RoleProgressTable() {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>担当</TableCell>
            {phases.map((phase) => (
              <TableCell key={phase} align="center">
                {phase}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((r) => (
            <TableRow key={r.role}>
              <TableCell>
                {r.role} ({r.person})
              </TableCell>
              {phases.map((phase) => (
                <TableCell key={phase} align="center">
                  {r.responsibilities.includes(phase) ? (
                    progress[r.role] && progress[r.role][phase] ? (
                      <Icon color="primary">check_circle</Icon>
                    ) : (
                      <Icon color="secondary">access_time</Icon>
                    )
                  ) : (
                    <Icon color="action">remove_circle_outline</Icon>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  // --- サブコンポーネント：タスク作成／編集モーダル ---
  function TaskModal({ open, onClose, task, onSave }) {
    const [name, setName] = React.useState(task ? task.name : "");
    const [currentStep, setCurrentStep] = React.useState(
      task ? task.currentStep : 0
    );

    // タスク内容が変更された場合にフォーム状態を更新
    React.useEffect(() => {
      setName(task ? task.name : "");
      setCurrentStep(task ? task.currentStep : 0);
    }, [task]);

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{task ? "タスク編集" : "タスク作成"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="タスク名"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label={`進捗 (0〜${steps.length - 1})`}
            type="number"
            fullWidth
            variant="standard"
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button
            onClick={() =>
              onSave({ id: task ? task.id : Date.now(), name, currentStep })
            }
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // --- メインレンダリング ---
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>案件詳細情報</DialogTitle>
        <DialogContent>
          <Container>
            {/* あなたのTODO */}
            <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                自分のTODO
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>完了期限</TableCell>
                    <TableCell>種類</TableCell>
                    <TableCell>タスク</TableCell>
                    <TableCell>優先度</TableCell>
                    <TableCell>依頼者</TableCell>
                    <TableCell>登録日</TableCell>
                    <TableCell>案件</TableCell>
                    <TableCell>アクション</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myTodos.map((todo, index) => (
                    <TableRow key={index}>
                      <TableCell>{todo.dueDate}</TableCell>
                      <TableCell>{todo.type}</TableCell>
                      <TableCell>{todo.task}</TableCell>
                      <TableCell>{todo.priority}</TableCell>
                      <TableCell>{todo.requester}</TableCell>
                      <TableCell>{todo.createdAt}</TableCell>
                      <TableCell>{todo.project}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Icon>
                            {todo.type === 'ヒアリング' ? 'record_voice_over' : 'description'}
                          </Icon>}
                        >
                          {todo.action}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* 全体フェーズ進捗ステッパー（統合版） */}
            <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                全体フェーズ進捗
              </Typography>
              <Box sx={{ mt: 2 }}>
                <OverallProgressStepper />
              </Box>
            </Paper>

            {/* 担当フェーズ進捗テーブル */}
            <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                担当フェーズ進捗
              </Typography>
              <Box sx={{ mt: 2 }}>
                <RoleProgressTable />
              </Box>
            </Paper>

            {/* 案件タスク一覧 */}
            <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">案件タスク一覧</Typography>
                <Button
                  variant="contained"
                  startIcon={<Icon>add</Icon>}
                  onClick={handleOpenTaskModal}
                >
                  タスク作成
                </Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>完了期限</TableCell>
                    <TableCell>種類</TableCell>
                    <TableCell>タスク</TableCell>
                    <TableCell>優先度</TableCell>
                    <TableCell>依頼者</TableCell>
                    <TableCell>登録日</TableCell>
                    <TableCell>案件</TableCell>
                    <TableCell>アクション</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>{task.requester}</TableCell>
                      <TableCell>{task.createdAt}</TableCell>
                      <TableCell>{task.project}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditTask(task)}
                        >
                          編集
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* 案件基本情報 */}
            <Paper sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "grey.200",
                }}
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, basic: !prev.basic }))
                }
              >
                <Typography variant="h6">案件基本情報</Typography>
                <Icon>{expanded.basic ? "expand_less" : "expand_more"}</Icon>
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
                      <Typography variant="body1">
                        ステータス: 受付中
                      </Typography>
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
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Icon>record_voice_over</Icon>}
                      >
                        案件詳細
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Icon>download</Icon>}
                      >
                        ダウンロード
                      </Button>
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
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "grey.200",
                }}
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    attachments: !prev.attachments,
                  }))
                }
              >
                <Typography variant="h6">添付資料</Typography>
                <Icon>{expanded.attachments ? "expand_less" : "expand_more"}</Icon>
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
                          <Button
                            variant="outlined"
                            startIcon={<Icon>download</Icon>}
                          >
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

      {/* タスク作成／編集モーダル */}
      <TaskModal
        open={taskModalOpen}
        onClose={handleCloseTaskModal}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </>
  );
}

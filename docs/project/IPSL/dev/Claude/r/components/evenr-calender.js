// サンプルデータ生成用の関数（2025年2月）
function generateEventsForFebruary() {
  const events = [];
  const startDate = new Date("2025-02-01");
  const endDate = new Date("2025-03-01"); // 3月1日未満＝2月分
  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    // 各日ごとに1～4件のイベントを生成
    const count = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < count; i++) {
      // イベントタイプは「todo」と「event」をランダムに決定
      const type = Math.random() < 0.5 ? "todo" : "event";
      // ランダムな時刻（時・分）を生成
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const dateStr =
        d.toISOString().split("T")[0] +
        `T${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00`;
      events.push({
        title: type === "todo" ? "TODO: 作業" : "Event: 予定",
        start: dateStr,
        color: type === "todo" ? "#3498db" : "#e74c3c",
        extendedProps: {
          description:
            type === "todo"
              ? "このタスクを完了してください。"
              : "このイベントに参加してください。",
          location: type === "todo" ? "オフィス" : "現場",
          organizer: type === "todo" ? "自分" : "担当者",
          type: type,
        },
      });
    }
  }
  return events;
}

// カレンダービューコンポーネント
function CalendarView({ initialDate, events, onEventClick }) {
  const calendarEl = useRef(null);
  useEffect(() => {
    const calendar = new FullCalendar.Calendar(calendarEl.current, {
      locale: "ja",
      initialDate: initialDate,
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "",
        center: "title",
        right: ""
      },
      events: events,
      height: "auto",
      eventClick: function (info) {
        info.jsEvent.preventDefault();
        if (onEventClick) {
          onEventClick(info.event);
        }
      },
    });
    calendar.render();
    return () => {
      calendar.destroy();
    };
  }, [initialDate, events, onEventClick]);
  return <div ref={calendarEl} />;
}

// カレンダーカルーセルコンポーネント
function CalendarCarousel({ events, onEventClick }) {
  const swiperContainerRef = useRef(null);
  const swiperRef = useRef(null);
  const currentDate = new Date();
  const initialRange = 2;
  const initialDates = [];
  for (let i = -initialRange; i <= initialRange; i++) {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + i);
    initialDates.push(new Date(d));
  }
  const [dates, setDates] = useState(initialDates);
  const firstChangeRef = useRef(true);

  useEffect(() => {
    swiperRef.current = new Swiper(swiperContainerRef.current, {
      initialSlide: initialRange,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      on: {
        slideChange: function () {
          if (firstChangeRef.current) {
            firstChangeRef.current = false;
            return;
          }
          setDates((prevDates) => {
            let newDates = prevDates;
            // 先頭付近の場合：過去2か月分を追加
            if (this.activeIndex <= 1) {
              const firstDate = prevDates[0];
              const additional = [];
              for (let i = 2; i > 0; i--) {
                let d = new Date(firstDate);
                d.setMonth(d.getMonth() - i);
                additional.push(d);
              }
              newDates = [...additional, ...prevDates];
              // スライド位置の補正
              this.slideTo(this.activeIndex + additional.length, 0);
            }
            // 末尾付近の場合：未来2か月分を追加
            else if (this.activeIndex >= prevDates.length - 2) {
              const lastDate = prevDates[prevDates.length - 1];
              const additional = [];
              for (let i = 1; i <= 2; i++) {
                let d = new Date(lastDate);
                d.setMonth(d.getMonth() + i);
                additional.push(d);
              }
              newDates = [...prevDates, ...additional];
            }
            return newDates;
          });
          // FullCalendar のレイアウト再計算用
          window.dispatchEvent(new Event("resize"));
        },
      },
    });
    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
    }
  }, [dates]);

  return (
    <div className="swiper" ref={swiperContainerRef}>
      <div className="swiper-wrapper">
        {dates.map((d, i) => (
          <div className="swiper-slide" key={i}>
            <CalendarView
              initialDate={d.toISOString().substring(0, 10)}
              events={events}
              onEventClick={onEventClick}
            />
          </div>
        ))}
      </div>
      <div className="swiper-pagination" />
      <div className="swiper-button-prev" />
      <div className="swiper-button-next" />
    </div>
  );
}

// メインのカレンダーアプリケーションコンポーネント
window.CalendarApp = function CalendarApp() {
  // generateEventsForFebruary() で2025年2月分のサンプルデータを生成
  const [eventItems, setEventItems] = useState(generateEventsForFebruary());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // イベントをクリックした時の処理
  const handleOpenDetailEvent = (ev) => {
    setSelectedEvent(ev);
    setEventModalOpen(true);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h7">スケジュールカレンダー</Typography>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <CalendarCarousel
          events={eventItems}
          onEventClick={handleOpenDetailEvent}
        />
      </Paper>

      <EventDetailsModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        eventData={selectedEvent}
      />
    </Box>
  );
};

// 案件詳細情報モーダルコンポーネント
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

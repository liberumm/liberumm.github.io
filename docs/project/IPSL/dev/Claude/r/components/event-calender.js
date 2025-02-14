// サンプルタスクデータ（不足している項目はデフォルト値で補完）
const sampleTasks = [
  {
    id: 1,
    task: "工事準備資料の作成",
    dueDate: "2025-02-02",
    priority: "High",
    description: "工事開始に向けた必要な資料を作成します。",
    completed: false,
  },
  {
    id: 2,
    task: "進捗会議の資料確認",
    dueDate: "2025-02-04",
    priority: "Medium",
    description: "最新の進捗状況をまとめた資料の確認を行います。",
    completed: true,
  },
  {
    id: 3,
    task: "現場訪問のスケジュール調整",
    dueDate: "2025-02-05",
    priority: "High",
    description: "各部門との調整が必要なため、訪問日時を調整します。",
    completed: false,
  },
  {
    id: 4,
    task: "資材発注確認",
    dueDate: "2025-02-06",
    priority: "Low",
    description: "必要な資材の発注状況を確認します。",
    completed: false,
  },
  {
    id: 5,
    task: "安全チェックリストの更新",
    dueDate: "2025-02-07",
    priority: "High",
    description: "最新の安全規定に基づきチェックリストを更新します。",
    completed: false,
  },
  {
    id: 6,
    task: "工程表の再確認",
    dueDate: "2025-02-08",
    priority: "Medium",
    description: "工事工程の進行状況を再確認します。",
    completed: false,
  },
  {
    id: 7,
    task: "チームミーティングの設定",
    dueDate: "2025-02-09",
    priority: "Low",
    description: "全体の連絡事項を整理し、ミーティングを設定します。",
    completed: true,
  },
  {
    id: 8,
    task: "請求書の確認",
    dueDate: "2025-02-10",
    priority: "High",
    description: "発注先との請求書の整合性を確認します。",
    completed: false,
  },
  {
    id: 9,
    task: "設備点検の予約",
    dueDate: "2025-02-11",
    priority: "Medium",
    description: "点検業者との予約を確定させます。",
    completed: false,
  },
  {
    id: 10,
    task: "現場作業の最終確認",
    dueDate: "2025-02-12",
    priority: "High",
    description: "工事完了前の最終チェックを実施します。",
    completed: true,
  },
];

// サンプルイベントデータ（end プロパティがない場合は後述の変換で補完）
const sampleEventItems = [
  {
    title: "工事開始",
    start: "2025-02-03T09:00:00",
    color: "#e74c3c",
    extendedProps: {
      description: "現場で工事開始の準備を行います。",
      location: "現場入口",
      organizer: "現場責任者",
    },
  },
  {
    title: "工程確認",
    start: "2025-02-03T14:00:00",
    color: "#f39c12",
    extendedProps: {
      description: "工程の確認ミーティングを実施します。",
      location: "会議室B",
      organizer: "工程管理者",
    },
  },
  {
    title: "店舗見学",
    start: "2025-02-05T10:00:00",
    color: "#3498db",
    extendedProps: {
      description: "新規店舗の見学を行います。",
      location: "店舗A",
      organizer: "営業担当",
    },
  },
  {
    title: "資材搬入",
    start: "2025-02-07",
    color: "#9b59b6",
    extendedProps: {
      description: "必要な資材の搬入作業を実施します。",
      location: "倉庫",
      organizer: "物流担当",
    },
  },
  {
    title: "工事進捗確認",
    start: "2025-02-10T11:00:00",
    color: "#e74c3c",
    extendedProps: {
      description: "現場の進捗状況を確認します。",
      location: "現場",
      organizer: "プロジェクトマネージャー",
    },
  },
  {
    title: "現場ミーティング",
    start: "2025-02-11T10:00:00",
    color: "#2ecc71",
    extendedProps: {
      description: "現場でミーティングを実施します。",
      location: "現場会議室",
      organizer: "リーダー",
    },
  },
  {
    title: "設計打合せ",
    start: "2025-02-11T15:00:00",
    color: "#1abc9c",
    extendedProps: {
      description: "設計に関する打合せを行います。",
      location: "設計室",
      organizer: "設計担当",
    },
  },
  {
    title: "仮設撤去",
    start: "2025-02-13",
    color: "#95a5a6",
    extendedProps: {
      description: "仮設設備の撤去作業を実施します。",
      location: "現場",
      organizer: "作業担当",
    },
  },
  {
    title: "工事中断",
    start: "2025-02-15",
    color: "#f1c40f",
    extendedProps: {
      description: "悪天候のため、一時的に工事を中断します。",
      location: "現場",
      organizer: "安全担当",
    },
  },
  {
    title: "再開準備",
    start: "2025-02-16T09:30:00",
    color: "#3498db",
    extendedProps: {
      description: "工事再開の準備を進めます。",
      location: "現場",
      organizer: "再開担当",
    },
  },
  {
    title: "工事再開",
    start: "2025-02-18T08:00:00",
    color: "#e74c3c",
    extendedProps: {
      description: "天候回復に伴い、工事を再開します。",
      location: "現場",
      organizer: "現場監督",
    },
  },
  {
    title: "安全確認",
    start: "2025-02-18T13:00:00",
    color: "#2ecc71",
    extendedProps: {
      description: "現場の安全確認を実施します。",
      location: "現場",
      organizer: "安全管理者",
    },
  },
  {
    title: "内装工事開始",
    start: "2025-02-23T10:00:00",
    color: "#d35400",
    extendedProps: {
      description: "内装工事を開始します。",
      location: "内装エリア",
      organizer: "内装担当",
    },
  },
  {
    title: "店舗見学",
    start: "2025-02-24T14:00:00",
    color: "#3498db",
    extendedProps: {
      description: "既存店舗の見学を行います。",
      location: "店舗B",
      organizer: "営業担当",
    },
  },
  {
    title: "打合せ",
    start: "2025-02-24T16:00:00",
    color: "#8e44ad",
    extendedProps: {
      description: "店舗レイアウトに関する打合せを実施します。",
      location: "会議室C",
      organizer: "プロジェクトマネージャー",
    },
  },
  {
    title: "打合せ",
    start: "2025-02-24T16:00:00",
    color: "#8e44ad",
    extendedProps: {
      description: "店舗レイアウトに関する打合せを実施します。",
      location: "会議室C",
      organizer: "プロジェクトマネージャー",
    },
  },
  {
    title: "工事完了",
    start: "2025-02-27",
    color: "#2ecc71",
    extendedProps: {
      description: "全工事が完了しました。",
      location: "現場",
      organizer: "全体統括",
    },
  },
  {
    title: "定期保守: グリストラップ清掃",
    start: "2025-02-20T08:00:00",
    color: "#27ae60",
    extendedProps: {
      description: "定期保守の一環として、グリストラップ清掃を実施します。",
      location: "施設エリア",
      organizer: "保守担当",
    },
  },
  {
    title: "定期保守: グリストラップ清掃",
    start: "2025-03-20T08:00:00",
    color: "#27ae60",
    extendedProps: {
      description: "定期保守の一環として、グリストラップ清掃を実施します。",
      location: "施設エリア",
      organizer: "保守担当",
    },
  },
  // 定期保守：設備巡回点検
  {
    title: "定期保守: 設備巡回点検",
    start: "2025-02-25T10:00:00",
    color: "#2980b9",
    extendedProps: {
      description: "定期保守の一環として、設備巡回点検を実施します。",
      location: "全施設",
      organizer: "点検担当",
    },
  },
  {
    title: "定期保守: 設備巡回点検",
    start: "2025-03-25T10:00:00",
    color: "#2980b9",
    extendedProps: {
      description: "定期保守の一環として、設備巡回点検を実施します。",
      location: "全施設",
      organizer: "点検担当",
    },
  },
  // 修繕依頼工事：焼鳥屋機器修理
  {
    title: "修繕工事: 焼鳥屋機器修理",
    start: "2025-02-28T09:00:00",
    color: "#c0392b",
    extendedProps: {
      description: "都度発生する修繕依頼工事として、焼鳥屋の機器修理を実施します。",
      location: "焼鳥屋",
      organizer: "修繕担当",
    },
  },
  {
    title: "修繕工事: 焼鳥屋機器修理",
    start: "2025-03-28T09:00:00",
    color: "#c0392b",
    extendedProps: {
      description: "都度発生する修繕依頼工事として、焼鳥屋の機器修理を実施します。",
      location: "焼鳥屋",
      organizer: "修繕担当",
    },
  },
  // 修繕工事：駐車場補修
  {
    title: "修繕工事: 駐車場補修",
    start: "2025-03-02T11:00:00",
    color: "#8e44ad",
    extendedProps: {
      description: "都度発生する修繕依頼工事として、駐車場補修を実施します。",
      location: "駐車場",
      organizer: "補修担当",
    },
  },
  {
    title: "修繕工事: 駐車場補修",
    start: "2025-03-15T11:00:00",
    color: "#8e44ad",
    extendedProps: {
      description: "都度発生する修繕依頼工事として、駐車場補修を実施します。",
      location: "駐車場",
      organizer: "補修担当",
  },
}
];

// ----------------------------------------------------
// CalendarView コンポーネント
// ----------------------------------------------------
function CalendarView({ initialDate, events, onEventClick }) {
  const calendarEl = React.useRef(null);

  React.useEffect(() => {
    const calendar = new FullCalendar.Calendar(calendarEl.current, {
      locale: "ja",
      initialDate: initialDate,
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "",
        center: "title",
        right: "",
      },
      events: events,
      height: "auto",
      dayMaxEvents: 2,
      moreLinkContent: function(arg) {
        return `+${arg.num}`;
      },
      eventClick: function(info) {
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

// ----------------------------------------------------
// CalendarCarousel コンポーネント
// ----------------------------------------------------
function CalendarCarousel({ events, onEventClick }) {
  const swiperContainerRef = React.useRef(null);
  const swiperRef = React.useRef(null);
  const currentDate = new Date();
  const initialRange = 2;
  const initialDates = [];
  for (let i = -initialRange; i <= initialRange; i++) {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + i);
    initialDates.push(new Date(d));
  }
  const [dates, setDates] = React.useState(initialDates);
  const firstChangeRef = React.useRef(true);

  React.useEffect(() => {
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
        slideChange: function() {
          if (firstChangeRef.current) {
            firstChangeRef.current = false;
            return;
          }
          setDates((prevDates) => {
            let newDates = prevDates;
            if (this.activeIndex <= 1) {
              const firstDate = prevDates[0];
              const additional = [];
              for (let i = 2; i > 0; i--) {
                let d = new Date(firstDate);
                d.setMonth(d.getMonth() - i);
                additional.push(d);
              }
              newDates = [...additional, ...prevDates];
              this.slideTo(this.activeIndex + additional.length, 0);
            } else if (this.activeIndex >= prevDates.length - 2) {
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

  React.useEffect(() => {
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

// ----------------------------------------------------
// 各データを「イベント風」に変換するヘルパー関数
// ----------------------------------------------------
const transformTaskToEvent = (task) => {
  return {
    title: task.task,
    start: task.dueDate,
    end: task.dueDate, // タスクの場合、終了時刻は完了期限と同一と仮定
    extendedProps: {
      type: "タスク",
      priority: task.priority,
      requester: "依頼者A",       // デフォルト値
      registration: "2025-01-01", // デフォルト値
      project: "案件A",           // デフォルト値
      description: task.description,
    },
  };
};

const transformEventData = (event) => {
  const startDate = new Date(event.start);
  // end がなければ、開始時刻＋1時間とする
  const endDate = event.end
    ? new Date(event.end)
    : new Date(startDate.getTime() + 60 * 60 * 1000);
  return {
    ...event,
    end: endDate.toISOString(),
    extendedProps: {
      ...event.extendedProps,
      type: "イベント",
      project: "案件A", // デフォルト値
      contact: event.extendedProps.organizer, // 問い合わせ先として利用
    },
  };
};

// ----------------------------------------------------
// CalendarApp コンポーネント
// ----------------------------------------------------
function CalendarApp() {
  const [eventItems, setEventItems] = React.useState(sampleEventItems);
  // ※ イベントもタスクもクリック時は同一モーダルで表示するため、共通の状態を使用
  const [eventModalOpen, setEventModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  // 対応が必要なタスク（完了していないもの）
  const tasksNeedingAttention = sampleTasks.filter((task) => !task.completed);

  // 直近のイベント（本日以降のイベントを開始日時順に先頭5件）
  const upcomingEvents = eventItems
    .filter((event) => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  // 共通の詳細表示ハンドラ
  const handleOpenDetailEvent = (data) => {
    setSelectedEvent(data);
    setEventModalOpen(true);
  };

  // MaterialUI コンポーネント
  const {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    Typography,
    Box,
    AppBar,
    Toolbar,
  } = MaterialUI;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h7">スケジュールカレンダー</Typography>
        </Toolbar>
      </AppBar>

      {/* Swiper（カレンダー） */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <CalendarCarousel events={eventItems} onEventClick={handleOpenDetailEvent} />
      </Paper>

      {/* 対応が必要な予定リスト（タスク） - テーブル表示 */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          対応が必要な予定
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
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksNeedingAttention.map((task) => (
              <TableRow
                key={task.id}
                sx={{ "&:hover": { backgroundColor: "grey.100" }, cursor: "pointer" }}
                onClick={() => handleOpenDetailEvent(transformTaskToEvent(task))}
              >
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{"タスク"}</TableCell>
                <TableCell>{task.task}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{"依頼者A"}</TableCell>
                <TableCell>{"2025-01-01"}</TableCell>
                <TableCell>{"案件A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* 直近の予定リスト（イベント） - テーブル表示 */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          直近の予定
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>開始時刻</TableCell>
              <TableCell>終了時刻</TableCell>
              <TableCell>種類</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>問い合わせ先</TableCell>
              <TableCell>案件</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingEvents.map((event, index) => {
              const transformed = transformEventData(event);
              return (
                <TableRow
                  key={index}
                  sx={{ "&:hover": { backgroundColor: "grey.100" }, cursor: "pointer" }}
                  onClick={() => handleOpenDetailEvent(transformed)}
                >
                  <TableCell>
                    {new Date(transformed.start).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      transformed.end
                        ? transformed.end
                        : new Date(new Date(transformed.start).getTime() + 3600000)
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>{"イベント"}</TableCell>
                  <TableCell>{transformed.title}</TableCell>
                  <TableCell>{transformed.extendedProps.organizer}</TableCell>
                  <TableCell>{"案件A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <EventDetailsModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        eventData={selectedEvent}
      />
    </Box>
  );
}

// ----------------------------------------------------
// メインのカレンダーアプリケーションをグローバルに公開
// ----------------------------------------------------
window.CalendarApp = CalendarApp;

(function(){
  // 初期タスクデータ（やることリスト）
  window.INIT_TASKS = [
    // status: open | hq_pending | approved | skipped
    { id: 'T001', type: '発注', rowLabel: '10件', detail: { rows: [] }, status: 'hq_pending' },
    { id: 'T002', type: '値下', rowLabel: '3件', detail: { rows: [] }, status: 'open' }
  ];
})();

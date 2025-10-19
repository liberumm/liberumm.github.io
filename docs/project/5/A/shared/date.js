function ymd(d){ return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10); }
function toDate(s){ return new Date(s+'T00:00:00'); }

function startOfWeek(d){ const x=new Date(d); const wd=x.getDay(); const mon=new Date(x); mon.setDate(x.getDate()-(wd===0?6:wd-1)); mon.setHours(0,0,0,0); return mon; }
function endOfWeek(d){ const e=new Date(startOfWeek(d)); e.setDate(e.getDate()+6); e.setHours(23,59,59,999); return e; }
function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999); }

function buildBuckets(range, granularity='week') {
  const MAX_COLS = 24;
  const s = toDate(range.start), e = toDate(range.end);
  const buckets = [];
  const push = (label, bs, be)=> buckets.push({label, start: ymd(bs), end: ymd(be)});

  if(granularity==='day'){
    for(let d=new Date(s); d<=e; d.setDate(d.getDate()+1)){
      const bs=new Date(d); const be=new Date(d); be.setHours(23,59,59,999);
      push(`${bs.getMonth()+1}/${bs.getDate()}`,bs,be);
    }
  } else if(granularity==='week'){
    let cur=startOfWeek(s); while(cur<=e){ const bs=new Date(cur), be=endOfWeek(cur); push(`${bs.getMonth()+1}/${bs.getDate()}週`, bs, be); cur.setDate(cur.getDate()+7); }
  } else { // month
    let cur=startOfMonth(s); while(cur<=e){ const bs=new Date(cur), be=endOfMonth(cur); push(`${bs.getFullYear()}/${bs.getMonth()+1}`, bs, be); cur=new Date(bs.getFullYear(), bs.getMonth()+1, 1); }
  }
  return buckets.length>MAX_COLS ? buckets.slice(-MAX_COLS) : buckets;
}

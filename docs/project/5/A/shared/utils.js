// shared/utils.js
window.Utils = (()=>{

  const ymd=(d)=> new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);
  const toDate=s=>new Date(s+'T00:00:00');
  const sum=(a,sel=x=>x)=>a.reduce((p,c)=>p+sel(c),0);
  const fmtYen=n=>n.toLocaleString('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0});

  const startOfWeek=(d)=>{ const x=new Date(d); const wd=x.getDay(); const mon=new Date(x); mon.setDate(x.getDate()-(wd===0?6:wd-1)); mon.setHours(0,0,0,0); return mon; };
  const endOfWeek=(d)=>{ const e=new Date(startOfWeek(d)); e.setDate(e.getDate()+6); e.setHours(23,59,59,999); return e; };
  const startOfMonth=(d)=> new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth=(d)=> new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999);
  const startOfQuarter=(d)=> new Date(d.getFullYear(), Math.floor(d.getMonth()/3)*3, 1);
  const endOfQuarter=(d)=> new Date(d.getFullYear(), Math.floor(d.getMonth()/3)*3+3, 0, 23,59,59,999);
  const startOfHalf=(d)=> new Date(d.getFullYear(), d.getMonth()<6?0:6, 1);
  const endOfHalf=(d)=> new Date(d.getFullYear(), d.getMonth()<6?6:12, 0, 23,59,59,999);
  const startOfYear=(d)=> new Date(d.getFullYear(), 0, 1);
  const endOfYear=(d)=> new Date(d.getFullYear(), 11, 31, 23,59,59,999);

  const itemCodeFromSku = (sku)=>{
    if(!sku) return '';
    const d = sku.replace(/-/g,'');
    if(d.length < 8) return sku;
    return d.slice(0,4) + '-' + d.slice(4,8);
  };

  function buildBuckets(range, granularity, custom){
    const MAX_COLS=24;
    const s=toDate(range.start), e=toDate(range.end);
    const buckets=[]; const push=(label, bs, be)=> buckets.push({label, start: ymd(bs), end: ymd(be)});
    if(granularity==='day'){
      for(let d=new Date(s); d<=e; d.setDate(d.getDate()+1)){
        const bs=new Date(d); const be=new Date(d); be.setHours(23,59,59,999);
        push(`${bs.getMonth()+1}/${bs.getDate()}`,bs,be);
      }
    } else if(granularity==='week'){
      let cur=startOfWeek(s); while(cur<=e){
        const bs=new Date(cur), be=endOfWeek(cur);
        push(`${bs.getMonth()+1}/${bs.getDate()}週`,bs,be); cur.setDate(cur.getDate()+7);
      }
    } else if(granularity==='month'){
      let cur=startOfMonth(s); while(cur<=e){
        const bs=new Date(cur), be=endOfMonth(cur);
        push(`${bs.getFullYear()}/${bs.getMonth()+1}`,bs,be);
        cur=new Date(bs.getFullYear(),bs.getMonth()+1,1);
      }
    } else if(granularity==='quarter'){
      let cur=startOfQuarter(s); while(cur<=e){
        const bs=new Date(cur), be=endOfQuarter(cur);
        const q=Math.floor(bs.getMonth()/3)+1;
        push(`${bs.getFullYear()} Q${q}`,bs,be);
        cur=new Date(be); cur.setDate(cur.getDate()+1);
      }
    } else if(granularity==='half'){
      let cur=startOfHalf(s); while(cur<=e){
        const bs=new Date(cur), be=endOfHalf(cur);
        const h=bs.getMonth()<6?'H1':'H2';
        push(`${bs.getFullYear()} ${h}`,bs,be);
        cur=new Date(be); cur.setDate(cur.getDate()+1);
      }
    } else if(granularity==='year'){
      let cur=startOfYear(s); while(cur<=e){
        const bs=new Date(cur), be=endOfYear(cur);
        push(`${bs.getFullYear()}`, bs, be);
        cur=new Date(be); cur.setDate(cur.getDate()+1);
      }
    } else if(granularity==='custom'){
      const step=Math.max(1,custom?.intervalDays||7);
      const cols=Math.max(1,custom?.columns||8);
      let end=new Date(e);
      for(let i=0;i<cols;i++){
        const be=new Date(end); const bs=new Date(end); bs.setDate(bs.getDate()-step+1);
        push(`${bs.getMonth()+1}/${bs.getDate()}–${be.getMonth()+1}/${be.getDate()}`,bs,be);
        end=new Date(bs); end.setDate(end.getDate()-1); if(bs<s) break;
      }
      buckets.reverse();
    } else {
      let cur=startOfMonth(s); while(cur<=e){ const bs=new Date(cur), be=endOfMonth(cur); push(`${bs.getFullYear()}/${bs.getMonth()+1}`,bs,be); cur=new Date(bs.getFullYear(),bs.getMonth()+1,1); }
    }
    if(buckets.length>MAX_COLS) return {buckets:buckets.slice(-MAX_COLS), limited:true, MAX_COLS};
    return {buckets, limited:false, MAX_COLS};
  }

  return {
    ymd, toDate, sum, fmtYen,
    startOfWeek, endOfWeek, startOfMonth, endOfMonth,
    startOfQuarter, endOfQuarter, startOfHalf, endOfHalf, startOfYear, endOfYear,
    itemCodeFromSku, buildBuckets
  };
})();

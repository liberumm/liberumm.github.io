//<!-- data/fixtures.js -->
// APIは維持: window.FIXTURES = { ITEMS, PRODUCTS, P_TAXO, INVENTORY, SALES }
(function seed(){
  const {
    NUM_SKUS,
    CORNERS,
    NAME_BANK,
    LINE_MASTER,
    CATEGORY_MASTER,
    STORES
  } = window.MASTERS;

  // ─────────────────────────────
  // 共通ユーティリティ
  // ─────────────────────────────
  let __seed = 20251019;
  const rand = () => ( __seed = (__seed*1664525+1013904223) % 4294967296 ) / 4294967296;
  const randInt = (min,max)=> Math.floor(rand()*(max-min+1))+min; // [min,max]
  const ymd = d => new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);

  // ─────────────────────────────
  // 名前決定（コーナー→名前バンク）
  // ─────────────────────────────
  const pickNameForCorner = (corner, itemIndexZeroBased) => {
    const code3 = corner.slice(0,3);
    const bank = NAME_BANK[code3] || { items: ['アイテム'], variants: ['A','B','C','D'] };
    const base = bank.items[itemIndexZeroBased % bank.items.length];
    return { base, variants: bank.variants };
  };

  // ─────────────────────────────
  // アイテムコード(8桁) / SKUコード(10桁)
  // ─────────────────────────────
  const makeItemCode8 = (categoryCode, itemIdx) => {
    // カテゴリコードを先頭4桁、連番を後ろ4桁として使用
    const b = String(2000 + itemIdx).slice(-4);
    return `${categoryCode}-${b}`;       // 例: 0001-2001
  };
  const makeSkuCode10 = (item8, skuNo0based) => {
    const branch = String(10 + skuNo0based).padStart(2,'0'); // 10,11,12...
    return `${item8}-${branch}`;       // 例: 0001-2001-10
  };

  // ─────────────────────────────
  // アイテム基準の計画終了日(EOL)生成（アイテムコードから決定論的に）
  //  - 70%: 未来（+45〜+180日）
  //  - 20%: 過去（-30〜-10日）
  //  - 10%: なし（null）
  // ※ 同一アイテム内の全SKUで同一EOL
  // ─────────────────────────────
  function hashStr(s){
    let h=2166136261>>>0;
    for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h*Math.imul(16777619,1))>>>0; }
    return h>>>0;
  }
  function makePlannedEOLForItemByCode(itemCode8) {
    const base = new Date();
    const h = hashStr(itemCode8);
    const r01 = (h % 1000) / 1000; // 0.000〜0.999
    if (r01 < 0.10) return null; // 10%: null（フォールバックで補う）
    if (r01 < 0.30) {            // 20%: 過去（-10〜-30日）
      const past = new Date(base);
      const pastDays = 10 + (h % 21); // 10〜30
      past.setDate(past.getDate() - pastDays);
      return ymd(past);
    }
    // 70%: 未来（+45〜+180日）
    const future = new Date(base);
    const futureDays = 45 + (h % 136); // 45〜180
    future.setDate(future.getDate() + futureDays);
    return ymd(future);
  }

  // ─────────────────────────────
  // マスター & 取引用配列
  // ─────────────────────────────
  const ITEMS = [];
  const PRODUCTS = [];
  const P_TAXO = [];
  const P_TAXO_MAP = {}; // 内部用：productId -> taxonomy

  // ─────────────────────────────
  // 商品生成
  //   - 先にアイテムを確定し、各アイテムに 1〜5 SKU を付与
  //   - NUM_SKUS 合計を満たしたら終了
  //   - アイテムEOLを作成し、SKUのeolへ「必ずコピー」
  // ─────────────────────────────
  let remaining = NUM_SKUS;
  let itemIdx = 1;
  while (remaining > 0) {
    const skusForItem = Math.min(remaining, randInt(1,5)); // 1〜5
    const itemId   = 'I' + String(itemIdx).padStart(4,'0');
    const corner   = CORNERS[(itemIdx-1) % CORNERS.length];
    const { base: baseName, variants } = pickNameForCorner(corner, itemIdx-1);

    // コーナーに対応するラインとカテゴリを取得してアイテムコードを生成
    const CORNER_LINE_MAP = window.MASTERS.CORNER_LINE_MAP || {};
    
    const cornerLines = CORNER_LINE_MAP[corner] || [];
    const selectedLine = cornerLines.length > 0 ? cornerLines[(itemIdx - 1) % cornerLines.length] : `${LINE_MASTER[0].code} ${LINE_MASTER[0].name}`;
    
    // ラインに属するカテゴリを取得
    const lineCategories = window.MASTERS.getRelatedCategories(selectedLine);
    const selectedCategory = lineCategories.length > 0 ? lineCategories[(itemIdx - 1) % lineCategories.length] : `${CATEGORY_MASTER[0].code} ${CATEGORY_MASTER[0].name}`;
    
    const [categoryCode] = selectedCategory.split(' ', 1);
    const itemCode8 = makeItemCode8(categoryCode, itemIdx);
    const itemEOL   = makePlannedEOLForItemByCode(itemCode8);

    // 防御的: nullのときは90日後で補完（SKUは必ずEOLを持つ）
    const ensuredItemEOL = (() => {
      if (itemEOL) return itemEOL;
      const f = new Date(); f.setDate(f.getDate()+90);
      return ymd(f);
    })();

    ITEMS.push({
      id:itemId, code:itemCode8, name:baseName, corner, dept:'70衣料', planEnd: ensuredItemEOL
    });

    for (let k=0; k<skusForItem; k++) {
      const skuIndex = NUM_SKUS - remaining + 1; // 1-based通番
      const skuId    = 'SKU' + String(skuIndex).padStart(4,'0');
      const skuCode  = makeSkuCode10(itemCode8, k);

      const basePrice     = 1000 + ((itemIdx % 5) * 100) + ((k%3)*50);
      const price         = Math.round(basePrice/10)*10;
      const variantLabel  = variants[k % variants.length];
      const prodName      = `${baseName} ${variantLabel}`;

      // ★ SKUのeol = アイテムEOL（フォールバック後）をそのままコピー
      const prod = {
        id: skuId,
        sku: skuCode,
        name: prodName,
        price,
        dept:'70衣料',
        eol: ensuredItemEOL,
        itemId,
        itemName: baseName
      };
      PRODUCTS.push(prod);

      // タクソノミー（既に取得済みの値を使用）
      const [lineCode, lineName] = selectedLine.split(' ', 2);
      const [categoryCode, categoryName] = selectedCategory.split(' ', 2);
      
      const taxo = {
        productId: skuId,
        corner,
        line: selectedLine,
        lineCode, lineName,
        category: selectedCategory,
        categoryCode, categoryName,
        item: baseName
      };
      P_TAXO.push(taxo);
      P_TAXO_MAP[skuId] = taxo;

      remaining--;
      if (remaining<=0) break;
    }
    itemIdx++;
  }

  // ─────────────────────────────
  // 在庫生成（現時点）
  // ─────────────────────────────
  const INVENTORY = [];
  PRODUCTS.forEach(p=>{
    // 商品ごとに店舗間で大きなアンバランスな在庫分布を生成（移管計算用）
    const totalInv = 300 + Math.round(rand() * 400); // 総在庫 300-700
    const productHash = hashStr(p.id) % 100;
    
    const storeWeights = STORES.map(s => {
      // 60%の商品で極端なアンバランスを作る
      if (productHash < 15) { // 15%: 本店過剰パターン
        return s.id === 'S01' ? 4.0 :  // 本店に大量在庫
               s.id === 'S02' ? 0.2 :  // 渋谷店は極少
               s.id === 'S03' ? 0.3 :  // 名古屋店も少ない
               0.5;                 // ECも少ない
      }
      if (productHash >= 15 && productHash < 30) { // 15%: EC過剰パターン
        return s.id === 'S05' ? 5.0 :  // ECに大量在庫
               s.id === 'S01' ? 0.3 :  // 本店は少ない
               s.id === 'S02' ? 0.2 :  // 渋谷店も少ない
               0.5;                 // 名古屋店も少ない
      }
      if (productHash >= 30 && productHash < 45) { // 15%: 渋谷店過剰パターン
        return s.id === 'S02' ? 3.5 :  // 渋谷店に大量在庫
               s.id === 'S01' ? 0.4 :  // 本店は少ない
               s.id === 'S03' ? 0.6 :  // 名古屋店も少ない
               1.0;                 // ECは標準
      }
      if (productHash >= 45 && productHash < 60) { // 15%: 名古屋店過剰パターン
        return s.id === 'S03' ? 4.2 :  // 名古屋店に大量在庫
               s.id === 'S01' ? 0.3 :  // 本店は少ない
               s.id === 'S02' ? 0.5 :  // 渋谷店も少ない
               1.0;                 // ECは標準
      }
      // 残り40%の商品は中程度のアンバランス
      if (productHash >= 60 && productHash < 80) {
        return s.id === 'S01' ? 1.8 :  // 本店やや多め
               s.id === 'S05' ? 0.6 :  // EC少なめ
               1.0;                 // 他は標準
      }
      // 最後の20%は比較的バランスの取れた配分
      return s.id === 'S05' ? 1.3 :  // ECやや多め
             s.id === 'S01' ? 1.1 :  // 本店もやや多め
             1.0;                 // その他は標準
    });
    
    const totalWeight = storeWeights.reduce((a,b)=>a+b, 0);
    let remaining = totalInv;
    
    STORES.forEach((s, idx) => {
      if (idx === STORES.length - 1) {
        // 最後の店舗は残り全部（丸め誤差対策）
        INVENTORY.push({ productId: p.id, storeId: s.id, qty: Math.max(0, remaining) });
      } else {
        const qty = Math.max(0, Math.round((storeWeights[idx] / totalWeight) * totalInv));
        INVENTORY.push({ productId: p.id, storeId: s.id, qty });
        remaining -= qty;
      }
    });
  });

  // ─────────────────────────────
  // 売上生成（YoY対応のため過去730日 ≒ 2年）
  // ─────────────────────────────
  const SALES = [];
  const today = new Date();
  const DAYS = 730;

  const monthSeason = [ // 月毎の季節性（1=平常）
    1.02, 0.98, 1.00, 1.05, 1.08, 1.12,
    1.10, 1.06, 0.98, 1.04, 1.20, 1.35
  ];
  const dowFactor   = (dow)=> (dow===0||dow===6) ? 1.25 : 1.0; // 休日↑
  const storeFactor = (s)=> s.channel==='オンライン' ? 1.25 : 1.0; // EC↑
  const itemPopularity = (pIdx)=> 0.85 + ((pIdx%10)/100);      // わずかに差
  const yearTrend = (year)=> {
    // 直近年（今年）=1.00, 前年=0.96, それ以前=0.94（わずかに低い）
    const nowY = today.getFullYear();
    if(year===nowY)   return 1.00;
    if(year===nowY-1) return 0.96;
    return 0.94;
  };

  for(let d=0; d<DAYS; d++){
    const date = new Date(today);
    date.setDate(date.getDate()-d);
    const ds = date.toISOString().slice(0,10);
    const mSeason = monthSeason[date.getMonth()];
    const yTrend  = yearTrend(date.getFullYear());
    const wFactor = dowFactor(date.getDay());

    PRODUCTS.forEach((p, idxP)=>{
      const productHash = hashStr(p.id) % 100;
      
      STORES.forEach(s=>{
        // 在庫配分と逆のパターンで販売実績を作る（移管計算用）
        let storeSalesFactor = 1.0;
        
        if (productHash < 15) { // 本店過剰在庫パターン → 他店でよく売れる
          storeSalesFactor = s.id === 'S01' ? 0.4 :  // 本店は売れない
                            s.id === 'S02' ? 2.5 :  // 渋谷店でよく売れる
                            s.id === 'S03' ? 2.2 :  // 名古屋店でもよく売れる
                            1.8;                 // ECでも売れる
        } else if (productHash >= 15 && productHash < 30) { // EC過剰在庫パターン
          storeSalesFactor = s.id === 'S05' ? 0.3 :  // ECは売れない
                            s.id === 'S01' ? 2.8 :  // 本店でよく売れる
                            s.id === 'S02' ? 2.4 :  // 渋谷店でもよく売れる
                            2.0;                 // 名古屋店でも売れる
        } else if (productHash >= 30 && productHash < 45) { // 渋谷店過剰在庫パターン
          storeSalesFactor = s.id === 'S02' ? 0.5 :  // 渋谷店は売れない
                            s.id === 'S01' ? 2.2 :  // 本店でよく売れる
                            s.id === 'S03' ? 1.8 :  // 名古屋店でも売れる
                            2.5;                 // ECでよく売れる
        } else if (productHash >= 45 && productHash < 60) { // 名古屋店過剰在庫パターン
          storeSalesFactor = s.id === 'S03' ? 0.4 :  // 名古屋店は売れない
                            s.id === 'S01' ? 2.6 :  // 本店でよく売れる
                            s.id === 'S02' ? 2.0 :  // 渋谷店でも売れる
                            2.3;                 // ECでも売れる
        }
        
        const baseUnits =
          (s.channel==='オンライン'? 7.5 : 4.0) *
          itemPopularity(idxP) *
          mSeason * wFactor * yTrend * storeFactor(s) * storeSalesFactor;

        const noise = 0.70 + rand()*0.60; // 0.7〜1.3
        let units = Math.max(0, Math.round(baseUnits * noise));

        // たまにキャンペーンで上振れ
        if(rand() < 0.03) units = Math.round(units * (1.5 + rand()*0.5)); // +50〜+100%

        // 値下げ（希に）
        const salePrice =
          (rand() < 0.06) ? Math.round(p.price * (0.75 + rand()*0.10)) : p.price;

        const markdown = Math.max(0, (p.price - salePrice) * units);
        SALES.push({ productId:p.id, storeId:s.id, date:ds, units, salePrice, markdown });
      });
    });
  }

  // ─────────────────────────────
  // 公開（APIは不変）
  // ─────────────────────────────
  const P_TAXO_EXPORT = {};
  P_TAXO.forEach(t => { P_TAXO_EXPORT[t.productId] = t; });

  window.FIXTURES = {
    ITEMS,
    PRODUCTS,
    P_TAXO: P_TAXO_EXPORT, // 互換: 呼び出し側は productId キーで参照
    INVENTORY,
    SALES
  };
})();


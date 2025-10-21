// app/components/AxisSelector.js
const { Stack, Chip, Grid, TextField, MenuItem } = MaterialUI;

function AxisSelector({prodAxis,setProdAxis,storeAxis,setStoreAxis,storeGroup,setStoreGroup,selectedProdItems,setSelectedProdItems,selectedStoreItems,setSelectedStoreItems}){
  const prodItems=['全部門','部門','コーナー','ライン','カテゴリ','アイテム','SKU'];
  const storeItems=['全店舗','事業','ブロック','店舗'];
  const STORES = window.MASTERS.STORES;
  const STORE_BLOCK = window.MASTERS.STORE_BLOCK;
  const PRODUCTS = window.FIXTURES.PRODUCTS || [];
  const LINE_MASTER = window.MASTERS.LINE_MASTER || [];
  const CATEGORY_MASTER = window.MASTERS.CATEGORY_MASTER || [];

  const [prodFilter, setProdFilter] = React.useState('');
  const [storeFilter, setStoreFilter] = React.useState('');

  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAllChips, setShowAllChips] = React.useState(false);
  const [showAllStoreChips, setShowAllStoreChips] = React.useState(false);
  const [showStoreSearchModal, setShowStoreSearchModal] = React.useState(false);
  const [storeSearchTerm, setStoreSearchTerm] = React.useState('');
  const [modalSelectedProdItems, setModalSelectedProdItems] = React.useState(new Set());
  const [modalSelectedStoreItems, setModalSelectedStoreItems] = React.useState(new Set());
  const [prodTypeFilters, setProdTypeFilters] = React.useState({'部門':'','コーナー':'','ライン':'','カテゴリ':'','アイテム':'','SKU':''});
  const [storeTypeFilters, setStoreTypeFilters] = React.useState({'事業':'','ブロック':'','店舗':''});

  const storeOptions = React.useMemo(()=>{
    if(storeAxis==='全店舗') return ['全店舗'];
    if(storeAxis==='事業') return Array.from(new Set(STORES.map(s=>s.channel)));
    if(storeAxis==='ブロック') return Array.from(new Set(STORES.map(s=>STORE_BLOCK[s.id])));
    if(storeAxis==='店舗') return STORES.map(s=>s.name);
    return [];
  },[storeAxis]);

  const prodOptions = React.useMemo(()=>{
    let options = [];
    if(prodAxis==='部門') {
      options = Array.from(new Set(PRODUCTS.map(p=>p.dept))).filter(Boolean);
    } else if(prodAxis==='コーナー') {
      const P_TAXO = window.FIXTURES.P_TAXO || {};
      options = Array.from(new Set(PRODUCTS.map(p=>P_TAXO[p.id]?.corner).filter(Boolean)));
    } else if(prodAxis==='ライン') {
      options = Array.from(new Set(LINE_MASTER.map(l=>`${l.code} ${l.name}`))).filter(Boolean);
    } else if(prodAxis==='カテゴリ') {
      options = Array.from(new Set(CATEGORY_MASTER.map(c=>`${c.code} ${c.name}`))).filter(Boolean);
    } else if(prodAxis==='アイテム') {
      const ITEMS = window.FIXTURES.ITEMS || [];
      options = Array.from(new Set(ITEMS.map(item=>`${item.code} ${item.name}`))).filter(Boolean);
    } else if(prodAxis==='SKU') {
      options = Array.from(new Set(PRODUCTS.map(p=>p.sku))).filter(Boolean);
    }
    return options.sort();
  },[prodAxis]);

  const filteredProdOptions = React.useMemo(()=>{
    if(!prodFilter) return prodOptions;
    return prodOptions.filter(opt => opt.toLowerCase().includes(prodFilter.toLowerCase()));
  },[prodOptions, prodFilter]);

  const filteredStoreOptions = React.useMemo(()=>{
    if(!storeFilter) return storeOptions;
    return storeOptions.filter(opt => opt.toLowerCase().includes(storeFilter.toLowerCase()));
  },[storeOptions, storeFilter]);

  React.useEffect(()=>{ setStoreGroup(storeOptions[0]||'全店舗'); },[storeAxis]);

  const toggleProdItem = (item) => {
    const newSelected = new Set(selectedProdItems);
    if(newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    setSelectedProdItems(newSelected);
  };

  const toggleStoreItem = (item) => {
    const newSelected = new Set(selectedStoreItems);
    if(newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    setSelectedStoreItems(newSelected);
  };

  const toggleAllProd = () => {
    if (selectedProdItems.size === prodOptions.length) {
      setSelectedProdItems(new Set());
    } else {
      setSelectedProdItems(new Set(prodOptions));
    }
  };

  const toggleAllStore = () => {
    if (selectedStoreItems.size === storeOptions.length) {
      setSelectedStoreItems(new Set());
    } else {
      setSelectedStoreItems(new Set(storeOptions));
    }
  };

  const allProdOptions = React.useMemo(() => {
    let options = [];
    ['部門','コーナー','ライン','カテゴリ','アイテム','SKU'].forEach(axis => {
      if(axis==='部門') {
        options.push(...Array.from(new Set(PRODUCTS.map(p=>({name:p.dept, type:'部門'})))).filter(o=>o.name));
      } else if(axis==='コーナー') {
        const P_TAXO = window.FIXTURES.P_TAXO || {};
        options.push(...Array.from(new Set(PRODUCTS.map(p=>({name:P_TAXO[p.id]?.corner, type:'コーナー'})))).filter(o=>o.name));
      } else if(axis==='ライン') {
        options.push(...Array.from(new Set(LINE_MASTER.map(l=>({name:`${l.code} ${l.name}`, type:'ライン'})))).filter(o=>o.name));
      } else if(axis==='カテゴリ') {
        options.push(...Array.from(new Set(CATEGORY_MASTER.map(c=>({name:`${c.code} ${c.name}`, type:'カテゴリ'})))).filter(o=>o.name));
      } else if(axis==='アイテム') {
        const ITEMS = window.FIXTURES.ITEMS || [];
        options.push(...Array.from(new Set(ITEMS.map(item=>({name:`${item.code} ${item.name}`, type:'アイテム'})))).filter(o=>o.name));
      } else if(axis==='SKU') {
        options.push(...Array.from(new Set(PRODUCTS.map(p=>({name:p.sku, type:'SKU'})))).filter(o=>o.name));
      }
    });
    return options.sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const allStoreOptions = React.useMemo(() => {
    let options = [];
    ['事業','ブロック','店舗'].forEach(axis => {
      if(axis==='事業') {
        options.push(...Array.from(new Set(STORES.map(s=>({name:s.channel, type:'事業'})))).filter(o=>o.name));
      } else if(axis==='ブロック') {
        options.push(...Array.from(new Set(STORES.map(s=>({name:STORE_BLOCK[s.id], type:'ブロック'})))).filter(o=>o.name));
      } else if(axis==='店舗') {
        options.push(...STORES.map(s=>({name:s.name, type:'店舗'})));
      }
    });
    return options.sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const filteredModalProdOptions = React.useMemo(() => {
    if(!searchTerm) return allProdOptions;
    return allProdOptions.filter(opt => opt.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allProdOptions, searchTerm]);

  const filteredModalStoreOptions = React.useMemo(() => {
    if(!storeSearchTerm) return allStoreOptions;
    return allStoreOptions.filter(opt => opt.name.toLowerCase().includes(storeSearchTerm.toLowerCase()));
  }, [allStoreOptions, storeSearchTerm]);

  const handleProdModalOpen = () => {
    setModalSelectedProdItems(new Set(selectedProdItems));
    setShowSearchModal(true);
  };

  const handleStoreModalOpen = () => {
    setModalSelectedStoreItems(new Set(selectedStoreItems));
    setShowStoreSearchModal(true);
  };

  const handleProdModalConfirm = () => {
    setSelectedProdItems(modalSelectedProdItems);
    setShowSearchModal(false);
    setSearchTerm('');
  };

  const handleStoreModalConfirm = () => {
    setSelectedStoreItems(modalSelectedStoreItems);
    setShowStoreSearchModal(false);
    setStoreSearchTerm('');
  };

  const toggleModalProdItem = (item) => {
    const newSelected = new Set(modalSelectedProdItems);
    if(newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    setModalSelectedProdItems(newSelected);
  };

  const toggleModalStoreItem = (item) => {
    const newSelected = new Set(modalSelectedStoreItems);
    if(newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    setModalSelectedStoreItems(newSelected);
  };

  // 上位粒度の選択に関連する下位粒度のchipsを特定
  const getRelatedItems = React.useMemo(() => {
    if(selectedProdItems.size === 0) return new Set();
    const P_TAXO = window.FIXTURES.P_TAXO || {};
    const ITEMS = window.FIXTURES.ITEMS || [];
    const CATEGORY_ITEM_MAP = window.MASTERS.CATEGORY_ITEM_MAP || {};
    const related = new Set();
    
    // 選択されたアイテムに関連する商品を特定
    const relatedProducts = new Set();
    
    PRODUCTS.forEach(p => {
      const taxo = P_TAXO[p.id];
      if(!taxo) return;
      
      let isRelated = false;
      
      if(prodAxis === 'SKU') {
        selectedProdItems.forEach(selectedItem => {
          if(selectedItem.includes(' ')) {
            const itemCode = selectedItem.split(' ')[0];
            if(p.sku && p.sku.startsWith(itemCode)) {
              isRelated = true;
            }
          } else if(p.itemName === selectedItem) {
            isRelated = true;
          }
        });
      } else {
        isRelated = selectedProdItems.has(p.dept) ||
                   selectedProdItems.has(taxo.corner) ||
                   selectedProdItems.has(taxo.line) ||
                   selectedProdItems.has(taxo.category) ||
                   selectedProdItems.has(p.itemName) ||
                   selectedProdItems.has(p.sku);
      }
      
      if(isRelated) {
        relatedProducts.add(p.id);
      }
    });
    
    // 関連商品から現在の軸に対応する値を収集
    relatedProducts.forEach(productId => {
      const p = PRODUCTS.find(prod => prod.id === productId);
      const taxo = P_TAXO[productId];
      if(!p || !taxo) return;
      
      if(prodAxis === '部門') related.add(p.dept);
      else if(prodAxis === 'コーナー') related.add(taxo.corner);
      else if(prodAxis === 'ライン') related.add(taxo.line);
      else if(prodAxis === 'カテゴリ') related.add(taxo.category);
      else if(prodAxis === 'アイテム') {
        const item = ITEMS.find(itm => itm.name === p.itemName);
        if(item) {
          related.add(`${item.code} ${item.name}`);
        }
      }
      else if(prodAxis === 'SKU') related.add(p.sku);
    });
    
    // アイテム軸の場合、カテゴリマッピングから関連アイテムを追加
    if(prodAxis === 'アイテム') {
      selectedProdItems.forEach(selectedItem => {
        const categoryCode = selectedItem.split(' ')[0];
        if(CATEGORY_ITEM_MAP[categoryCode]) {
          CATEGORY_ITEM_MAP[categoryCode].forEach(itemName => {
            const item = ITEMS.find(itm => itm.name === itemName);
            if(item) {
              related.add(`${item.code} ${item.name}`);
            }
          });
        }
      });
    }
    
    return related;
  }, [selectedProdItems, prodAxis]);

  // 拠点の関連アイテムを特定
  const getRelatedStoreItems = React.useMemo(() => {
    if(selectedStoreItems.size === 0) return new Set();
    const related = new Set();
    
    STORES.forEach(store => {
      let isRelated = false;
      
      if(selectedStoreItems.has(store.channel) || 
         selectedStoreItems.has(STORE_BLOCK[store.id]) || 
         selectedStoreItems.has(store.name)) {
        isRelated = true;
      }
      
      if(isRelated) {
        if(storeAxis === '事業') related.add(store.channel);
        else if(storeAxis === 'ブロック') related.add(STORE_BLOCK[store.id]);
        else if(storeAxis === '店舗') related.add(store.name);
      }
    });
    
    return related;
  }, [selectedStoreItems, storeAxis]);

  // chipsを関連するものとそうでないものに分けて並び替え
  const sortedProdOptions = React.useMemo(() => {
    if(selectedProdItems.size === 0) return prodOptions;
    
    const related = [];
    const others = [];
    
    prodOptions.forEach(opt => {
      if(getRelatedItems.has(opt)) {
        related.push(opt);
      } else {
        others.push(opt);
      }
    });
    
    return [...related, ...others];
  }, [prodOptions, getRelatedItems, selectedProdItems]);

  const sortedStoreOptions = React.useMemo(() => {
    if(selectedStoreItems.size === 0) return storeOptions;
    
    const related = [];
    const others = [];
    
    storeOptions.forEach(opt => {
      if(getRelatedStoreItems.has(opt)) {
        related.push(opt);
      } else {
        others.push(opt);
      }
    });
    
    return [...related, ...others];
  }, [storeOptions, getRelatedStoreItems, selectedStoreItems]);

  const displayedChips = showAllChips ? sortedProdOptions : sortedProdOptions.slice(0, 15);
  const hasMoreChips = sortedProdOptions.length > 15;
  const displayedStoreChips = showAllStoreChips ? sortedStoreOptions : sortedStoreOptions.slice(0, 15);
  const hasMoreStoreChips = sortedStoreOptions.length > 15;

  return (
    <Stack spacing={2}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <div className="mini" style={{fontWeight:700}}>商品分類軸</div>
        {selectedProdItems.size > 0 && <Chip label={`選択中（${selectedProdItems.size}）`} size="small" color="primary" />}
        {selectedProdItems.size > 0 && <Chip label="リセット" size="small" variant="outlined" onClick={()=>setSelectedProdItems(new Set())} style={{cursor:'pointer'}} />}
      </div>
      <div className="chipRow">
        {prodItems.map(k=>(
          <Chip key={k} label={k}
            color={prodAxis===k?'primary':'default'}
            variant={prodAxis===k?'filled':'outlined'}
            onClick={()=>setProdAxis(k)}
          />
        ))}
      </div>
      {prodAxis !== '全部門' && prodOptions.length > 0 && (
        <div className="chipRow" style={{backgroundColor:'#f5f5f5', padding:'8px', borderRadius:'4px'}}>
          <Chip label="検索" variant="filled" onClick={handleProdModalOpen} style={{backgroundColor:'#4caf50', color:'white'}} />
          <Chip 
            label={selectedProdItems.size === prodOptions.length ? '全解除' : '全選択'} 
            variant="outlined" 
            onClick={toggleAllProd} 
          />
          {displayedChips.map(opt=>(
            <Chip
              key={opt}
              label={opt}
              color={selectedProdItems.has(opt) ? 'primary' : 'default'}
              variant={selectedProdItems.has(opt) ? 'filled' : 'outlined'}
              onClick={()=>toggleProdItem(opt)}
              size="small"
              style={{
                backgroundColor: getRelatedItems.has(opt) && !selectedProdItems.has(opt) ? '#e1f5fe' : undefined
              }}
            />
          ))}
          {hasMoreChips && !showAllChips && (
            <Chip
              label={`もっと表示 (+${prodOptions.length - 15})`}
              variant="outlined"
              onClick={()=>setShowAllChips(true)}
              size="small"
              style={{color:'#666'}}
            />
          )}
          {showAllChips && hasMoreChips && (
            <Chip
              label="折りたたむ"
              variant="outlined"
              onClick={()=>setShowAllChips(false)}
              size="small"
              style={{color:'#666'}}
            />
          )}
        </div>
      )}
      <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
        <div className="mini" style={{fontWeight:700}}>拠点分類軸</div>
        {selectedStoreItems.size > 0 && <Chip label={`選択中（${selectedStoreItems.size}）`} size="small" color="primary" />}
        {selectedStoreItems.size > 0 && <Chip label="リセット" size="small" variant="outlined" onClick={()=>setSelectedStoreItems(new Set())} style={{cursor:'pointer'}} />}
      </div>
      <div className="chipRow" style={{marginBottom:4}}>
        {storeItems.map(k=>(
          <Chip key={k} label={k}
            color={storeAxis===k?'primary':'default'}
            variant={storeAxis===k?'filled':'outlined'}
            onClick={()=>setStoreAxis(k)}
          />
        ))}
      </div>
      {storeAxis !== '全店舗' && storeOptions.length > 0 && (
        <div className="chipRow" style={{backgroundColor:'#f5f5f5', padding:'8px', borderRadius:'4px'}}>
          <Chip label="検索" variant="filled" onClick={handleStoreModalOpen} style={{backgroundColor:'#4caf50', color:'white'}} />
          <Chip 
            label={selectedStoreItems.size === storeOptions.length ? '全解除' : '全選択'} 
            variant="outlined" 
            onClick={toggleAllStore} 
          />
          {displayedStoreChips.map(opt=>(
            <Chip
              key={opt}
              label={opt}
              color={selectedStoreItems.has(opt) ? 'primary' : 'default'}
              variant={selectedStoreItems.has(opt) ? 'filled' : 'outlined'}
              onClick={()=>toggleStoreItem(opt)}
              size="small"
              style={{
                backgroundColor: getRelatedStoreItems.has(opt) && !selectedStoreItems.has(opt) ? '#e1f5fe' : undefined
              }}
            />
          ))}
          {hasMoreStoreChips && !showAllStoreChips && (
            <Chip
              label={`もっと表示 (+${storeOptions.length - 15})`}
              variant="outlined"
              onClick={()=>setShowAllStoreChips(true)}
              size="small"
              style={{color:'#666'}}
            />
          )}
          {showAllStoreChips && hasMoreStoreChips && (
            <Chip
              label="折りたたむ"
              variant="outlined"
              onClick={()=>setShowAllStoreChips(false)}
              size="small"
              style={{color:'#666'}}
            />
          )}
        </div>
      )}
      
      {/* 商品検索モーダル */}
      <MaterialUI.Dialog open={showSearchModal} onClose={()=>setShowSearchModal(false)} maxWidth="lg" fullWidth>
        <MaterialUI.DialogTitle>商品検索・選択</MaterialUI.DialogTitle>
        <MaterialUI.DialogContent>
          <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'16px', marginTop:'8px'}}>
            {['部門','コーナー','ライン','カテゴリ','アイテム','SKU'].map(type => {
              const typeOptions = allProdOptions.filter(opt => opt.type === type);
              const filteredOptions = typeOptions.filter(opt => 
                opt.name.toLowerCase().includes(prodTypeFilters[type].toLowerCase())
              );
              return (
                <div key={type} style={{border:'1px solid #ddd', borderRadius:'4px', padding:'8px'}}>
                  <div style={{fontWeight:'bold', marginBottom:'8px', fontSize:'12px'}}>{type}</div>
                  <TextField
                    size="small"
                    placeholder="フィルター"
                    value={prodTypeFilters[type]}
                    onChange={(e)=>setProdTypeFilters({...prodTypeFilters, [type]:e.target.value})}
                    fullWidth
                    sx={{mb:1}}
                  />
                  <div style={{maxHeight:'300px', overflow:'auto'}}>
                    {filteredOptions.map(opt=>(
                      <div key={opt.name} style={{display:'flex', alignItems:'center', padding:'2px 0'}}>
                        <MaterialUI.Checkbox
                          size="small"
                          checked={modalSelectedProdItems.has(opt.name)}
                          onChange={()=>toggleModalProdItem(opt.name)}
                        />
                        <span style={{marginLeft:4, fontSize:'12px'}}>{opt.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:16, fontSize:'12px'}}>
            選択中: {modalSelectedProdItems.size}件
          </div>
        </MaterialUI.DialogContent>
        <MaterialUI.DialogActions>
          <MaterialUI.Button onClick={()=>setShowSearchModal(false)}>キャンセル</MaterialUI.Button>
          <MaterialUI.Button variant="contained" onClick={handleProdModalConfirm}>選択を確定</MaterialUI.Button>
        </MaterialUI.DialogActions>
      </MaterialUI.Dialog>
      
      {/* 拠点検索モーダル */}
      <MaterialUI.Dialog open={showStoreSearchModal} onClose={()=>setShowStoreSearchModal(false)} maxWidth="md" fullWidth>
        <MaterialUI.DialogTitle>拠点検索・選択</MaterialUI.DialogTitle>
        <MaterialUI.DialogContent>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginTop:'8px'}}>
            {['事業','ブロック','店舗'].map(type => {
              const typeOptions = allStoreOptions.filter(opt => opt.type === type);
              const filteredOptions = typeOptions.filter(opt => 
                opt.name.toLowerCase().includes(storeTypeFilters[type].toLowerCase())
              );
              return (
                <div key={type} style={{border:'1px solid #ddd', borderRadius:'4px', padding:'8px'}}>
                  <div style={{fontWeight:'bold', marginBottom:'8px', fontSize:'12px'}}>{type}</div>
                  <TextField
                    size="small"
                    placeholder="フィルター"
                    value={storeTypeFilters[type]}
                    onChange={(e)=>setStoreTypeFilters({...storeTypeFilters, [type]:e.target.value})}
                    fullWidth
                    sx={{mb:1}}
                  />
                  <div style={{maxHeight:'300px', overflow:'auto'}}>
                    {filteredOptions.map(opt=>(
                      <div key={opt.name} style={{display:'flex', alignItems:'center', padding:'2px 0'}}>
                        <MaterialUI.Checkbox
                          size="small"
                          checked={modalSelectedStoreItems.has(opt.name)}
                          onChange={()=>toggleModalStoreItem(opt.name)}
                        />
                        <span style={{marginLeft:4, fontSize:'12px'}}>{opt.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:16, fontSize:'12px'}}>
            選択中: {modalSelectedStoreItems.size}件
          </div>
        </MaterialUI.DialogContent>
        <MaterialUI.DialogActions>
          <MaterialUI.Button onClick={()=>setShowStoreSearchModal(false)}>キャンセル</MaterialUI.Button>
          <MaterialUI.Button variant="contained" onClick={handleStoreModalConfirm}>選択を確定</MaterialUI.Button>
        </MaterialUI.DialogActions>
      </MaterialUI.Dialog>
      

    </Stack>
  );
}

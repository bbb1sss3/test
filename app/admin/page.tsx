'use client';

import { useState } from 'react';

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Apple SD Gothic Neo', sans-serif; background: #f4f4f4; }
  .admin-wrap { max-width: 900px; margin: 0 auto; padding: 2rem; }
  .admin-header { background: #111; color: #fff; padding: 1.5rem 2rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; }
  .admin-title { font-size: 20px; font-weight: 900; letter-spacing: -1px; }
  .admin-title span { color: #e52c2c; }
  .logout-btn { background: #333; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; font-size: 13px; cursor: pointer; }
  .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
  .tab { padding: 8px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; background: #fff; color: #888; transition: all 0.15s; }
  .tab.active { background: #111; color: #fff; }
  .section { background: #fff; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .section-title { font-size: 15px; font-weight: 800; color: #111; margin-bottom: 1.25rem; }
  .input-row { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
  .input { flex: 1; padding: 10px 14px; border: 1.5px solid #e8e8e8; border-radius: 8px; font-size: 14px; outline: none; }
  .input:focus { border-color: #e52c2c; }
  .textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #e8e8e8; border-radius: 8px; font-size: 13px; outline: none; resize: vertical; min-height: 80px; }
  .textarea:focus { border-color: #e52c2c; }
  .select { width: 100%; padding: 10px 14px; border: 1.5px solid #e8e8e8; border-radius: 8px; font-size: 14px; outline: none; background: #fff; }
  .select:focus { border-color: #e52c2c; }
  .btn { padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
  .btn-primary { background: #e52c2c; color: #fff; }
  .btn-primary:hover { background: #c62020; }
  .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
  .btn-secondary { background: #111; color: #fff; }
  .btn-secondary:hover { background: #333; }
  .btn-outline { background: #fff; color: #111; border: 1.5px solid #ddd; padding: 5px 12px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; }
  .btn-outline:hover { border-color: #111; }
  .btn-edit { background: #fff; color: #1565c0; border: 1.5px solid #1565c0; padding: 5px 12px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer; }
  .btn-edit:hover { background: #1565c0; color: #fff; }
  .btn-danger { background: #fff; color: #e52c2c; border: 1.5px solid #e52c2c; padding: 5px 12px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer; }
  .btn-danger:hover { background: #e52c2c; color: #fff; }
  .product-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
  .product-item { display: flex; align-items: center; gap: 1rem; padding: 0.875rem; border: 1px solid #f0f0f0; border-radius: 8px; transition: all 0.15s; }
  .product-item:hover { border-color: #ddd; }
  .product-img { width: 60px; height: 60px; border-radius: 6px; object-fit: cover; background: #f4f4f4; flex-shrink: 0; }
  .product-info { flex: 1; }
  .product-name { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 4px; line-height: 1.4; }
  .product-price { font-size: 14px; font-weight: 900; color: #e52c2c; }
  .product-badges { display: flex; gap: 4px; margin-top: 4px; }
  .badge-sm { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
  .badge-rocket { background: #e3f2fd; color: #1565c0; }
  .badge-free { background: #e8f5e9; color: #2e7d32; }
  .badge-category { background: #f5f5f5; color: #555; }
  .product-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 4px; }
  .form-label { font-size: 12px; font-weight: 700; color: #555; }
  .form-full { grid-column: 1 / -1; }
  .selected-product { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #fff5f5; border: 1.5px solid #e52c2c; border-radius: 8px; margin-bottom: 1.5rem; }
  .selected-product img { width: 60px; height: 60px; border-radius: 6px; object-fit: cover; }
  .selected-product-name { font-size: 14px; font-weight: 700; color: #111; }
  .selected-product-price { font-size: 13px; color: #e52c2c; font-weight: 700; margin-top: 2px; }
  .edit-box { background: #f8f9ff; border: 1.5px solid #1565c0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
  .edit-title { font-size: 14px; font-weight: 800; color: #1565c0; margin-bottom: 1rem; }
  .status { padding: 0.875rem 1rem; border-radius: 8px; font-size: 13px; font-weight: 600; margin-top: 1rem; }
  .status-success { background: #e8f5e9; color: #2e7d32; }
  .status-error { background: #ffebee; color: #c62828; }
  .status-loading { background: #e3f2fd; color: #1565c0; }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f4f4; }
  .login-box { background: #fff; padding: 2rem; border-radius: 12px; width: 320px; }
  .login-title { font-size: 22px; font-weight: 900; color: #111; margin-bottom: 1.5rem; text-align: center; }
  .login-title span { color: #e52c2c; }
  .divider { border: none; border-top: 1px solid #f0f0f0; margin: 1.5rem 0; }
  .progress { background: #f0f0f0; border-radius: 4px; height: 6px; margin-top: 0.75rem; overflow: hidden; }
  .progress-bar { height: 100%; background: #e52c2c; border-radius: 4px; animation: loading 1.5s infinite; }
  @keyframes loading { 0% { width: 20%; } 50% { width: 80%; } 100% { width: 20%; } }
  .count-badge { background: #f0f0f0; color: #555; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-left: 6px; }
`;

const CATEGORIES = ['노트북', '데스크탑', '모니터', '태블릿', '냉장고', '세탁기/건조기', 'TV', '청소기', '에어컨', '안마의자', '공기청정기', '식기세척기'];
const BADGES = ['', 'NEW', '인기', '추천'];

const emptyForm = { category: '', badge: '', price: '', originalPrice: '', discount: '', rating: '', desc: '', hanmadi: '', tag: '', compare: '' };

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const [productList, setProductList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null);

  const handleLogin = async () => {
    const res = await fetch('/api/coupang/list', { headers: { 'x-admin-password': password } });
    if (res.status === 401) { alert('비밀번호가 틀렸습니다'); return; }
    setIsLoggedIn(true);
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setSearching(true);
    setSearchResults([]);
    setSelectedProduct(null);
    try {
      const res = await fetch(`/api/coupang/search?keyword=${encodeURIComponent(keyword)}`, {
        headers: { 'x-admin-password': password },
      });
      const data = await res.json();
      if (res.status === 401) { setIsLoggedIn(false); return; }
      if (!res.ok) throw new Error(data.error);
      setSearchResults(data.products);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSearching(false);
    }
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setForm(f => ({ ...f, price: `${product.productPrice.toLocaleString()}원~` }));
    setSearchResults([]);
  };

  const handleAddProduct = async () => {
    if (!selectedProduct) return;
    if (!form.category) { setStatus({ type: 'error', message: '카테고리를 선택해주세요.' }); return; }
    setStatus({ type: 'loading', message: '노션에 추가 중...' });
    try {
      const res = await fetch('/api/coupang/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ product: selectedProduct, keyword, form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus({ type: 'success', message: '노션에 추가됐어요!' });
      setSelectedProduct(null);
      setKeyword('');
      setForm(emptyForm);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const loadProductList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/coupang/list', { headers: { 'x-admin-password': password } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProductList(data.products);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoadingList(false);
    }
  };

  const handleTabChange = (tab: 'add' | 'list') => {
    setActiveTab(tab);
    setStatus(null);
    setEditingId(null);
    if (tab === 'list') loadProductList();
  };

  const handleDelete = async (pageId: string, name: string) => {
    if (!confirm(`"${name}" 을 삭제할까요?`)) return;
    try {
      const res = await fetch('/api/coupang/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ pageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProductList(prev => prev.filter(p => p.id !== pageId));
      setStatus({ type: 'success', message: '삭제됐어요!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleEditStart = (p: any) => {
    setEditingId(p.id);
    setEditForm({
      category: p.category || '',
      badge: p.badge || '',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      discount: p.discount || '',
      rating: p.rating || '',
      desc: p.desc || '',
      hanmadi: p.hanmadi || '',
      tag: p.tag || '',
      compare: p.compare || '',
    });
  };

  const handleEditSave = async (pageId: string) => {
    setStatus({ type: 'loading', message: '수정 중...' });
    try {
      const res = await fetch('/api/coupang/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ pageId, form: editForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus({ type: 'success', message: '수정됐어요!' });
      setEditingId(null);
      loadProductList();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const FormFields = ({ f, setF }: { f: typeof emptyForm, setF: any }) => (
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">카테고리</label>
        <select className="select" value={f.category} onChange={e => setF((prev: any) => ({ ...prev, category: e.target.value }))}>
          <option value="">선택하세요</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">뱃지</label>
        <select className="select" value={f.badge} onChange={e => setF((prev: any) => ({ ...prev, badge: e.target.value }))}>
          {BADGES.map(b => <option key={b} value={b}>{b || '없음'}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">가격</label>
        <input className="input" value={f.price} onChange={e => setF((prev: any) => ({ ...prev, price: e.target.value }))} placeholder="예: 1,690,000원~" />
      </div>
      <div className="form-group">
        <label className="form-label">원가</label>
        <input className="input" value={f.originalPrice} onChange={e => setF((prev: any) => ({ ...prev, originalPrice: e.target.value }))} placeholder="예: 2,690,000원" />
      </div>
      <div className="form-group">
        <label className="form-label">할인율</label>
        <input className="input" value={f.discount} onChange={e => setF((prev: any) => ({ ...prev, discount: e.target.value }))} placeholder="예: 37%" />
      </div>
      <div className="form-group">
        <label className="form-label">별점</label>
        <input className="input" value={f.rating} onChange={e => setF((prev: any) => ({ ...prev, rating: e.target.value }))} placeholder="예: 4.5" />
      </div>
      <div className="form-group form-full">
        <label className="form-label">설명 (SEO용)</label>
        <textarea className="textarea" value={f.desc} onChange={e => setF((prev: any) => ({ ...prev, desc: e.target.value }))} placeholder="상품 설명 (300자 이상 권장)" />
      </div>
      <div className="form-group form-full">
        <label className="form-label">에디터 한마디</label>
        <textarea className="textarea" value={f.hanmadi} onChange={e => setF((prev: any) => ({ ...prev, hanmadi: e.target.value }))} placeholder="솔직한 추천 이유 2문장" />
      </div>
      <div className="form-group form-full">
        <label className="form-label">태그 (쉼표로 구분)</label>
        <input className="input" value={f.tag} onChange={e => setF((prev: any) => ({ ...prev, tag: e.target.value }))} placeholder="예: #신혼부부필수템, #4인가족추천" />
      </div>
      <div className="form-group form-full">
        <label className="form-label">경쟁 모델 비교</label>
        <textarea className="textarea" value={f.compare} onChange={e => setF((prev: any) => ({ ...prev, compare: e.target.value }))} placeholder="항목|모델A|모델B|모델C" />
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="login-wrap">
          <div className="login-box">
            <div className="login-title">PRE<span>MY</span> 관리자</div>
            <input className="input" type="password" placeholder="비밀번호 입력" value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', marginBottom: '1rem' }} />
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>로그인</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="admin-wrap">
        <div className="admin-header">
          <div className="admin-title">PRE<span>MY</span> 관리자</div>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>로그아웃</button>
        </div>

        <div className="tabs">
          <button className={`tab${activeTab === 'add' ? ' active' : ''}`} onClick={() => handleTabChange('add')}>🔍 상품 추가</button>
          <button className={`tab${activeTab === 'list' ? ' active' : ''}`} onClick={() => handleTabChange('list')}>
            📋 상품 목록
            {productList.length > 0 && <span className="count-badge">{productList.length}</span>}
          </button>
        </div>

        {/* 상품 추가 탭 */}
        {activeTab === 'add' && (
          <div className="section">
            <div className="section-title">🔍 상품 추가</div>
            <div className="input-row">
              <input className="input" placeholder="검색 키워드 (예: LG 그램 17 코어Ultra5)"
                value={keyword} onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              <button className="btn btn-primary" onClick={handleSearch} disabled={searching}>
                {searching ? '검색 중...' : '검색'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="product-list">
                {searchResults.map((p, i) => (
                  <div key={i} className="product-item" onClick={() => handleSelectProduct(p)}>
                    <img src={p.productImage} alt={p.productName} className="product-img" />
                    <div className="product-info">
                      <div className="product-name">{p.productName}</div>
                      <div className="product-price">{p.productPrice.toLocaleString()}원~</div>
                      <div className="product-badges">
                        {p.isRocket && <span className="badge-sm badge-rocket">🚀 로켓</span>}
                        {p.isFreeShipping && <span className="badge-sm badge-free">✓ 무료배송</span>}
                      </div>
                    </div>
                    <button className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>선택</button>
                  </div>
                ))}
              </div>
            )}

            {selectedProduct && (
              <>
                <hr className="divider" />
                <div className="selected-product">
                  <img src={selectedProduct.productImage} alt={selectedProduct.productName} />
                  <div style={{ flex: 1 }}>
                    <div className="selected-product-name">{selectedProduct.productName}</div>
                    <div className="selected-product-price">{selectedProduct.productPrice.toLocaleString()}원~</div>
                  </div>
                  <a href={selectedProduct.productUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-outline" style={{ textDecoration: 'none' }}>
                    쿠팡에서 보기 →
                  </a>
                </div>
                <FormFields f={form} setF={setForm} />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" onClick={handleAddProduct}>노션에 추가</button>
                  <button className="btn-outline" onClick={() => setSelectedProduct(null)}>취소</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 상품 목록 탭 */}
        {activeTab === 'list' && (
          <div className="section">
            <div className="section-title">
              📋 등록된 상품
              <span className="count-badge">{productList.length}개</span>
            </div>
            {loadingList ? (
              <div className="progress"><div className="progress-bar" /></div>
            ) : (
              <div className="product-list">
                {productList.map(p => (
                  <div key={p.id}>
                    <div className="product-item">
                      {p.image && <img src={p.image} alt={p.name} className="product-img" />}
                      <div className="product-info">
                        <div className="product-name">{p.name}</div>
                        <div className="product-price">{p.price}</div>
                        <div className="product-badges">
                          {p.category && <span className="badge-sm badge-category">{p.category}</span>}
                          {p.isRocket && <span className="badge-sm badge-rocket">🚀 로켓</span>}
                          {p.isFreeShipping && <span className="badge-sm badge-free">✓ 무료배송</span>}
                        </div>
                      </div>
                      <div className="product-actions">
                        <a href={`/products/${p.id}`} target="_blank" rel="noopener noreferrer" className="btn-outline">보기</a>
                        <button className="btn-edit" onClick={() => editingId === p.id ? setEditingId(null) : handleEditStart(p)}>
                          {editingId === p.id ? '닫기' : '수정'}
                        </button>
                        <button className="btn-danger" onClick={() => handleDelete(p.id, p.name)}>삭제</button>
                      </div>
                    </div>

                    {editingId === p.id && (
                      <div className="edit-box">
                        <div className="edit-title">✏️ {p.name} 수정</div>
                        <FormFields f={editForm} setF={setEditForm} />
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button className="btn btn-secondary" onClick={() => handleEditSave(p.id)}>저장</button>
                          <button className="btn-outline" onClick={() => setEditingId(null)}>취소</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status && (
          <div className={`status status-${status.type}`}>
            {status.type === 'loading' && '⏳ '}
            {status.type === 'success' && '✅ '}
            {status.type === 'error' && '❌ '}
            {status.message}
          </div>
        )}
      </div>
    </>
  );
}
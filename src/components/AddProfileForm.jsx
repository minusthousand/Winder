import { useState, useRef, useCallback } from 'react';

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #f0e3e9',
  borderRadius: 13, fontSize: 16, fontFamily: "'Plus Jakarta Sans',sans-serif",
  color: '#3a2740', outline: 'none', background: '#fdfafb',
};
const labelStyle = { fontSize: 12.5, fontWeight: 700, color: '#7a6680', margin: '15px 0 7px', display: 'block' };

function defaultImg() {
  return 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80';
}

export default function AddProfileForm({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', age: '', bio: '', job: '', location: '', interests: '', images: '' });
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(null);
  const liveDY = useRef(0);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.name.trim()) { setError('Please enter a name.'); return; }
    let images = form.images.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (!images.length) images = [defaultImg()];
    const interests = form.interests.split(',').map((s) => s.trim()).filter(Boolean);
    const profile = {
      id: Date.now(),
      name: form.name.trim(),
      age: parseInt(form.age, 10) || 25,
      likesYou: true,
      job: form.job.trim() || 'Mystery profession',
      location: form.location.trim() || 'Nearby',
      distance: Math.floor(Math.random() * 18) + 1,
      bio: form.bio.trim() || 'No bio yet — but clearly intriguing.',
      interests: interests.length ? interests : ['New here'],
      images,
    };
    onAdd(profile);
  };

  const onHandleDown = (e) => {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    startY.current = e.clientY;
    liveDY.current = 0;
    setDragging(true);
  };
  const onHandleMove = (e) => {
    if (startY.current === null) return;
    const d = Math.max(0, e.clientY - startY.current);
    liveDY.current = d;
    setDragY(d);
  };
  const onHandleUp = () => {
    setDragging(false);
    if (liveDY.current > 80) dismiss();
    else setDragY(0);
    startY.current = null;
    liveDY.current = 0;
  };

  const panelTranslate = (dragging || dragY > 0) ? `0 ${dragY}px` : undefined;

  return (
    <div onClick={dismiss} className={`absolute inset-0 z-50 flex items-end ${closing ? 'animate-mwFadeOut' : 'animate-mwFade'}`}
      style={{ background: 'rgba(28,14,30,.5)', backdropFilter: 'blur(3px)' }}>
      <div onClick={(e) => e.stopPropagation()}
        className={`hide-scrollbar w-full overflow-y-auto ${closing ? 'animate-mwSheetOut' : 'animate-mwSheet'}`}
        style={{ translate: panelTranslate, maxHeight: '92%', background: '#fff', borderRadius: '26px 26px 0 0', padding: '22px 22px 28px' }}>

        {/* Grab handle */}
        <div onPointerDown={onHandleDown} onPointerMove={onHandleMove} onPointerUp={onHandleUp} onPointerCancel={onHandleUp}
          className="flex justify-center items-center cursor-grab touch-none" style={{ height: 26, margin: '-8px 0 6px' }}>
          <div style={{ width: 42, height: 5, borderRadius: 99, background: '#eadfe4' }} />
        </div>

        <div className="flex items-center justify-between mb-[18px]">
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 21, color: '#3a2740' }}>New profile</div>
          <button onClick={dismiss} className="w-[34px] h-[34px] rounded-full border-none flex items-center justify-center cursor-pointer"
            style={{ background: '#f6eef1', color: '#9b8aa3' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex gap-[11px]">
          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Name</label>
            <input value={form.name} onInput={set('name')} placeholder="Jordan" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Age</label>
            <input value={form.age} onInput={set('age')} type="number" placeholder="27" style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>Job / Company</label>
        <input value={form.job} onInput={set('job')} placeholder="Photographer at Lumen" style={inputStyle} />

        <label style={labelStyle}>Location</label>
        <input value={form.location} onInput={set('location')} placeholder="Chicago, IL" style={inputStyle} />

        <label style={labelStyle}>Bio</label>
        <textarea value={form.bio} onInput={set('bio')} placeholder="Tell people a little about yourself…"
          style={{ ...inputStyle, minHeight: 74, resize: 'vertical', lineHeight: 1.5 }} />

        <label style={labelStyle}>Interests <span style={{ color: '#c3b4cb', fontWeight: 500 }}>· comma separated</span></label>
        <input value={form.interests} onInput={set('interests')} placeholder="Coffee, Travel, Live music" style={inputStyle} />

        <label style={labelStyle}>Image URLs <span style={{ color: '#c3b4cb', fontWeight: 500 }}>· one per line</span></label>
        <textarea value={form.images} onInput={set('images')} placeholder="https://images.unsplash.com/photo-..."
          style={{ ...inputStyle, minHeight: 74, resize: 'vertical', lineHeight: 1.5 }} />

        {error && <div style={{ color: '#FF4F6B', fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>{error}</div>}

        <button onClick={submit} className="w-full mt-5 py-[15px] border-none rounded-[15px] text-white font-bold text-[15px] cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', boxShadow: '0 8px 20px rgba(253,38,122,.32)' }}>
          Add to deck
        </button>
      </div>
    </div>
  );
}

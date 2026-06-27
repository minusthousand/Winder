import { useState, useEffect, useRef, useCallback } from 'react';
import { SEED_PROFILES } from './data/seed';
import { fetchProfiles, insertProfile, seedProfiles } from './lib/db';
import CardStack from './components/CardStack';
import ProfileModal from './components/ProfileModal';
import AddProfileForm from './components/AddProfileForm';
import ControlButtons from './components/ControlButtons';

// ---- localStorage helpers ----
const ls = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  rm: (k) => { try { localStorage.removeItem(k); } catch {} },
};

function persist(profiles, index) {
  ls.set('mw_profiles', profiles);
  ls.set('mw_index', index);
}

// ---- Sheet grab-to-close hook (with live drag tracking) ----
function useGrabClose(onDismiss) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(null);
  const liveDY = useRef(0);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const handleDown = (e) => {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    startY.current = e.clientY;
    liveDY.current = 0;
    setDragging(true);
  };
  const handleMove = (e) => {
    if (startY.current === null) return;
    const d = Math.max(0, e.clientY - startY.current);
    liveDY.current = d;
    setDragY(d);
  };
  const handleUp = () => {
    setDragging(false);
    if (liveDY.current > 80) onDismissRef.current();
    else setDragY(0);
    startY.current = null;
    liveDY.current = 0;
  };
  const handleCancel = () => {
    setDragging(false);
    setDragY(0);
    startY.current = null;
    liveDY.current = 0;
  };

  const grabProps = { onPointerDown: handleDown, onPointerMove: handleMove, onPointerUp: handleUp, onPointerCancel: handleCancel };
  // Use CSS `translate` (independent of `transform`) so drag doesn't fight CSS open/close animations
  const panelTranslate = (dragging || dragY > 0) ? `0 ${dragY}px` : undefined;

  return { grabProps, panelTranslate };
}

// ---- Login sheet ----
function LoginSheet({ onClose, onSuccess }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [closing, setClosing] = useState(false);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  const { grabProps, panelTranslate } = useGrabClose(dismiss);

  const submit = () => {
    if (pw.trim().toLowerCase() === 'admin') {
      ls.set('mw_admin', '1');
      setClosing(true);
      setTimeout(onSuccess, 280);
    } else {
      setErr('Incorrect password. Try "admin".');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', marginTop: 20, border: '1.5px solid #f0e3e9',
    borderRadius: 13, fontSize: 16, fontFamily: "'Plus Jakarta Sans',sans-serif",
    color: '#3a2740', outline: 'none', background: '#fdfafb', textAlign: 'center', letterSpacing: 2,
  };

  return (
    <div onClick={dismiss} className={`absolute inset-0 z-50 flex items-end ${closing ? 'animate-mwFadeOut' : 'animate-mwFade'}`}
      style={{ background: 'rgba(28,14,30,.5)', backdropFilter: 'blur(3px)' }}>
      <div onClick={(e) => e.stopPropagation()} className={`w-full ${closing ? 'animate-mwSheetOut' : 'animate-mwSheet'}`}
        style={{ translate: panelTranslate, background: '#fff', borderRadius: '26px 26px 0 0', padding: '26px 24px 30px' }}>
        <div {...grabProps} className="flex justify-center items-center cursor-grab touch-none" style={{ height: 26, margin: '-8px 0 8px' }}>
          <div style={{ width: 42, height: 5, borderRadius: 99, background: '#eadfe4' }} />
        </div>
        <div className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', boxShadow: '0 8px 20px rgba(253,38,122,.3)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div className="text-center font-outfit font-bold text-xl" style={{ color: '#3a2740' }}>Admin sign in</div>
        <div className="text-center text-sm mt-[6px] leading-relaxed" style={{ color: '#9b8aa3' }}>
          Sign in to add new profiles to the deck.<br/>Everyone else can swipe &amp; browse.
        </div>
        <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Password"
          style={inputStyle} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        {err && <div className="text-center text-xs font-semibold mt-2" style={{ color: '#FF4F6B' }}>{err}</div>}
        <div className="text-center mt-[9px]" style={{ fontSize: 11.5, color: '#c3b4cb' }}>
          Hint: the password is <b style={{ color: '#9b8aa3' }}>admin</b>
        </div>
        <button onClick={submit} className="w-full mt-[18px] py-[15px] border-none rounded-[15px] text-white font-bold text-[15px] cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', boxShadow: '0 8px 20px rgba(253,38,122,.32)' }}>
          Sign in
        </button>
      </div>
    </div>
  );
}

// ---- Settings sheet ----
function SettingsSheet({ isAdmin, onClose, onLoginOpen, onAddOpen, onLogout }) {
  const [closing, setClosing] = useState(false);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  const { grabProps, panelTranslate } = useGrabClose(dismiss);

  return (
    <div onClick={dismiss} className={`absolute inset-0 z-50 flex items-end ${closing ? 'animate-mwFadeOut' : 'animate-mwFade'}`}
      style={{ background: 'rgba(28,14,30,.5)', backdropFilter: 'blur(3px)' }}>
      <div onClick={(e) => e.stopPropagation()} className={`w-full ${closing ? 'animate-mwSheetOut' : 'animate-mwSheet'}`}
        style={{ translate: panelTranslate, background: '#fff', borderRadius: '26px 26px 0 0', padding: '22px 22px 30px' }}>
        <div {...grabProps} className="flex justify-center items-center cursor-grab touch-none" style={{ height: 26, margin: '-8px 0 6px' }}>
          <div style={{ width: 42, height: 5, borderRadius: 99, background: '#eadfe4' }} />
        </div>
        <div className="flex items-center justify-between mb-[6px]">
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 21, color: '#3a2740' }}>Settings</div>
          <button onClick={dismiss} className="w-[34px] h-[34px] rounded-full border-none flex items-center justify-center cursor-pointer"
            style={{ background: '#f6eef1', color: '#9b8aa3' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {isAdmin ? (
          <div>
            <div className="flex items-center gap-[7px] font-bold text-xs py-[10px]" style={{ color: '#E0356E', letterSpacing: '.4px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6L9 17l-5-5"/></svg>
              Signed in as admin
            </div>
            <button onClick={onAddOpen} className="w-full flex items-center gap-[13px] p-[14px] border-none rounded-[15px] cursor-pointer text-left"
              style={{ background: '#fbf3f6', color: '#3a2740', fontSize: 14.5, fontWeight: 600 }}>
              <span className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </span>
              Add a profile
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbb9d2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-[13px] p-[14px] mt-[10px] border-none rounded-[15px] cursor-pointer text-left"
              style={{ background: '#fff5f6', color: '#FF4F6B', fontSize: 14.5, fontWeight: 600 }}>
              <span className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0"
                style={{ background: '#ffe3e8', color: '#FF4F6B' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
              </span>
              Log out
            </button>
          </div>
        ) : (
          <div>
            <div className="text-sm leading-relaxed mx-[2px] mb-[14px] mt-[6px]" style={{ color: '#9b8aa3' }}>
              You're browsing as a guest — swipe and explore freely. Sign in as admin to add new profiles to the deck.
            </div>
            <button onClick={onLoginOpen} className="w-full flex items-center gap-[13px] p-[14px] border-none rounded-[15px] cursor-pointer text-left"
              style={{ background: '#fbf3f6', color: '#3a2740', fontSize: 14.5, fontWeight: 600 }}>
              <span className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', color: '#fff' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              Admin sign in
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbb9d2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Match celebration ----
function MatchScreen({ profile, onClose }) {
  if (!profile) return null;
  return (
    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center text-center px-8 overflow-hidden animate-mwFade"
      style={{ background: 'linear-gradient(160deg,#FF7854 0%,#FD267A 55%,#C9268E 100%)' }}>
      <div className="absolute -top-10 -left-8 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,.08)' }} />
      <div className="absolute bottom-10 -right-10 w-[200px] h-[200px] rounded-full" style={{ background: 'rgba(255,255,255,.07)' }} />

      <div className="animate-mwPop" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 46, lineHeight: 1, letterSpacing: -1, color: '#fff' }}>
        It's a Match!
      </div>
      <div className="mt-3 max-w-[280px] leading-relaxed" style={{ color: 'rgba(255,255,255,.92)', fontSize: 15 }}>
        You and {profile.name} have liked each other.
      </div>

      <div className="relative my-9">
        <div className="w-[152px] h-[152px] rounded-full border-[4px] border-white animate-mwPop"
          style={{
            backgroundImage: `url("${profile.images[0]}")`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            boxShadow: '0 16px 38px rgba(0,0,0,.28)',
          }} />
        <div className="absolute -right-1 -bottom-1 w-[54px] h-[54px] rounded-full bg-white flex items-center justify-center animate-mwHeartBurst"
          style={{ boxShadow: '0 8px 20px rgba(0,0,0,.2)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FD267A">
            <path d="M12 21s-8.5-5.6-8.5-11.2A4.8 4.8 0 0 1 12 6.5a4.8 4.8 0 0 1 8.5 3.3C20.5 15.4 12 21 12 21z"/>
          </svg>
        </div>
      </div>

      <button onClick={onClose} className="w-full max-w-[300px] py-[15px] border-none rounded-full font-bold text-[15px] cursor-pointer"
        style={{ background: '#fff', color: '#FD267A', boxShadow: '0 10px 24px rgba(0,0,0,.18)' }}>
        Keep swiping
      </button>
    </div>
  );
}

// ---- Root ----
export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [detailProfile, setDetailProfile] = useState(null);
  const [detailStartIndex, setDetailStartIndex] = useState(0);
  const [matchProfile, setMatchProfile] = useState(null);

  const cardStackRef = useRef(null);

  useEffect(() => {
    const admin = ls.get('mw_admin') === '1';
    setIsAdmin(admin);

    let idx = ls.get('mw_index') || 0;

    fetchProfiles()
      .then(async (profs) => {
        if (!profs.length) profs = await seedProfiles(SEED_PROFILES);
        if (idx > profs.length) idx = 0;
        setProfiles(profs);
        setIndex(idx);
      })
      .catch(() => {
        const profs = SEED_PROFILES;
        if (idx > profs.length) idx = 0;
        setProfiles(profs);
        setIndex(idx);
      })
      .finally(() => setLoading(false));
  }, []);

  const doSwipe = useCallback((dir, superLike, profile) => {
    setHistory((h) => [...h, index]);
    const newIndex = index + 1;
    ls.set('mw_index', newIndex);
    setIndex(newIndex);
    if (dir === 'right' && (superLike || profile.likesYou)) setMatchProfile(profile);
  }, [index]);

  const onRewind = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    cardStackRef.current?.startRewind();
    ls.set('mw_index', last);
    setIndex(last);
    setHistory((h) => h.slice(0, -1));
    if (cardStackRef.current) cardStackRef.current.resetPhoto();
  };

  const onNope = () => { if (cardStackRef.current) cardStackRef.current.triggerSwipe('left'); };
  const onLike = () => { if (cardStackRef.current) cardStackRef.current.triggerSwipe('right'); };
  const onStar = () => { if (cardStackRef.current) cardStackRef.current.triggerSwipe('right', true); };
  const onResetDeck = () => { ls.set('mw_index', 0); setIndex(0); setHistory([]); };

  const onAddProfile = async (profile) => {
    try {
      const saved = await insertProfile(profile);
      setProfiles((prev) => [saved, ...prev]);
    } catch {
      setProfiles((prev) => [profile, ...prev]);
    }
    setAddOpen(false);
  };

  const openDetail = (profile, startIndex) => { setDetailProfile(profile); setDetailStartIndex(startIndex || 0); };
  const closeDetail = () => setDetailProfile(null);
  const detailNope = () => { closeDetail(); setTimeout(() => cardStackRef.current?.triggerSwipe('left'), 60); };
  const detailLike = () => { closeDetail(); setTimeout(() => cardStackRef.current?.triggerSwipe('right'), 60); };

  const shell = {
    position: 'relative',
    width: 'min(440px, 100vw)',
    height: 'min(932px, 100dvh)',
    background: 'linear-gradient(180deg,#fff6f2 0%, #ffeef0 100%)',
    display: 'flex',
    flexDirection: 'column',
  };

  if (loading) {
    return (
      <div style={{ ...shell, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 32, background: 'linear-gradient(135deg,#FF7854,#FD267A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          winder
        </div>
        <div style={{ width: 34, height: 34, border: '3px solid #f0e3e9', borderTopColor: '#FD267A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ ...shell, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.45)' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '16px 18px 10px' }}>
        <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 21, letterSpacing: '-.3px', background: 'linear-gradient(135deg,#FF7854,#FD267A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          winder
        </div>
        <button onClick={() => setSettingsOpen(true)}
          className="w-10 h-10 rounded-[12px] border-none flex items-center justify-center cursor-pointer"
          style={{ background: '#fff', color: '#7a6680', boxShadow: '0 3px 10px rgba(0,0,0,.06)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      {/* Card deck */}
      <div className="relative flex-1" style={{ margin: '4px 16px 0' }}>
        <CardStack
          ref={cardStackRef}
          profiles={profiles}
          index={index}
          onSwipe={doSwipe}
          onOpenDetail={openDetail}
          onResetDeck={onResetDeck}
        />
      </div>

      {/* Controls */}
      <ControlButtons
        onRewind={onRewind}
        onNope={onNope}
        onLike={onLike}
        onStar={onStar}
        canRewind={history.length > 0}
      />

      {/* Overlays */}
      {detailProfile && (
        <ProfileModal
          profile={detailProfile}
          startIndex={detailStartIndex}
          onClose={closeDetail}
          onNope={detailNope}
          onLike={detailLike}
        />
      )}
      <MatchScreen profile={matchProfile} onClose={() => setMatchProfile(null)} />
      {settingsOpen && (
        <SettingsSheet
          isAdmin={isAdmin}
          onClose={() => setSettingsOpen(false)}
          onLoginOpen={() => { setSettingsOpen(false); setLoginOpen(true); }}
          onAddOpen={() => { setSettingsOpen(false); setAddOpen(true); }}
          onLogout={() => { ls.rm('mw_admin'); setIsAdmin(false); setSettingsOpen(false); }}
        />
      )}
      {loginOpen && (
        <LoginSheet
          onClose={() => setLoginOpen(false)}
          onSuccess={() => { setIsAdmin(true); setLoginOpen(false); }}
        />
      )}
      {addOpen && (
        <AddProfileForm
          onClose={() => setAddOpen(false)}
          onAdd={onAddProfile}
        />
      )}
    </div>
  );
}

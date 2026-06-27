import { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { distLabel } from '../data/seed';

function SwipeCard({ profile, isTop, dragState, photoIndex, onPointerDown, onPointerMove, onPointerUp, onOpenInfo }) {
  const d = isTop ? (dragState || { x: 0, y: 0, active: false }) : { x: 0, y: 0, active: false };
  const rot = d.x * 0.035;

  const transform = isTop
    ? `translate(${d.x}px,${d.y}px) rotate(${rot}deg)`
    : undefined;

  const likeOp = isTop ? Math.max(0, Math.min(1, d.x / 120)) : 0;
  const nopeOp = isTop ? Math.max(0, Math.min(1, -d.x / 120)) : 0;

  const activePhoto = isTop ? Math.min(photoIndex, profile.images.length - 1) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform,
        transition: isTop ? (d.active ? 'none' : 'transform .34s cubic-bezier(.2,.7,.3,1.2)') : undefined,
        zIndex: isTop ? 30 : 20,
        pointerEvents: isTop ? 'auto' : 'none',
        cursor: isTop ? 'grab' : 'default',
        touchAction: 'none',
        willChange: 'transform',
      }}
      onPointerDown={isTop ? onPointerDown : undefined}
      onPointerMove={isTop ? onPointerMove : undefined}
      onPointerUp={isTop ? onPointerUp : undefined}
      onPointerCancel={isTop ? onPointerUp : undefined}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: '#ddd', boxShadow: '0 18px 40px rgba(60,20,40,.22)' }}>
        {/* Photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("${profile.images[activePhoto]}")`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />

        {/* Progress bars */}
        {profile.images.length > 1 && (
          <div style={{ position: 'absolute', top: 12, left: 14, right: 14, display: 'flex', gap: 5, zIndex: 4 }}>
            {profile.images.map((_, k) => (
              <div key={k} style={{
                flex: 1, height: 3.5, borderRadius: 3,
                background: k === activePhoto ? '#fff' : 'rgba(255,255,255,.45)',
                transition: 'background .2s',
              }} />
            ))}
          </div>
        )}

        {/* LIKE stamp */}
        <div style={{
          position: 'absolute', top: 26, left: 22, zIndex: 5,
          padding: '5px 16px', fontFamily: 'Outfit,sans-serif', fontWeight: 800,
          fontSize: 30, letterSpacing: 1, borderRadius: 10,
          border: '4px solid #2ED47A', color: '#2ED47A',
          transform: 'rotate(-16deg)', opacity: likeOp, pointerEvents: 'none',
        }}>LIKE</div>

        {/* NOPE stamp */}
        <div style={{
          position: 'absolute', top: 26, right: 22, zIndex: 5,
          padding: '5px 16px', fontFamily: 'Outfit,sans-serif', fontWeight: 800,
          fontSize: 30, letterSpacing: 1, borderRadius: 10,
          border: '4px solid #FF4F6B', color: '#FF4F6B',
          transform: 'rotate(16deg)', opacity: nopeOp, pointerEvents: 'none',
        }}>NOPE</div>

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', background: 'linear-gradient(to top, rgba(20,8,18,.82) 0%, rgba(20,8,18,.35) 45%, transparent 100%)' }} />

        {/* Info */}
        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, zIndex: 3, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 27, lineHeight: 1, letterSpacing: '-.4px' }}>{profile.name}</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 500, fontSize: 23, lineHeight: 1.05, opacity: .92 }}>{profile.age}</div>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#5BC8FF" style={{ marginBottom: 2 }}>
              <path d="M12 2l2.4 2.1 3.1-.5 1 3 2.8 1.4-1 3 1 3-2.8 1.4-1 3-3.1-.5L12 22l-2.4-2.1-3.1.5-1-3L2.7 16.4l1-3-1-3 2.8-1.4 1-3 3.1.5z"/>
              <path d="M9.5 12.3l1.7 1.7 3.4-3.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, fontSize: 13, opacity: .92 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {distLabel(profile.distance)} · {profile.location}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
            {(profile.interests || []).slice(0, 3).map((tag) => (
              <div key={tag} style={{ padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,.25)', fontSize: 11.5, fontWeight: 600 }}>{tag}</div>
            ))}
          </div>
        </div>

        {/* Info button */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onOpenInfo}
          style={{ position: 'absolute', right: 14, bottom: 18, zIndex: 4, width: 34, height: 34, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(8px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 11v5M12 7.5v.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const CardStack = forwardRef(function CardStack({ profiles, index, onSwipe, onOpenDetail, onResetDeck }, ref) {
  const [drag, setDrag] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const moved = useRef(0);
  const swipeTimer = useRef(null);

  const topProfile = profiles[index];
  const visible = profiles.slice(index, index + 3);
  const deckEmpty = profiles.length > 0 && index >= profiles.length;

  const triggerSwipe = useCallback((dir, superLike = false) => {
    if (!topProfile) return;
    clearTimeout(swipeTimer.current);
    setDrag({ x: dir === 'right' ? 700 : -700, y: -40, active: false });
    swipeTimer.current = setTimeout(() => {
      setDrag(null);
      setPhotoIndex(0);
      onSwipe(dir, superLike, topProfile);
    }, 320);
  }, [topProfile, onSwipe]);

  const onPointerDown = useCallback((e) => {
    if (!topProfile) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    startPos.current = { x: e.clientX, y: e.clientY };
    moved.current = 0;
    dragging.current = true;
    setDrag({ x: 0, y: 0, active: true });
  }, [topProfile]);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    moved.current = Math.max(moved.current, Math.hypot(dx, dy));
    setDrag({ x: dx, y: dy * 0.4, active: true });
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    const d = drag || { x: 0, y: 0 };
    if (d.x > 110) {
      triggerSwipe('right');
    } else if (d.x < -110) {
      triggerSwipe('left');
    } else if (moved.current < 8) {
      let rel = 0.7;
      try {
        const r = e.currentTarget.getBoundingClientRect();
        rel = (startPos.current.x - r.left) / r.width;
      } catch (_) {}
      if (!topProfile || !topProfile.images || topProfile.images.length < 2) {
        setDrag(null);
        return;
      }
      const dir = rel < 0.35 ? -1 : 1;
      const n = topProfile.images.length;
      setPhotoIndex((prev) => (prev + dir + n) % n);
      setDrag(null);
    } else {
      setDrag(null);
    }
  }, [drag, triggerSwipe, topProfile]);

  useImperativeHandle(ref, () => ({
    triggerSwipe,
    resetPhoto: () => setPhotoIndex(0),
  }), [triggerSwipe]);

  if (deckEmpty) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <div className="w-[84px] h-[84px] rounded-full flex items-center justify-center mb-[18px]"
          style={{ background: 'linear-gradient(135deg,#FFEDE4,#FFE1EC)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FD267A" strokeWidth="1.7">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
          </svg>
        </div>
        <div className="font-outfit font-bold text-xl text-[#3a2740]">You're all caught up</div>
        <div className="text-sm text-[#9b8aa3] mt-2 leading-relaxed">No more people nearby right now.<br/>Check back soon for new faces.</div>
        <button onClick={onResetDeck} className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full border-none text-white font-bold text-sm cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', boxShadow: '0 8px 20px rgba(253,38,122,.3)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>
          </svg>
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {[...visible].reverse().map((profile, revI) => {
        const i = visible.length - 1 - revI;
        const isTop = i === 0;
        const sc = 1 - i * 0.05;
        const backStyle = !isTop ? {
          position: 'absolute', inset: 0,
          transform: `translateY(${i * 11}px) scale(${sc})`,
          transition: 'transform .3s ease',
          zIndex: 30 - i * 10,
          pointerEvents: 'none',
        } : undefined;

        if (!isTop) {
          return (
            <div key={profile.id} style={backStyle}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: '#ddd', boxShadow: '0 18px 40px rgba(60,20,40,.22)' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${profile.images[0]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', background: 'linear-gradient(to top, rgba(20,8,18,.82) 0%, rgba(20,8,18,.35) 45%, transparent 100%)' }} />
                <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, zIndex: 3, color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 27, lineHeight: 1 }}>{profile.name}</div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 500, fontSize: 23, lineHeight: 1.05, opacity: .92 }}>{profile.age}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <SwipeCard
            key={profile.id}
            profile={profile}
            isTop={true}
            dragState={drag}
            photoIndex={photoIndex}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onOpenInfo={() => onOpenDetail(profile, photoIndex)}
          />
        );
      })}
    </div>
  );
});

export default CardStack;

import { useState } from 'react';
import { distLabel } from '../data/seed';

export default function ProfileModal({ profile, startIndex = 0, onClose, onNope, onLike }) {
  const [idx, setIdx] = useState(startIndex);
  const [closing, setClosing] = useState(false);

  if (!profile) return null;

  const prev = () => setIdx((i) => (i - 1 + profile.images.length) % profile.images.length);
  const next = () => setIdx((i) => (i + 1) % profile.images.length);

  const close = () => { setClosing(true); setTimeout(onClose, 280); };
  const closeNope = () => { setClosing(true); setTimeout(onNope, 280); };
  const closeLike = () => { setClosing(true); setTimeout(onLike, 280); };

  return (
    <div className={`absolute inset-0 z-40 bg-white flex flex-col ${closing ? 'animate-mwSheetOut' : 'animate-mwSheet'}`}>
      <div className="hide-scrollbar flex-1 overflow-y-auto">
        {/* Carousel */}
        <div className="relative" style={{ height: '62vh', minHeight: 380 }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("${profile.images[idx]}")`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />

          {/* Tap zones */}
          <div onClick={prev} className="absolute top-0 left-0 w-[40%] h-full z-[2] cursor-pointer" />
          <div onClick={next} className="absolute top-0 right-0 w-[40%] h-full z-[2] cursor-pointer" />

          {/* Progress bars */}
          <div className="absolute top-[14px] left-4 right-4 flex gap-[6px] z-[3]">
            {profile.images.map((_, k) => (
              <div key={k} style={{
                flex: 1, height: 3.5, borderRadius: 3,
                background: k === idx ? '#fff' : 'rgba(255,255,255,.4)',
              }} />
            ))}
          </div>

          {/* Close button */}
          <button onClick={close} className="absolute top-[42px] right-4 z-[4] w-[42px] h-[42px] rounded-full border-none flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,.92)', color: '#FD267A', boxShadow: '0 6px 16px rgba(0,0,0,.18)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {/* Gradient overlay */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: 'linear-gradient(to top,rgba(20,8,18,.8),transparent)' }} />

          {/* Name / distance */}
          <div className="absolute left-[22px] right-[22px] bottom-5 z-[3] text-white">
            <div className="flex items-end gap-[10px]">
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 33, lineHeight: 1, letterSpacing: '-.5px' }}>{profile.name}</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 500, fontSize: 27, lineHeight: 1.05, opacity: .92 }}>{profile.age}</div>
            </div>
            <div className="flex items-center gap-[6px] mt-2 text-sm opacity-95">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {distLabel(profile.distance)} · {profile.location}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-[22px]">
          {/* Job */}
          <div className="flex items-center gap-[10px] p-[13px_15px] rounded-2xl mb-[18px]" style={{ background: '#fbf3f6' }}>
            <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)' }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#b79', letterSpacing: '.4px', textTransform: 'uppercase' }}>Work</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: '#3a2740' }}>{profile.job}</div>
            </div>
          </div>

          {/* About */}
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#3a2740', marginBottom: 9 }}>About</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.65, color: '#6a5872', marginBottom: 22 }}>{profile.bio}</div>

          {/* Interests */}
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#3a2740', marginBottom: 11 }}>Interests</div>
          <div className="flex flex-wrap gap-2 mb-[22px]">
            {(profile.interests || []).map((tag) => (
              <div key={tag} className="flex items-center gap-[6px] px-[14px] py-2 rounded-full text-sm font-semibold"
                style={{ background: '#fff', border: '1.5px solid #ffe0e9', color: '#E0356E', fontSize: 13 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-8.5-5.6-8.5-11.2A4.8 4.8 0 0 1 12 6.5a4.8 4.8 0 0 1 8.5 3.3C20.5 15.4 12 21 12 21z"/>
                </svg>
                {tag}
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center gap-[7px] p-[13px_15px] rounded-2xl" style={{ background: '#fbf3f6', color: '#6a5872', fontSize: 13.5, fontWeight: 500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FD267A" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Lives in {profile.location}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-center gap-[22px] py-[14px] pb-5 border-t flex-shrink-0 bg-white" style={{ borderColor: '#f3e7ec' }}>
        <button onClick={closeNope} className="w-[58px] h-[58px] rounded-full border-none flex items-center justify-center cursor-pointer"
          style={{ background: '#fff', color: '#FF4F6B', boxShadow: '0 8px 20px rgba(255,79,107,.22)' }}>
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <button onClick={closeLike} className="w-[58px] h-[58px] rounded-full border-none flex items-center justify-center cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', color: '#fff', boxShadow: '0 10px 24px rgba(253,38,122,.38)' }}>
          <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-8.5-5.6-8.5-11.2A4.8 4.8 0 0 1 12 6.5a4.8 4.8 0 0 1 8.5 3.3C20.5 15.4 12 21 12 21z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

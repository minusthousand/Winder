export default function ControlButtons({ onRewind, onNope, onStar, onLike, canRewind }) {
  return (
    <div className="flex items-center justify-center gap-4 py-[18px] pb-6 flex-shrink-0">
      {/* Rewind */}
      <button
        onClick={onRewind}
        disabled={!canRewind}
        className="w-[52px] h-[52px] rounded-full border-none flex items-center justify-center cursor-pointer transition-opacity"
        style={{
          background: '#fff',
          color: canRewind ? '#FFB23F' : '#dccfd6',
          boxShadow: '0 8px 20px rgba(255,178,63,.18)',
          opacity: canRewind ? 1 : 0.6,
          cursor: canRewind ? 'pointer' : 'default',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
          <path d="M3 4v4h4"/>
        </svg>
      </button>

      {/* Nope */}
      <button
        onClick={onNope}
        className="w-[62px] h-[62px] rounded-full border-none flex items-center justify-center cursor-pointer"
        style={{ background: '#fff', color: '#FF4F6B', boxShadow: '0 10px 24px rgba(255,79,107,.22)' }}
      >
        <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Super-Like */}
      <button
        onClick={onStar}
        className="w-[52px] h-[52px] rounded-full border-none flex items-center justify-center cursor-pointer"
        style={{ background: '#fff', color: '#3FA9FF', boxShadow: '0 8px 20px rgba(63,169,255,.2)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/>
        </svg>
      </button>

      {/* Like */}
      <button
        onClick={onLike}
        className="w-[62px] h-[62px] rounded-full border-none flex items-center justify-center cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#FF7854,#FD267A)', color: '#fff', boxShadow: '0 12px 26px rgba(253,38,122,.38)' }}
      >
        <svg width="29" height="29" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21s-8.5-5.6-8.5-11.2A4.8 4.8 0 0 1 12 6.5a4.8 4.8 0 0 1 8.5 3.3C20.5 15.4 12 21 12 21z"/>
        </svg>
      </button>
    </div>
  );
}

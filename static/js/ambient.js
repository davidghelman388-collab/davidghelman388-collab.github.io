(() => {
  const canvas = document.getElementById('ambient-canvas');
  const stage = document.querySelector('.hero-stage');
  if (!canvas || !stage) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const button = stage.querySelector('.motion-toggle');
  let width = 0, height = 0, frame = 0, elapsed = 0, last = 0;
  let visible = true, paused = reduced.matches;
  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const mobile = width < 600;
    const lines = mobile ? 9 : 16;
    const base = height * (mobile ? 0.65 : 0.64);
    for (let row = 0; row < lines; row++) {
      ctx.beginPath();
      for (let x = -20; x <= width + 20; x += 7) {
        const progress = x / width;
        const envelope = Math.sin(progress * Math.PI) * 0.6 + 0.4;
        const y = base + row * 10 + Math.sin(progress * 6 + time * 0.16 + row * 0.13) * 45 * envelope
          + Math.cos(progress * 3 - time * 0.11 + row * 0.06) * 25;
        x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${row % 3 === 0 ? '163, 151, 234' : '110, 148, 226'}, ${mobile ? 0.09 : 0.11})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    for (let i = 0; i < (mobile ? 12 : 24); i++) {
      const x = ((i * 139.7 + time * (2 + i % 3)) % (width + 40)) - 20;
      const y = height * (0.12 + ((i * 0.173) % 0.75)) + Math.sin(time * 0.25 + i) * 12;
      ctx.beginPath(); ctx.arc(x, y, i % 4 === 0 ? 1.6 : 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(170,190,244,${0.15 + Math.sin(time * 0.4 + i) * 0.08})`; ctx.fill();
    }
  }
  function tick(timestamp) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (last) elapsed += Math.min(timestamp - last, 80) / 1000;
    last = timestamp;
    draw(elapsed);
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    stage.classList.toggle('motion-paused', paused || !visible || document.hidden);
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = (paused ? button.dataset.play : button.dataset.pause) + (paused ? ' ▷' : ' Ⅱ');
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function resize() {
    width = stage.clientWidth; height = stage.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(elapsed);
  }
  button.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', event => { paused = event.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(stage);
  resize(); sync();
})();

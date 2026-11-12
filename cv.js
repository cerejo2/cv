/* CV — Rodrigo Cerejo · interação da versão web (não afeta o PDF)
   1) passar o rato (ou o foco) numa porta mostra o que fiz ali e realça o projeto;
   2) "Medir |ψ⟩" faz a superposição colapsar em |programador⟩. */
(() => {
  const body = document.body;

  /* ---------- dicas das portas ---------- */
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.setAttribute('role', 'tooltip');
  body.append(tip);

  const show = (el) => {
    const [title, text] = el.dataset.tip.split('|');
    tip.replaceChildren();
    const b = document.createElement('b');
    b.textContent = title;
    tip.append(b, document.createTextNode(text || ''));
    const r = el.getBoundingClientRect();
    tip.classList.add('on');
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = r.left + r.width / 2 - w / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - w - 8));
    let y = r.top - h - 10;
    if (y < 50) y = r.bottom + 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
    const card = el.dataset.card && document.getElementById(el.dataset.card);
    if (card) card.classList.add('hot');
  };

  const hide = (el) => {
    tip.classList.remove('on');
    const card = el.dataset.card && document.getElementById(el.dataset.card);
    if (card) card.classList.remove('hot');
  };

  document.querySelectorAll('.gate[data-tip]').forEach((g) => {
    g.addEventListener('mouseenter', () => show(g));
    g.addEventListener('focus', () => show(g));
    g.addEventListener('mouseleave', () => hide(g));
    g.addEventListener('blur', () => hide(g));
  });

  /* o inverso: passar o rato num projeto realça a porta dele no circuito */
  document.querySelectorAll('.card[id]').forEach((card) => {
    const gate = document.querySelector(`.gate[data-card="${card.id}"]`);
    if (!gate) return;
    card.addEventListener('mouseenter', () => gate.classList.add('hot'));
    card.addEventListener('mouseleave', () => gate.classList.remove('hot'));
  });

  /* ---------- medição ---------- */
  const btn = document.getElementById('measure');
  const toggle = () => {
    const on = body.classList.toggle('measured');
    if (btn) btn.textContent = on ? body.dataset.reset : body.dataset.measure;
  };
  [btn, document.getElementById('bloch'), document.getElementById('meas')]
    .forEach((el) => el && el.addEventListener('click', toggle));

  /* o PDF mostra sempre o estado por medir: a medição é o estágio */
  window.addEventListener('beforeprint', () => {
    if (body.classList.contains('measured')) toggle();
  });
})();

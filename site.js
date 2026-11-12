/* CV interativo — Rodrigo Cerejo
   1) "Medir |ψ⟩": simula a medição de um qubit preparado com Ry(θ)|0⟩;
   2) circuito de competências: tocar numa porta mostra o que fiz ali;
   3) textos em PT e EN (botão no topo). */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     Textos da página
     ------------------------------------------------------------------ */
  const T = {
    pt: {
      pdf: 'CV completo (PDF)', pdfHref: 'CV_Rodrigo_Cerejo_PT.pdf', other: 'EN', otherLabel: 'Switch to English',
      ketA: 'estudante', ketB: 'programador',
      lead: 'Estudante de Engenharia Informática na Universidade de Aveiro, no 2.º ano. <b>Procuro o primeiro estágio em desenvolvimento de software.</b>',
      blochAlt: 'Esfera de Bloch com o estado entre estudante e programador',
      measure: 'Medir |ψ⟩', shots: '× 100', reset: 'Repor',
      idle: 'Ainda ninguém mediu. Carrega em «Medir».',
      got1: 'Resultado: <b>|programador⟩</b>. Era o mais provável.',
      got0: 'Resultado: <b>|estudante⟩</b>. Também sou isso. Mede outra vez.',
      many: (n, p) => `${n} medições: <b>|programador⟩</b> em ${p} % delas.`,
      fine: 'Simulação de um qubit: P(programador) = sin²(θ/2) ≈ 73 %, com θ = 118°. A medição que conta é um estágio.',
      hDone: 'O que já fiz', hint: 'Cada linha é uma competência; cada porta, a cadeira onde a desenvolvi. Toca numa porta.',
      swipe: 'desliza para o lado →', projs: 'Projetos:', gOficina: 'Oficina', gSim: 'Simulador',
      axis: 'Competência ↓ &nbsp; Tempo →', live: 'EM CURSO',
      next: 'Próximo passo → <b>estágio</b>',
      lgDone: 'Concluída', lgLive: '<b>Em curso</b> — 1.º semestre 2026/27', lgBefore: 'Antes de a competência começar',
      gradeVar: 'nota', gradeVal: '15,5',
      f1: 'média ponderada do 1.º ano', f2: '1.º ano completo, sem cadeiras em atraso', f3: 'nota final em 100 horas de computação quântica',
      hContact: 'Falta a medição',
      contactP: 'O primeiro estágio é a medição que falta. Se tiverem um lugar para um estagiário, falem comigo.',
      pdfPT: 'CV em PDF', pdfEN: 'Resume in English (PDF)',
      foot: 'HTML, CSS e JavaScript, sem frameworks. Código em',
      proof: 'prova',
    },
    en: {
      pdf: 'Full resume (PDF)', pdfHref: 'CV_Rodrigo_Cerejo_EN.pdf', other: 'PT', otherLabel: 'Mudar para português',
      ketA: 'student', ketB: 'developer',
      lead: 'Second-year Computer Engineering student at the University of Aveiro, Portugal. <b>Looking for my first software development internship.</b>',
      blochAlt: 'Bloch sphere with the state between student and developer',
      measure: 'Measure |ψ⟩', shots: '× 100', reset: 'Reset',
      idle: 'Nobody has measured yet. Press “Measure”.',
      got1: 'Result: <b>|developer⟩</b>. That was the likely one.',
      got0: 'Result: <b>|student⟩</b>. I am that too. Measure again.',
      many: (n, p) => `${n} measurements: <b>|developer⟩</b> in ${p}% of them.`,
      fine: 'Single-qubit simulation: P(developer) = sin²(θ/2) ≈ 73%, with θ = 118°. The measurement that counts is an internship.',
      hDone: 'What I have done', hint: 'Each line is a skill; each gate, the course where I built it. Tap a gate.',
      swipe: 'swipe sideways →', projs: 'Projects:', gOficina: 'Garage', gSim: 'Simulator',
      axis: 'Skill ↓ &nbsp; Time →', live: 'IN PROGRESS',
      next: 'Next step → <b>internship</b>',
      lgDone: 'Completed', lgLive: '<b>In progress</b> — 1st semester 2026/27', lgBefore: 'Before the skill started',
      gradeVar: 'grade', gradeVal: '15.5',
      f1: 'weighted average of the 1st year', f2: '1st year completed, no courses left behind', f3: 'final grade in 100 hours of quantum computing',
      hContact: 'The measurement is missing',
      contactP: 'A first internship is the measurement that is missing. If you have a place for an intern, talk to me.',
      pdfPT: 'CV em português (PDF)', pdfEN: 'Resume (PDF)',
      foot: 'HTML, CSS and JavaScript, no frameworks. Source at',
      proof: 'proof',
    },
  };

  /* ------------------------------------------------------------------
     Circuito de competências (o desenho do CV original)
     ------------------------------------------------------------------ */
  const COLS = {
    pt: [['2022 – 2025', 'Antes da UA'], ['1.º ano · 2025/26', '1.º semestre'], ['1.º ano · 2025/26', '2.º semestre'], ['2.º ano · 2026/27', '1.º semestre']],
    en: [['2022 – 2025', 'Before UA'], ['1st year · 2025/26', '1st semester'], ['1st year · 2025/26', '2nd semester'], ['2nd year · 2026/27', '1st semester']],
  };

  /* Cadeiras: [nome PT, nome EN, detalhe que abrem]. */
  const COURSES = {
    aib: ['Aplicações Informáticas B', 'Computer Applications B', 'aib'],
    qxq: ['Qubit by Qubit', 'Qubit by Qubit', 'qxq'],
    fp: ['Fundamentos de Programação', 'Fundamentals of Programming', 'fp'],
    msf: ['Modelação de Sistemas Físicos', 'Physical Systems Modelling', 'msf'],
    poo: ['Programação Orientada a Objetos', 'Object-Oriented Programming', 'poo'],
    pds: ['Padrões e Desenho de Software', 'Software Design and Patterns', 'pds'],
    aed: ['Algoritmos e Estruturas de Dados', 'Algorithms and Data Structures', 'aed'],
    so: ['Sistemas Operativos', 'Operating Systems', 'vp'],
    fbd: ['Fundamentos de Bases de Dados', 'Database Fundamentals', 'oficina'],
    iei: ['Introdução à Engenharia Informática', 'Introduction to Computer Engineering', 'iei'],
    ac: ['Arquitetura de Computadores', 'Computer Architecture', 'ac'],
    mas: ['Modelação e Análise de Sistemas', 'Systems Modelling and Analysis', 'loop'],
    alga: ['Álgebra Linear e Geometria Analítica', 'Linear Algebra and Analytic Geometry', 'alga'],
    calc1: ['Cálculo I', 'Calculus I', 'calc1'],
    calc2: ['Cálculo II', 'Calculus II', 'calc2'],
    md: ['Matemática Discreta', 'Discrete Mathematics', 'md'],
    grupo: ['Projetos e trabalhos de grupo', 'School projects and group work', 'grupo'],
    ct1: ['Competências Transferíveis I', 'Transferable Skills I', 'ct1'],
  };

  /* Linhas: nome e descrição (PT, EN), coluna onde a competência começa, cadeiras por coluna. */
  const ROWS = [
    { name: ['Python', 'Python'], start: 0,
      desc: ['simulação numérica, gráficos e circuitos quânticos', 'numerical simulation, plotting and quantum circuits'],
      cells: [['aib', 'qxq'], ['fp'], ['msf'], []] },
    { name: ['Java', 'Java'], start: 2,
      desc: ['programação orientada a objetos e padrões de desenho', 'object-oriented programming and design patterns'],
      cells: [[], [], ['poo'], ['pds']] },
    { name: ['C / C++', 'C / C++'], start: 3,
      desc: ['algoritmos, estruturas de dados, processos e sinais em Linux', 'algorithms, data structures, processes and signals on Linux'],
      cells: [[], [], [], ['aed', 'so']] },
    { name: ['SQL', 'SQL'], start: 3,
      desc: ['modelação entidade-relação, SQL Server (T-SQL)', 'entity-relationship modelling, SQL Server (T-SQL)'],
      cells: [[], [], [], ['fbd']] },
    { name: ['HTML · CSS · JS', 'HTML · CSS · JS'], start: 1,
      desc: ['fundamentos de desenvolvimento web', 'web development fundamentals'],
      cells: [[], ['iei'], [], []] },
    { name: ['MIPS Assembly', 'MIPS Assembly'], start: 1,
      desc: ['arquitetura de computadores, programação de baixo nível', 'computer architecture, low-level programming'],
      cells: [[], ['ac'], [], []] },
    { name: ['Eng. de Software', 'Software Eng.'], start: 2,
      desc: ['UML, requisitos, casos de utilização, Scrum', 'UML, requirements, use cases, Scrum'],
      cells: [[], [], ['mas'], ['pds']] },
    { name: ['Ferramentas', 'Tools'], start: 0,
      desc: ['Linux, Bash, Git, Makefile, LaTeX, Markdown, Inkscape', 'Linux, Bash, Git, Makefile, LaTeX, Markdown, Inkscape'],
      cells: [['aib'], ['iei'], [], ['so']] },
    { name: ['Matemática', 'Mathematics'], start: 1,
      desc: ['álgebra linear, cálculo, matemática discreta', 'linear algebra, calculus, discrete mathematics'],
      cells: [[], ['alga', 'calc1'], ['calc2', 'md'], []] },
    { name: ['Transversais', 'Soft skills'], start: 0,
      desc: ['comunicação, trabalho em equipa, apresentações', 'communication, teamwork, presentations'],
      cells: [['grupo'], ['iei'], ['mas'], ['ct1']] },
  ];

  /* O que aparece no painel quando se toca numa porta: [título, linha técnica, texto, prova]. */
  const DETAILS = {
    aib: {
      pt: ['Aplicações Informáticas B', 'Python · Inkscape · 12.º ano', 'Programação em Python e desenho vetorial em Inkscape, no ensino secundário.'],
      en: ['Computer Applications B', 'Python · Inkscape · last year of high school', 'Python programming and vector graphics in Inkscape, in secondary school.'],
    },
    qxq: {
      pt: ['Introduction to Quantum Computing', 'Python · Cirq · 2024/25 · nota 99 %',
        'Curso de 100 horas da Qubit by Qubit (The Coding School), em inglês, feito por iniciativa própria no 12.º ano. Laboratórios semanais em Cirq no Google Colab: portas, entrelaçamento, algoritmos e distribuição quântica de chaves.'],
      en: ['Introduction to Quantum Computing', 'Python · Cirq · 2024/25 · grade 99%',
        'A 100-hour course by Qubit by Qubit (The Coding School), in English, taken on my own initiative in my last year of high school. Weekly labs in Cirq on Google Colab: gates, entanglement, algorithms and quantum key distribution.'],
    },
    fp: {
      pt: ['Fundamentos de Programação', 'Python · 1.º semestre · nota 15', 'Python de raiz: funções, listas, dicionários e ficheiros.'],
      en: ['Fundamentals of Programming', 'Python · 1st semester · grade 15/20', 'Python from scratch: functions, lists, dictionaries and files.'],
    },
    msf: {
      pt: ['Modelação de Sistemas Físicos', 'Python · NumPy · Matplotlib · nota 16', 'Simulação numérica de sistemas físicos, com gráficos dos resultados.'],
      en: ['Physical Systems Modelling', 'Python · NumPy · Matplotlib · grade 16/20', 'Numerical simulation of physical systems, with plots of the results.'],
    },
    poo: {
      pt: ['Programação Orientada a Objetos', 'Java · 2.º semestre · nota 16', 'Classes, herança, interfaces e leitura de ficheiros.'],
      en: ['Object-Oriented Programming', 'Java · 2nd semester · grade 16/20', 'Classes, inheritance, interfaces and file reading.'],
    },
    iei: {
      pt: ['Introdução à Engenharia Informática', 'Git · HTML · CSS · nota 16', 'Primeiros passos com Git e GitHub e uma página em HTML e CSS.'],
      en: ['Introduction to Computer Engineering', 'Git · HTML · CSS · grade 16/20', 'First steps with Git and GitHub, and a page in HTML and CSS.'],
    },
    ac: {
      pt: ['Arquitetura de Computadores', 'Assembly MIPS · 1.º semestre · nota 17', 'Programação em assembly MIPS no simulador MARS e estudo do datapath de ciclo único.'],
      en: ['Computer Architecture', 'MIPS assembly · 1st semester · grade 17/20', 'MIPS assembly programming in the MARS simulator and study of the single-cycle datapath.'],
    },
    alga: {
      pt: ['Álgebra Linear e Geometria Analítica', '1.º semestre · nota 17', 'Matrizes, sistemas lineares, espaços vetoriais e geometria analítica.'],
      en: ['Linear Algebra and Analytic Geometry', '1st semester · grade 17/20', 'Matrices, linear systems, vector spaces and analytic geometry.'],
    },
    calc1: {
      pt: ['Cálculo I', '1.º semestre · nota 16', 'Cálculo diferencial e integral de funções de uma variável.'],
      en: ['Calculus I', '1st semester · grade 16/20', 'Differential and integral calculus of functions of one variable.'],
    },
    calc2: {
      pt: ['Cálculo II', '2.º semestre', 'Continuação do cálculo: séries e funções de várias variáveis.'],
      en: ['Calculus II', '2nd semester', 'Calculus continued: series and functions of several variables.'],
    },
    md: {
      pt: ['Matemática Discreta', '2.º semestre', 'Lógica, combinatória e grafos.'],
      en: ['Discrete Mathematics', '2nd semester', 'Logic, combinatorics and graphs.'],
    },
    grupo: {
      pt: ['Projetos e trabalhos de grupo', 'Ensino secundário · 2022 – 2025', 'Trabalhos de grupo e apresentações ao longo do secundário.'],
      en: ['School projects and group work', 'Secondary school · 2022 – 2025', 'Group projects and presentations throughout secondary school.'],
    },
    ct1: {
      pt: ['Competências Transferíveis I', 'a decorrer', 'Comunicação, trabalho em equipa e apresentações.'],
      en: ['Transferable Skills I', 'in progress', 'Communication, teamwork and presentations.'],
    },
    pds: {
      pt: ['Padrões e Desenho de Software', 'Java · a decorrer', 'Nove guiões em par sobre padrões de desenho: Builder, Prototype, Adapter e Decorator.'],
      en: ['Software Design and Patterns', 'Java · in progress', 'Nine pair labs on design patterns: Builder, Prototype, Adapter and Decorator.'],
    },
    aed: {
      pt: ['Algoritmos e Estruturas de Dados', 'C · a decorrer', 'Gerador de cenas 2D em C: tipos abstratos de dados, arrays dinâmicos, insertion sort contra merge sort e valgrind.'],
      en: ['Algorithms and Data Structures', 'C · in progress', '2D scene generator in C: abstract data types, dynamic arrays, insertion sort against merge sort, and valgrind.'],
    },
    vp: {
      pt: ['vp: monitor de integridade de ficheiros', 'Bash · Linux · Git · Sistemas Operativos · nov 2026',
        'Comando que guarda o SHA-256 e os metadados de cada ficheiro e deteta o que foi criado, apagado ou alterado. Trabalho de par. <b>A minha parte:</b> a recolha de dados, o modo de proteção e os 48 testes automáticos, todos a passar em Ubuntu.',
        'código e relatório a pedido · uso de IA declarado'],
      en: ['vp: file integrity monitor', 'Bash · Linux · Git · Operating Systems · Nov 2026',
        'Command that stores the SHA-256 and metadata of every file and detects what was created, deleted or changed. Pair project. <b>My part:</b> data collection, the protection mode and the 48 automated tests, all passing on Ubuntu.',
        'code and report on request · AI use declared'],
    },
    loop: {
      pt: ['Loop: loja online de eletrónica recondicionada', 'TypeScript · React · Vite · Modelação e Análise de Sistemas · mai 2026',
        'Projeto de equipa (4), com catálogo, carrinho, carteira e retomas, gerido com pull requests. <b>A minha parte:</b> o serviço central de persistência (353 linhas de TypeScript) e a correção do routing no deploy.',
        '<a href="https://github.com/cerejo2/MAS-Project">github.com/cerejo2/MAS-Project</a>'],
      en: ['Loop: online shop for refurbished electronics', 'TypeScript · React · Vite · Systems Modelling and Analysis · May 2026',
        'Team project (4), with a catalogue, cart, wallet and trade-ins, managed with pull requests. <b>My part:</b> the central persistence service (353 lines of TypeScript) and the routing fix for the deployment.',
        '<a href="https://github.com/cerejo2/MAS-Project">github.com/cerejo2/MAS-Project</a>'],
    },
    oficina: {
      pt: ['Oficina: base de dados de uma oficina automóvel', 'SQL Server · T-SQL · draw.io · Fundamentos de Bases de Dados · a decorrer',
        'Projeto de par: do DER ao DDL, em 13 tabelas. <b>Decisões:</b> o histórico pertence à viatura e não ao dono; a fatura copia os preços e o IVA para nunca mudar. <b>Falta:</b> triggers e stored procedures.',
        'DER, esquema relacional e SQL a pedido'],
      en: ['Garage: database for a car repair garage', 'SQL Server · T-SQL · draw.io · Database Fundamentals · in progress',
        'Pair project: from the ER diagram to the DDL, in 13 tables. <b>Decisions:</b> repair history belongs to the vehicle, not its owner; an invoice copies prices and VAT so it never changes. <b>To do:</b> triggers and stored procedures.',
        'ER diagram, relational schema and SQL on request'],
    },
    sim: {
      pt: ['Simulador 3D de penetração de blindagem', 'Luau · Roblox Studio · Python · projeto pessoal · alfa',
        'Um projétil perfura até quatro placas, com balística por raycast (espessura efetiva = espessura ÷ cos θ). <b>Como trabalho:</b> defino os requisitos e testo; o código é escrito com Claude Code. Cada sessão acaba em algo jogável.',
        'demonstração a pedido · código assistido por IA'],
      en: ['3D armour penetration simulator', 'Luau · Roblox Studio · Python · personal project · alpha',
        'A projectile goes through up to four plates, with raycast ballistics (effective thickness = thickness ÷ cos θ). <b>How I work:</b> I write the requirements and test; the code is written with Claude Code. Every session ends in something playable.',
        'demo on request · AI-assisted code'],
    },
  };

  /* ------------------------------------------------------------------
     Estado da página
     ------------------------------------------------------------------ */
  const $ = (id) => document.getElementById(id);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sem armazenamento: segue sem guardar */ } },
  };

  let lang = new URLSearchParams(location.search).get('lang') || store.get('cv-lang')
    || ((navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en');
  if (!T[lang]) lang = 'pt';
  const L = () => (lang === 'pt' ? 0 : 1);

  let selected = 'vp';
  const counts = [0, 0];          // [estudante, programador]
  let last = null;                // último resultado: 0, 1, 'many' ou null

  /* ------------------------------------------------------------------
     Qubit: |ψ⟩ = Ry(θ)|0⟩ = cos(θ/2)|estudante⟩ + sin(θ/2)|programador⟩
     ------------------------------------------------------------------ */
  const THETA = 118 * Math.PI / 180;
  const P1 = Math.sin(THETA / 2) ** 2;                  // ≈ 0,735
  const measureOnce = () => (Math.random() < P1 ? 1 : 0);

  const POSE = {
    psi: 'rotate(-47deg) scaleY(.925)',   // superposição
    0: 'rotate(180deg)',                  // polo norte: |estudante⟩
    1: 'rotate(0deg)',                    // polo sul: |programador⟩
  };

  function renderLab() {
    const t = T[lang];
    $('state').style.transform = POSE[last === 0 || last === 1 ? last : 'psi'];
    $('north').classList.toggle('hit', last === 0);
    $('south').classList.toggle('hit', last === 1);

    const sp = $('superpos');
    sp.classList.toggle('collapsed', last === 0 || last === 1);
    sp.innerHTML = last === 0 ? `→ |${t.ketA}⟩`
      : last === 1 ? `→ |${t.ketB}⟩`
      : `= <i>α</i>|${t.ketA}⟩ + <i>β</i>|${t.ketB}⟩`;

    const total = counts[0] + counts[1];
    $('outcome').innerHTML = last === null ? t.idle
      : last === 'many' ? t.many(total, Math.round(100 * counts[1] / total))
      : last === 1 ? t.got1 : t.got0;

    $('n0').textContent = counts[0];
    $('n1').textContent = counts[1];
    $('bar0').style.width = total ? `${100 * counts[0] / total}%` : '0';
    $('bar1').style.width = total ? `${100 * counts[1] / total}%` : '0';
  }

  $('measure').addEventListener('click', () => {
    last = measureOnce();
    counts[last] += 1;
    renderLab();
  });

  $('shots').addEventListener('click', () => {
    for (let i = 0; i < 100; i += 1) counts[measureOnce()] += 1;
    last = 'many';
    renderLab();
  });

  $('reset').addEventListener('click', () => {
    counts[0] = 0; counts[1] = 0; last = null;
    renderLab();
  });

  /* ------------------------------------------------------------------
     Circuito: desenho + painel de detalhe
     ------------------------------------------------------------------ */
  const gateHTML = (ids, live) => (ids.length
    ? `<span class="gate${live ? ' live' : ''}">${ids.map((id) => {
      const c = COURSES[id];
      return `<button type="button" data-id="${c[2]}">${c[L()]}</button>`;
    }).join('')}</span>`
    : '');

  function renderCircuit() {
    const t = T[lang];
    const head = COLS[lang].map(([year, sem], i) => (i === 3
      ? `<div class="t now">${year}<b>${sem}</b><span class="live-pill"><i></i>${t.live}</span></div>`
      : `<div class="t">${year}<b>${sem}</b></div>`)).join('');

    const rows = ROWS.map((r, n) => `
      <div class="c-row wire s${r.start}">
        <div class="label"><span class="q">q${n}</span><span class="name">${r.name[L()]}</span><span class="desc">${r.desc[L()]}</span></div>
        ${r.cells.map((ids, col) => `<div class="cell">${gateHTML(ids, col === 3)}</div>`).join('')}
        <div></div>
      </div>`).join('');

    $('circuit').innerHTML = `
      <div class="circuit">
        <div class="now-band"></div>
        <div class="c-row c-head"><div class="axis-label">${t.axis}</div>${head}<div></div></div>
        ${rows}
        <div class="measure" aria-hidden="true">
          <svg viewBox="0 0 24 18"><path d="M3 15 A9 9 0 0 1 21 15"/><line x1="12" y1="15" x2="18.5" y2="5"/></svg>
          <span class="v">${t.next}</span>
        </div>
      </div>
      <div class="legend">
        <span><i class="sw"></i>${t.lgDone}</span>
        <span class="live-txt"><i class="sw live"></i>${t.lgLive}</span>
        <span><i class="ln"></i>${t.lgBefore}</span>
      </div>`;
  }

  function renderDetail() {
    const [title, meta, text, proof] = DETAILS[selected][lang];
    $('dTitle').textContent = title;
    $('dMeta').textContent = meta;
    $('dText').innerHTML = text;
    $('dProof').innerHTML = proof ? `${T[lang].proof}: ${proof}` : '';
    document.querySelectorAll('#circuit [data-id], .projs [data-id]').forEach((b) => {
      const on = b.dataset.id === selected;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('#circuit [data-id], .projs [data-id]');
    if (!b) return;
    selected = b.dataset.id;
    renderDetail();
  });

  /* ------------------------------------------------------------------
     Língua
     ------------------------------------------------------------------ */
  function renderText() {
    const t = T[lang];
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
    document.querySelectorAll('[data-t]').forEach((el) => {
      const v = t[el.dataset.t];
      if (typeof v === 'string') el.innerHTML = v;
    });
    $('pdf').href = t.pdfHref;
    $('lang').textContent = t.other;
    $('lang').setAttribute('aria-label', t.otherLabel);
    renderLab();
    renderCircuit();
    renderDetail();
  }

  $('lang').addEventListener('click', () => {
    lang = lang === 'pt' ? 'en' : 'pt';
    store.set('cv-lang', lang);
    renderText();
  });

  renderText();
})();

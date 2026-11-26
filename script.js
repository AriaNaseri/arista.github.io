(() => {
  // Sichtbare Grenzen in Originalpixeln: links, oben, rechts, unten.
  const crops = {
    'between-stillness-and-longing': [1179,1125,24,6,1155,1102],
    'dancer-in-yellow': [960,1280,46,57,935,1214],
    'dance-in-red': [1280,960,55,65,1198,950],
    'black-horse-at-sunset': [960,1280,18,0,933,1280],
    'woman-in-gold': [960,1280,0,8,960,1262],
    'dance-in-blue': [960,1280,32,40,909,1239],
    'wolf-and-rose': [1280,960,0,0,1268,960],
    'behind-the-curtain': [1280,1278,0,0,1271,1269],
    'black-horse-study': [1280,960,4,0,1269,950],
    'portrait-in-a-hat': [720,1280,0,162,720,1280],
  };
  function applyCrop(container, slug) {
    const crop = crops[slug];
    if (!crop) return;
    const [w,h,l,t,r,b] = crop, cw=r-l, ch=b-t;
    container.classList.add('artwork-crop');
    for (const [key,value] of Object.entries({
      '--art-ratio': String(cw/ch), '--art-width': `${w/cw*100}%`,
      '--art-height': `${h/ch*100}%`, '--art-left': `${-l/cw*100}%`,
      '--art-top': `${-t/ch*100}%`,
    })) container.style.setProperty(key,value);
  }
  document.querySelectorAll('[data-artwork]').forEach(link => applyCrop(link,link.dataset.artwork));

  const dialog = document.querySelector('#artwork-viewer');
  const cards = [...document.querySelectorAll('.work-card')];
  const links = [...document.querySelectorAll('[data-artwork]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const image = document.querySelector('#viewer-image');
  const viewerCrop = document.createElement('div');
  viewerCrop.className = 'viewer-crop';
  image.replaceWith(viewerCrop);
  viewerCrop.append(image);
  const title = document.querySelector('#viewer-title');
  const description = document.querySelector('#viewer-description');
  const category = document.querySelector('#viewer-category');
  const counter = document.querySelector('#viewer-counter');
  const artworks = cards.map(card => {
    const link = card.querySelector('[data-artwork]');
    const thumbnail = link.querySelector('img');
    return {
      slug: link.dataset.artwork,
      src: link.getAttribute('href'),
      title: card.querySelector('h3').textContent,
      description: thumbnail.alt,
      thought: card.querySelector('.work-thought')?.textContent || '',
      dimensions: card.querySelector('.work-size')?.textContent || '',
      category: card.querySelector('.work-caption > span').textContent,
      card,
    };
  });
  const languages = window.ARISTA_TRANSLATIONS;
  let language = 'de';
  const words = () => languages[language].ui;
  const interpolate = (pattern, values) => pattern.replace(/\{(\w+)\}/g, (_, key) => String(values[key]));
  function updateStatus() {
    document.querySelector('#gallery-status').textContent = interpolate(words().status, {n:cards.filter(card => !card.hidden).length});
  }
  let collection = artworks;
  let current = 0;

  document.querySelector('.gallery-toolbar').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
    updateStatus();
  }));

  // Image links still work normally when native dialogs are unavailable.
  const supportsDialog = dialog && typeof dialog.showModal === 'function';

  function show(index) {
    current = (index + collection.length) % collection.length;
    const artwork = collection[current];
    applyCrop(viewerCrop, artwork.slug);
    image.src = artwork.src;
    image.alt = artwork.description;
    title.textContent = artwork.title;
    description.textContent = artwork.description + (artwork.thought ? '\n\n' + artwork.thought : '');
    const size = document.querySelector('#viewer-size');
    size.textContent = artwork.dimensions;
    size.hidden = !artwork.dimensions;
    const medium = document.querySelector('#viewer-medium');
    medium.textContent = artwork.medium || '';
    medium.hidden = !artwork.medium;
    document.querySelector('#viewer-year').textContent=artwork.year || '';
    document.querySelector('#viewer-availability').textContent=words().availability;
    const inquiry=document.querySelector('#viewer-inquiry');
    inquiry.textContent=words().inquiry;
    inquiry.href=artwork.inquiryHref;
    category.textContent = artwork.category;
    counter.textContent = interpolate(words().counter, {n:current+1,total:collection.length});
    const single = collection.length === 1;
    document.querySelector('#viewer-previous').hidden = single;
    document.querySelector('#viewer-next').hidden = single;
  }

  links.forEach(link => link.addEventListener('click', event => {
    if (!supportsDialog) return;
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const slug = link.dataset.artwork;
    collection = artworks.filter(artwork => !artwork.card.hidden);
    if (!collection.some(artwork => artwork.slug === slug)) collection = artworks;
    const index = collection.findIndex(artwork => artwork.slug === slug);
    if (index < 0) return;
    event.preventDefault();
    show(index);
    dialog.showModal();
    document.body.classList.add('viewer-open');
  }));

  document.querySelector('#viewer-close').addEventListener('click', () => dialog.close());
  document.querySelector('#viewer-previous').addEventListener('click', () => show(current - 1));
  document.querySelector('#viewer-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => document.body.classList.remove('viewer-open'));

  function changeLanguage(nextLanguage) {
    if (!languages[nextLanguage]) nextLanguage='de';
    language=nextLanguage;
    const u=words(), translated=languages[language].works;
    document.documentElement.lang=language==='zh'?'zh-Hans':language;
    document.documentElement.dir=language==='fa'?'rtl':'ltr';
    document.querySelector('#language-select').value=language;
    const fields={
      '#language-label':'language','.skip-link':'skip',
      '#contact-label':'contact',
      '.site-header nav a[href="#work"]':'work','.site-header nav a[href="#about"]':'about',
      '.hero-copy .eyebrow':'artist','#title':'hero','.intro':'intro',
      '.hero-copy .text-link':'explore','.hero-note span:first-child':'selection',
      '.hero-note span:last-child':'genre','.hero-artwork figcaption span:last-child':'featured',
      '#work > .eyebrow':'reading','#work-title':'journey','.section-heading > p':'journeyIntro',
      '#about .eyebrow':'behind','#about-title':'expression',
      '.about-copy p:first-child':'about1','.about-copy p:nth-child(2)':'about2',
      '.about-copy .text-link':'returnTo','footer > span':'artist','footer a[href="#main"]':'back',
      '#viewer-close':'close','#viewer-previous':'previous','#viewer-next':'next','.viewer-help':'help',
    };
    for (const [selector,key] of Object.entries(fields)) {
      const node=document.querySelector(selector); if(node)node.textContent=u[key];
    }
    document.querySelector('.site-header nav').setAttribute('aria-label',u.work);
    document.querySelector('.filters').setAttribute('aria-label',u.work);
    document.querySelector('.site-header .wordmark').setAttribute('aria-label','Arista');
    for (const [filter,key] of [['all','all'],['painting','paintings'],['drawing','drawings']]) {
      const button=document.querySelector(`[data-filter="${filter}"]`);
      const n=filter==='all'?cards.length:cards.filter(c=>c.dataset.category===filter).length;
      button.replaceChildren(document.createTextNode(u[key]+' '));
      const count=document.createElement('span');count.textContent=n;button.append(count);
    }
    artworks.forEach((art,index)=>{
      const v=translated[art.slug], card=art.card;
      art.title=v.title;art.description=v.description;
      art.thought=v.theme+' — '+v.thought;
      art.category=card.dataset.category==='drawing'?u.drawing:u.painting;
      card.querySelector('h3').textContent=v.title;
      card.querySelector('.work-caption > span').textContent=art.category;
      card.querySelector('.work-description').textContent=v.description;
      const thought=card.querySelector('.work-thought');
      const label=document.createElement('span');label.textContent=String(index+1).padStart(2,'0')+' · '+v.theme;
      thought.replaceChildren(label,document.createTextNode(v.thought));
      const size=card.querySelector('.work-size');
      if(size){
        if(!size.dataset.measurement)size.dataset.measurement=size.textContent.match(/\d+\s*×\s*\d+/)?.[0]||'';
        size.textContent=u.size+': '+size.dataset.measurement+' '+u.cm;
      }
      art.dimensions=size?.textContent||'';
      card.querySelector('.work-availability').textContent=u.availability;
      const inquiry=card.querySelector('.work-inquiry');
      inquiry.textContent=u.inquiry;
      inquiry.setAttribute('aria-label',u.inquiry+': '+v.title);
      art.inquiryHref='mailto:aria.naseri92@outlook.com?subject='+encodeURIComponent(u.inquirySubject+': '+v.title);
      inquiry.href=art.inquiryHref;
      const year=card.querySelector('.work-year');
      art.year=year ? u.year+': '+(year.dataset.approximate==='true'?u.approximate:'')+year.dataset.year : '';
      if(year)year.textContent=art.year;
      const medium=card.querySelector('.work-medium');
      art.medium=medium ? u.medium+': '+u[card.dataset.medium] : '';
      if(medium)medium.textContent=art.medium;
      document.querySelectorAll(`[data-artwork="${art.slug}"]`).forEach(link=>{
        link.setAttribute('aria-label',u.view+': '+v.title);
        link.querySelector('img').alt=v.description;
        const action=link.querySelector('.image-action');if(action)action.textContent=u.view;
      });
    });
    document.querySelector('.hero-artwork figcaption span:first-child').textContent=translated[document.querySelector('.hero-artwork [data-artwork]').dataset.artwork].title;
    document.querySelector('.artist-portrait img').alt=u.portraitAlt;
    document.querySelector('.artist-portrait figcaption').textContent=u.expression;
    document.title='Arista · '+u.artist;
    document.querySelector('meta[name="description"]').content=u.artist+'. '+u.journeyIntro;
    updateStatus();
    if(dialog.open)show(current);
    try{localStorage.setItem('arista-language',language);}catch{}
  }
  document.querySelector('#language-select').addEventListener('change',event=>changeLanguage(event.target.value));
  let initial='de';
  try{initial=localStorage.getItem('arista-language')||'de';}catch{}
  changeLanguage(initial);

})();

(() => {
  const dialog = document.querySelector('#artwork-viewer');
  const cards = [...document.querySelectorAll('.work-card')];
  const links = [...document.querySelectorAll('[data-artwork]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const image = document.querySelector('#viewer-image');
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
      category: card.querySelector('.work-caption > span').textContent,
      card,
    };
  });
  let collection = artworks;
  let current = 0;

  document.querySelector('.gallery-toolbar').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
    const visible = cards.filter(card => !card.hidden).length;
    document.querySelector('#gallery-status').textContent = filter === 'all'
      ? `Showing all ${visible} works`
      : `Showing ${visible} ${filter}${visible === 1 ? '' : 's'}`;
  }));

  // Image links still work normally when native dialogs are unavailable.
  if (!dialog || typeof dialog.showModal !== 'function') return;

  function show(index) {
    current = (index + collection.length) % collection.length;
    const artwork = collection[current];
    image.src = artwork.src;
    image.alt = artwork.description;
    title.textContent = artwork.title;
    description.textContent = artwork.description;
    category.textContent = artwork.category;
    counter.textContent = `${current + 1} of ${collection.length}`;
    const single = collection.length === 1;
    document.querySelector('#viewer-previous').hidden = single;
    document.querySelector('#viewer-next').hidden = single;
  }

  links.forEach(link => link.addEventListener('click', event => {
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
})();

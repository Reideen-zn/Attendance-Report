document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const buttons = document.querySelectorAll('.sidebar-btn');

  // Определяем текущую страницу
  function getCurrentPage(){
    const path = window.location.pathname;
    if(path === '/' || path === '/index.html') return 'home';
    const match = path.match(/\/pages\/(.+)\.html/);
    return match ? match[1] : null;
  }

  // Отмечаем активную кнопку
  function markActivePage(){
    const currentPage = getCurrentPage();
    buttons.forEach(btn => {
      const target = btn.dataset.target;
      if(target === currentPage){
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  markActivePage();

  function openSidebar(){
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    overlay.hidden = false;
    sidebar.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    buttons[0]?.focus();
  }

  function closeSidebar(){
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    setTimeout(()=> overlay.hidden = true, 320);
    sidebar.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('open');
    if(isOpen) closeSidebar(); else openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = btn.getAttribute('href');
      if(href){
        closeSidebar();
        setTimeout(() => window.location.href = href, 320);
      }
    });
  });
});

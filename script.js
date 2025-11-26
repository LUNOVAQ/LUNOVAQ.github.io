// ========================================
// MAIN JAVASCRIPT - ก่อนชัตเตอร์สุดท้าย
// ========================================

// === HEADER SCROLL EFFECT ===
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// === MOBILE MENU TOGGLE ===
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (nav && menuToggle) {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  }
});

// === FADE IN ON SCROLL ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// === SEARCH FUNCTIONALITY ===
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}

function performSearch() {
  const query = searchInput.value.trim();
  if (query) {
    // Redirect to search results page
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  }
}

// === SCROLL TO TOP BUTTON ===
// Create scroll to top button
const scrollTopBtn = document.createElement('div');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

// Scroll to top on click
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// === ACTIVE NAV LINK ===
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Set active nav link on page load
setActiveNavLink();

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});

// === LAZY LOAD IMAGES ===
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// === READING PROGRESS BAR (for blog posts) ===
function createReadingProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: ${getComputedStyle(document.documentElement).getPropertyValue('--header-height')};
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #f4d03f, #fbbf24);
    z-index: 9999;
    transition: width 0.1s ease-out;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

// Add reading progress bar if on a blog post page
if (document.querySelector('.post-content')) {
  createReadingProgressBar();
}

// === CATEGORY FILTER (for blog page) ===
function filterPosts(category) {
  const posts = document.querySelectorAll('.card');
  
  posts.forEach(post => {
    if (category === 'all') {
      post.style.display = 'block';
      setTimeout(() => post.classList.add('visible'), 10);
    } else {
      const postCategory = post.querySelector('.card-category').textContent.toLowerCase();
      if (postCategory.includes(category.toLowerCase())) {
        post.style.display = 'block';
        setTimeout(() => post.classList.add('visible'), 10);
      } else {
        post.style.display = 'none';
      }
    }
  });
}

// === SIDEBAR TOGGLE (Mobile) ===
function createSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 768) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-secondary';
    toggleBtn.style.cssText = `
      position: fixed;
      right: 20px;
      top: 100px;
      z-index: 99;
    `;
    toggleBtn.innerHTML = '📂 หมวดหมู่';
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }
}

// Initialize sidebar toggle on mobile
if (window.innerWidth <= 768) {
  createSidebarToggle();
}

// === COPY CODE BUTTON (for code blocks) ===
document.querySelectorAll('pre code').forEach(block => {
  const button = document.createElement('button');
  button.className = 'btn btn-secondary';
  button.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  `;
  button.textContent = 'Copy';
  
  const pre = block.parentElement;
  pre.style.position = 'relative';
  pre.appendChild(button);
  
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(block.textContent);
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  });
});

// === CONSOLE MESSAGE ===
console.log('%cก่อนชัตเตอร์สุดท้าย', 'font-size: 24px; font-weight: bold; color: #f4d03f;');
console.log('%cเก็บทุกวินาทีที่น่าเสียดายถ้าปล่อยให้มันผ่านไป', 'font-size: 14px; color: #9ca3af;');
console.log('%c🎬 Created by Kuro / Orca Re', 'font-size: 12px; color: #6366f1;');

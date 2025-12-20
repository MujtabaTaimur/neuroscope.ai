/*
 * NeuroScope Auth (Static)
 *
 * GitHub Pages cannot run a backend server. This implements a local-only username/password
 * gate using PBKDF2 in the browser (Web Crypto). It is not real security.
 *
 * Configure users in `Integration/auth-config.js` (window.NS_AUTH_USERS).
 */

(function () {
  const STORAGE_KEY = 'ns_auth_static_v1';

  function toB64(bytes) {
    const arr = new Uint8Array(bytes);
    let str = '';
    for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
    return btoa(str);
  }

  function fromB64(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function pbkdf2Sha256(password, saltBytes, iterations) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    return new Uint8Array(bits);
  }

  function timingSafeEqualBytes(a, b) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  }

  function getUsers() {
    return Array.isArray(window.NS_AUTH_USERS) ? window.NS_AUTH_USERS : [];
  }

  function getPagePaths() {
    const p = window.location.pathname;
    // Root pages (index.html or /)
    if (!p.includes('/Pages/')) {
      return { login: 'Pages/Login.html', profile: 'Pages/Profile.html' };
    }

    // Blog detail pages: /Pages/Blog/*.html
    if (p.includes('/Pages/Blog/')) {
      return { login: '../Login.html', profile: '../Profile.html' };
    }

    // Other Pages/*.html
    return { login: 'Login.html', profile: 'Profile.html' };
  }

  function loadAuth() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.user) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveAuth({ user }) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        updated_at: new Date().toISOString()
      })
    );
  }

  function clearAuth() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function ensureInjectedStyles() {
    if (document.getElementById('ns-auth-styles')) return;

    const style = document.createElement('style');
    style.id = 'ns-auth-styles';
    style.textContent = `
      .ns-auth {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .ns-auth__login {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: var(--ns-auth-cta-padding, 0.5rem 1.5rem);
        border-radius: var(--ns-auth-cta-radius, 0.5rem);
        text-decoration: none;
        font-weight: var(--ns-auth-cta-font-weight, 600);
        color: var(--ns-auth-cta-color, white);
        background: var(--ns-auth-cta-bg, rgba(255, 255, 255, 0.06));
        border: var(--ns-auth-cta-border, none);
        transition: opacity 0.2s ease, transform 0.2s ease;
        white-space: nowrap;
      }
      .ns-auth__login:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      .ns-auth__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: var(--ns-auth-cta-bg, rgba(255, 255, 255, 0.06));
        border: var(--ns-auth-cta-border, none);
        color: var(--ns-auth-cta-color, white);
        padding: var(--ns-auth-cta-padding, 0.5rem 1.5rem);
        border-radius: var(--ns-auth-cta-radius, 0.5rem);
        cursor: pointer;
        transition: opacity 0.2s ease, transform 0.2s ease;
        font-weight: var(--ns-auth-cta-font-weight, 600);
      }
      .ns-auth__btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      .ns-auth__avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .ns-auth__name {
        max-width: 10rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ns-auth__menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        min-width: 220px;
        border-radius: 1rem;
        background: rgba(15, 15, 20, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(16px);
        padding: 0.5rem;
        box-shadow: 0 16px 50px rgba(0,0,0,0.45);
        display: none;
        z-index: 9999;
      }
      .ns-auth__menu.open { display: block; }
      .ns-auth__menu a,
      .ns-auth__menu button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.75rem 0.75rem;
        border-radius: 0.75rem;
        border: none;
        background: transparent;
        cursor: pointer;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.92);
        font-weight: 600;
        font-family: inherit;
        text-align: left;
      }
      .ns-auth__menu a:hover,
      .ns-auth__menu button:hover {
        background: rgba(255, 255, 255, 0.06);
      }
      .ns-auth__meta {
        padding: 0.75rem 0.75rem 0.5rem;
        color: rgba(255, 255, 255, 0.65);
        font-size: 0.85rem;
      }
      .ns-auth__meta strong { color: rgba(255, 255, 255, 0.92); }
    `;
    document.head.appendChild(style);
  }

  function getSlot() {
    return (
      document.getElementById('ns-auth') ||
      document.getElementById('ns-auth-slot') ||
      document.querySelector('[data-ns-auth-slot]')
    );
  }

  function closeMenusExcept() {
    document.querySelectorAll('.ns-auth__menu.open').forEach((el) => el.classList.remove('open'));
  }

  function renderNavbar() {
    const slot = getSlot();
    if (!slot) return;

    ensureInjectedStyles();
    const paths = getPagePaths();

    const auth = loadAuth();
    const user = auth && auth.user;

    if (!user) {
      slot.innerHTML = `<div class="ns-auth"><a class="ns-auth__login" href="${paths.login}">Sign in</a></div>`;
      return;
    }

    const name = user.username || 'Account';
    const role = user.role || '';

    slot.innerHTML = `
      <div class="ns-auth" id="ns-auth-root" style="display:inline-flex; align-items:center;">
        <button class="ns-auth__btn" type="button" id="ns-auth-btn" aria-haspopup="menu" aria-expanded="false">
          <span class="ns-auth__name">${name}</span>
        </button>
        <div class="ns-auth__menu" id="ns-auth-menu" role="menu" aria-label="Profile menu">
          <div class="ns-auth__meta"><strong>${name}</strong><div>${role}</div></div>
          <a role="menuitem" href="${paths.profile}">Profile</a>
          <button role="menuitem" type="button" id="ns-auth-logout">Sign out</button>
        </div>
      </div>
    `;

    const btn = document.getElementById('ns-auth-btn');
    const menu = document.getElementById('ns-auth-menu');
    const logout = document.getElementById('ns-auth-logout');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      closeMenusExcept();
      menu.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    logout.addEventListener('click', () => {
      clearAuth();
      renderNavbar();

      const here = window.location.href;
      // If we're on the profile page, send to home.
      if (here.includes('Profile.html')) {
        window.location.href = window.location.href.includes('/Pages/') ? '../index.html' : 'index.html';
      }
    });

    // Close menu on outside click.
    window.addEventListener('click', () => {
      closeMenusExcept();
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  async function login(username, password) {
    const users = getUsers();
    if (!users.length) {
      throw new Error('Auth is not configured. Edit Integration/auth-config.js.');
    }

    const record = users.find((u) => String(u.username) === String(username));
    if (!record) {
      throw new Error('Invalid credentials');
    }

    const iterations = Number(record.iterations || 0);
    const saltB64 = String(record.salt_b64 || '');
    const hashB64 = String(record.hash_b64 || '');

    if (!iterations || !saltB64 || !hashB64) {
      throw new Error('Invalid user record configuration');
    }

    const derived = await pbkdf2Sha256(password, fromB64(saltB64), iterations);
    const expected = fromB64(hashB64);

    if (!timingSafeEqualBytes(derived, expected)) {
      throw new Error('Invalid credentials');
    }

    const user = { username: record.username, role: record.role || '' };
    saveAuth({ user });
    renderNavbar();

    return { user };
  }

  function requireAuthOrRedirect() {
    const auth = loadAuth();
    if (auth && auth.user) return auth;

    const paths = getPagePaths();
    const next = encodeURIComponent(window.location.href);
    window.location.href = `${paths.login}?next=${next}`;
    return null;
  }

  async function makeUserRecord(username, password, role = '') {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 200000;
    const derived = await pbkdf2Sha256(password, salt, iterations);

    return {
      username,
      role,
      iterations,
      salt_b64: toB64(salt),
      hash_b64: toB64(derived)
    };
  }

  // Public API
  window.NeuroScopeAuth = {
    renderNavbar,
    requireAuthOrRedirect,
    getAuth: loadAuth,
    clearAuth,
    login,
    dev: {
      makeUserRecord
    }
  };

  // Auto-bootstrap
  document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
  });
})();

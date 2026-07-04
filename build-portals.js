/**
 * build-portals.js
 * Creates two self-contained portal folders from the existing project.
 * Original files are NEVER modified.
 *
 * Usage: node build-portals.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT        = __dirname;
const ADMIN_DIR   = path.join(ROOT, 'admin-portal');
const USER_DIR    = path.join(ROOT, 'user-portal');

// ─── File lists ──────────────────────────────────────────────────────────────

const ADMIN_HTML = [
  'admin.html',
  'admin-settings.html',
  'admin-security.html',
  'forgot-password.html',
  'login.html',
  'setup-totp.html',
  'privacy-policy.html',
  'terms.html',
];

const USER_HTML = [
  'user-dashboard.html',
  'user-settings.html',
  'equipment.html',
  'concerns.html',
  'court-scheduling.html',
  'home.html',
  'index.html',
  'login.html',
  'setup-totp.html',
  'privacy-policy.html',
  'terms.html',
];

const SHARED_ASSETS = ['brgy.png', 'barangay-sun-logo.jpg'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mkdir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) { console.warn(`  SKIP (not found): ${src}`); return; }
  fs.copyFileSync(src, dest);
  console.log(`  COPY ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) { console.warn(`  SKIP dir (not found): ${srcDir}`); return; }
  mkdir(destDir);
  fs.readdirSync(srcDir).forEach(file => {
    const s = path.join(srcDir, file);
    const d = path.join(destDir, file);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  });
  console.log(`  COPY dir ${path.relative(ROOT, srcDir)}/ → ${path.relative(ROOT, destDir)}/`);
}

/**
 * Inject portal-config.js (before app.js) and portal-overrides.js (after app.js)
 * into an HTML file string. Returns the modified HTML.
 */
function injectPortalScripts(html) {
  // Before app.js
  html = html.replace(
    /<script\s+src="js\/app\.js"><\/script>/,
    `<script src="js/portal-config.js"></script>\n        <script src="js/app.js"></script>`
  );
  // After app.js  (replace again now that it's already updated)
  html = html.replace(
    /<script src="js\/portal-config\.js"><\/script>\n        <script src="js\/app\.js"><\/script>/,
    `<script src="js/portal-config.js"></script>\n        <script src="js/app.js"></script>\n        <script src="js/portal-overrides.js"></script>`
  );
  return html;
}

function processHtml(srcFile, destFile) {
  if (!fs.existsSync(srcFile)) { console.warn(`  SKIP HTML (not found): ${srcFile}`); return; }
  let html = fs.readFileSync(srcFile, 'utf8');
  html = injectPortalScripts(html);
  fs.writeFileSync(destFile, html, 'utf8');
  console.log(`  PROCESS ${path.relative(ROOT, srcFile)} → ${path.relative(ROOT, destFile)}`);
}

// ─── Portal-specific content ─────────────────────────────────────────────────

function writePortalConfig(destDir, portalType, crossSiteUrl) {
  const content = `/**
 * portal-config.js — ${portalType} portal
 * Update CROSS_SITE_URL after your first Vercel deployment.
 * This file is loaded BEFORE app.js so the overrides can reference these globals.
 */
window.__PORTAL__          = '${portalType}';
window.__ADMIN_PORTAL_URL__ = ${portalType === 'admin' ? "''" : `'${crossSiteUrl}'`};
window.__USER_PORTAL_URL__  = ${portalType === 'user'  ? "''" : `'${crossSiteUrl}'`};
`;
  fs.writeFileSync(path.join(destDir, 'js', 'portal-config.js'), content, 'utf8');
  console.log(`  WRITE js/portal-config.js (${portalType})`);
}

function writePortalOverrides(destDir) {
  const content = `/**
 * portal-overrides.js
 * Loaded AFTER app.js — patches cross-site redirect functions.
 * No need to edit this file; update portal-config.js with the correct URLs.
 */
(function () {
    var adminBase = (window.__ADMIN_PORTAL_URL__ || '').replace(/\\/$/, '');
    var userBase  = (window.__USER_PORTAL_URL__  || '').replace(/\\/$/, '');

    // Patch: redirectToDashboard
    window.redirectToDashboard = function () {
        var user = getCurrentUser();
        if (!user) { window.location.href = 'login.html'; return; }
        if (user.role === 'admin') {
            window.location.href = adminBase ? adminBase + '/admin.html' : 'admin.html';
        } else {
            window.location.href = userBase ? userBase + '/user-dashboard.html' : 'user-dashboard.html';
        }
    };

    // Patch: requireAdmin — redirect regular users to user portal
    window.requireAdmin = function () {
        var user = getCurrentUser();
        if (!user) { window.location.replace('login.html'); return false; }
        if (user.role !== 'admin') {
            window.location.replace(userBase ? userBase + '/login.html' : 'login.html');
            return false;
        }
        return true;
    };

    // Patch: requireUser — redirect admins to admin portal
    window.requireUser = function () {
        var user = getCurrentUser();
        if (!user) { window.location.replace('login.html'); return false; }
        if (user.role === 'admin') {
            window.location.replace(adminBase ? adminBase + '/admin.html' : 'admin.html');
            return false;
        }
        return true;
    };

    // Patch: logoutUser — always land on login of current portal
    window.logoutUser = async function () {
        var _curr = getCurrentUser();
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
        try {
            if (_curr) window.logSecurity('Logout', 'N/A', 'info', (_curr.username || 'User') + ' logged out', _curr.username || null);
            if (window.supabase) window.supabase.auth.signOut().catch(function(){});
        } catch(e) {}
    };
})();
`;
  fs.writeFileSync(path.join(destDir, 'js', 'portal-overrides.js'), content, 'utf8');
  console.log(`  WRITE js/portal-overrides.js`);
}

function writeVercelJson(destDir, portalName) {
  const config = {
    "name": `barangay-sta-lucia-${portalName}`,
    "rewrites": [{ "source": "/(.*)", "destination": "/$1" }],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ]
  };
  fs.writeFileSync(path.join(destDir, 'vercel.json'), JSON.stringify(config, null, 2), 'utf8');
  console.log(`  WRITE vercel.json (${portalName})`);
}

// Admin portal: index.html — redirect based on auth state
function writeAdminIndex(destDir) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Barangay Sta. Lucia — Admin</title>
  <style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#0f172a;color:#94a3b8;}</style>
</head>
<body>
  <p>Redirecting...</p>
  <script>
    (function(){
      try {
        var u = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
        var user = u ? JSON.parse(u) : null;
        if (user && user.role === 'admin') {
          window.location.replace('admin.html');
        } else {
          window.location.replace('login.html');
        }
      } catch(e) {
        window.location.replace('login.html');
      }
    })();
  </script>
</body>
</html>`;
  fs.writeFileSync(path.join(destDir, 'index.html'), html, 'utf8');
  console.log(`  WRITE index.html (admin portal gate)`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function buildPortal(portalDir, htmlFiles, portalType, crossSiteUrl, isAdmin) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Building ${portalType.toUpperCase()} portal → ${path.relative(ROOT, portalDir)}/`);
  console.log('='.repeat(60));

  mkdir(portalDir);
  mkdir(path.join(portalDir, 'js'));
  mkdir(path.join(portalDir, 'css'));

  // Copy shared assets
  SHARED_ASSETS.forEach(asset => copyFile(path.join(ROOT, asset), path.join(portalDir, asset)));

  // Copy JS folder (excluding xlsx to save space is optional — keep it for full compat)
  copyDir(path.join(ROOT, 'js'), path.join(portalDir, 'js'));

  // Copy CSS folder
  copyDir(path.join(ROOT, 'css'), path.join(portalDir, 'css'));

  // Write portal-specific config
  writePortalConfig(portalDir, portalType, crossSiteUrl);
  writePortalOverrides(portalDir);
  writeVercelJson(portalDir, portalType);

  // Process HTML files (inject portal scripts)
  if (isAdmin) {
    // Admin portal gets a custom index.html gate
    writeAdminIndex(portalDir);
    htmlFiles.forEach(file => {
      if (file === 'index.html') return; // skip — we wrote custom one above
      processHtml(path.join(ROOT, file), path.join(portalDir, file));
    });
  } else {
    htmlFiles.forEach(file => {
      processHtml(path.join(ROOT, file), path.join(portalDir, file));
    });
  }

  console.log(`\n✅ ${portalType.toUpperCase()} portal built at: ${portalDir}`);
}

// ─── Run ─────────────────────────────────────────────────────────────────────
// Placeholder URLs — update these after first Vercel deployment
const ADMIN_PLACEHOLDER = 'https://barangay-sta-lucia-admin.vercel.app';
const USER_PLACEHOLDER  = 'https://barangay-sta-lucia-user.vercel.app';

buildPortal(ADMIN_DIR, ADMIN_HTML, 'admin', USER_PLACEHOLDER,  true);
buildPortal(USER_DIR,  USER_HTML,  'user',  ADMIN_PLACEHOLDER, false);

console.log('\n🎉 Both portals built successfully!');
console.log('\nNext steps:');
console.log('  1. Commit and push admin-portal/ and user-portal/ to GitHub');
console.log('  2. On Vercel → New Project → Import repo → set Root Directory to "admin-portal"');
console.log('  3. On Vercel → New Project → Import same repo → set Root Directory to "user-portal"');
console.log('  4. After deploy, copy the two Vercel URLs');
console.log('  5. Update admin-portal/js/portal-config.js  __USER_PORTAL_URL__  with the user portal URL');
console.log('  6. Update user-portal/js/portal-config.js   __ADMIN_PORTAL_URL__ with the admin portal URL');
console.log('  7. Commit & push again — Vercel auto-redeploys');

const fs = require('fs');

const adminHtmlPaths = ['admin.html', 'admin-portal/admin.html'];

for (const path of adminHtmlPaths) {
    if (!fs.existsSync(path)) continue;
    let content = fs.readFileSync(path, 'utf8');

    const syncHandlerStr = `if (typeof loadConcerns === 'function') await loadConcerns();
                            if (typeof loadAdminNotifications === 'function') await loadAdminNotifications();`;

    const replacementStr = `if (typeof loadConcerns === 'function') await loadConcerns();
                            if (typeof loadAdminNotifications === 'function') await loadAdminNotifications();
                            if (typeof loadUsers === 'function') await loadUsers();
                            if (typeof refreshAdminBell === 'function') await refreshAdminBell();`;

    if (content.includes(syncHandlerStr)) {
        content = content.replace(syncHandlerStr, replacementStr);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Updated syncHandler in", path);
    }
}

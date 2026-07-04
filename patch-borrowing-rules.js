// Patch 1: Remove Borrowing Rules from admin-settings.html
// Patch 2: Fix borrow form in user-dashboard.html (scroll-to-agree, remove reminder)
// Patch 3: Add Borrowing Rules management to admin.html Equipment section
// Patch 4: Replace emoji icons in home.html with Bootstrap Icons

const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// PATCH 1: admin-settings.html
// ─────────────────────────────────────────────────────────────────────────────
{
    let s = fs.readFileSync('admin-portal/admin-settings.html', 'utf8').replace(/\r\n/g, '\n');
    let changes = 0;

    function rep(old, neu) {
        const idx = s.indexOf(old);
        if (idx === -1) { console.log('[settings] MISS:', JSON.stringify(old.substring(0, 70))); return; }
        s = s.substring(0, idx) + neu + s.substring(idx + old.length);
        changes++;
    }

    // Remove sidebar Borrowing Rules button
    rep(
        `\n                <button class="nav-item" onclick="showSection('borrowing-rules')" id="borrowingRulesBtn">\n                    <i class="bi bi-journal-text"></i> Borrowing Rules\n                </button>`,
        ''
    );

    // Remove mobile tab for borrowing-rules
    rep(
        `\n        <button class="mobile-section-tab"\n            onclick="showSection('borrowing-rules'); document.querySelectorAll('.mobile-section-tab').forEach(t=>t.classList.remove('active')); this.classList.add('active');"><i class="bi bi-journal-text"></i>\n            Rules</button>`,
        ''
    );

    // Remove borrowing-rules section HTML (start to closing </div>)
    const sectionStart = s.indexOf('<div id="borrowing-rules-section"');
    const sectionEnd = 44312; // calculated previously — find dynamically
    // Recalculate sectionEnd dynamically
    let depth = 0;
    let sEnd = -1;
    for (let i = sectionStart; i < s.length - 5; i++) {
        if (s.substring(i, i+4) === '<div') depth++;
        else if (s.substring(i, i+6) === '</div>') {
            depth--;
            if (depth === 0) { sEnd = i + 6; break; }
        }
    }
    if (sectionStart !== -1 && sEnd !== -1) {
        s = s.substring(0, sectionStart) + s.substring(sEnd);
        changes++;
        console.log('[settings] Removed borrowing-rules-section HTML');
    } else {
        console.log('[settings] MISS: borrowing-rules-section HTML');
    }

    // Update showSection JS: remove 'borrowing-rules' from array
    rep(
        `['profile', 'security', 'system', 'borrowing-rules'].forEach(s => {`,
        `['profile', 'security', 'system'].forEach(s => {`
    );
    // Remove special btnId case for borrowing-rules
    rep(
        `\n                const btnId = s === 'borrowing-rules' ? 'borrowingRulesBtn' : s + 'Btn';`,
        `\n                const btnId = s + 'Btn';`
    );
    // Remove loadBorrowingRules() call
    rep(
        `\n            if (section === 'borrowing-rules') loadBorrowingRules();`,
        ''
    );

    // Remove all borrowing rules JS functions block
    rep(
        `// ── BORROWING RULES ─────────────────────────────────────────\n        const _LS_RULES = 'brgy_borrowing_rules';\n\n        function _getRules() {\n            try { return JSON.parse(localStorage.getItem(_LS_RULES)) || []; } catch(e) { return []; }\n        }\n        function _storeRules(rules) {\n            localStorage.setItem(_LS_RULES, JSON.stringify(rules));\n        }\n        function _escR(s) {\n            return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');\n        }`,
        ''
    );

    // Remove loadBorrowingRules, renderBorrowingRulesList, saveRule, editRule, cancelRuleEdit, deleteRule, _syncRules
    const rulesJsStart = s.indexOf('\n        async function loadBorrowingRules()');
    const rulesJsEnd = s.indexOf('        // ────────────────────────────────────────────────────────────\n\n    </script>');
    if (rulesJsStart !== -1 && rulesJsEnd !== -1) {
        s = s.substring(0, rulesJsStart) + '\n    </script>' + s.substring(rulesJsEnd + '        // ────────────────────────────────────────────────────────────\n\n    </script>'.length);
        changes++;
        console.log('[settings] Removed borrowing rules JS functions');
    } else {
        console.log('[settings] MISS: borrowing rules JS functions block');
    }

    // Replace emoji icons in hero sections
    rep('<div class="section-hero-icon">👤</div>', '<div class="section-hero-icon"><i class="bi bi-person-fill" style="font-size:20px;"></i></div>');
    rep('<div class="section-hero-icon">🔐</div>', '<div class="section-hero-icon"><i class="bi bi-shield-lock-fill" style="font-size:20px;"></i></div>');
    rep('<div class="section-hero-icon">📊</div>', '<div class="section-hero-icon"><i class="bi bi-bar-chart-fill" style="font-size:20px;"></i></div>');

    // Replace emoji in logout button
    rep('>🚪<span', '><i class="bi bi-box-arrow-right" style="font-size:15px;"></i><span');

    // Replace emoji in role badges (admin/resident labels in user table)
    rep(`\${isAdmin ? '🛡️ Admin' : '👤 Resident'}`, `\${isAdmin ? '<i class="bi bi-shield-fill"></i> Admin' : '<i class="bi bi-person-fill"></i> Resident'}`);

    // Replace toast icon emojis (in JS string) — keep as text since they're in JS textContent
    // These are set via icon.textContent so they're not HTML attr issues — replace with class change
    rep(
        `icon.textContent = '✅';\n                label.textContent = 'Google Authenticator is Active';`,
        `icon.className = 'bi bi-check-circle-fill'; icon.style.color='#16a34a'; icon.style.fontSize='24px';\n                label.textContent = 'Google Authenticator is Active';`
    );
    rep(
        `icon.textContent = '⚠️';\n                label.textContent = 'Google Authenticator is Not Enabled';`,
        `icon.className = 'bi bi-exclamation-triangle-fill'; icon.style.color='#d97706'; icon.style.fontSize='24px';\n                label.textContent = 'Google Authenticator is Not Enabled';`
    );
    // adminTotpIcon element — needs to be <i> or <span> for class change
    // It's rendered as textContent so className works if it's an element

    // Toast icons (keep as unicode since they're in JS strings shown in toast)
    // These are functional UI feedback — leave them or replace in the HTML template
    const toastIconIdx = s.indexOf("const icons = { success: '✅', error: '❌'");
    if (toastIconIdx !== -1) {
        s = s.substring(0, toastIconIdx) +
            `const icons = { success: '<i class="bi bi-check-circle-fill" style="color:#16a34a;"></i>', error: '<i class="bi bi-x-circle-fill" style="color:#dc2626;"></i>', info: '<i class="bi bi-info-circle-fill" style="color:#2563eb;"></i>' };` +
            s.substring(toastIconIdx + s.substring(toastIconIdx).indexOf('\n'));
        changes++;
        console.log('[settings] Updated toast icons');
    }

    fs.writeFileSync('admin-portal/admin-settings.html', s);
    console.log('[settings] Done.', changes, 'changes');
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH 2: user-dashboard.html — fix borrow form
// ─────────────────────────────────────────────────────────────────────────────
{
    let c = fs.readFileSync('user-portal/user-dashboard.html', 'utf8').replace(/\r\n/g, '\n');
    let changes = 0;

    function rep(old, neu) {
        const idx = c.indexOf(old);
        if (idx === -1) { console.log('[dashboard] MISS:', JSON.stringify(old.substring(0, 70))); return; }
        c = c.substring(0, idx) + neu + c.substring(idx + old.length);
        changes++;
    }

    // 1. Remove the red reminder banner
    rep(
        `<div class="mt-2 text-[11px] leading-relaxed text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-2.5 rounded-lg border border-red-200 dark:border-red-700 shadow-sm flex items-start gap-2">\n                            <span class="text-base leading-none">&#9888;&#65039;</span>\n                            <div>\n                                <strong>Reminder:</strong> If you break the item or equipment, you will pay or replace it.\n                            </div>\n                        </div>`,
        ''
    );

    // 2. Move borrowRulesSection to TOP of form (after hidden inputs, before <!-- User Info Fields -->)
    // First extract current section
    const rulesOld = `\n                        <!-- Borrowing Rules Agreement -->\n                        <div id="borrowRulesSection" style="display:none;margin-top:4px;">\n                            <div style="border:1px solid #D1D5DB;border-radius:10px;overflow:hidden;">\n                                <div style="background:#1A3A6B;padding:10px 14px;display:flex;align-items:center;gap:8px;">\n                                    <i class="bi bi-journal-text" style="color:#FDB913;font-size:13px;"></i>\n                                    <span style="font-size:13px;font-weight:700;color:#fff;">Borrowing Rules &amp; Policies</span>\n                                </div>\n                                <div id="borrowRulesListItems" style="padding:12px 14px;max-height:200px;overflow-y:auto;background:#F9FAFB;font-size:12px;color:#374151;line-height:1.6;"></div>\n                            </div>\n                            <label style="display:flex;align-items:flex-start;gap:10px;margin-top:10px;cursor:pointer;padding:11px 13px;background:#EEF2FF;border:1.5px solid #C7D2FE;border-radius:8px;">\n                                <input type="checkbox" id="borrowAgreeCheck" onchange="updateBorrowSubmitButton()" style="width:16px;height:16px;flex-shrink:0;margin-top:2px;accent-color:#1A3A6B;">\n                                <span style="font-size:12px;font-weight:600;color:#1A1A2E;line-height:1.5;">I have read and agree to the <strong>Barangay Borrowing Rules and Policies</strong> listed above.</span>\n                            </label>\n                        </div>`;

    const rulesNew = `\n                        <!-- Borrowing Rules Agreement — TOP of form -->\n                        <div id="borrowRulesSection" style="display:none;margin-bottom:8px;">\n                            <div style="border:1.5px solid #1A3A6B;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(26,58,107,0.08);">\n                                <div style="background:#1A3A6B;padding:10px 14px;display:flex;align-items:center;gap:8px;">\n                                    <i class="bi bi-journal-text" style="color:#fff;font-size:14px;"></i>\n                                    <span style="font-size:13px;font-weight:700;color:#fff;flex:1;">Borrowing Rules &amp; Policies</span>\n                                    <span style="font-size:10px;color:rgba(255,255,255,0.7);font-style:italic;">Read before borrowing</span>\n                                </div>\n                                <div id="borrowRulesListItems" style="padding:12px 14px;height:180px;overflow-y:auto;background:#F9FAFB;font-size:12px;color:#374151;line-height:1.6;"></div>\n                            </div>\n                            <div id="rulesScrollHint" style="font-size:11px;color:#9CA3AF;text-align:center;padding:4px 0 2px;display:none;"><i class="bi bi-arrow-down-circle" style="margin-right:3px;"></i>Scroll down to read all rules and enable the checkbox.</div>\n                            <label style="display:flex;align-items:flex-start;gap:10px;margin-top:8px;cursor:pointer;padding:11px 13px;background:#EEF2FF;border:1.5px solid #C7D2FE;border-radius:8px;">\n                                <input type="checkbox" id="borrowAgreeCheck" onchange="updateBorrowSubmitButton()" disabled style="width:16px;height:16px;flex-shrink:0;margin-top:2px;accent-color:#1A3A6B;">\n                                <span id="borrowAgreeLabel" style="font-size:12px;font-weight:600;color:#1A1A2E;line-height:1.5;">I have read and agree to the <strong>Barangay Borrowing Rules and Policies</strong> listed above.</span>\n                            </label>\n                        </div>`;

    // Remove from current position
    const ridx = c.indexOf(rulesOld);
    if (ridx !== -1) {
        c = c.substring(0, ridx) + c.substring(ridx + rulesOld.length);
        changes++;
        console.log('[dashboard] Removed old borrowRulesSection position');
    } else {
        console.log('[dashboard] MISS: old borrowRulesSection position');
    }

    // Insert at top of form (after hidden inputs, before <!-- User Info Fields -->)
    rep(
        `<input type="hidden" id="borrowStartDate"><input type="hidden" id="borrowReturnDate">\n                        <!-- User Info Fields -->`,
        `<input type="hidden" id="borrowStartDate"><input type="hidden" id="borrowReturnDate">` + rulesNew + `\n                        <!-- User Info Fields -->`
    );

    // 3. Update loadBorrowRulesForUser to always show section + add scroll detection
    const OLD_LOAD_FN = `async function loadBorrowRulesForUser() {
            let rules = [];
            try {
                const { data, error } = await supabase.from('site_settings').select('value').eq('key','borrowing_rules').single();
                if (!error && data) {
                    rules = JSON.parse(data.value || '[]');
                    localStorage.setItem('brgy_borrowing_rules', JSON.stringify(rules));
                } else {
                    rules = JSON.parse(localStorage.getItem('brgy_borrowing_rules') || '[]');
                }
            } catch(e) {
                rules = JSON.parse(localStorage.getItem('brgy_borrowing_rules') || '[]');
            }
            const section   = document.getElementById('borrowRulesSection');
            const listEl    = document.getElementById('borrowRulesListItems');
            const agreeChk  = document.getElementById('borrowAgreeCheck');
            if (!section || !listEl) return;
            if (!rules.length) { section.style.display = 'none'; return; }
            section.style.display = 'block';
            if (agreeChk) agreeChk.checked = false;
            const _e = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            listEl.innerHTML = rules.map((r, i) =>
                '<div style="margin-bottom:'+(i < rules.length-1 ? '10px' : '0')+';padding-bottom:'+(i < rules.length-1 ? '10px' : '`;

    const NEW_LOAD_FN = `async function loadBorrowRulesForUser() {
            let rules = [];
            try {
                const { data, error } = await supabase.from('site_settings').select('value').eq('key','borrowing_rules').single();
                if (!error && data) {
                    rules = JSON.parse(data.value || '[]');
                    localStorage.setItem('brgy_borrowing_rules', JSON.stringify(rules));
                } else {
                    rules = JSON.parse(localStorage.getItem('brgy_borrowing_rules') || '[]');
                }
            } catch(e) {
                rules = JSON.parse(localStorage.getItem('brgy_borrowing_rules') || '[]');
            }
            const section   = document.getElementById('borrowRulesSection');
            const listEl    = document.getElementById('borrowRulesListItems');
            const agreeChk  = document.getElementById('borrowAgreeCheck');
            if (!section || !listEl) return;
            // Always show section — even when no rules (show default message)
            section.style.display = 'block';
            if (agreeChk) { agreeChk.checked = false; agreeChk.disabled = true; }
            const _e = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            if (!rules.length) {
                listEl.innerHTML = '<div style="color:#6B7280;font-style:italic;padding:4px 0;">No specific rules have been defined yet. Please return borrowed items on time and in good condition.</div>';
            } else {
                listEl.innerHTML = rules.map((r, i) =>
                    '<div style="margin-bottom:'+(i < rules.length-1 ? '10px' : '0')+';padding-bottom:'+(i < rules.length-1 ? '10px' : '`;

    rep(OLD_LOAD_FN, NEW_LOAD_FN);

    // Update the end of loadBorrowRulesForUser to add scroll detection
    rep(
        `).join('');
            updateBorrowSubmitButton();
        }
        document.getElementById('borrowerContact')?.addEventListener('input', updateBorrowSubmitButton);`,
        `).join('');
            }
            // Scroll-to-bottom detection: enable checkbox only after reading all rules
            const hintEl = document.getElementById('rulesScrollHint');
            function _onRulesScroll() {
                if (listEl.scrollHeight - listEl.scrollTop <= listEl.clientHeight + 8) {
                    if (agreeChk) agreeChk.disabled = false;
                    if (hintEl) hintEl.style.display = 'none';
                    listEl.removeEventListener('scroll', _onRulesScroll);
                }
            }
            setTimeout(() => {
                if (listEl.scrollHeight <= listEl.clientHeight + 8) {
                    if (agreeChk) agreeChk.disabled = false;
                } else {
                    if (hintEl) hintEl.style.display = 'block';
                    listEl.addEventListener('scroll', _onRulesScroll);
                }
            }, 50);
            updateBorrowSubmitButton();
        }
        document.getElementById('borrowerContact')?.addEventListener('input', updateBorrowSubmitButton);`
    );

    // Also ensure checkbox disabled state doesn't block updateBorrowSubmitButton — it already checks .checked which is false if disabled
    // But reset the borrowRulesSection on form close too (already done in the reset code that hides it)

    fs.writeFileSync('user-portal/user-dashboard.html', c);
    console.log('[dashboard] Done.', changes, 'changes');
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH 3: admin.html — add Borrowing Rules management to Equipment section
// ─────────────────────────────────────────────────────────────────────────────
{
    let c = fs.readFileSync('admin-portal/admin.html', 'utf8').replace(/\r\n/g, '\n');
    let changes = 0;

    function rep(old, neu) {
        const idx = c.indexOf(old);
        if (idx === -1) { console.log('[admin] MISS:', JSON.stringify(old.substring(0, 70))); return; }
        c = c.substring(0, idx) + neu + c.substring(idx + old.length);
        changes++;
    }

    // Add Borrowing Rules management panel before end of equipment section
    const rulesPanel = `
                    <!-- ── BORROWING RULES MANAGEMENT ── -->
                    <div style="margin-top:28px;border-top:2px solid #e2e8f0;padding-top:24px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <div style="width:36px;height:36px;background:#1A3A6B;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                                    <i class="bi bi-journal-check" style="color:#fff;font-size:18px;"></i>
                                </div>
                                <div>
                                    <div style="font-size:14px;font-weight:700;color:#1A1A2E;">Borrowing Rules &amp; Policies</div>
                                    <div style="font-size:11px;color:#6B7280;">Rules residents must acknowledge before borrowing equipment</div>
                                </div>
                            </div>
                            <span id="adminRulesCountBadge" style="font-size:11px;font-weight:700;background:#1A3A6B;color:#fff;border-radius:10px;padding:3px 10px;">0 rules</span>
                        </div>

                        <!-- Add/Edit Rule Form -->
                        <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px;">
                            <div style="font-size:13px;font-weight:700;color:#1A1A2E;margin-bottom:12px;display:flex;align-items:center;gap:7px;" id="adminRuleFormTitle">
                                <i class="bi bi-plus-circle-fill" style="color:#1A3A6B;"></i> Add New Rule
                            </div>
                            <input type="hidden" id="adminEditRuleId" value="">
                            <div style="margin-bottom:10px;">
                                <label style="display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:5px;">Rule Title *</label>
                                <input type="text" id="adminRuleTitle" maxlength="120" placeholder="e.g. Return Items on Time"
                                    style="width:100%;padding:9px 12px;border:1.5px solid #D1D5DB;border-radius:8px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;"
                                    onfocus="this.style.borderColor='#1A3A6B'" onblur="this.style.borderColor='#D1D5DB'">
                            </div>
                            <div style="margin-bottom:12px;">
                                <label style="display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:5px;">Description *</label>
                                <textarea id="adminRuleContent" rows="3" placeholder="Describe the rule in detail..."
                                    style="width:100%;padding:9px 12px;border:1.5px solid #D1D5DB;border-radius:8px;font-size:13px;font-family:inherit;outline:none;resize:vertical;box-sizing:border-box;"
                                    onfocus="this.style.borderColor='#1A3A6B'" onblur="this.style.borderColor='#D1D5DB'"></textarea>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button onclick="adminSaveRule()"
                                    style="flex:1;padding:9px;border-radius:8px;border:none;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;background:#1A3A6B;color:#fff;display:flex;align-items:center;justify-content:center;gap:6px;"
                                    onmouseover="this.style.background='#0f2547'" onmouseout="this.style.background='#1A3A6B'">
                                    <i class="bi bi-floppy-fill"></i><span id="adminRuleSaveBtnText">Add Rule</span>
                                </button>
                                <button id="adminRuleCancelBtn" onclick="adminCancelRuleEdit()" style="display:none;padding:9px 18px;border-radius:8px;border:1.5px solid #D1D5DB;background:#fff;color:#374151;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;"
                                    onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='#fff'">Cancel</button>
                            </div>
                        </div>

                        <!-- Rules List -->
                        <div id="adminRulesListBody" style="display:flex;flex-direction:column;gap:8px;"></div>
                        <div id="adminRulesEmptyState" style="text-align:center;padding:28px 16px;color:#9CA3AF;display:none;">
                            <i class="bi bi-journal-x" style="font-size:28px;display:block;margin-bottom:8px;"></i>
                            No rules defined yet. Add your first rule above.
                        </div>
                    </div>

`;

    // Insert before the end of equipment section (before <!-- USERS SECTION -->)
    rep(
        `\n                    <!-- USERS SECTION -->`,
        rulesPanel + `\n                    <!-- USERS SECTION -->`
    );

    // Add switchSection trigger to load rules when equipment section opens
    rep(
        `if (section === 'equipment') loadEquipment();`,
        `if (section === 'equipment') { loadEquipment(); adminLoadBorrowingRules(); }`
    );

    // Add borrowing rules JS functions before end of script
    const rulesFunctions = `
        // ── EQUIPMENT: BORROWING RULES MANAGEMENT ────────────────────
        const _ADMIN_LS_RULES = 'brgy_borrowing_rules';

        function _adminGetRules() {
            try { return JSON.parse(localStorage.getItem(_ADMIN_LS_RULES)) || []; } catch(e) { return []; }
        }
        function _adminStoreRules(rules) {
            localStorage.setItem(_ADMIN_LS_RULES, JSON.stringify(rules));
        }
        function _adminEscR(s) {
            return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }

        async function adminLoadBorrowingRules() {
            try {
                const { data, error } = await supabase.from('site_settings').select('value').eq('key','borrowing_rules').single();
                if (!error && data) _adminStoreRules(JSON.parse(data.value || '[]'));
            } catch(e) {}
            adminRenderRulesList();
        }

        function adminRenderRulesList() {
            const rules  = _adminGetRules();
            const body   = document.getElementById('adminRulesListBody');
            const empty  = document.getElementById('adminRulesEmptyState');
            const badge  = document.getElementById('adminRulesCountBadge');
            if (badge) badge.textContent = rules.length + (rules.length === 1 ? ' rule' : ' rules');
            if (!body) return;
            if (!rules.length) {
                body.innerHTML = '';
                if (empty) empty.style.display = 'block';
                return;
            }
            if (empty) empty.style.display = 'none';
            body.innerHTML = rules.map((rule, i) =>
                '<div style="border:1px solid #E5E7EB;border-radius:8px;padding:12px 14px;background:#FAFAFA;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">'+
                '<div style="flex:1;min-width:0;">'+
                '<div style="font-size:13px;font-weight:700;color:#1A1A2E;margin-bottom:3px;display:flex;align-items:center;gap:7px;">'+
                '<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#1A3A6B;color:#fff;border-radius:50%;font-size:10px;font-weight:700;flex-shrink:0;">'+(i+1)+'</span>'+
                _adminEscR(rule.title)+'</div>'+
                '<div style="font-size:12px;color:#6B7280;line-height:1.55;padding-left:27px;">'+_adminEscR(rule.content)+'</div>'+
                '</div>'+
                '<div style="display:flex;gap:6px;flex-shrink:0;">'+
                '<button onclick="adminEditRule(\\''+rule.id+'\\',\\''+_adminEscR(rule.title).replace(/'/g,"&#39;")+'\\')" style="width:30px;height:30px;border-radius:6px;background:#EEF2FF;border:none;cursor:pointer;color:#1A3A6B;font-size:13px;display:flex;align-items:center;justify-content:center;" title="Edit"><i class="bi bi-pencil-fill"></i></button>'+
                '<button onclick="adminDeleteRule(\\''+rule.id+'\\',\\''+_adminEscR(rule.title).replace(/'/g,"&#39;")+'\\')" style="width:30px;height:30px;border-radius:6px;background:#FEF2F2;border:none;cursor:pointer;color:#CE1126;font-size:13px;display:flex;align-items:center;justify-content:center;" title="Delete"><i class="bi bi-trash-fill"></i></button>'+
                '</div></div>'
            ).join('');
        }

        function adminSaveRule() {
            const title   = (document.getElementById('adminRuleTitle').value   || '').trim();
            const content = (document.getElementById('adminRuleContent').value || '').trim();
            if (!title)   return showNotification('Rule title is required.', 'error');
            if (!content) return showNotification('Rule description is required.', 'error');
            const rules  = _adminGetRules();
            const editId = document.getElementById('adminEditRuleId').value;
            if (editId) {
                const idx = rules.findIndex(r => String(r.id) === editId);
                if (idx !== -1) { rules[idx].title = title; rules[idx].content = content; }
            } else {
                rules.push({ id: String(Date.now()), title, content });
            }
            _adminStoreRules(rules);
            _adminSyncRules(rules);
            adminCancelRuleEdit();
            adminRenderRulesList();
            showNotification(editId ? 'Rule updated.' : 'Rule added.', 'success');
        }

        function adminEditRule(id, title) {
            const rule = _adminGetRules().find(r => String(r.id) === id);
            if (!rule) return;
            document.getElementById('adminEditRuleId').value     = id;
            document.getElementById('adminRuleTitle').value      = rule.title;
            document.getElementById('adminRuleContent').value    = rule.content;
            const ft = document.getElementById('adminRuleFormTitle');
            if (ft) ft.innerHTML = '<i class="bi bi-pencil-fill" style="color:#1A3A6B;"></i> Edit Rule';
            const sb = document.getElementById('adminRuleSaveBtnText');
            if (sb) sb.textContent = 'Save Changes';
            const cb = document.getElementById('adminRuleCancelBtn');
            if (cb) cb.style.display = '';
            document.getElementById('adminRuleTitle').focus();
        }

        function adminCancelRuleEdit() {
            document.getElementById('adminEditRuleId').value     = '';
            document.getElementById('adminRuleTitle').value      = '';
            document.getElementById('adminRuleContent').value    = '';
            const ft = document.getElementById('adminRuleFormTitle');
            if (ft) ft.innerHTML = '<i class="bi bi-plus-circle-fill" style="color:#1A3A6B;"></i> Add New Rule';
            const sb = document.getElementById('adminRuleSaveBtnText');
            if (sb) sb.textContent = 'Add Rule';
            const cb = document.getElementById('adminRuleCancelBtn');
            if (cb) cb.style.display = 'none';
        }

        function adminDeleteRule(id, title) {
            if (!confirm('Delete rule "' + title + '"? Residents will no longer see it.')) return;
            const rules = _adminGetRules().filter(r => String(r.id) !== id);
            _adminStoreRules(rules);
            _adminSyncRules(rules);
            adminRenderRulesList();
            showNotification('Rule deleted.', 'success');
        }

        async function _adminSyncRules(rules) {
            try {
                await supabase.from('site_settings').upsert(
                    [{ key: 'borrowing_rules', value: JSON.stringify(rules), updated_at: new Date().toISOString() }],
                    { onConflict: 'key' }
                );
            } catch(e) {}
        }
        // ──────────────────────────────────────────────────────────────`;

    // Insert before the closing </script> tag
    const scriptEnd = c.lastIndexOf('</script>');
    if (scriptEnd !== -1) {
        c = c.substring(0, scriptEnd) + rulesFunctions + '\n        ' + c.substring(scriptEnd);
        changes++;
        console.log('[admin] Added borrowing rules JS functions');
    }

    fs.writeFileSync('admin-portal/admin.html', c);
    console.log('[admin] Done.', changes, 'changes');
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH 4: home.html — add Bootstrap Icons, replace emoji nav/welcome icons
// ─────────────────────────────────────────────────────────────────────────────
{
    let h = fs.readFileSync('user-portal/home.html', 'utf8').replace(/\r\n/g, '\n');
    let changes = 0;

    function rep(old, neu) {
        const idx = h.indexOf(old);
        if (idx === -1) { console.log('[home] MISS:', JSON.stringify(old.substring(0, 70))); return; }
        h = h.substring(0, idx) + neu + h.substring(idx + old.length);
        changes++;
    }
    function repAll(old, neu) {
        const n = h.split(old).length - 1;
        h = h.split(old).join(neu);
        if (n === 0) console.log('[home] MISS(all):', JSON.stringify(old.substring(0, 60)));
        else changes += n;
    }

    // 1. Add Bootstrap Icons CDN in <head>
    rep(
        '<link href="https://fonts.googleapis.com/css2?family=Inter:wgh',
        '<link rel="stylesheet" href="css/bootstrap-icons/bootstrap-icons.min.css">\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wgh'
    );

    // 2. Update .nav-icon CSS to support Bootstrap Icons
    rep(
        `.nav-icon {
            font-size: 18px;
            width: 24px;
            text-align: center;`,
        `.nav-icon {
            font-size: 18px;
            width: 24px;
            text-align: center;
            display: flex; align-items: center; justify-content: center;`
    );

    // 3. Replace sidebar nav emoji icons
    rep('<div class="nav-icon">🪑</div>', '<div class="nav-icon"><i class="bi bi-box-seam-fill"></i></div>');
    rep('<div class="nav-icon">📋</div>', '<div class="nav-icon"><i class="bi bi-clipboard2-check-fill"></i></div>');
    rep('<div class="nav-icon">🏀</div>', '<div class="nav-icon"><i class="bi bi-dribbble"></i></div>');
    rep('<div class="nav-icon">📦</div>', '<div class="nav-icon"><i class="bi bi-bag-check-fill"></i></div>');

    // 4. Replace welcome-icon emojis (big section icons, 48px)
    rep('<div class="welcome-icon">🪑</div>', '<div class="welcome-icon"><i class="bi bi-box-seam-fill"></i></div>');
    rep('<div class="welcome-icon">📋</div>', '<div class="welcome-icon"><i class="bi bi-clipboard2-check-fill"></i></div>');
    rep('<div class="welcome-icon">🏀</div>', '<div class="welcome-icon"><i class="bi bi-dribbble"></i></div>');
    rep('<div class="welcome-icon">📦</div>', '<div class="welcome-icon"><i class="bi bi-bag-check-fill"></i></div>');

    // 5. Replace section header emojis
    rep('>📋 Submit a Concern</h3>', '><i class="bi bi-clipboard2-check-fill" style="margin-right:6px;"></i>Submit a Concern</h3>');
    rep('>🏀 Court Reservations</h3>', '><i class="bi bi-dribbble" style="margin-right:6px;"></i>Court Reservations</h3>');
    rep('>📦 My Borrowings</h3>', '><i class="bi bi-bag-check-fill" style="margin-right:6px;"></i>My Borrowings</h3>');
    rep('>🏃 Available Equipment</h3>', '><i class="bi bi-box-seam-fill" style="margin-right:6px;"></i>Available Equipment</h3>');
    rep('>🎉 Upcoming\n                        Events</h4>', '><i class="bi bi-calendar-event-fill" style="margin-right:6px;"></i>Upcoming\n                        Events</h4>');

    // 6. Replace venue tab emojis
    rep('>🏀\n                        Basketball Court</butto', '><i class="bi bi-dribbble" style="margin-right:5px;"></i>Basketball Court</butto');
    rep(">'🏢'\n                        Multi-Purpose Hall</butto", ">'<i class=\"bi bi-building\" style=\"margin-right:5px;\"></i>Multi-Purpose Hall</butto");
    rep('>🏢\n                        Multi-Purpose Hall</butto', '><i class="bi bi-building" style="margin-right:5px;"></i>Multi-Purpose Hall</butto');

    // 7. Replace welcome header emoji
    rep('>👋 Welcome, <span id="welcomeName">User</span>!<', '><i class="bi bi-hand-wave" style="margin-right:6px;"></i>Welcome, <span id="welcomeName">User</span>!<');

    // 8. Replace close button emoji
    rep('>✕</button>', '><i class="bi bi-x-lg"></i></button>');

    // 9. Replace select option emojis
    rep('>🏗️ Infrastructure</option>', '>Infrastructure</option>');
    rep('>🧹 Sanitation</option>', '>Sanitation</option>');
    rep('>👮 Security</option>', '>Security</option>');
    rep('>🔊 Noise</option>', '>Noise</option>');
    rep('>📝 Other</option>', '>Other</option>');

    // 10. Fix welcome-icon CSS to work with both emoji and Bootstrap Icons
    rep(
        `.welcome-icon {
            font-size: 48px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }`,
        `.welcome-icon {
            font-size: 48px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
            display: flex; align-items: center; justify-content: center;
        }`
    );

    // 11. Replace logout button emoji
    rep('>🚪 Logout</button>', '><i class="bi bi-box-arrow-right" style="margin-right:6px;"></i>Logout</button>');
    rep(">🚪\n", "><i class=\"bi bi-box-arrow-right\"></i>\n");

    fs.writeFileSync('user-portal/home.html', h);
    console.log('[home] Done.', changes, 'changes');
}

console.log('\nAll patches complete.');

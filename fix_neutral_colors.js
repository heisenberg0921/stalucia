const fs = require('fs');

const paths = ['user-portal/user-dashboard.html', 'user-dashboard.html'];

for (const path of paths) {
    if (!fs.existsSync(path)) continue;
    let content = fs.readFileSync(path, 'utf8');

    // ─── STAT CARDS ───────────────────────────────────────────────────────────

    // Blue stat card (Active Borrowings)
    content = content.replace(
        `<div class="user-stat-card" onclick="showPanel('equipment')" style="border-left:4px solid #3b82f6;">
                        <div class="user-stat-icon" style="background:#eff6ff;border:1px solid #bfdbfe; color:#3b82f6; display:flex; align-items:center; justify-content:center; font-size:24px;"><i class="bi bi-calendar-check-fill"></i></div>
                        <div>
                            <div class="user-stat-label">Active Borrowings</div>
                            <div class="user-stat-value" id="stat-equipment" style="color:#2563eb;">0</div>
                        </div>
                    </div>`,
        `<div class="user-stat-card" onclick="showPanel('equipment')" style="border-left:4px solid #94a3b8;">
                        <div class="user-stat-icon" style="background:#f8fafc;border:1px solid #e2e8f0; color:#64748b; display:flex; align-items:center; justify-content:center; font-size:24px;"><i class="bi bi-calendar-check-fill"></i></div>
                        <div>
                            <div class="user-stat-label">Active Borrowings</div>
                            <div class="user-stat-value" id="stat-equipment" style="color:#334155;">0</div>
                        </div>
                    </div>`
    );

    // Amber stat card (Pending Concerns)
    content = content.replace(
        `<div class="user-stat-card" onclick="showPanel('concerns')" style="border-left:4px solid #f59e0b;">
                        <div class="user-stat-icon" style="background:#fffbeb;border:1px solid #fde68a; color:#f59e0b; display:flex; align-items:center; justify-content:center; font-size:24px;"><i class="bi bi-box-fill"></i></div>
                        <div>
                            <div class="user-stat-label">Pending Concerns</div>
                            <div class="user-stat-value" id="stat-concerns" style="color:#d97706;">0</div>
                        </div>
                    </div>`,
        `<div class="user-stat-card" onclick="showPanel('concerns')" style="border-left:4px solid #94a3b8;">
                        <div class="user-stat-icon" style="background:#f8fafc;border:1px solid #e2e8f0; color:#64748b; display:flex; align-items:center; justify-content:center; font-size:24px;"><i class="bi bi-box-fill"></i></div>
                        <div>
                            <div class="user-stat-label">Pending Concerns</div>
                            <div class="user-stat-value" id="stat-concerns" style="color:#334155;">0</div>
                        </div>
                    </div>`
    );

    // Purple stat card (Upcoming Reservations)
    content = content.replace(
        `<div class="user-stat-card" onclick="showPanel('booking')" style="border-left:4px solid #8b5cf6;">
                        <div class="user-stat-icon" style="background:#f5f3ff;border:1px solid #ddd6fe; color:#8b5cf6; display:flex; align-items:center; justify-content:center; font-size:24px;"><i class="bi bi-calendar-event-fill"></i></div>
                        <div>
                            <div class="user-stat-label">Upcoming Reservations</div>
                            <div class="user-stat-value" id="stat-bookings" style="color:#7c3aed;">0</div>
                        </div>
                    </div>`,
        `<div class="user-stat-card" onclick="showPanel('booking')" style="border-left:4px solid #94a3b8;">
                        <div class="user-stat-icon" style="background:#f8fafc;border:1px solid #e2e8f0; color:#64748b; display:flex; align-items:center; justify-content:center; font-size:24px;"><i class="bi bi-calendar-event-fill"></i></div>
                        <div>
                            <div class="user-stat-label">Upcoming Reservations</div>
                            <div class="user-stat-value" id="stat-bookings" style="color:#334155;">0</div>
                        </div>
                    </div>`
    );

    // ─── QUICK ACTION CARDS ───────────────────────────────────────────────────

    content = content.replace(
        `<button onclick="showPanel('equipment')" class="user-quick-card" style="--uqa-color:#3b82f6;">`,
        `<button onclick="showPanel('equipment')" class="user-quick-card" style="--uqa-color:#64748b;">`
    );
    content = content.replace(
        `<button onclick="showPanel('concerns')" class="user-quick-card" style="--uqa-color:#f59e0b;">`,
        `<button onclick="showPanel('concerns')" class="user-quick-card" style="--uqa-color:#64748b;">`
    );
    content = content.replace(
        `<button onclick="showPanel('booking')" class="user-quick-card" style="--uqa-color:#8b5cf6;">`,
        `<button onclick="showPanel('booking')" class="user-quick-card" style="--uqa-color:#64748b;">`
    );
    content = content.replace(
        `<button onclick="showPanel('events')" class="user-quick-card" style="--uqa-color:#10b981;">`,
        `<button onclick="showPanel('events')" class="user-quick-card" style="--uqa-color:#64748b;">`
    );

    // ─── MY OVERVIEW SECTION ──────────────────────────────────────────────────
    // Overview icon - green to gray
    content = content.replace(
        `style="width:36px;height:36px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="bi bi-bar-chart-fill" style="color:#059669;"></i>`,
        `style="width:36px;height:36px;background:#f1f5f9;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="bi bi-bar-chart-fill" style="color:#64748b;"></i>`
    );

    // Active Borrowings row - blue icon and text
    content = content.replace(
        `<span class="mr-2"><i class="bi bi-box-seam" style="color:#3b82f6;"></i></span>Active Borrowings</span>
                                    <span id="dash-statEquip" style="font-weight:800;font-size:15px;color:#3b82f6;">-</span>`,
        `<span class="mr-2"><i class="bi bi-box-seam" style="color:#64748b;"></i></span>Active Borrowings</span>
                                    <span id="dash-statEquip" style="font-weight:800;font-size:15px;color:#334155;">-</span>`
    );

    // Open Concerns row - amber hover and icon
    content = content.replace(
        `<div class="px-4 py-3 flex justify-between items-center bg-amber-50/50 dark:bg-amber-900/10 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                    <span style="font-size:13px;font-weight:600;color:var(--text-main);"><span class="mr-2"><i class="bi bi-megaphone-fill" style="color:#f59e0b;"></i></span>Open Concerns</span>
                                    <span id="dash-statConcerns" style="font-weight:800;font-size:15px;color:#f59e0b;">-</span>`,
        `<div class="px-4 py-3 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/30">
                                    <span style="font-size:13px;font-weight:600;color:var(--text-main);"><span class="mr-2"><i class="bi bi-megaphone-fill" style="color:#64748b;"></i></span>Open Concerns</span>
                                    <span id="dash-statConcerns" style="font-weight:800;font-size:15px;color:#334155;">-</span>`
    );

    // Upcoming Reservations row - purple hover and icon
    content = content.replace(
        `<div class="px-4 py-3 flex justify-between items-center bg-purple-50/50 dark:bg-purple-900/10 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                    <span style="font-size:13px;font-weight:600;color:var(--text-main);"><span class="mr-2"><i class="bi bi-calendar-check-fill" style="color:#8b5cf6;"></i></span>Upcoming Reservations</span>
                                    <span id="dash-statBookings" style="font-weight:800;font-size:15px;color:#8b5cf6;">-</span>`,
        `<div class="px-4 py-3 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/30">
                                    <span style="font-size:13px;font-weight:600;color:var(--text-main);"><span class="mr-2"><i class="bi bi-calendar-check-fill" style="color:#64748b;"></i></span>Upcoming Reservations</span>
                                    <span id="dash-statBookings" style="font-weight:800;font-size:15px;color:#334155;">-</span>`
    );

    // ─── BARANGAY SERVICES CARD ───────────────────────────────────────────────
    // Green icon to gray
    content = content.replace(
        `background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="bi bi-houses-fill" style="color:#059669;"></i>`,
        `background:#f1f5f9;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="bi bi-houses-fill" style="color:#64748b;"></i>`
    );
    // ACTIVE badge green to gray
    content = content.replace(
        `style="font-size:10px;background:#f0fdf4;color:#16a34a;padding:3px 10px;border-radius:50px;font-weight:700;border:1px solid #bbf7d0;">ACTIVE</span>`,
        `style="font-size:10px;background:#f1f5f9;color:#475569;padding:3px 10px;border-radius:50px;font-weight:700;border:1px solid #e2e8f0;">ACTIVE</span>`
    );
    // Equipment icon green to gray
    content = content.replace(
        `style="width:32px;height:32px;border-radius:8px;background:#d1fae5;display:flex;align-items:center;justify-content:center;font-size:16px;"><i class="bi bi-box-seam"></i>`,
        `style="width:32px;height:32px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:16px;"><i class="bi bi-box-seam" style="color:#64748b;"></i>`
    );
    // Dribbble icon blue to gray  
    content = content.replace(
        `style="width:32px;height:32px;border-radius:8px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:16px;"><i class="bi bi-dribbble"></i>`,
        `style="width:32px;height:32px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:16px;"><i class="bi bi-dribbble" style="color:#64748b;"></i>`
    );
    // Open badge blue to gray
    content = content.replace(
        `style="font-size:11px;background:#dbeafe;color:#1e40af;padding:2px 9px;border-radius:20px;font-weight:700;">Open</span>`,
        `style="font-size:11px;background:#f1f5f9;color:#475569;padding:2px 9px;border-radius:20px;font-weight:700;">Open</span>`
    );
    // Facility Reservations icon purple to gray
    content = content.replace(
        `style="width:32px;height:32px;border-radius:8px;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-size:16px;"><i class="bi bi-calendar-check"></i>`,
        `style="width:32px;height:32px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:16px;"><i class="bi bi-calendar-check" style="color:#64748b;"></i>`
    );

    fs.writeFileSync(path, content, 'utf8');
    console.log("Updated:", path);
}

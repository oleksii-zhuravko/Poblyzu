/**
 * СЕРВІС "ПОБЛИЗУ" - ГІД ЖК "НОВА АНГЛІЯ"
 */

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTevBqX2BUL7mq8YMlnHRBzpu09GBQ7aV17J5Pxdp57HUBN_OhkP9NvOdVwXyZF3SrCTjkuhjDRInG2/pub?gid=0&single=true&output=csv';

const houses = [
    { name: "Оксфорд", map: "https://maps.app.goo.gl/xxxx1", path: "Перша вежа ліворуч від в'їзду." },
    { name: "Кембрідж", map: "https://maps.app.goo.gl/xxxx2", path: "За вежею Оксфорд, всередині двору." },
    { name: "Ліверпуль", map: "https://maps.app.goo.gl/xxxx3", path: "Поруч із Кембріджем, біля школи." },
    { name: "Честер, 28Д", map: "https://maps.app.goo.gl/xxxx4", path: "Західна частина комплексу." },
    { name: "Бірмінгем", map: "https://maps.app.goo.gl/xxxx5", path: "Центральна частина, біля фонтанів." },
    { name: "Брістоль", map: "https://maps.app.goo.gl/xxxx6", path: "Південна частина комплексу." },
    { name: "Лондон", map: "https://maps.app.goo.gl/xxxx7", path: "Центральна висока вежа." },
    { name: "Манчестер", map: "https://maps.app.goo.gl/xxxx8", path: "Поруч із Лондоном." },
    { name: "Брайтон", map: "https://maps.app.goo.gl/xxxx9", path: "Навпроти ЄвроКолегіуму." },
    { name: "Ньюкасл", map: "https://maps.app.goo.gl/xxxx10", path: "Нова черга, біля Ноттінгема." },
    { name: "Лінкольн", map: "https://maps.app.goo.gl/xxxx11", path: "Поруч із Ньюкаслом." },
    { name: "Віндзор", map: "https://maps.app.goo.gl/xxxx12", path: "Між Ноттінгемом та Лінкольном." },
    { name: "Ноттінгем", map: "https://maps.app.goo.gl/xxxx13", path: "Ближче до зони вигулу собак." },
    { name: "Престон", map: "https://maps.app.goo.gl/xxxx14", path: "Крайня вежа біля паркінгу." }
];

let businesses = [];

async function init() {
    const houseSelect = document.getElementById('houseFilter');
    houses.forEach(h => houseSelect.innerHTML += `<option value="${h.name}">${h.name}</option>`);

    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        businesses = parseCSV(data);
        render(businesses);
    } catch (error) {
        console.error("Помилка завантаження даних:", error);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== "");
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = values[i] ? values[i].trim() : "";
        });
        return obj;
    });
}

function trackEvent(action, label) {
    if (typeof gtag === 'function') gtag('event', action, { 'event_label': label });
}

function timeToMinutes(timeStr) {
    if (!timeStr || timeStr.includes('Цілодобово') || timeStr === "0") return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
}

function checkIsOpen(item) {
    const now = new Date();
    const isWeekend = (now.getDay() === 0 || now.getDay() === 6);
    const currentMinutes = (now.getHours() * 60) + now.getMinutes();
    const openStr = isWeekend ? item.we_open : item.w_open;
    const closeStr = isWeekend ? item.we_close : item.w_close;

    if (!openStr || !closeStr) return false; 
    if (openStr === "0" && (closeStr === "24" || closeStr === "00:00")) return true;

    const openMin = timeToMinutes(openStr);
    const closeMin = timeToMinutes(closeStr);
    if (closeMin < openMin) return currentMinutes >= openMin || currentMinutes < closeMin;
    return currentMinutes >= openMin && currentMinutes < closeMin;
}

function render(data) {
    const container = document.getElementById('businessContainer');
    container.innerHTML = data.map(item => {
        const isOpen = checkIsOpen(item);
        return `
            <div class="card" onclick="openModal('${item.id}')">
                <img src="${item.photo}" class="card-img" onerror="this.src='https://via.placeholder.com/400x200?text=No+Photo'">
                <div class="card-body">
                    <span class="status-badge ${isOpen ? 'open' : 'closed'}">${isOpen ? '● Відкрито' : '○ Зачинено'}</span>
                    <h3>${item.name}</h3>
                    <p class="address">🏠 буд. ${item.house}</p>
                </div>
            </div>
        `;
    }).join('');
}

// ФУНКЦІЯ МОДАЛЬНОГО ВІКНА З РОЗУМНОЮ ЛОГІКОЮ ПРИХОВУВАННЯ
function openModal(id) {
    const item = businesses.find(b => b.id == id);
    trackEvent('view_business', item.name);
    const modal = document.getElementById('detailsModal');

    // 1. ПЕРЕВІРКА ЧАСУ РОБОТИ: якщо хоча б одне поле порожнє, не виводимо блок
    const hoursHtml = (item.w_open && item.w_close) ? `
        <div style="font-size: 13px; color: #666; margin: 10px 0; background: #f0f2f5; padding: 12px; border-radius: 12px;">
            <p style="margin: 4px 0;">📅 <strong>Пн-Пт:</strong> ${item.w_open} — ${item.w_close}</p>
            <p style="margin: 4px 0;">🎉 <strong>Сб-Нд:</strong> ${item.we_open || item.w_open} — ${item.we_close || item.w_close}</p>
        </div>
    ` : '';

    // 2. ПЕРЕВІРКА ОПИСУ
    const descriptionHtml = item.description ? `
        <p class="full-description" style="line-height: 1.6; color: #444; white-space: pre-wrap; margin: 15px 0;">${item.description}</p>
    ` : '';

    // 3. ПЕРЕВІРКА КНОПОК (якщо посилання немає в таблиці — кнопка не створюється)
    const instaBtn = item.insta ? `<a href="${item.insta}" target="_blank" class="btn insta" onclick="trackEvent('click_insta', '${item.name}')">Instagram</a>` : '';
    const phoneBtn = item.phone ? `<a href="tel:${item.phone}" class="btn call" onclick="trackEvent('click_call', '${item.name}')">Дзвонити</a>` : '';
    const mapBtn = item.map ? `<a href="${item.map}" target="_blank" class="btn map-full" onclick="trackEvent('click_map_biz', '${item.name}')">📍 На карту</a>` : '';
    
    // Нові потенційні кнопки (додай колонки 'menu' та 'site' у таблицю, якщо захочеш)
    const menuBtn = item.menu ? `<a href="${item.menu}" target="_blank" class="btn" style="background: #ff9800; color: white; grid-column: span 2;" onclick="trackEvent('click_menu', '${item.name}')">📖 Меню</a>` : '';
    const siteBtn = item.site ? `<a href="${item.site}" target="_blank" class="btn" style="background: #4caf50; color: white; grid-column: span 2;" onclick="trackEvent('click_site', '${item.name}')">🌐 Сайт</a>` : '';

    document.getElementById('modalData').innerHTML = `
        <img src="${item.photo}" style="width:100%; border-radius:18px; margin-bottom:15px; object-fit: cover; max-height: 250px;" onerror="this.style.display='none'">
        <h2 style="margin: 0 0 10px 0;">${item.name}</h2>
        ${hoursHtml}
        ${descriptionHtml}
        <div class="btn-group">
            ${menuBtn}
            ${siteBtn}
            ${instaBtn}
            ${phoneBtn}
            ${mapBtn}
        </div>
    `;
    modal.style.display = "block";
}

function openMapModal() {
    trackEvent('view_map', 'Main Map');
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalData').innerHTML = `
        <img src="image_d62017.jpg" style="width:100%; border-radius:15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h3 style="margin: 20px 0 15px 0;">🏠 Навігація по ЖК</h3>
        <div class="houses-nav-container">
            ${houses.map(h => `
                <div class="nav-card">
                    <div style="padding-right: 90px;">
                        <strong>${h.name}</strong><br>
                        <small style="color: #777;">${h.path}</small>
                    </div>
                    <a href="${h.map}" target="_blank" class="btn map-sm" style="background: #1a73e8; color: white;">Карта</a>
                </div>
            `).join('')}
        </div>
    `;
    modal.style.display = "block";
}

function closeModal() { document.getElementById('detailsModal').style.display = "none"; }

function filterData() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const house = document.getElementById('houseFilter').value;
    const openOnly = document.getElementById('openNowFilter').checked;
    const filtered = businesses.filter(b => {
        const mSearch = b.name.toLowerCase().includes(search) || (b.description && b.description.toLowerCase().includes(search));
        const mHouse = house === 'Всі' || b.house === house;
        const mStatus = !openOnly || checkIsOpen(b);
        return mSearch && mHouse && mStatus;
    });
    render(filtered);
}

function setCategory(cat, btn) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = cat === 'Всі' ? businesses : businesses.filter(b => b.category === cat);
    render(filtered);
}

window.onclick = (e) => { if (e.target == document.getElementById('detailsModal')) closeModal(); }
init();

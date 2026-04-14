/**
 * СЕРВІС "ПОБЛИЗУ" - ГІД ЖК "НОВА АНГЛІЯ"
 * * Налаштування:
 * 1. SHEET_CSV_URL - посилання на опубліковану Google Таблицю (формат CSV).
 * 2. houses - список будинків для фільтрації та карти.
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

// Ініціалізація додатку: завантаження фільтрів та даних
async function init() {
    const houseSelect = document.getElementById('houseFilter');
    houses.forEach(h => houseSelect.innerHTML += `<option value="${h.name}">${h.name}</option>`);

    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        businesses = parseCSV(data);
        render(businesses);
    } catch (error) {
        console.error("Помилка завантаження даних з Google Таблиць:", error);
    }
}

// Перетворення сирих даних CSV у масив об'єктів
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

// Надсилання подій у Google Analytics
function trackEvent(action, label) {
    if (typeof gtag === 'function') {
        gtag('event', action, { 'event_label': label });
    }
}

// Перетворення часу "HH:mm" у хвилини для точного розрахунку
function timeToMinutes(timeStr) {
    if (!timeStr || timeStr.includes('Цілодобово') || timeStr === "0") return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
}

// Розрахунок статусу закладу (відчинено/зачинено) на основі часу
function checkIsOpen(item) {
    const now = new Date();
    const isWeekend = (now.getDay() === 0 || now.getDay() === 6);
    const currentMinutes = (now.getHours() * 60) + now.getMinutes();
    
    const openStr = isWeekend ? item.we_open : item.w_open;
    const closeStr = isWeekend ? item.we_close : item.w_close;

    if (openStr === "0" && (closeStr === "24" || closeStr === "00:00")) return true;

    const openMin = timeToMinutes(openStr);
    const closeMin = timeToMinutes(closeStr);

    // Підтримка нічних графіків (якщо зачиняються після опівночі)
    if (closeMin < openMin) {
        return currentMinutes >= openMin || currentMinutes < closeMin;
    }

    return currentMinutes >= openMin && currentMinutes < closeMin;
}

// Створення карток закладів на головній сторінці
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

// Відкриття детальної інформації про заклад
function openModal(id) {
    const item = businesses.find(b => b.id == id);
    trackEvent('view_business', item.name);
    const modal = document.getElementById('detailsModal');
    
    const hoursHtml = `
        <div style="font-size: 13px; color: #666; margin: 10px 0; background: #f0f2f5; padding: 12px; border-radius: 12px;">
            <p style="margin: 4px 0;">📅 <strong>Пн-Пт:</strong> ${item.w_open} — ${item.w_close}</p>
            <p style="margin: 4px 0;">🎉 <strong>Сб-Нд:</strong> ${item.we_open} — ${item.we_close}</p>
        </div>
    `;

    document.getElementById('modalData').innerHTML = `
        <img src="${item.photo}" style="width:100%; border-radius:18px; margin-bottom:15px; object-fit: cover; max-height: 250px;">
        <h2 style="margin: 0 0 10px 0;">${item.name}</h2>
        ${hoursHtml}
        
        <p class="full-description" style="line-height: 1.6; color: #444; white-space: pre-wrap; margin: 15px 0;">${item.description}</p>
        
        <div class="btn-group">
            <a href="${item.insta}" target="_blank" class="btn insta" onclick="trackEvent('click_insta', '${item.name}')">Instagram</a>
            <a href="tel:${item.phone}" class="btn call" onclick="trackEvent('click_call', '${item.name}')">Дзвонити</a>
            <a href="${item.map}" target="_blank" class="btn map-full" onclick="trackEvent('click_map_biz', '${item.name}')">📍 Прокласти маршрут</a>
        </div>
    `;
    modal.style.display = "block";
}

// Вікно загальної карти комплексу
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

function closeModal() {
    document.getElementById('detailsModal').style.display = "none";
}

// Логіка пошуку та фільтрації за будинком/статусом
function filterData() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const house = document.getElementById('houseFilter').value;
    const openOnly = document.getElementById('openNowFilter').checked;

    const filtered = businesses.filter(b => {
        const mSearch = b.name.toLowerCase().includes(search) || b.description.toLowerCase().includes(search);
        const mHouse = house === 'Всі' || b.house === house;
        const mStatus = !openOnly || checkIsOpen(b);
        return mSearch && mHouse && mStatus;
    });
    render(filtered);
}

// Фільтрація за категоріями (Кафе, Магазини і т.д.)
function setCategory(cat, btn) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = cat === 'Всі' ? businesses : businesses.filter(b => b.category === cat);
    render(filtered);
}

// Закриття модального вікна при кліку на темний фон
window.onclick = (e) => {
    if (e.target == document.getElementById('detailsModal')) closeModal();
}

// Старт додатку
init();

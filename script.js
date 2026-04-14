const SHEET_CSV_URL = 'ПОСИЛАННЯ_НА_ТВОЮ_ТАБЛИЦЮ';

const houses = [
    { name: "Оксфорд", map: "https://maps.app.goo.gl/3AoxD", path: "Перша вежа ліворуч від в'їзду." },
    { name: "Кембрідж", map: "https://maps.app.goo.gl/3AoxD", path: "За вежею Оксфорд, всередині двору." },
    { name: "Ліверпуль", map: "https://maps.app.goo.gl/3AoxD", path: "Біля школи та стадіону." },
    { name: "Честер", map: "https://maps.app.goo.gl/3AoxD", path: "Західна частина комплексу." },
    { name: "Бірмінгем", map: "https://maps.app.goo.gl/3AoxD", path: "Біля фонтанів." },
    { name: "Брістоль", map: "https://maps.app.goo.gl/3AoxD", path: "Південна частина комплексу." },
    { name: "Лондон", map: "https://maps.app.goo.gl/3AoxD", path: "Центральна вежа з годинником." },
    { name: "Манчестер", map: "https://maps.app.goo.gl/3AoxD", path: "Поруч із вежею Лондон." },
    { name: "Брайтон", map: "https://maps.app.goo.gl/3AoxD", path: "Навпроти ЄвроКолегіуму." },
    { name: "Ньюкасл", map: "https://maps.app.goo.gl/3AoxD", path: "Нова черга будинків." },
    { name: "Лінкольн", map: "https://maps.app.goo.gl/3AoxD", path: "Поруч із Ньюкаслом." },
    { name: "Віндзор", map: "https://maps.app.goo.gl/3AoxD", path: "Між Ноттінгемом та Лінкольном." },
    { name: "Ноттінгем", map: "https://maps.app.goo.gl/3AoxD", path: "Ближче до зони вигулу собак." },
    { name: "Престон", map: "https://maps.app.goo.gl/3AoxD", path: "Крайня вежа біля паркінгу." }
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
    } catch (e) { console.error("CSV Load Error:", e); }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(l => l.trim() !== "");
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i]?.trim();
            return obj;
        }, {});
    });
}

function trackEvent(action, label) {
    if (typeof gtag === 'function') gtag('event', action, { 'event_label': label });
}

function checkIsOpen(item) {
    const now = new Date();
    const isWeekend = (now.getDay() === 0 || now.getDay() === 6);
    const hour = now.getHours();
    
    const openH = parseInt(isWeekend ? item.we_open : item.w_open);
    const closeH = parseInt(isWeekend ? item.we_close : item.w_close);

    if (openH === 0 && closeH === 24) return true;
    return hour >= openH && hour < closeH;
}

function render(data) {
    const container = document.getElementById('businessContainer');
    container.innerHTML = data.map(item => {
        const isOpen = checkIsOpen(item);
        return `
            <div class="card" onclick="openModal('${item.id}')">
                <img src="${item.photo}" class="card-img" onerror="this.src='https://via.placeholder.com/400x200?text=Poblyzu'">
                <div class="card-body">
                    <span class="status-badge ${isOpen ? 'open' : 'closed'}">${isOpen ? '● Відкрито' : '○ Зачинено'}</span>
                    <h3>${item.name}</h3>
                    <p class="address">🏠 буд. ${item.house}</p>
                </div>
            </div>
        `;
    }).join('');
}

function openModal(id) {
    const item = businesses.find(b => b.id == id);
    trackEvent('view_business', item.name);
    const modal = document.getElementById('detailsModal');
    
    document.getElementById('modalData').innerHTML = `
        <img src="${item.photo}" style="width:100%; border-radius:15px; margin-bottom:15px;">
        <h3>${item.name}</h3>
        <div style="font-size: 13px; color: #666; margin: 10px 0; background: #f0f2f5; padding: 10px; border-radius: 8px;">
            <p style="margin: 2px 0;">📅 Пн-Пт: ${item.w_open}:00 - ${item.w_close}:00</p>
            <p style="margin: 2px 0;">🎉 Сб-Нд: ${item.we_open}:00 - ${item.we_close}:00</p>
        </div>
        <p class="full-description">${item.description}</p>
        <div class="btn-group">
            <a href="${item.insta}" target="_blank" class="btn insta" onclick="trackEvent('click_insta', '${item.name}')">Instagram</a>
            <a href="tel:${item.phone}" class="btn call" onclick="trackEvent('click_call', '${item.name}')">Дзвонити</a>
            <a href="${item.map}" target="_blank" class="btn map-full" onclick="trackEvent('click_map_biz', '${item.name}')">📍 Прокласти маршрут на карті</a>
        </div>
    `;
    modal.style.display = "block";
}

function openMapModal() {
    trackEvent('view_map', 'Main Map');
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalData').innerHTML = `
        <img src="image_d62017.jpg" style="width:100%; border-radius:12px;">
        <h3 style="margin-top:15px;">🏠 Навігація по ЖК</h3>
        <div class="houses-nav-container">
            ${houses.map(h => `
                <div class="nav-card">
                    <strong>${h.name}</strong><br>
                    <small>${h.path}</small>
                    <a href="${h.map}" target="_blank" class="btn map-sm" style="background: var(--accent);">Google Maps</a>
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
        const mSearch = b.name.toLowerCase().includes(search);
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

window.onclick = (e) => { if(e.target == document.getElementById('detailsModal')) closeModal(); }
init();

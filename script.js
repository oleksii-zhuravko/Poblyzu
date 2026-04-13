const houses = [
    { name: "Оксфорд", addr: "Максимовича 24", path: "Перша вежа ліворуч від в'їзду." },
    { name: "Кембрідж", addr: "Максимовича 24А", path: "За вежею Оксфорд, всередині двору." },
    { name: "Ліверпуль", addr: "Максимовича 24Б", path: "Поруч із Кембріджем, біля школи." },
    { name: "Честер", addr: "Максимовича 24В", path: "Західна частина комплексу." },
    { name: "Бірмінгем", addr: "Максимовича 24Г", path: "Центральна частина, біля фонтанів." },
    { name: "Брістоль", addr: "Максимовича 24Д", path: "Південна частина комплексу." },
    { name: "Лондон", addr: "Максимовича 26", path: "Центральна висока вежа." },
    { name: "Манчестер", addr: "Максимовича 26А", path: "Поруч із Лондоном." },
    { name: "Брайтон", addr: "Максимовича 26Б", path: "Навпроти ЄвроКолегіуму." },
    { name: "Ньюкасл", addr: "Максимовича 28", path: "Нова черга, біля Ноттінгема." },
    { name: "Лінкольн", addr: "Максимовича 28А", path: "Поруч із Ньюкаслом." },
    { name: "Віндзор", addr: "Максимовича 28Б", path: "Між Ноттінгемом та Лінкольном." },
    { name: "Ноттінгем", addr: "Максимовича 28Г", path: "Ближче до зони вигулу собак." },
    { name: "Престон", addr: "Максимовича 28Д", path: "Крайня вежа біля паркінгу." },
    { name: "Євро. Колегіум", addr: "Максимовича 28В", path: "Окремий корпус школи." }
];

const businesses = [
    {
        id: 1, name: "Art Coffee", category: "Кафе", house: "Лондон",
        phone: "+380500000000", insta: "https://instagram.com/artcoffee",
        photo: "https://images.unsplash.com/photo-1501339817302-444d182d3005?w=500",
        openH: 8, closeH: 21, description: "Свіжа кава та десерти."
    }
];

function init() {
    const houseSelect = document.getElementById('houseFilter');
    houses.forEach(h => houseSelect.innerHTML += `<option value="${h.name}">${h.name}</option>`);
    render(businesses);
}

// Функція трекінгу
function trackEvent(action, label) {
    if (typeof gtag === 'function') {
        gtag('event', action, { 'event_label': label });
    }
}

function checkIsOpen(o, c) {
    const now = new Date().getHours();
    return (o === 0 && c === 24) || (now >= o && now < c);
}

function render(data) {
    const container = document.getElementById('businessContainer');
    container.innerHTML = data.map(item => {
        const isOpen = checkIsOpen(item.openH, item.closeH);
        return `
            <div class="card" onclick="openModal(${item.id})">
                <img src="${item.photo}" class="card-img">
                <div class="card-body">
                    <span class="status-badge ${isOpen ? 'open' : 'closed'}">${isOpen ? '● Відчинено' : '○ Зачинено'}</span>
                    <h3>${item.name}</h3>
                    <p class="address">🏠 буд. ${item.house}</p>
                </div>
            </div>
        `;
    }).join('');
}

function openModal(id) {
    const item = businesses.find(b => b.id === id);
    trackEvent('view_business', item.name); // Трекінг перегляду
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalData').innerHTML = `
        <img src="${item.photo}" style="width:100%; border-radius:15px; margin-bottom:15px;">
        <h3>${item.name}</h3>
        <p class="full-description">${item.description}</p>
        <div class="btn-group">
            <a href="${item.insta}" target="_blank" class="btn insta" onclick="trackEvent('click_insta', '${item.name}')">Instagram</a>
            <a href="tel:${item.phone}" class="btn call" onclick="trackEvent('click_call', '${item.name}')">Дзвонити</a>
        </div>
    `;
    modal.style.display = "block";
}

function openMapModal() {
    trackEvent('view_map', 'Main Map'); // Трекінг відкриття карти
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalData').innerHTML = `
        <img src="image_d62017.jpg" style="width:100%; border-radius:12px;">
        <h3 style="margin-top:15px;">🏠 Навігація до будинків</h3>
        <div class="houses-nav-container">
            ${houses.map(h => `
                <div class="nav-card">
                    <strong>${h.name}</strong>
                    <p>${h.path}</p>
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
        const mStatus = !openOnly || checkIsOpen(b.openH, b.closeH);
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

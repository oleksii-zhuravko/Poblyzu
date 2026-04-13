// Дані будинків з посиланнями на точну навігацію (Google Plus codes)
const houses = [
    { name: "Оксфорд", addr: "Максимовича 24", path: "Вхід з боку вул. Максимовича, перша вежа ліворуч", map: "https://maps.app.goo.gl/OxfordExampleLink" },
    { name: "Кембрідж", addr: "Максимовича 24А", path: "За вежею Оксфорд, всередині двору", map: "https://maps.app.goo.gl/CambridgeExampleLink" },
    { name: "Ліверпуль", addr: "Максимовича 24Б", path: "Одразу за Кембріджем, біля ЄвроКолегіуму", map: "https://maps.app.goo.gl/LiverpoolExampleLink" },
    { name: "Честер", addr: "Максимовича 24В", path: "Західна частина, поруч із Ліверпулем", map: "https://maps.app.goo.gl/ChesterExampleLink" },
    { name: "Бірмінгем", addr: "Максимовича 24Г", path: "Центральна алея, навпроти фонтанів", map: "https://maps.app.goo.gl/BirminghamExampleLink" },
    { name: "Брістоль", addr: "Максимовича 24Д", path: "Південна частина комплексу", map: "https://maps.app.goo.gl/BristolExampleLink" },
    { name: "Лондон", addr: "Максимовича 26", path: "Висока вежа в центрі", map: "https://maps.app.goo.gl/LondonExampleLink" },
    { name: "Манчестер", addr: "Максимовича 26А", path: "Навпроти вежі Лондон, поруч з Брайтоном", map: "https://maps.app.goo.gl/ManchesterExampleLink" },
    { name: "Брайтон", addr: "Максимовича 26Б", path: "Навпроти Кембріджа та ЄвроКолегіуму", map: "https://maps.app.goo.gl/BrightonExampleLink" },
    { name: "Ньюкасл", addr: "Максимовича 28", path: "Нова черга, біля Ноттінгема", map: "https://maps.app.goo.gl/NewcastleExampleLink" },
    { name: "Лінкольн", addr: "Максимовича 28А", path: "Поруч із Ньюкаслом, навпроти Престона", map: "https://maps.app.goo.gl/LincolnExampleLink" },
    { name: "Віндзор", addr: "Максимовича 28Б", path: "Між Ноттінгемом та Лінкольном", map: "https://maps.app.goo.gl/WindsorExampleLink" },
    { name: "Ноттінгем", addr: "Максимовича 28Г", path: "Ближче до зони вигулу собак", map: "https://maps.app.goo.gl/NottinghamExampleLink" },
    { name: "Престон", addr: "Максимовича 28Д", path: "Крайня вежа біля паркінгу", map: "https://maps.app.goo.gl/PrestonExampleLink" },
    { name: "Євро. Колегіум", addr: "Максимовича 28В", path: "Окремий корпус школи у дворі", map: "https://maps.app.goo.gl/EuroColegiumExampleLink" }
];

// Дані забізнесів (ті ж, що і раніше)
const businesses = [
    {
        id: 1,
        name: "Art Coffee",
        category: "Кафе",
        house: "Лондон",
        phone: "+380500000000",
        insta: "https://instagram.com/artcoffee",
        photo: "https://images.unsplash.com/photo-1501339817302-444d182d3005?w=500",
        openH: 8, closeH: 21,
        description: "Найкраща арабіка в Новій Англії. Круасани та зона для роботи."
    },
    {
        id: 2,
        name: "Лотки",
        category: "Магазини",
        house: "Брістоль",
        phone: "+380670000000",
        insta: "https://instagram.com/lotky",
        photo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500",
        openH: 0, closeH: 24,
        description: "Продуктовий магазин біля дому. Цілодобово."
    }
];

function init() {
    const houseSelect = document.getElementById('houseFilter');
    houses.forEach(h => {
        houseSelect.innerHTML += `<option value="${h.name}">${h.name}</option>`;
    });
    render(businesses);
}

function checkIsOpen(o, c) {
    if (o === 0 && c === 24) return true;
    const now = new Date().getHours();
    return now >= o && now < c;
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
                    <p class="hours">⏰ ${item.openH}:00 - ${item.closeH}:00</p>
                </div>
            </div>
        `;
    }).join('');
}

// 1. Модальне вікно ДЕТАЛЕЙ ЗАКЛАДУ (CMS)
function openModal(id) {
    const item = businesses.find(b => b.id === id);
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalData').innerHTML = `
        <img src="${item.photo}" style="width:100%; border-radius:15px; margin-bottom:15px;">
        <h3>${item.name}</h3>
        <p class="address">🏠 Локація: будинок ${item.house}</p>
        <p class="full-description">${item.description}</p>
        <div class="btn-group">
            <a href="${item.insta}" target="_blank" class="btn insta">Instagram</a>
            <a href="tel:${item.phone}" class="btn call">Дзвонити</a>
        </div>
    `;
    modal.style.display = "block";
}

// 2. Модальне вікно КАРТИ (Навігація до будинків)
function openMapModal() {
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalData').innerHTML = `
        <img src="image_0.png" class="schema-img" alt="Схема Нова Англія">
        <h3>🏠 Навігація до будинків</h3>
        <p class="address">🇬🇧 Нова Англія, м. Київ, вул. Максимовича</p>
        
        <h4 class="house-nav-title">Як пройти:</h4>
        <div class="houses-nav-container">
            ${houses.map(h => `
                <div class="nav-card">
                    <strong>${h.name}</strong>
                    <small>${h.addr}</small>
                    <p>${h.path}</p>
                    <a href="${h.map}" target="_blank" class="btn map map-sm">Google Maps</a>
                </div>
            `).join('')}
        </div>
    `;
    modal.style.display = "block";
}

// Загальні функції
function closeModal() { document.getElementById('detailsModal').style.display = "none"; }

function filterData() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const house = document.getElementById('houseFilter').value;
    const openOnly = document.getElementById('openNowFilter').checked;

    const filtered = businesses.filter(b => {
        const mSearch = b.name.toLowerCase().includes(search) || b.category.toLowerCase().includes(search);
        const mHouse = house === 'Всі' || b.house === house;
        const mStatus = !openOnly || checkIsOpen(b.openH, b.closeH);
        return mSearch && mHouse && mStatus;
    });
    render(filtered);
}

let currentCategory = 'Всі';
function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterData();
}

// Закриття модального вікна кліком на фон
window.onclick = (e) => { if(e.target == document.getElementById('detailsModal')) closeModal(); }
init();

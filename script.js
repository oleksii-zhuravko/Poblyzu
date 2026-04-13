const houses = [
    { name: "Оксфорд", addr: "Максимовича 24", path: "Вхід з боку вул. Максимовича, перша вежа ліворуч" },
    { name: "Кембрідж", addr: "Максимовича 24А", path: "За вежею Оксфорд, всередині двору" },
    { name: "Ліверпуль", addr: "Максимовича 24Б", path: "Одразу за Кембріджем" },
    { name: "Честер", addr: "Максимовича 24В", path: "Західна частина комплексу" },
    { name: "Бірмінгем", addr: "Максимовича 24Г", path: "Центральна алея" },
    { name: "Брістоль", addr: "Максимовича 24Д", path: "Південна частина комплексу" },
    { name: "Лондон", addr: "Максимовича 26", path: "Висока вежа в центрі" },
    { name: "Манчестер", addr: "Максимовича 26А", path: "Поруч з вежею Лондон" },
    { name: "Брайтон", addr: "Максимовича 26Б", path: "Ближче до школи" },
    { name: "Ньюкасл", addr: "Максимовича 28", path: "Нова черга, північний вхід" },
    { name: "Лінкольн", addr: "Максимовича 28А", path: "Поруч з Ньюкаслом" },
    { name: "Віндзор", addr: "Максимовича 28Б", path: "Навпроти фонтанів" },
    { name: "Ноттінгем", addr: "Максимовича 28Г", path: "Ближче до зони вигулу собак" },
    { name: "Престон", addr: "Максимовича 28Д", path: "Крайня вежа біля паркінгу" },
    { name: "Євро. Колегіум", addr: "Максимовича 28В", path: "Окремий корпус школи" }
];

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
        description: "Найкраща арабіка в Новій Англії. У нас можна замовити свіжі круасани та десерти без цукру. Є зона для роботи з ноутбуком."
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
        description: "Продуктовий магазин біля дому. Свіжі овочі, фрукти та власна випічка. Працюємо цілодобово."
    }
];

function init() {
    // Рендеримо будинки
    const houseGrid = document.getElementById('housesGrid');
    const houseSelect = document.getElementById('houseFilter');
    
    houses.forEach(h => {
        houseGrid.innerHTML += `
            <div class="house-card" onclick="alert('📍 Як пройти до ${h.name}: ${h.path}')">
                <span>буд.</span>
                <strong>${h.name}</strong>
            </div>
        `;
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
                    <span class="status-badge ${isOpen ? 'open' : 'closed'}">${isOpen ? '● Відкрито' : '○ Зачинено'}</span>
                    <h3>${item.name}</h3>
                    <p class="address">🏠 буд. ${item.house}</p>
                    <p class="hours">⏰ ${item.openH}:00 - ${item.closeH}:00</p>
                </div>
            </div>
        `;
    }).join('');
}

function openModal(id) {
    const item = businesses.find(b => b.id === id);
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalData').innerHTML = `
        <img src="${item.photo}" style="width:100%; border-radius:15px;">
        <h2>${item.name}</h2>
        <p><strong>🏠 Локація:</strong> будинок ${item.house}</p>
        <p class="full-description">${item.description}</p>
        <div class="btn-group">
            <a href="${item.insta}" class="btn insta">Instagram</a>
            <a href="tel:${item.phone}" class="btn call">Дзвонити</a>
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

window.onclick = (e) => { if(e.target == document.getElementById('detailsModal')) closeModal(); }
init();

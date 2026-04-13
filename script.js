const businesses = [
    {
        name: "Кава та Круасани",
        category: "Кафе",
        address: "Корпус 2, під'їзд 3",
        phone: "+380501112233",
        map: "https://goo.gl/maps/xyz",
        insta: "https://instagram.com/cafe",
        photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", // Замініть на своє фото
        openH: 8,  // Година відкриття
        closeH: 21 // Година закриття
    },
    {
        name: "Еко Маркет",
        category: "Магазини",
        address: "Вулиця Паркова, 5",
        phone: "+380674445566",
        map: "https://goo.gl/maps/abc",
        insta: "https://instagram.com/market",
        photo: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500",
        openH: 9,
        closeH: 22
    }
];

let currentCategory = 'Всі';

function checkIsOpen(o, c) {
    const now = new Date().getHours();
    return now >= o && now < c;
}

function render(data) {
    const container = document.getElementById('businessContainer');
    container.innerHTML = data.map(item => {
        const isOpen = checkIsOpen(item.openH, item.closeH);
        return `
            <div class="card">
                <img src="${item.photo}" class="card-img">
                <div class="card-body">
                    <span class="status-badge ${isOpen ? 'open' : 'closed'}">
                        ${isOpen ? '● Відчинено' : '○ Зачинено'}
                    </span>
                    <h3>${item.name}</h3>
                    <p class="address">📍 ${item.address}</p>
                    <p class="hours">⏰ Працює: ${item.openH}:00 - ${item.closeH}:00</p>
                    
                    <div class="actions">
                        <a href="${item.insta}" target="_blank" class="btn insta">Instagram</a>
                        <a href="tel:${item.phone}" class="btn call">Дзвінок</a>
                        <a href="${item.map}" target="_blank" class="btn map">Карта</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterData() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const openOnly = document.getElementById('openNowFilter').checked;

    const filtered = businesses.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(search) || b.category.toLowerCase().includes(search);
        const matchesCategory = currentCategory === 'Всі' || b.category === currentCategory;
        const matchesStatus = !openOnly || checkIsOpen(b.openH, b.closeH);
        return matchesSearch && matchesCategory && matchesStatus;
    });
    render(filtered);
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterData();
}

// Перший запуск
render(businesses);

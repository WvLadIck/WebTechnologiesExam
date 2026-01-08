const resources = [
    { id: 1, name: "Центр изучения иностранных языков 'Лингва'", category: "educational", address: "ул. Ленина, 25, офис 304", coordinates: [55.751244, 37.618423], hours: "Пн-Пт: 9:00-21:00, Сб: 10:00-18:00", contact: "+7 (495) 123-45-67", description: "Курсы английского, немецкого, французского, испанского и китайского языков.", iconColor: "#2196F3" },
    { id: 2, name: "Английский разговорный клуб 'English Talk'", category: "cafe", address: "пр. Мира, 15, кафе 'Бриз'", coordinates: [55.754, 37.62], hours: "Вт, Чт: 19:00-21:00, Сб: 16:00-18:00", contact: "+7 (495) 987-65-43", description: "Практика разговорного английского с носителями языка.", iconColor: "#4CAF50" },
    { id: 3, name: "Городская библиотека №3 им. Достоевского", category: "library", address: "ул. Пушкина, 8", coordinates: [55.752, 37.615], hours: "Пн-Сб: 10:00-20:00, Вс: 10:00-18:00", contact: "+7 (495) 555-12-34", description: "Библиотека с отделом иностранной литературы.", iconColor: "#FF9800" },
    { id: 4, name: "Языковая школа 'Полиглот'", category: "private", address: "ул. Тверская, 18, 2 этаж", coordinates: [55.76, 37.61], hours: "Пн-Вс: 8:00-22:00", contact: "+7 (495) 777-88-99", description: "Частная языковая школа, подготовка к экзаменам.", iconColor: "#9C27B0" },
    { id: 5, name: "Французский культурный центр 'Феникс'", category: "community", address: "ул. Кутузовский проспект, 32", coordinates: [55.74, 37.58], hours: "Вт-Сб: 11:00-20:00", contact: "+7 (495) 222-33-44", description: "Центр французской культуры и языка.", iconColor: "#F44336" },
    { id: 6, name: "Кафе языкового обмена 'Мост'", category: "cafe", address: "ул. Арбат, 44", coordinates: [55.749, 37.59], hours: "Ежедневно: 12:00-23:00", contact: "+7 (495) 444-55-66", description: "Практика разных языков в кафе.", iconColor: "#4CAF50" },
    { id: 7, name: "Университет иностранных языков", category: "educational", address: "ул. Большая Якиманка, 32", coordinates: [55.738, 37.61], hours: "Пн-Пт: 8:00-20:00", contact: "+7 (495) 333-22-11", description: "Курсы для всех желающих.", iconColor: "#2196F3" },
    { id: 8, name: "Частные курсы китайского языка 'Восток'", category: "private", address: "ул. Профсоюзная, 102, офис 15", coordinates: [55.65, 37.53], hours: "Пн-Сб: 10:00-22:00", contact: "+7 (495) 666-77-88", description: "Курсы китайского языка с носителями.", iconColor: "#9C27B0" }
];

let map;
let placemarks = [];
let activeFilters = ["educational","community","library","private","cafe"];

ymaps.ready(init);

function init() {
    map = new ymaps.Map("map", { center: [55.751244, 37.618423], zoom: 12, controls: ['zoomControl','fullscreenControl'] });
    addPlacemarks();
    setupFilterListeners();
}

function addPlacemarks() {
    placemarks.forEach(pm => map.geoObjects.remove(pm));
    placemarks = [];

    const filteredResources = resources.filter(r => activeFilters.includes(r.category));

    filteredResources.forEach(resource => {
        let iconSymbol;
        switch(resource.category) {
            case 'educational': iconSymbol = '🎓'; break;
            case 'community': iconSymbol = '👥'; break;
            case 'library': iconSymbol = '📚'; break;
            case 'private': iconSymbol = '🏫'; break;
            case 'cafe': iconSymbol = '☕'; break;
        }

        const placemark = new ymaps.Placemark(
            resource.coordinates,
            {
                balloonContentHeader: `<strong>${resource.name}</strong>`,
                balloonContentBody: `
                    <div><strong>Адрес:</strong> ${resource.address}</div>
                    <div><strong>Часы работы:</strong> ${resource.hours}</div>
                    <div><strong>Контакты:</strong> ${resource.contact}</div>
                    <div style="margin-top: 10px;">${resource.description}</div>
                `,
                hintContent: resource.name
            },
            {
                iconLayout: 'default#imageWithContent',
                iconImageHref: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="${resource.iconColor}" opacity="0.9"/>
                        <circle cx="20" cy="20" r="15" fill="white"/>
                        <text x="20" y="26" text-anchor="middle" font-size="14" fill="${resource.iconColor}">${iconSymbol}</text>
                    </svg>
                `),
                iconImageSize: [40,40],
                iconImageOffset: [-20,-20]
            }
        );
        map.geoObjects.add(placemark);
        placemarks.push(placemark);
    });

    if (placemarks.length > 0) {
        const bounds = placemarks.reduce((b, p) => b.extend(p.geometry.getCoordinates()), new ymaps.geometry.LineString([]).getBounds());
        map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 50 });
    }
}

function setupFilterListeners() {
    document.querySelectorAll('.filter-option[data-filter]').forEach(option => {
        const checkbox = option.querySelector('.filter-checkbox');
        const filter = option.getAttribute('data-filter');

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                option.classList.add('active');
                if (!activeFilters.includes(filter)) activeFilters.push(filter);
            } else {
                option.classList.remove('active');
                activeFilters = activeFilters.filter(f => f !== filter);
            }
            addPlacemarks();
        });
    });
}
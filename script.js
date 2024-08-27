const elements = {
    pyro: 'pyro.png',
    gydro: 'gydro.png',
    electro: 'electro.png',
    cryo: 'cryo.png',
    anemo: 'anemo.png',
    geo: 'geo.png'
};

let reagentCount = 500; // Начальное количество реагентов
let draggedElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

function updateReagentCount() {
    const countElement = document.querySelector('.reagent-count');
    countElement.textContent = reagentCount;
}

function placeElement(element) {
    if (reagentCount <= 0) return; // Если реагентов нет, ничего не делаем

    reagentCount -= 1; // Уменьшаем количество реагентов
    updateReagentCount(); // Обновляем отображение

    const emptyCells = document.querySelectorAll('.grid .cell:not(.special):empty');
    
    if (emptyCells.length === 0) return; // Нет пустых клеток

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const selectedCell = emptyCells[randomIndex];

    const img = document.createElement('img');
    img.src = elements[element];
    img.className = 'element-icon';
    img.draggable = true;
    img.addEventListener('touchstart', handleTouchStart);
    img.addEventListener('touchmove', handleTouchMove);
    img.addEventListener('touchend', handleTouchEnd);
    selectedCell.appendChild(img);
}

function handleTouchStart(event) {
    const touch = event.targetTouches[0];
    draggedElement = event.target;

    // Определение смещения нажатия от края элемента
    touchOffsetX = touch.clientX - draggedElement.getBoundingClientRect().left;
    touchOffsetY = touch.clientY - draggedElement.getBoundingClientRect().top;

    // Отключаем прокрутку страницы во время перетаскивания
    document.body.classList.add('no-scroll');
}

function handleTouchMove(event) {
    if (!draggedElement) return;

    const touch = event.targetTouches[0];

    // Позиционирование элемента в соответствии с движением пальца
    draggedElement.style.position = 'absolute';
    draggedElement.style.left = `${touch.clientX - touchOffsetX}px`;
    draggedElement.style.top = `${touch.clientY - touchOffsetY}px`;
}

function handleTouchEnd(event) {
    if (!draggedElement) return;

    // Получаем элемент под пальцем в момент завершения касания
    const elementBelow = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    const dropTarget = elementBelow.closest('.cell');

    if (dropTarget && !dropTarget.querySelector('img')) {
        dropTarget.appendChild(draggedElement);
    } else {
        // Если нет подходящей ячейки, возвращаем элемент на его исходную позицию
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
    }

    draggedElement = null;

    // Включаем прокрутку страницы
    document.body.classList.remove('no-scroll');
}

// Назначаем обработчики событий для существующих элементов
document.querySelectorAll('.grid .cell img').forEach(img => {
    img.addEventListener('touchstart', handleTouchStart);
    img.addEventListener('touchmove', handleTouchMove);
    img.addEventListener('touchend', handleTouchEnd);
});

// Инициализация начального значения реагентов
updateReagentCount();

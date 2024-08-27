let reagentCount = 500; // Начальное количество реагентов
let draggedElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

const elements = {
    pyro: 'pyro.png',
    gydro: 'gydro.png',
    electro: 'electro.png',
    cryo: 'cryo.png',
    anemo: 'anemo.png',
    geo: 'geo.png'
};

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
    img.draggable = false; // Отключаем стандартное перетаскивание для мобильных устройств

    // Назначаем обработчики событий для перетаскивания
    img.addEventListener('touchstart', handleTouchStart);
    img.addEventListener('touchmove', handleTouchMove);
    img.addEventListener('touchend', handleTouchEnd);

    selectedCell.appendChild(img); // Добавляем элемент в сетку
}

function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.targetTouches[0];
    draggedElement = event.target;

    // Определение смещения нажатия от края элемента
    touchOffsetX = touch.clientX - draggedElement.getBoundingClientRect().left;
    touchOffsetY = touch.clientY - draggedElement.getBoundingClientRect().top;

    // Отключаем прокрутку страницы во время перетаскивания
    document.body.style.overflow = 'hidden';

    // Позиционирование элемента по координатам пальца
    draggedElement.style.position = 'absolute';
    draggedElement.style.left = `${touch.clientX - touchOffsetX}px`;
    draggedElement.style.top = `${touch.clientY - touchOffsetY}px`;
    draggedElement.style.pointerEvents = 'none'; // Игнорируем события для элемента во время перетаскивания
}

function handleTouchMove(event) {
    if (!draggedElement) return;

    event.preventDefault(); // Предотвращаем прокрутку экрана во время перетаскивания

    const touch = event.targetTouches[0];

    // Обновление позиции элемента по мере перемещения пальца
    draggedElement.style.left = `${touch.clientX - touchOffsetX}px`;
    draggedElement.style.top = `${touch.clientY - touchOffsetY}px`;
}

function handleTouchEnd(event) {
    if (!draggedElement) return;

    const touch = event.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = elementBelow.closest('.cell');

    if (dropTarget && !dropTarget.querySelector('img')) {
        // Если ячейка пустая, вставляем туда элемент
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.pointerEvents = 'auto';
        dropTarget.appendChild(draggedElement);
    } else {
        // Возвращаем элемент на исходное место, если ячейка занята или невалидна
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.pointerEvents = 'auto';
    }

    draggedElement = null;

    // Включаем прокрутку страницы
    document.body.style.overflow = 'auto';
}

// Назначаем обработчики событий для базовых кнопок
document.querySelector('.pyro-button').addEventListener('click', () => placeElement('pyro'));
document.querySelector('.gydro-button').addEventListener('click', () => placeElement('gydro'));
document.querySelector('.electro-button').addEventListener('click', () => placeElement('electro'));
document.querySelector('.cryo-button').addEventListener('click', () => placeElement('cryo'));
document.querySelector('.anemo-button').addEventListener('click', () => placeElement('anemo'));
document.querySelector('.geo-button').addEventListener('click', () => placeElement('geo'));

// Инициализация начального значения реагентов
updateReagentCount();

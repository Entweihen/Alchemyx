let draggedElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

function updateReagentCount() {
    const countElement = document.querySelector('.reagent-count');
    countElement.textContent = reagentCount;
}

function placeElement(element) {
    const elements = {
        pyro: 'pyro.png',
        gydro: 'gydro.png',
        electro: 'electro.png',
        cryo: 'cryo.png',
        anemo: 'anemo.png',
        geo: 'geo.png'
    };

    const img = document.createElement('img');
    img.src = elements[element];
    img.className = 'element-icon';
    img.draggable = false; // Отключаем стандартное перетаскивание для мобильных устройств
    img.addEventListener('touchstart', handleTouchStart);
    img.addEventListener('touchmove', handleTouchMove);
    img.addEventListener('touchend', handleTouchEnd);
    return img;
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

// Назначаем обработчики событий для всех элементов
function addTouchEventListeners(element) {
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
}

// Инициализация всех существующих элементов
document.querySelectorAll('.grid .cell img').forEach(addTouchEventListeners);

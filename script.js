let reagentCount = 500; // Глобальная переменная, доступная во всех функциях
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

const elements = {
    pyro: 'pyro.png',
    gydro: 'gydro.png',
    electro: 'electro.png',
    cryo: 'cryo.png',
    anemo: 'anemo.png',
    geo: 'geo.png',
    unknown: 'unknown.png' // Добавляем новый элемент
};

function updateReagentCount() {
    const countElement = document.querySelector('.reagent-count');
    if (countElement) {
        countElement.textContent = reagentCount;
    }
}

function placeElement(element) {
    console.log(`Placing element: ${element}`);
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
    img.style.position = 'absolute'; // Убедитесь, что элемент имеет абсолютное позиционирование

    // Назначаем обработчики событий для перетаскивания только для нового элемента
    img.addEventListener('touchstart', handleTouchStart);
    img.addEventListener('touchmove', handleTouchMove);
    img.addEventListener('touchend', handleTouchEnd);

    selectedCell.appendChild(img); // Добавляем элемент в сетку
}

function handleTouchStart(event) {
    console.log('Touch start');
    const touch = event.targetTouches[0];
    draggedElement = event.target;

    // Определение смещения нажатия от края элемента
    offsetX = touch.clientX - draggedElement.getBoundingClientRect().left;
    offsetY = touch.clientY - draggedElement.getBoundingClientRect().top;

    // Перемещаем элемент на верхний слой
    draggedElement.style.zIndex = 1000;
}

function handleTouchMove(event) {
    if (!draggedElement) return;

    console.log('Touch move');
    const touch = event.targetTouches[0];

    // Обновление позиции элемента по мере перемещения пальца
    draggedElement.style.left = `${touch.clientX - offsetX}px`;
    draggedElement.style.top = `${touch.clientY - offsetY}px`;
}

function handleTouchEnd(event) {
    if (!draggedElement) return;

    console.log('Touch end');
    const touch = event.changedTouches[0];

    // Определяем все ячейки
    const cells = document.querySelectorAll('.grid .cell');
    let dropTarget = null;

    cells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {
            dropTarget = cell;
        }
    });

    console.log('Drop target:', dropTarget);

    if (dropTarget) {
        const targetElement = dropTarget.querySelector('img');

        if (targetElement && targetElement !== draggedElement) {
            console.log('Mixing elements');
            // Удаляем оба элемента
            draggedElement.remove();
            targetElement.remove();

            // Уменьшаем количество реагентов на 1
            reagentCount -= 1;
            updateReagentCount();

            // Создаем новый элемент с картинкой unknown.png
            const newElement = document.createElement('img');
            newElement.src = elements['unknown'];
            newElement.className = 'element-icon';
            newElement.style.position = 'absolute';
            dropTarget.appendChild(newElement);

            // Назначаем обработчики событий для нового элемента
            newElement.addEventListener('touchstart', handleTouchStart);
            newElement.addEventListener('touchmove', handleTouchMove);
            newElement.addEventListener('touchend', handleTouchEnd);
        } else if (!targetElement) {
            console.log('Dropping element into a new cell');
            dropTarget.appendChild(draggedElement);

            // Обновляем позицию элемента относительно новой ячейки
            draggedElement.style.position = '';
            draggedElement.style.left = '';
            draggedElement.style.top = '';
        }
    } else {
        console.log('Returning element to original position');
        // Возвращаем элемент на исходное место, если ячейка занята или невалидна
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
    }

    draggedElement.style.zIndex = ''; // Сбрасываем z-index
    draggedElement = null;
}

// Удаляем обработчики событий для базовых элементов
document.querySelectorAll('.grid .cell img').forEach(img => {
    img.removeEventListener('touchstart', handleTouchStart);
    img.style.cursor = 'default'; // Изменяем курсор, чтобы показать, что элемент не перетаскивается
});

// Инициализация начального значения реагентов
updateReagentCount();

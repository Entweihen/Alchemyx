const elements = {
    pyro: 'pyro.png',
    gydro: 'gydro.png',
    electro: 'electro.png',
    cryo: 'cryo.png',
    anemo: 'anemo.png',
    geo: 'geo.png'
};

let reagentCount = 500; // Начальное количество реагентов

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
    img.addEventListener('dragstart', dragStart);
    selectedCell.appendChild(img);
}

function dragEnd(event) {
    // Включаем прокрутку страницы
    document.body.classList.remove('no-scroll');
}

document.querySelectorAll('.grid .cell img').forEach(img => {
    img.addEventListener('dragstart', dragStart);
    img.addEventListener('dragend', dragEnd); // Обработчик завершения перетаскивания
});

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.src);
    event.dataTransfer.setData('source-id', event.target.parentNode.dataset.id);

    // Предотвращаем стандартное поведение, такое как скролл
    event.preventDefault();
}

document.querySelectorAll('.grid .cell:not(.special)').forEach((cell, index) => {
    cell.dataset.id = index; // Присваиваем каждой ячейке уникальный идентификатор

    cell.addEventListener('dragover', event => {
        event.preventDefault(); // Предотвращаем действие по умолчанию, чтобы позволить сброс элемента
    });

    cell.addEventListener('drop', event => {
        event.preventDefault(); // Предотвращаем действие по умолчанию

        const src = event.dataTransfer.getData('text/plain');
        const sourceId = event.dataTransfer.getData('source-id');

        if (event.target.tagName === 'IMG') return; // Не заменяем элемент, если он уже есть

        const img = document.createElement('img');
        img.src = src;
        img.className = 'element-icon';
        img.draggable = true;
        img.addEventListener('dragstart', dragStart);

        event.target.appendChild(img);

        // Удаление элемента из исходной ячейки
        const sourceCell = document.querySelector(`.grid .cell[data-id="${sourceId}"]`);
        if (sourceCell && sourceCell.firstChild) {
            sourceCell.removeChild(sourceCell.firstChild);
        }
    });
});

// Инициализация начального значения реагентов
updateReagentCount();

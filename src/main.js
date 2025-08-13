import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

// @todo: подключение
import {initTable} from "./components/table.js";
import { initPagination } from "./components/pagination.js"; // 2.2 импортируйте функцию
import { initSorting } from "./components/sorting.js"; //3.1
import { initFiltering } from "./components/filtering.js"; //4.1
import { initSearching } from "./components/searching.js"; // 5 поиск


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
    function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);                // номер страницы по умолчанию 1 и тоже число

    return {                                            // расширьте существующий return вот так
    ...state,
    rowsPerPage,
    page
}; 
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    // @todo: использование

    // 5.1 — Поиск
    result = applySearching(result, state, action); //поиск 5.0

    // 4. Сначала фильтруем
    result = applyFiltering(result, state, action); // фильтрация 4.0

    // 3. Потом сортируем
    result = applySorting(result, state, action); // сортировка 3.2

    // 2. Потом пагинация
    result = applyPagination(result, state, action); // пагинация 2.3

    // 1. Рендерим
    sampleTable.render(result);
}
  /**
     * Логика такая:
     * Фильтрация уменьшает набор данных по условиям (например, по продавцу или поисковому запросу).
     * Сортировка упорядочивает уже отфильтрованный список.
     * Пагинация разбивает уже отсортированный набор на страницы.
     */

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination'] //добавьте вывод шаблона пагинации после этого внизу появились кнопки чтоб листать страницу
}, render);

// @todo: инициализация
const applyPagination = initPagination(
    sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([     // передаем сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
    searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
});

//5.0 поиск // имя поля, где хранится значение поиска
//const applySearching = initSearching(sampleTable.search.elements.searchField);
const applySearching = initSearching('search');
console.log(applySearching)

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();

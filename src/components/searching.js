import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // #5.1 — создаём компаратор
    const comparator = createComparison([
        rules.skipEmptyTargetValues], // если поле поиска пустое — ничего не фильтруем
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ]);

    // #5.2 — возвращаем функцию, которая применяет компаратор
    return (data, state, action) => {
        return data.filter(item => comparator(item, state, action));
    };
}

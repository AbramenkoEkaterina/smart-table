import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
                            const option = document.createElement('option')  // создать и вернуть тег опции
                            option.value = name;
                            option.textContent = name;
                            return option
                      })
        )
     })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля

//         if (action?.name === "clear") {
//     // 1. Находим поле, которое надо очистить
//     const parent = action.closest("[data-field]"); // или другой селектор контейнера
//     const input = parent.querySelector("input, select");

//     // 2. Чистим значение в DOM
//     if (input) input.value = "";

//     // 3. Чистим в state
//     const fieldName = action.dataset.field; // например "searchBySeller"
//     state[fieldName] = "";
// }

if (action && action.name === 'clear') {   // Проверяем, что пришло действие (action) и что его имя равно 'clear' — это кнопка очистки
            const field = action.dataset.field;  // Берём из кнопки очистки значение атрибута data-field — это имя поля, которое нужно очистить
            const parent = action.parentElement;  // Находим родительский элемент кнопки — это контейнер с кнопкой и полем ввода
            const input = parent.querySelector('input'); // В родителе ищем элемент input — это поле ввода, которое нужно очистить
            if (input) input.value = ''; if (input) input.value = ''; // Если поле ввода найдено, очищаем его значение, ставим пустую строку

            if (field && field in state) state[field] = '';  // Если поле существует и такое имя есть в объекте состояния state — тоже очищаем его в state,
                                                            // чтобы внутренняя модель состояния таблицы синхронизировалась с визуальным очищением
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}
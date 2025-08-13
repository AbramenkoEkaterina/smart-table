import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subName => { //reverse() — переворачиваем массив, чтобы при prepend шаблоны встали в правильном порядке. перебираем нужный массив идентификаторов
    root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
    root.container.prepend(root[subName].container);    // добавляем к таблице до (prepend)
}); 

    after.forEach(subName => {                            // перебираем нужный массив идентификаторов
    root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
    root.container.append(root[subName].container);    // добавляем шаблон в конец таблицы (append)
});

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener("change", () => {
        onAction()
    }) //Если что-то изменилось в таблице (например, ввели текст или выбрали что-то в select), вызываем onAction().
    
    root.container.addEventListener("reset", () => {
        setTimeout(onAction)
    }) //Когда форма сброшена (reset), нужно чуть подождать (через setTimeout), чтобы поля успели очиститься, и только потом вызвать onAction()
    
    root.container.addEventListener("submit", (e) => {
        e.preventDefault() //предотвратить стандартное поведение
            onAction(e.submitter) //вызов с передачей сабмиттера 
        })

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => { //Преобразуем массив данных в массив DOM-строк.
            const row = cloneTemplate(rowTemplate)//клонировали шаблон строки

        Object.keys(item).forEach(key => { //перебрали по ключам
            if (key in row.elements) {
                const el = row.elements[key];
                const tag = el.tagName.toLowerCase();
                if (tag === "input" || tag === "select") {
                    el.value = item[key]; //если элемент — это поле ввода (input) или выпадающий список (select), значит данные надо записывать в value.
                } else {
                    el.textContent = item[key];//Если элемент не поле формы (например, <td> или <span>), то мы подставляем данные как текстовое содержимое через .textContent.
                }
            }
});
        return row.container; //это корень клонированного шаблона, который будет добавлен в DOM


        })

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}
//console.log(`язык страницы ${render}`)
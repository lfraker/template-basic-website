'use strict';

async function loadSampleTodoData() {
    // Definitely do more robust status checking when querying real APIs :)
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (response.status == 200) {
        return response.json();
    }
    else {
        return [];
    }
}

function populateTodoData(todoList) {
    if ('content' in document.createElement('template')) {
        const listContainer = document.querySelector("#data-container");
        const template = document.querySelector('#data-row');

        todoList.forEach((todo) => {
            const clone = template.content.cloneNode(true);
            let header = clone.querySelector("h2");
            let content = clone.querySelector("p");
            header.textContent = `Todo #${todo.id}`;
            content.textContent = todo.title;

            listContainer.appendChild(clone);
        });

    } else {
        // Find another way to add data to document - HTML template not supported by browser.
    }
}

window.onload = async function () {
    const sampleTodos = await loadSampleTodoData();
    // Only return the first few, no need to show all 200
    populateTodoData(sampleTodos.slice(0, 20));
}

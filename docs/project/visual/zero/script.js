// script.js
document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
document.getElementById('generatePivotTable').addEventListener('click', generatePivotTable);

let originalData = [];
let headers = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const contents = e.target.result;
        originalData = parseCSV(contents);
        headers = Object.keys(originalData[0]);
        createDraggableItems(headers);
    };

    reader.readAsText(file);
}

function parseCSV(contents) {
    const lines = contents.split('\n');
    const headers = lines[0].split(',');

    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index].trim();
        });
        return obj;
    });

    return data;
}

function createDraggableItems(headers) {
    const columnsContainer = document.getElementById('columns');
    columnsContainer.innerHTML = '';

    headers.forEach(header => {
        const item = document.createElement('div');
        item.textContent = header;
        item.classList.add('draggable-item');
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', dragStart);
        columnsContainer.appendChild(item);
    });

    const rowArea = document.getElementById('rowArea');
    const columnArea = document.getElementById('columnArea');
    rowArea.addEventListener('dragover', dragOver);
    rowArea.addEventListener('drop', drop);
    columnArea.addEventListener('dragover', dragOver);
    columnArea.addEventListener('drop', drop);
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.textContent);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const item = document.createElement('div');
    item.textContent = data;
    item.classList.add('draggable-item');
    event.target.appendChild(item);
}

function generatePivotTable() {
    const rowFields = Array.from(document.querySelectorAll('#rowArea .draggable-item')).map(item => item.textContent);
    const columnFields = Array.from(document.querySelectorAll('#columnArea .draggable-item')).map(item => item.textContent);

    if (rowFields.length === 0 || columnFields.length === 0) {
        alert('行と列のフィールドを少なくとも1つずつ選択してください。');
        return;
    }

    const pivotData = crossTabulate(originalData, rowFields, columnFields);
    createPivotTable(pivotData);
}

function crossTabulate(data, rowFields, columnFields) {
    const result = {};
    data.forEach(row => {
        const rowKey = rowFields.map(field => row[field]).join('|');
        const colKey = columnFields.map(field => row[field]).join('|');

        if (!result[rowKey]) result[rowKey] = {};
        if (!result[rowKey][colKey]) result[rowKey][colKey] = 0;
        result[rowKey][colKey] += 1;
    });

    return result;
}

function createPivotTable(pivotData) {
    const container = document.getElementById('pivotTable');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const rowKeys = Object.keys(pivotData);
    const colKeys = Object.keys(rowKeys.length > 0 ? pivotData[rowKeys[0]] : {});

    // Create table headers
    const headerRow = document.createElement('tr');
    const emptyHeader = document.createElement('th');
    emptyHeader.textContent = '';
    headerRow.appendChild(emptyHeader);

    colKeys.forEach(colKey => {
        const th = document.createElement('th');
        th.textContent = colKey;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table rows
    rowKeys.forEach(rowKey => {
        const tr = document.createElement('tr');
        const rowHeader = document.createElement('th');
        rowHeader.textContent = rowKey;
        tr.appendChild(rowHeader);

        colKeys.forEach(colKey => {
            const td = document.createElement('td');
            td.textContent = pivotData[rowKey][colKey] || 0;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

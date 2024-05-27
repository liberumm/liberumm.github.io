let originalData = [];
let filteredData = [];
let groupedData = [];
let sortColumn = '';
let sortOrder = 'asc'; // or 'desc'
const rowsPerPage = 100;
let currentPage = 1;
let currentFile = null;

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('encodingSelect').addEventListener('change', handleEncodingChange);
document.getElementById('prevPageTop').addEventListener('click', prevPage);
document.getElementById('nextPageTop').addEventListener('click', nextPage);
document.getElementById('prevPageBottom').addEventListener('click', prevPage);
document.getElementById('nextPageBottom').addEventListener('click', nextPage);
window.addEventListener('load', handleQueryParams);

function handleFile(event) {
    currentFile = event.target.files[0];
    readFile(currentFile, document.getElementById('encodingSelect').value);
}

function handleEncodingChange() {
    if (currentFile) {
        readFile(currentFile, document.getElementById('encodingSelect').value);
    }
}

function readFile(file, encoding) {
    const textReader = new FileReader();
    textReader.onload = function (e) {
        const csvData = e.target.result;
        Papa.parse(csvData, {
            header: true,
            complete: function (results) {
                originalData = results.data;
                filteredData = originalData;
                groupedData = originalData;
                currentPage = 1;
                populateSelectOptions();
                displayTable();
            }
        });
    };

    textReader.readAsText(file, encoding);
}

function handleQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const csvUrl = urlParams.get('csv');
    const encoding = urlParams.get('encoding') || 'UTF-8';

    if (csvUrl) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(data => {
                Papa.parse(data, {
                    header: true,
                    encoding: encoding,
                    complete: function (results) {
                        originalData = results.data;
                        filteredData = originalData;
                        groupedData = originalData;
                        currentPage = 1;
                        populateSelectOptions();
                        displayTable();
                    }
                });
            });
    }
}

function populateSelectOptions() {
    const groupByContainer = document.getElementById('groupByContainer');
    const aggregateColumnsContainer = document.getElementById('aggregateColumnsContainer');
    groupByContainer.innerHTML = '';
    aggregateColumnsContainer.innerHTML = '';

    if (originalData.length === 0) {
        return;
    }

    const headers = Object.keys(originalData[0]);
    headers.forEach(header => {
        const groupOption = document.createElement('div');
        groupOption.className = 'list-group-item';
        groupOption.innerHTML = `
            <input class="form-check-input me-2" type="checkbox" value="${header}" id="group-${header}">
            <label class="form-check-label" for="group-${header}">
                ${header}
            </label>
        `;
        groupByContainer.appendChild(groupOption);

        const aggregateOption = document.createElement('div');
        aggregateOption.className = 'list-group-item';
        aggregateOption.innerHTML = `
            <input class="form-check-input me-2" type="checkbox" value="${header}" id="aggregate-${header}">
            <label class="form-check-label" for="aggregate-${header}">
                ${header}
            </label>
        `;
        aggregateColumnsContainer.appendChild(aggregateOption);
    });

    dragula([groupByContainer, aggregateColumnsContainer]);
}

function applyGrouping() {
    const groupByColumns = Array.from(document.querySelectorAll('#groupByContainer .form-check-input:checked')).map(input => input.value);
    const aggregateColumns = Array.from(document.querySelectorAll('#aggregateColumnsContainer .form-check-input:checked')).map(input => input.value);

    const grouped = {};
    filteredData.forEach(row => {
        const groupKey = groupByColumns.map(col => row[col]).join(' | ');
        if (!grouped[groupKey]) {
            grouped[groupKey] = { count: 0 };
            aggregateColumns.forEach(col => {
                grouped[groupKey][col] = 0;
            });
        }
        grouped[groupKey].count++;
        aggregateColumns.forEach(col => {
            grouped[groupKey][col] += parseFloat(row[col]) || 0;
        });
    });

    groupedData = Object.keys(grouped).map(key => {
        const row = {};
        const keyParts = key.split(' | ');
        groupByColumns.forEach((col, index) => {
            row[col] = keyParts[index];
        });
        aggregateColumns.forEach(col => {
            row[col] = grouped[key][col];
        });
        return row;
    });

    currentPage = 1;
    displayTable();
}

function displayTable() {
    const tableHeaders = document.getElementById('tableHeaders');
    const filterRow = document.getElementById('filterRow');
    const tableBody = document.getElementById('tableBody');
    const pageInfoTop = document.getElementById('pageInfoTop');
    const pageInfoBottom = document.getElementById('pageInfoBottom');

    tableHeaders.innerHTML = '';
    filterRow.innerHTML = '';
    tableBody.innerHTML = '';
    pageInfoTop.innerHTML = '';
    pageInfoBottom.innerHTML = '';

    if (groupedData.length === 0) {
        pageInfoTop.textContent = 'Page 0/0';
        pageInfoBottom.textContent = 'Page 0/0';
        return;
    }

    const headers = Object.keys(groupedData[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => {
            if (sortColumn === header) {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = header;
                sortOrder = 'asc';
            }
            sortGroupedData();
            displayTable();
        });
        tableHeaders.appendChild(th);

        const filterCell = document.createElement('th');
        let uniqueValues = [...new Set(originalData.map(row => row[header]))];
        uniqueValues = uniqueValues.sort((a, b) => a.localeCompare(b));
        filterCell.innerHTML = `
            <select class="form-select" data-column="${header}">
                <option value="">全て</option>
                ${uniqueValues.map(value => `<option value="${value}">${value}</option>`).join('')}
            </select>
        `;
        filterRow.appendChild(filterCell);
    });

    sortGroupedData();

    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, groupedData.length);
    const pageData = groupedData.slice(startRow, endRow);

    const fragment = document.createDocumentFragment();
    pageData.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        fragment.appendChild(tr);
    });
    tableBody.appendChild(fragment);

    const totalPages = Math.ceil(groupedData.length / rowsPerPage);
    pageInfoTop.textContent = `Page ${currentPage}/${totalPages}`;
    pageInfoBottom.textContent = `Page ${currentPage}/${totalPages}`;

    document.querySelectorAll('#filterRow select').forEach(select => {
        select.addEventListener('change', () => {
            applyFilters();
            applyGrouping();
            displayTable();
        });
    });
}

function sortGroupedData() {
    groupedData.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[sortColumn] > b[sortColumn]) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });
}

function applyFilters() {
    const filters = Array.from(document.querySelectorAll('#filterRow select')).reduce((acc, select) => {
        acc[select.dataset.column] = select.value.toLowerCase();
        return acc;
    }, {});

    filteredData = originalData.filter(row => {
        return Object.keys(filters).every(column => {
            if (filters[column] === '') return true;
            return row[column].toString().toLowerCase().includes(filters[column]);
        });
    });
}

function resetGrouping() {
    filteredData = originalData;
    groupedData = originalData;
    currentPage = 1;
    displayTable();
}

function resetTable() {
    originalData = [];
    filteredData = [];
    groupedData = [];
    currentPage = 1;
    sortColumn = '';
    sortOrder = 'asc';
    document.getElementById('fileInput').value = '';
    document.getElementById('encodingSelect').value = 'UTF-8';
    document.getElementById('groupByContainer').innerHTML = '';
    document.getElementById('aggregateColumnsContainer').innerHTML = '';
    displayTable();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(groupedData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayTable();
    }
}

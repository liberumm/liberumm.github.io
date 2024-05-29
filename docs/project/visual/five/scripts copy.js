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
document.getElementById('pageInputTop').addEventListener('change', goToPage);
document.getElementById('pageInputBottom').addEventListener('change', goToPage);
window.addEventListener('load', handleQueryParams);

document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});
document.getElementById('uploadArea').addEventListener('dragover', (e) => {
    e.preventDefault();
    document.getElementById('uploadArea').classList.add('dragover');
});
document.getElementById('uploadArea').addEventListener('dragleave', () => {
    document.getElementById('uploadArea').classList.remove('dragover');
});
document.getElementById('uploadArea').addEventListener('drop', (e) => {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileInput').files = files;
        handleFile({ target: { files: files } });
    }
});

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
    showLoading();
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
                createFilterOptions();
                displayTable();
                hideLoading();
            },
            error: function() {
                hideLoading();
                alert('CSVの読み込み中にエラーが発生しました。');
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
        showLoading();
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
                        createFilterOptions();
                        displayTable();
                        hideLoading();
                    },
                    error: function() {
                        hideLoading();
                        alert('CSVの読み込み中にエラーが発生しました。');
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

function createFilterOptions() {
    const filterRow = document.getElementById('filterRow');
    filterRow.innerHTML = '';

    if (originalData.length === 0) {
        return;
    }

    const headers = Object.keys(originalData[0]);
    headers.forEach(header => {
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

    document.querySelectorAll('#filterRow select').forEach(select => {
        select.addEventListener('change', () => {
            applyFilters();
            displayTable(); // Ensure table is displayed after filtering
        });
    });
}

function applyGrouping() {
    showLoading();
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
    hideLoading();
}

function displayTable() {
    const tableHeaders = document.getElementById('tableHeaders');
    const filterRow = document.getElementById('filterRow');
    const tableBody = document.getElementById('tableBody');
    const pageInfoTop = document.getElementById('pageInfoTop');
    const pageInfoBottom = document.getElementById('pageInfoBottom');
    const pageInputTop = document.getElementById('pageInputTop');
    const pageInputBottom = document.getElementById('pageInputBottom');

    tableHeaders.innerHTML = '';
    tableBody.innerHTML = '';
    pageInfoTop.innerHTML = '';
    pageInfoBottom.innerHTML = '';

    if (groupedData.length === 0) {
        pageInfoTop.textContent = '0/0';
        pageInfoBottom.textContent = '0/0';
        return;
    }

    const headers = Object.keys(groupedData[0]);
    console.log(`Redrawing table with ${headers.length} columns`);

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => {
            // 並び替える前に現在の列数を取得
            console.log(`Current number of columns before sorting: ${headers.length}`);
            if (sortColumn === header) {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = header;
                sortOrder = 'asc';
            }
            console.log(`Sorting by: ${header}, order: ${sortOrder}`);
            sortGroupedData();
            displayTable();
        });
        tableHeaders.appendChild(th);
    });

    filterRow.innerHTML = '';
    headers.forEach(header => {
        const filterCell = document.createElement('th');
        let uniqueValues = [...new Set(filteredData.map(row => row[header]))];
        uniqueValues = uniqueValues.sort((a, b) => a.localeCompare(b));
        filterCell.innerHTML = `
            <select class="form-select" data-column="${header}">
                <option value="">全て</option>
                ${uniqueValues.map(value => `<option value="${value}">${value}</option>`).join('')}
            </select>
        `;
        filterRow.appendChild(filterCell);
    });

    document.querySelectorAll('#filterRow select').forEach(select => {
        select.addEventListener('change', () => {
            applyFilters();
            displayTable();
        });
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
    pageInfoTop.textContent = `${currentPage}/${totalPages}`; // ここで現在のページ番号と総ページ数を表示
    pageInfoBottom.textContent = `${currentPage}/${totalPages}`; // ここで現在のページ番号と総ページ数を表示
    pageInputTop.max = totalPages;
    pageInputBottom.max = totalPages;
    pageInputTop.value = currentPage;
    pageInputBottom.value = currentPage;
}

function sortGroupedData() {
    console.log(`Sorting data by: ${sortColumn}, order: ${sortOrder}`);
    groupedData.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[sortColumn] > b[sortColumn]) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });
    console.log(`Data sorted by: ${sortColumn}, order: ${sortOrder}`);
}

function applyFilters() {
    showLoading();
    const filters = Array.from(document.querySelectorAll('#filterRow select')).reduce((acc, select) => {
        acc[select.dataset.column] = select.value.toLowerCase();
        return acc;
    }, {});

    filteredData = originalData.filter(row => {
        return Object.keys(filters).every(column => {
            if (filters[column] === '') return true;
            return row[column] != null && row[column].toString().toLowerCase().includes(filters[column]);
        });
    });

    groupedData = filteredData; // Ensure groupedData is updated with filtered data
    currentPage = 1; // Reset to first page after filtering
    hideLoading();
    displayTable(); // Ensure table is displayed after filtering
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
    document.getElementById('filterRow').innerHTML = '';
    displayTable();
}

function resetFilters() {
    document.querySelectorAll('#filterRow select').forEach(select => {
        select.value = '';
    });
    applyFilters();
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

function goToPage(event) {
    const pageInputTop = document.getElementById('pageInputTop');
    const pageInputBottom = document.getElementById('pageInputBottom');
    const totalPages = Math.ceil(groupedData.length / rowsPerPage);
    const newPage = parseInt(event.target.value);

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        pageInputTop.value = newPage;
        pageInputBottom.value = newPage;
        displayTable();
    }
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'block';
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'none';
}

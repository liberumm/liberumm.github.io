let originalData = [];
let workingData = [];
let displayData = [];
let currentDisplayData = [];
let displayedHeaders = [];
let allHeaders = [];
let sortColumn = '';
let sortOrder = 'asc'; // or 'desc'
const rowsPerPage = 100;
let currentPage = 1;
let currentFile = null;
let isGrouped = false; // グループ化の状態を追跡

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
                console.log('CSV読み込み完了:', results.data);
                originalData = results.data;
                workingData = [...originalData];
                displayData = [...workingData];
                allHeaders = Object.keys(originalData[0]);
                currentPage = 1;
                isGrouped = false;
                populateSelectOptions();
                initialDisplayTable(); // 初回は全ての列とデータを表示
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
                        console.log('CSV読み込み完了:', results.data);
                        originalData = results.data;
                        workingData = [...originalData];
                        displayData = [...workingData];
                        allHeaders = Object.keys(originalData[0]);
                        currentPage = 1;
                        isGrouped = false;
                        populateSelectOptions();
                        initialDisplayTable(); // 初回は全ての列とデータを表示
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
    console.log('ヘッダー:', headers);
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
    if (isGrouped) {
        resetGrouping(); // 既にグループ化されている場合はリセットする
    }

    showLoading();
    const groupByColumns = Array.from(document.querySelectorAll('#groupByContainer .form-check-input:checked')).map(input => input.value);
    const aggregateColumns = Array.from(document.querySelectorAll('#aggregateColumnsContainer .form-check-input:checked')).map(input => input.value);

    if (groupByColumns.length === 0 || aggregateColumns.length === 0) {
        alert('グループ化および集計する列を選択してください。');
        hideLoading();
        return;
    }

    const grouped = {};
    workingData.forEach(row => {
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

    workingData = Object.keys(grouped).map(key => {
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

    console.log('グループ化後のデータ:', workingData);
    displayData = [...workingData];
    displayedHeaders = [...groupByColumns, ...aggregateColumns];
    currentPage = 1;
    isGrouped = true;
    updateDisplayData();
    displayTable();
    hideLoading();
}

function updateDisplayData() {
    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, displayData.length);
    currentDisplayData = displayData.slice(startRow, endRow);
}

function initialDisplayTable() {
    displayedHeaders = allHeaders.slice(); // 全てのヘッダーを初期表示
    displayTable(true); // 初回は全ての列を表示
}

function displayTable(showAllColumns = false) {
    const tableHeaders = document.getElementById('tableHeaders');
    const tableBody = document.getElementById('tableBody');
    const pageInfoTop = document.getElementById('pageInfoTop');
    const pageInfoBottom = document.getElementById('pageInfoBottom');
    const pageInputTop = document.getElementById('pageInputTop');
    const pageInputBottom = document.getElementById('pageInputBottom');

    tableHeaders.innerHTML = '';
    tableBody.innerHTML = '';
    pageInfoTop.innerHTML = '';
    pageInfoBottom.innerHTML = '';

    if (workingData.length === 0) {
        pageInfoTop.textContent = '0/0';
        pageInfoBottom.textContent = '0/0';
        return;
    }

    if (showAllColumns) {
        displayedHeaders = allHeaders.slice();
    }
    
    console.log('テーブルヘッダー:', displayedHeaders);
    displayedHeaders.forEach(header => {
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
            sortDisplayData(header);
            updateDisplayData();
            displayTable();
        });
        tableHeaders.appendChild(th);
    });

    updateDisplayData();

    console.log('表示データ:', currentDisplayData);

    const fragment = document.createDocumentFragment();
    currentDisplayData.forEach(row => {
        const tr = document.createElement('tr');
        displayedHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        fragment.appendChild(tr);
    });
    tableBody.appendChild(fragment);

    const totalPages = Math.ceil(displayData.length / rowsPerPage);
    pageInfoTop.textContent = `${currentPage}/${totalPages}`;
    pageInfoBottom.textContent = `${currentPage}/${totalPages}`;
    pageInputTop.max = totalPages;
    pageInputBottom.max = totalPages;
    pageInputTop.value = currentPage;
    pageInputBottom.value = currentPage;
}

function sortDisplayData(columnKey) {
    console.log(`ソート対象のカラム: ${columnKey}`);
    displayData.sort((a, b) => {
        const aValue = a[columnKey] || '';
        const bValue = b[columnKey] || '';
        if (aValue === '' && bValue !== '') return 1; // 空の値を最後に移動
        if (aValue !== '' && bValue === '') return -1; // 空の値を最後に移動
        if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });
    console.log('ソート後のデータ:', displayData);
    updateDisplayData();
    displayTable(); // ソート後にテーブルを再描画
}

function resetGrouping() {
    workingData = [...originalData];
    displayData = [...workingData];
    displayedHeaders = allHeaders.slice();
    currentPage = 1;
    isGrouped = false;
    updateDisplayData();
    displayTable();
}

function resetTable() {
    originalData = [];
    workingData = [];
    displayData = [];
    currentDisplayData = [];
    displayedHeaders = [];
    allHeaders = [];
    currentPage = 1;
    sortColumn = '';
    sortOrder = 'asc';
    isGrouped = false;
    document.getElementById('fileInput').value = '';
    document.getElementById('encodingSelect').value = 'UTF-8';
    document.getElementById('groupByContainer').innerHTML = '';
    document.getElementById('aggregateColumnsContainer').innerHTML = '';
    displayTable();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateDisplayData();
        displayTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(displayData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateDisplayData();
        displayTable();
    }
}

function goToPage(event) {
    const pageInputTop = document.getElementById('pageInputTop');
    const pageInputBottom = document.getElementById('pageInputBottom');
    const totalPages = Math.ceil(displayData.length / rowsPerPage);
    const newPage = parseInt(event.target.value);

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        pageInputTop.value = newPage;
        pageInputBottom.value = newPage;
        updateDisplayData();
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

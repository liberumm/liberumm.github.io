let originalData = [];
let workingData = [];
let displayData = [];
let currentDisplayData = [];
let displayedHeaders = [];
let allHeaders = [];
let filterMode = false; // フィルターモードの状態を追跡
let filters = {};
let sortColumn = '';
let sortOrder = 'asc'; // or 'desc'
const rowsPerPage = 100;
let currentPage = 1;
let currentFile = null;
let isGrouped = false; // グループ化の状態を追跡
let loadingCount = 0;
let loadingInterval = null;

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('encodingSelect').addEventListener('change', handleEncodingChange);
document.getElementById('prevPageTop').addEventListener('click', prevPage);
document.getElementById('nextPageTop').addEventListener('click', nextPage);
document.getElementById('prevPageBottom').addEventListener('click', prevPage);
document.getElementById('nextPageBottom').addEventListener('click', nextPage);
document.getElementById('pageInputTop').addEventListener('change', goToPage);
document.getElementById('pageInputBottom').addEventListener('change', goToPage);
document.getElementById('filterToggle').addEventListener('click', toggleFilterMode); // フィルターモードの切り替えボタン
document.getElementById('applyFilters').addEventListener('click', applyFilters); // フィルター適用ボタン
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
                filters = {};
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
                        filters = {};
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
    const filterRow = document.getElementById('filterRow');
    const tableBody = document.getElementById('tableBody');
    const pageInfoTop = document.getElementById('pageInfoTop');
    const pageInfoBottom = document.getElementById('pageInfoBottom');
    const pageInputTop = document.getElementById('pageInputTop');
    const pageInputBottom = document.getElementById('pageInputBottom');

    tableHeaders.innerHTML = '';
    filterRow.innerHTML = '';
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
    if (filterMode) {
        displayedHeaders.forEach(header => {
            const filterCell = document.createElement('th');
            const uniqueValues = [...new Set(displayData.map(row => row[header]))].sort();
            const filterSelect = document.createElement('input');
            filterSelect.className = 'form-control filter-select';
            filterSelect.setAttribute('list', `datalist-${header}`);
            filterSelect.dataset.column = header;
            const dataList = document.createElement('datalist');
            dataList.id = `datalist-${header}`;
            dataList.innerHTML = `
                ${uniqueValues.map(value => `<option value="${value}"></option>`).join('')}
            `;
            filterCell.appendChild(filterSelect);
            filterCell.appendChild(dataList);
            filterRow.appendChild(filterCell);
        });
    }

    displayedHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => {
            showLoading(); // ソート開始時にローディング表示
            setTimeout(() => {
                if (sortColumn === header) {
                    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    sortColumn = header;
                    sortOrder = 'asc';
                }
                sortDisplayData(header);
                hideLoading(); // ソート完了後にローディング表示を隠す
            }, 0);
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
            td.addEventListener('dblclick', () => {
                filters[header] = row[header];
                applyFilters();
            });
            tr.appendChild(td);
        });
        fragment.appendChild(tr);
    });
    tableBody.appendChild(fragment);

    const totalPages = Math.ceil(displayData.length / rowsPerPage);
    pageInfoTop.textContent = `/ ${totalPages}`;
    pageInfoBottom.textContent = `/ ${totalPages}`;
    pageInputTop.max = totalPages;
    pageInputBottom.max = totalPages;
    pageInputTop.value = currentPage;
    pageInputBottom.value = currentPage;
}

function sortDisplayData(columnKey) {
    showLoading(); // ソート開始時にローディング表示
    console.log(`ソート対象のカラム: ${columnKey}`);
    setTimeout(() => {
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
        hideLoading(); // ソート完了後にローディング表示を隠す
    }, 0);
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
    filters = {};
    document.getElementById('fileInput').value = '';
    document.getElementById('encodingSelect').value = 'UTF-8';
    document.getElementById('groupByContainer').innerHTML = '';
    document.getElementById('aggregateColumnsContainer').innerHTML = '';
    displayTable();
}

function prevPage() {
    if (currentPage > 1) {
        showLoading(); // ページ切り替え開始時にローディング表示
        setTimeout(() => {
            currentPage--;
            updateDisplayData();
            displayTable();
            hideLoading(); // ページ切り替え完了後にローディング表示を隠す
        }, 0);
    }
}

function nextPage() {
    const totalPages = Math.ceil(displayData.length / rowsPerPage);
    if (currentPage < totalPages) {
        showLoading(); // ページ切り替え開始時にローディング表示
        setTimeout(() => {
            currentPage++;
            updateDisplayData();
            displayTable();
            hideLoading(); // ページ切り替え完了後にローディング表示を隠す
        }, 0);
    }
}

function goToPage(event) {
    const pageInputTop = document.getElementById('pageInputTop');
    const pageInputBottom = document.getElementById('pageInputBottom');
    const totalPages = Math.ceil(displayData.length / rowsPerPage);
    const newPage = parseInt(event.target.value);

    if (newPage >= 1 && newPage <= totalPages) {
        showLoading(); // ページ切り替え開始時にローディング表示
        setTimeout(() => {
            currentPage = newPage;
            pageInputTop.value = newPage;
            pageInputBottom.value = newPage;
            updateDisplayData();
            displayTable();
            hideLoading(); // ページ切り替え完了後にローディング表示を隠す
        }, 0);
    }
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'block';
    const loadingCountElement = document.getElementById('loadingCount');
    loadingCount = 0;
    loadingCountElement.textContent = loadingCount;
    loadingInterval = setInterval(() => {
        loadingCount++;
        loadingCountElement.textContent = loadingCount;
    }, 100); // 0.1秒ごとにカウントアップ
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    clearInterval(loadingInterval);
}

function toggleFilterMode() {
    filterMode = !filterMode;
    filters = {};
    displayTable(); // フィルターモードを切り替えるときにテーブルを再描画
}

function applyFilters() {
    showLoading();
    setTimeout(() => {
        const filterSelects = document.querySelectorAll('#filterRow input');
        filterSelects.forEach(select => {
            const column = select.dataset.column;
            const value = select.value;
            if (value) {
                filters[column] = value;
            } else {
                delete filters[column];
            }
        });

        displayData = workingData.filter(row => {
            return Object.keys(filters).every(column => {
                return row[column] === filters[column];
            });
        });

        currentPage = 1;
        updateDisplayData();
        displayTable();
        hideLoading();
    }, 0);
}

function resetFilters() {
    filters = {};
    displayData = [...workingData];
    currentPage = 1;
    updateDisplayData();
    displayTable();
}

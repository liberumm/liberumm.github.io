// app.js

document.getElementById('storeMasterDropArea').addEventListener('dragover', handleDragOver);
document.getElementById('storeMasterDropArea').addEventListener('dragleave', handleDragLeave);
document.getElementById('storeMasterDropArea').addEventListener('drop', (event) => handleDrop(event, 'storeMaster'));

document.getElementById('storeCoefficientDropArea').addEventListener('dragover', handleDragOver);
document.getElementById('storeCoefficientDropArea').addEventListener('dragleave', handleDragLeave);
document.getElementById('storeCoefficientDropArea').addEventListener('drop', (event) => handleDrop(event, 'storeCoefficient'));

document.getElementById('productListDropArea').addEventListener('dragover', handleDragOver);
document.getElementById('productListDropArea').addEventListener('dragleave', handleDragLeave);
document.getElementById('productListDropArea').addEventListener('drop', (event) => handleDrop(event, 'productList'));

// Initial setup
adjustStoreColumns(10);
adjustRowCount(1);

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('hover');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('hover');
}

function handleDrop(event, type) {
    event.preventDefault();
    event.currentTarget.classList.remove('hover');
    handleFiles(event, type);
}

function handleFiles(event, type) {
    let files;
    if (event.type === 'drop') {
        files = event.dataTransfer.files;
    } else {
        files = event.target.files;
    }

    if (files.length === 0) return;

    const file = files[0];
    document.getElementById(`${type}FileName`).textContent = `読み込んだファイル名: ${file.name}`;
    importData(file, type);
}

function importData(file, type) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // 各シートのデータを取得
        const sheetNames = workbook.SheetNames;

        // 各シートをテーブルに表示
        sheetNames.forEach(sheetName => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            createTable(sheetName, sheetData, type);
        });
    };
    reader.readAsArrayBuffer(file);
}

function createTable(sheetName, data, type) {
    const container = document.getElementById('tables');

    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('mt-4');

    const tableTitle = document.createElement('h4');
    tableTitle.textContent = `${sheetName} (${type})`;
    tableWrapper.appendChild(tableTitle);

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered');
    
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach(cell => {
            const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
            cellElement.textContent = cell;
            tr.appendChild(cellElement);
        });

        if (rowIndex === 0) {
            thead.appendChild(tr);
        } else {
            tbody.appendChild(tr);
        }
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
}

function downloadTemplate(templateType) {
    const templates = {
        "storeMaster": {name: "店舗マスタ", columns: ["店舗コード", "店舗名", "グループ"]},
        "storeCoefficient": {name: "店舗係数マスタ", columns: ["店舗コード", "店舗名", "係数パターン1", "係数パターン2", "係数パターン3"]},
        "productList": {name: "商品リスト", columns: ["商品コード", "商品名", "総数"]}
    };

    const template = templates[templateType];
    const worksheet = XLSX.utils.aoa_to_sheet([template.columns]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, template.name);
    XLSX.writeFile(workbook, `${template.name}.xlsx`);
}

function addRow() {
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const templateRow = document.getElementById('templateRow').cloneNode(true);
    templateRow.id = '';
    templateRow.cells[0].textContent = table.rows.length + 1;
    Array.from(templateRow.querySelectorAll('input')).forEach(input => {
        input.value = '';
        input.addEventListener('input', validateAndCalculateTotal);
    });
    table.appendChild(templateRow);
}

function adjustRowCount(count) {
    document.getElementById('rowCountDisplay').textContent = count;
    document.getElementById('rowCount').value = count;
    document.getElementById('rowCountSlider').value = count;

    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const currentRowCount = table.rows.length;

    if (count > currentRowCount) {
        for (let i = currentRowCount; i < count; i++) {
            addRow();
        }
    } else if (count < currentRowCount) {
        for (let i = currentRowCount; i > count; i--) {
            table.deleteRow(-1);
        }
    }
}

function adjustStoreColumns(count) {
    document.getElementById('storeCountDisplay').textContent = count;
    document.getElementById('storeCount').value = count;
    document.getElementById('storeCountSlider').value = count;

    const headerRow1 = document.getElementById('headerRow1');
    const headerRow2 = document.getElementById('headerRow2');
    const tbody = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];

    // Clear existing store columns
    while (headerRow1.cells.length > 7) {
        headerRow1.deleteCell(-1);
    }
    while (headerRow2.cells.length > 0) {
        headerRow2.deleteCell(-1);
    }

    // Add new store columns
    for (let i = 1; i <= count; i++) {
        const newHeader1 = document.createElement('th');
        newHeader1.textContent = '店舗';
        headerRow1.appendChild(newHeader1);

        const newHeader2 = document.createElement('th');
        newHeader2.innerHTML = `<input type="text" class="form-control" placeholder="店舗${i} 名">`;
        headerRow2.appendChild(newHeader2);
    }

    // Adjust rows
    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        while (row.cells.length > 7) {
            row.deleteCell(-1);
        }
        for (let j = 0; j < count; j++) {
            const newCell = row.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('form-control', 'table-input');
            input.min = 0;
            input.setAttribute('oninput', 'validateAndCalculateTotal(this)');
            newCell.appendChild(input);
        }
    }
}

function validateAndCalculateTotal(element) {
    // Validate input to ensure only non-negative integers
    if (element.value < 0) {
        element.value = 0;
    } else if (!Number.isInteger(parseFloat(element.value))) {
        element.value = Math.floor(element.value);
    }

    // 合計を再計算
    const row = element.closest('tr');
    updateTotal(row);
}

function updateTotal(row) {
    const cells = row.querySelectorAll('td input[type="number"]');
    let total = 0;

    cells.forEach((cell, index) => {
        // 4番目のセル以降を合計に含める
        if (index >= 3 && !isNaN(cell.value) && cell.value !== '') {
            total += parseInt(cell.value);
        }
    });

    // 合計値を初期化して設定する
    const totalCell = row.cells[6].querySelector('input');
    if (totalCell) {
        totalCell.value = total;
    }
}

function clearTable() {
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        Array.from(row.querySelectorAll('input')).forEach(input => {
            input.value = '';
        });
    }
}

function clearStoreQuantities() {
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        Array.from(row.querySelectorAll('td input[type="number"]')).forEach((input, index) => {
            if (index >= 3) {
                input.value = '';
            }
        });
        updateTotal(row);
    }
}

function setDeliveryDate() {
    const date = document.getElementById('deliveryDate').value;
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        const dateInput = row.querySelector('td:nth-child(2) input[type="date"]');
        if (dateInput) {
            dateInput.value = date;
        }
    }
}

function exportTableToExcel() {
    const table = document.getElementById('allocationTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(workbook, 'table.xlsx');
}

function exportTableToCSV() {
    const table = document.getElementById('allocationTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets["Sheet1"]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "table.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

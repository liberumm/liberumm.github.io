// app.js

let storeCoefficients = {}; // 店舗係数を保存するオブジェクト
let storeMaster = []; // 店舗マスタを保存する配列
let coefficientPatterns = []; // 係数パターン名を保存する配列


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
document.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);

    // 店舗マスタ
    const storeMasterFile = urlParams.get('storeMasterFile');
    if (storeMasterFile) {
        fetchFileAndImport(storeMasterFile, 'storeMaster');
    }

    // 店舗係数マスタ
    const storeCoefficientFile = urlParams.get('storeCoefficientFile');
    if (storeCoefficientFile) {
        fetchFileAndImport(storeCoefficientFile, 'storeCoefficient');
    }

    // 商品リスト
    const productListFile = urlParams.get('productListFile');
    if (productListFile) {
        fetchFileAndImport(productListFile, 'productList');
    }

    // 行数
    const rowCount = urlParams.get('rowCount');
    if (rowCount) {
        adjustRowCount(parseInt(rowCount));
    }

    // 列数
    const storeCount = urlParams.get('storeCount');
    if (storeCount) {
        adjustStoreColumns(parseInt(storeCount));
    } else {
        adjustStoreColumns(10); // Default columns count
    }

    // Default row count
    if (!rowCount) {
        adjustRowCount(1);
    }
});

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
        const isCSV = file.name.endsWith('.csv');
        if (isCSV) {
            const text = new TextDecoder('utf-8').decode(data);
            const workbook = XLSX.read(text, { type: 'string' });
            processWorkbook(workbook, type);
        } else {
            const workbook = XLSX.read(data, { type: 'array', codepage: 932 }); // JIS encoding for Excel
            processWorkbook(workbook, type);
        }
    };
    if (file.name.endsWith('.csv')) {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

function processWorkbook(workbook, type) {
    if (type === 'storeMaster') {
        parseStoreMaster(workbook);
        adjustStoreColumns(storeMaster.length);
    } else if (type === 'storeCoefficient') {
        storeCoefficients = parseStoreCoefficients(workbook);
    }
    const sheetNames = workbook.SheetNames;
    sheetNames.forEach(sheetName => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        createTable(sheetName, sheetData, type);
    });
}

function fetchFileAndImport(fileName, type) {
    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const isCSV = fileName.endsWith('.csv');
            if (isCSV) {
                const text = new TextDecoder('utf-8').decode(data);
                const workbook = XLSX.read(text, { type: 'string' });
                processWorkbook(workbook, type);
            } else {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array', codepage: 932 }); // JIS encoding for Excel
                processWorkbook(workbook, type);
            }
        })
        .catch(error => {
            console.error('Error fetching file:', error);
        });
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

    // マスタデータの場合、storeCoefficientsを更新
    if (type === 'storeCoefficient') {
        updateStoreCoefficients(data);
    }
}

function updateStoreCoefficients(data) {
    // Assume first row is header
    const headers = data[0];
    data.slice(1).forEach(row => {
        const storeCode = row[headers.indexOf('店舗コード')];
        storeCoefficients[storeCode] = {};
        headers.forEach((header, index) => {
            if (header !== '店舗コード' && header !== '店舗名') {
                storeCoefficients[storeCode][header] = parseFloat(row[index]);
            }
        });
    });
}

function downloadTemplate(templateType, fileType) {
    const templates = {
        "storeMaster": {name: "店舗マスタ", columns: ["店舗コード", "店舗名", "グループ"]},
        "storeCoefficient": {name: "店舗係数マスタ", columns: ["店舗コード", "店舗名", "係数パターン1", "係数パターン2", "係数パターン3"]},
        "productList": {name: "商品リスト", columns: ["納品日", "商品コード", "係数パターン", "配分数"]}
    };

    const template = templates[templateType];
    const worksheet = XLSX.utils.aoa_to_sheet([template.columns]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, template.name);
    
    if (fileType === 'xlsx') {
        XLSX.writeFile(workbook, `${template.name}.xlsx`);
    } else if (fileType === 'csv') {
        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[template.name]);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${template.name}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function addRow() {
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const templateRow = document.getElementById('templateRow').cloneNode(true);
    templateRow.id = '';
    templateRow.cells[1].textContent = table.rows.length + 1;
    Array.from(templateRow.querySelectorAll('input')).forEach(input => {
        input.value = '';
        input.addEventListener('input', validateAndCalculateTotal);
    });
    templateRow.querySelector('td:nth-child(11) input').addEventListener('input', setRowQuantities); // 一括数量の入力フィールドにイベントリスナーを追加
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
    while (headerRow1.cells.length > 17) { // 16 columns + clear button column
        headerRow1.deleteCell(-1);
    }
    while (headerRow2.cells.length > 0) {
        headerRow2.deleteCell(-1);
    }


    // Add new store columns
    for (let i = 1; i <= count; i++) {
        const newHeader1 = document.createElement('th');
        const newHeader2 = document.createElement('th');

        if (storeMaster.length > 0 && storeMaster[i - 1]) {
            newHeader1.innerHTML = `<input type="text" class="form-control" value="${storeMaster[i - 1].name}" disabled>`;
            newHeader2.innerHTML = `<input type="text" class="form-control" value="${storeMaster[i - 1].code}" disabled>`;
        } else {
            newHeader1.innerHTML = `<input type="text" class="form-control" placeholder="店舗${i} 名">`;
            newHeader2.innerHTML = `<input type="text" class="form-control" placeholder="店舗${i} コード">`;
        }

        headerRow1.appendChild(newHeader1);
        headerRow2.appendChild(newHeader2);
    }

    // Add "再合計" header
    const extraTotalHeader = document.createElement('th');
    extraTotalHeader.textContent = '再合計';
    headerRow2.appendChild(extraTotalHeader);

    // Adjust rows
    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        while (row.cells.length > 17) { // 16 columns + clear button column
            row.deleteCell(-1);
        }
        for (let j = 0; j < count; j++) {
            const newCell = row.insertCell(row.cells.length); // Insert before the last cell (which is the total cell)
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('form-control', 'table-input');
            input.min = 0;
            input.setAttribute('oninput', 'validateAndCalculateTotal(this)');
            newCell.appendChild(input);
        }
        // Add extra total cell at the end
        const extraTotalCell = row.insertCell(row.cells.length);
        const extraTotalInput = document.createElement('input');
        extraTotalInput.type = 'number';
        extraTotalInput.classList.add('form-control', 'table-input');
        extraTotalInput.disabled = true;
        extraTotalCell.appendChild(extraTotalInput);
    }
}

function setRowQuantities(element) {
    const quantity = parseInt(element.value);
    if (isNaN(quantity) || quantity < 0) return;

    const row = element.closest('tr');
    const cells = row.querySelectorAll('td input[type="number"]');
    cells.forEach((cell, index) => {
        if (index >= 5 && index < cells.length - 1) { // 配分数以降のセルに数量を設定（導入店舗数、合計セルを除く）
            cell.value = quantity;
        }
    });
    updateTotal(row);
}

function validateAndCalculateTotal(element) {
    // Validate input to ensure only non-negative integers
    if (element.value < 0) {
        element.value = 0;
    } else if (!Number.isInteger(parseFloat(element.value))) {
        element.value = Math.floor(element.value);
    }

    // 合計を再計算
    //const row = element.closest('tr');
    //updateTotal(row);
}

function updateTotal(row) {
    const cells = row.querySelectorAll('td input[type="number"]');
    let total = 0;
    let storeCount = 0;

    cells.forEach((cell, index) => {
        // 配分数の次のセル以降を合計に含める（クリアボタン、No、納品日、商品コード、商品名、原価、売価、係数パターン、配分数、単位、最低導入数、一括数量の後）
        if (index >= 9 && index < cells.length - 1 && !isNaN(cell.value) && cell.value !== '') {
            total += parseInt(cell.value);
            if (parseInt(cell.value) > 0) {
                storeCount++;
            }
        }
    });
    console.log(storeCount);
    console.log(total);


    // 原価計、売価計、値入率の計算
    const cost = parseFloat(row.querySelector('td:nth-child(6) input').value) || 0;
    const price = parseFloat(row.querySelector('td:nth-child(7) input').value) || 0;
    const costTotal = cost * total;
    const priceTotal = price * total;
    const grossMargin = price !== 0 ? 1 - (cost / price) : 0;

    // 合計値と導入店舗数を初期化して設定する
    const totalCell = row.cells[16].querySelector('input'); // 合計セル
    const storeCountCell = row.cells[15].querySelector('input'); // 導入店舗数セル
    const costTotalCell = row.cells[12].querySelector('input'); // 原価計セル
    const priceTotalCell = row.cells[13].querySelector('input'); // 売価計セル
    const grossMarginCell = row.cells[14].querySelector('input'); // 値入率セル
    const extraTotalCell = row.cells[row.cells.length - 1].querySelector('input'); // 最終セル
    
    if (totalCell) {
        totalCell.value = total;
    }
    if (storeCountCell) {
        storeCountCell.value = storeCount;
    }
    if (costTotalCell) {
        costTotalCell.value = costTotal.toFixed(1);
    }
    if (priceTotalCell) {
        priceTotalCell.value = priceTotal.toFixed(1);
    }
    if (grossMarginCell) {
        grossMarginCell.value = (grossMargin * 100).toFixed(1) + '%';
    }
    if (extraTotalCell) {
        extraTotalCell.value = total;
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
            if (index >= 5) {
                input.value = '';
            }
        });
        updateTotal(row);
    }
}

function clearRowQuantities(button) {
    const row = button.closest('tr');
    Array.from(row.querySelectorAll('td input[type="number"]')).forEach((input, index) => {
        if (index >= 5) {
            input.value = '';
        }
    });
    updateTotal(row);
}

function setDeliveryDate() {
    const date = document.getElementById('deliveryDate').value;
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        const dateInput = row.querySelector('td:nth-child(3) input[type="date"]');
        if (dateInput) {
            dateInput.value = date;
        }
    }
}
function exportTableToExcel() {
    const table = document.getElementById('allocationTable');
    const workbook = XLSX.utils.book_new();
    const ws_data = [];

    // ヘッダー行を取得
    const headerRow1 = Array.from(document.getElementById('headerRow1').cells).map(cell => cell.innerText || cell.querySelector('input')?.value || "");
    const headerRow2 = Array.from(document.getElementById('headerRow2').cells).map(cell => cell.querySelector('input')?.value || "");

    // オフセットを調整
    const offset = headerRow1.length - headerRow2.length;
    for (let i = 0; i < offset; i++) {
        headerRow2.unshift("");
    }

    // カスタムヘッダーを作成
    const customHeaders = ["", "No", "納品日", "商品コード", "係数パターン", "配分数", "単位", "最低導入数", "一括数量", "導入店舗数", "合計"];
    const storeHeaders = headerRow2.slice(10).map((storeCode, index) => {
        const storeName = headerRow1[10 + index];
        return `${storeCode}_${storeName}`;
    });

    const combinedHeaderRow = customHeaders.concat(storeHeaders);
    ws_data.push(combinedHeaderRow);

    // 各行のデータを取得
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let row of rows) {
        const rowData = Array.from(row.getElementsByTagName('td')).map(cell => {
            const input = cell.querySelector('input');
            return input ? input.value : cell.innerText;
        });
        ws_data.push(rowData);
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");
    XLSX.writeFile(workbook, 'table.xlsx');
}

function exportTableToCSV() {
    const table = document.getElementById('allocationTable');
    const workbook = XLSX.utils.book_new();
    const ws_data = [];

    // ヘッダー行を取得
    const headerRow1 = Array.from(document.getElementById('headerRow1').cells).map(cell => cell.innerText || cell.querySelector('input')?.value || "");
    const headerRow2 = Array.from(document.getElementById('headerRow2').cells).map(cell => cell.querySelector('input')?.value || "");

    // オフセットを調整
    const offset = headerRow1.length - headerRow2.length;
    for (let i = 0; i < offset; i++) {
        headerRow2.unshift("");
    }

    // カスタムヘッダーを作成
    const customHeaders = ["", "No", "納品日", "商品コード", "係数パターン", "配分数", "単位", "最低導入数", "一括数量", "導入店舗数", "合計"];
    const storeHeaders = headerRow2.slice(10).map((storeCode, index) => {
        const storeName = headerRow1[10 + index];
        return `${storeCode}_${storeName}`;
    });

    const combinedHeaderRow = customHeaders.concat(storeHeaders);
    ws_data.push(combinedHeaderRow);

    // 各行のデータを取得
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let row of rows) {
        const rowData = Array.from(row.getElementsByTagName('td')).map(cell => {
            const input = cell.querySelector('input');
            return input ? input.value : cell.innerText;
        });
        ws_data.push(rowData);
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const csv = XLSX.utils.sheet_to_csv(ws);
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

//配分計算
function distributeAllocations() {
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        const allocation = parseInt(row.cells[8].querySelector('input').value);
        const unit = parseInt(row.cells[9].querySelector('input').value);
        const coefficientPattern = row.cells[7].querySelector('input').value;
        const minimumAllocation = parseInt(row.cells[10].querySelector('input').value);

        if (isNaN(allocation) || isNaN(unit) || allocation <= 0 || unit <= 0) continue;

        const totalStores = row.cells.length - 18;
        const totalQuantity = Math.floor(allocation / unit); // 総仮配分数
        let remainder = totalQuantity;

        // デバッグ用ログ
        console.log(`Total Quantity: ${totalQuantity}`);
        console.log(`Remainder: ${remainder}`);

        const coefficients = getStoreCoefficients(coefficientPattern, totalStores, row);

        // デバッグ用ログ
        console.log(`Coefficients: ${coefficients}`);

        let allocatedQuantities = Array(totalStores).fill(0);

        // 配分構成比を計算
        let totalCoefficient = coefficients.reduce((sum, coeff) => sum + coeff, 0);

        // 仮配分数の割り当て
        coefficients.forEach((coeff, index) => {
            let quantity = Math.floor((coeff / totalCoefficient) * totalQuantity);
            allocatedQuantities[index] = quantity;
            remainder -= quantity;
        });

        // 余剰の確認
        // デバッグ用ログ
        console.log(`Initial Allocated Quantities: ${allocatedQuantities}`);
        console.log(`Remainder after initial allocation: ${remainder}`);

        // 余剰があった場合、余剰の配分
        if (remainder > 0) {
            let index = 0;
            while (remainder > 0) {
                allocatedQuantities[index]++;
                remainder--;
                index = (index + 1) % totalStores;  // ストア0から順に配分
            }
        }

        // 各ストアのセルに本配分数を反映
        allocatedQuantities.forEach((quantity, index) => {
            const cell = row.cells[17 + index].querySelector('input');
            cell.value = quantity * unit; // 仮配分数＋余剰配分 に単位を掛けた本配分数
        });
    
        // デバッグ用ログ
        console.log(`Final Allocated Quantities: ${allocatedQuantities}`);

        updateTotal(row);
    }
}

function getStoreCoefficients(pattern, totalStores, row) {
    const coefficients = Array(totalStores).fill(1); // Default coefficients are all 1
    console.log(coefficients);
    const storeCodes = Array.from(document.querySelectorAll('#headerRow2 th input')).map(input => input.value);

    storeCodes.forEach((storeCode, index) => {
        if (storeCoefficients[storeCode] && storeCoefficients[storeCode][pattern] !== undefined) {
            coefficients[index] = storeCoefficients[storeCode][pattern];
        }
    });

    return coefficients;
}

function parseStoreMaster(workbook) {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    storeMaster = data.slice(1).map(row => ({
        code: row[0],
        name: row[1]
    }));
}


function parseStoreCoefficients(workbook) {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headers = data[0].slice(2); // 最初の2列（店舗コードと店舗名）を除く
    const coefficients = {};

    data.slice(1).forEach(row => {
        const storeCode = row[0];
        coefficients[storeCode] = {};
        headers.forEach((header, index) => {
            coefficients[storeCode][header] = row[index + 2];
        });
    });

    coefficientPatterns = headers; // 係数パターン名を保存
    storeMaster = data.slice(1).map(row => ({
        code: row[0],
        name: row[1]
    }));

    updateCoefficientPatternOptions();
    adjustStoreColumns(storeMaster.length);

    return coefficients;
}

function updateCoefficientPatternOptions() {
    const rows = document.querySelectorAll('#allocationTable tbody tr');
    rows.forEach(row => {
        const select = row.querySelector('td:nth-child(5) select');
        if (select) {
            // 既存の選択肢をクリア
            select.innerHTML = '';

            // 新しい選択肢を追加
            coefficientPatterns.forEach(pattern => {
                const option = document.createElement('option');
                option.value = pattern;
                option.text = pattern;
                select.appendChild(option);
            });
        }
    });
}


document.getElementById('allocateButton').addEventListener('click', () => {
    const table = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    for (let row of rows) {
        distributeAllocations(row);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const inputs = Array.from(document.querySelectorAll('#headerRow2 th input'));
    console.log(inputs); // デバッグ用: すべての input 要素を表示
    const storeCodes = inputs.map(input => input.value);
    console.log(storeCodes); // デバッグ用: すべてのストアコードを表示
});



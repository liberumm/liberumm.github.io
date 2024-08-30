let storeRatios = {};
let storeMaster = {};
let productList = [];

const defaultFiles = {
    storeRatioFile: 'default/storeRatioFile.csv',
    storeMasterFile: 'default/storeMasterFile.csv',
    productFile: 'default/productFile.csv'
};

document.addEventListener("DOMContentLoaded", function() {
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(dropZone => {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false)
        });

        function preventDefaults (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false)
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false)
        });

        function highlight(e) {
            dropZone.classList.add('highlight');
        }

        function unhighlight(e) {
            dropZone.classList.remove('highlight');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files, dropZone);
        }

        function handleFiles(files, dropZone) {
            if (files.length === 0) return;
            const file = files[0];
            const fileNameDiv = document.getElementById(dropZone.id.replace('DropZone', 'FileName'));
            fileNameDiv.textContent = `ファイル名: ${file.name}`;
            handleFileUpload(file, data => {
                if (dropZone.id === "storeRatioDropZone") {
                    storeRatios = data;
                } else if (dropZone.id === "storeMasterDropZone") {
                    storeMaster = data;
                } else if (dropZone.id === "productDropZone") {
                    productList = data;
                    executeDistribution();
                }
            });
        }
    });

    function processData(data, dropZone) {
        // ファイルの処理を行うコードを記述する
        console.log(dropZone.id + "にファイルがアップロードされました。");
    }
});

function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queries = queryString.split("&");
    queries.forEach(query => {
        const [key, value] = query.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}

function fetchFile(filePath, callback, fileType = 'csv') {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            if (fileType === 'csv') {
                callback(Papa.parse(data, { header: true }).data);
            } else if (fileType === 'excel') {
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[firstSheetName];
                callback(XLSX.utils.sheet_to_json(sheet, { header: 1 }));
            }
        });
}

function handleFileUpload(file, callback) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const contents = e.target.result;
        if (file.type === "text/csv") {
            callback(Papa.parse(contents, { header: true }).data);
        } else if (file.type.includes("spreadsheetml") || file.type.includes("excel")) {
            const workbook = XLSX.read(contents, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];
            callback(XLSX.utils.sheet_to_json(sheet, { header: 1 }));
        }
    };

    if (file.type === "text/csv") {
        reader.readAsText(file);
    } else if (file.type.includes("spreadsheetml") || file.type.includes("excel")) {
        reader.readAsBinaryString(file);
    }
}

function distribute() {
    const params = getQueryParams();

    const storeRatioFile = params.storeRatioFile || defaultFiles.storeRatioFile;
    const storeMasterFile = params.storeMasterFile || defaultFiles.storeMasterFile;
    const productFile = params.productFile || defaultFiles.productFile;

    const storeRatioFileType = storeRatioFile.endsWith('.csv') ? 'csv' : 'excel';
    const storeMasterFileType = storeMasterFile.endsWith('.csv') ? 'csv' : 'excel';
    const productFileType = productFile.endsWith('.csv') ? 'csv' : 'excel';

    document.getElementById('storeRatioFileName').textContent = `ファイル名: ${storeRatioFile}`;
    document.getElementById('storeMasterFileName').textContent = `ファイル名: ${storeMasterFile}`;
    document.getElementById('productFileName').textContent = `ファイル名: ${productFile}`;

    fetchFile(storeRatioFile, data => {
        data.forEach(row => {
            const storeCode = row['店舗コード'];
            storeRatios[storeCode] = row;
        });
    }, storeRatioFileType);

    fetchFile(storeMasterFile, data => {
        data.forEach(row => {
            const storeCode = row['店舗コード'];
            storeMaster[storeCode] = row['店舗名'];
        });
    }, storeMasterFileType);

    fetchFile(productFile, data => {
        productList = data.map(row => ({
            deliveryDate: row['納品日'],
            ratioPattern: row['係数パターン'],
            productCode: row['商品コード'],
            productName: row['商品名'],
            cost: row['原価'],
            price: row['売価'],
            distributionQuantity: parseInt(row['配荷数量'])
        }));

        executeDistribution();
    }, productFileType);
}

function executeDistribution() {
    // 配分ロジックをここに記述
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    productList.forEach(product => {
        const ratioPattern = product.ratioPattern;
        const totalQuantity = product.distributionQuantity;

        let totalRatio = 0;
        const storeQuantities = [];

        for (let storeCode in storeRatios) {
            if (storeRatios[storeCode][ratioPattern]) {
                totalRatio += parseFloat(storeRatios[storeCode][ratioPattern]);
                storeQuantities.push({
                    storeCode,
                    ratio: parseFloat(storeRatios[storeCode][ratioPattern])
                });
            }
        }

        storeQuantities.forEach(storeQuantity => {
            storeQuantity.quantity = Math.floor(totalQuantity * (storeQuantity.ratio / totalRatio));
        });

        let remainingQuantity = totalQuantity - storeQuantities.reduce((sum, sq) => sum + sq.quantity, 0);
        storeQuantities.sort((a, b) => b.quantity - a.quantity);
        storeQuantities[0].quantity += remainingQuantity;

        storeQuantities.forEach(storeQuantity => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${storeQuantity.storeCode}</td><td>${storeMaster[storeQuantity.storeCode]}</td><td>${storeQuantity.quantity}</td>`;
            resultsBody.appendChild(row);
        });
    });
}

let storeRatios = {};
let storeMaster = {};
let productList = [];

const defaultFiles = {
    storeRatioFile: 'default/storeRatioFile.csv',
    storeMasterFile: 'default/storeMasterFile.csv',
    productFile: 'default/productFile.csv'
};

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

function handleFileUpload(fileInput, callback) {
    const file = fileInput.files[0];
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

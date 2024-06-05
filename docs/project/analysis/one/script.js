document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('csvFileInput');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInput = document.getElementById('pageInput');
    const totalPagesElement = document.getElementById('totalPages');

    const prevPageButtonBottom = document.getElementById('prevPageBottom');
    const nextPageButtonBottom = document.getElementById('nextPageBottom');
    const pageInputBottom = document.getElementById('pageInputBottom');
    const totalPagesElementBottom = document.getElementById('totalPagesBottom');
    const encodingSelect = document.getElementById('encodingSelect');

    const xFieldSelect = document.getElementById('xFieldSelect');
    const yFieldSelect = document.getElementById('yFieldSelect');
    const seriesFieldSelect = document.getElementById('seriesFieldSelect');
    const degreeSlider = document.getElementById('degreeSlider');
    const degreeValue = document.getElementById('degreeValue');

    const groupFieldSelect = document.getElementById('groupFieldSelect');
    const aggregateFieldSelect = document.getElementById('aggregateFieldSelect');

    let currentFile = null;

    degreeSlider.addEventListener('input', () => {
        degreeValue.textContent = degreeSlider.value;
    });

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('dragover');
        const files = event.dataTransfer.files;
        if (files.length) {
            console.log("File dropped.");
            currentFile = files[0];
            loadFile({ target: { files } });
        }
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length) {
            currentFile = files[0];
            loadFile(event);
        }
    });

    encodingSelect.addEventListener('change', () => {
        if (currentFile) {
            loadFile({ target: { files: [currentFile] } });
        }
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePageInputs();
            displayTable(parsedData, currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePageInputs();
            displayTable(parsedData, currentPage);
        }
    });

    pageInput.addEventListener('change', (event) => {
        let page = parseInt(event.target.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            updatePageInputs();
            displayTable(parsedData, currentPage);
        } else {
            updatePageInputs();
        }
    });

    prevPageButtonBottom.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePageInputs();
            displayTable(parsedData, currentPage);
        }
    });

    nextPageButtonBottom.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePageInputs();
            displayTable(parsedData, currentPage);
        }
    });

    pageInputBottom.addEventListener('change', (event) => {
        let page = parseInt(event.target.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            updatePageInputs();
            displayTable(parsedData, currentPage);
        } else {
            updatePageInputs();
        }
    });

    seriesFieldSelect.addEventListener('change', () => {
        updateSeriesOptions(parsedData, seriesFieldSelect.value);
    });
});

let parsedData = [];
let currentPage = 1;
let totalPages = 1;
const rowsPerPage = 50;
let chartInstance = null;
let aggregatedData = [];

// Load CSV file and parse it
function loadFile(event) {
    const file = event.target.files[0];
    console.log("Loading file:", file.name);
    const encoding = document.getElementById('encodingSelect').value;
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        console.log("File loaded. Parsing CSV...");
        parsedData = parseCSV(csv);
        totalPages = Math.ceil((parsedData.length - 1) / rowsPerPage);
        document.getElementById('totalPages').textContent = ` / ${totalPages}`;
        document.getElementById('totalPagesBottom').textContent = ` / ${totalPages}`;
        console.log("CSV parsed. Displaying table...");
        updateFieldSelects(parsedData[0]);
        displayTable(parsedData, currentPage);
        updateSeriesOptions(parsedData, seriesFieldSelect.value);
    };
    reader.readAsText(file, encoding);
}

// Parse CSV data
function parseCSV(csv) {
    const rows = csv.split('\n').map(row => row.split(','));
    console.log("Parsed", rows.length, "rows.");
    return rows;
}

// Display data in a table with pagination
function displayTable(data, page) {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';
    const start = (page - 1) * rowsPerPage + 1; // Skip the header row
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    // Display header
    const headerRow = document.createElement('tr');
    data[0].forEach(cell => {
        const th = document.createElement('th');
        th.textContent = cell;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Display data
    paginatedData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    console.log("Table displayed with rows", start, "to", end);
}

function updateFieldSelects(headers) {
    const xFieldSelect = document.getElementById('xFieldSelect');
    const yFieldSelect = document.getElementById('yFieldSelect');
    const seriesFieldSelect = document.getElementById('seriesFieldSelect');
    const groupFieldSelect = document.getElementById('groupFieldSelect');
    const aggregateFieldSelect = document.getElementById('aggregateFieldSelect');

    xFieldSelect.innerHTML = '';
    yFieldSelect.innerHTML = '';
    seriesFieldSelect.innerHTML = '';
    groupFieldSelect.innerHTML = '';
    aggregateFieldSelect.innerHTML = '';

    headers.forEach((header, index) => {
        const optionX = document.createElement('option');
        optionX.value = index;
        optionX.textContent = header;
        xFieldSelect.appendChild(optionX);

        const optionY = document.createElement('option');
        optionY.value = index;
        optionY.textContent = header;
        yFieldSelect.appendChild(optionY);

        const optionSeries = document.createElement('option');
        optionSeries.value = index;
        optionSeries.textContent = header;
        seriesFieldSelect.appendChild(optionSeries);

        const groupCheck = document.createElement('div');
        groupCheck.className = 'form-check';
        const groupInput = document.createElement('input');
        groupInput.className = 'form-check-input';
        groupInput.type = 'checkbox';
        groupInput.value = index;
        groupInput.id = `groupField${index}`;
        const groupLabel = document.createElement('label');
        groupLabel.className = 'form-check-label';
        groupLabel.htmlFor = `groupField${index}`;
        groupLabel.textContent = header;
        groupCheck.appendChild(groupInput);
        groupCheck.appendChild(groupLabel);
        groupFieldSelect.appendChild(groupCheck);

        const aggregateCheck = document.createElement('div');
        aggregateCheck.className = 'form-check';
        const aggregateInput = document.createElement('input');
        aggregateInput.className = 'form-check-input';
        aggregateInput.type = 'checkbox';
        aggregateInput.value = index;
        aggregateInput.id = `aggregateField${index}`;
        const aggregateLabel = document.createElement('label');
        aggregateLabel.className = 'form-check-label';
        aggregateLabel.htmlFor = `aggregateField${index}`;
        aggregateLabel.textContent = header;
        aggregateCheck.appendChild(aggregateInput);
        aggregateCheck.appendChild(aggregateLabel);
        aggregateFieldSelect.appendChild(aggregateCheck);
    });

    // 「選択しない」というオプションを追加
    const optionNone = document.createElement('option');
    optionNone.value = '';
    optionNone.textContent = '選択しない';
    seriesFieldSelect.appendChild(optionNone);

    xFieldSelect.selectedIndex = 0;
    yFieldSelect.selectedIndex = 1;
    seriesFieldSelect.selectedIndex = headers.length; // 「選択しない」をデフォルト選択
}

function updateSeriesOptions(data, seriesFieldIndex) {
    // This function can be used to update series options if needed
}

function updatePageInputs() {
    document.getElementById('pageInput').value = currentPage;
    document.getElementById('pageInputBottom').value = currentPage;
}

// Run Polynomial Regression
function runPolynomialRegression() {
    if (aggregatedData.length > 0) {
        console.log("Running polynomial regression on aggregated data...");
        polynomialRegression(aggregatedData);
    } else if (parsedData.length > 0) {
        console.log("Running polynomial regression on original data...");
        polynomialRegression(parsedData);
    } else {
        alert("CSVファイルを先に読み込んでください。");
    }
}

// Polynomial Regression
function polynomialRegression(data) {
    const xFieldIndex = parseInt(document.getElementById('xFieldSelect').value);
    const yFieldIndex = parseInt(document.getElementById('yFieldSelect').value);
    const seriesFieldIndex = document.getElementById('seriesFieldSelect').value;

    let seriesValues = ['All Data'];
    if (seriesFieldIndex !== '') {
        seriesValues = [...new Set(data.slice(1).map(row => row[seriesFieldIndex]))];
    }
    const degree = parseInt(document.getElementById('degreeSlider').value); // Get the degree from the slider
    console.log("Degree selected:", degree);

    const datasets = [];

    seriesValues.forEach(seriesValue => {
        let filteredData = data.slice(1);
        if (seriesFieldIndex !== '') {
            filteredData = filteredData.filter(row => row[seriesFieldIndex] === seriesValue);
        }
        const x = filteredData.map(row => parseFloat(row[xFieldIndex])).filter(val => !isNaN(val));
        const y = filteredData.map(row => parseFloat(row[yFieldIndex])).filter(val => !isNaN(val));

        // Ensure X and Y arrays are of the same length and not empty
        if (x.length !== y.length || x.length === 0 || y.length === 0) {
            console.error("X and Y arrays must have the same length and not be empty for series:", seriesValue);
            return;
        }

        // Debug: Log filtered data
        console.log(`Filtered data for series ${seriesValue}:`, filteredData);

        // Normalize the data
        const xMean = x.reduce((a, b) => a + b, 0) / x.length;
        const xStd = Math.sqrt(x.reduce((sum, val) => sum + Math.pow(val - xMean, 2), 0) / x.length);
        const yMean = y.reduce((a, b) => a + b, 0) / y.length;
        const yStd = Math.sqrt(y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0) / y.length);
        const xNorm = x.map(val => (val - xMean) / xStd);
        const yNorm = y.map(val => (val - yMean) / yStd);

        // Debug: Log normalized data
        console.log(`Normalized data for series ${seriesValue} (x):`, xNorm);
        console.log(`Normalized data for series ${seriesValue} (y):`, yNorm);

        // Ensure there's enough variation in the data
        if (xStd === 0 || yStd === 0) {
            console.error("Not enough variation in the data for series:", seriesValue);
            return;
        }

        const X = xNorm.map(val => Array.from({ length: degree + 1 }, (_, i) => Math.pow(val, i)));
        const XT = transpose(X);
        if (XT.length === 0 || XT[0].length === 0) {
            console.error("Invalid matrix for transposition:", X);
            return;
        }
        const XTX = multiplyMatrices(XT, X);
        const lambda = 1e-5; // Regularization parameter
        for (let i = 0; i < XTX.length; i++) {
            XTX[i][i] += lambda;
        }
        const XTXI = invertMatrix(XTX);
        if (XTXI === null) {
            console.error("Matrix is not invertible for series:", seriesValue);
            return;
        }
        const XTY = multiplyMatrices(XT, yNorm.map(val => [val]));
        const coefficients = multiplyMatrices(XTXI, XTY).flat();

        // Debug: Log regression coefficients
        console.log("Regression coefficients for series", seriesValue, ":", coefficients);

        const regressionPoints = [];
        const step = (Math.max(...x) - Math.min(...x)) / 100;
        for (let xVal = Math.min(...x); xVal <= Math.max(...x); xVal += step) {
            const xNormVal = (xVal - xMean) / xStd;
            let yValNorm = 0;
            for (let i = 0; i <= degree; i++) {
                yValNorm += coefficients[i] * Math.pow(xNormVal, i);
            }
            const yVal = yValNorm * yStd + yMean;
            regressionPoints.push({ x: xVal, y: yVal });
        }

        datasets.push({
            label: `Data (${seriesValue})`,
            data: x.map((val, index) => ({ x: val, y: y[index] })),
            borderColor: getRandomColor(),
            backgroundColor: getRandomColor(),
            fill: false,
            showLine: false,
            pointRadius: 5,
        });

        datasets.push({
            label: `Regression Line (${seriesValue})`,
            data: regressionPoints,
            borderColor: getRandomColor(),
            fill: false,
            showLine: true,
            pointRadius: 0,
        });
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}

// Matrix operations
function transpose(matrix) {
    if (!matrix[0] || !matrix[0].map) {
        console.error("Invalid matrix for transposition:", matrix);
        return [];
    }
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function multiplyMatrices(a, b) {
    if (!a || !b || !a[0] || !b[0] || a[0].length !== b.length) {
        console.error("Invalid matrices for multiplication:", a, b);
        return [];
    }
    const aNumRows = a.length, aNumCols = a[0].length,
          bNumCols = b[0].length;
    const result = new Array(aNumRows);  
    for (let r = 0; r < aNumRows; ++r) {
        result[r] = new Array(bNumCols); 
        for (let c = 0; c < bNumCols; ++c) {
            result[r][c] = 0;             
            for (let i = 0; i < aNumCols; ++i) {
                result[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return result;
}

function invertMatrix(matrix) {
    const size = matrix.length;
    const augmentedMatrix = matrix.map((row, i) => [...row, ...Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))]);

    for (let i = 0; i < size; i++) {
        let maxEl = Math.abs(augmentedMatrix[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < size; k++) {
            if (Math.abs(augmentedMatrix[k][i]) > maxEl) {
                maxEl = Math.abs(augmentedMatrix[k][i]);
                maxRow = k;
            }
        }

        for (let k = i; k < size * 2; k++) {
            let tmp = augmentedMatrix[maxRow][k];
            augmentedMatrix[maxRow][k] = augmentedMatrix[i][k];
            augmentedMatrix[i][k] = tmp;
        }

        if (augmentedMatrix[i][i] === 0) {
            return null; // Not invertible
        }

        for (let k = i + 1; k < size; k++) {
            let c = -augmentedMatrix[k][i] / augmentedMatrix[i][i];
            for (let j = i; j < size * 2; j++) {
                if (i === j) {
                    augmentedMatrix[k][j] = 0;
                } else {
                    augmentedMatrix[k][j] += c * augmentedMatrix[i][j];
                }
            }
        }
    }

    for (let i = size - 1; i >= 0; i--) {
        for (let k = size; k < size * 2; k++) {
            augmentedMatrix[i][k] /= augmentedMatrix[i][i];
        }
        for (let k = i - 1; k >= 0; k--) {
            let c = -augmentedMatrix[k][i] / augmentedMatrix[i][i];
            for (let j = i; j < size * 2; j++) {
                if (i === j) {
                    augmentedMatrix[k][j] = 0;
                } else {
                    augmentedMatrix[k][j] += c * augmentedMatrix[i][j];
                }
            }
        }
    }

    return augmentedMatrix.map(row => row.slice(size));
}

// Function to get a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Group and Aggregate data
function runAggregation() {
    if (parsedData.length === 0) {
        alert("CSVファイルを先に読み込んでください。");
        return;
    }
    const groupFieldIndices = Array.from(document.querySelectorAll('#groupFieldSelect input:checked')).map(input => parseInt(input.value));
    const aggregateFieldIndices = Array.from(document.querySelectorAll('#aggregateFieldSelect input:checked')).map(input => parseInt(input.value));

    if (groupFieldIndices.length === 0 || aggregateFieldIndices.length === 0) {
        alert("グループ化および集計するフィールドを選択してください。");
        return;
    }

    const groupedData = {};

    parsedData.slice(1).forEach(row => {
        const groupKey = groupFieldIndices.map(index => row[index]).join('_');
        if (!groupedData[groupKey]) {
            groupedData[groupKey] = aggregateFieldIndices.map(() => []);
        }
        aggregateFieldIndices.forEach((index, i) => {
            groupedData[groupKey][i].push(parseFloat(row[index]));
        });
    });

    aggregatedData = Object.keys(groupedData).map(group => {
        const values = groupedData[group];
        const aggregatedRow = group.split('_');
        values.forEach(valueArray => {
            const sum = valueArray.reduce((a, b) => a + b, 0);
            aggregatedRow.push(sum);
        });
        return aggregatedRow;
    });

    updateAggregatedFieldSelects(groupFieldIndices, aggregateFieldIndices);
    displayAggregatedTable(aggregatedData, groupFieldIndices, aggregateFieldIndices);
}

function displayAggregatedTable(data, groupFieldIndices, aggregateFieldIndices) {
    const table = document.getElementById('aggregateTable');
    table.innerHTML = '';

    // Display header
    const headerRow = document.createElement('tr');
    groupFieldIndices.forEach(index => {
        const th = document.createElement('th');
        th.textContent = parsedData[0][index];
        headerRow.appendChild(th);
    });
    aggregateFieldIndices.forEach(index => {
        const th = document.createElement('th');
        th.textContent = parsedData[0][index] + ' (Sum)';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Display data
    data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function updateAggregatedFieldSelects(groupFieldIndices, aggregateFieldIndices) {
    const xFieldSelect = document.getElementById('xFieldSelect');
    const yFieldSelect = document.getElementById('yFieldSelect');
    const seriesFieldSelect = document.getElementById('seriesFieldSelect');

    xFieldSelect.innerHTML = '';
    yFieldSelect.innerHTML = '';
    seriesFieldSelect.innerHTML = '';

    groupFieldIndices.concat(aggregateFieldIndices).forEach((index, i) => {
        const optionX = document.createElement('option');
        optionX.value = i;
        optionX.textContent = parsedData[0][index];
        xFieldSelect.appendChild(optionX);

        const optionY = document.createElement('option');
        optionY.value = i;
        optionY.textContent = parsedData[0][index];
        yFieldSelect.appendChild(optionY);

        const optionSeries = document.createElement('option');
        optionSeries.value = i;
        optionSeries.textContent = parsedData[0][index];
        seriesFieldSelect.appendChild(optionSeries);
    });

    const optionNone = document.createElement('option');
    optionNone.value = '';
    optionNone.textContent = '選択しない';
    seriesFieldSelect.appendChild(optionNone);

    xFieldSelect.selectedIndex = 0;
    yFieldSelect.selectedIndex = 1;
    seriesFieldSelect.selectedIndex = seriesFieldSelect.options.length - 1; // 「選択しない」をデフォルト選択
}

document.getElementById('fileInput1').addEventListener('change', handleFileSelect1);
document.getElementById('fileInput2').addEventListener('change', handleFileSelect2);
document.getElementById('fileInput3').addEventListener('change', handleFileSelect3);
document.getElementById('fileInputAll').addEventListener('change', handleFileSelectAll);
document.getElementById('rerunButton').addEventListener('click', predictIfReady);
document.getElementById('pageSize').addEventListener('change', updatePageSize);

const dropArea1 = document.getElementById('dropArea1');
dropArea1.addEventListener('dragover', handleDragOver);
dropArea1.addEventListener('drop', (event) => handleFileDrop(event, 'period1'));
dropArea1.addEventListener('click', () => document.getElementById('fileInput1').click());

const dropArea2 = document.getElementById('dropArea2');
dropArea2.addEventListener('dragover', handleDragOver);
dropArea2.addEventListener('drop', (event) => handleFileDrop(event, 'period2'));
dropArea2.addEventListener('click', () => document.getElementById('fileInput2').click());

const dropArea3 = document.getElementById('dropArea3');
dropArea3.addEventListener('dragover', handleDragOver);
dropArea3.addEventListener('drop', (event) => handleFileDrop(event, 'period3'));
dropArea3.addEventListener('click', () => document.getElementById('fileInput3').click());

const dropAreaAll = document.getElementById('dropAreaAll');
dropAreaAll.addEventListener('dragover', handleDragOver);
dropAreaAll.addEventListener('drop', (event) => handleFileDrop(event, 'all'));
dropAreaAll.addEventListener('click', () => document.getElementById('fileInputAll').click());

let dataPeriod1 = [], dataPeriod2 = [], dataPeriod3 = [];
let salesChart = null;
let lossChart = null;
let currentPage = 1;
let pageSize = 50;

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataUrl1 = urlParams.get('data1');
    const dataUrl2 = urlParams.get('data2');
    const dataUrl3 = urlParams.get('data3');
    const dataUrlAll = urlParams.get('dataAll');

    const promises = [];

    if (dataUrlAll) {
        promises.push(fetchDataFromUrl(dataUrlAll, 'all').catch(error => console.warn('Default all data not found:', error)));
    } else {
        const defaultDataUrlAll = 'dataAll.csv';  // デフォルトの統合データファイルのURLを指定
        promises.push(fetchDataFromUrl(defaultDataUrlAll, 'all').catch(error => console.warn('Default all data not found:', error)));

        if (dataUrl1) {
            promises.push(fetchDataFromUrl(dataUrl1, 'period1').catch(error => console.warn('Default period1 data not found:', error)));
        } else {
            const defaultDataUrl1 = 'data1.csv';  // デフォルトのデータファイルのURLを指定
            promises.push(fetchDataFromUrl(defaultDataUrl1, 'period1').catch(error => console.warn('Default period1 data not found:', error)));
        }

        if (dataUrl2) {
            promises.push(fetchDataFromUrl(dataUrl2, 'period2').catch(error => console.warn('Default period2 data not found:', error)));
        } else {
            const defaultDataUrl2 = 'data2.csv';  // デフォルトのデータファイルのURLを指定
            promises.push(fetchDataFromUrl(defaultDataUrl2, 'period2').catch(error => console.warn('Default period2 data not found:', error)));
        }

        if (dataUrl3) {
            promises.push(fetchDataFromUrl(dataUrl3, 'period3').catch(error => console.warn('Default period3 data not found:', error)));
        } else {
            const defaultDataUrl3 = 'data3.csv';  // デフォルトのデータファイルのURLを指定
            promises.push(fetchDataFromUrl(defaultDataUrl3, 'period3').catch(error => console.warn('Default period3 data not found:', error)));
        }
    }

    Promise.all(promises).then(() => {
        setInitialDates();
        predictIfReady();
    });
});

function handleFileSelect1(event) {
    const file = event.target.files[0];
    readFile(file, 'period1');
}

function handleFileSelect2(event) {
    const file = event.target.files[0];
    readFile(file, 'period2');
}

function handleFileSelect3(event) {
    const file = event.target.files[0];
    readFile(file, 'period3');
}

function handleFileSelectAll(event) {
    const file = event.target.files[0];
    readFile(file, 'all');
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleFileDrop(event, period) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    readFile(file, period);
}

function readFile(file, period) {
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = preprocessData(results.data);
            console.log(`Data for ${period}:`, data);  // データをコンソールに表示
            if (period === 'all') {
                const periods = getPeriods(data);
                dataPeriod1 = periods.period1;
                dataPeriod2 = periods.period2;
                dataPeriod3 = periods.period3;
            } else if (period === 'period1') {
                dataPeriod1 = data;
            } else if (period === 'period2') {
                dataPeriod2 = data;
            } else if (period === 'period3') {
                dataPeriod3 = data;
            }
            setInitialDates();
            updateDataTable();
            predictIfReady();
        }
    });
}

function fetchDataFromUrl(url, period) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                    const data = preprocessData(results.data);
                    console.log(`Data for ${period}:`, data);  // データをコンソールに表示
                    if (period === 'all') {
                        const periods = getPeriods(data);
                        dataPeriod1 = periods.period1;
                        dataPeriod2 = periods.period2;
                        dataPeriod3 = periods.period3;
                    } else if (period === 'period1') {
                        dataPeriod1 = data;
                    } else if (period === 'period2') {
                        dataPeriod2 = data;
                    } else if (period === 'period3') {
                        dataPeriod3 = data;
                    }
                    updateDataTable();
                }
            });
        })
        .catch(error => {
            console.warn(`Default ${period} data not found:`, error);
        });
}

function preprocessData(data) {
    return data.map(row => {
        row['販売日時'] = new Date(row['販売日時']);
        row['売上金額'] = parseFloat(row['売上金額']);
        row['販売数'] = parseInt(row['販売数'], 10);
        row['販売前在庫'] = parseInt(row['販売前在庫'], 10);

        return row;
    }).filter(row => {
        return !isNaN(row['販売日時']) && 
               !isNaN(row['売上金額']) && 
               !isNaN(row['販売数']) && 
               !isNaN(row['販売前在庫']) &&
               row['販売日時'] instanceof Date && 
               typeof row['拠点'] === 'string' &&
               typeof row['アイテムコード'] === 'string';
    });
}

function getPeriods(data) {
    const currentYear = new Date().getFullYear();
    const lastDate = data[data.length - 1]['販売日時'];
    const lastYear = lastDate.getFullYear() - 1;
    const startDate = new Date(lastDate);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const period1 = data.filter(d => d['販売日時'] > startDate && d['販売日時'] <= lastDate);
    const period2 = data.filter(d => d['販売日時'].getFullYear() === lastYear && d['販売日時'] > startDate);
    const period3 = data.filter(d => d['販売日時'].getFullYear() === lastYear && d['販売日時'] <= lastDate);

    return { period1, period2, period3 };
}

function normalizeData(data) {
    const timestamps = data.map(d => d['販売日時'].getTime());
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    return data.map(d => {
        d['normalizedTimestamp'] = (d['販売日時'].getTime() - minTimestamp) / (maxTimestamp - minTimestamp);
        return d;
    });
}

function setInitialDates() {
    const lastDate = dataPeriod1.length > 0 ? dataPeriod1[dataPeriod1.length - 1]['販売日時'] : new Date();
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 100);

    startDateInput.valueAsDate = startDate;
    endDateInput.valueAsDate = endDate;
}

function predictIfReady() {
    if (dataPeriod1.length > 0 || dataPeriod2.length > 0 || dataPeriod3.length > 0) {
        showLoadingOverlay();
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;  // 修正: 期間の最後の日も含める
        predictSales(dataPeriod1, dataPeriod2, dataPeriod3, days, startDate).then(() => {
            hideLoadingOverlay();
        });
    }
}

async function predictSales(period1, period2, period3, days, startDate) {
    let model, inputData, outputData;

    if (period1.length > 0 && period2.length > 0 && period3.length > 0) {
        inputData = [...period1, ...period2, ...period3];
    } else if (period1.length > 0 && period2.length > 0) {
        inputData = [...period1, ...period2];
    } else {
        inputData = period1;
    }

    inputData = normalizeData(inputData);
    outputData = inputData.map(d => d['売上金額']);

    const { model: trainedModel, lossValues } = await buildModel(inputData, outputData);
    model = trainedModel;

    const predictions = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < days; i++) {  // 修正: ループ開始を0からに変更して終了日も含める
        const prediction = await makePrediction(model, currentDate, inputData);
        predictions.push({ date: new Date(currentDate), prediction });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('Predictions:', predictions);  // 予測結果をコンソールに表示
    plotForecast(dataPeriod1, dataPeriod2, dataPeriod3, predictions, startDate);
    updateForecastTable(predictions, dataPeriod2);
    plotLoss(lossValues);
}

async function buildModel(inputData, outputData) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    const xs = tf.tensor2d(inputData.map(d => d['normalizedTimestamp']), [inputData.length, 1]);
    const ys = tf.tensor2d(outputData, [outputData.length, 1]);

    const lossValues = [];
    console.log('Training model...');  // モデル訓練開始のログ

    await model.fit(xs, ys, {
        epochs: 500,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                lossValues.push(logs.loss);
                console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);  // 各エポックの損失値をログ表示
                updateLoadingOverlay(Math.round((epoch + 1) / 5) + '%');
            }
        }
    });

    console.log('Model trained.');  // モデル訓練終了のログ
    return { model, lossValues };
}

async function makePrediction(model, date, inputData) {
    const timestamps = inputData.map(d => d['販売日時'].getTime());
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);
    const normalizedTimestamp = (date.getTime() - minTimestamp) / (maxTimestamp - minTimestamp);

    const input = tf.tensor2d([normalizedTimestamp], [1, 1]);
    const output = model.predict(input);
    const prediction = output.dataSync()[0];
    console.log(`Prediction for ${date}: ${prediction}`);  // 予測値をログ表示
    return prediction;
}

function plotForecast(period1, period2, period3, predictions, startDate) {
    const ctx = document.getElementById('salesChart').getContext('2d');

    if (salesChart) {
        salesChart.destroy();
    }

    // 前年データを期間で結合
    const allPeriod3 = [...period2, ...period3].sort((a, b) => a['販売日時'] - b['販売日時']);

    // すべての期間の前年データを使用するように変更
    const allDates = period1.map(d => d['販売日時']).concat(predictions.map(p => p.date));
    const allDatesString = allDates.map(date => date.toLocaleDateString());
    const salesData1 = period1.map(d => d['売上金額']);
    const salesData3 = allPeriod3.map(d => d['売上金額']);  // 前年データをすべて使用
    const predictionData = new Array(salesData1.length).fill(null).concat(predictions.map(p => p.prediction));

    console.log('Plotting forecast...');  // プロット開始のログ

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDatesString,
            datasets: [{
                label: '当年売上金額',
                data: salesData1,
                borderColor: 'blue',
                fill: false
            }, {
                label: '前年売上金額',
                data: salesData3,
                borderColor: 'green',
                fill: false
            }, {
                label: '予測',
                data: predictionData,
                borderColor: 'red',
                fill: false,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    onClick: (e, legendItem) => {
                        const index = legendItem.datasetIndex;
                        const ci = salesChart;
                        const meta = ci.getDatasetMeta(index);
                        meta.hidden = !meta.hidden;
                        ci.update();
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '日付'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '売上金額'
                    }
                }
            }
        }
    });

    console.log('Forecast plotted.');  // プロット終了のログ
}

function plotLoss(lossValues) {
    const ctx = document.getElementById('lossChart').getContext('2d');

    if (lossChart) {
        lossChart.destroy();
    }

    const labels = lossValues.map((_, i) => i + 1);

    lossChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '訓練損失',
                data: lossValues,
                borderColor: 'green',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    onClick: (e, legendItem) => {
                        const index = legendItem.datasetIndex;
                        const ci = lossChart;
                        const meta = ci.getDatasetMeta(index);
                        meta.hidden = !meta.hidden;
                        ci.update();
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `エポック ${tooltipItem.label}: ${tooltipItem.raw}`;
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'エポック'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '損失値'
                    }
                }
            }
        }
    });
}

function showLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function updateLoadingOverlay(percentage) {
    document.getElementById('loadingOverlay').innerText = percentage;
}

function updateDataTable() {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // テーブルをクリア

    const allData = [...dataPeriod1, ...dataPeriod2, ...dataPeriod3];

    const totalPages = Math.ceil(allData.length / pageSize);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        if (i === currentPage) li.classList.add('active');
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            updateDataTable();
        });
        pagination.appendChild(li);
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = allData.slice(start, end);

    pageData.forEach(row => {
        const newRow = tableBody.insertRow();
        newRow.insertCell().textContent = row['販売日時'].toLocaleDateString();
        newRow.insertCell().textContent = row['拠点'];
        newRow.insertCell().textContent = row['アイテムコード'];
        newRow.insertCell().textContent = row['販売前在庫'];
        newRow.insertCell().textContent = row['販売数'];
        newRow.insertCell().textContent = row['売上金額'];
    });
}

function updatePageSize() {
    pageSize = parseInt(document.getElementById('pageSize').value, 10);
    currentPage = 1;
    updateDataTable();
}

function updateForecastTable(predictions, lastYearData) {
    const tableBody = document.getElementById('forecastTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // テーブルをクリア

    predictions.forEach(prediction => {
        const newRow = tableBody.insertRow();
        newRow.insertCell().textContent = prediction.date.toLocaleDateString();
        newRow.insertCell().textContent = prediction.prediction.toFixed(2);

        const sameWeekdayLastYear = lastYearData.find(d => 
            d['販売日時'].getDay() === prediction.date.getDay() && 
            d['販売日時'].getDate() === prediction.date.getDate() &&
            d['販売日時'].getMonth() === prediction.date.getMonth()
        );
        
        const lastYearSales = sameWeekdayLastYear ? sameWeekdayLastYear['売上金額'] : 'N/A';
        newRow.insertCell().textContent = lastYearSales;

        const forecastVsLastYear = lastYearSales !== 'N/A' ? ((prediction.prediction - lastYearSales) / lastYearSales * 100).toFixed(2) + '%' : 'N/A';
        newRow.insertCell().textContent = forecastVsLastYear;
    });
}

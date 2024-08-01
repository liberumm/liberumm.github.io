document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    let salesData = {};

    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '今年',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                },
                {
                    label: '前年',
                    data: [],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const salesChart = new Chart(ctx, config);

    window.updateChart = function() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
            alert('開始日と終了日を選択してください。');
            return;
        }

        const currentYear = new Date(startDate).getFullYear();
        const previousYear = currentYear - 1;

        let currentYearData = [];
        let previousYearData = [];
        let labels = [];

        let currentDate = new Date(startDate);
        const endDateObj = new Date(endDate);

        while (currentDate <= endDateObj) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            labels.push(formattedDate);

            const previousYearDate = new Date(currentDate);
            previousYearDate.setFullYear(previousYear);
            const formattedPreviousDate = previousYearDate.toISOString().split('T')[0];

            currentYearData.push(salesData[formattedDate] || 0);
            previousYearData.push(salesData[formattedPreviousDate] || 0);

            currentDate.setDate(currentDate.getDate() + 1);
        }

        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = currentYearData;
        salesChart.data.datasets[1].data = previousYearData;

        salesChart.update();

        displayTable(labels, currentYearData, previousYearData, currentYear, previousYear);
    }

    function displayTable(labels, currentYearData, previousYearData, currentYear, previousYear) {
        const table = document.getElementById('data-table');
        table.innerHTML = '';

        let headerRow = `<tr><th>日付</th><th>${currentYear}</th><th>${previousYear}</th></tr>`;
        table.innerHTML += headerRow;

        for (let i = 0; i < labels.length; i++) {
            let row = `<tr><td>${labels[i]}</td><td>${currentYearData[i]}</td><td>${previousYearData[i]}</td></tr>`;
            table.innerHTML += row;
        }
    }

    window.loadCSV = function() {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                complete: function(results) {
                    salesData = {};
                    let dates = [];

                    results.data.forEach(row => {
                        salesData[row.Date] = parseFloat(row.Sales);
                        dates.push(new Date(row.Date));
                    });

                    dates.sort((a, b) => a - b);
                    const minDate = dates[0].toISOString().split('T')[0];
                    const maxDate = dates[dates.length - 1].toISOString().split('T')[0];

                    document.getElementById('start-date').value = minDate;
                    document.getElementById('end-date').value = maxDate;

                    alert('CSVファイルが正常に読み込まれました。');
                    updateChart();
                }
            });
        } else {
            alert('CSVファイルを選択してください。');
        }
    }

    window.generateDummyData = function() {
        const startDate = document.getElementById('dummy-start-date').value;
        const endDate = document.getElementById('dummy-end-date').value;

        if (!startDate || !endDate) {
            alert('ダミーデータの開始日と終了日を選択してください。');
            return;
        }

        const currentDate = new Date(startDate);
        const endDateObj = new Date(endDate);
        const previousYear = currentDate.getFullYear() - 1;

        let dummyData = [];

        while (currentDate <= endDateObj) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            dummyData.push({ Date: formattedDate, Sales: getRandomSales() });

            const previousYearDate = new Date(currentDate);
            previousYearDate.setFullYear(previousYear);
            const formattedPreviousDate = previousYearDate.toISOString().split('T')[0];
            dummyData.push({ Date: formattedPreviousDate, Sales: getRandomSales() });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        const csv = Papa.unparse(dummyData);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dummy_sales_data.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    function getRandomSales() {
        return Math.floor(Math.random() * 200) + 50; // 50から250までのランダムな売上データを生成
    }
});

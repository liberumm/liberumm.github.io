$(document).ready(function () {
    let defaultShopMasterUrl = 'default_shop_master.csv';
    let defaultShopCoefficientsUrl = 'default_shop_coefficients.csv';

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function loadCSVFromUrl(url) {
        return new Promise((resolve, reject) => {
            Papa.parse(url, {
                download: true,
                header: true,
                complete: function (results) {
                    resolve(results.data);
                },
                error: reject
            });
        });
    }

    async function loadDefaultCSVs() {
        const shopMasterUrl = getQueryParam('shop_master') || defaultShopMasterUrl;
        const shopCoefficientsUrl = getQueryParam('shop_coefficients') || defaultShopCoefficientsUrl;

        try {
            const shopMasterData = await loadCSVFromUrl(shopMasterUrl);
            const shopCoefficientsData = await loadCSVFromUrl(shopCoefficientsUrl);

            return { shopMasterData, shopCoefficientsData };
        } catch (error) {
            console.error("CSVファイルの読み込み中にエラーが発生しました:", error);
            alert("CSVファイルの読み込み中にエラーが発生しました。コンソールを確認してください。");
        }
    }

    $('#load-defaults').on('click', async function () {
        const { shopMasterData, shopCoefficientsData } = await loadDefaultCSVs();
        $('#shop_master').data('data', shopMasterData);
        $('#shop_coefficients').data('data', shopCoefficientsData);
        alert("デフォルトCSVが読み込まれました。");
    });

    $('#add-product').on('click', function () {
        $('#product-table tbody').append(`
            <tr>
                <td><input type="date" class="form-control" name="納品日"></td>
                <td><input type="text" class="form-control" name="商品コード"></td>
                <td><input type="text" class="form-control" name="商品名"></td>
                <td><input type="number" class="form-control" name="原価"></td>
                <td><input type="number" class="form-control" name="売価"></td>
                <td><input type="number" class="form-control" name="配分総数"></td>
            </tr>
        `);
    });

    $('#calculate').on('click', function () {
        let shopMasterData = $('#shop_master').data('data');
        let shopCoefficientsData = $('#shop_coefficients').data('data');

        if (!shopMasterData || !shopCoefficientsData) {
            alert("店舗マスタおよび店舗係数マスタのデータが読み込まれていません。");
            return;
        }

        let productMasterData = [];
        $('#product-table tbody tr').each(function () {
            let row = {};
            $(this).find('input').each(function () {
                let name = $(this).attr('name');
                row[name] = $(this).val();
            });
            productMasterData.push(row);
        });

        const allocationResult = calculateAllocation(productMasterData, shopMasterData, shopCoefficientsData);
        displayResult(allocationResult);
        enableDownload(allocationResult);
    });

    function calculateAllocation(productMaster, shopMaster, shopCoefficients) {
        let result = [];

        productMaster.forEach((product) => {
            const totalQuantity = product['配分総数'];

            shopCoefficients.forEach((coeff, index) => {
                const shopName = shopMaster[index]['店舗名'];
                const coefficient = coeff['係数'];
                const allocationQuantity = (totalQuantity * coefficient) / 100;

                result.push({
                    '納品日': product['納品日'],
                    '商品コード': product['商品コード'],
                    '商品名': product['商品名'],
                    '原価': product['原価'],
                    '売価': product['売価'],
                    '店舗名': shopName,
                    '配分数': allocationQuantity
                });
            });
        });

        return result;
    }

    function displayResult(data) {
        let table = '<table class="table table-striped"><thead><tr>';
        Object.keys(data[0]).forEach(key => {
            table += `<th>${key}</th>`;
        });
        table += '</tr></thead><tbody>';
        data.forEach(row => {
            table += '<tr>';
            Object.values(row).forEach(value => {
                table += `<td>${value}</td>`;
            });
            table += '</tr>';
        });
        table += '</tbody></table>';
        $('#result').html(table);
    }

    function enableDownload(data) {
        $('#download').show().off('click').on('click', function () {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, '配分結果');
            XLSX.writeFile(workbook, 'allocation_result.xlsx');
        });
    }
});

const pivotTableApp = (() => {
    let originalData = [];
    let headers = [];
    let initialHeaders = [];
    let draggingItem = null;
    let initialParent = null;
    let filterStates = {};
    let activeItems = {
        rowArea: [],
        columnArea: [],
        valueArea: [],
        filterArea: []
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('fileInput').addEventListener('change', FileHandler.handleFileSelect, false);
        document.getElementById('clearSettings').addEventListener('click', SettingsHandler.clearSettings);
        document.getElementById('clearFilters').addEventListener('click', FilterHandler.clearFilters);
        document.getElementById('applyFilters').addEventListener('click', TableHandler.updatePivotTable);

        ['rowArea', 'columnArea', 'valueArea', 'filterArea'].forEach(area => {
            const areaElement = document.getElementById(area);
            areaElement.addEventListener('dragover', DragDropHandler.dragOver);
            areaElement.addEventListener('drop', (event) => DragDropHandler.drop(event, area));
            areaElement.addEventListener('dragenter', DragDropHandler.dragEnter);
            areaElement.addEventListener('dragleave', DragDropHandler.dragLeave);
        });
    });

    const FileHandler = {
        handleFileSelect(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                const contents = e.target.result;
                originalData = FileHandler.parseCSV(contents);
                headers = Object.keys(originalData[0]);
                initialHeaders = [...headers];
                DragDropHandler.createDraggableItems(headers);
                console.log("ファイルが読み込まれました:", headers);
            };

            reader.readAsText(file);
        },

        parseCSV(contents) {
            const lines = contents.split('\n');
            const headers = lines[0].split(',');

            const data = lines.slice(1).map(line => {
                const values = line.split(',');
                let obj = {};
                headers.forEach((header, index) => {
                    obj[header.trim()] = values[index] ? values[index].trim() : '';
                });
                return obj;
            });

            return data;
        }
    };

    const DragDropHandler = {
        createDraggableItems(headers) {
            const columnsContainer = document.getElementById('columns');
            columnsContainer.innerHTML = '';

            headers.forEach(header => {
                const item = document.createElement('div');
                item.textContent = header;
                item.classList.add('draggable-item');
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', DragDropHandler.dragStart);
                item.addEventListener('dragend', DragDropHandler.dragEnd);
                columnsContainer.appendChild(item);
            });
            console.log("ドラッグ可能なアイテムが作成されました:", headers);
        },

        dragStart(event) {
            draggingItem = event.target;
            initialParent = event.target.parentElement;
            event.dataTransfer.setData('text/plain', event.target.textContent);
            event.dataTransfer.effectAllowed = 'move';
            event.target.classList.add('dragging');
            console.log("ドラッグが開始されました:", event.target.textContent);
        },

        dragEnd(event) {
            event.target.classList.remove('dragging');
            initialParent = null;
            draggingItem = null;
            DragDropHandler.updateColumns();
            TableHandler.updatePivotTable();
        },

        dragEnter(event) {
            event.target.classList.add('hovered');
            console.log("ドロップ可能エリアに入りました:", event.target.id);
        },

        dragLeave(event) {
            event.target.classList.remove('hovered');
            console.log("ドロップ可能エリアから出ました:", event.target.id);
        },

        dragOver(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            console.log("ドロップオーバー:", event.target.id);
        },

        drop(event, area) {
            event.preventDefault();
            event.target.classList.remove('hovered');
            const data = event.dataTransfer.getData('text/plain');
            const existingItems = Array.from(event.target.children).map(child => child.textContent);

            if (!existingItems.includes(data)) {
                const item = document.createElement('div');
                item.textContent = data;
                item.classList.add('draggable-item');
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', DragDropHandler.dragStart);
                item.addEventListener('dragend', DragDropHandler.dragEnd);
                event.target.appendChild(item);
            }

            if (!activeItems[area].includes(data)) {
                activeItems[area].push(data);
                console.log(`アイテムが${area}に追加されました:`, data);
            }

            if (area !== 'filterArea') {
                ['rowArea', 'columnArea', 'valueArea'].forEach(otherArea => {
                    if (otherArea !== area) {
                        Utils.removeItemFromArea(otherArea, data);
                    }
                });
            }

            if (initialParent.id === 'filterArea' && !['rowArea', 'columnArea', 'valueArea'].includes(area)) {
                Utils.removeItemFromArea('filterArea', data);
            }

            if (area === 'filterArea') {
                FilterHandler.updateFilterControls();
            }

            TableHandler.updatePivotTable();
        },

        addItemToColumns(text) {
            const columnsContainer = document.getElementById('columns');
            if (!Array.from(columnsContainer.children).some(item => item.textContent === text)) {
                const item = document.createElement('div');
                item.textContent = text;
                item.classList.add('draggable-item');
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', DragDropHandler.dragStart);
                item.addEventListener('dragend', DragDropHandler.dragEnd);
                columnsContainer.appendChild(item);
            }
            console.log("アイテムが列リストに追加されました:", text);
        },

        updateColumns() {
            const columnsContainer = document.getElementById('columns');
            columnsContainer.innerHTML = '';

            initialHeaders.forEach(header => {
                if (!activeItems.rowArea.includes(header) &&
                    !activeItems.columnArea.includes(header) &&
                    !activeItems.valueArea.includes(header)) {
                    const item = document.createElement('div');
                    item.textContent = header;
                    item.classList.add('draggable-item');
                    item.setAttribute('draggable', true);
                    item.addEventListener('dragstart', DragDropHandler.dragStart);
                    item.addEventListener('dragend', DragDropHandler.dragEnd);
                    columnsContainer.appendChild(item);
                }
            });
            console.log("列リストが更新されました:", initialHeaders);
        }
    };

    const FilterHandler = {
        updateFilterControls() {
            const filterFields = Array.from(document.querySelectorAll('#filterArea .draggable-item')).map(item => item.textContent);
            const filterControls = document.getElementById('filterControls');
            filterControls.innerHTML = '';

            filterFields.forEach(field => {
                if (!filterStates[field]) {
                    filterStates[field] = {
                        expanded: true,
                        values: [...new Set(originalData.map(row => row[field]))]
                    };
                }

                const control = document.createElement('div');
                control.classList.add('filter-control-item');
                control.innerHTML = `
                    <div class="filter-header">
                        <label>${field}</label>
                        <input type="text" id="search-${field}" class="form-control" placeholder="フィルター値を検索">
                    </div>
                    <div class="filter-checkbox-container" id="checkbox-container-${field}"></div>
                    <button class="btn btn-secondary btn-sm mt-2" onclick="FilterHandler.toggleCheckboxes('${field}', true)">全選択</button>
                    <button class="btn btn-secondary btn-sm mt-2" onclick="FilterHandler.toggleCheckboxes('${field}', false)">全解除</button>
                `;
                filterControls.appendChild(control);

                const checkboxContainer = document.getElementById(`checkbox-container-${field}`);
                filterStates[field].values.forEach(value => {
                    const checkbox = document.createElement('div');
                    checkbox.innerHTML = `
                        <input type="checkbox" id="filter-${field}-${value}" value="${value}" checked>
                        <label for="filter-${field}-${value}">${value}</label>
                    `;
                    checkboxContainer.appendChild(checkbox);
                });

                document.getElementById(`search-${field}`).addEventListener('input', Utils.debounce((e) => {
                    const searchValue = e.target.value.toLowerCase();
                    const checkboxes = checkboxContainer.querySelectorAll('div');
                    checkboxes.forEach(box => {
                        const label = box.querySelector('label').textContent.toLowerCase();
                        box.style.display = label.includes(searchValue) ? '' : 'none';
                    });
                }, 300));
            });

            Object.keys(filterStates).forEach(field => {
                if (!filterFields.includes(field)) {
                    delete filterStates[field];
                }
            });
            console.log("フィルターコントロールが更新されました:", filterFields);
        },

        toggleCheckboxes(field, checked) {
            const checkboxes = document.querySelectorAll(`#checkbox-container-${field} input[type="checkbox"]`);
            checkboxes.forEach(checkbox => {
                checkbox.checked = checked;
            });
            console.log("チェックボックスの状態が変更されました:", field, "状態:", checked);
        },

        clearFilters() {
            document.getElementById('filterArea').innerHTML = '<span class="droppable-area-label">フィルター</span>';
            document.getElementById('filterControls').innerHTML = '';
            filterStates = {};
            activeItems.filterArea = [];
            console.log("フィルターリストがクリアされました");
        }
    };

    const TableHandler = {
        updatePivotTable() {
            const rowFields = Array.from(document.querySelectorAll('#rowArea .draggable-item')).map(item => item.textContent);
            const columnFields = Array.from(document.querySelectorAll('#columnArea .draggable-item')).map(item => item.textContent);
            const valueFields = Array.from(document.querySelectorAll('#valueArea .draggable-item')).map(item => item.textContent);
            const filterFields = Array.from(document.querySelectorAll('#filterArea .draggable-item')).map(item => item.textContent);

            if (rowFields.length === 0 && columnFields.length === 0) return;

            const filteredData = TableHandler.filterData(originalData, filterFields);
            const pivotData = TableHandler.crossTabulate(filteredData, rowFields, columnFields, valueFields);
            TableHandler.createPivotTable(pivotData);
            console.log("ピボットテーブルが更新されました:", pivotData);
        },

        filterData(data, filterFields) {
            if (filterFields.length === 0) return data;

            return data.filter(row => {
                return filterFields.every(field => {
                    const checkboxes = document.querySelectorAll(`#checkbox-container-${field} input[type="checkbox"]`);
                    const checkedValues = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
                    return checkedValues.includes(row[field]);
                });
            });
        },

        crossTabulate(data, rowFields, columnFields, valueFields) {
            const result = {};
            const rowKeySet = new Set();
            const colKeySet = new Set();

            data.forEach(row => {
                const rowKey = rowFields.map(field => row[field]).join('|');
                const colKey = columnFields.map(field => row[field]).join('|');
                
                rowKeySet.add(rowKey);
                colKeySet.add(colKey);

                if (!result[rowKey]) result[rowKey] = {};
                if (!result[rowKey][colKey]) result[rowKey][colKey] = {};

                valueFields.forEach(valueField => {
                    if (!result[rowKey][colKey][valueField]) result[rowKey][colKey][valueField] = 0;
                    result[rowKey][colKey][valueField] += parseFloat(row[valueField]) || 0;
                });
            });

            return { result, rowKeys: Array.from(rowKeySet), colKeys: Array.from(colKeySet), valueKeys: valueFields };
        },

        createPivotTable(pivotData) {
            const container = document.getElementById('pivotTable');
            container.innerHTML = '';

            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered', 'table-striped');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const { result, rowKeys, colKeys, valueKeys } = pivotData;

            if (rowKeys.length > 0 && colKeys.length > 0) {
                // Create table headers
                const headerRow = document.createElement('tr');
                const emptyHeader = document.createElement('th');
                emptyHeader.textContent = '';
                headerRow.appendChild(emptyHeader);

                colKeys.forEach(colKey => {
                    valueKeys.forEach(valueKey => {
                        const th = document.createElement('th');
                        th.textContent = `${colKey} (${valueKey})`;
                        headerRow.appendChild(th);
                    });
                });
                const totalHeader = document.createElement('th');
                totalHeader.textContent = '総計';
                headerRow.appendChild(totalHeader);
                thead.appendChild(headerRow);

                // Create table rows
                rowKeys.forEach(rowKey => {
                    const tr = document.createElement('tr');
                    const rowHeader = document.createElement('th');
                    rowHeader.textContent = rowKey;
                    tr.appendChild(rowHeader);

                    let rowTotal = 0;

                    colKeys.forEach(colKey => {
                        valueKeys.forEach(valueKey => {
                            const td = document.createElement('td');
                            const value = result[rowKey][colKey] && result[rowKey][colKey][valueKey] ? parseFloat(result[rowKey][colKey][valueKey]) : 0;
                            td.textContent = value.toFixed(1);
                            tr.appendChild(td);
                            rowTotal += value;
                        });
                    });

                    const totalCell = document.createElement('td');
                    totalCell.textContent = rowTotal.toFixed(1);
                    tr.appendChild(totalCell);

                    tbody.appendChild(tr);
                });

                // Add summary row
                const summaryRow = document.createElement('tr');
                const summaryRowHeader = document.createElement('th');
                summaryRowHeader.textContent = '総計';
                summaryRow.appendChild(summaryRowHeader);

                let grandTotal = 0;

                colKeys.forEach(colKey => {
                    valueKeys.forEach(valueKey => {
                        const summaryCell = document.createElement('td');
                        const colTotal = rowKeys.reduce((acc, rowKey) => {
                            return acc + (result[rowKey][colKey] && result[rowKey][colKey][valueKey] ? parseFloat(result[rowKey][colKey][valueKey]) : 0);
                        }, 0);
                        summaryCell.textContent = colTotal.toFixed(1);
                        summaryRow.appendChild(summaryCell);
                        grandTotal += colTotal;
                    });
                });

                const grandTotalCell = document.createElement('td');
                grandTotalCell.textContent = grandTotal.toFixed(1);
                summaryRow.appendChild(grandTotalCell);
                tbody.appendChild(summaryRow);

            } else if (rowKeys.length > 0) {
                // Create table headers for row only
                const headerRow = document.createElement('tr');
                const emptyHeader = document.createElement('th');
                emptyHeader.textContent = '';
                headerRow.appendChild(emptyHeader);
                valueKeys.forEach(valueKey => {
                    const th = document.createElement('th');
                    th.textContent = `${valueKey}`;
                    headerRow.appendChild(th);
                });
                const totalHeader = document.createElement('th');
                totalHeader.textContent = '総計';
                headerRow.appendChild(totalHeader);
                thead.appendChild(headerRow);

                // Create table rows
                rowKeys.forEach(rowKey => {
                    const tr = document.createElement('tr');
                    const rowHeader = document.createElement('th');
                    rowHeader.textContent = rowKey;
                    tr.appendChild(rowHeader);

                    let rowTotal = 0;

                    valueKeys.forEach(valueKey => {
                        const td = document.createElement('td');
                        const value = result[rowKey][''] && result[rowKey][''][valueKey] ? parseFloat(result[rowKey][''][valueKey]) : 0;
                        td.textContent = value.toFixed(1);
                        tr.appendChild(td);
                        rowTotal += value;
                    });

                    const totalCell = document.createElement('td');
                    totalCell.textContent = rowTotal.toFixed(1);
                    tr.appendChild(totalCell);

                    tbody.appendChild(tr);
                });

                // Add summary row
                const summaryRow = document.createElement('tr');
                const summaryRowHeader = document.createElement('th');
                summaryRowHeader.textContent = '総計';
                summaryRow.appendChild(summaryRowHeader);

                let grandTotal = 0;

                valueKeys.forEach(valueKey => {
                    const summaryCell = document.createElement('td');
                    const total = rowKeys.reduce((acc, rowKey) => acc + (result[rowKey][''] && result[rowKey][''][valueKey] ? parseFloat(result[rowKey][''][valueKey]) : 0), 0);
                    summaryCell.textContent = total.toFixed(1);
                    summaryRow.appendChild(summaryCell);
                    grandTotal += total;
                });

                const grandTotalCell = document.createElement('td');
                grandTotalCell.textContent = grandTotal.toFixed(1);
                summaryRow.appendChild(grandTotalCell);
                tbody.appendChild(summaryRow);

            } else if (colKeys.length > 0) {
                // Create table headers for column only
                const headerRow = document.createElement('tr');
                const emptyHeader = document.createElement('th');
                emptyHeader.textContent = '';
                headerRow.appendChild(emptyHeader);

                colKeys.forEach(colKey => {
                    const th = document.createElement('th');
                    th.textContent = colKey;
                    headerRow.appendChild(th);
                });
                const totalHeader = document.createElement('th');
                totalHeader.textContent = '総計';
                headerRow.appendChild(totalHeader);
                thead.appendChild(headerRow);

                // Create single row with totals
                const tr = document.createElement('tr');
                const rowHeader = document.createElement('th');
                rowHeader.textContent = '総計';
                tr.appendChild(rowHeader);

                let grandTotal = 0;

                colKeys.forEach(colKey => {
                    const totalCell = document.createElement('td');
                    const total = valueKeys.reduce((acc, valueKey) => acc + (result[''][colKey] && result[''][colKey][valueKey] ? parseFloat(result[''][colKey][valueKey]) : 0), 0);
                    totalCell.textContent = total.toFixed(1);
                    tr.appendChild(totalCell);
                    grandTotal += total;
                });

                const grandTotalCell = document.createElement('td');
                grandTotalCell.textContent = grandTotal.toFixed(1);
                tr.appendChild(grandTotalCell);

                tbody.appendChild(tr);
            }

            table.appendChild(thead);
            table.appendChild(tbody);
            container.appendChild(table);
            console.log("ピボットテーブルが作成されました");
        }
    };

    const SettingsHandler = {
        clearSettings() {
            ['rowArea', 'columnArea', 'valueArea', 'filterArea'].forEach(area => {
                const areaElement = document.getElementById(area);
                areaElement.innerHTML = `<span class="droppable-area-label">${document.querySelector(`#${area} .droppable-area-label`).textContent}</span>`;
            });

            DragDropHandler.createDraggableItems(initialHeaders);
            document.getElementById('pivotTable').innerHTML = '';
            document.getElementById('filterControls').innerHTML = '';
            filterStates = {};
            activeItems = {
                rowArea: [],
                columnArea: [],
                valueArea: [],
                filterArea: []
            };
            console.log("設定がクリアされました");
        }
    };

    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        removeItemFromArea(area, text) {
            const index = activeItems[area].indexOf(text);
            if (index > -1) {
                activeItems[area].splice(index, 1);
                const areaElement = document.getElementById(area);
                const item = Array.from(areaElement.children).find(child => child.textContent === text);
                if (item) {
                    areaElement.removeChild(item);
                }
                console.log("アイテムがエリアから削除されました:", text, "エリア:", area);
            }
        },

        removeFromOtherAreas(currentArea, text) {
            ['rowArea', 'columnArea', 'valueArea'].forEach(area => {
                if (area !== currentArea) {
                    const areaElement = document.getElementById(area);
                    const item = Array.from(areaElement.children).find(child => child.textContent === text);
                    if (item) {
                        areaElement.removeChild(item);
                        Utils.removeItemFromArea(area, text);
                    }
                }
            });
            console.log("他のエリアからアイテムを削除しました:", text, "現在のエリア:", currentArea);
        }
    };

    return {
        FileHandler,
        DragDropHandler,
        FilterHandler,
        TableHandler,
        SettingsHandler,
        Utils
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const uploadImage = document.getElementById('uploadImage');
    const dropZone = document.getElementById('dropZone');
    const originalCanvas = document.getElementById('originalCanvas');
    const editedCanvas = document.getElementById('editedCanvas');
    const originalCtx = originalCanvas.getContext('2d');
    const editedCtx = editedCanvas.getContext('2d');
    const rotateButton = document.getElementById('rotateButton');
    const filterButton = document.getElementById('filterButton');
    const cropButton = document.getElementById('cropButton');
    const undoButton = document.getElementById('undoButton');
    const downloadButton = document.getElementById('downloadButton');
    const outputWidth = document.getElementById('outputWidth');
    const outputHeight = document.getElementById('outputHeight');
    const fileNameInput = document.getElementById('fileName');
    const historyList = document.getElementById('historyList');
    
    let image = new Image();
    let editedImage = new Image();
    let angle = 0;
    let history = [];

    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
            image.onload = () => {
                displayOriginalImage();
                resetEditedImage();
                clearHistory();
            }
        }
        reader.readAsDataURL(file);
    }

    function displayOriginalImage() {
        const maxWidth = originalCanvas.parentElement.clientWidth;
        const scale = Math.min(maxWidth / image.width, 1);
        originalCanvas.width = image.width * scale;
        originalCanvas.height = image.height * scale;
        originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
        originalCtx.drawImage(image, 0, 0, originalCanvas.width, originalCanvas.height);
    }

    function resetEditedImage() {
        editedImage.src = image.src;
        editedImage.onload = () => {
            displayEditedImage();
            addToHistory('Initial Load');
        }
    }

    function displayEditedImage() {
        const maxWidth = editedCanvas.parentElement.clientWidth;
        const scale = Math.min(maxWidth / editedImage.width, 1);
        editedCanvas.width = editedImage.width * scale;
        editedCanvas.height = editedImage.height * scale;
        editedCtx.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
        editedCtx.drawImage(editedImage, 0, 0, editedCanvas.width, editedCanvas.height);
    }

    function addToHistory(action) {
        const currentState = editedCanvas.toDataURL();
        history.push({ action, state: currentState });
        const historyItem = document.createElement('li');
        historyItem.textContent = action;
        historyList.appendChild(historyItem);
    }

    function clearHistory() {
        history = [];
        historyList.innerHTML = '';
    }

    function undo() {
        if (history.length > 1) {
            history.pop();
            const lastState = history[history.length - 1];
            const img = new Image();
            img.src = lastState.state;
            img.onload = () => {
                editedImage.src = lastState.state;
                displayEditedImage();
            }
            historyList.removeChild(historyList.lastChild);
        }
    }

    uploadImage.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleFile(file);
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.style.borderColor = '#007bff';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#d3d3d3';
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.style.borderColor = '#d3d3d3';
        const file = event.dataTransfer.files[0];
        handleFile(file);
    });

    rotateButton.addEventListener('click', () => {
        angle = (angle + 90) % 360;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (angle % 180 === 0) {
            tempCanvas.width = editedImage.width;
            tempCanvas.height = editedImage.height;
        } else {
            tempCanvas.width = editedImage.height;
            tempCanvas.height = editedImage.width;
        }
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.save();
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(angle * Math.PI / 180);
        tempCtx.drawImage(editedImage, -editedImage.width / 2, -editedImage.height / 2);
        tempCtx.restore();
        editedImage.src = tempCanvas.toDataURL();
        editedImage.onload = () => {
            displayEditedImage();
            addToHistory('Rotate');
        }
    });

    filterButton.addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = editedImage.width;
        tempCanvas.height = editedImage.height;
        tempCtx.filter = 'grayscale(100%)';
        tempCtx.drawImage(editedImage, 0, 0);
        editedImage.src = tempCanvas.toDataURL();
        editedImage.onload = () => {
            displayEditedImage();
            addToHistory('Apply Filter');
        }
    });

    cropButton.addEventListener('click', () => {
        autoCrop();
    });

    undoButton.addEventListener('click', () => {
        undo();
    });

    downloadButton.addEventListener('click', () => {
        const width = parseInt(outputWidth.value) || 350;
        const height = parseInt(outputHeight.value) || 350;
        const fileName = fileNameInput.value || 'edited-image';
        
        const resizedCanvas = document.createElement('canvas');
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCanvas.width = width;
        resizedCanvas.height = height;

        resizedCtx.drawImage(editedCanvas, 0, 0, width, height);

        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = resizedCanvas.toDataURL();
        link.click();
    });
});

function onOpenCvReady() {
    console.log('OpenCV.js is ready.');
}

function autoCrop() {
    try {
        // キャンバスから画像データを取得してOpenCVのMatオブジェクトに変換
        let src = cv.imread(editedCanvas);
        console.log('Image loaded into src:', src);
        let dst = new cv.Mat();
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        console.log('Converted to gray scale:', gray);

        // 白背景のしきい値を設定
        let low = new cv.Scalar(200, 200, 200, 255);
        let high = new cv.Scalar(255, 255, 255, 255);
        console.log('Threshold values set:', low, high);

        // cv.inRange関数を使用してマスクを作成
        let mask = new cv.Mat();
        cv.inRange(src, low, high, mask);
        console.log('Mask created:', mask);

        // マスクを反転して背景を除去
        let invertedMask = new cv.Mat();
        cv.bitwise_not(mask, invertedMask);
        console.log('Inverted mask created:', invertedMask);

        // マスクを使用して背景を除去
        let result = new cv.Mat();
        src.copyTo(result, invertedMask);
        console.log('Background removed:', result);

        // 輪郭を見つける
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(invertedMask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        console.log('Contours found:', contours);

        if (contours.size() > 0) {
            let cnt = contours.get(0);
            let rect = cv.boundingRect(cnt);
            console.log('Bounding rect:', rect);

            // 切り抜き領域を設定
            dst = result.roi(rect);

            // 切り抜き領域をキャンバスに表示
            const maxWidth = editedCanvas.parentElement.clientWidth;
            const scale = Math.min(maxWidth / dst.cols, 1);
            editedCanvas.width = dst.cols * scale;
            editedCanvas.height = dst.rows * scale;

            let resizedDst = new cv.Mat();
            cv.resize(dst, resizedDst, new cv.Size(editedCanvas.width, editedCanvas.height));
            cv.imshow('editedCanvas', resizedDst);

            // 編集された画像を更新
            editedImage.src = editedCanvas.toDataURL();
            editedImage.onload = () => {
                displayEditedImage();
                addToHistory('Auto Crop');
            };

            // 後処理
            src.delete();
            dst.delete();
            resizedDst.delete();
            gray.delete();
            mask.delete();
            invertedMask.delete();
            result.delete();
            contours.delete();
            hierarchy.delete();
        } else {
            console.error('No contours found.');
        }
    } catch (err) {
        console.error('Error in autoCrop function:', err);
    }
}

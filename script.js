document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const historyList = document.getElementById('history-list');
    const themeToggle = document.getElementById('theme-toggle');
    const exportButton = document.getElementById('export-button');
    const fileFormatSelect = document.getElementById('file-format');

    // Función para cargar el historial desde localStorage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = entry;
            historyList.appendChild(li);
        });
    }

    // Función para guardar la conversión en el historial de uso
    function saveToHistory(input, output) {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const entry = `Converted '${input.slice(0, 20)}...' to '${output.slice(0, 20)}... '`;
        history.push(entry);
        localStorage.setItem('history', JSON.stringify(history));
    }

    // Función para manejar el cambio de archivo en el input
    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result;
                inputText.value = content;
                convertAndDisplay(content);
            };
            reader.readAsText(file);
        }
    }

    // Función para convertir el contenido y mostrarlo en la área de salida
    function convertAndDisplay(input) {
        const output = convertFormat(input); // Aquí debes implementar la lógica de conversión
        outputText.value = output;
        saveToHistory(input, output);
        updateHistoryList();
    }

    // Función para actualizar la lista de historial en el DOM
    function updateHistoryList() {
        historyList.innerHTML = '';
        loadHistory();
    }

    // Toggle theme functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Export result functionality
    exportButton.addEventListener('click', () => {
        const outputTextContent = outputText.value;
        if (outputTextContent) {
            const format = fileFormatSelect.value;
            let blob, filename;

            if (format === 'txt') {
                blob = new Blob([outputTextContent], { type: 'text/plain' });
                filename = 'converted_text.txt';
            } else if (format === 'json') {
                blob = new Blob([JSON.stringify(outputTextContent)], { type: 'application/json' });
                filename = 'converted_data.json';
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('No hay texto para exportar.');
        }
    });

    // Cargar el historial al inicializar
    loadHistory();

    // Agregar un input de archivo oculto y controlarlo desde JavaScript
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt'; // Acepta solo archivos .txt, puedes ajustar según tus necesidades
    fileInput.style.display = 'none';

    inputText.addEventListener('focus', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileChange);
});
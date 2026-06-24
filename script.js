document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const exportButton = document.getElementById('export-button');

    // Toggle theme functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Export result functionality
    exportButton.addEventListener('click', () => {
        const outputText = document.getElementById('output-text').value;
        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_text.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
});
// Mocking necessary DOM elements and functions for testing
document.body.innerHTML = `
    <textarea id="input-text"></textarea>
    <textarea id="output-text" readonly></textarea>
    <ul id="history-list"></ul>
`;

const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const historyList = document.getElementById('history-list');

// Mocking FileReader
global.FileReader = class {
    constructor() { }
    readAsText(file) { this.onload({ target: { result: 'mock content' } }); }
    onload(event) { }
};

// Mocking localStorage
let mockLocalStorage = {};
localStorage.getItem = jest.fn(key => mockLocalStorage[key] || null);
localStorage.setItem = jest.fn((key, value) => mockLocalStorage[key] = value);

// Importing the script.js file for testing
require('./script');

describe('File Format Converter', () => {
    let originalConsoleError;

    beforeEach(() => {
        originalConsoleError = console.error;
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
        mockLocalStorage = {};
    });

    it('should handle file change and display content in output area', async () => {
        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const event = new Event('change');
        event.target.files = [file];

        const originalHandleFileChange = script.handleFileChange;
        script.handleFileChange = jest.fn();

        inputText.dispatchEvent(event);

        expect(script.handleFileChange).toHaveBeenCalled();
        expect(inputText.value).toBe('mock content');
        expect(outputText.value).toBe('mock content'); // Assuming convertFormat returns the same content
    });

    it('should save conversion to history and update list', () => {
        const mockInput = 'test input';
        const mockOutput = 'test output';

        script.convertAndDisplay(mockInput, mockOutput);

        expect(localStorage.getItem).toHaveBeenCalledWith('history');
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(historyList.children.length).toBe(1);
    });

    it('should load history from localStorage', () => {
        const mockHistory = ['entry 1', 'entry 2'];
        localStorage.setItem('history', JSON.stringify(mockHistory));

        script.loadHistory();

        expect(historyList.children.length).toBe(2);
    });

    it('should export result as TXT file', () => {
        outputText.value = 'test content';
        const event = new Event('click');
        document.getElementById('export-button').dispatchEvent(event);

        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(document.body.appendChild).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalled();
    });

    it('should export result as JSON file', () => {
        outputText.value = '{"key": "value"}';
        const event = new Event('click');
        document.getElementById('file-format').value = 'json';
        document.getElementById('export-button').dispatchEvent(event);

        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(document.body.appendChild).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalled();
    });
});
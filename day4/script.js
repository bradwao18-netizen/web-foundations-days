// Step 3: Select all elements
const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// Step 3: Write updateCounts() function
function updateCounts() {
    const text = noteText.value;
    const charLength = text.length;
    
    // Calculate words (splitting by whitespace, handling empty inputs)
    const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
    const wordLength = words.length;

    // Update display text
    charCount.textContent = `${charLength} / 200 characters`;
    wordCount.textContent = `${wordLength} words`;

    // Handle warning (>180 chars) and over (>200 chars) classes
    charCount.classList.remove('warning', 'over');
    if (charLength > 200) {
        charCount.classList.add('over');
    } else if (charLength > 180) {
        charCount.classList.add('warning');
    }
}

// Helper function to clear the note and storage
function clearNote() {
    noteText.value = '';
    localStorage.removeItem('noteDraft');
    updateCounts();
}

// Step 4: Call updateCounts() and save the draft on every input event
noteText.addEventListener('input', () => {
    updateCounts();
    localStorage.setItem('noteDraft', noteText.value);
});

// Step 6: Make the Clear button and the Escape key clear everything
clearBtn.addEventListener('click', clearNote);

noteText.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearNote();
    }
});

// Step 7: Make the theme button toggle dark mode and remember the choice
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Step 5: When the page loads, restore any saved draft and theme, then call updateCounts()
window.addEventListener('DOMContentLoaded', () => {
    // Restore saved draft
    const savedDraft = localStorage.getItem('noteDraft');
    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }

    // Restore saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light mode';
    } else {
        themeToggle.textContent = 'Dark mode';
    }

    // Initial count update on load
    updateCounts();
});
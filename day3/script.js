// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" }
];

// 2. searchNotes using filter, toLowerCase, and includes[cite: 5]
function searchNotes(query) {
  return notes.filter(note => 
    note.text.toLowerCase().includes(query.toLowerCase())
  );
}

// 3. longestNote. Handle empty array first, then compare lengths[cite: 5]
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => 
    current.text.length > longest.text.length ? current : longest
  );
}

// 4. countByCategory by looping over notes and increasing a counter in an object[cite: 5]
function countByCategory() {
  let counts = {};
  for (let note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

// 5. getSummary using countByCategory and a template literal. Use "note" for exactly one note and "notes" otherwise[cite: 1, 5]
function getSummary() {
  let counts = countByCategory();
  let totalNotes = notes.length;
  let noteWord = totalNotes === 1 ? "note" : "notes";
  
  let categoryParts = [];
  for (let category in counts) {
    categoryParts.push(`${counts[category]} ${category}`);
  }
  
  return `${totalNotes} ${noteWord}: ${categoryParts.join(", ")}.`;
}

// 6. isDuplicate using some, comparing trimmed lower-case text[cite: 5]
function isDuplicate(text) {
  let cleanText = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === cleanText);
}

// 7. addNote calling isDuplicate and checking length and category before adding[cite: 5]
function addNote(text, category) {
  let validCategories = ["personal", "work", "study"];
  
  if (text.length < 1 || text.length > 200) {
    console.log("Failed to add: Text must be between 1 and 200 characters. - script.js:59");
    return false;
  }
  
  if (!validCategories.includes(category)) {
    console.log("Failed to add: Category must be personal, work, or study. - script.js:64");
    return false;
  }
  
  if (isDuplicate(text)) {
    console.log("Failed to add: Note already exists. - script.js:69");
    return false;
  }
  
  let newNote = {
    id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
    text: text,
    category: category
  };
  
  notes.push(newNote);
  console.log("Note added successfully. - script.js:80");
  return true;
}

// 8. Test every function with normal and edge cases with clean text[cite: 5]
// --- 1. Testing searchNotes ---
console.log(searchNotes("study - script.js:86")); 
// Expected output: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }, { id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("quantum - script.js:89")); 
// Expected output: []

// --- 2. Testing longestNote ---
console.log(longestNote()); 
// Expected output: { id: 3, text: "Email the project report to Grace", category: "work" }

let tempNotes = notes;
notes = [];
console.log(longestNote()); 
// Expected output: null
notes = tempNotes;

// --- 3. Testing countByCategory ---
console.log(countByCategory()); 
// Expected output: { personal: 2, study: 2, work: 1 }

// --- 4. Testing getSummary (Plural & Singular Check) ---
console.log(getSummary()); 
// Expected output: "5 notes: 2 personal, 2 study, 1 work."

let multiNotes = notes;
notes = [{ id: 1, text: "Buy milk", category: "personal" }];
console.log(getSummary()); 
// Expected output: "1 note: 1 personal."
notes = multiNotes;

// --- 5. Testing isDuplicate ---
console.log(isDuplicate("Buy milk and bread - script.js:117")); 
// Expected output: true

console.log(isDuplicate("Learn Python - script.js:120")); 
// Expected output: false

// --- 6. Testing addNote ---
console.log(addNote("Learn Python - script.js:124", "study")); 
// Expected output: true

console.log(addNote("", "study")); 
// Expected output: false
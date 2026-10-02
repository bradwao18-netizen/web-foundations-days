let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" }
];

function searchNotes(word) {
  return notes.filter(note => 
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => 
    current.text.length > longest.text.length ? current : longest
  );
}

function countByCategory() {
  let counts = {};
  notes.forEach(note => {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  });
  return counts;
}

function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  
  const parts = [];
  for (let category in counts) {
    parts.push(`${counts[category]} ${category}`);
  }
  
  return `${total} ${noteWord}: ${parts.join(", ")}.`;
}

function isDuplicate(text) {
  const normalizedInput = text.trim().toLowerCase();
  return notes.some(note => 
    note.text.trim().toLowerCase() === normalizedInput
  );
}

function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  
  if (text.length < 1 || text.length > 200) {
    console.log("Failed to add: Text must be between 1 and 200 characters. - script.js:58");
    return false;
  }
  
  if (!validCategories.includes(category)) {
    console.log("Failed to add: Category must be personal, work, or study. - script.js:63");
    return false;
  }
  
  if (isDuplicate(text)) {
    console.log("Failed to add: Note already exists. - script.js:68");
    return false;
  }
  
  const newNote = {
    id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
    text: text,
    category: category
  };
  
  notes.push(newNote);
  console.log("Note added successfully. - script.js:79");
  return true;
}

// --- 1. Testing searchNotes ---
console.log(searchNotes("study - script.js:84")); 
// Expected output: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }, { id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("quantum - script.js:87")); 
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

// Test singular phrasing with exactly one note:
let multiNotes = notes;
notes = [{ id: 1, text: "Buy milk", category: "personal" }];
console.log(getSummary()); 
// Expected output: "1 note: 1 personal."
notes = multiNotes; // restore notes array


// --- 5. Testing isDuplicate ---
console.log(isDuplicate("Buy milk and bread - script.js:120")); 
// Expected output: true

console.log(isDuplicate("Learn Python - script.js:123")); 
// Expected output: false


// --- 6. Testing addNote ---
console.log(addNote("Learn Python - script.js:128", "study")); 
// Expected output: true (Logs "Note added successfully.")

console.log(addNote("", "study")); 
// Expected output: false (Logs "Failed to add: Text must be between 1 and 200 characters.")
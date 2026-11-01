
const API_URL = "http://localhost:5000/api/notes";

// Initialize Markdown Editor
const editor = new SimpleMDE({
    element: document.getElementById("markdownEditor"),
    spellChecker: false,
    placeholder: "Write your notes in Markdown...",
    autofocus: false
});

// HTML elements
const titleInput = document.getElementById("noteTitle");
const authorInput = document.getElementById("author");
const notesList = document.getElementById("notesList");
const statusText = document.getElementById("status");

const newNoteBtn = document.getElementById("newNoteBtn");
const refreshBtn = document.getElementById("refreshBtn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

let currentNoteId = null;

// Status message
function setStatus(message) {
    statusText.textContent = message;
}

// Reset editor
function resetEditor() {
    currentNoteId = null;
    titleInput.value = "";
    editor.value("");
    setStatus("Creating a new note...");
}

// Load all notes
async function loadNotes() {
    try {
        setStatus("Loading notes...");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load notes");
        }

        const notes = await response.json();

        renderNotes(notes);
        setStatus(`${notes.length} notes loaded successfully.`);
    } catch (error) {
        console.error(error);
        setStatus("Failed to load notes. Check your server.");
    }
}

// Display notes
function renderNotes(notes) {
    notesList.innerHTML = "";

    if (notes.length === 0) {
        notesList.textContent = "No notes available.";
        return;
    }

    notes.forEach((note) => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";

        const heading = document.createElement("h3");
        heading.textContent = note.title;

        const author = document.createElement("p");
        author.textContent = `By ${note.author || "Anonymous"}`;

        noteItem.append(heading, author);

        noteItem.addEventListener("click", () => {
            currentNoteId = note._id;
            titleInput.value = note.title;
            editor.value(note.content);
            setStatus("Note opened successfully.");
        });

        notesList.appendChild(noteItem);
    });
}

// Create or update note
async function saveNote() {
    const title = titleInput.value.trim();
    const content = editor.value().trim();
    const author = authorInput.value.trim() || "Anonymous";

    if (!title || !content) {
        setStatus("Please enter a title and note content.");
        return;
    }

    const noteData = { title, content, author };

    try {
        const url = currentNoteId
            ? `${API_URL}/${currentNoteId}`
            : API_URL;

        const method = currentNoteId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noteData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to save note");
        }

        currentNoteId = result._id;
        setStatus("Note saved successfully!");
        await loadNotes();

    } catch (error) {
        console.error(error);
        setStatus(error.message);
    }
}

// Delete note
async function deleteNote() {
    if (!currentNoteId) {
        setStatus("Please select a note to delete.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${currentNoteId}`,
            { method: "DELETE" }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete note");
        }

        resetEditor();
        setStatus("Note deleted successfully!");
        await loadNotes();

    } catch (error) {
        console.error(error);
        setStatus(error.message);
    }
}

// Button events
newNoteBtn.addEventListener("click", resetEditor);

refreshBtn.addEventListener("click", loadNotes);

saveBtn.addEventListener("click", saveNote);

deleteBtn.addEventListener("click", deleteNote);

// Load notes when page opens
loadNotes();

console.log("Collaborative Markdown App initialized!");

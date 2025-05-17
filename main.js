const notesList = document.getElementById('notes-list');
const btnNewNote = document.getElementById('btn-new-note');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let activeNoteId = null;

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotesList() {
  notesList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    li.dataset.id = note.id;

    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.justifyContent = 'space-between';
    titleContainer.style.alignItems = 'center';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = note.title;
    titleSpan.style.flexGrow = '1';
    titleSpan.style.overflow = 'hidden';
    titleSpan.style.whiteSpace = 'nowrap';
    titleSpan.style.textOverflow = 'ellipsis';
    titleSpan.style.cursor = 'pointer';
    titleSpan.addEventListener('click', () => selectNote(note.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete note';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.border = 'none';
    deleteBtn.style.color = '#f5d742';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '1.1rem';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.flexShrink = '0';

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete note "${note.title}"?`)) {
        notes = notes.filter(n => n.id !== note.id);
        if (activeNoteId === note.id) {
          activeNoteId = notes.length > 0 ? notes[0].id : null;
          if (activeNoteId) selectNote(activeNoteId);
          else {
            noteTitle.value = '';
            noteContent.value = '';
          }
        }
        saveNotes();
        renderNotesList();
      }
    });

    titleContainer.appendChild(titleSpan);
    titleContainer.appendChild(deleteBtn);

    li.appendChild(titleContainer);

    if(note.id === activeNoteId) {
      li.classList.add('active');
    }

    notesList.appendChild(li);
  });
}

function selectNote(id) {
  activeNoteId = id;
  const note = notes.find(n => n.id === id);
  if (!note) return;
  noteTitle.value = note.title;
  noteContent.value = note.content;
  renderNotesList();
}

function createNewNote() {
  const title = prompt('Enter note title:');
  if (!title) return alert('Title cannot be empty!');
  const newNote = {
    id: Date.now().toString(),
    title,
    content: '',
  };
  notes.unshift(newNote);
  saveNotes();
  activeNoteId = newNote.id;
  renderNotesList();
  selectNote(activeNoteId);
}

function updateActiveNote() {
  if (!activeNoteId) return;
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) return;
  note.title = noteTitle.value.trim() || 'Untitled';
  note.content = noteContent.value;
  saveNotes();
  renderNotesList();
}

btnNewNote.addEventListener('click', createNewNote);

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key.toLowerCase() === 's') {
    e.preventDefault();
    updateActiveNote();
  }
});

if (notes.length > 0) {
  activeNoteId = notes[0].id;
  selectNote(activeNoteId);
} else {
  noteTitle.value = '';
  noteContent.value = '';
  activeNoteId = null;
}

renderNotesList();
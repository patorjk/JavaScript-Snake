// Get references to HTML elements
        const noteInput = document.getElementById('noteInput');
        const addNoteButton = document.getElementById('addNote');
        const notesList = document.getElementById('notesList');

        // Function to create a new note element
        function createNoteElement(noteText) {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';
            noteDiv.textContent = noteText;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                notesList.removeChild(noteDiv);
            });

            noteDiv.appendChild(deleteButton);

            return noteDiv;
        }

        // Function to add a new note
        function addNote() {
            const noteText = noteInput.value.trim();
            if (noteText !== '') {
                const noteElement = createNoteElement(noteText);
                notesList.appendChild(noteElement);
                noteInput.value = '';
            }
        }

        // Event listener for adding a new note
        addNoteButton.addEventListener('click', addNote);

        // Event listener for pressing Enter key to add a new note
        noteInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                addNote();
            }
        });

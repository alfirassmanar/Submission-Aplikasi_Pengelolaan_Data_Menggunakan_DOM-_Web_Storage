
document.addEventListener('DOMContentLoaded', function() {
    const bookForm = document.getElementById('bookForm');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const yearInput = document.getElementById('year');
    const isFinishedInput = document.getElementById('isFinished');
    const unfinishedBooksList = document.getElementById('unfinishedBooks');
    const finishedBooksList = document.getElementById('finishedBooks');

    let books = []; 

    function createBook(id, title, author, year, isComplete) {
        return { id, title, author, year, isComplete };
    }

    function autoRefresh() {
        unfinishedBooksList.innerHTML = "";
        finishedBooksList.innerHTML = "";
        retrieveBooks();
      }

      function createBookElement(book) {
        const listItem = document.createElement('li');
        listItem.classList.add('book-item');
        listItem.innerHTML = `
            <div class="book-details">
                <span class="book-info"><strong>ID:</strong> ${book.id}</span>
                <span class="book-info"><strong>Judul:</strong> ${book.title}</span>
                <span class="book-info"><strong>Penulis:</strong> ${book.author}</span>
                <span class="book-info"><strong>Tahun:</strong> ${book.year}</span>
                <span class="book-info"><strong>Selesai Dibaca:</strong> ${book.isComplete ? 'Ya' : 'Tidak'}</span>
            </div>
            <div class="button-container">
                <button class="delete-button">Hapus</button>
                <button class="move-button">${book.isComplete ? 'Undo' : 'Move'}</button>
            </div>
        `;
    
        const deleteButton = listItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
            deleteBook(book);
            autoRefresh();
        });
    
        const moveButton = listItem.querySelector('.move-button');
        moveButton.addEventListener('click', function() {
            if (book.isComplete) {
                moveBook2(book);
            } else {
                moveBook(book);
            }
            autoRefresh();
        });
    
        const style = document.createElement('style');
        style.textContent = `
            .book-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 8px;
                margin-bottom: 15px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
    
            .book-info {
                display: block;
                margin-bottom: 5px;
            }
    
            .button-container {
                display: flex;
                align-items: center;
            }
    
            .delete-button, .move-button {
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                padding: 8px 15px;
                margin-right: 10px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                font-family: Arial, sans-serif;
            }
    
            .delete-button:hover, .move-button:hover {
                background-color: #0056b3;
            }
        `;
        listItem.appendChild(style);
    
        return listItem;
    }

    
    function addBookToStorage(book) {
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books)); 
        const newBookElement = createBookElement(book); 
        if (book.isComplete) {
            finishedBooksList.appendChild(newBookElement);
        } else {
            unfinishedBooksList.appendChild(newBookElement); 
        }
    }

    function retrieveBooks() {
        if (localStorage.getItem('books')) {
            books = JSON.parse(localStorage.getItem('books')); 
            books.forEach(book => {
                const bookElement = createBookElement(book); 
                if (book.isComplete) {
                    finishedBooksList.appendChild(bookElement); 
                } else {
                    unfinishedBooksList.appendChild(bookElement); 
                }
            });
        }
    }

    function deleteBook(book) {
        const index = books.findIndex(b => b.id === book.id);
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
    }

    function moveBook(book) {
        book.isComplete = true;
        localStorage.setItem('books', JSON.stringify(books));
        const listItem = createBookElement(book);
        finishedBooksList.appendChild(listItem);
        const existingItem = document.querySelector(`#unfinishedBooks li[data-id="${book.id}"]`);
        if (existingItem) {
            existingItem.remove();
        }
        autoRefresh();
    }
    
    function moveBook2(book) {
        book.isComplete = false;
        localStorage.setItem('books', JSON.stringify(books));
        const listItem = createBookElement(book);
        unfinishedBooksList.appendChild(listItem);
        const existingItem = document.querySelector(`#finishedBooks li[data-id="${book.id}"]`);
        if (existingItem) {
            existingItem.remove();
        }
        autoRefresh();
    }

    bookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = Date.now();
        const title = titleInput.value;
        const author = authorInput.value;
        const year = new Date(yearInput.value).getFullYear(); 
        const isComplete = isFinishedInput.checked;
        const newBook = createBook(id, title, author, year, isComplete);
        addBookToStorage(newBook);
        bookForm.reset();
        autoRefresh();
    });

    retrieveBooks();
});

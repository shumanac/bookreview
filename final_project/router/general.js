const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
 
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop (Task 1)
public_users.get('/',function (req, res) {
  try {
    res.json({ books });
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get book details based on ISBN (Task 2)
public_users.get('/isbn/:isbn',function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    const book = books.find((b) => b.isbn === requestedIsbn);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ book });
  } catch (error) {
    console.error('Error getting book details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 });
  
// Get book details based on author (Task 3)
public_users.get('/author/:author',function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    const matchingBooks = books.filter((b) => b.author === requestedAuthor);
    if (matchingBooks.length === 0) {
      return res.status(404).json({ error: 'No books found for the author' });
    }
    res.json({ books: matchingBooks });
  } catch (error) {
    console.error('Error getting book details by author:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all books based on title (Task 4)
public_users.get('/title/:title',function (req, res) {
  try {
    const requestedTitle = req.params.title;
    const matchingBooks = books.filter((b) => b.title === requestedTitle);
    if (matchingBooks.length === 0) {
      return res.status(404).json({ error: 'No books found for the title' });
    }
    res.json({ books: matchingBooks });
  } catch (error) {
    console.error('Error getting book details by title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Get book review (Task 5)
public_users.get('/review/:isbn',function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    const bookWithReview = books.find((b) => b.isbn === requestedIsbn);

    if (!bookWithReview) {
      return res.status(404).json({ error: 'Book not found or no review available' });
    }
    res.json({ review: bookWithReview.review });
  } catch (error) {
    console.error('Error getting book review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get list of books using Promise callbacks or async-await (Task 10)

const getAllBooksFromDatabase = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

public_users.get('/books', async (req, res) => {
  try {
    const books = await getAllBooksFromDatabase();
    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get book details by isbn (Task 11)

const getBookDetailsByISBNPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://localhost:5000/books/isbn/${isbn}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  getBookDetailsByISBNPromise(isbn)
    .then(bookDetails => {
      res.json({ bookDetails });
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Get the book details based on Author using Promise callbacks with Axios. (Task 12)

const getBooksByAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://localhost:5000/books/author/${author}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  getBooksByAuthorPromise(author)
    .then(authorBooks => {
      res.json({ authorBooks });
    })
    .catch(error => {
      res.status(404).json(error);
    });
});
//get the book details based on Title using Promise callbacks with Axios. (Task 13)

const getBooksByTitlePromise = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://localhost:5000/books/title/${title}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  getBooksByTitlePromise(title)
    .then(titleBooks => {
      res.json({ titleBooks });
    })
    .catch(error => {
      res.status(404).json(error);
    });
});

module.exports.general = public_users;

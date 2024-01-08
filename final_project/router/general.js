const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    res.json({ books });
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get book details based on ISBN
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
  
// Get book details based on author
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

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

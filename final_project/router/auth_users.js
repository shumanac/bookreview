const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
const authenticatedUser = (username,password)=>{  
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
}
});

// Add a book review

var  bookReviews = [];
regd_users.put("/auth/review/:isbn", (req, res) => {
 
  try {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const existingReviewIndex = bookReviews.findIndex((item) => item.isbn === isbn);

    if (existingReviewIndex !== -1) {
      bookReviews[existingReviewIndex].review = review;
      return res.status(200).json({ message: 'Review updated successfully' });
    }

    bookReviews.push({ isbn, review });

    return res.status(200).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding book review:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
 
  try {
    const isbnToDelete = req.params.isbn;
   

    // Find the index of the review with the provided ISBN
    const reviewIndex = bookReviews.findIndex((review) => review.isbn === isbnToDelete);

    if (reviewIndex !== -1) {
      // If the review is found, remove it from the array
      bookReviews.splice(reviewIndex, 1);
      return res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    console.error('Error deleting book review:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

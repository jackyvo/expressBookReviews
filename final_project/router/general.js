const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    resolve(books)
  })

  booksPromise.then(data => {
    res.send(data)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let bookPromise = new Promise((resolve, reject) => {
    let book = books[req.params.isbn]
    resolve(book)
  })

  bookPromise.then(data => {
    res.send(data)
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let bookPromise = new Promise((resolve, reject) => {
    let isbn = Object.keys(books).find((isbn) => books[parseInt(isbn)].author == req.params.author )
    resolve(books[isbn])
  })

  bookPromise.then(data => {
    res.send(data)
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let bookPromise = new Promise((resolve, reject) => {
    let isbn = Object.keys(books).find((isbn) => books[parseInt(isbn)].title == req.params.title )
    resolve(books[isbn])
  })

  bookPromise.then(data => {
    res.send(data)
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn]
  res.send(book.reviews)
});

module.exports.general = public_users;

const express = require("express");
const app  = express();

const http = require('http');
const port = 2000;
const server = http.createServer(app);


const courses = [
    { 'topic': 'math', 'location': 'hendon', 'price': 100 },
    { 'topic': 'math', 'location': 'colindale', 'price': 80 },
    { 'topic': 'math', 'location': 'brent cross', 'price': 90 },
    { 'topic': 'math', 'location': 'golders green', 'price': 120 },
];

const user = [{'image': 'user.png', 'name': 'Anuoluwapo', 'email': 'EE5043@live.mdx.ac.uk', 'password': 'mypassword'}];

app.get('/lesson', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(courses));
});

app.get('/checkout', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(user));
})

server.listen(port);
console.log('Sever Is Now Running On Port 2000');


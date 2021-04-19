const express = require("express");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "94984-1566-165",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "424-24-234",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "24-24-234-24",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hellooo World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

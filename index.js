const express = require("express");
const app = express();

app.use(express.json());

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

app.get("/info", (request, response) => {
  let date = Date();
  response.send(`
  <p>Phonebook has info for ${persons.length} people.</p>
  <p>${date}</p>
  `);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  console.log(id);
  let person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const genId = () => {
  const id = Math.floor(Math.random() * 1000);
  return id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  let duplicateName = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );
  if (duplicateName) {
    return response.status(400).json({
      error: "Name alrady exist in the phonebook",
    });
  }

  const person = {
    id: genId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`----------------------------------------------------------------`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Request Status: ${res.statusCode}`);
    console.log(`----------------------------------------------------------------`);
    next();
});

// Read all clients
app.get('/clients', (req, res) => {
    const clients = JSON.parse(fs.readFileSync('clients.json', 'utf8'));
    res.json(clients);
});

// Read a specific client by ID
app.get('/clients/:id', (req, res) => {
    const id = req.params.id;
    const clients = JSON.parse(fs.readFileSync('clients.json', 'utf8'));
    const client = clients.find((c) => c.id == id);
    res.json(client);
});

// Create a new client
generateId = (clients) => {
    const maxId = clients.reduce((max, client) => {
        return client.id > max ? client.id : max;
    }, 0);
    return maxId + 1;
}

// Create a new client
app.post('/clients', (req, res) => {
    const clients = JSON.parse(fs.readFileSync('clients.json'));

    // Generate a unique ID based on existing client IDs
    const id = generateId(clients);

    // Initialize the new client object with required properties
    const newClient = {
        id,
        name: req.body.name,
        surname: req.body.surname,
        fiscalCode: req.body.fiscalCode,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        username: req.body.username,
        netWorth: req.body.netWorth
    };

    // Validate the client data format
    if (!isValidClient(newClient)) {
        return res.status(400).json({ error: 'Invalid client data format' });
    }

    clients.push(newClient);
    fs.writeFileSync('clients.json', JSON.stringify(clients, null, 2));
    res.json(newClient); // Send the new client as a JSON response
});

// Update a client
app.put('/clients/:id', (req, res) => {
    const id = req.params.id;
    const updatedClient = req.body;

    // Validate the client data format
    if (!isValidClient(updatedClient)) {
        return res.status(400).json({ error: 'Invalid client data format' });
    }

    const clients = JSON.parse(fs.readFileSync('clients.json'));
    const index = clients.findIndex((c) => c.id === id);
    clients[index] = updatedClient;
    fs.writeFileSync('clients.json', JSON.stringify(clients, null, 2));
    res.json(updatedClient);
});

// Helper function to validate client data format
isValidClient = (client) => {
    return (
        client.id &&
        client.name &&
        client.surname &&
        client.fiscalCode &&
        client.dateOfBirth &&
        client.email &&
        client.username &&
        client.netWorth
    );
}


// Delete a client
app.delete('/clients/:id', (req, res) => {
    const id = req.params.id;
    const clients = JSON.parse(fs.readFileSync('clients.json', 'utf8'));
    const index = clients.findIndex((c) => c.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'Client not found' });
    }

    const deletedClient = clients.splice(index, 1)[0];
    fs.writeFileSync('clients.json', JSON.stringify(clients, null, 2));
    res.json(deletedClient);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

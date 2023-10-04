const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
// Import the WebSocket module
const WebSocket = require('ws'); 
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const uri = 'mongodb+srv://fypadrs:2LyeS0UDBHOphdd8@cluster0.d5sggzz.mongodb.net/AccidentDetectionAndReportingSystem?retryWrites=true&w=majority';

const hostname = process.env.WEBSOCKET_HOSTNAME;
const port = process.env.WEBSOCKET_PORT;

app.use(cors( {origin: 'http://localhost:3002',credentials: true}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }));
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

mongoose.connect(uri, {
  autoIndex: true,
  dbName:'test'
}).then(() => {
  console.log(`MongoDB connected with server at ${mongoose.connection.host}!`);

  // Define the schema for the reports collection
  const reportSchema = new mongoose.Schema({
    riderId: {                          
        type:  mongoose.Types.ObjectId,
        required: true
    },
    createdAt: {                  
        type: Date,
        required: true
    },
    city: {                             
        type: String,
    },
    rescuedBy: [                         //organizations which accepted the request for rescue
        {
            rescueId: {
                type: mongoose.Types.ObjectId
            },
            organizationName: {
                type: String
            },
            rescuedAt: {                       
                type: Date
            }
        },
    ],
    status: {
        type: String,
        enum: ['inactive', 'active'],
        default: 'inactive'
    },
  });

  // Create a model for the reports collection
  const Report = mongoose.model('Report', reportSchema, 'reports');

  // Listen for new reports and send alerts to clients
  Report.watch().on('change', (change) => {
    // If a new report is added, send an alert to all connected clients
    if (change.operationType === 'insert') {
      const newReport = change.fullDocument;
      console.log('New report:', newReport);

      // Send the new report to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newReport));
        }
      });
    }
  });
}).catch((err) => {
  console.log(err);
});

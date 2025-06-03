// server.js
const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

// Stockage des données utilisateur (en production, utiliser une base de données)
const users = {};
const plans = {
  essentiel: ['service2'],
  apaise: ['service1', 'service2', 'service4'],
  serenite: ['service1', 'service2', 'service3', 'service4', 'service5']
};

// Endpoint pour générer les PDF de fermeture de compte
app.post('/generate-closure-docs', (req, res) => {
  const { platforms, userInfo } = req.body;
  
  // Générer le HTML pour le PDF
  const html = `
    <h1>Demande de fermeture de compte</h1>
    ${platforms.map(p => `
      <div style="page-break-after: always;">
        <h2>Demande pour ${p}</h2>
        <p>Je soussigné(e) ${userInfo.name}...</p>
      </div>
    `).join('')}
  `;
  
  const options = { format: 'Letter' };
  
  pdf.create(html, options).toBuffer((err, buffer) => {
    if (err) return res.status(500).json({ error: err });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=documents-fermeture.pdf');
    res.send(buffer);
  });
});

// Endpoint pour programmer un message posthume
app.post('/schedule-message', (req, res) => {
  const { message, recipients, sendDate } = req.body;
  
  // Ici vous stockeriez en base de données et programmeriez le cron job
  // Exemple avec une tâche planifiée simple
  scheduleMessage(message, recipients, sendDate);
  
  res.json({ success: true });
});

function scheduleMessage(message, recipients, sendDate) {
  // Implémentation réelle avec node-cron ou équivalent
  console.log(`Message programmé pour ${sendDate}`);
}

app.listen(3000, () => console.log('Server running on port 3000'));
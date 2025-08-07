import React, { useState } from 'react';
import GmailForm from './components/GmailForm';
import './index.css';

function App() {
  const [gmailFormVisible, setGmailFormVisible] = useState(false);
  const [jsonVisible, setJsonVisible] = useState(false);

  return (
    <div className="panel-container">
      <h1 className="panel-title">Mailmind</h1>
      <p className="panel-subtitle">
        MailMind Asistanı, yüklediğiniz e-posta dosyalarını yapay zekâ ile özetler,
        konu başlıklarına göre sınıflandırır ve size özel özet yanıtlar sunar.
      </p>

      <button className="main-button" onClick={() => setGmailFormVisible(true)}>
        Gmail'den E-posta Al
      </button>
      {/* <button className="main-button" onClick={() => setJsonVisible(true)}>
        JSON Dosyası Yükle
      </button> */}

      {gmailFormVisible && <GmailForm />}
      {jsonVisible && <p>📂 JSON yükleme kısmı daha sonra buraya eklenecek...</p>}
    </div>
  );
}

// örnek fonksiyon:
async function analyzeEmails(emails) {
  const resp = await fetch("http://localhost:5000/api/analyze-emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emails }),
  });
  const data = await resp.json();
  return data.results; // içinde kategori, özet, otomatik yanıt, öncelik var!
}


export default App;

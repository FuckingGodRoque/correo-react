import React, { useState } from 'react';
import './App.css';

function Sidebar({ onSelect, selected }) {
  return (
    <nav className="sidebar">
      <button className={selected === 'compose' ? 'active' : ''} onClick={() => onSelect('compose')}>Redactar</button>
      <button className={selected === 'sent' ? 'active' : ''} onClick={() => onSelect('sent')}>Enviados</button>
    </nav>
  );
}

function ComposeMail({ onSend }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSent(false);
    try {
      // Simular envío y guardar en enviados
      await new Promise(res => setTimeout(res, 500));
      setSent(true);
      if (onSend) onSend({ to, subject, message, date: new Date().toLocaleString() });
      setTo(''); setSubject(''); setMessage('');
    } catch (err) {
      setError('Error al enviar el correo');
    }
    setSending(false);
  };

  return (
    <div className="compose-mail">
      <h2>Redactar correo</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Para" value={to} onChange={e => setTo(e.target.value)} required />
        <input type="text" placeholder="Asunto" value={subject} onChange={e => setSubject(e.target.value)} required />
        <textarea placeholder="Mensaje" rows={8} value={message} onChange={e => setMessage(e.target.value)} required />
        <button type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Enviar'}</button>
        {sent && <div className="success-msg">¡Correo enviado!</div>}
        {error && <div className="error-msg">{error}</div>}
      </form>
    </div>
  );
}

function Sent({ sentMails }) {
  return (
    <div className="sent">
      <h2>Enviados</h2>
      {sentMails.length === 0 ? (
        <div className="empty-msg">No hay correos enviados</div>
      ) : (
        <ul className="sent-list">
          {sentMails.map((mail, idx) => (
            <li key={idx} className="sent-item">
              <div><b>Para:</b> {mail.to}</div>
              <div><b>Asunto:</b> {mail.subject}</div>
              <div><b>Mensaje:</b> {mail.message}</div>
              <div className="sent-date">{mail.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [view, setView] = useState('sent');
  const [sentMails, setSentMails] = useState([]);

  let content;
  if (view === 'sent') content = <Sent sentMails={sentMails} />;
  else content = <ComposeMail onSend={mail => { setSentMails([mail, ...sentMails]); setView('sent'); }} />;

  return (
    <div className="samsung-mail-app">
      <Sidebar onSelect={setView} selected={view} />
      <main className="main-content">{content}</main>
    </div>
  );
}

export default App;

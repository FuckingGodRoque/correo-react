import React, { useState } from 'react';
import './App.css';

function Sidebar({ onSelect, selected }) {
  return (
    <nav className="sidebar">
      <button className={selected === 'inbox' ? 'active' : ''} onClick={() => onSelect('inbox')}>Bandeja de entrada</button>
      <button className={selected === 'sent' ? 'active' : ''} onClick={() => onSelect('sent')}>Enviados</button>
      <button className={selected === 'compose' ? 'active' : ''} onClick={() => onSelect('compose')}>Redactar</button>
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
      const res = await fetch('http://localhost:3001/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, message })
      });
      if (!res.ok) throw new Error('Error al enviar el correo');
      setSent(true);
      setTo(''); setSubject(''); setMessage('');
      if (onSend) onSend();
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

function Inbox() {
  return (
    <div className="inbox">
      <h2>Bandeja de entrada</h2>
      <div className="empty-msg">No hay correos</div>
    </div>
  );
}

function Sent() {
  return (
    <div className="sent">
      <h2>Enviados</h2>
      <div className="empty-msg">No hay correos enviados</div>
    </div>
  );
}

function App() {
  const [view, setView] = useState('inbox');
  const [refreshSent, setRefreshSent] = useState(false);

  let content;
  if (view === 'inbox') content = <Inbox />;
  else if (view === 'sent') content = <Sent key={refreshSent} />;
  else content = <ComposeMail onSend={() => { setView('sent'); setRefreshSent(r => !r); }} />;

  return (
    <div className="samsung-mail-app">
      <Sidebar onSelect={setView} selected={view} />
      <main className="main-content">{content}</main>
    </div>
  );
}

export default App;

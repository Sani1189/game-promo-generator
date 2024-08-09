import React, { useState, useEffect } from 'react';
import { getPromoCode } from './promoFunctions';
import './App.css';

function App() {
  const [ip, setIp] = useState('');
  const [username, setUsername] = useState('');
  const [selectedGame, setSelectedGame] = useState('BIKE');
  const [keyCount, setKeyCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [requestDetails, setRequestDetails] = useState('');
  const [copyStatus, setCopyStatus] = useState({}); // Track copy status of each code

  useEffect(() => {
    // Fetch IP address
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIp(data.ip));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setPromoCodes([]);
    setRequestDetails('');
    setCopyStatus({}); // Reset copy status

    const generatedCodes = [];
    
    for (let i = 0; i < keyCount; i++) {
      try {
        const code = await getPromoCode(selectedGame);
        generatedCodes.push(code);
        setPromoCodes(prev => [...prev, code]); // Show each code as it's generated
      } catch (error) {
        console.error(error);
        generatedCodes.push('Failed to generate code');
        setPromoCodes(prev => [...prev, 'Failed to generate code']); // Show failure message
      }
    }

    setRequestDetails(`User: ${username}, Game: ${selectedGame}, IP: ${ip}, Keys: ${keyCount}`);
    setLoading(false);
  };

  const handleCopy = (index) => {
    const code = promoCodes[index];
    navigator.clipboard.writeText(code);
    setCopyStatus(prev => ({ ...prev, [index]: 'Copied' })); // Update copy status
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [index]: 'Copy' })); // Reset copy status after 2 seconds
    }, 2000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hamster Kombat Key Code Generator</h1>
        <p>Your IP Address: {ip}</p>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            id="username" 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="game">Game:</label>
          <select 
            id="game" 
            value={selectedGame} 
            onChange={e => setSelectedGame(e.target.value)}
          >
            <option value="BIKE">Bike Game</option>
            <option value="CLONE">Clone Game</option>
            <option value="CUBE">Cube Game</option>
            <option value="TRAIN">Train Game</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="keyCount">Number of Keys:</label>
          <select 
            id="keyCount" 
            value={keyCount} 
            onChange={e => setKeyCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4].map(count => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        
        {loading && <p className="loading-text">Loading... Please wait.</p>}

        {promoCodes.length > 0 && (
          <div className="codes-container">
            <h3>Generated Codes:</h3>
            {promoCodes.map((code, index) => (
              <div key={index} className="code-item">
                <span>{code}</span>
                <button 
                  className="copy-button" 
                  onClick={() => handleCopy(index)}
                >
                  {copyStatus[index] || 'Copy'}
                </button>
              </div>
            ))}
            <div className="request-details">
              <strong>Request Details:</strong>
              <p>{requestDetails}</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

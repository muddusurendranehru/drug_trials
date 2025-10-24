import React, { useState, useEffect } from 'react';
import './App.css';
import RealSearchEngine from './RealSearchEngine';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [trials, setTrials] = useState([]);
  const [message, setMessage] = useState('');
  const [showSearchEngine, setShowSearchEngine] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentView('dashboard');
      loadUser();
      loadTrials();
    }
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadTrials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/trials`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const trialsData = await response.json();
        setTrials(trialsData);
      }
    } catch (error) {
      console.error('Error loading trials:', error);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentView('dashboard');
        loadTrials();
        setMessage('');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleSignup = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Signup successful! Please login.');
        setCurrentView('login');
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setTrials([]);
    setCurrentView('signup');
  };

  const handleAddTrial = async (trialData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/trials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trialData)
      });
      
      if (response.ok) {
        setMessage('Trial added successfully!');
        loadTrials();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to add trial');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="App">
      {currentView === 'login' && (
        <LoginForm onSubmit={handleLogin} message={message} />
      )}
      {currentView === 'signup' && (
        <SignupForm onSubmit={handleSignup} message={message} />
      )}
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user} 
          trials={trials} 
          onAddTrial={handleAddTrial}
          onLogout={handleLogout}
          message={message}
          showSearchEngine={showSearchEngine}
          setShowSearchEngine={setShowSearchEngine}
        />
      )}
      {showSearchEngine && (
        <RealSearchEngine onAddTrial={handleAddTrial} />
      )}
    </div>
  );
}

function SignupForm({ onSubmit, message }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <button onClick={() => setCurrentView('login')}>Login</button></p>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

function LoginForm({ onSubmit, message }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <button onClick={() => setCurrentView('signup')}>Sign Up</button></p>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

function Dashboard({ user, trials, onAddTrial, onLogout, message, showSearchEngine, setShowSearchEngine }) {
  const [trialForm, setTrialForm] = useState({
    trial_acronym: '',
    trial_full_name: '',
    drug_name: '',
    result: '',
    brief_abstract: '',
    image_prompt: '',
    reference_article: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTrial(trialForm);
    setTrialForm({
      trial_acronym: '',
      trial_full_name: '',
      drug_name: '',
      result: '',
      brief_abstract: '',
      image_prompt: '',
      reference_article: ''
    });
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Clinical Drug Trials Dashboard</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button 
            onClick={() => setShowSearchEngine(!showSearchEngine)}
            className="search-engine-toggle"
          >
            {showSearchEngine ? '📝 Manual Entry' : '🔍 AI Search Engine'}
          </button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>
      
      <div className="content">
        <section className="add-trial">
          <h2>Add New Drug Trial</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Trial Acronym (e.g., RECOVERY)"
              value={trialForm.trial_acronym}
              onChange={(e) => setTrialForm({...trialForm, trial_acronym: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Full Trial Name"
              value={trialForm.trial_full_name}
              onChange={(e) => setTrialForm({...trialForm, trial_full_name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Drug Name"
              value={trialForm.drug_name}
              onChange={(e) => setTrialForm({...trialForm, drug_name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Result"
              value={trialForm.result}
              onChange={(e) => setTrialForm({...trialForm, result: e.target.value})}
              required
            />
            <textarea
              placeholder="Brief Abstract"
              value={trialForm.brief_abstract}
              onChange={(e) => setTrialForm({...trialForm, brief_abstract: e.target.value})}
              required
            />
            <textarea
              placeholder="Image Generator Prompt"
              value={trialForm.image_prompt}
              onChange={(e) => setTrialForm({...trialForm, image_prompt: e.target.value})}
              required
            />
            <input
              type="url"
              placeholder="Reference Article URL"
              value={trialForm.reference_article}
              onChange={(e) => setTrialForm({...trialForm, reference_article: e.target.value})}
              required
            />
            <button type="submit">Add Trial</button>
          </form>
        </section>

        <section className="trials-list">
          <h2>Your Drug Trials</h2>
          {trials.map(trial => (
            <div key={trial.id} className="trial-card">
              <h3>{trial.trial_acronym}</h3>
              <p><strong>Full Name:</strong> {trial.trial_full_name}</p>
              <p><strong>Drug:</strong> {trial.drug_name}</p>
              <p><strong>Result:</strong> {trial.result}</p>
              <p><strong>Abstract:</strong> {trial.brief_abstract}</p>
              <p><strong>Image Prompt:</strong> {trial.image_prompt}</p>
              <p><strong>Reference:</strong> <a href={trial.reference_article} target="_blank" rel="noopener noreferrer">View Article</a></p>
              <small>Added: {new Date(trial.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </section>
      </div>
      
      {message && <div className="message">{message}</div>}
    </div>
  );
}

function LoginForm({ onSubmit, message }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <button onClick={() => window.location.reload()}>Sign Up</button></p>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
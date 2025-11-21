import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import './App.css';
import type { AiSearchResult, Trial, TrialFormValues } from './types';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3039/api';
const specialtyFilters = ['All', 'Diabetes', 'Obesity', 'Cardiology', 'Metabolic'];
const aiSources = ['NEJM', 'Lancet', 'JAMA', 'ADA', 'PubMed'];

const emptyForm: TrialFormValues = {
  trial_acronym: '',
  trial_full_name: '',
  drug_name: '',
  result: '',
  brief_abstract: '',
  image_prompt: '',
  reference_article: ''
};

const getStoredUserName = () => {
  const stored = localStorage.getItem('user');
  if (!stored) return 'Clinician';
  try {
    const parsed = JSON.parse(stored);
    return parsed?.name ?? 'Clinician';
  } catch {
    return 'Clinician';
  }
};

const trialToFormValues = (trial: Trial): TrialFormValues => ({
  trial_acronym: trial.trial_acronym ?? '',
  trial_full_name: trial.trial_full_name ?? '',
  drug_name: trial.drug_name ?? '',
  result: trial.result ?? '',
  brief_abstract: trial.brief_abstract ?? '',
  image_prompt: trial.image_prompt ?? '',
  reference_article: trial.reference_article ?? ''
});

const emptyAuthForm = {
  email: '',
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
};

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [userName, setUserName] = useState(() => getStoredUserName());
  const [status, setStatus] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState({ ...emptyAuthForm });

  const [smartQuery, setSmartQuery] = useState('');
  const [smartFilter, setSmartFilter] = useState('All');
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartResults, setSmartResults] = useState<Trial[]>([]);

  const [aiQuery, setAiQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['NEJM', 'PubMed']);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<AiSearchResult[]>([]);

  const [formState, setFormState] = useState<TrialFormValues>({ ...emptyForm });
  const [formLoading, setFormLoading] = useState(false);

  const [savedTrials, setSavedTrials] = useState<Trial[]>([]);
  const [savedFilter, setSavedFilter] = useState('All');
  const [savedLoading, setSavedLoading] = useState(false);

  const buildHeaders = useCallback((withJson = false): HeadersInit => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (withJson) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }, [token]);

  const isAuthenticated = Boolean(token);
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/user`, { headers: buildHeaders() });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setUserName(data.name ?? 'Clinician');
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (error) {
      console.error('User fetch error', error);
    }
  }, [buildHeaders]);

  const fetchSavedTrials = useCallback(async () => {
    try {
      setSavedLoading(true);
      const response = await fetch(`${API_URL}/trials`, { headers: buildHeaders() });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      const filtered =
        savedFilter === 'All'
          ? data
          : data.filter((trial: Trial) =>
              [trial.drug_name, trial.trial_full_name, trial.brief_abstract]
                .join(' ')
                .toLowerCase()
                .includes(savedFilter.toLowerCase())
            );
      setSavedTrials(filtered);
    } catch (error) {
      console.error('Load trials error', error);
    } finally {
      setSavedLoading(false);
    }
  }, [buildHeaders, savedFilter]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchUserProfile();
    fetchSavedTrials();
    setAuthMessage(null);
    setAuthForm({ ...emptyAuthForm });
  }, [fetchSavedTrials, fetchUserProfile, isAuthenticated]);

  const handleSmartSearch = async () => {
    if (!smartQuery && smartFilter === 'All') {
      setSmartResults([]);
      return;
    }
    try {
      setSmartLoading(true);
      const params = new URLSearchParams();
      if (smartQuery) params.append('q', smartQuery);
      if (smartFilter) params.append('specialty', smartFilter);

      const response = await fetch(`${API_URL}/trials/search?${params.toString()}`, {
        headers: buildHeaders()
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      setSmartResults(data);
    } catch (error) {
      console.error('Smart search error', error);
      setStatus('Unable to complete smart search.');
    } finally {
      setSmartLoading(false);
    }
  };

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((item) => item !== source) : [...prev, source]
    );
  };

  const handleAiSearch = async () => {
    if (!aiQuery) {
      setStatus('Enter a molecule or trial name before running AI search.');
      return;
    }
    try {
      setAiLoading(true);
      const response = await fetch(`${API_URL}/ai-search`, {
        method: 'POST',
        headers: buildHeaders(true),
        body: JSON.stringify({ query: aiQuery, sources: selectedSources })
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      setAiResults(data.results ?? []);
      setStatus(
        data.usedOpenAI ? 'AI scan completed via OpenAI.' : 'Showing mock AI results until an OpenAI key is configured.'
      );
    } catch (error) {
      console.error('AI search error', error);
      setStatus('AI search failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyResultToForm = (result: Partial<TrialFormValues>) => {
    setFormState((prev) => ({
      ...prev,
      ...result
    }));
  };

  const handleFormChange = (field: keyof TrialFormValues, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTrial = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.trial_acronym || !formState.trial_full_name || !formState.drug_name || !formState.result) {
      setStatus('Please fill in the required fields before saving.');
      return;
    }
    try {
      setFormLoading(true);
      const response = await fetch(`${API_URL}/trials`, {
        method: 'POST',
        headers: buildHeaders(true),
        body: JSON.stringify(formState)
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) {
        const errorPayload = await response.json();
        setStatus(errorPayload.error ?? 'Unable to save trial.');
        return;
      }
      const saved = await response.json();
      setStatus(`Saved ${saved.trial_acronym} successfully.`);
      setFormState({ ...emptyForm });
      fetchSavedTrials();
    } catch (error) {
      console.error('Save trial error', error);
      setStatus('Unable to save trial.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserName('Clinician');
    setSavedTrials([]);
    setSmartResults([]);
    setAiResults([]);
  };

  const handleAuthInput = (field: keyof typeof authForm, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setAuthLoading(true);
      setAuthMessage(null);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthMessage(data.error ?? 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUserName(data.user?.name ?? 'Clinician');
      setAuthMessage('Login successful!');
    } catch (error) {
      console.error('Login error', error);
      setAuthMessage('Login failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (authForm.password !== authForm.confirmPassword) {
      setAuthMessage('Passwords do not match.');
      return;
    }
    try {
      setAuthLoading(true);
      setAuthMessage(null);
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthMessage(data.error ?? 'Signup failed');
        return;
      }
      setAuthMessage('Signup successful! Please log in.');
      setAuthView('login');
    } catch (error) {
      console.error('Signup error', error);
      setAuthMessage('Signup failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const renderAuthPanel = () => (
    <section className="card auth-panel">
      <header className="card-header">
        <div>
          <p className="eyebrow">{authView === 'login' ? 'Secure access' : 'Create account'}</p>
          <h3>{authView === 'login' ? 'Sign in to continue' : 'Join the workspace'}</h3>
        </div>
        <div className="segmented">
          <button className={classNames({ active: authView === 'login' })} onClick={() => setAuthView('login')}>
            Login
          </button>
          <button className={classNames({ active: authView === 'signup' })} onClick={() => setAuthView('signup')}>
            Sign Up
          </button>
        </div>
      </header>
      <form className="auth-form" onSubmit={authView === 'login' ? handleLogin : handleSignup}>
        <label>
          Email
          <input
            type="email"
            required
            value={authForm.email}
            onChange={(e) => handleAuthInput('email', e.target.value)}
          />
        </label>
        {authView === 'signup' && (
          <>
            <label>
              Full Name
              <input
                type="text"
                required
                value={authForm.name}
                onChange={(e) => handleAuthInput('name', e.target.value)}
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                required
                value={authForm.phone}
                onChange={(e) => handleAuthInput('phone', e.target.value)}
              />
            </label>
          </>
        )}
        <label>
          Password
          <input
            type="password"
            required
            value={authForm.password}
            onChange={(e) => handleAuthInput('password', e.target.value)}
          />
        </label>
        {authView === 'signup' && (
          <label>
            Confirm Password
            <input
              type="password"
              required
              value={authForm.confirmPassword}
              onChange={(e) => handleAuthInput('confirmPassword', e.target.value)}
            />
          </label>
        )}
        {authMessage && <div className="auth-message">{authMessage}</div>}
        <button type="submit" className="solid" disabled={authLoading}>
          {authLoading ? 'Please wait...' : authView === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>
    </section>
  );

  const formatDate = (value: string) => new Date(value).toLocaleDateString();

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">AI-powered clinical research workspace</p>
          <h1>Discover faster. Decide with confidence.</h1>
          <p className="lead">
            Search endocrine, obesity, and cardiology trials. Let AI prefill abstracts, then save curated insights for
            your care teams.
          </p>
          <div className="hero-cta">
            <button className="ghost">Smart Search</button>
            <button className="solid">AI Scan</button>
          </div>
          <div className="founder-card">
            <p className="founder-name">Dr. Muddu Surendra Nehru, M.D.</p>
            <p className="founder-sub">
              Professor of Medicine • World&apos;s first physician to develop a solely AI-based clinical drug trials app.
            </p>
            <div className="founder-actions">
              <a className="ghost" href="tel:+919963721999">
                +91 99637 21999
              </a>
              <a
                className="solid"
                href="mailto:govindanamodrugtrials@gmail.com?subject=Donate%2FHelp%2FForward"
              >
                Donate / Help / Forward
              </a>
            </div>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span>Total trials</span>
            <strong>{savedTrials.length}</strong>
          </div>
          <div className="stat-card">
            <span>AI scans this week</span>
            <strong>{aiResults.length}</strong>
          </div>
          <div className="stat-card">
            <span>Lead researcher</span>
            <strong>{userName}</strong>
          </div>
        </div>
      </header>

      {status && (
        <div className="status-banner">
          <p>{status}</p>
          <button onClick={() => setStatus(null)}>Dismiss</button>
        </div>
      )}

      <section className="top-bar">
        <div>
          <p className="welcome">Welcome back, {userName}</p>
          <p className="subtle">Keep physicians synced with the freshest trials.</p>
        </div>
        {isAuthenticated && (
          <button className="ghost danger" onClick={handleLogout}>
            Logout
          </button>
        )}
      </section>

      {!isAuthenticated && renderAuthPanel()}

      {isAuthenticated && (
        <>
          <section className="search-grid">
            <div className="card">
              <header className="card-header">
                <div>
                  <p className="eyebrow">Step 1 — query saved studies</p>
                  <h3>Smart Search</h3>
                </div>
              </header>
              <div className="card-body">
                <div className="input-row">
                  <input
                    type="text"
                    placeholder="Search saved trials (e.g., semaglutide)"
                    value={smartQuery}
                    onChange={(e) => setSmartQuery(e.target.value)}
                  />
                  <button onClick={handleSmartSearch} disabled={smartLoading}>
                    {smartLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                <div className="segmented">
                  {specialtyFilters.map((filter) => (
                    <button
                      key={filter}
                      className={classNames({ active: smartFilter === filter })}
                      onClick={() => setSmartFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="results-list">
                  {smartLoading && <p className="muted">Loading saved trials...</p>}
                  {!smartLoading && smartResults.length === 0 && (
                    <div className="empty-state">
                      <p>No matches yet. Try another keyword or run an AI scan.</p>
                    </div>
                  )}
                  {smartResults.map((trial) => (
                    <article key={trial.id} className="result-card">
                      <div>
                        <h4>{trial.trial_acronym}</h4>
                        <p>{trial.trial_full_name}</p>
                        <small>{formatDate(trial.created_at)}</small>
                      </div>
                      <div className="result-actions">
                        {trial.reference_article && (
                          <a href={trial.reference_article} target="_blank" rel="noreferrer">
                            View journal
                          </a>
                        )}
                        <button onClick={() => applyResultToForm(trialToFormValues(trial))}>Use this data</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <header className="card-header">
                <div>
                  <p className="eyebrow">Step 1 — run AI scan</p>
                  <h3>AI Research Engine</h3>
                </div>
              </header>
              <div className="card-body">
                <div className="input-row">
                  <input
                    type="text"
                    placeholder="Search new molecule or indication"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                  />
                  <button onClick={handleAiSearch} disabled={aiLoading}>
                    {aiLoading ? 'Scanning...' : 'Run AI Scan'}
                  </button>
                </div>
                <div className="tag-grid">
                  {aiSources.map((source) => (
                    <button
                      key={source}
                      className={classNames('tag', { active: selectedSources.includes(source) })}
                      onClick={() => toggleSource(source)}
                    >
                      {source}
                    </button>
                  ))}
                </div>
                <div className="results-list">
                  {aiLoading && <p className="muted">Consulting journals...</p>}
                  {!aiLoading && aiResults.length === 0 && (
                    <div className="empty-state">
                      <p>AI will surface fresh abstracts here.</p>
                    </div>
                  )}
                  {aiResults.map((result, index) => (
                    <article key={`${result.trial_acronym}-${index}`} className="result-card ai-card">
                      <div>
                        <div className="badge">{(Number(result.confidence) * 100).toFixed(0)}% confidence</div>
                        <h4>{result.trial_acronym}</h4>
                        <p>{result.trial_full_name}</p>
                        <p className="muted">{result.brief_abstract}</p>
                        <small>{result.source_label}</small>
                      </div>
                      <div className="result-actions">
                        <button onClick={() => applyResultToForm(result)}>Insert into form</button>
                        <a href={result.reference_article} target="_blank" rel="noreferrer">
                          Open source
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <header className="card-header">
              <div>
                <p className="eyebrow">Step 2 — review & save</p>
                <h3>Curate Trial</h3>
              </div>
              <span className="chip">Prefilled via AI</span>
            </header>
            <form className="form-grid" onSubmit={handleSaveTrial}>
              <label>
                Trial Acronym
                <input
                  value={formState.trial_acronym}
                  onChange={(e) => handleFormChange('trial_acronym', e.target.value)}
                  required
                />
              </label>
              <label>
                Full Trial Name
                <input
                  value={formState.trial_full_name}
                  onChange={(e) => handleFormChange('trial_full_name', e.target.value)}
                  required
                />
              </label>
              <label>
                Drug Name
                <input value={formState.drug_name} onChange={(e) => handleFormChange('drug_name', e.target.value)} required />
              </label>
              <label>
                Result
                <input value={formState.result} onChange={(e) => handleFormChange('result', e.target.value)} required />
              </label>
              <label className="full-span">
                Brief Abstract
                <textarea
                  rows={4}
                  value={formState.brief_abstract}
                  onChange={(e) => handleFormChange('brief_abstract', e.target.value)}
                />
              </label>
              <label className="full-span">
                Image Prompt
                <textarea
                  rows={3}
                  value={formState.image_prompt}
                  onChange={(e) => handleFormChange('image_prompt', e.target.value)}
                />
              </label>
              <label className="full-span">
                Reference Article URL
                <input
                  type="url"
                  value={formState.reference_article}
                  onChange={(e) => handleFormChange('reference_article', e.target.value)}
                />
              </label>
              <div className="form-actions full-span">
                <button type="submit" className="solid" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save to Database'}
                </button>
                <button type="button" className="ghost" onClick={() => setFormState({ ...emptyForm })}>
                  Reset
                </button>
              </div>
            </form>
          </section>

          <section className="card">
            <header className="card-header">
              <div>
                <p className="eyebrow">Step 3 — share</p>
                <h3>Your Saved Trials</h3>
              </div>
              <div className="segmented">
                {specialtyFilters.map((filter) => (
                  <button
                    key={filter}
                    className={classNames({ active: savedFilter === filter })}
                    onClick={() => setSavedFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </header>
            <div className="saved-grid">
              {savedLoading && <p className="muted">Loading saved trials...</p>}
              {!savedLoading && savedTrials.length === 0 && (
                <div className="empty-state">
                  <p>No saved trials yet. Start with Smart or AI search.</p>
                </div>
              )}
              {savedTrials.map((trial) => (
                <article key={trial.id} className="trial-card">
                  <div className="badge">{trial.trial_acronym}</div>
                  <h4>{trial.trial_full_name}</h4>
                  <p className="muted">{trial.result}</p>
                  <div className="meta-row">
                    <span>{trial.drug_name}</span>
                    <span>{formatDate(trial.created_at)}</span>
                  </div>
                  <div className="card-footer">
                    {trial.reference_article && (
                      <a href={trial.reference_article} target="_blank" rel="noreferrer">
                        Open source
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
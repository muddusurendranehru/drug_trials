import React, { useState } from 'react';
import './SearchEngine.css';

const SmartSearch = ({ trials, onAddTrial }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrials, setFilteredTrials] = useState([]);
  const [message, setMessage] = useState('');

  const handleSmartSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const searchLower = searchTerm.toLowerCase();
    const filtered = trials.filter(trial => 
      trial.drug_name.toLowerCase().includes(searchLower) ||
      trial.trial_acronym.toLowerCase().includes(searchLower) ||
      trial.trial_full_name.toLowerCase().includes(searchLower) ||
      trial.result.toLowerCase().includes(searchLower) ||
      trial.brief_abstract.toLowerCase().includes(searchLower)
    );

    setFilteredTrials(filtered);
    setMessage(`Found ${filtered.length} trials matching "${searchTerm}"`);
  };

  const handleAddTrial = (trial) => {
    onAddTrial(trial);
    setMessage(`✅ Added "${trial.trial_acronym}" to your trials`);
  };

  const handleAddAll = () => {
    filteredTrials.forEach(trial => onAddTrial(trial));
    setMessage(`✅ Added all ${filteredTrials.length} trials to your collection`);
  };

  return (
    <div className="search-engine">
      <div className="search-header">
        <h2>🔍 Smart Search - Your Saved Trials</h2>
        <p>Search through your {trials.length} saved drug trials instantly</p>
      </div>

      <form onSubmit={handleSmartSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search your trials by drug name, acronym, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
          >
            🔍 Smart Search
          </button>
        </div>
      </form>

      {message && (
        <div className={`message ${filteredTrials.length > 0 ? 'success' : 'info'}`}>
          {message}
        </div>
      )}

      {filteredTrials.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h3>📊 Smart Search Results ({filteredTrials.length} trials found)</h3>
            <button 
              onClick={handleAddAll}
              className="add-all-button"
            >
              ➕ Add All Results
            </button>
          </div>

          <div className="trials-grid">
            {filteredTrials.map((trial, index) => (
              <div key={trial.id || index} className="trial-result-card">
                <div className="trial-header">
                  <h4>{trial.trial_acronym}</h4>
                  <span className="source-badge">Your Saved Trial</span>
                </div>
                
                <div className="trial-content">
                  <p><strong>Full Name:</strong> {trial.trial_full_name}</p>
                  <p><strong>Drug:</strong> {trial.drug_name}</p>
                  <p><strong>Result:</strong> {trial.result}</p>
                  <p><strong>Abstract:</strong> {trial.brief_abstract}</p>
                  <p><strong>Image Prompt:</strong> {trial.image_prompt}</p>
                  <p><strong>Reference:</strong> 
                    <a href={trial.reference_article} target="_blank" rel="noopener noreferrer">
                      View Article
                    </a>
                  </p>
                </div>

                <button 
                  onClick={() => handleAddTrial(trial)}
                  className="add-trial-button"
                >
                  ➕ Add This Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="search-tips">
        <h4>🔍 Smart Search Features:</h4>
        <ul>
          <li><strong>Drug Name Search:</strong> Find trials by medication name</li>
          <li><strong>Acronym Search:</strong> Search by trial acronyms (SURMOUNT, LEAD, etc.)</li>
          <li><strong>Content Search:</strong> Search within abstracts and results</li>
          <li><strong>Instant Results:</strong> No API calls, search your saved data</li>
          <li><strong>Quick Access:</strong> Find and re-add your favorite trials</li>
        </ul>
      </div>
    </div>
  );
};

export default SmartSearch;

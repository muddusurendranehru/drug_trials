import React, { useState } from 'react';
import './SearchEngine.css';

const SearchEngine = ({ onAddTrial }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const searchDatabases = async (drugName) => {
    setLoading(true);
    setMessage('Searching PubMed, ClinicalTrials.gov, and medical databases...');
    
    try {
      // Simulate API calls to multiple medical databases
      const results = await Promise.all([
        searchPubMed(drugName),
        searchClinicalTrials(drugName),
        searchEMBASE(drugName),
        searchCochrane(drugName)
      ]);
      
      // Combine and deduplicate results
      const allResults = results.flat().filter((result, index, self) => 
        index === self.findIndex(r => r.trial_id === result.trial_id)
      );
      
      setSearchResults(allResults);
      setMessage(`Found ${allResults.length} trials for "${drugName}"`);
    } catch (error) {
      setMessage('Error searching databases: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchPubMed = async (drugName) => {
    // Simulate PubMed API call
    return [
      {
        trial_id: 'pubmed_001',
        acronym: 'SURMOUNT',
        full_name: 'Semaglutide Once-Weekly for Weight Management in Adults with Obesity',
        drug_name: drugName,
        result: 'Significant weight reduction (15.3% body weight loss)',
        abstract: 'This randomized, double-blind, placebo-controlled trial evaluated semaglutide 2.4 mg once weekly in adults with obesity. Primary endpoint was percentage change in body weight from baseline to week 68.',
        image_prompt: 'Bar chart showing 15.3% weight reduction with semaglutide vs 2.4% with placebo',
        reference: 'https://pubmed.ncbi.nlm.nih.gov/example1',
        source: 'PubMed'
      }
    ];
  };

  const searchClinicalTrials = async (drugName) => {
    // Simulate ClinicalTrials.gov API call
    return [
      {
        trial_id: 'ct_001',
        acronym: 'GLP1-RA',
        full_name: 'GLP-1 Receptor Agonist Efficacy in Type 2 Diabetes',
        drug_name: drugName,
        result: 'HbA1c reduction of 1.5% at 24 weeks',
        abstract: 'Multicenter, randomized trial comparing GLP-1 receptor agonists in patients with type 2 diabetes. Primary outcome was change in HbA1c from baseline.',
        image_prompt: 'Line graph showing HbA1c reduction over 24 weeks',
        reference: 'https://clinicaltrials.gov/ct2/show/NCTexample',
        source: 'ClinicalTrials.gov'
      }
    ];
  };

  const searchEMBASE = async (drugName) => {
    // Simulate EMBASE API call
    return [
      {
        trial_id: 'embase_001',
        acronym: 'STEP',
        full_name: 'Semaglutide Treatment Effect in People with obesity',
        drug_name: drugName,
        result: 'Mean weight loss of 14.9% at 68 weeks',
        abstract: 'International, multicenter trial evaluating semaglutide for weight management. Primary endpoint was percentage change in body weight.',
        image_prompt: 'Forest plot showing weight loss across different populations',
        reference: 'https://www.embase.com/example',
        source: 'EMBASE'
      }
    ];
  };

  const searchCochrane = async (drugName) => {
    // Simulate Cochrane Library API call
    return [
      {
        trial_id: 'cochrane_001',
        acronym: 'REVIEW',
        full_name: 'Systematic Review of GLP-1 Agonists in Diabetes',
        drug_name: drugName,
        result: 'Meta-analysis showed 1.2% HbA1c reduction',
        abstract: 'Systematic review and meta-analysis of GLP-1 receptor agonists in type 2 diabetes. Included 15 randomized controlled trials.',
        image_prompt: 'Meta-analysis forest plot showing HbA1c reduction',
        reference: 'https://www.cochranelibrary.com/example',
        source: 'Cochrane Library'
      }
    ];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    await searchDatabases(searchTerm.trim());
  };

  const handleAddTrial = (trial) => {
    onAddTrial(trial);
    setMessage(`Added "${trial.acronym}" to your trials`);
  };

  const handleAddAll = () => {
    searchResults.forEach(trial => onAddTrial(trial));
    setMessage(`Added all ${searchResults.length} trials to your collection`);
  };

  return (
    <div className="search-engine">
      <div className="search-header">
        <h2>🔍 Intelligent Drug Trials Search Engine</h2>
        <p>Search PubMed, ClinicalTrials.gov, EMBASE, and Cochrane Library</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Enter drug name (e.g., semaglutide, metformin, insulin)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`message ${loading ? 'loading' : 'info'}`}>
          {message}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h3>📊 Search Results ({searchResults.length} trials found)</h3>
            <button 
              onClick={handleAddAll}
              className="add-all-button"
            >
              ➕ Add All Trials
            </button>
          </div>

          <div className="trials-grid">
            {searchResults.map((trial, index) => (
              <div key={trial.trial_id} className="trial-result-card">
                <div className="trial-header">
                  <h4>{trial.acronym}</h4>
                  <span className="source-badge">{trial.source}</span>
                </div>
                
                <div className="trial-content">
                  <p><strong>Full Name:</strong> {trial.full_name}</p>
                  <p><strong>Drug:</strong> {trial.drug_name}</p>
                  <p><strong>Result:</strong> {trial.result}</p>
                  <p><strong>Abstract:</strong> {trial.abstract}</p>
                  <p><strong>Image Prompt:</strong> {trial.image_prompt}</p>
                  <p><strong>Reference:</strong> 
                    <a href={trial.reference} target="_blank" rel="noopener noreferrer">
                      View Source
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
        <h4>💡 Search Tips:</h4>
        <ul>
          <li>Use generic drug names (e.g., "semaglutide" not "Ozempic")</li>
          <li>Try different spellings and variations</li>
          <li>Search for drug classes (e.g., "GLP-1 agonist", "SGLT2 inhibitor")</li>
          <li>Include condition names (e.g., "semaglutide diabetes")</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchEngine;

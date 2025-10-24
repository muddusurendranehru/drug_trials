// Test script for backend endpoints
// Run with: node test-backend.js

const API_URL = 'http://localhost:3039/api';

async function testEndpoint(method, endpoint, data = null, headers = {}) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        console.log(`${method} ${endpoint}: ${response.status}`);
        console.log('Response:', result);
        console.log('---');
        
        return { response, result };
    } catch (error) {
        console.error(`Error testing ${method} ${endpoint}:`, error.message);
        return null;
    }
}

async function runTests() {
    console.log('🧪 Testing Clinical Drug Trials Backend API\n');
    
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    await testEndpoint('GET', '/health');
    
    // Test 2: Sign up
    console.log('2. Testing signup...');
    const signupResult = await testEndpoint('POST', '/signup', {
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
        password: 'password123',
        confirmPassword: 'password123'
    });
    
    // Test 3: Login
    console.log('3. Testing login...');
    const loginResult = await testEndpoint('POST', '/login', {
        email: 'test@example.com',
        password: 'password123'
    });
    
    let token = null;
    if (loginResult && loginResult.result.token) {
        token = loginResult.result.token;
        console.log('✅ Login successful, token received');
    }
    
    if (token) {
        // Test 4: Get user profile
        console.log('4. Testing get user profile...');
        await testEndpoint('GET', '/user', null, { 'Authorization': `Bearer ${token}` });
        
        // Test 5: Create trial
        console.log('5. Testing create trial...');
        const trialResult = await testEndpoint('POST', '/trials', {
            trial_acronym: 'TEST',
            trial_full_name: 'Test Clinical Trial',
            drug_name: 'Test Drug',
            result: 'Positive results',
            brief_abstract: 'This is a test trial with positive results.',
            image_prompt: 'Bar chart showing 30% improvement',
            reference_article: 'https://example.com/article'
        }, { 'Authorization': `Bearer ${token}` });
        
        // Test 6: Get trials
        console.log('6. Testing get trials...');
        await testEndpoint('GET', '/trials', null, { 'Authorization': `Bearer ${token}` });
    }
    
    console.log('\n✅ Backend testing completed!');
    console.log('\nNext steps:');
    console.log('1. Set up your Neon database with the schema');
    console.log('2. Update the .env file with your database URL');
    console.log('3. Start the backend: cd backend && npm start');
    console.log('4. Open frontend/index.html in your browser');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}


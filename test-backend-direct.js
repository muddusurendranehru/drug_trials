// Test backend directly
import fetch from 'node-fetch';

async function testBackend() {
    try {
        console.log('Testing backend health...');
        const response = await fetch('http://localhost:3039/api/health');
        const data = await response.json();
        console.log('Health check:', data);
        
        console.log('\nTesting signup...');
        const signupResponse = await fetch('http://localhost:3039/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@test.com',
                name: 'Test User',
                phone: '1234567890',
                password: 'password123'
            })
        });
        
        const signupData = await signupResponse.json();
        console.log('Signup result:', signupData);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testBackend();

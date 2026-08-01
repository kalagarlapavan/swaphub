import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runTests = async () => {
  console.log('Starting Test Server...');
  const serverProcess = spawn('node', [path.join(__dirname, 'test-server.js')], {
    stdio: 'inherit',
  });

  // Give the server time to spin up and database to connect
  await sleep(4000);

  const baseUrl = 'http://localhost:5001/api/auth';
  let token = '';

  try {
    // 1. Register User
    console.log('\n--- Test 1: Register User ---');
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        location: 'New York, NY',
      }),
    });
    const regData = await regRes.json();
    console.log(`Status: ${regRes.status}`);
    console.log('Response:', regData);
    if (regRes.status === 201 && regData.token) {
      console.log('✅ Register user PASSED');
    } else {
      console.error('❌ Register user FAILED');
    }

    // 2. Register Duplicate User
    console.log('\n--- Test 2: Register Duplicate User ---');
    const dupRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe Duplicate',
        email: 'john@example.com',
        password: 'password123',
        location: 'Chicago, IL',
      }),
    });
    const dupData = await dupRes.json();
    console.log(`Status: ${dupRes.status}`);
    console.log('Response:', dupData);
    if (dupRes.status === 400) {
      console.log('✅ Duplicate user validation PASSED');
    } else {
      console.error('❌ Duplicate user validation FAILED');
    }

    // 3. Login User (Success)
    console.log('\n--- Test 3: Login User (Success) ---');
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    console.log(`Status: ${loginRes.status}`);
    console.log('Response:', loginData);
    if (loginRes.status === 200 && loginData.token) {
      token = loginData.token;
      console.log('✅ Login user PASSED');
    } else {
      console.error('❌ Login user FAILED');
    }

    // 4. Login User (Wrong Password)
    console.log('\n--- Test 4: Login User (Wrong Password) ---');
    const badLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'wrongpassword',
      }),
    });
    const badLoginData = await badLoginRes.json();
    console.log(`Status: ${badLoginRes.status}`);
    console.log('Response:', badLoginData);
    if (badLoginRes.status === 401) {
      console.log('✅ Wrong password handling PASSED');
    } else {
      console.error('❌ Wrong password handling FAILED');
    }

    // 5. Access Protected Profile (Success)
    console.log('\n--- Test 5: Fetch Profile (With Valid Token) ---');
    const profileRes = await fetch(`${baseUrl}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const profileData = await profileRes.json();
    console.log(`Status: ${profileRes.status}`);
    console.log('Response:', profileData);
    if (profileRes.status === 200 && profileData.email === 'john@example.com') {
      console.log('✅ Fetch profile PASSED');
    } else {
      console.error('❌ Fetch profile FAILED');
    }

    // 6. Access Protected Profile (No Token)
    console.log('\n--- Test 6: Fetch Profile (Without Token) ---');
    const noTokenRes = await fetch(`${baseUrl}/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const noTokenData = await noTokenRes.json();
    console.log(`Status: ${noTokenRes.status}`);
    console.log('Response:', noTokenData);
    if (noTokenRes.status === 401) {
      console.log('✅ Missing token handling PASSED');
    } else {
      console.error('❌ Missing token handling FAILED');
    }

  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    console.log('\nStopping Test Server...');
    serverProcess.kill('SIGTERM');
  }
};

runTests();

#!/usr/bin/env node

/**
 * Enable Email/Password Authentication
 * This script enables email/password sign-in method in Firebase Authentication
 */

const https = require('https');
const { execSync } = require('child_process');

const projectId = 'crm-operation-alpha';

// Get Firebase access token
function getAccessToken() {
  try {
    const token = execSync('firebase login:ci --no-localhost', { encoding: 'utf8' }).trim();
    return token;
  } catch (error) {
    // Try to get token from gcloud
    try {
      const token = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
      return token;
    } catch (err) {
      console.error('Failed to get access token');
      return null;
    }
  }
}

// Enable Email/Password auth via REST API
async function enableEmailAuth() {
  const token = getAccessToken();

  if (!token) {
    console.error('❌ Could not get authentication token');
    console.log('\nPlease enable Email/Password authentication manually:');
    console.log('1. Open: https://console.firebase.google.com/project/' + projectId + '/authentication');
    console.log('2. Click "Get Started"');
    console.log('3. Enable "Email/Password"');
    console.log('4. Save');
    process.exit(1);
  }

  const data = JSON.stringify({
    signIn: {
      email: {
        enabled: true,
        passwordRequired: true
      }
    }
  });

  const options = {
    hostname: 'identitytoolkit.googleapis.com',
    path: `/admin/v2/projects/${projectId}/config?updateMask=signIn.email.enabled`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Email/Password authentication enabled successfully!');
          resolve(responseData);
        } else {
          console.error('❌ Failed to enable authentication');
          console.error('Status:', res.statusCode);
          console.error('Response:', responseData);
          reject(new Error(responseData));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Main execution
console.log('🔧 Enabling Email/Password authentication...\n');
console.log('Project:', projectId);

enableEmailAuth()
  .then(() => {
    console.log('\n✅ Setup complete!');
    console.log('\nYou can now use email/password authentication in your app.');
  })
  .catch((error) => {
    console.error('\n❌ Setup failed');
    console.log('\nPlease enable Email/Password authentication manually:');
    console.log('1. Open: https://console.firebase.google.com/project/' + projectId + '/authentication');
    console.log('2. Click "Get Started"');
    console.log('3. Click "Email/Password"');
    console.log('4. Toggle to "Enabled"');
    console.log('5. Click "Save"');
    process.exit(1);
  });

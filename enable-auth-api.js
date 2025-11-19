const https = require('https');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'crm-operation-alpha';

console.log('Enabling Firebase Email/Password Authentication...\n');

// Try to read service account for authentication
let serviceAccount;
try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log('✓ Service account found\n');
  }
} catch (error) {
  console.log('⚠️  Could not read service account file\n');
}

// For now, let's just use curl with firebase projects list to check auth
const { exec } = require('child_process');

// Try using Firebase CLI to make the API call
exec(`curl -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config?updateMask=signIn.email.enabled" -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "Content-Type: application/json" -d "{\\"signIn\\": {\\"email\\": {\\"enabled\\": true}}}"`,
(error, stdout, stderr) => {
  if (error) {
    console.error('❌ Could not enable authentication via API\n');
    console.log('The Firebase CLI/API method requires gcloud authentication.');
    console.log('\n📋 Please enable manually (takes 30 seconds):');
    console.log('1. Visit: https://console.firebase.google.com/project/crm-operation-alpha/authentication');
    console.log('2. Click "Get Started"');
    console.log('3. Click "Email/Password"');
    console.log('4. Toggle "Enable" to ON');
    console.log('5. Click "Save"');
    return;
  }

  if (stdout.includes('error')) {
    console.error('❌ API returned an error\n');
    console.log('📋 Please enable manually at:');
    console.log('https://console.firebase.google.com/project/crm-operation-alpha/authentication');
  } else {
    console.log('✅ Email/Password authentication may be enabled!');
    console.log('Verify at: https://console.firebase.google.com/project/crm-operation-alpha/authentication');
  }
});

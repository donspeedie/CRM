const { execSync } = require('child_process');
const https = require('https');

const PROJECT_ID = 'crm-operation-alpha';

console.log('Enabling Firebase Email/Password Authentication...\n');

try {
  // Get OAuth access token from gcloud
  console.log('Getting access token...');
  let accessToken;

  try {
    accessToken = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.log('⚠️  gcloud auth failed, trying firebase login token...');
    try {
      accessToken = execSync('firebase login:ci --no-localhost', { encoding: 'utf8' }).trim();
    } catch (err) {
      throw new Error('Could not get access token. Please ensure you are logged in to Firebase CLI.');
    }
  }

  console.log('✓ Access token obtained\n');

  // Enable Email/Password provider using Identity Platform API
  const postData = JSON.stringify({
    signIn: {
      email: {
        enabled: true,
        passwordRequired: true
      }
    }
  });

  const options = {
    hostname: 'identitytoolkit.googleapis.com',
    port: 443,
    path: `/admin/v2/projects/${PROJECT_ID}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Email/Password authentication enabled successfully!');
        console.log('\nYou can now:');
        console.log('1. Visit your production URL');
        console.log('2. Sign up with your email');
        console.log('3. Start using the CRM!');
      } else {
        console.error('❌ Failed to enable authentication');
        console.error(`Status: ${res.statusCode}`);
        console.error('Response:', data);
        console.log('\nPlease enable manually at:');
        console.log(`https://console.firebase.google.com/project/${PROJECT_ID}/authentication`);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log('\nPlease enable manually at:');
    console.log(`https://console.firebase.google.com/project/${PROJECT_ID}/authentication`);
  });

  req.write(postData);
  req.end();

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\nPlease enable Email/Password authentication manually:');
  console.log(`https://console.firebase.google.com/project/${PROJECT_ID}/authentication`);
  process.exit(1);
}

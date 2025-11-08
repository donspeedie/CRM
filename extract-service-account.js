const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const envPath = path.join(__dirname, '.env.local');

try {
  // Read service account JSON
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ serviceAccountKey.json not found!');
    console.log('\nPlease download the service account key first:');
    console.log('1. Visit: https://console.firebase.google.com/project/crm-operation-alpha/settings/serviceaccounts/adminsdk');
    console.log('2. Click "Generate New Private Key"');
    console.log('3. Save as "serviceAccountKey.json" in this directory');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  // Read current .env.local
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Update the service account fields
  envContent = envContent.replace(
    /FIREBASE_ADMIN_CLIENT_EMAIL=.*/,
    `FIREBASE_ADMIN_CLIENT_EMAIL=${serviceAccount.client_email}`
  );

  envContent = envContent.replace(
    /FIREBASE_ADMIN_PRIVATE_KEY=.*/,
    `FIREBASE_ADMIN_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, '\\n')}"`
  );

  // Write updated .env.local
  fs.writeFileSync(envPath, envContent);

  console.log('✅ Service account credentials added to .env.local');
  console.log('✅ You can now test the application locally with: npm run dev');

  // Add serviceAccountKey.json to .gitignore if not already there
  const gitignorePath = path.join(__dirname, '.gitignore');
  let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignoreContent.includes('serviceAccountKey.json')) {
    fs.appendFileSync(gitignorePath, '\nserviceAccountKey.json\n');
    console.log('✅ Added serviceAccountKey.json to .gitignore');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

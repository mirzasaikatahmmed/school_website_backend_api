const { execSync } = require('child_process');

function getLatestTag() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    return tag;
  } catch (error) {
    return null;
  }
}

function bumpVersion(version) {
  const cleanVersion = version.replace(/^v/, '');
  const parts = cleanVersion.split('.').map(Number);
  
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid version format: ${version}`);
  }

  let [major, minor, patch] = parts;

  patch++;
  if (patch > 9) {
    patch = 0;
    minor++;
  }

  return `${major}.${minor}.${patch}`;
}

function main() {
  const latestTag = getLatestTag();
  
  if (!latestTag) {
    console.log('1.0.1'); 
    return;
  }

  try {
    const nextVersion = bumpVersion(latestTag);
    console.log(nextVersion);
  } catch (error) {
    console.error(`Failed to bump version: ${error.message}`);
    process.exit(1);
  }
}

main();

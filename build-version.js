const { writeFileSync } = require('fs');
const { join } = require('path');

const env = process.argv[2];
const BUILD_VERSION_PATH = join(__dirname, `src/environments/build-version-${env}.json`);

function getTimestampBasedVersion() {
  return parseInt(new Date().getTime() / 1000);
}

let currentIteration = 1;

try {
  currentIteration =
    require(`./src/environments/build-version-${env}.json`)?.currentIteration ||
    getTimestampBasedVersion();
} catch (e) {
  currentIteration = getTimestampBasedVersion();
}

const buildVersion = {
  currentIteration: currentIteration + 1,
  buildVersion: `${
    require(`./package.json`)?.version
  }.${currentIteration}-${getTimestampBasedVersion()}`,
};

writeFileSync(BUILD_VERSION_PATH, JSON.stringify(buildVersion, null, 2));

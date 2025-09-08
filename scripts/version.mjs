import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { cac } from 'cac';
import semver from 'semver';

const cli = cac('version');
cli.option('--pre [prerelease]', 'Set the version to a pre-release version');
cli.command('version <bump_version>');
const parsed = cli.parse();

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, '../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const currentVersion = pkg.version;

const allowedVersion = ['major', 'minor', 'patch'];
const allowPretags = ['alpha', 'beta', 'rc'];

const version = parsed.args[0];

if (!allowedVersion.includes(version)) {
  throw new Error(
    `version must be one of ${allowedVersion}, but you passed ${version}`,
  );
}

const hasPre = !!parsed.options.pre;
const pre = parsed.options.pre;

if (hasPre && !allowPretags.includes(pre)) {
  throw new Error(
    `pre tag must be one of ${allowPretags}, but you passed ${pre}`,
  );
}

let newVersion;
if (hasPre) {
  newVersion = semver.inc(currentVersion, `prerelease`, pre);
} else {
  newVersion = semver.inc(currentVersion, version);
}

pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('package.json updated with new version.');

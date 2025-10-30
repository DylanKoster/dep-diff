#! /usr/bin/env node

import { styleText } from 'node:util';
import { execSync } from 'node:child_process';
import { stdout } from 'node:process';

import {
  copyEssentials,
  copyPackageJson,
  cleanPackageJson,
  cleanOutDir,
  getOutDir,
} from './util.js';
import { run } from 'node:test';

const SEP_MAJOR = '-'.repeat(80) + '\n';
const SEP_MINOR = ' ' + '-'.repeat(50) + '\n';
const FILES_TO_COPY = ['LICENSE', 'README.md'];

let stepIndex = 1;

// New helpers for consistent printing and timings
function write(text = '') {
  stdout.write(`${text}\n`);
}

function styled(style, txt) {
  return styleText(style, txt);
}

function info(txt) {
  write(` ${txt}`);
}

function success(txt) {
  write(` ${styled('green', '✔')}  ${txt}`);
}

function fail(txt) {
  write(` ${styled(['bold', 'red'], 'ERROR:')} ${txt}`);
}

function sep(kind = 'minor') {
  write(kind === 'major' ? SEP_MAJOR : SEP_MINOR);
}

// runStep wraps synchronous steps, prints header, measures time, handles errors
function runStep(title, fn) {
  const header = ` Step ${stepIndex++}: ${styled('bold', `\t${title.toUpperCase()}`)}`;
  write(header + '\n');

  const start = Date.now();
  try {
    const result = fn();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);

    success(`${title} — finished in ${elapsed}s\n`);

    return result;
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    fail(`${title} — failed after ${elapsed}s`);

    // print error detail (brief)
    if (err && err.message) {
      write(` ${styled('grey', err.message)}`);
    }

    // ensure non-zero exit code for callers/CI
    process.exitCode = 1;

    throw err;
  }
}

function runBuildPipeline() {
  const start = Date.now();

  // Start build
  write(styled('bold', 'Building dep-diff'));
  sep('major');

  const outDir = getOutDir();
  if (!outDir) {
    fail(`Provided ${styled('grey', 'outDir')} not found.`);
    process.exit(1);
  }

  // Empty outDir
  runStep('Clean outDir', () => {
    info(`Cleaning '${outDir}' directory\n`);
    cleanOutDir(outDir);
  });
  sep('minor');

  // Copy assets
  runStep('Copy essentials to outDir', () => {
    copyEssentials(outDir, FILES_TO_COPY);
    write();
  });
  sep('minor');

  // Clean package.json
  let packageJson;
  runStep('Sanitize package.json', () => {
    packageJson = cleanPackageJson();
    write();
  });
  sep('minor');

  // Copy cleaned package.json
  runStep('Copy package.json', () => {
    copyPackageJson(outDir, packageJson);
  });
  sep('minor');

  // Build (tsc)
  runStep('Build', () => {
    execSync(`tsc --project tsconfig.json`, { stdio: 'inherit' });
  });

  // Final summary
  sep('major');

  write(`${styled('green', `✔  Build pipeline finished`)}`);
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  write(`Time elapsed: ${elapsed}s`);
}

runBuildPipeline();

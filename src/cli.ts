#!/usr/bin/env node

import { DepDiff } from './core.js';
import { DepDiffSection, optionToEnum } from './sections.js';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getPackageJson } from './util.js';

const options = await yargs(hideBin(process.argv))
  .demandCommand(2)
  .usage(
    'Describe the difference in dependencies between two sources\n Usage: $0 [-vh] [-s|--section <deps|dev|peer|all>] <oldSrc> <newSrc>',
  )
  .version()
  .alias('version', 'v')
  .help('help')
  .alias('help', 'h')
  .option('section', {
    describe: 'Which sections to compare.',
    type: 'string',
    default: 'all',
    choices: ['deps', 'dev', 'peer', 'all'],
    alias: 's',
  })
  .coerce('section', optionToEnum)
  .parse();

const jsonOld: any = getPackageJson(options._[0] as string);
const jsonNew: any = getPackageJson(options._[1] as string);
console.log(DepDiff.getDifferences(jsonOld, jsonNew, options.section));

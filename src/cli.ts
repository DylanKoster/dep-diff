#!/usr/bin/env node

import { DepDiff, DepDiffs } from './core.js';
import { DepDiffSection, DepDiffSectionUtil } from './options/sections.js';
import { getPackageJson } from './util.js';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DepDiffOutput, DepDiffOutputUtil } from './options/output-type.js';
import { IDepDiffOutputFormat } from './output/output-format.js';
import { DepDiffJSON } from './output/json.js';
import {
  DepDiffDest,
  DepDiffDestType,
  DepDiffDestUtil,
} from './options/dest.js';
import { access, constants, writeFile } from 'node:fs';
import { stderr, stdout } from 'process';
import { DepDiffTable } from './output/table.js';

class CLI {
  constructor(
    private src1: string,
    private src2: string,
    private section: DepDiffSection,
    private output: DepDiffOutput,
    private dest: DepDiffDest,
  ) {}

  public start() {
    const jsonOld: any = getPackageJson(this.src1);
    const jsonNew: any = getPackageJson(this.src2);
    const diffs: DepDiffs = DepDiff.getDifferences(
      jsonOld,
      jsonNew,
      this.section,
    );

    const output: string = this.formatDiffs(diffs);

    this.printDiffs(output);
  }

  private formatDiffs(diffs: DepDiffs): string {
    let output: IDepDiffOutputFormat;
    switch (this.output) {
      case DepDiffOutput.cli:
        output = new DepDiffTable(!DepDiffDestUtil.toCLI(this.dest));
        break;
      case DepDiffOutput.json:
        output = new DepDiffJSON();
        break;
      default:
        throw Error(`FATAL: Unknown output option: ${this.output}`);
    }

    return output.formatDiffs(diffs);
  }

  private printDiffs(format: string) {
    switch (this.dest.type) {
      case DepDiffDestType.stdout:
        stdout.write(format);
        break;
      case DepDiffDestType.stderr:
        stderr.write(format);
        break;
      case DepDiffDestType.file:
        const file: string = this.dest.file;
        access(file, constants.W_OK, (err) => {
          if (err && err.code !== 'ENOENT')
            throw Error(`FATAL: No write access to file ${file}\n\n${err}`);
          writeFile(file, format, 'utf8', (err) => {
            if (err)
              throw Error(
                `FATAL: Error while writing data to ${file}\n\n${err}`,
              );
          });
        });
        break;
      default:
        throw Error(
          `FATAL: Unknown destination option: ${DepDiffDestUtil.toCLI(this.dest) ? this.dest.type : this.dest.file}`,
        );
    }
  }
}

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
  .coerce('section', DepDiffSectionUtil.optionToEnum)
  .option('output', {
    describe: 'What to do with the output.',
    type: 'string',
    default: 'cli',
    choices: ['cli', 'json'],
    alias: 'o',
  })
  .coerce('output', DepDiffOutputUtil.optionToEnum)
  .option('dest', {
    describe: 'Where to print the output, default: stdout',
    type: 'string',
    default: 'stdout',
    alias: 'd',
  })
  .coerce('dest', DepDiffDestUtil.createDepDiffDest)
  .parse();

const cli = new CLI(
  options._[0] as string,
  options._[1] as string,
  options.section,
  options.output,
  options.dest,
);

cli.start();

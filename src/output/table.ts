import chalk, { ChalkInstance } from 'chalk';
import { DepDiffs, DependencyDifference, DiffType } from '../core.js';
import CliTable3, { Table } from 'cli-table3';
import { IDepDiffOutputFormat } from './output-format.js';
import stripAnsi from 'strip-ansi';

export class DepDiffTable implements IDepDiffOutputFormat {
  constructor(private toFile: boolean) {
    if (this.toFile) chalk.level = 0;
  }

  public formatDiffs(diffs: DepDiffs): string {
    let out = '';

    Object.keys(diffs).forEach((section: string) => {
      const table: Table = this.fillTable(section, diffs[section]);

      if (table) {
        out += `${table.toString()}\n`;
      }
    });

    return this.toFile ? stripAnsi(out) : out;
  }

  private fillTable(section: string, secDiff: DependencyDifference[]): Table {
    const added: DependencyDifference[] = secDiff.filter(
      (diff: DependencyDifference) => !diff.old,
    );
    const removed: DependencyDifference[] = secDiff.filter(
      (diff: DependencyDifference) => !diff.new,
    );
    const changed: DependencyDifference[] = secDiff.filter(
      (diff: DependencyDifference) => diff.old && diff.new,
    );

    const table: Table = new CliTable3({
      head: [
        chalk.cyan(section),
        chalk.gray('from'),
        chalk.gray('→'),
        chalk.gray('to'),
        chalk.gray('type'),
      ],
      colAligns: ['left', 'center', 'center', 'center', 'left'],
      colWidths: [30, 20, 3, 20, 10],
      wordWrap: true,
    });

    if (!added.length && !removed.length && !changed.length) {
      table.push([
        {
          colSpan: 5,
          content: chalk.gray(`No changes found in ${section}`),
          hAlign: 'center',
        },
      ]);
    }
    // Added
    added.forEach((dep) => {
      table.push([
        chalk.green(`+ ${dep.package}`),
        '',
        '',
        chalk.green(dep.new || ''),
        chalk.green('added'),
      ]);
    });

    // Removed
    removed.forEach((dep) => {
      table.push([
        chalk.redBright(`- ${dep.package}`),
        chalk.redBright(dep.old || ''),
        '',
        '',
        chalk.redBright('removed'),
      ]);
    });

    // Changed
    changed.forEach((dep) => {
      const color =
        dep.type === DiffType.major
          ? chalk.rgb(255, 165, 0)
          : dep.type === DiffType.minor
            ? chalk.yellow
            : chalk.yellowBright;

      table.push([
        color(`~ ${dep.package}`),
        color(dep.old || ''),
        color('→'),
        color(dep.new || ''),
        color(dep.type || 'changed'),
      ]);
    });

    return table;
  }
}

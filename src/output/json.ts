import { DepDiffs } from '../core.js';
import { IDepDiffOutputFormat } from './output-format.js';

export class DepDiffJSON implements IDepDiffOutputFormat {
  public formatDiffs(diffs: DepDiffs): string {
    return JSON.stringify(diffs, null, 2);
  }
}

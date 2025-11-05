import { DepDiffs } from '@src/core';

export interface IDepDiffOutputFormat {
  formatDiffs(diffs: DepDiffs): string;
}

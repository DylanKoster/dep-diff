export enum DepDiffOutput {
  json = 'json',
  cli = 'cli',
}

export class DepDiffOutputUtil {
  /**
   * Translate the string given in the --section option in the CLI into a DepDiffOutput value.
   *
   * @param option The string object, should be either 'json', or 'cli'.
   *
   * @returns The DepDiffOutput value that is associated with the given option.
   */
  public static optionToEnum(option: string): DepDiffOutput {
    if (!(option in DepDiffOutput))
      throw Error(`Value ${option} does not exist on the DepDiffOutput enum.`);
    return option as DepDiffOutput;
  }
}

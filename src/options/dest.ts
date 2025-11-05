import { DepDiff } from '@src/core';

export enum DepDiffDestType {
  stdout = 'stdout',
  stderr = 'stderr',
  file = 'file',
}

export type DepDiffDest = {
  type: DepDiffDestType;
  file: string;
};

export class DepDiffDestUtil {
  /**
   * Create a DepDiffDest object to be able to pair the type and the actualy file of the destination. This enables simple
   * checking if the output should be written to a file or to stdout/stderr via DepDiffTest.toCLI();
   *
   * @param option The option parsed into the CLI.
   *
   * @returns A newly created DepDiffDest with the correct type and the file destination, if applicable.
   */
  public static createDepDiffDest(option: string): DepDiffDest {
    const type: DepDiffDestType = DepDiffDestUtil.optionToEnum(option);

    return {
      type: type,
      file: type === DepDiffDestType.file ? option : null,
    } as DepDiffDest;
  }

  /**
   * Whether this destination points to a CLI option (stdout or stderr), or to write to a file.
   *
   * @returns true if the type if DepDiffDestType.stdout or DepDiffDestType.stderr, false otherwise.
   */
  public static toCLI(dest: DepDiffDest): boolean {
    return dest.type != DepDiffDestType.file;
  }

  /**
   * Translate the string given in the --section option in the CLI into a DepDiffDestType value.
   *
   * @param option The string object, should be either 'json', or 'cli'.
   *
   * @returns The DepDiffDestType value that is associated with the given option.
   *
   * @throws Error if option is null or undefined.
   */
  public static optionToEnum(option: string): DepDiffDestType {
    if (!option)
      throw Error(
        `Value ${option} does not exist on the DepDiffDestType enum.`,
      );

    if (!(option in DepDiffDestType)) return DepDiffDestType.file;
    return option as DepDiffDestType;
  }
}

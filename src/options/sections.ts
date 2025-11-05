export enum DepDiffSection {
  deps = 'deps',
  dev = 'dev',
  peer = 'peer',
  all = 'all',
}

export class DepDiffSectionUtil {
  private static readonly sectionTranslations: Record<
    DepDiffSection,
    string[]
  > = {
    deps: ['dependencies'],
    dev: ['devDependencies'],
    peer: ['peerDependencies'],
    all: ['dependencies', 'devDependencies', 'peerDependencies'],
  };

  /**
   * Translate a DepDiffSection value into the name of the relevant section in package.json.
   *
   * @param section The DepDiffSection that should be translated.
   *
   * @returns The name of the relevant JSON section, either 'dependencies', 'devDependenvies', 'peerDependencies', or all
   *          of them.
   *
   * @throws Error if section is null or undefined.
   */
  public static enumToKey(section: DepDiffSection): string[] {
    if (!section) throw Error('Section may not be null or undefined.');
    return DepDiffSectionUtil.sectionTranslations[section];
  }

  /**
   * Translate the string given in the --section option in the CLI into aDepDiffSection value.
   *
   * @param option The string object, should be either 'deps', 'dev', 'peer', or 'all'.
   *
   * @returns The DepDiffSection value that is associated with the given option.
   *
   * @throws Error if the option does not exist on the DepDiffSection enum.
   */
  public static optionToEnum(option: string): DepDiffSection {
    if (!(option in DepDiffSection))
      throw Error(`Value ${option} does not exist on the DepDiffSection enum.`);
    return option as DepDiffSection;
  }
}

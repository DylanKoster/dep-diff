export const enum DepDiffSection {
  deps = 'deps',
  dev = 'dev',
  peer = 'peer',
  all = 'all',
}

const sectionTranslations: Record<DepDiffSection, string[]> = {
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
 */
export function enumToKey(section: DepDiffSection): string[] {
  return sectionTranslations[section];
}

/**
 * Translate the string given in the --section option in the CLI into aDepDiffSection value.
 *
 * @param option The string object, should be either 'deps', 'dev', 'peer', or 'all'.
 *
 * @returns The DepDiffSection value that is associated with the given option.
 */
export function optionToEnum(option: string): DepDiffSection {
  return option as DepDiffSection;
}

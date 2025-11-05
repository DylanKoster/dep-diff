import { DepDiffSection, DepDiffSectionUtil } from './options/sections.js';
import { haveSameKeys } from './util.js';

export enum DiffType {
  added = 'added',
  removed = 'removed',
  major = 'major',
  minor = 'minor',
  patch = 'patch',
}

export type DependencyDifference = {
  package: string;
  old?: string;
  new?: string;
  type: DiffType | null;
};

export type DepDiffs = Record<string, DependencyDifference[]>;

export class DepDiff {
  /**
   * Retrieve all differences between the relevant sections of JSON representations of two package.json files.
   *
   * @param oldJson The JSON data for the old package.json
   * @param newSrc The JSON data for the new package.json
   * @param sections The sections that should be compared.
   *
   * @returns A Record<string, DependencyDifference[]> object containg a record of the section and all differences in
   *          that section.
   */
  public static getDifferences(
    oldJson: object,
    newJson: object,
    sections: DepDiffSection,
  ): Record<string, DependencyDifference[]> {
    const jsonOldSections: any = DepDiff.getRelevantSections(
      oldJson,
      DepDiffSectionUtil.enumToKey(sections),
    );

    const jsonNewSections: any = DepDiff.getRelevantSections(
      newJson,
      DepDiffSectionUtil.enumToKey(sections),
    );

    return DepDiff.compareObjects(jsonOldSections, jsonNewSections);
  }

  /**
   * Compare all relevant sections between the old and new package.json
   *
   * @param oldObj The relevant sections of the old object.
   * @param newObj The relevant sections of the new object.
   *
   * @returns A Record<string, DependencyDifference[]> object containg a record of the section and all differences in
   *          that section.
   */
  private static compareObjects(
    oldObj: any,
    newObj: any,
  ): Record<string, DependencyDifference[]> {
    if (!haveSameKeys(oldObj, newObj))
      throw new Error("Objects don't contain the same sections.");

    let diffs: Record<string, DependencyDifference[]> = {};

    for (const section of Object.keys(oldObj)) {
      diffs[section] = DepDiff.compareSections(
        oldObj[section],
        newObj[section],
      );
    }

    return diffs;
  }

  /**
   * Compare all package values in a section.
   *
   * @param oldObj The section object, with format {'package': 'version'}, of the old package.json.
   * @param newObj The section object, with format {'package': 'version'}, of the new package.json.
   *
   * @returns A list of DependencyDifference objects containing the section differences between the old and new objects.ddd
   */
  private static compareSections(
    oldObj: any,
    newObj: any,
  ): DependencyDifference[] {
    const diffs: DependencyDifference[] = [];

    const oldKeys: Set<string> = new Set(Object.keys(oldObj ?? {}));
    const newKeys: Set<string> = new Set(Object.keys(newObj ?? {}));

    // Add new packages to diff
    for (const newKey of newKeys) {
      if (!oldKeys.has(newKey)) {
        diffs.push(DepDiff.createDifference(newKey, undefined, newObj[newKey]));
      }
    }

    // Add removed packages to diff
    for (const oldKey of oldKeys) {
      if (!newKeys.has(oldKey)) {
        diffs.push(DepDiff.createDifference(oldKey, oldObj[oldKey], undefined));
      }
    }

    // Add changed packages to diff
    for (const changedKey of newKeys) {
      if (
        oldKeys.has(changedKey) &&
        oldObj[changedKey] !== newObj[changedKey]
      ) {
        diffs.push(
          DepDiff.createDifference(
            changedKey,
            oldObj[changedKey],
            newObj[changedKey],
          ),
        );
      }
    }

    return diffs;
  }

  /**
   * Extract the relevant sections from the provided JSON.
   *
   * @param json The JSON out of which the sections should be extracted.
   * @param sections The sections that are to be extracted.
   *
   * @returns A JSON object with only the relevant sections. This object will always contain every key in sections, if
   *          this key does not exist in json, the resulting key will have an empty object ({}) as value in the ouput.
   */
  private static getRelevantSections(json: any, sections: string[]): any {
    if (!sections) return {};
    const object: any = {};

    for (const section of sections) {
      object[section] = json[section] ?? {};
    }

    return object;
  }

  private static createDifference(
    key: string,
    oldValue?: string,
    newValue?: string,
  ) {
    const type: DiffType | null = DepDiff.getDiffType(oldValue, newValue);
    return {
      package: key,
      old: oldValue,
      new: newValue,
      type: type,
    } as DependencyDifference;
  }

  private static getDiffType(
    oldValue?: string,
    newValue?: string,
  ): DiffType | null {
    if (!oldValue && !newValue) return null;
    if (!oldValue) return DiffType.added;
    if (!newValue) return DiffType.removed;

    const oldParts = DepDiff.splitVersion(oldValue);
    const newParts = DepDiff.splitVersion(newValue);

    if (!oldParts || !newParts) return null; // invalid version format

    const [oldMajor, oldMinor, oldPatch] = oldParts;
    const [newMajor, newMinor, newPatch] = newParts;

    if (oldMajor !== newMajor) return DiffType.major;
    if (oldMinor !== newMinor) return DiffType.minor;
    if (oldPatch !== newPatch) return DiffType.patch;

    return null; // no change
  }

  /**
   * Splits the value in the major, minor, and patch versions. The input should be in the format x.x(.x).
   *
   * @param value The full version string
   *
   * @returns
   */
  private static splitVersion(version: string): number[] | null {
    const numPrefixChars: number = DepDiff.getPrefixSize(version);
    version = version.slice(numPrefixChars);
    const parts = version.split('.');

    if (parts.length > 3) return null;

    const nums = parts.map((version: string) => parseInt(version, 10));
    if (nums.some(isNaN)) return null;

    return nums;
  }

  private static getPrefixSize(version: string): number {
    if (version.startsWith('^')) {
      return 1;
    } else if (version.startsWith('~')) {
      return 1;
    } else if (version.startsWith('>=')) {
      return 2;
    } else if (version.startsWith('<')) {
      return 1;
    } else if (version.startsWith('||')) {
      return 2;
    }

    return 0;
  }
}

import fs from 'fs';
import { DepDiffSection, enumToKey } from './sections.js';
import { haveSameKeys } from './util.js';

export type DependencyDifference = {
  package: string;
  old: string;
  new: string;
};

export class DepDiff {
  /**
   * Retrieve all differences between the relevant sections of JSON representations of two package.json files.
   *
   * @param oldSrc The source file for the old package.json
   * @param newSrc The source file for the new package.json
   * @param sections The sections that should be compared.
   *
   * @returns A Record<string, DependencyDifference[]> object containg a record of the section and all differences in
   *          that section.
   */
  public static getDifferences(
    oldSrc: any,
    newSrc: any,
    sections: DepDiffSection,
  ): Record<string, DependencyDifference[]> {
    const jsonOld: any = DepDiff.getPackageJson(oldSrc);
    const jsonOldSections: any = DepDiff.getRelevantSections(
      jsonOld,
      enumToKey(sections),
    );

    const jsonNew: any = DepDiff.getPackageJson(newSrc);
    const jsonNewSections: any = DepDiff.getRelevantSections(
      jsonNew,
      enumToKey(sections),
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
    for (const newKey of newKeys.difference(oldKeys)) {
      diffs.push({
        package: newKey,
        old: undefined,
        new: newObj[newKey],
      } as DependencyDifference);
    }

    // Add removed packages to diff
    for (const oldKey of oldKeys.difference(newKeys)) {
      diffs.push({
        package: oldKey,
        old: oldObj[oldKey],
        new: undefined,
      } as DependencyDifference);
    }

    // Add changed packages to diff
    for (const changedKey of newKeys.intersection(oldKeys)) {
      if (oldObj[changedKey] === newObj[changedKey]) continue;
      diffs.push({
        package: changedKey,
        old: oldObj[changedKey],
        new: newObj[changedKey],
      } as DependencyDifference);
    }

    return diffs;
  }

  /**
   * Extract the relevant sections ('dependencies', 'devDependencies', and/or
   * 'peerDependencies') from the provided JSON.
   *
   * @param json The JSON out of which the sections should be extracted.
   * @param sections The sections that are to be extracted.
   *
   * @returns A JSON object with only the relevant sections.
   */
  private static getRelevantSections(json: any, sections: string[]): any {
    const object: any = {};

    for (const section of sections) {
      object[section] = json[section] ?? {};
    }

    return object;
  }

  /**
   * Returns the JSON object that resembles the contents of the source file.
   *
   * @param source The file whose source should be parsed to JSON.
   * @param encoding The file encoding, default utf-8.
   *
   * @throws File not found if the source file does not exist.
   * @throws SyntaxError if the file could not be parsed to JSON.
   *
   * @returns An JSON object representing the source file contents.
   */
  private static getPackageJson(
    source: string,
    encoding: BufferEncoding = 'utf-8',
  ): any {
    if (!fs.existsSync(source)) throw new Error(`File not found: ${source}`);

    return JSON.parse(fs.readFileSync(source, encoding));
  }
}

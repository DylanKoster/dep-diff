import {
  DepDiffSection,
  DepDiffSectionUtil,
} from '../../../src/options/sections';

describe('test DepDiffSectionUtil.optionToEnum function', () => {
  it('should not return correct DepDiffSection with input', () => {
    expect(DepDiffSectionUtil.optionToEnum('deps')).toBe(DepDiffSection.deps);
    expect(DepDiffSectionUtil.optionToEnum('dev')).toBe(DepDiffSection.dev);
    expect(DepDiffSectionUtil.optionToEnum('peer')).toBe(DepDiffSection.peer);
    expect(DepDiffSectionUtil.optionToEnum('all')).toBe(DepDiffSection.all);
  });

  it('should return error if input is invalid', () => {
    expect(() => {
      DepDiffSectionUtil.optionToEnum('test');
    }).toThrow(Error);

    expect(() => {
      DepDiffSectionUtil.optionToEnum('devs');
    }).toThrow(Error);

    expect(() => {
      DepDiffSectionUtil.optionToEnum('');
    }).toThrow(Error);

    expect(() => {
      DepDiffSectionUtil.optionToEnum(undefined);
    }).toThrow(Error);

    expect(() => {
      DepDiffSectionUtil.optionToEnum(null);
    }).toThrow(Error);
  });
});

describe('test DepDiffSectionUtil.enumToKey function', () => {
  it('should return correct DepDiffSection object on correct input', () => {
    expect(DepDiffSectionUtil.enumToKey(DepDiffSection.all)).toStrictEqual([
      'dependencies',
      'devDependencies',
      'peerDependencies',
    ]);
    expect(DepDiffSectionUtil.enumToKey(DepDiffSection.deps)).toStrictEqual([
      'dependencies',
    ]);
    expect(DepDiffSectionUtil.enumToKey(DepDiffSection.dev)).toStrictEqual([
      'devDependencies',
    ]);
    expect(DepDiffSectionUtil.enumToKey(DepDiffSection.peer)).toStrictEqual([
      'peerDependencies',
    ]);
  });

  it('should throw an error on null or undefined input', () => {
    expect(() => {
      DepDiffSectionUtil.enumToKey(null);
    }).toThrow(Error);

    expect(() => {
      DepDiffSectionUtil.enumToKey(undefined);
    }).toThrow(Error);
  });
});

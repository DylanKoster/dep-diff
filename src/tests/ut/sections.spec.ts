import { DepDiffSection, enumToKey, optionToEnum } from '../../sections';

describe('test optionToEnum function', () => {
  it('should not return correct DepDiffSection with input', () => {
    expect(optionToEnum('deps')).toBe(DepDiffSection.deps);
    expect(optionToEnum('dev')).toBe(DepDiffSection.dev);
    expect(optionToEnum('peer')).toBe(DepDiffSection.peer);
    expect(optionToEnum('all')).toBe(DepDiffSection.all);
  });

  it('should return error if input is invalid', () => {
    expect(() => {
      optionToEnum('test');
    }).toThrow(Error);

    expect(() => {
      optionToEnum('devs');
    }).toThrow(Error);

    expect(() => {
      optionToEnum('');
    }).toThrow(Error);

    expect(() => {
      optionToEnum(undefined);
    }).toThrow(Error);

    expect(() => {
      optionToEnum(null);
    }).toThrow(Error);
  });
});

describe('test enumToKey function', () => {
  it('should return correct DepDiffSection object on correct input', () => {
    expect(enumToKey(DepDiffSection.all)).toStrictEqual([
      'dependencies',
      'devDependencies',
      'peerDependencies',
    ]);
    expect(enumToKey(DepDiffSection.deps)).toStrictEqual(['dependencies']);
    expect(enumToKey(DepDiffSection.dev)).toStrictEqual(['devDependencies']);
    expect(enumToKey(DepDiffSection.peer)).toStrictEqual(['peerDependencies']);
  });

  it('should throw an error on null or undefined input', () => {
    expect(() => {
      enumToKey(null);
    }).toThrow(Error);

    expect(() => {
      enumToKey(undefined);
    }).toThrow(Error);
  });
});

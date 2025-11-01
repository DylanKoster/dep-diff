import { DepDiffSection } from '../../sections';
import { DepDiff, DependencyDifference } from '../../core';
import { getPackageJson } from '../../util';
import { unescape } from 'querystring';

describe('test getRelevantSections function', () => {
  const json = {
    a: {
      a_a: 1,
      a_b: 2,
    },
    b: {
      b_a: 1,
      b_b: 2,
      b_c: 3,
      b_d: 4,
    },
    c: {
      c_a: 1,
      c_b: 2,
      c_c: 3,
    },
  };

  it('should return empty objects on empty json input', () => {
    // @ts-expect-error
    expect(DepDiff.getRelevantSections({}, ['a'])).toEqual({ a: {} });
    // @ts-expect-error
    expect(DepDiff.getRelevantSections({}, ['a', 'b'])).toEqual({
      a: {},
      b: {},
    });
    // @ts-expect-error
    expect(DepDiff.getRelevantSections({}, [])).toEqual({});
  });

  it('should return empty object on empty sections input', () => {
    // @ts-expect-error
    expect(DepDiff.getRelevantSections(json, [])).toEqual({});

    // @ts-expect-error
    expect(DepDiff.getRelevantSections(json, null)).toEqual({});

    // @ts-expect-error
    expect(DepDiff.getRelevantSections(json, undefined)).toEqual({});
  });

  it('should retrieve correct sections on valid input', () => {
    let sections: object;

    // @ts-expect-error
    sections = DepDiff.getRelevantSections(json, ['a']);
    expect(sections).toEqual({
      a: {
        a_a: 1,
        a_b: 2,
      },
    });

    // @ts-expect-error
    sections = DepDiff.getRelevantSections(json, ['b', 'c']);
    expect(sections).toEqual({
      b: {
        b_a: 1,
        b_b: 2,
        b_c: 3,
        b_d: 4,
      },
      c: {
        c_a: 1,
        c_b: 2,
        c_c: 3,
      },
    });

    // @ts-expect-error
    sections = DepDiff.getRelevantSections(json, ['a', 'c']);
    expect(sections).toEqual({
      a: {
        a_a: 1,
        a_b: 2,
      },
      c: {
        c_a: 1,
        c_b: 2,
        c_c: 3,
      },
    });
  });
});

describe('test compareSections function', () => {
  it('should return empty array on empty inputs', () => {
    // @ts-expect-error
    expect(DepDiff.compareSections({}, {})).toEqual([]);
    // @ts-expect-error
    expect(DepDiff.compareSections(null, {})).toEqual([]);
    // @ts-expect-error
    expect(DepDiff.compareSections({}, undefined)).toEqual([]);
    // @ts-expect-error
    expect(DepDiff.compareSections(null, null)).toEqual([]);
    // @ts-expect-error
    expect(DepDiff.compareSections(undefined, undefined)).toEqual([]);
  });

  it('should return only new or old objects on one empty input', () => {
    const other = {
      pkg_1: '1.0.0',
      pkg_2: '2.1.0',
      pkg_3: '3.2.1',
      pkg_4: '0.1.2',
    };

    const diff_1 = [
      { package: 'pkg_1', new: other['pkg_1'] },
      { package: 'pkg_2', new: other['pkg_2'] },
      { package: 'pkg_3', new: other['pkg_3'] },
      { package: 'pkg_4', new: other['pkg_4'] },
    ];
    // @ts-expect-error
    expect(DepDiff.compareSections({}, other)).toEqual(diff_1);

    const diff_2 = [
      { package: 'pkg_1', old: other['pkg_1'] },
      { package: 'pkg_2', old: other['pkg_2'] },
      { package: 'pkg_3', old: other['pkg_3'] },
      { package: 'pkg_4', old: other['pkg_4'] },
    ];
    // @ts-expect-error
    expect(DepDiff.compareSections(other, {})).toEqual(diff_2);
  });

  it('should return correct differences', () => {
    const obj1 = {
      pkg_1: '1.0.0',
      pkg_2: '2.1.0',
      pkg_3: '3.2.1',
    };

    const obj2 = {
      pkg_2: '2.2.0',
      pkg_3: '8.0.1',
      pkg_4: '0.1.2',
    };

    const diff_1 = [
      { package: 'pkg_4', old: undefined, new: obj2['pkg_4'] },
      { package: 'pkg_1', old: obj1['pkg_1'], new: undefined },
      { package: 'pkg_2', old: obj1['pkg_2'], new: obj2['pkg_2'] },
      { package: 'pkg_3', old: obj1['pkg_3'], new: obj2['pkg_3'] },
    ];
    // @ts-expect-error
    expect(DepDiff.compareSections(obj1, obj2)).toEqual(diff_1);

    const diff_2 = [
      { package: 'pkg_1', old: undefined, new: obj1['pkg_1'] },
      { package: 'pkg_4', old: obj2['pkg_4'], new: undefined },
      { package: 'pkg_2', old: obj2['pkg_2'], new: obj1['pkg_2'] },
      { package: 'pkg_3', old: obj2['pkg_3'], new: obj1['pkg_3'] },
    ];
    // @ts-expect-error
    expect(DepDiff.compareSections(obj2, obj1)).toEqual(diff_2);
  });
});

describe('test compareObjects function', () => {
  const obj1: object = {
    a: { pkg_1: '1.0.0', pkg_2: '2.1.0', pkg_3: '3.2.1' },
    b: { pkg_4: '3.0.2' },
    c: { pkg_5: '1.8.1', pkg_6: '0.8.21', pkg_7: '2.2.1' },
  };

  const obj2: object = {
    a: { pkg_1: '1.2.0', pkg_3: '3.2.1', pkg_9: '2.4.0' },
    b: { pkg_4: '3.4.2', pkg_8: '8.1.0' },
    c: { pkg_5: '1.8.1', pkg_7: '7.1.0' },
  };

  it('should throw an error if keys differ', () => {
    expect(() => {
      // @ts-expect-error
      DepDiff.compareObjects({ key1: 1, key2: 2 }, { key2: 1, key1: 2 });
    }).toThrow(Error);

    expect(() => {
      // @ts-expect-error
      DepDiff.compareObjects({}, { key1: 2 });
    }).toThrow(Error);

    expect(() => {
      // @ts-expect-error
      DepDiff.compareObjects({ key1: 2 }, {});
    }).toThrow(Error);
  });

  it('should return the correct differences on one empty input', () => {
    const expec_diff1: Record<string, DependencyDifference[]> = {
      a: [
        { package: 'pkg_1', old: '1.0.0', new: undefined },
        { package: 'pkg_2', old: '2.1.0', new: undefined },
        { package: 'pkg_3', old: '3.2.1', new: undefined },
      ],
      b: [{ package: 'pkg_4', old: '3.0.2', new: undefined }],
      c: [
        { package: 'pkg_5', old: '1.8.1', new: undefined },
        { package: 'pkg_6', old: '0.8.21', new: undefined },
        { package: 'pkg_7', old: '2.2.1', new: undefined },
      ],
    };
    // @ts-expect-error
    expect(DepDiff.compareObjects(obj1, { a: {}, b: {}, c: {} })).toStrictEqual(
      expec_diff1,
    );

    const expec_diff2: Record<string, DependencyDifference[]> = {
      a: [
        { package: 'pkg_1', old: undefined, new: '1.2.0' },
        { package: 'pkg_3', old: undefined, new: '3.2.1' },
        { package: 'pkg_9', old: undefined, new: '2.4.0' },
      ],
      b: [
        { package: 'pkg_4', old: undefined, new: '3.4.2' },
        { package: 'pkg_8', old: undefined, new: '8.1.0' },
      ],
      c: [
        { package: 'pkg_5', old: undefined, new: '1.8.1' },
        { package: 'pkg_7', old: undefined, new: '7.1.0' },
      ],
    };
    // @ts-expect-error
    expect(DepDiff.compareObjects({ a: {}, b: {}, c: {} }, obj2)).toStrictEqual(
      expec_diff2,
    );
  });

  it('should return the correct differences on both valid inputs', () => {
    const expec_diff3: Record<string, DependencyDifference[]> = {
      a: [
        { package: 'pkg_9', old: undefined, new: '2.4.0' },
        { package: 'pkg_2', old: '2.1.0', new: undefined },
        { package: 'pkg_1', old: '1.0.0', new: '1.2.0' },
      ],
      b: [
        { package: 'pkg_8', old: undefined, new: '8.1.0' },
        { package: 'pkg_4', old: '3.0.2', new: '3.4.2' },
      ],
      c: [
        { package: 'pkg_6', old: '0.8.21', new: undefined },
        { package: 'pkg_7', old: '2.2.1', new: '7.1.0' },
      ],
    };
    // @ts-expect-error
    expect(DepDiff.compareObjects(obj1, obj2)).toStrictEqual(expec_diff3);
  });
});

describe('test getDifferences function', () => {
  it('should throw error on empty inputs', () => {
    expect(() => {
      DepDiff.getDifferences(null, null, null);
    }).toThrow(Error);

    expect(() => {
      DepDiff.getDifferences(undefined, {}, DepDiffSection.dev);
    }).toThrow(Error);

    expect(() => {
      DepDiff.getDifferences(undefined, undefined, DepDiffSection.peer);
    }).toThrow(Error);
  });

  it('should return empty differences on empty inputs', () => {
    expect(DepDiff.getDifferences({}, {}, DepDiffSection.all)).toStrictEqual({
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
    });
  });

  it('should only contain old differences on second input empty', () => {
    const pckg4: object = getPackageJson('src/tests/files/package-4.json');
    const diff1: Record<string, DependencyDifference[]> = {
      dependencies: [
        { package: 'express', old: '^4.19.2', new: undefined },
        { package: 'cors', old: '^2.8.5', new: undefined },
        { package: 'helmet', old: '^7.0.1', new: undefined },
        { package: 'jsonwebtoken', old: '^9.0.2', new: undefined },
        { package: 'mongoose', old: '^8.5.0', new: undefined },
        { package: 'morgan', old: '^1.10.0', new: undefined },
      ],
      devDependencies: [
        { package: 'jest', old: '^30.0.0', new: undefined },
        { package: 'nodemon', old: '^3.1.0', new: undefined },
        { package: 'eslint', old: '^9.5.0', new: undefined },
      ],
      peerDependencies: [],
    };

    expect(DepDiff.getDifferences(pckg4, {}, DepDiffSection.all)).toStrictEqual(
      diff1,
    );

    const diff2: Record<string, DependencyDifference[]> = {
      dependencies: [
        { package: 'express', old: '^4.19.2', new: undefined },
        { package: 'cors', old: '^2.8.5', new: undefined },
        { package: 'helmet', old: '^7.0.1', new: undefined },
        { package: 'jsonwebtoken', old: '^9.0.2', new: undefined },
        { package: 'mongoose', old: '^8.5.0', new: undefined },
        { package: 'morgan', old: '^1.10.0', new: undefined },
      ],
    };

    expect(
      DepDiff.getDifferences(pckg4, {}, DepDiffSection.deps),
    ).toStrictEqual(diff2);
  });

  it('should only contain new differences on first input empty', () => {
    const pckg1: object = getPackageJson('src/tests/files/package-1.json');
    const diff1: Record<string, DependencyDifference[]> = {
      dependencies: [
        { package: 'axios', old: undefined, new: '^1.7.2' },
        { package: 'chalk', old: undefined, new: '^5.3.0' },
        { package: 'dotenv', old: undefined, new: '^16.4.5' },
        { package: 'express', old: undefined, new: '^4.19.2' },
        { package: 'mongoose', old: undefined, new: '^8.3.0' },
        { package: 'winston', old: undefined, new: '^3.13.0' },
      ],
      devDependencies: [
        { package: '@babel/core', old: undefined, new: '^7.25.0' },
        { package: '@babel/preset-env', old: undefined, new: '^7.25.0' },
        { package: 'eslint', old: undefined, new: '^9.4.0' },
        { package: 'jest', old: undefined, new: '^30.0.0' },
        { package: 'nodemon', old: undefined, new: '^3.1.0' },
        { package: 'prettier', old: undefined, new: '^3.3.2' },
        { package: 'webpack', old: undefined, new: '^5.92.0' },
        { package: 'webpack-cli', old: undefined, new: '^5.1.4' },
      ],
      peerDependencies: [],
    };

    expect(DepDiff.getDifferences({}, pckg1, DepDiffSection.all)).toStrictEqual(
      diff1,
    );

    const diff2: Record<string, DependencyDifference[]> = {
      devDependencies: [
        { package: '@babel/core', old: undefined, new: '^7.25.0' },
        { package: '@babel/preset-env', old: undefined, new: '^7.25.0' },
        { package: 'eslint', old: undefined, new: '^9.4.0' },
        { package: 'jest', old: undefined, new: '^30.0.0' },
        { package: 'nodemon', old: undefined, new: '^3.1.0' },
        { package: 'prettier', old: undefined, new: '^3.3.2' },
        { package: 'webpack', old: undefined, new: '^5.92.0' },
        { package: 'webpack-cli', old: undefined, new: '^5.1.4' },
      ],
    };

    expect(DepDiff.getDifferences({}, pckg1, DepDiffSection.dev)).toStrictEqual(
      diff2,
    );
  });

  it('should contain correct differences on package-3.json and package-6.json and all dependencies', () => {
    const pckg3: object = getPackageJson('src/tests/files/package-3.json');
    const pckg6: object = getPackageJson('src/tests/files/package-6.json');
    const diff1: Record<string, DependencyDifference[]> = {
      dependencies: [
        { package: 'next', old: undefined, new: '15.0.0' },
        { package: 'swr', old: undefined, new: '^2.3.0' },
        { package: 'axios', old: undefined, new: '^1.7.3' },
        { package: 'react-router-dom', old: '^7.1.0', new: undefined },
        { package: 'tailwindcss', old: '^3.4.9', new: undefined },
        { package: 'framer-motion', old: '^11.3.2', new: undefined },
        { package: 'react', old: '^18.3.1', new: '^19.2.0' },
        { package: 'react-dom', old: '^18.3.1', new: '^19.2.0' },
      ],
      devDependencies: [
        { package: 'eslint-config-next', old: undefined, new: '^15.0.0' },
        { package: 'vite', old: '^5.2.0', new: undefined },
        { package: '@vitejs/plugin-react', old: '^5.0.3', new: undefined },
        { package: 'eslint', old: '^9.4.0', new: '^9.5.0' },
      ],
      peerDependencies: [],
    };

    expect(
      DepDiff.getDifferences(pckg3, pckg6, DepDiffSection.all),
    ).toStrictEqual(diff1);
  });

  it('should only contain dependencies when sections = deps', () => {
    const pckg3: object = getPackageJson('src/tests/files/package-3.json');
    const pckg6: object = getPackageJson('src/tests/files/package-6.json');
    const diff1: Record<string, DependencyDifference[]> = {
      dependencies: [
        { package: 'react-router-dom', old: undefined, new: '^7.1.0' },
        { package: 'tailwindcss', old: undefined, new: '^3.4.9' },
        { package: 'framer-motion', old: undefined, new: '^11.3.2' },
        { package: 'next', old: '15.0.0', new: undefined },
        { package: 'swr', old: '^2.3.0', new: undefined },
        { package: 'axios', old: '^1.7.3', new: undefined },
        { package: 'react', old: '^19.2.0', new: '^18.3.1' },
        { package: 'react-dom', old: '^19.2.0', new: '^18.3.1' },
      ],
    };

    expect(
      DepDiff.getDifferences(pckg6, pckg3, DepDiffSection.deps),
    ).toStrictEqual(diff1);
  });

  it('should only contain devDependencies when sections = dev', () => {
    const pckg2: object = getPackageJson('src/tests/files/package-2.json');
    const pckg5: object = getPackageJson('src/tests/files/package-5.json');
    const diff1: Record<string, DependencyDifference[]> = {
      devDependencies: [
        { package: 'typescript', old: undefined, new: '^5.4.0' },
        { package: 'vitest', old: undefined, new: '^2.0.1' },
        { package: 'mocha', old: '^11.0.1', new: undefined },
        { package: 'eslint', old: '^9.3.0', new: '^9.4.0' },
      ],
    };

    expect(
      DepDiff.getDifferences(pckg2, pckg5, DepDiffSection.dev),
    ).toStrictEqual(diff1);
  });

  it('should only contain devDependencies when sections = dev', () => {
    const pckg2: object = getPackageJson('src/tests/files/package-2.json');
    const pckg5: object = getPackageJson('src/tests/files/package-5.json');
    const diff1: Record<string, DependencyDifference[]> = {
      devDependencies: [
        { package: 'typescript', old: undefined, new: '^5.4.0' },
        { package: 'vitest', old: undefined, new: '^2.0.1' },
        { package: 'mocha', old: '^11.0.1', new: undefined },
        { package: 'eslint', old: '^9.3.0', new: '^9.4.0' },
      ],
    };

    expect(
      DepDiff.getDifferences(pckg2, pckg5, DepDiffSection.dev),
    ).toStrictEqual(diff1);
  });

  it('should only contain peerDependencies when sections = peer', () => {
    const pckg7: object = getPackageJson('src/tests/files/package-7.json');
    const pckg8: object = getPackageJson('src/tests/files/package-8.json');
    const diff1: Record<string, DependencyDifference[]> = {
      peerDependencies: [
        { package: '@tanstack/react-table', old: undefined, new: '^8.20.0' },
        { package: 'styled-components', old: '^6.1.0', new: undefined },
        { package: 'react', old: '^18.2.0', new: '^18.3.1' },
      ],
    };

    expect(
      DepDiff.getDifferences(pckg8, pckg7, DepDiffSection.peer),
    ).toStrictEqual(diff1);
  });
});

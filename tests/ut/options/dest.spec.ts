import {
  DepDiffDest,
  DepDiffDestType,
  DepDiffDestUtil,
} from '../../../src/options/dest';

describe('test DepDiffDestUtil.optionToEnum function', () => {
  it('should not return correct DepDiffDest with input', () => {
    expect(DepDiffDestUtil.optionToEnum('stderr')).toBe(DepDiffDestType.stderr);
    expect(DepDiffDestUtil.optionToEnum('stdout')).toBe(DepDiffDestType.stdout);
    expect(DepDiffDestUtil.optionToEnum('./testFile.txt')).toBe(
      DepDiffDestType.file,
    );
    expect(DepDiffDestUtil.optionToEnum('./newFile.txt')).toBe(
      DepDiffDestType.file,
    );
  });

  it('should return error if input is invalid', () => {
    expect(() => {
      DepDiffDestUtil.optionToEnum(undefined);
    }).toThrow(Error);

    expect(() => {
      DepDiffDestUtil.optionToEnum(null);
    }).toThrow(Error);
  });
});

describe('test DepDiffDestUtil.createDepDiffDest function', () => {
  it('should have type stdout and no file if input is stdout', () => {
    const obj: DepDiffDest = DepDiffDestUtil.createDepDiffDest('stdout');
    expect(obj.type === DepDiffDestType.stdout);
    expect(obj.file === null);
  });

  it('should have type stderr and no file if input is stderr', () => {
    const obj: DepDiffDest = DepDiffDestUtil.createDepDiffDest('stderr');
    expect(obj.type === DepDiffDestType.stderr);
    expect(obj.file === null);
  });

  it('should have type file and input as file if input is stdout', () => {
    const obj: DepDiffDest = DepDiffDestUtil.createDepDiffDest('testRandom');
    expect(obj.type === DepDiffDestType.file);
    expect(obj.file === 'testRandom');

    const obj2: DepDiffDest = DepDiffDestUtil.createDepDiffDest('/file.txt');
    expect(obj2.type === DepDiffDestType.file);
    expect(obj2.file === 'testRandom');

    const obj3: DepDiffDest = DepDiffDestUtil.createDepDiffDest('./file.json');
    expect(obj3.type === DepDiffDestType.file);
    expect(obj3.file === 'testRandom');
  });

  it('should throw an error if input is null or undefined', () => {
    expect(() => {
      DepDiffDestUtil.createDepDiffDest(null);
    }).toThrow(Error);

    expect(() => {
      DepDiffDestUtil.createDepDiffDest(undefined);
    }).toThrow(Error);
  });
});

describe('test DepDiffDestUtil.toCLI function', () => {
  it('should return true if input is a stdout or stderr', () => {
    const obj: DepDiffDest = DepDiffDestUtil.createDepDiffDest('stdout');
    expect(DepDiffDestUtil.toCLI(obj)).toBeTruthy();

    const obj2: DepDiffDest = DepDiffDestUtil.createDepDiffDest('stderr');
    expect(DepDiffDestUtil.toCLI(obj)).toBeTruthy();
  });

  it('should return false if input is a file', () => {
    const obj: DepDiffDest = DepDiffDestUtil.createDepDiffDest('./file.txt');
    expect(DepDiffDestUtil.toCLI(obj)).toBeFalsy();

    const obj2: DepDiffDest = DepDiffDestUtil.createDepDiffDest('file2.json');
    expect(DepDiffDestUtil.toCLI(obj)).toBeFalsy();
  });
});

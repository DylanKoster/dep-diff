import { getPackageJson, haveSameKeys } from '../../util';

type ObjectValues = NumberConstructor | BooleanConstructor | StringConstructor;

describe('test getPackageJson function', () => {
  it('should return valid JSON on correct input', () => {
    const json: object = getPackageJson('src/tests/files/package-2.json');

    expect(Object.keys(json)).toContain('dependencies');
    expect(Object.keys(json)).toContain('bin');
    expect(Object.keys(json)).toContain('author');
  });

  it('should throw an error on an non-existing file.', () => {
    expect(() => {
      getPackageJson('src/tests/files/package-nonexistant.json');
    }).toThrow(Error);
  });

  it('should throw an error when the file does not contain json', () => {
    expect(() => {
      getPackageJson('src/tests/files/text.txt');
    }).toThrow(SyntaxError);
  });
});

describe('test haveSameKeys function', () => {
  it('should return true on empty objects', () => {
    expect(haveSameKeys({}, {})).toBeTruthy();
  });

  it('should return false on undefined objects', () => {
    expect(haveSameKeys(null, null)).toBeFalsy();
    expect(haveSameKeys(undefined, undefined)).toBeFalsy();
  });

  it('should return true on the same objects', () => {
    const a: object = randomObject(20);
    const b: object = a;
    expect(haveSameKeys(a, b)).toBeTruthy();
  });

  it('should return false on two different objects', () => {
    const a: object = randomObject(20);
    const b: object = randomObject(20);
    expect(haveSameKeys(a, b)).toBeFalsy();
  });

  it('should return false if only one object is undefined', () => {
    const a: object = undefined;
    const b: object = randomObject(20);

    expect(haveSameKeys(a, b)).toBeFalsy();
    expect(haveSameKeys(b, a)).toBeFalsy();
  });
});

function randomObject(max_size: number): object {
  const r = {};
  const numParms = Math.floor(Math.random() * max_size + 1);

  for (let i = 0; i < numParms; i++) {
    const key: string = randString(20);
    const val: number | string | boolean = randValue();

    Object.assign(r, { [key]: val });
  }

  return r;
}

function randType(): ObjectValues {
  const types: ObjectValues[] = [Number, String, Boolean];

  return types[Math.floor(Math.random() * types.length)];
}

function randValue(): number | string | boolean {
  const type: ObjectValues = randType();

  switch (type) {
    case Number:
      return Math.random() * Number.MAX_VALUE;
    case String:
      return randString(20);
    case Boolean:
      return Math.round(Math.random()) === 0;
    default:
      return null;
  }
}

function randString(max_size: number): string {
  const numChars = Math.floor(Math.random() * max_size) + 1;
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let out = '';
  for (let i = 0; i < numChars; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }

  return out;
}

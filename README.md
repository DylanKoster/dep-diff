
<pre align="center" >
            ███╗   ██╗██████╗ ███╗   ███╗                
            ████╗  ██║██╔══██╗████╗ ████║                
            ██╔██╗ ██║██████╔╝██╔████╔██║                
            ██║╚██╗██║██╔═══╝ ██║╚██╔╝██║                
            ██║ ╚████║██║     ██║ ╚═╝ ██║                
            ╚═╝  ╚═══╝╚═╝     ╚═╝     ╚═╝                
                                                         
██████╗ ███████╗██████╗       ██████╗ ██╗███████╗███████╗
██╔══██╗██╔════╝██╔══██╗      ██╔══██╗██║██╔════╝██╔════╝
██║  ██║█████╗  ██████╔╝█████╗██║  ██║██║█████╗  █████╗  
██║  ██║██╔══╝  ██╔═══╝ ╚════╝██║  ██║██║██╔══╝  ██╔══╝  
██████╔╝███████╗██║           ██████╔╝██║██║     ██║     
╚═════╝ ╚══════╝╚═╝           ╚═════╝ ╚═╝╚═╝     ╚═╝     
                                                         
</pre>

<div align="center">

[![Version](https://img.shields.io/npm/v/npm-dep-diff?style=plastic)](https://www.npmjs.com/package/npm-dep-diff)
[![Issues](https://img.shields.io/github/issues/DylanKoster/npm-dep-diff?style=plastic&labelColor=%23333a41)](https://github.com/DylanKoster/npm-dep-diff/issues)
[![PRs](https://img.shields.io/github/issues-pr/DylanKoster/npm-dep-diff?style=plastic&labelColor=%23333a41
)](https://github.com/DylanKoster/npm-dep-diff/pulls)
[![Contributors](https://img.shields.io/github/contributors/DylanKoster/npm-dep-diff?style=plastic&labelColor=%23333a41)](https://github.com/DylanKoster/npm-dep-diff/graphs/contributors)
[![Tests](https://github.com/DylanKoster/npm-dep-diff/actions/workflows/test.yml/badge.svg?label=Tests)](https://github.com/DylanKoster/npm-dep-diff/actions/workflows/test.yml)


<h2>The dependency comparison tool.</h2>
<strong>npm-dep-diff</strong> is a versatile CLI tool that enables developers to compare NPM package dependencies between local files. Support for git refs and npm packages will be added later. Reports can be generated in table or JSON format.

</div>

<br /><br />


- **🔍 Easy Dependency Tracking**: Quickly identify what changed between package.json files without manual comparison
- **📊 Multiple Output Formats**: Choose between human-readable CLI tables or machine-readable JSON for different use cases
- **⚡ Fast & Reliable**: Built with TypeScript for type safety and performance, with comprehensive test coverage
- **🔧 Developer-Friendly**: Simple CLI interface that integrates easily into development workflows and CI/CD pipelines
- **🎯 Flexible Comparison**: Compare specific dependency sections (production, dev, peer) or all at once

<div align="center">
<a href="https://github.com/DylanKoster/npm-dep-diff/issues/new?labels=bug&template=bug-report---.md">Report Bug</a> · <a href="https://github.com/DylanKoster/npm-dep-diff/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
</div>

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Output Formats](#output-formats)
- [Examples](#examples)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Global Installation (Recommended)

```bash
npm install -g npm-dep-diff
```

### Local Installation

```bash
npm install npm-dep-diff
```

### Build from Source

```bash
git clone https://github.com/DylanKoster/npm-dep-diff.git
cd npm-dep-diff
npm install
npm run build
npm link
```

---

## Usage

```bash
npm-dep-diff [options] <oldSrc> <newSrc>
```

Compare dependencies between two package.json sources. Sources are local file paths to package.json files

---

## Options

| Option | Alias | Description | Default | Choices |
|--------|-------|-------------|---------|---------|
| `--section` | `-s` | Which dependency sections to compare | `all` | `deps`, `dev`, `peer`, `all` |
| `--output` | `-o` | Output format | `cli` | `cli`, `json` |
| `--dest` | `-d` | Output destination | `stdout` | `stdout`, `stderr`, `file:path` |
| `--version` | `-v` | Show version number | | |
| `--help` | `-h` | Show help | | |

### Section Options

- `deps` - Compare only production dependencies
- `dev` - Compare only development dependencies
- `peer` - Compare only peer dependencies
- `all` - Compare all dependency sections

### Output Options

- `cli` - Human-readable table format with colors
- `json` - Machine-readable JSON format

### Destination Options

- `stdout` - Output to standard output
- `stderr` - Output to standard error
- `file:path/to/file` - Write output to specified file

---

## Examples

### Basic Usage

Compare two local package.json files:

```bash
npm-dep-diff package-old.json package-new.json
```

### Compare Specific Sections

Compare only production dependencies:

```bash
npm-dep-diff --section deps old-package.json new-package.json
```

Compare development dependencies:

```bash
npm-dep-diff -s dev package-v1.json package-v2.json
```

### Different Output Formats

Output as JSON:

```bash
npm-dep-diff --output json old.json new.json
```

### Save Output to File

```bash
npm-dep-diff --dest file:diff-report.txt old.json new.json
```

### Compare NPM Packages

Compare different versions of a published package:

```bash
npm-dep-diff lodash@4.17.0 lodash@4.17.21
```

### Advanced Usage

Compare all sections and output to both console and file:

```bash
npm-dep-diff --section all --output cli old.json new.json
npm-dep-diff --section all --output json --dest file:report.json old.json new.json
```

---

## Output Formats

### CLI Table Format

The default CLI output provides a human-readable table format with:

- Color-coded changes (green for additions, red for removals, yellow for updates)
- Clear section headers for different dependency types
- Version change indicators (+, -, ~ for major, minor, patch changes)

Example output:
```
┌──────────────────────────────┬────────────────────┬───┬────────────────────┬──────────┐
│ dependencies                 │        from        │ → │         to         │ type     │
├──────────────────────────────┼────────────────────┼───┼────────────────────┼──────────┤
│ + axios                      │                    │   │       ^1.7.3       │ added    │
├──────────────────────────────┼────────────────────┼───┼────────────────────┼──────────┤
│ - react-router-dom           │       ^7.1.0       │   │                    │ removed  │
├──────────────────────────────┼────────────────────┼───┼────────────────────┼──────────┤
│ ~ react                      │      ^18.3.1       │ → │      ^19.2.0       │ 2        │
└──────────────────────────────┴────────────────────┴───┴────────────────────┴──────────┘
```

### JSON Format

For programmatic use, the JSON output provides structured data:

```json
{
  "dependencies": [
    {
      "package": "axios",
      "old": null,
      "new": "^1.7.3",
      "type": "added"
    },
    {
      "package": "react-router-dom",
      "old": "^7.1.0",
      "new": null,
      "type": "removed"
    },
    {
      "package": "react",
      "old": "^18.3.1",
      "new": "^19.2.0",
      "type": "major"
    }
  ],
  "devDependencies": [],
  "peerDependencies": []
}
```

---

## API

npm-dep-diff can also be used programmatically in Node.js applications:

```typescript
import { NpmDepDiff, DepDiffSection } from 'npm-dep-diff';

const oldPackage = require('./package-old.json');
const newPackage = require('./package-new.json');

const differences = NpmDepDiff.getDifferences(
  oldPackage,
  newPackage,
  DepDiffSection.all
);

console.log(differences);
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/DylanKoster/npm-dep-diff.git
cd npm-dep-diff
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm run test
```

4. Build the project:
```bash
npm run build
```

### Project Structure

```
npm-dep-diff/
├── src/                     # Source code
|   ├── options/             # CLI options classes
|   ├── output/               # Output formatters
├── tests/                   # Test files
│   └── ut/                  # Unit tests
├── tools/                   # Build tools
└── build/                   # Compiled output
```

---

## Future work

The following features are planned on being released:
 - GIT ref compatibility: Being able to compare with git references (branch HEADS, releases, tags).
 - NPM packages: Ability to compare with existing NPM packages (and older versions).

 For implementation, details need to be worked out, join the discussion in the [Issues](https://github.com/DylanKoster/npm-dep-diff/issues)!

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

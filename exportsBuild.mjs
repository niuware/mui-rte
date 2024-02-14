import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom default export that take the key as the actual name and an array of the extra exports
const customDefaultExportMap = {};

// Files to ignore in export
const ignoreFiles = [];
// Directories to ignore in epxport
const ignoreDirectories = ['mocks', 'stories'];

function capitalizeFirstLetter(inputString) {
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return inputString;
  }
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

function toCamelCase(inputString) {
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return inputString;
  }

  // Use a regular expression to match letters and numbers
  const validCharsRegex = /[a-zA-Z0-9]/;

  const words = inputString.split(/[\s_-]+/);

  if (words.length <= 1) return inputString;

  const camelCasedWords = words.map((word, index) => {
    // Remove non-letter and non-number characters
    const filteredWord = word
      .split('')
      .filter((char) => validCharsRegex.test(char))
      .join('');

    if (index === 0) {
      return filteredWord.toLowerCase();
    }

    return filteredWord.charAt(0).toUpperCase() + filteredWord.slice(1).toLowerCase();
  });

  return camelCasedWords.join('');
}

function removeStartSubstring(inputString, substringToRemove) {
  if (
    typeof inputString !== 'string' ||
    inputString.length === 0 ||
    typeof substringToRemove !== 'string' ||
    substringToRemove.length === 0
  ) {
    return inputString;
  }
  if (inputString.startsWith(substringToRemove)) {
    return inputString.slice(substringToRemove.length);
  }
  return inputString;
}

function isFirstCharUpperCase(inputString) {
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return false;
  }
  return inputString.charAt(0) === inputString.charAt(0).toUpperCase();
}

function isFile(filePath) {
  return fs.statSync(filePath).isFile() && ignoreFiles.every((file) => !filePath.endsWith(file));
}

function isDirectory(filePath) {
  return (
    fs.statSync(filePath).isDirectory() &&
    ignoreDirectories.every((ignoreDir) => !filePath.endsWith(ignoreDir))
  );
}

function getDirectories(directoryPath) {
  return fs.readdirSync(directoryPath).filter((file) => {
    const filePath = path.join(directoryPath, file);
    return isDirectory(filePath);
  });
}

function getFiles(directoryPath) {
  return fs.readdirSync(directoryPath).filter((file) => {
    const filePath = path.join(directoryPath, file);
    return isFile(filePath);
  });
}

function isFileExportable(file) {
  return (
    (file.endsWith('.ts') || file.endsWith('.tsx')) &&
    !file.endsWith('.test.ts') &&
    !file.endsWith('.test.tsx')
  );
}

function isDirectoryExportable(directoryPath) {
  const files = getFiles(directoryPath);
  if (files.length <= 0) {
    return getDirectories(directoryPath)
      .map((file) => path.join(directoryPath, file))
      .some(isDirectoryExportable);
  }
  return files.some(isFileExportable);
}

function getExports(filePath) {
  try {
    // Read the TypeScript file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const values = ['const', 'let', 'var', 'function', 'class', 'interface', 'type', 'enum'];

    // Regular expression to match export statements
    const exportRegex = new RegExp(
      `export\\s+((?:default\\s+(\\w+))|((?:${values.join('|')})\\s+(\\w+)))`,
      'g',
    );

    // Array to store the exports
    const exportsList = [];
    let match;

    // Iterate through matches in the file content
    while ((match = exportRegex.exec(fileContent)) !== null) {
      const defaultStart = 'export default';
      const isDefault = match[0].startsWith(defaultStart);
      const startUpperCaseDefault =
        isDefault && isFirstCharUpperCase(removeStartSubstring(match[0], defaultStart).trim());
      const exportName = isDefault
        ? 'default'
        : match[1]
            .split(' ')
            .filter((v) => !values.includes(v))
            .join(' ');
      exportsList.push({ name: exportName, isDefault: isDefault, startUpperCaseDefault });
    }
    return exportsList;
  } catch (error) {
    console.error(`Error reading or processing the file: ${error.message}`);
  }
}

function generateIndexFile(directoryPath) {
  const newExports = getFiles(directoryPath)
    .filter((file) => isFileExportable(file) && !file.startsWith('index.'))
    .map((file) => ({ exports: getExports(path.join(directoryPath, file)), file }))
    .map(({ exports, file }) => {
      const baseFile = file.replace(/\.[^/.]+$/, '');

      return `export { ${Array.from(
        new Set(
          exports
            .map((e) => {
              if (e.isDefault) {
                const name = e.startUpperCaseDefault
                  ? capitalizeFirstLetter(toCamelCase(baseFile))
                  : toCamelCase(baseFile);
                const exports = [name];
                if (Object.prototype.hasOwnProperty.call(customDefaultExportMap, name)) {
                  customDefaultExportMap[name].forEach((exp) => {
                    exports.push(exp);
                  });
                }
                return exports.map((name) => `default as ${name}`);
              }
              return [e.name];
            })
            .flat(),
        ),
      )
        .sort()
        .join(', ')} } from './${baseFile}';`;
    });

  const subDirectories = getDirectories(directoryPath)
    .map((file) => path.join(directoryPath, file))
    .filter(isDirectoryExportable)
    .filter((filePath) => isDirectory(filePath));

  const subDirectoryExports = subDirectories.map(
    (subDirectory) => `export * from './${path.basename(subDirectory)}';`,
  );

  const mergedExports = [...newExports, ...subDirectoryExports];

  if (directoryPath.endsWith('src')) {
    mergedExports.unshift("import 'core-js/stable'", "import 'regenerator-runtime/runtime'", '');
  }

  if (mergedExports.length === 0) return;

  const indexPath = path.join(directoryPath, 'index.ts');

  console.log(`Creating file: ${indexPath}`);

  fs.writeFileSync(indexPath, mergedExports.join('\n').trim());
}

function processDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    if (isDirectory(directoryPath)) {
      generateIndexFile(directoryPath);

      const subDirectories = getDirectories(directoryPath)
        .map((file) => path.join(directoryPath, file))
        .filter((filePath) => isDirectory(filePath));

      subDirectories.forEach((subDirectory) => {
        processDirectory(subDirectory);
      });
    }
  }
}

const srcPath = path.join(__dirname, 'src'); // Change this to your actual source directory

processDirectory(srcPath);

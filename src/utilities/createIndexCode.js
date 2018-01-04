import _ from 'lodash';
import {stripExtension} from './readDirectory';

const safeVariableName = (fileName) => {
  const indexOfDot = fileName.indexOf('.');

  if (indexOfDot === -1) {
    return fileName;
  } else {
    return fileName.slice(0, indexOfDot);
  }
};

const buildExportBlock = (files) => {
  // eslint-disable-next-line
  console.log(files);
  const safeFiles = _.map(files, (fileName) => {
    return _.camelCase(safeVariableName(fileName));
  });

  const importBlock = _.map(files, (fileName) => {
    return 'import ' + _.camelCase(safeVariableName(fileName)) + ' from \'./' + fileName + '\';';
  });

  const exportReferences = _.map(safeFiles, (fileName) => {
    return '  ' + fileName + ',\n';
  });

  return importBlock.join('\n') + '\n\nexport default {\n' + exportReferences.join('') + '};';
};

export default (filePaths, options = {}) => {
  let code;
  let configCode;
  let interceptedPaths;

  code = '';
  configCode = '';

  if (options.banner) {
    const banners = _.isArray(options.banner) ? options.banner : [options.banner];

    banners.forEach((banner) => {
      code += banner + '\n';
    });

    code += '\n';
  }

  if (options.noExtension) {
    interceptedPaths = _.map(filePaths, (fileName) => {
      return stripExtension(fileName);
    });
  } else {
    interceptedPaths = filePaths;
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += ' ' + JSON.stringify(options.config);
  }

  code += '// @create-index' + configCode + '\n\n';

  if (interceptedPaths.length) {
    const sortedFilePaths = interceptedPaths.sort();

    code += buildExportBlock(sortedFilePaths) + '\n\n';
  }

  return code;
};

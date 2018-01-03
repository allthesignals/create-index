import _ from 'lodash';

const safeVariableName = (fileName) => {
  const indexOfDot = fileName.indexOf('.');

  if (indexOfDot === -1) {
    return fileName;
  } else {
    return fileName.slice(0, indexOfDot);
  }
};

const buildExportBlock = (files) => {
  const safeFiles = _.map(files, (fileName) => {
    return _.camelCase(safeVariableName(fileName));
  });

  const importBlock = _.map(safeFiles, (fileName) => {
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

  code = '';
  configCode = '';

  if (options.banner) {
    const banners = _.isArray(options.banner) ? options.banner : [options.banner];

    banners.forEach((banner) => {
      code += banner + '\n';
    });

    code += '\n';
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += ' ' + JSON.stringify(options.config);
  }

  code += '// @create-index' + configCode + '\n\n';

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();

    code += buildExportBlock(sortedFilePaths) + '\n\n';
  }

  return code;
};

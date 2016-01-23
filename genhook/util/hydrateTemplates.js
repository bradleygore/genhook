var placeholders = require('./placeholders');

module.exports = (string, replacements) => {
    "use strict";

    Object.keys(placeholders)
        .forEach(placeholder => {
            placeholder = placeholders[placeholder];
            let placeholderRegex = new RegExp(`\\$\\{${placeholder}}`, 'gim');
            string = string.replace(placeholderRegex, replacements[placeholder]);
        });

    return string;
};

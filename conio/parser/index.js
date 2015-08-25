debugger;
function parse(str, options) {
    options = options || {parseAppname: true};
    var result = {};
    result.original = str;
    var tokens = tokenize(str);
    //i use slice() to prevent linking problems
    result.tokenized = tokens.slice();
    var parsed = {};
    if (options.parseAppname) {
        parsed.appname = tokens.shift();
    }
    parsed.nokey = tokens;
    result.parsed = parsed;
    return result
}


function cut(str, spos, length) {
    str = str.split('');
    str.splice(spos, spos, length);
    return str.join('')
}
function lPopChar(str) {
    str = str.split('');
    str.shift();
    return str.join('');
}
function rPopChar(str) {
    str = str.split('');
    str.pop();
    return str.join('');
}
function trim(str) {
    str = lTrim(rTrim(str));
    while (~str.indexOf('\t')) {
        str = str.replace('\t', ' ')
    }
    while (~str.indexOf('  ')) {
        str = str.replace('  ', ' ');
    }
    return str;
}
function lTrim(str) {
    var char;
    while (true) {
        char = str[0];
        if (char == ' ' || char == '\t') {
            str = lPopChar(str);
            continue;
        }
        break;

    }
    return str;
}
function rTrim(str) {
    var char;
    while (true) {
        char = str[str.length - 1];
        if (char == ' ' || char == '\t') {
            str = rPopChar(str);
            continue;
        }
        break;

    }
    return str;
}
function tokenize(str) {
    debugger;
    var result;

    str = trim(str);
    result = str.split(' ');
    result.forEach(function (item, i) {
        if (item.indexOf('-') == 0 && item.length > 2 && item.indexOf('--') !== 0) {
            result.splice(i, 1, item.slice(0, 2), item.slice(2));
        }
    });
    return result
}
module.exports = {
    parse: parse,
    tokenize: tokenize,
    util: {
        trim: trim,
        lPopChar: lPopChar,
        rPopChar: rPopChar
    }

};

debugger;
tokenize('app --key seg -k seg -ppassword');
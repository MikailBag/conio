var util = require('util');
var ansi = require('ansi');
var parser = require('./parser');
exports = module.exports = function (a, b, c) {
    return new Conio(a, b, c);

};
exports.start = module.exports;

function Conio(a, b, c) {
    this.listen(a, b, c);
    this.input.on('readable', this.listener.bind(this));
    //this.output.write('>');
    this.extensions = {};
    this.currentApp = null;
}


var cProto = Conio.prototype;
cProto.listener = function () {
    var cmd, chunk;
    chunk = this.input.read();
    if (chunk === null) {
        return;
    }

    cmd = chunk.toString();
    cmd = cmd.split('');
    cmd.pop();
    cmd.pop();
    cmd = cmd.join('');

    this.handleInput(cmd);


};
cProto.toString = function () {
    return 'OK';
};

cProto.handleInput = function (str) {
    var argv = parser.parse(str, {
        parseAppname: this.currentApp ? false : true
    });
    if (!this.currentApp) {
        if (this.extensions[argv.parsed.appname]) {
            this.currentApp = this.extensions[argv.parsed.appname];
            delete argv.parsed.appname;
        } else {
            return this.errput.write(util.format('app %s is not found\n', str));
        }
    }
    var result = this.currentApp.call(this, argv);
    if (result) {
        this.currentApp = null;
        this.ansi.errput.reset();
        this.ansi.output.reset();
        this.output.write('app finished')
    }
    //this.output.write('>');
};

cProto.registerExtension = function (name, listener/*, options*/) {
    this.extensions[name] = listener;
};

/*
 @@paramset
 @param a(implements stream.readable) stream that conio listens
 @param b(implements stream.writable) stream for conio output
 @param c(implements stream.writable) stream for conio errors
 @@/paramset
 @tocontinue
 */
cProto.listen = function (a, b, c) {
    if (a && b && c) {
    //DO_NOTHING()
    } else if (a && b) {
        c = b
    } else if (a) {
        c = a.errput || a.stderr;
        b = a.output || a.stdout;
        a = a.input || a.stdin;
        if (!c) {
            c = b
        }
        if (!b) {
            c = b = a
        }
    } else if (!a) {
        a = process.stdin;
        b = process.stdout;
        c = process.errput;
    }

    this.input = a;
    this.output = b;
    this.errput = c;
    //creating ansiShell for providing colorized output
    this.ansi = {
        output: ansi(b),
        errput: ansi(c)
    };
};


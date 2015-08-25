var Conio = require('./conio');
var conio = new Conio(process);
conio.registerExtension('repl', function (argv) {
    console.log('repl argv:%j', argv);
    var out = this.ansi.output;
    out.bg.yellow();
    out.write('repl!');
    out.reset();
    out.write('\n');
}, {});
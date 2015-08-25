assert = require 'assert'
parser = require '../parser'
should = require 'should'
describe 'module', ()->
  it 'availible', ()->
    assert parser && parser.parse && parser.tokenize;
  describe 'trims',()->
    it 'string',()->
      assert.equal 'tok str', parser.util.trim(' \t tok \t  str \t  ')
  describe 'tokenizes', ()->
    it 'simple string', ()->
      assert.deepEqual parser.tokenize('app --key seg -k seg -p password'), ['app', '--key', 'seg', '-k', 'seg',
                                                                             '-p', 'password']
    it 'string without \' and " symbols, but with feature -kvalue', ()->
      assert.deepEqual parser.tokenize('app --key seg -k seg -ppassword'), ['app', '--key', 'seg', '-k', 'seg',
                                                                            '-p', 'password']
    it 'string with multiple spaces', ()->
      assert.deepEqual parser.tokenize('app token   token'),['app','token','token']
  describe 'parses', ()->
    it 'simple string contains only appname', ()->
      assert.deepEqual parser.parse('app'), {
        original: 'app'
        tokenized: ['app']
        parsed: {
          appname: 'app'
          nokey: []
        }
      }
    it 'string without any keys', ()->
      assert.deepEqual parser.parse('app a b c d e f'), {
        original: 'app a b c d e f'
        tokenized: ['app', 'a', 'b', 'c', 'd', 'e', 'f']
        parsed: {
          appname: 'app'
          nokey: ['a', 'b', 'c', 'd', 'e', 'f']
        }

      }
  describe 'not parses',()->
    it 'appname when flag "parseAppname" is unset',()->
      assert(parser.parse('itisnotappname',{parseAppname:false}).parsed.should.not.have.property('appname'));

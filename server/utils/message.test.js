var expect = require('expect');
var {generatedMessage} = require('./message');
describe('generatedMessage', () => {
  it('should generate correct message object', () =>{
    var from = 'Eric';
    var text = 'some message';
    var message = generatedMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from,text});
    //store res in variable
    //assert from match
    //assert text match
    //assert createdAt value
  })
});

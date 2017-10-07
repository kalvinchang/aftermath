//all utility functions for creating messages
var generatedMessage = (from, text) => {
  return{
    from,
    text,
    createdAt: new Date().getTime()
  };
};
module.exports = {generatedMessage};

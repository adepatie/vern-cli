var validator = require('validator');

function Model($vern) {
  function IndexModel() {
    this.name = null;

    return this.update(arguments[0]);
  }

  new $vern.model().extend(IndexModel, {
    collection: 'test',
    validations: {
      name: 'notEmpty'
    },
    indexes: ['name']
  });

  return IndexModel;
}

module.exports = Model;
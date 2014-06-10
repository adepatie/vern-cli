var validator = require('validator');

function Model(scope) {
  function {{model_name}}() {
    {{vars}}

    return this.update(arguments[0]);
  }

  new scope.model().extend({{model_name}}, {
    collection: '{{collection}}',
    indexes: {{indexes}},
    exclude: {{exclude}},
    validations: {{validations}},
    validation_exceptions: {{validation_exceptions}},
    non_editable: {{non_editable}}
  }, {{super_constructor}});

  return {{model_name}};
}

module.exports = Model;
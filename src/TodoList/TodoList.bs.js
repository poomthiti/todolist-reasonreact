'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");

var containerStyle = {
  display: "flex",
  flexDirection: "column"
};

var rowStyle = {
  backgroundColor: "aliceblue",
  display: "flex",
  fontSize: "16px",
  marginBottom: "8px",
  padding: "8px",
  alignItems: "center",
  justifyContent: "space-between"
};

var addButtonStyle = {
  display: "flex",
  marginTop: "8px",
  alignSelf: "flex-end"
};

var initialState = [
  {
    id: 1,
    title: "Tester",
    completed: false,
    editing: false
  },
  {
    id: 2,
    title: "OH WOWO",
    completed: true,
    editing: false
  }
];

function newTodo(id) {
  return {
          id: id,
          title: "",
          completed: false,
          editing: true
        };
}

function check(id, todos) {
  return Belt_Array.map(todos, (function (el) {
                if (el.id === id) {
                  return {
                          id: el.id,
                          title: el.title,
                          completed: !el.completed,
                          editing: el.editing
                        };
                } else {
                  return el;
                }
              }));
}

function $$delete(id, todos) {
  return Belt_Array.keep(todos, (function (el) {
                return el.id !== id;
              }));
}

function edit(id, todos) {
  return Belt_Array.map(todos, (function (el) {
                if (el.id === id) {
                  return {
                          id: el.id,
                          title: el.title,
                          completed: el.completed,
                          editing: !el.editing
                        };
                } else {
                  return el;
                }
              }));
}

function confirm(id, text, todos) {
  return Belt_Array.map(todos, (function (el) {
                if (el.id === id) {
                  return {
                          id: el.id,
                          title: text,
                          completed: el.completed,
                          editing: false
                        };
                } else {
                  return el;
                }
              }));
}

function reducer(state, action) {
  if (typeof action === "number") {
    return state.concat([newTodo(state.length + 1 | 0)]);
  }
  switch (action.TAG | 0) {
    case /* Check */0 :
        return check(action._0, state);
    case /* Delete */1 :
        return $$delete(action._0, state);
    case /* Edit */2 :
        return edit(action._0, state);
    case /* Confirm */3 :
        return confirm(action._0, action._1, state);
    
  }
}

function TodoList$Input(Props) {
  var onSubmit = Props.onSubmit;
  var title = Props.title;
  var match = React.useReducer((function (oldText, newText) {
          return newText;
        }), title);
  var setText = match[1];
  var text = match[0];
  return React.createElement("input", {
              type: "text",
              value: text,
              onKeyDown: (function (_event) {
                  if (_event.key === "Enter") {
                    Curry._1(onSubmit, text);
                    return Curry._1(setText, "");
                  }
                  
                }),
              onChange: (function (_event) {
                  return Curry._1(setText, _event.target.value);
                })
            });
}

var Input = {
  make: TodoList$Input
};

function TodoList(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  return React.createElement("div", {
              style: containerStyle
            }, Belt_Array.map(match[0], (function (el) {
                    return React.createElement("div", {
                                key: el.id.toString(),
                                style: rowStyle
                              }, React.createElement("div", undefined, el.editing ? React.createElement(TodoList$Input, {
                                          onSubmit: (function (text) {
                                              return Curry._1(dispatch, {
                                                          TAG: /* Confirm */3,
                                                          _0: el.id,
                                                          _1: text
                                                        });
                                            }),
                                          title: el.title
                                        }) : React.createElement(React.Fragment, undefined, React.createElement("input", {
                                              defaultChecked: el.completed,
                                              type: "checkbox",
                                              onClick: (function (_event) {
                                                  return Curry._1(dispatch, {
                                                              TAG: /* Check */0,
                                                              _0: el.id
                                                            });
                                                })
                                            }), el.title)), React.createElement("div", undefined, React.createElement("button", {
                                        style: el.editing ? ({
                                              color: "lightgrey"
                                            }) : ({}),
                                        disabled: el.editing,
                                        onClick: (function (_event) {
                                            return Curry._1(dispatch, {
                                                        TAG: /* Edit */2,
                                                        _0: el.id
                                                      });
                                          })
                                      }, "Edit"), React.createElement("button", {
                                        onClick: (function (_event) {
                                            return Curry._1(dispatch, {
                                                        TAG: /* Delete */1,
                                                        _0: el.id
                                                      });
                                          })
                                      }, "Delete")));
                  })), React.createElement("button", {
                  style: addButtonStyle,
                  onClick: (function (_event) {
                      return Curry._1(dispatch, /* Add */0);
                    })
                }, "+ Add new note"));
}

var make = TodoList;

exports.containerStyle = containerStyle;
exports.rowStyle = rowStyle;
exports.addButtonStyle = addButtonStyle;
exports.initialState = initialState;
exports.newTodo = newTodo;
exports.check = check;
exports.$$delete = $$delete;
exports.edit = edit;
exports.confirm = confirm;
exports.reducer = reducer;
exports.Input = Input;
exports.make = make;
/* react Not a pure module */

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
    completed: false
  },
  {
    id: 2,
    title: "Reason Intro",
    completed: false
  }
];

function newTodo(id, text) {
  return {
          id: id,
          title: text,
          completed: false
        };
}

function check(id, todos) {
  return Belt_Array.map(todos, (function (el) {
                if (el.id === id) {
                  return {
                          id: el.id,
                          title: el.title,
                          completed: !el.completed
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

var lastId = {
  contents: 2
};

function reducer(state, action) {
  switch (action.TAG | 0) {
    case /* Add */0 :
        var text = action._1;
        var id = action._0;
        var noteIndex = Belt_Array.getIndexBy(state, (function (el) {
                return el.id === id;
              }));
        if (noteIndex !== undefined) {
          console.log(lastId.contents);
          return Belt_Array.map(state, (function (el) {
                        if (el.id === id) {
                          return {
                                  id: el.id,
                                  title: text,
                                  completed: el.completed
                                };
                        } else {
                          return el;
                        }
                      }));
        } else {
          lastId.contents = lastId.contents + 1 | 0;
          return state.concat([{
                        id: lastId.contents,
                        title: text,
                        completed: false
                      }]);
        }
    case /* Check */1 :
        return check(action._0, state);
    case /* Delete */2 :
        return $$delete(action._0, state);
    
  }
}

function TodoList$Input(Props) {
  var onSubmit = Props.onSubmit;
  var title = Props.title;
  var match = React.useReducer((function (param, newText) {
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

function TodoList$ListItem(Props) {
  var item = Props.item;
  var addItem = Props.addItem;
  var onCheck = Props.onCheck;
  var onDelete = Props.onDelete;
  var match = React.useReducer((function (state, action) {
          return !state;
        }), false);
  var setOpenInput = match[1];
  var openInput = match[0];
  return React.createElement("div", {
              style: rowStyle
            }, React.createElement("div", undefined, openInput ? React.createElement(TodoList$Input, {
                        onSubmit: (function (text) {
                            Curry._1(addItem, text);
                            return Curry._1(setOpenInput, /* Toggle */0);
                          }),
                        title: item.title
                      }) : React.createElement(React.Fragment, undefined, React.createElement("input", {
                            defaultChecked: item.completed,
                            type: "checkbox",
                            onClick: (function (_event) {
                                return Curry._1(onCheck, undefined);
                              })
                          }), item.title)), React.createElement("div", undefined, React.createElement("button", {
                      style: openInput ? ({
                            color: "lightgrey"
                          }) : ({}),
                      disabled: openInput,
                      onClick: (function (_event) {
                          return Curry._1(setOpenInput, /* Toggle */0);
                        })
                    }, "Edit"), React.createElement("button", {
                      onClick: (function (_event) {
                          return Curry._1(onDelete, undefined);
                        })
                    }, "Delete")));
}

var ListItem = {
  make: TodoList$ListItem
};

function TodoList(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  return React.createElement("div", {
              style: containerStyle
            }, Belt_Array.map(match[0], (function (item) {
                    return React.createElement(TodoList$ListItem, {
                                item: item,
                                addItem: (function (text) {
                                    return Curry._1(dispatch, {
                                                TAG: /* Add */0,
                                                _0: item.id,
                                                _1: text
                                              });
                                  }),
                                onCheck: (function (param) {
                                    return Curry._1(dispatch, {
                                                TAG: /* Check */1,
                                                _0: item.id
                                              });
                                  }),
                                onDelete: (function (param) {
                                    return Curry._1(dispatch, {
                                                TAG: /* Delete */2,
                                                _0: item.id
                                              });
                                  }),
                                key: item.id.toString()
                              });
                  })), React.createElement("button", {
                  style: addButtonStyle,
                  onClick: (function (_event) {
                      return Curry._1(dispatch, {
                                  TAG: /* Add */0,
                                  _0: lastId.contents + 1 | 0,
                                  _1: ""
                                });
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
exports.lastId = lastId;
exports.reducer = reducer;
exports.Input = Input;
exports.ListItem = ListItem;
exports.make = make;
/* react Not a pure module */

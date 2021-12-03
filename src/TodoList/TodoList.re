let containerStyle =
  ReactDOMRe.Style.make(~display="flex", ~flexDirection="column", ());
let rowStyle =
  ReactDOMRe.Style.make(
    ~fontSize="16px",
    ~backgroundColor="aliceblue",
    ~marginBottom="8px",
    ~padding="8px",
    ~display="flex",
    ~alignItems="center",
    ~justifyContent="space-between",
    (),
  );
let addButtonStyle =
  ReactDOMRe.Style.make(
    ~alignSelf="flex-end",
    ~display="flex",
    ~marginTop="8px",
    (),
  );
type todo = {
  id: int,
  title: string,
  completed: bool,
  editing: bool,
};
type action =
  | Add
  | Check(int)
  | Delete(int)
  | Edit(int)
  | Confirm(int, string);

type state = {todos: array(todo)};
let initialState = [|
  {id: 1, title: "Tester", completed: false, editing: false},
  {id: 2, title: "OH WOWO", completed: true, editing: false},
|];
let newTodo = id => {
  {id, title: "", completed: false, editing: true};
};
let check = (id, todos) => {
  todos->Belt.Array.map(el =>
    el.id === id ? {...el, completed: !el.completed} : el
  );
};
let delete = (id, todos) => {
  todos->Belt.Array.keep(el => el.id !== id);
};
let edit = (id, todos) => {
  todos->Belt.Array.map(el =>
    el.id === id ? {...el, editing: !el.editing} : el
  );
};
let confirm = (id, text, todos) => {
  todos->Belt.Array.map(el =>
    el.id === id ? {...el, title: text, editing: false} : el
  );
};

let reducer = (state, action) => {
  switch (action) {
  | Add =>
    Js_array2.concat(state, [|newTodo(Belt.Array.length(state) + 1)|])
  | Check(id) => check(id, state)
  | Delete(id) => delete(id, state)
  | Edit(id) => edit(id, state)
  | Confirm(id, text) => confirm(id, text, state)
  };
};

module Input = {
  type state = string;
  [@react.component]
  let make = (~onSubmit, ~title) => {
    let (text, setText) =
      React.useReducer((oldText, newText) => newText, title);
    <input
      type_="text"
      value=text
      onChange={_event => setText(_event->ReactEvent.Form.target##value)}
      onKeyDown={_event =>
        if (ReactEvent.Keyboard.key(_event) === "Enter") {
          onSubmit(text);
          setText("");
        }
      }
    />;
  };
};

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);
  <div style=containerStyle>
    {state
     ->Belt.Array.map(el =>
         <div style=rowStyle key={Js.Int.toString(el.id)}>
           <div>
             {el.editing
                ? <Input
                    onSubmit={text => dispatch(Confirm(el.id, text))}
                    title={el.title}
                  />
                : <>
                    <input
                      type_="checkbox"
                      // checked={el.completed}
                      defaultChecked={el.completed}
                      onClick={_event => dispatch(Check(el.id))}
                    />
                    {React.string(el.title)}
                  </>}
           </div>
           <div>
             <button
               onClick={_event => dispatch(Edit(el.id))}
               disabled={el.editing}
               style={
                 el.editing
                   ? ReactDOMRe.Style.make(~color="lightgrey", ())
                   : ReactDOMRe.Style.make()
               }>
               {React.string("Edit")}
             </button>
             <button onClick={_event => dispatch(Delete(el.id))}>
               {React.string("Delete")}
             </button>
           </div>
         </div>
       )
     ->React.array}
    <button style=addButtonStyle onClick={_event => dispatch(Add)}>
      {React.string("+ Add new note")}
    </button>
  </div>;
};

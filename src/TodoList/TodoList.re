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
};
type action =
  | Add(int, string)
  | Check(int)
  | Delete(int);

type state = {todos: array(todo)};
let initialState = [|
  {id: 1, title: "Tester", completed: false},
  {id: 2, title: "Reason Intro", completed: false},
|];
let newTodo = (id, text) => {
  {id, title: text, completed: false};
};
let check = (id, todos) => {
  todos->Belt.Array.map(el =>
    el.id === id ? {...el, completed: !el.completed} : el
  );
};
let delete = (id, todos) => {
  todos->Belt.Array.keep(el => el.id !== id);
};

let lastId = ref(2);

let reducer = (state, action) => {
  switch (action) {
  | Add(id, text) =>
    let noteIndex = state->Belt.Array.getIndexBy(el => el.id === id);
    switch (noteIndex) {
    | Some(int) =>
      Js.log(lastId^);
      state->Belt.Array.map(el => el.id === id ? {...el, title: text} : el);
    | None =>
      lastId := lastId^ + 1;
      Js_array2.concat(state, [|newTodo(lastId^, text)|]);
    };
  | Check(id) => check(id, state)
  | Delete(id) => delete(id, state)
  };
};

module Input = {
  type state = string;
  [@react.component]
  let make = (~onSubmit, ~title) => {
    let (text, setText) = React.useReducer((_, newText) => newText, title);
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

module ListItem = {
  type state = bool;
  type action =
    | Toggle;
  [@react.component]
  let make = (~item, ~addItem, ~onCheck, ~onDelete) => {
    let (openInput, setOpenInput) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | Toggle => !state
          },
        false,
      );
    <div style=rowStyle>
      <div>
        {openInput
           ? <Input
               onSubmit={text => {
                 addItem(text);
                 setOpenInput(Toggle);
               }}
               title={item.title}
             />
           : <>
               <input
                 type_="checkbox"
                 defaultChecked={item.completed}
                 onClick={_event => onCheck()}
               />
               {React.string(item.title)}
             </>}
      </div>
      <div>
        <button
          onClick={_event => setOpenInput(Toggle)}
          disabled=openInput
          style={
            openInput
              ? ReactDOMRe.Style.make(~color="lightgrey", ())
              : ReactDOMRe.Style.make()
          }>
          {React.string("Edit")}
        </button>
        <button onClick={_event => onDelete()}>
          {React.string("Delete")}
        </button>
      </div>
    </div>;
  };
};

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);
  <div style=containerStyle>
    {state
     ->Belt.Array.map(item =>
         <ListItem
           key={Js.Int.toString(item.id)}
           item
           addItem={text => dispatch(Add(item.id, text))}
           onCheck={() => dispatch(Check(item.id))}
           onDelete={() => dispatch(Delete(item.id))}
         />
       )
     ->React.array}
    <button
      style=addButtonStyle
      onClick={_event => dispatch(Add(lastId^ + 1, ""))}>
      {React.string("+ Add new note")}
    </button>
  </div>;
};

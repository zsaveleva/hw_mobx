import { Instance, applySnapshot, types, flow } from "mobx-state-tree";

const TodoModel = types
  .model({
    id: types.number,
    title: types.string,
    completed: types.boolean,
  })
  .actions((self) => ({
    toggle() {
      self.completed = !self.completed;
    },
  }));

const TodosStore = types
  .model({ data: types.map(TodoModel) })
  .actions((self) => ({
    fetchData: flow(function* todosLoader() {
      try {
        const data = yield fetch(
          "https://jsonplaceholder.typicode.com/todos?_limit=7"
        )
          .then((response) => response.json())
          .then((todos: Todo[]) =>
            todos.reduce((accumulator, currentValue) => {
              accumulator[currentValue.id] = currentValue;
              return accumulator;
            }, {} as { [key: string]: {} })
          );
        applySnapshot(self, { data: data });
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }),
    delete(id: number) {
      self.data.delete(id.toString());
    },
    add(title: string, completed: boolean = false) {
      const id = 201;
      self.data.set(id, TodoModel.create({ id: id, title, completed }));
    },
  }))
  .views((self) => ({
    getAll() {
      return Array.from(self.data.values());
    },
  }));

const RootStore = types.model({
  todos: types.optional(TodosStore, {}),
});

const rootStore = RootStore.create();
rootStore.todos.fetchData();

export type Todo = Instance<typeof TodoModel>;
export { rootStore };

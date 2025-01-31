import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[];
  loadingTodo: number[];
  tempTodo: Todo | null;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const { filteredTodos, loadingTodo, tempTodo, onRemoveTodo, onUpdateTodo } =
    props;

  const [editedTodo, setEditedTodo] = useState<null | number>(null);

  return (
    <section className="todoapp_main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={loadingTodo.includes(todo.id)}
          isInEditMode={editedTodo === todo.id}
          setEditedTodo={setEditedTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          setEditedTodo={setEditedTodo}
          isLoading
        />
      )}
    </section>
  );
};

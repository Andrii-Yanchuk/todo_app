/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Errors } from './types/ErrorType';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import {
  getTodos,
  addTodo,
  USER_ID,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [status, setStatus] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.UnableToLoad));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos?.filter(todo => {
      switch (status) {
        case FilterType.Completed:
          return todo.completed;
        case FilterType.Active:
          return !todo.completed;
        default:
          return true;
      }
    });
  }, [todos, status]);

  const activeTodosNum = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const allTodosCompleted = todos.length === completedTodos;
  console.log(allTodosCompleted);

  const onAddTodo = useCallback(async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(Errors.AddTodo);
      throw err;
    } finally {
      setTempTodo(null);
    }
  }, []);

  const onRemoveTodo = useCallback(async (todoId: number) => {
    setLoadingTodo(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Errors.DeleteTodo);
      throw err;
    } finally {
      setLoadingTodo(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const onClearCompleted = useCallback(async () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => onRemoveTodo(todo.id));
  }, [todos, onRemoveTodo]);

  const onUpdateTodo = useCallback(async (todoToUpdate: Todo) => {
    setLoadingTodo(prev => [...prev, todoToUpdate.id]);
    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (err) {
      setErrorMessage(Errors.UpdateTodo);
      throw err;
    } finally {
      setLoadingTodo(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  }, []);

  const onToggleAll = async () => {
    if (activeTodosNum > 0) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo => onUpdateTodo({ ...todo, completed: true }));
    } else {
      todos.forEach(todo => onUpdateTodo({ ...todo, completed: false }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={onAddTodo}
          setErrorMessage={setErrorMessage}
          todoLength={todos.length}
          onToggleAll={onToggleAll}
          allTodosCompleted={allTodosCompleted}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              loadingTodo={loadingTodo}
              tempTodo={tempTodo}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
            />

            <TodoFooter
              status={status}
              setStatus={setStatus}
              activeTodosNum={activeTodosNum}
              completedTodos={completedTodos}
              onClearCompleted={onClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

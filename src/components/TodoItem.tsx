import React, { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  isInEditMode?: boolean;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  setEditedTodo: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoItem: React.FC<Props> = props => {
  const {
    todo,
    isLoading,
    isInEditMode,
    onRemoveTodo,
    onUpdateTodo,
    setEditedTodo,
  } = props;

  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const onCheckTodo = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const onDoubleClick = () => {
    setEditedTodo(todo.id);
  };

  const onBlur = async (
    event: React.FocusEvent<HTMLFormElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedTitle = newTitle.trim();

    if (todo.title === normalizedTitle) {
      setEditedTodo(null);

      return;
    }

    try {
      if (normalizedTitle === '') {
        await onRemoveTodo(todo.id);
      } else {
        await onUpdateTodo({ ...todo, title: normalizedTitle });
      }
      setEditedTodo(null);
    } catch (err) {
      inputRef?.current?.focus();
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);
      setNewTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onCheckTodo}
        />
      </label>

      {isInEditMode ? (
        <form onSubmit={onBlur} onBlur={onBlur}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyUp={onKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemoveTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

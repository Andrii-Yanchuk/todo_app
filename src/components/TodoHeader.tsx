import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { Errors } from '../types/ErrorType';
import cn from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
  todoLength: number;
  onToggleAll: () => Promise<void>;
  allTodosCompleted: boolean;
};

export const TodoHeader: React.FC<Props> = props => {
  const {
    onAddTodo,
    setErrorMessage,
    todoLength,
    onToggleAll,
    allTodosCompleted,
  } = props;

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    try {
      setIsLoading(true);
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {
    } finally {
      setIsLoading(false);
      inputRef?.current?.focus();
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputValue, isLoading, todoLength]);

  return (
    <header className="todoapp__header">
      {todoLength !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

// Завдання: Todo App 
// Створити односторінковий «Todo App», який дозволяє:
'use client'
import { useState } from "react";

// додавати задачі;
// відмічати задачі як виконані/невиконані;
// видаляти задачі.
// Технічні умови
// React + Function Components + TypeScript.
// Використовувати лише useState для стану.
// Стилізація будь-яка (можна прості класи без бібліотек).
// Вимоги до UI
// Поле вводу + кнопка Add (додавати по Enter теж ок).
// Список задач:
// чекбокс для зміни стану completed;
// текст задачі (перекреслений, якщо виконано);
// кнопка Delete для видалення.
// Якщо список порожній — показати підказку «No tasks yet».

interface Todo {
id: number;
text: string;
completed: boolean;
}

const TodoApp = () => {
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [value, setValue] = useState<string>('')

  const handleAddTodo = () => {
    if (!value) return;
    setTodoList((prev) => [{id: Date.now(), text: value, completed: false}, ...prev])
    setValue('')
  }

  const handleToggleStatus = (id: number) => {
    setTodoList(prev => prev.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo))
  }

  const handleDeleteTodo = (id: number) => {
    setTodoList(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <div className="bg-white">
        <input className="h-10 border-2" placeholder="Add your todo..." type="text" value={value} onChange={(e) => setValue(e.target.value)}  />
        <button className="cursor-pointer border-2 bg-orange-300 p-3" onClick={handleAddTodo}>ADD TODO</button>
      
      <ul>
        {todoList.map(todo => 
          <li key={todo.id}>
            <span className={todo.completed ? 'text-green-900 font-bold' : 'text-black-900'}>{todo.text}</span>
            <input className="m-3" type='checkbox' checked={todo.completed} onChange={() => handleToggleStatus(todo.id)} />
            <button className="cursor-pointer border-2 bg-red-300 p-1" onClick={() => handleDeleteTodo(todo.id)}>DELETE</button> 
          </li>
        )}
      </ul>
    </div>
  )

}

export default TodoApp
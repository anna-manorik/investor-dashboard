'use client'

import { useEffect, useMemo, useState } from "react"

// Реалізувати компонент для відображення списку користувачів
// Мета:
// Створити компонент UserList, який отримує список користувачів з API, дозволяє шукати по імені та переглядати детальну інформацію про обраного користувача.



// Технічні вимоги:
// Отримання даних з API:
// Зробити GET-запит до https://jsonplaceholder.typicode.com/users.
// Зберегти отриманий список користувачів у стані.
// Вивід списку користувачів:
// Відобразити імена всіх користувачів у вигляді списку.
// Кожен елемент списку має бути клікабельним.
// Пошук користувача:
// Реалізувати інпут для пошуку по імені.
// Пошук повинен бути нечутливим до регістру.
// Фільтрація має відбуватися в реальному часі (під час вводу).
// Виведення деталей користувача:
// При кліку на користувача у списку — показати детальну інформацію:
// Ім’я
// Email
// Username
// Додати кнопку для закриття блоку з деталями користувача.
// Обробка станів:
// Виводити повідомлення Loading... під час завантаження.
// Виводити повідомлення про помилку, якщо запит завершився з помилкою.
// Оптимізація:
// Використати useMemo для оптимізації фільтрації списку.

type User = {
    id: number,
    name: string,
    username: string,
    email: string,
}

const UserList = () => {
    const [ error, setErrorMessege ] = useState<string | null>(null)
    const [ usersList, setUsersList] = useState<User[]>([])
    const [ showUserInfo, setShowUserInfo ] = useState<User | null>(null)
    const [ search, setSearch ] = useState<string>('')

    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users')

                const data = await response.json()
                setUsersList(data)

                console.log('success', data)
            } catch (error) {
                setErrorMessege((error as Error).message)
            } finally {

            }
            
        }

        fetchUsers()
        
    }, [])

    const searchUsers = useMemo(() => {
        return usersList.filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
    }, [search, usersList])

    // if(error) error

    return (
        <>
            <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} />

            <ul>
                {searchUsers.map(user => (
                    <li key={user.id} className="color-white cursor-pointer" onClick={() => setShowUserInfo(user)}>{user.name}</li>
                ))}
            </ul>

            {showUserInfo && (
                <div>
                    <p>{showUserInfo.name}</p>
                    <p>{showUserInfo.username}</p>
                    <p>{showUserInfo.email}</p>
                    <button onClick={() => setShowUserInfo(null)}>HIDE</button>
                </div>
            )}
            
        </>
    )
}

export default UserList
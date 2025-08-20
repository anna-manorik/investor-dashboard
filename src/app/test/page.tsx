// Завдання: Реалізувати дашборд для систем кондиціонування повітря
// Мета:
// Створити компонент ACSystemDashboard, який відображає список систем кондиціонування повітря з можливістю вмикання/вимикання кожної з них, а також виводить ключову інформацію про стан систем.


import ACSystemDashboard, { ACSystemData } from "./component";

// Технічні вимоги:
// Типізація:
// Типізувати дані про кожну систему кондиціонування (ACSystemData), включно з:
// id (рядок)
// location (місце розташування, рядок)
// temperature (температура, число)
// humidity (вологість, число)
// energyConsumption (енергоспоживання, число)
// isActive (стан увімкнено/вимкнено, булеве значення)
// Ініціалізація даних:
// Компонент повинен приймати список систем як проп data і зберігати його у локальному стані useState.
// Виведення інформації:
// Для кожної системи відобразити:
// Місцезнаходження (location)
// Температуру (temperature) з підсвічуванням кольором:
// 27°C — червоний
// 25–27°C — помаранчевий
// < 25°C — зелений
// Вологість (humidity)
// Енергоспоживання (energyConsumption)
// Статус (ON/OFF)
// Кнопку перемикання статусу (Turn ON/OFF)
// Функціональність перемикання статусу:
// При натисканні на кнопку змінювати стан isActive відповідної системи (вмикати/вимикати).
// Стилизація:
// Відобразити кожну систему у вигляді окремої картки зі стилями: рамка, відступи, ширина блоку, border-radius.
// Всі картки повинні розташовуватись у flex-контейнері з обгортанням (flex-wrap) і відступами між ними (gap).


export const exampleData: ACSystemData[] = [
  {
    id: 'ac-101',
    location: 'Room 101',
    temperature: 22.5,
    humidity: 45,
    energyConsumption: 3.2,
    isActive: true,
  },
  {
    id: 'ac-102',
    location: 'Room 102',
    temperature: 25,
    humidity: 50,
    energyConsumption: 2.8,
    isActive: false,
  },
  {
    id: 'ac-103',
    location: 'Room 103',
    temperature: 28,
    humidity: 50,
    energyConsumption: 2.8,
    isActive: false,
  },
];

const App2 = () => <ACSystemDashboard data={exampleData} />

export default App2
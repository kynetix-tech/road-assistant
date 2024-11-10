export const classes = {
  0: 'Перевага руху в закритих ділянках',
  1: 'Проїзду нема',
  2: 'Попередження поворот ліворуч',
  3: 'Рух прямо',
  4: 'Зупинку заборонено',
  5: 'Попередження поворот праворуч',
  6: 'Головна дорога',
  7: 'Рух ліворуч',
  8: 'Обережно діти',
  9: 'Другорядна дорога',
  10: 'Рух заборонено',
  11: 'Пішохідна зона',
  12: 'Кінець головної дороги',
  13: 'Stop',
  14: 'Поступитись дорогою в закритих ділянках',
  15: 'Декілька поворотів',
  16: 'Пішохідний перехід',
  17: 'Круговий рух',
  18: 'Рух праворуч',
  19: 'Стоянку заборонено',
}

export interface ResultItem {
  start: number;
  end: number;
  classId: number;
}

export const imageClasses = new Map(Object.entries({
  '0': require('@/assets/class-images/0.png'),
  '1': require('@/assets/class-images/1.png'),
  '2': require('@/assets/class-images/2.png'),
  '3': require('@/assets/class-images/3.png'),
  '4': require('@/assets/class-images/4.png'),
  '5': require('@/assets/class-images/5.png'),
  '6': require('@/assets/class-images/6.png'),
  '7': require('@/assets/class-images/7.png'),
  '8': require('@/assets/class-images/8.png'),
  '9': require('@/assets/class-images/9.png'),
  '10': require('@/assets/class-images/10.png'),
  '11': require('@/assets/class-images/11.png'),
  '12': require('@/assets/class-images/12.png'),
  '13': require('@/assets/class-images/13.png'),
  '14': require('@/assets/class-images/14.png'),
  '15': require('@/assets/class-images/15.png'),
  '16': require('@/assets/class-images/16.png'),
  '17': require('@/assets/class-images/17.png'),
  '18': require('@/assets/class-images/18.png'),
  '19': require('@/assets/class-images/19.png'),
}))

export const getImageByClass = (classId: number) => imageClasses.get(classId.toString());

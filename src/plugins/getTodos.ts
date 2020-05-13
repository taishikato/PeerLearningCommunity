import moment from 'moment-timezone';
import { ITodoNew } from '../interfaces/ITodo';

export default async (db: firebase.firestore.Firestore, dayBefore: number = 0) => {
  const targetDay = moment().subtract(dayBefore, 'days').tz('Asia/Tokyo').format('YYYYMMDD');

  const [doneTodosData, undoneTodosData] = await Promise.all([
    db.collection('todos').where('checked', '==', true).where('doneDate', '==', targetDay).get(),
    db.collection('todos').where('checked', '==', false).where('createdDate', '==', targetDay).get(),
  ]);

  if (doneTodosData.empty && undoneTodosData.empty) {
    console.log('INFO: No todo yet');
    return [];
  }

  const addingTodos: { [key: string]: ITodoNew[] } = {};
  if (!doneTodosData.empty) {
    doneTodosData.docs.forEach(doc => {
      const todo = doc.data();
      if (addingTodos[todo.userId] === undefined) {
        addingTodos[todo.userId] = [todo as ITodoNew];
      } else {
        addingTodos[todo.userId].push(todo as ITodoNew);
      }
    });
  }
  if (!undoneTodosData.empty) {
    undoneTodosData.docs.forEach(doc => {
      const todo = doc.data();
      if (addingTodos[todo.userId] === undefined) {
        addingTodos[todo.userId] = [todo as ITodoNew];
      } else {
        addingTodos[todo.userId].push(todo as ITodoNew);
      }
    });
  }

  const todoByUserArray: ITodoByUser[] = [];
  await Promise.all(
    Object.keys(addingTodos).map(async userId => {
      const user = await db.collection('users').doc(userId).get();
      const userData = user.data() as IUser;
      todoByUserArray.push({
        user: {
          userName: userData.userName,
          displayName: userData.displayName,
          picture: userData.picture,
        },
        todos: addingTodos[userId],
      });
    }),
  );

  return { date: targetDay, todoByUser: todoByUserArray };
};

interface ITodoByUser {
  user: IUser;
  todos: ITodoNew[];
}

interface IUser {
  picture: string;
  userName: string;
  displayName: string;
}

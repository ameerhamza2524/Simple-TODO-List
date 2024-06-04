#!/usr/bin/env node
import inquirer from 'inquirer';

// To-do ka interface define karte hain
interface Todo {
  id: number;
  task: string;
  done: boolean;
}

// Sabhi to-dos ko store karne ke liye array
let TODOS: Todo[] = [];

// Main function jo user se operations select karwa kar execute karega
async function createTodo() {
  while (true) {
    let answer = await inquirer.prompt({
      name: 'selected',
      type: 'list',
      message: 'Koi operation chunein:',
      choices: ['Add', 'Update', 'View', 'Delete', 'Exit']
    });

    // Har operation ke liye respective function call karte hain
    if (answer.selected === 'Add') {
      await addTodo();
    } else if (answer.selected === 'Update') {
      await updateTodo();
    } else if (answer.selected === 'View') {
      viewTodos();
    } else if (answer.selected === 'Delete') {
      await deleteTodo();
    } else if (answer.selected === 'Exit') {
      console.log('Exiting...');
      return;
    }
  }
}

// Naya to-do add karne ke liye function
async function addTodo() {
  let answer = await inquirer.prompt({
    name: 'task',
    type: 'input',
    message: 'Task likhein:'
  });
  let newTodo = { id: TODOS.length + 1, task: answer.task, done: false };
  TODOS.push(newTodo);
  console.log(`Task add kiya: "${answer.task}"`);
}

// Existing to-do update karne ke liye function
async function updateTodo() {
  if (TODOS.length === 0) {
    console.log('Koi tasks update karne ke liye nahi hain.');
    return;
  }
  let choices = TODOS.map(todo => ({ name: `${todo.task} [${todo.done ? 'x' : ' '}]`, value: todo.id }));
  let answer = await inquirer.prompt({
    name: 'id',
    type: 'list',
    message: 'Update karne ke liye task select karein:',
    choices: choices
  });
  let todo = TODOS.find(t => t.id === answer.id);
  if (todo) {
    let newTask = await inquirer.prompt({
      name: 'task',
      type: 'input',
      message: 'Naya task likhein:',
      default: todo.task
    });
    todo.task = newTask.task;
    let doneStatus = await inquirer.prompt({
      name: 'done',
      type: 'confirm',
      message: 'Kya yeh task complete hai?',
      default: todo.done
    });
    todo.done = doneStatus.done;
    console.log(`Task update kiya: "${todo.task}"`);
  }
}

// Saare to-dos dekhne ke liye function
function viewTodos() {
  if (TODOS.length === 0) {
    console.log('Koi tasks nahi mile.');
  } else {
    TODOS.forEach(todo => {
      console.log(`${todo.id}. ${todo.task} [${todo.done ? 'x' : ' '}]`);
    });
  }
}

// To-do delete karne ke liye function
async function deleteTodo() {
  if (TODOS.length === 0) {
    console.log('Koi tasks delete karne ke liye nahi hain.');
    return;
  }
  let choices = TODOS.map(todo => ({ name: `${todo.task} [${todo.done ? 'x' : ' '}]`, value: todo.id }));
  let answer = await inquirer.prompt({
    name: 'id',
    type: 'list',
    message: 'Delete karne ke liye task select karein:',
    choices: choices
  });
  TODOS = TODOS.filter(t => t.id !== answer.id);
  console.log('Task delete kiya.');
}

// CLI start karte hain
createTodo();

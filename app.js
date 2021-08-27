let section = document.querySelector("body section");
let add = document.querySelector("form button");

add.addEventListener("click", (e) => {
  // prevent form from being submitted
  e.preventDefault();

  // get the input value
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  if (todoText == "") {
    alert("Please enter something");
    return;
  }

  // create a todo
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + "/" + todoDate;

  todo.appendChild(text);
  todo.appendChild(time);

  // create green and red button
  let greenButton = document.createElement("button");
  greenButton.classList.add("greenButton");
  greenButton.innerHTML = '<i class="fas fa-check"></i>';
  greenButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let redButton = document.createElement("button");
  redButton.classList.add("redButton");
  redButton.innerHTML = '<i class="fas fa-trash"></i>';
  redButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.style.animation = "scaleDown 0.3s forwards";

    todoItem.addEventListener("animationend", (e) => {
      // remove from localStorage
      let text = todoItem.children[0].innerText;
      let date = todoItem.children[1].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        // compair both of todoText and todoDate
        let item_date = `${item.todoMonth}/${item.todoDate}`;
        if (item.todoText == text && item_date == date) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });

      todoItem.remove();
    });
  });

  todo.appendChild(greenButton);
  todo.appendChild(redButton);

  todo.style.animation = "scaleUp 0.25s forwards";

  // create an object
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  // storge data(object) in to an array
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }

  // clear the input
  form.children[0].value = "";
  section.appendChild(todo);
});

loadDate();

function loadDate() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);

    myListArray.forEach((item) => {
      // create a todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + "/" + item.todoDate;

      todo.appendChild(text);
      todo.appendChild(time);

      // create green and red button
      let greenButton = document.createElement("button");
      greenButton.classList.add("greenButton");
      greenButton.innerHTML = '<i class="fas fa-check"></i>';
      greenButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let redButton = document.createElement("button");
      redButton.classList.add("redButton");
      redButton.innerHTML = '<i class="fas fa-trash"></i>';
      redButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.25s forwards";

        todoItem.addEventListener("animationend", (e) => {
          // remove from localStorage
          let text = todoItem.children[0].innerText;
          let date = todoItem.children[1].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            // compair both of todoText and todoDate
            let item_date = `${item.todoMonth}/${item.todoDate}`;
            if (item.todoText == text && item_date == date) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });

          todoItem.remove();
        });
      });

      todo.appendChild(greenButton);
      todo.appendChild(redButton);

      section.appendChild(todo);
    });
  }
}

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (arr1.length > i && arr2.length > j) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (arr1.length > i) {
    result.push(arr1[i]);
    i++;
  }

  while (arr2.length > j) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);

    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", (e) => {
  // sort data
  let myListArray = JSON.parse(localStorage.getItem("list"));
  let sortedArray = mergeSort(myListArray);
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove original data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  loadDate();
});

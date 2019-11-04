//Hejsan
function openForm() {
    document.getElementById("createActivity").style.display = "block";
}

function closeForm() {
    document.getElementById("createActivity").style.display = "none";
}

var currentUserList;

const inputActivityFromForm = document.getElementById("inputActivity");
const inputDateFromForm = document.getElementById("inputDate");
const inputTimeFromForm = document.getElementById("inputTime");
const inputPriceFromForm = document.getElementById("inputNumber");
const inputChild = document.getElementById("inputChild");
const inputInside = document.getElementById("inputInside");

var APopupHandler = (function () {


    function check() {
        document.getElementById("inputChild").checked = true;
    }

    function uncheck() {
        document.getElementById("inputChild").checked = false;
    }

    function test() {
        if (date && time && number && activity) {
            console.log("nice")
            document.getElementById("createActivity").reset();
            document.getElementById("createActivity").style.display = "none";
        }

    }

    let setActivity;
    let setTime;
    let setDate;
    let setNumber;
    let setChild;
    let setInside;

    let showList = 0;

    function addActivity() {

        const activity = inputActivityFromForm.value;
        const date = inputDateFromForm.value;
        const time = inputTimeFromForm.value;
        const number = inputPriceFromForm.value;
        let inside = false; //Changed by DN
        let child = false; //Changed by DN

        console.log(activity);
        if (inputChild.checked == true) {
            child = true;
        }
        else {
            child = false;
        }

        if (inputInside.checked == true) {
            inside = true;;
        }
        else {
            inside = false;
        }

        setActivity = activity;
        setTime = time;
        setDate = date;
        setNumber = number;
        setChild = child;
        setInside = inside;

        //localStorage.setItem('testObject', JSON.stringify(testObject));

        if (date && time && number && activity) {
            /*
            console.log(setTime);
            localStorage.clear();
            localStorage.setItem("Activity", JSON.stringify(setActivity));
            localStorage.setItem("Time", JSON.stringify(setTime));
            localStorage.setItem("Date", JSON.stringify(setDate));
            localStorage.setItem("Price", JSON.stringify(setNumber));
            localStorage.setItem("Child", JSON.stringify(setChild));
            localStorage.setItem("Inside", JSON.stringify(setInside));*/

            TODOStorage.saveTodo(setActivity, setTime, setDate, setNumber, setChild, setInside, currentUserKey);
        }
    }

    return {
        addActivity,
        check,
        uncheck
    };
})();

/* TO BE REMOVED!
function getTodoById(id) {
    for (const i in todos) {
        const todo = todos[i];

        if (todo.id === id) {
            return todo;
        }

    }
    return null;
}


function callLog() {

    console.log(setTime);
    localStorage.setItem("Time:", setTime)
    localStorage.setItem("Date:", setDate)
}
*/

var TODOStorage = (function () {
    var todosList = [];
    var userList = [];
    var todos = [];

    function init() {
        //Added code to get current user key
        const userKey = localStorage.getItem("userKey");
        currentUserKey = JSON.parse(userKey);

        //Code to get all users
        const users = localStorage.getItem("travelUsers");
        userList = JSON.parse(users);
        debugVariable2 = userList;
        console.log("We are sending variable " + currentUserKey);
        debugVariable1 = getUserById(currentUserKey);

        let helloMsg = document.getElementById("hello-message");
        helloMsg.innerHTML = "Hello " + debugVariable1.firstName;

        const lsTodos = localStorage.getItem('TODOS');
        todosList = JSON.parse(lsTodos)
        debugVariable2 = todosList;
        if(todosList != null) {
            for(let i=0;i<todosList.length;i++) {
                if(currentUserKey == todosList[i].userId) {
                    todos.push(todosList[i]);
                }
            }
        }
       
        if (todosList === null) {
            todosList = [];
        } 

        //New DN code to add objects to list
        console.log("todos is " + todos.length);
        for (let i = 0; i < todos.length; i++) {
        
            var newId = todos[i].id;
            var newAName = todos[i].activity;
            var newADate = todos[i].date;
            var newATime = todos[i].time;
            var newAPrice = todos[i].price;
            var newAChild = todos[i].child;
            var newAInside = todos[i].inside;
            var newADone = todos[i].done;
            let listObject = new ActivityObject(newId, newAName, newADate, newATime, newAPrice, newAChild, newAInside, newADone);
            allActivities.push(listObject);
            DocumentHandler.addToList(listObject);

        }

    }

    function saveTodo(activity, time, date, price, child, inside, userId) {

        let maxId = 0
        for (const i in todos) {
            const todo = todos[i];
            if (todo.id > maxId) {
                maxId = todo.id;
            }

        }
        const todo = {
            userId: userId,
            id: maxId + 1,
            activity: activity,
            time: time,
            date: date,
            price: price,
            child: child,
            inside: inside,
            done: false
        }

        todosList.push(todo);

        saveChanges();
    }

    function listTodos() {
        return todosList;
    }

    function updateTodo(newId) {
        // for (let i in todos == newId) {
        for (let i = 0; i < todosList.length; i++) {
            if (todos[i].id == newId) {
                console.log("Trying to change to true");
                todos[i].done = true;
                //todos[i].description = description;
            }

        }
        saveChanges();
    }
    //Get user by id
    function getUserById(id) {
        console.log("Inside getUserById with number " + id);
        for (let i = 0; i < userList.length; i++) {
            if (id == userList[i].ID) {
                console.log("trying to get user " + userList[i].firstName + " with id " + userList[i].ID);
                return userList[i];
            }
        }
        return null;
    }

    //Get todo-activity by id
    function getTodoById(id) {
        for (const i in todos) {
            const todo = todos[i];

            if (todo.id === id) {
                return todo;
            }
        }
        return null;
    }

    function deleteTodoById(id) {
        for(let i=0;i<todosList.length;i++) {
            const todo = todosList[i];
            if (todo.id == id) {
                todosList.splice(i, 1);
                break;
            }
        }
        saveChanges();
    }

    function saveChanges() {
        const lsTodos = JSON.stringify(todosList)
        localStorage.setItem('TODOS', lsTodos);
    }

    /*
    function returnTodo() {
        const lsTodos = JSON.stringify(todos);
        return lsTodos;
    } */

    return { init, saveTodo, listTodos, getTodoById, updateTodo, deleteTodoById };
})();







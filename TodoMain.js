/*var masterID = 0;

function MasterIDHandler(shouldAdd) {
    if (shouldAdd === true) {
        masterID += 1;
        return masterID;
    } else {
        return masterID;
    }
} */

//This is what makes up each activity
function ActivityObject(newId, newName, newDate, newTime, newPrice, isChildActivity, isInside, isDone, newUserId) {
    this.id = newId;
    this.activityName = newName;
    this.date = newDate;
    this.time = newTime;
    this.price = newPrice;
    this.childActivity = isChildActivity;
    this.insideActivity = isInside;
    this.done = isDone;
    this.userId = newUserId;

    //When we create a activity it automatically removes money from spendingmoney
    DocumentHandler.removeFromSpendingMoney(newPrice);
}

var allActivities = []; //The main array that handles objects
var spendingMoney = 15000; //The initial spending money


//Everything related to showing the activities in this module
var DocumentHandler = (function () {

    //The first function to be run with all the initialazing code
    function init() {
        //Add everything releated to sign out
        const signOutButton = document.getElementById("sign-out");
        signOutButton.addEventListener("click", signOut);

        //Adding everything releated to 'spending money'
        const spendingMoneyLbl = document.getElementById("spending-money");
        spendingMoneyLbl.innerHTML = spendingMoney;

        const spendingMoneyInput = document.getElementById("spending-money-input");
        const spendingMoneyButton = document.getElementById("add-spending-money");
        spendingMoneyButton.addEventListener("click", function () {
            if (spendingMoneyInput.value > 0) {
                spendingMoney = spendingMoneyInput.value;
                spendingMoneyLbl.innerHTML = String(spendingMoney);
            }

        })

        //Initialise the Storage connected to both Todo and users
        TODOStorage.init();

        //Autohide finished objects THIS SORT OF WORKS
        for (let i = 0; i < allActivities.length; i++) {
            if (allActivities[i].done === true) {
                let liToShow = document.getElementById("activity" + allActivities[i].id);
                $(liToShow).hide();
            }
        }

        //'Show all' checkbox releated code
        const showHiddenListItems = document.getElementById("show-all");
        showHiddenListItems.addEventListener("click", function () {
            if (showHiddenListItems.checked === true) {
                for (let i = 0; i < allActivities.length; i++) {
                    if (allActivities[i].done == true) {
                        let liToShow = document.getElementById("activity" + allActivities[i].id);
                        liToShow.style.color = 'red';
                        console.log(liToShow);
                        $(liToShow).show();
                    }
                }
            } else {
                for (let i = 0; i < allActivities.length; i++) {
                    if (allActivities[i].done === true) {
                        let liToShow = document.getElementById("activity" + allActivities[i].id);
                        $(liToShow).hide();
                    }
                }
            }
        });
    }

    function signOut() {
        //Added code to get current user key
        localStorage.removeItem("userKey");

        //open first page
        window.close();

    }

    //add to list of activities.
    function addToList(newActivity) {
        //Get the element to show a list on html page
        const listOfActivities = document.getElementById("list-of-activities");

        //Add button to be able to remove each activity
        let buttonId = "remove" + (allActivities[allActivities.length - 1].id);

        //Build the string that we are showing and show it/append it
        let stringToShow = "<b>Name: </b>" + newActivity.activityName + " <b>Date: </b>" + newActivity.date + " <b>Time: </b>" + newActivity.time + " <b>Price: </b>" + newActivity.price + ":- <b>Child activity: </b>" + newActivity.childActivity + " <b>Outside: </b>" + newActivity.insideActivity;
        var container = document.createElement('div');
        container.innerHTML += ("<li id='activity" + (allActivities[allActivities.length - 1].id) + "'><input type='checkbox' id='checkIsDone" + (allActivities[allActivities.length - 1].id) + "'></input>" + stringToShow + "<button class='button-block' id=" + buttonId + ">Remove Item</button></li>");
        listOfActivities.appendChild(container);

        //Checkbox to mark activity as finished
        $("#checkIsDone" + (allActivities[allActivities.length - 1].id)).click(function () {
            let activityNumber = String($(this)[0].id).replace(/[^0-9]/g, '');
            console.log("click " + String($(this)[0].id).replace(/[^0-9]/g, ''));
            $("#activity" + activityNumber).hide("slow");
            for (let i = 0; i < allActivities.length; i++) {
                if (allActivities[i].id == activityNumber) {
                    allActivities[i].done = true;
                    TODOStorage.updateTodo(activityNumber);
                    break;
                }
            }
        })

        //Remove item
        $("#" + buttonId).click(function () {
            let activityNumber = String($(this)[0].id).replace(/[^0-9]/g, '');
            $("#activity" + activityNumber).hide("slow");
            // let activityToBeRemoved;
            for (let i = 0; i < allActivities.length; i++) {
                if (allActivities[i].id == activityNumber) {
                    addToSpendingMoney(allActivities[i].price);
                    allActivities.splice(i, 1);
                    TODOStorage.deleteTodoById(activityNumber);
                    break;
                }
            }

        })
    }

    //Remove from spending money
    function removeFromSpendingMoney(sumToRemove) {
        spendingMoney -= Number(sumToRemove);
        const spendingMoneyLbl = document.getElementById("spending-money");
        spendingMoneyLbl.innerHTML = spendingMoney;
    }

    //Add to spending money
    function addToSpendingMoney(sumToBeAdded) {
        let currentMoney = Number(spendingMoney);
        console.log(currentMoney);
        currentMoney += Number(sumToBeAdded);
        spendingMoney = currentMoney;
        const spendingMoneyLbl = document.getElementById("spending-money");
        spendingMoneyLbl.innerHTML = String(spendingMoney);
    }

    return {
        init,
        addToList,
        removeFromSpendingMoney
    }
})();

//Run code when the DOM has loaded.
window.addEventListener("DOMContentLoaded", DocumentHandler.init);



/*
    To be fixed:
    * Skapa ett objekt som innehåller alla datatyper vi ska ha OK
    * Skapa en lista som visar delar av denna info OK
    * Gör den klickbar för att visa mer info i en popup samt ändra info OK
    * Gör den klickbar, dvs. man kan klarmarkera activities OK
    * Klickruta för att visa/dölja färdiga activities OK
    * Spara ner i LocalStorage 
    * Ladda från LS när man öppnar sidan 
    * 
    * DEBUG: Skapa en funktion som skapar exempelobjekt
    * 
    * Extra:
    * Väderfunktionaliteten
*/

var masterID = 0;

function MasterIDHandler(shouldAdd) {
    if (shouldAdd === true) {
        masterID += 1;
        return masterID;
    } else {
        return masterID;
    }
}

function ActivityObject(newId, newName, newDate, newTime, newPrice, isChildActivity, isInside, isDone, newUserId) {
    this.id = newId; //MasterIDHandler(true);
    this.activityName = newName;
    this.date = newDate;
    this.time = newTime;
    this.price = newPrice;
    this.childActivity = isChildActivity;
    this.insideActivity = isInside;
    this.done = isDone;
    this.userId = newUserId;

    DocumentHandler.removeFromSpendingMoney(newPrice);
}

var allActivities = [];
var spendingMoney = 15000;
var debugVariable1;
var debugVariable2;


//Everything related to showing the activities
var DocumentHandler = (function () {

    //The first function to be run with all the initialazing code
    function init() {
        const spendingMoneyLbl = document.getElementById("spending-money");
        spendingMoneyLbl.innerHTML = spendingMoney;

        TODOStorage.init();

        //Autohide done objects
        for (let i = 0; i < allActivities.length; i++) {
            if (allActivities[i].done === true) {
                let liToShow = document.getElementById("activity" + (i + 1));
                $(liToShow).hide();
            }
        }

        //Show all checkbox
        const showHiddenListItems = document.getElementById("show-all");
        showHiddenListItems.addEventListener("click", function () {
            if (showHiddenListItems.checked === true) {
                for (let i = 0; i < allActivities.length; i++) {
                    if (allActivities[i].done == true) {
                        n = Number(i + 1);
                        let liToShow = document.getElementById("activity" + (n));
                        console.log(liToShow);
                        $(liToShow).show();
                    }
                }
            } else {
                for (let i = 0; i < allActivities.length; i++) {
                    if (allActivities[i].done === true) {
                        let liToShow = document.getElementById("activity" + (i + 1));
                        $(liToShow).hide();
                    }
                }
            }
        });


    }

    //add to list of activities
    function addToList(newActivity) {
        const listOfActivities = document.getElementById("list-of-activities");
        let buttonId = "remove" + (allActivities[allActivities.length - 1].id);
        console.log(buttonId);
        let stringToShow = "Name: " + newActivity.activityName + " Date: " + newActivity.date + " Time: " + newActivity.time + " Price: " + newActivity.price + ",- Child activity: " + newActivity.childActivity + " Outside: " + newActivity.insideActivity;
        var container = document.createElement('div');
        container.innerHTML += ("<li id='activity" + (allActivities[allActivities.length - 1].id) + "'><input type='checkbox' id='checkIsDone" + (allActivities[allActivities.length - 1].id) + "'>" + stringToShow + "<button id=" + buttonId + ">Remove Item</button></li");
        listOfActivities.appendChild(container);
        $("li").click(function () {
            alert("Populate Alexanders popup for changes!"); //Bugs out but should instead populate
        }).children().click(function (e) {
            return false;
        })

        $("#checkIsDone" + (allActivities[allActivities.length - 1].id)).click(function () {
            let activityNumber = String($(this)[0].id).replace(/[^0-9]/g, '');
            console.log("click " + String($(this)[0].id).replace(/[^0-9]/g, ''));
            $("#activity" + activityNumber).hide("slow");
            //allActivities[activityNumber-1].done = true;
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
                    console.log(activityNumber);
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
        spendingMoney += Number(sumToBeAdded);
        const spendingMoneyLbl = document.getElementById("spending-money");
        spendingMoneyLbl.innerHTML = spendingMoney;
    }


    return {
        init,
        addToList,
        removeFromSpendingMoney
    }
})();

//Run code when the DOM has loaded.
window.addEventListener("DOMContentLoaded", DocumentHandler.init);


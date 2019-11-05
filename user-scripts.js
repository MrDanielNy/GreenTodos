var EventHandlers = (function () {
    function init() {
        $("#make-users").hide();
        $("#sign-in-button").click(SignInModul.signInPop);
        $("#close-signin").click(SignInModul.signInClose);
        $("#make-users").click(TestModule.createRandomUserObjects);
        $("#submit-password").click(function(){SignInModul.checkPassword(false)});
        $("#reg-new-user-button").click(NewUserModul.newUserPop);
        $("#close-new-user").click(NewUserModul.newUserClose);
        $("#new-user-request-button").click(NewUserModul.makeNewUser);
        $("#go-to-traveltodo").click(goToTravelTodo);
        $("#signout-button").click(signOut);
        $("#forgot-password").click(SignInModul.forgotPasswordPop);
        $("#close-forgot-password").click(SignInModul.forgotPasswordClose);
        $("#forgot-password-send").click(SignInModul.getPassword);
        $("#make-changes-button").click(UserManager.changeUserInfo);
        $("#change-password-button").click(UserManager.changePasswordPop);
        $("#close-change-password").click(UserManager.changePasswordClose);
        $("#make-change-request").click(UserManager.changeUserPassword);
        $("#go-to-mananger-button").click(function () { SignInModul.checkPassword(true) });

    }


    return { init }
})();


function goToTravelTodo() {
    //console.log("TravelTODO");
    window.open("todomain.html");

}

function signOut() {
    //hide user manager popup and delete userKey
    $("#first-page-modal").hide();
    $("#change-user-popup").hide();
    localStorage.removeItem("userKey")
}

var TestModule = (function () {

    function randomNr() {
        let rnd = Math.floor(Math.random() * 8);
        return rnd;
    }
    function createRandomUserObjects() {
        $("#make-users").hide();
        var randFirstNames = ["Erika", "Niklas", "Anna", "Maria", "Ludde", "Alex", "Stina", "Ture"];
        var randLastNames = ["Hallberg", "Olsson", "Johansson", "Svensson", "Franzén", "Blixt", "Dunder", "Nyqvist"];
        var randMails = ["sendme@hotmail.com", "", "min@mail.com", "", "testar@mail.com", "", "", "snigel@mail.com"];

        for (let i = 1; i < 5; i++) {
            UserStorage.saveNewUser("test" + i, "pass", randFirstNames[randomNr()], randLastNames[randomNr()], randMails[randomNr()])
        }
    }
    return {
        createRandomUserObjects,
    }
})();


///////////////////////
//Sign in popUp
//////////////////////

var SignInModul = (function () {
    function forgotPasswordPop() {
        event.preventDefault();
        $("#sign-in-pop").hide();
        $("#forgot-password-popup").show();
    }
    function forgotPasswordClose() {
        event.preventDefault();
        $("#forgot-password-popup").hide();
        $("#sign-in-pop").show();
    }
    function signInClose() {
        event.preventDefault();
        $("#first-page-modal").hide();
        $("#sign-in-pop").hide()
    }
    function signInPop() {
        event.preventDefault();
        $("#first-page-modal").show();
        $("#sign-in-pop").show();
    }

    function checkPassword(goToUser) {
        event.preventDefault();
        //indexNr in travelUsers if no match index is -1
        let index = -1;
        let userInput = document.getElementById("username-input").value;
        let passwordInput = document.getElementById("password-input").value;
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"));
        if (travelUsers === null) { travelUsers = [] };

        for (let i in travelUsers) {
            if (travelUsers[i].userName === userInput && travelUsers[i].password === passwordInput) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            alert("felaktigt användarnamn eller lösenord!");
            return;
        }

        localStorage.setItem("userKey", JSON.stringify(travelUsers[index].ID))

        $("#password-input").val("");
        if (goToUser) {
            UserManager.userInfoManager()
            return;
        }
        goToTravelTodo();

    }

    function getPassword() {
        event.preventDefault();
        console.log("get password!!")
        //check username input and see if user has email then send alert..
        usernameInput = $("#forgetfull-user-input").val()
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"));
        if (travelUsers === null) { travelUsers = [] };

        for (user of travelUsers) {
            if (user.userName === usernameInput && user.userMail !== "") {
                alert("Your password is:\n" + user.password);
                break;
            }
        }

    }
    return {
        signInPop,
        signInClose,
        checkPassword,
        getPassword,
        forgotPasswordClose,
        forgotPasswordPop,
    }
})();

/////////////////////////
//Make new users pop up!!
/////////////////////////

var NewUserModul = (function () {
    function newUserPop() {
        event.preventDefault();
        $("#first-page-modal").show();
        $("#new-user-pop").show();
    }
    function newUserClose() {
        event.preventDefault();
        $("#first-page-modal").hide();
        $("#new-user-pop").hide();
    }

    function makeNewUser() {
        event.preventDefault();
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"));
        if (travelUsers === null) { travelUsers = [] };

        var newUserName = $("#new-firstname-input").val()
        var newPassword = $("#new-password-input").val()
        var repeatPassword = $("#repeat-password-input").val()

        if (newUserName.length < 4) {
            alert("username must be atleast 4 characters")
            return;
        }
        if (newPassword.length < 4) {
            alert("password must be atleast 4 characters")
            return;
        }

        for (let user of travelUsers) {
            if (user.userName === newUserName) {
                alert("username already exists");
                return;
            }
        }
        if (newPassword !== repeatPassword) {
            alert("password doesnt match");
            return;
        }
        UserStorage.saveNewUser(newUserName, newPassword, "", "", "");
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"));
        localStorage.setItem("userKey", JSON.stringify(travelUsers[travelUsers.length - 1].ID));
        UserManager.userInfoManager()
    }
    return {
        newUserPop,
        newUserClose,
        makeNewUser,

    }
})();

/////////////////////////////
//Make changes
////////////////////////////
var UserManager = (function () {
    function changePasswordPop() {
        event.preventDefault();
        $("#change-user-popup").hide();
        $("#change-password-popup").show();
    }
    function changePasswordClose() {
        event.preventDefault();
        $("#change-password-popup").hide();
        $("#change-user-popup").show();
    }

    function userInfoManager() {
        $("#first-page-modal").show();
        $("#new-user-pop").hide();
        $("#sign-in-pop").hide();
        $("#forgot-password-popup").hide();
        $("#change-password-popup").hide();
        $("#change-user-popup").show();

        userKey = JSON.parse(localStorage.getItem("userKey"))
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"))
        for (let user of travelUsers) {
            if (userKey === user.ID) {
                $("#change-username-input").val(user.userName);
                $("#change-firstname-input").val(user.firstName);
                $("#change-lastname-input").val(user.lastName);
                $("#change-email-input").val(user.userMail);
            }
        }

    }
    function changeUserInfo() {
        event.preventDefault();
        //check info from input and make changes..
        userKey = JSON.parse(localStorage.getItem("userKey"))
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"))
        var newUserUser = $("#change-username-input").val();
        var newUserFirst = $("#change-firstname-input").val();
        var newUserLast = $("#change-lastname-input").val();
        var newUserMail = $("#change-email-input").val();

        //Change user values
        for (user of travelUsers) {
            if (user.ID === userKey) {
                user.firstName = newUserFirst;
                user.lastName = newUserLast;
                user.userMail = newUserMail;
                break;
            }
        }
        if (newUserUser.length < 4) {
            alert("username must be atleast 4 characters")
            return;
        }
        //Check userName
        for (user of travelUsers) {
            if (user.userName === newUserUser && user.ID !== userKey) {
                alert("user name already taken");
                userInfoManager();
                return;
            }
        }
        for (user of travelUsers) {
            if (user.ID === userKey) {
                user.userName = newUserUser;
                break;
            }
        }
        localStorage.setItem("travelUsers", JSON.stringify(travelUsers));

        userInfoManager();
    }
    function changeUserPassword() {
        event.preventDefault();
        //console.log("change user password")
        userKey = JSON.parse(localStorage.getItem("userKey"));
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"));
        //check password input and make changes..
        var oldPassword = $("#old-password-input").val();
        var newPassword = $("#newchange-password-input").val();
        var repeatPassword = $("#change-password-input").val();

        for (user of travelUsers) {
            if (user.ID === userKey && user.password !== oldPassword) {
                alert("Wrong password!");
                return;
            }
        }
        if (newPassword.length < 4) {
            alert("password must be atleast 4 characters")
            return;
        }
        if (newPassword !== repeatPassword) {
            alert("new passwords doesnt match");
            return;
        }
        for (user of travelUsers) {
            if (user.ID === userKey) {
                user.password = newPassword;
                break;
            }
        }
        localStorage.setItem("travelUsers", JSON.stringify(travelUsers));
        userInfoManager();

    }

    return {
        userInfoManager,
        changeUserInfo,
        changeUserPassword,
        changePasswordPop,
        changePasswordClose,
    }

})();

//////////////////
//Why....
///////////////

var UserStorage = (function () {

    var travelUsers = [];

    function init() {
        //maybe take this away, doesn't seem to receive localStorage every time..
        //think localStorage is empty when reload page
        var travelUsers = JSON.parse(localStorage.getItem("travelUsers"));
        if (travelUsers === null) {
            travelUsers = [];
            $("#make-users").show();
        }
    }

    function saveNewUser(newUserName, newPassword, newFirstName, newLastName, newUserMail) {
        var maxId = 0;
        travelUsers = JSON.parse(localStorage.getItem("travelUsers"));
        if (travelUsers === null) { travelUsers = [] };

        for (let i in travelUsers) {
            if (travelUsers[i].ID > maxId) { maxId = travelUsers[i].ID }
        }

        var newUserObject =
        {
            ID: maxId + 1,
            userName: newUserName,
            password: newPassword,
            firstName: newFirstName,
            lastName: newLastName,
            userMail: newUserMail
            //todos: TODOStorage.returnTodo() //[] //added by DN.
        };

        travelUsers.push(newUserObject);
        saveChanges();
    }

    function saveChanges() {
        localStorage.setItem("travelUsers", JSON.stringify(travelUsers));
    }
    function listUsers() {
        //This function doesn't work
        //sends empty array when page has reloaded        
        return travelUsers;
    }

    return {
        init,
        saveNewUser,
        saveChanges,
        listUsers
    }

})();

$(document).ready(function () {
    UserStorage.init();
    EventHandlers.init();
});
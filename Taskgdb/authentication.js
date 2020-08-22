var oauthUrl = "http://localhost:8080/AAA/oauth/token";
var token;
function setusername() {
    //var d= document.getElementById('adminusername').value;
    var s = "demo";
    $("#Username").text(s);
}

$("#auth_form").submit(function (e) {
    e.preventDefault();
    //window.location.href = "ICUManagement.html";
    // var formData = $(this).serializeArray();
    var username = document.getElementById("adminusername").value;
    var password = document.getElementById("password").value;
    authenticate(username, password);
});

function make_base_auth(username, password) {
    var tok = username + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

function onAuthenticated(data, status) {
      token = data;
    //var un=$('#session').val(data.userName);
    window.localStorage.setItem("access_token", data.access_token);
    window.localStorage.setItem("user_name", data.userName);
    //document.cookie = "Authorization: Bearer " + data.access_token;
    //window.localStorage.setItem("username", data.getOwnPropertyNames("username"));
    //window.location.href = 'http://192.168.9.34:8080/StartPartner/icu1';//'test/index.html';//?access_token=' + data.access_token;
    window.location.href = '../Tenantadmin/icumanagement.html';
}

function onAuthenticatFailed(data, status) {
    alert("Error: " + data + "\nStatus: " + status);
}

function authenticate(username, password) {

    $.ajax({type: "POST",
        url: oauthUrl,
        dataType: 'json',
        async: false,
        data: 'password=' + password + '&username=' + username + '&grant_type=password&scope=read%20write&client_secret=telehealth&client_id=telehealth',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth("telehealth", "telehealth"));
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        },
        success: onAuthenticated,
        error: onAuthenticatFailed
    });
}

//function getOauthUrl() {
//    var xhttp = new XMLHttpRequest();
//    xhttp.onreadystatechange = function () {
//        if (this.readyState === 4 && this.status === 200) {
//            oauthUrl = this.responseText;
//        }
//    };
//    xhttp.open("GET", "oauth/url", true);
//    xhttp.send();
//}
//
//$(function () {
//    getOauthUrl();
//});

 
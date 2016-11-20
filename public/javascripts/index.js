/**
 * Created by Артем on 13.11.2016.
 */
$(document).ready( function(){
    var registration = false;
    $("#button").click(function(){
        var bool = $("#emal").val() == "" || $("#password").val() == "";
        if (registration){
            bool = bool || $("#name").val() == ""
        }
        if (bool){
            alert("Заполните все поля");
        } else {
            var data = {}
            if ($("#register").prop("checked") == false) {
                data = {user_email:$("#email").val(), user_password:$("#password").val() }
                $.ajax({
                    url: "http://localhost:3001/login",
                    data: data,
                    type: "POST",
                    success: function () {
                        location.href = "http://localhost:3001/mainpage"
                    },
                    error: function (res_data, textStatus) {
                        $("#message").text("Incorrect email or password")
                    }
                });
            } else {
                data = {user_email:$("#email").val(), user_password:$("#password").val(), user_name:$("#name").val() }
                $.ajax({
                    url: "http://localhost:3001/registration",
                    data: data,
                    type: "POST",
                    success: function () {
                        location.href = "http://localhost:3001/mainpage"
                    },
                    error: function (res_data, textStatus) {
                        $("#message").text("This email's already used")
                    }
            })
            /*$.post("http://localhost:3001/login", data).done(function(res_data, textStatus){
                alert(1)
            });*/
            }
        }
    });
    $("#register").click(function(){
        if(!registration) {
            $("#divname").show(400)
            registration = true
        } else {
            $("#divname").hide(400)
            registration = false
        }
    })
});
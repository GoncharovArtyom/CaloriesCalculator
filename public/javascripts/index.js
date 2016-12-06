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
            showIndexError("Заполните все поля");
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
                        if (res_data.status == 401) {
                            showIndexError("Неверные данные");
                        } else {
                            showIndexError("Ошибка сервера");
                        }
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
                        console.log(res_data);
                        if (res_data.status == 401) {
                            showIndexError("Почта уже используется");
                        } else {
                            showIndexError("Ошибка сервера");
                        }
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
    });

    //Отображение ошибки
    var showIndexError = function(str){
        $('#errmessage').text(str);
        $('#errmessage').show(400);
    }
    var hideIndexError = function(){
        if ($('#errmessage').css('display')!='none')
            $('#errmessage').hide(400);
    }
});
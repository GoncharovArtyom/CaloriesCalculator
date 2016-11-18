$(document).ready( function(){
    //Выход из аккаунта
    $("#exit").click(function(){
            $.ajax({
                url: "http://localhost:3001/mainpage/logout",
                type: "GET",
                success: function () {
                    location.href = "http://localhost:3001"
                }
            })
    });

    //Показать/скрыть состав рецепта
    var handler1 = function(){
        var id = $(this).attr('id');
        $(this).addClass("hover");
        $('#' + id + 'ingr').slideDown(400);
        $(this).unbind('click', handler1);
        $(this).unbind('hover', handler1);
        $(this).unbind('mouseenter', mouse1);
        $(this).unbind('mouseleave', mouse2);
        $(this).click(handler2);
    };
    var handler2 = function(){
        $(this).removeClass("hover");
        var id = $(this).attr('id');
        $('#' + id + 'ingr').slideUp(400);
        $(this).unbind('click', handler2);
        $(".row").mouseenter(mouse1).mouseleave(mouse2);
        $(this).click(handler1);
    };
    var mouse1 = function() {
      $(this).addClass("hover");
    };
    var mouse2 = function() {
        $(this).removeClass("hover");
    };
    $(".row").click(handler1);
    $(".row").mouseenter(mouse1).mouseleave(mouse2);

    //Удалить рецепт
    $(".delete").click(function(){
        var id = $(this).attr('del_id');
        $.ajax({
            url: "http://localhost:3001/mainpage/delete",
            type: "POST",
            data:{
              recipe_id: id
            },
            success: function () {
                $('#' + id).hide(400);
                $('#' + id + 'ingr').hide(400);
                setTimeout($('#' + id).detach,400);
                setTimeout($('#' + id + 'ingr').detach,400);
            },
            error: function(){
                $("#message").text('Ошибка сервера')
            }
        })
    });
});

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

    //Показать/скрыть рецепты
    var handlerRes1 = function(){
        $('#showrecipes').slideDown(400);
        $(this).unbind('click', handlerRes1);
        $(this).click(handlerRes2);
    };
    var handlerRes2 = function(){
        $('#showrecipes').slideUp(400);
        $(this).unbind('click', handlerRes2);
        $(this).click(handlerRes1);
    };
    var mouseRes1 = function() {
        $(this).addClass("hovebutton");
    };
    var mouseRes2 = function() {
        $(this).removeClass("hovebutton");
    };
    $("#recipes").click(handlerRes1);
    $("#recipes").mouseenter(mouseRes1).mouseleave(mouseRes2);

    //Показать/скрыть создание рецептов
    var handlerCreate1 = function(){
        $('#add').slideDown(400);
        $(this).unbind('click', handlerCreate1);
        $(this).click(handlerCreate2);
    };
    var handlerCreate2 = function(){
        $('#add').slideUp(400);
        $(this).unbind('click', handlerCreate2);
        $(this).click(handlerCreate1);
    };
    var handlerGetFood = function() {
        $.ajax({
            url: "http://localhost:3001/mainpage/createrecipe",
            type: "GET",
            success: function (data) {
                for (var i=0; i<data.length; ++i) {
                    var newDiv = $(document.createElement('div'));
                    newDiv.attr('food_id',data[i].food_id );
                    newDiv.attr('proteins',data[i].proteins );
                    newDiv.attr('lipids',data[i].lipids );
                    newDiv.attr('carbs',data[i].carbs );
                    newDiv.attr('calories',data[i].calories);
                    newDiv.addClass('visiblefood');
                    newDiv.addClass('divfood');
                    newDiv.text(data[i].food_name);
                    $("#foodtable").append(newDiv)
                }
                $("#addrecipe").unbind('click', handlerGetFood);
            },
            error: function () {
                $("#errmessage").text('Ошибка сервера')
            },
            dataType: 'json'
        })
    }
    $("#addrecipe").click(handlerGetFood);
    $("#addrecipe").click(handlerCreate1);
    $("#addrecipe").mouseenter(mouseRes1).mouseleave(mouseRes2);

    //Поиск по продуктам
    $("#search").click(function(){
        $(this).val('');
    });
    $("#search").keyup(function(){
        var divArray = $('.divfood');
        var reg = new RegExp($("#search").val(),'i');
        console.log(reg);
        for (var i=0; i<divArray.length; ++i){
            var text = $(divArray[i]).text();
            if(text.search(reg) == -1){
                $(divArray[i]).removeClass('visiblefood');
                $(divArray[i]).addClass('invisiblefood');
            } else {
                $(divArray[i]).addClass('visiblefood');
                $(divArray[i]).removeClass('invisiblefood');
            }
        }
    })
});

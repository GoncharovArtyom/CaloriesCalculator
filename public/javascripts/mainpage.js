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
    var deleteHandler = function() {
        var id = $(this).attr('del_id');
        $.ajax({
            url: "http://localhost:3001/mainpage/delete",
            type: "POST",
            data: {
                recipe_id: id
            },
            success: function () {
                $('#' + id).hide(400);
                $('#' + id + 'ingr').hide(400);
                setTimeout($('#' + id).detach, 400);
                setTimeout($('#' + id + 'ingr').detach, 400);
            },
            error: function () {
                $("#message").text('Ошибка сервера')
            }
        })
    };
    $(".delete").click(deleteHandler);

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

                //Обработчики для обавления продукта
                $(".divfood").mouseenter(mouse1).mouseleave(mouse2);
                $(".divfood").click(function(){
                    if ($('#resamount').prop('disabled'))
                        $('#resamount').prop('disabled', false);
                    //Сброс итогового веса
                    resetResAmount();

                    //Создание строчки
                   var newDivIngrRow = $(document.createElement('div'));
                   newDivIngrRow.attr('food_id',$(this).attr('food_id'));
                    newDivIngrRow.attr('proteins',$(this).attr('proteins'));
                    newDivIngrRow.attr('lipids',$(this).attr('lipids'));
                    newDivIngrRow.attr('carbs',$(this).attr('carbs'));
                    newDivIngrRow.attr('calories',$(this).attr('calories'));
                   newDivIngrRow.addClass('ingrrow');
                    newDivIngrRow.addClass('clearfix');
                    //Столбец
                    var newDiv = $(document.createElement('div'));
                    newDiv.addClass('ingrcol');
                    newDiv.text($(this).text());
                    newDivIngrRow.append(newDiv);
                    //Столбец
                    newDiv = $(document.createElement('input'));
                    newDiv.addClass('ingrcolright');
                    newDiv.addClass('inputweight');
                    newDiv.attr('type','text');
                    newDiv.attr('amount','100');
                    newDiv.val(100);
                    $("#resamount").val(+$("#resamount").val() + 100);
                    $("#resamount").attr('amount', $("#resamount").val())
                    newDiv.keyup(function(){

                        if(isWeightGhanged){
                            //$("#resproteins").text($("#resproteins").attr('amount'));
                            //$("#rescarbs").text($("#rescarbs").attr('amount'));
                            //$("#reslipids").text($("#reslipids").attr('amount'));
                            //$("#rescalories").text($("#rescalories").attr('amount'));
                            $("#resamount").val($("#resamount").attr('amount'));

                            isWeightGhanged = false;
                        }

                        var weight = $(this).val();
                        if (weight == '' || weight == '0'){
                            weight = 0;
                        }
                        var siblings = $(this).siblings('.ingrcolright');
                        var parent = $(this).parent();
                        var data = Math.round(parent.attr('calories')*weight/100);
                        $(siblings[0]).text(data);
                        $("#rescalories").text(+$("#rescalories").text() - +$(siblings[0]).attr('amount') + data);
                        //$("#rescalories").attr('amount', $("#rescalories").text())
                        $(siblings[0]).attr('amount',data);

                        data = Math.round(parent.attr('carbs')*weight/100);
                        $(siblings[1]).text(data);
                        $("#rescarbs").text(+$("#rescarbs").text() - +$(siblings[1]).attr('amount') + data);
                        //$("#rescarbs").attr('amount', $("#rescarbs").text())
                        $(siblings[1]).attr('amount',data);

                        data = Math.round(parent.attr('lipids')*weight/100);
                        $(siblings[2]).text(data);
                        $("#reslipids").text(+$("#reslipids").text() - +$(siblings[2]).attr('amount') + data);
                        //$("#reslipids").attr('amount', $("#reslipids").text())
                        $(siblings[2]).attr('amount',data);

                        data = Math.round(parent.attr('proteins')*weight/100);
                        $(siblings[3]).text(data);
                        $("#resproteins").text(+$("#resproteins").text() - +$(siblings[3]).attr('amount') + data);
                        //$("#resproteins").attr('amount', $("#resproteins").text())
                        $(siblings[3]).attr('amount',data);

                        $("#resamount").val(+$("#resamount").val() - +$(this).attr('amount') + +weight);
                        $("#resamount").attr('amount', $("#resamount").val())
                        $(this).attr('amount',weight);

                        //Подсчет количества на 100гр
                        calcAmount100();

                    });
                    newDivIngrRow.append(newDiv);
                    //Столбец
                    newDiv = $(document.createElement('div'));
                    newDiv.addClass('ingrcolright');
                    var data = $(this).attr('calories')
                    $('#rescalories').text(Number($('#rescalories').text()) + +data)
                    //$("#rescalories").attr('amount', $("#rescalories").text())
                    newDiv.text(data);
                    newDiv.attr('amount', data);
                    newDivIngrRow.append(newDiv);
                    //Столбец
                    newDiv = $(document.createElement('div'));
                    newDiv.addClass('ingrcolright');
                    data = $(this).attr('carbs')
                    $('#rescarbs').text(Number($('#rescarbs').text()) + +data)
                    //$("#rescarbs").attr('amount', $("#rescarbs").text())
                    newDiv.text(data);
                    newDiv.attr('amount', data);
                    newDivIngrRow.append(newDiv);
                    //Столбец
                    newDiv = $(document.createElement('div'));
                    newDiv.addClass('ingrcolright');
                    data = $(this).attr('lipids')
                    $('#reslipids').text(Number($('#reslipids').text()) + +data)
                    //$("#reslipids").attr('amount', $("#reslipids").text())
                    newDiv.text(data);
                    newDiv.attr('amount', data);
                    newDivIngrRow.append(newDiv);
                    //Столбец
                    newDiv = $(document.createElement('div'));
                    newDiv.addClass('ingrcolright');
                    data = $(this).attr('proteins')
                    $('#resproteins').text(Number($('#resproteins').text()) + +data)
                    //$("#resproteins").attr('amount', $("#resproteins").text())
                    newDiv.text(data);
                    newDiv.attr('amount', data);
                    newDivIngrRow.append(newDiv);

                    $(newDivIngrRow).dblclick(function(){
                        if($("#ingrtable").children().length == 2)
                            $('#resamount').prop('disabled', true);
                        //Сброс итогового веса
                        resetResAmount();


                       $(this).hide('fast');
                        elem = $(this)
                        var children = elem.children();
                        $("#rescalories").text(+$("#rescalories").text() - +$(children[2]).attr('amount'));
                        //("#rescalories").attr('amount', $("#rescalories").text())
                        $("#rescarbs").text(+$("#rescarbs").text() - +$(children[3]).attr('amount'));
                        //$("#rescarbs").attr('amount', $("#rescarbs").text())
                        $("#reslipids").text(+$("#reslipids").text() - +$(children[4]).attr('amount'));
                        //$("#reslipids").attr('amount', $("#reslipids").text())
                        $("#resproteins").text(+$("#resproteins").text() - +$(children[5]).attr('amount'));
                        //$("#resproteins").attr('amount', $("#resproteins").text())
                        $("#resamount").val(+$("#resamount").val() - +$(children[1]).attr('amount'));
                        $("#resamount").attr('amount', $("#resamount").val())

                        //Подсчет итога на 100
                        calcAmount100();

                        setTimeout(function(){
                            elem.detach();
                        },200)
                    });
                    $(newDivIngrRow).mouseenter(mouse1).mouseleave(mouse2);

                    //Подсчет кооличества на 100 грамм
                    calcAmount100();
                    //Добавление элемента
                    $("#ingrtable").append(newDivIngrRow)
                });
            },
            error: function () {
                $("#errmessage").text('Ошибка сервера')
            },
            dataType: 'json'
        })
    };
    //$("#addrecipe").click(handlerGetFood);
    handlerGetFood();
    $("#addrecipe").click(handlerCreate1);
    $("#addrecipe").mouseenter(mouseRes1).mouseleave(mouseRes2);

    //Поиск по продуктам
    $("#search").click(function(){
        $(this).val('');
    });
    $("#search").keyup(function(){
        var divArray = $('.divfood');
        var reg = new RegExp($("#search").val(),'i');
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
    });

    //Изменение общего веса
    var isWeightGhanged = false;
    $("#resamount").keyup(function(){

        isWeightGhanged = true;
        calcAmount100();
        /*var weight = $(this).val()
        var amount = $(this).attr('amount');
        var rescalories = $('#rescalories');
        var reslipids = $('#reslipids');
        var rescarbs = $('#rescarbs');
        var resproteins = $("#resproteins");

        if (weight == '') weight = 0;*/
        /*rescalories.text(Math.round(rescalories.attr('amount')*weight/amount));
        reslipids.text(Math.round(reslipids.attr('amount')*weight/amount));
        rescarbs.text(Math.round(rescarbs.attr('amount')*weight/amount));
        resproteins.text(Math.round(resproteins.attr('amount')*weight/amount));*/
    })
    //Подсчет количества веществ на 100 гр
    var calcAmount100 = function(){
        var weight = Math.round($("#resamount").val());
        var calories = $("#rescalories").text();
        var proteins = $("#resproteins").text();
        var lipids = $("#reslipids").text();
        var carbs = $("#rescarbs").text();

        if (weight != 0) {
            $("#calories100").text(Math.round(calories/weight*100));
            $("#lipids100").text(Math.round(lipids/weight*100));
            $("#carbs100").text(Math.round(carbs/weight*100));
            $("#proteins100").text(Math.round(proteins/weight*100));

        } else {
            $("#calories100").text('0');
            $("#lipids100").text('0');
            $("#carbs100").text('0');
            $("#proteins100").text('0');
        }
    }
    //Сброс итогового количества
    var resetResAmount = function () {
        $("#resamount").val($("#resamount").attr('amount'))
    }

    //Обнуление имени
    $("#nameinput").click(function(){
        if($(this).val() == "Название")
            $(this).val('');
    })

    //Нажатие создать рецепт
    $("#createres").mouseenter(mouseRes1).mouseleave(mouseRes2);
    $("#createres").click(function(){
       var name = $("#nameinput").val();
        if (name == "" || name == "Название"){
            $("#addmessage").text("Введите название");
        } else {
            if ($("#ingrtable").children().length == 1){
                $("#addmessage").text("Добавьте ингридиенты");
            } else{
                $("#addmessage").text("");
                var newRecipe = {};
                newRecipe.recipe_name = name;
                newRecipe.proteins = $("#proteins100").text();
                newRecipe.lipids = $("#lipids100").text();
                newRecipe.carbs = $("#carbs100").text();
                newRecipe.calories = $("#calories100").text();

                var ingridients = [];
                var ingrArray = $("#ingrtable").children("div[food_id]");

                for(var i=0; i<ingrArray.length; ++i){
                    ingridients.push($(ingrArray[i]).attr('food_id'));
                }

                $.ajax({
                    url: "http://localhost:3001/mainpage/add",
                    type: "POST",
                    data:{
                        recipeInf: newRecipe,
                        ingridientsInf: ingridients
                    },
                    success: function (data) {
                        var recipe_id = data.recipe_id;

                        var newRow = document.createElement("div");
                        $(newRow).addClass('row');
                        $(newRow).addClass('clearfix');
                        $(newRow).attr('id', recipe_id);

                        //Name
                        var newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(name);
                        newRow.append(newCol);

                        //proteins
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(newRecipe.proteins);
                        newRow.append(newCol);

                        //lipids
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(newRecipe.lipids);
                        newRow.append(newCol);

                        //carbs
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(newRecipe.carbs);
                        newRow.append(newCol);

                        //calories
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatright');
                        $(newCol).text(newRecipe.calories);
                        newRow.append(newCol);

                        $(newRow).click(handler1);
                        $(newRow).mouseenter(mouse1).mouseleave(mouse2);

                        $("#recipe_table").append(newRow);

                        //INGRIDIENTS
                        var elem = document.createElement('div');
                        $(elem).addClass('ingr');
                        $(elem).attr('id',recipe_id + 'ingr');

                        newRow = document.createElement('div');
                        $(newRow).addClass('rowtitle2');
                        $(newRow).addClass('clearfix');

                        newCol = document.createElement('div');
                        $(newCol).addClass('floatleft2');
                        $(newCol).addClass('coltitle2');
                        $(newCol).text("Ингридиенты");
                        newRow.append(newCol);

                        newCol = document.createElement('div');
                        $(newCol).addClass('floatright2');
                        $(newCol).addClass('coltitle2');
                        $(newCol).text("Количество");
                        newRow.append(newCol);

                        elem.append(newRow);

                        for(var i=0; i<ingrArray.length; ++i){
                            newRow = document.createElement('div');
                            $(newRow).addClass('row2');
                            $(newRow).addClass('clearfix');

                            newCol = document.createElement('div');
                            $(newCol).addClass('floatleft2');
                            $(newCol).text($($(ingrArray[i]).children()[0]).text());
                            newRow.append(newCol);

                            newCol = document.createElement('div');
                            $(newCol).addClass('floatright2');
                            $(newCol).text($($(ingrArray[i]).children()[1]).val() + ' гр');
                            newRow.append(newCol);

                            elem.append(newRow);
                        }

                        var del = document.createElement('div');
                        $(del).addClass('delete');
                        $(del).text("Удалить");
                        $(del).attr('del_id', recipe_id);
                        $(del).click(deleteHandler);

                        elem.append(del);

                        $("#recipe_table").append(elem);
                    },
                    error: function(){
                        $("#addmessage").text('Ошибка сервера')
                    },
                    dataType: 'json'
                })
            }
        }
    });
});

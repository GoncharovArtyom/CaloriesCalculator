$(document).ready( function() {

    //Загрузка блока создание рецепта
    var loadCreateRec = function () {
        $.ajax({
            url: "http://localhost:3001/mainpage/createrecipe",
            type: "GET",
            success: function (data) {
                for (var i = 0; i < data.length; ++i) {
                    var newDiv = $(document.createElement('div'));
                    newDiv.attr('food_id', data[i].food_id);
                    newDiv.attr('proteins', data[i].proteins);
                    newDiv.attr('lipids', data[i].lipids);
                    newDiv.attr('carbs', data[i].carbs);
                    newDiv.attr('calories', data[i].calories);

                    newDiv.addClass('foodstat');
                    newDiv.addClass('visible');
                    var newDiv1 = $(newDiv).clone();
                    //Добавление этого продукта в статистику

                    newDiv1.addClass('clearfix');
                    var textDiv = $(document.createElement('div'));
                    textDiv.text(data[i].food_name);
                    textDiv.addClass('fll');
                    textDiv.addClass('textdivstat');
                    newDiv1.append(textDiv);
                    var newInput = $(document.createElement('input'));
                    newInput.attr('type', 'text');
                    newInput.addClass('flr');
                    newInput.addClass('statinput');
                    newInput.addClass('invisible');
                    newDiv1.append(newInput);
                    var adddiv = $(document.createElement('div'));
                    adddiv.addClass('adddiv');
                    adddiv.addClass('invisible');
                    adddiv.text('Добавить');
                    newDiv1.append(adddiv);
                    handlerStatElems(newDiv1);
                    $("#statfood").append(newDiv1);
                    newDiv.text(data[i].food_name);
                    newDiv.addClass('divfood');
                    //Добавление этого продукта в создание рецептов
                    $("#foodtable").append(newDiv);

                }

                //Обработчики для обавления продукта
                $(".divfood").mouseenter(mouse1).mouseleave(mouse2);
                $(".divfood").click(function () {
                    if ($('#resamount').prop('disabled'))
                        $('#resamount').prop('disabled', false);
                    //Сброс итогового веса
                    resetResAmount();

                    //Создание строчки
                    var newDivIngrRow = $(document.createElement('div'));
                    newDivIngrRow.attr('food_id', $(this).attr('food_id'));
                    newDivIngrRow.attr('proteins', $(this).attr('proteins'));
                    newDivIngrRow.attr('lipids', $(this).attr('lipids'));
                    newDivIngrRow.attr('carbs', $(this).attr('carbs'));
                    newDivIngrRow.attr('calories', $(this).attr('calories'));
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
                    newDiv.attr('type', 'text');
                    newDiv.attr('amount', '100');
                    newDiv.val(100);
                    $("#resamount").val(+$("#resamount").val() + 100);
                    $("#resamount").attr('amount', $("#resamount").val())
                    newDiv.keyup(function () {

                        if (isWeightGhanged) {
                            //$("#resproteins").text($("#resproteins").attr('amount'));
                            //$("#rescarbs").text($("#rescarbs").attr('amount'));
                            //$("#reslipids").text($("#reslipids").attr('amount'));
                            //$("#rescalories").text($("#rescalories").attr('amount'));
                            $("#resamount").val($("#resamount").attr('amount'));

                            isWeightGhanged = false;
                        }

                        var weight = $(this).val();
                        if (weight == '' || weight == '0') {
                            weight = 0;
                        }
                        var siblings = $(this).siblings('.ingrcolright');
                        var parent = $(this).parent();
                        var data = Math.round(parent.attr('calories') * weight / 100);
                        $(siblings[0]).text(data);
                        $("#rescalories").text(+$("#rescalories").text() - +$(siblings[0]).attr('amount') + data);
                        //$("#rescalories").attr('amount', $("#rescalories").text())
                        $(siblings[0]).attr('amount', data);

                        data = Math.round(parent.attr('carbs') * weight / 100);
                        $(siblings[1]).text(data);
                        $("#rescarbs").text(+$("#rescarbs").text() - +$(siblings[1]).attr('amount') + data);
                        //$("#rescarbs").attr('amount', $("#rescarbs").text())
                        $(siblings[1]).attr('amount', data);

                        data = Math.round(parent.attr('lipids') * weight / 100);
                        $(siblings[2]).text(data);
                        $("#reslipids").text(+$("#reslipids").text() - +$(siblings[2]).attr('amount') + data);
                        //$("#reslipids").attr('amount', $("#reslipids").text())
                        $(siblings[2]).attr('amount', data);

                        data = Math.round(parent.attr('proteins') * weight / 100);
                        $(siblings[3]).text(data);
                        $("#resproteins").text(+$("#resproteins").text() - +$(siblings[3]).attr('amount') + data);
                        //$("#resproteins").attr('amount', $("#resproteins").text())
                        $(siblings[3]).attr('amount', data);

                        $("#resamount").val(+$("#resamount").val() - +$(this).attr('amount') + +weight);
                        $("#resamount").attr('amount', $("#resamount").val())
                        $(this).attr('amount', weight);

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

                    $(newDivIngrRow).dblclick(function () {
                        if ($("#ingrtable").children().length == 2)
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

                        setTimeout(function () {
                            elem.detach();
                        }, 200)
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
    loadCreateRec();

    //Загрузка блока моих рецептов
    var loadMyRec = function () {
        $.ajax({
            url: "http://localhost:3001/mainpage/getrecipes",
            type: "GET",
            success: function (data) {
                if (data.length != 0) {
                    for (var i = 0; i < data.length; ++i) {
                        var recipe_id = data[i].recipe_id;

                        var newRow = document.createElement("div");
                        $(newRow).addClass('row');
                        $(newRow).addClass('clearfix');
                        $(newRow).attr('id', recipe_id);

                        //Name
                        var newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(data[i].recipe_name);
                        $(newRow).append(newCol);

                        //proteins
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(data[i].proteins);
                        $(newRow).append(newCol);

                        //lipids
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(data[i].lipids);
                        $(newRow).append(newCol);

                        //carbs
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(data[i].carbs);
                        $(newRow).append(newCol);

                        //calories
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatright');
                        $(newCol).text(data[i].calories);
                        $(newRow).append(newCol);

                        $(newRow).click(handler1);
                        $(newRow).mouseenter(mouse1).mouseleave(mouse2);

                        $("#recipe_table").append(newRow);

                        //Добавление этого рецепта в статистику
                        var newDiv = $(document.createElement('div'));
                        newDiv.attr('recipe_id', data[i].recipe_id);
                        newDiv.attr('proteins', data[i].proteins);
                        newDiv.attr('lipids', data[i].lipids);
                        newDiv.attr('carbs', data[i].carbs);
                        newDiv.attr('calories', data[i].calories);
                        newDiv.addClass('visible');
                        newDiv.addClass('clearfix');
                        var textDiv = $(document.createElement('div'));
                        textDiv.text(data[i].recipe_name);
                        textDiv.addClass('fll');
                        textDiv.addClass('textdivstat');
                        newDiv.append(textDiv);
                        newDiv.addClass('recipestat')
                        var newInput = $(document.createElement('input'));
                        newInput.attr('type', 'text');
                        newInput.addClass('flr');
                        newInput.addClass('statinput');
                        newInput.addClass('invisible');
                        newDiv.append(newInput);
                        var adddiv = $(document.createElement('div'));
                        adddiv.addClass('adddiv');
                        adddiv.addClass('invisible');
                        adddiv.text('Добавить');
                        newDiv.append(adddiv);
                        handlerStatElems(newDiv);
                        $("#statrecipes").append(newDiv)

                        //INGRIDIENTS
                        var elem = document.createElement('div');
                        $(elem).addClass('ingr');
                        $(elem).attr('id', recipe_id + 'ingr');

                        newRow = document.createElement('div');
                        $(newRow).addClass('rowtitle2');
                        $(newRow).addClass('clearfix');

                        newCol = document.createElement('div');
                        $(newCol).addClass('floatleft2');
                        $(newCol).addClass('coltitle2');
                        $(newCol).text("Ингридиенты");
                        $(newRow).append(newCol);

                        newCol = document.createElement('div');
                        $(newCol).addClass('floatright2');
                        $(newCol).addClass('coltitle2');
                        $(newCol).text("Количество");
                        $(newRow).append(newCol);

                        $(elem).append(newRow);

                        for (var j = 0; j < data[i].data.length; ++j) {
                            newRow = document.createElement('div');
                            $(newRow).addClass('row2');
                            $(newRow).addClass('clearfix');

                            newCol = document.createElement('div');
                            $(newCol).addClass('floatleft2');
                            $(newCol).text(data[i].data[j].name);
                            $(newRow).append(newCol);

                            newCol = document.createElement('div');
                            $(newCol).addClass('floatright2');
                            $(newCol).text(data[i].data[j].amount + ' гр');
                            $(newRow).append(newCol);

                            $(elem).append(newRow);
                        }

                        var del = document.createElement('div');
                        $(del).addClass('delete');
                        $(del).text("Удалить");
                        $(del).attr('del_id', recipe_id);
                        $(del).click(deleteHandler);

                        $(elem).append(del);

                        $("#recipe_table").append(elem);
                    }
                } else {
                    $("#message").text('Нет рецептов')
                }
            },
            error: function () {
                $("#errmessage").text('Ошибка сервера')
            },
            dataType: 'json'
        })
    };
    loadMyRec()

    //Загрузка статистики
    var date = new Date();
    var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate());
    var loadStats = function (dateStr) {
        $.ajax({
            url: "http://localhost:3001/mainpage/getstats",
            type: "POST",
            success: function (data) {
                if (data.length != 0) {
                    for (var i = 0; i < data.length; ++i) {
                        addStatRow(data[i]);
                        /*var newDivIngrRow = $(document.createElement('div'));
                        if (data[i].food_id)
                            newDivIngrRow.attr('food_id', data[i].food_id);
                        else
                            newDivIngrRow.attr('recipe_id', data[i].recipe_id);
                        newDivIngrRow.attr('proteins', data[i].proteins);
                        newDivIngrRow.attr('lipids', data[i].lipids);
                        newDivIngrRow.attr('carbs', data[i].carbs);
                        newDivIngrRow.attr('calories', data[i].calories);
                        newDivIngrRow.attr('amount', data[i].amount);
                        newDivIngrRow.addClass('ingrrow');
                        newDivIngrRow.addClass('clearfix');
                        //Столбец
                        var newDiv = $(document.createElement('div'));
                        newDiv.addClass('ingrcol');
                        newDiv.text(data[i].recipe_name);
                        $(newDivIngrRow).append(newDiv);
                        //Столбец
                        newDiv = $(document.createElement('div'));
                        newDiv.addClass('ingrcolright');
                        newDiv.text(data[i].amount);
                        $(newDivIngrRow).append(newDiv);
                        //Столбец
                        newDiv = $(document.createElement('div'));
                        newDiv.addClass('ingrcolright');
                        newDiv.text(data[i].calories);
                        $(newDivIngrRow).append(newDiv);
                        //Столбец
                        newDiv = $(document.createElement('div'));
                        newDiv.addClass('ingrcolright');
                        newDiv.text(data[i].carbs);
                        $(newDivIngrRow).append(newDiv);
                        //Столбец
                        newDiv = $(document.createElement('div'));
                        newDiv.addClass('ingrcolright');
                        newDiv.text(data[i].lipids);
                        $(newDivIngrRow).append(newDiv);
                        //Столбец
                        newDiv = $(document.createElement('div'));
                        newDiv.addClass('ingrcolright');
                        newDiv.text(data[i].proteins);
                        $(newDivIngrRow).append(newDiv);

                        //Удаление статистики двойным нажатием
                        $(newDivIngrRow).mouseenter(mouse1).mouseleave(mouse2);
                        $(newDivIngrRow).dblclick(function () {
                            var elem = this;
                            var data = {}
                            data.date = $("#date input").attr('date');
                            if ($(this).attr('recipe_id')) {
                                data.recipe_id = $(this).attr('recipe_id');
                                $.ajax({
                                    url: "http://localhost:3001/mainpage/delrecstats",
                                    type: "POST",
                                    success: function () {
                                        $(elem).hide(400);
                                        setTimeout(function () {
                                            $(elem).detach();
                                            calcSum();
                                        }, 400);
                                    },
                                    error: function () {
                                        $("#statmessage").text("Ошибка сервера");
                                    },
                                    data: data
                                });
                            } else {
                                data.food_id = $(this).attr('food_id');
                                $.ajax({
                                    url: "http://localhost:3001/mainpage/delfoodstats",
                                    type: "POST",
                                    success: function () {
                                        $(elem).hide(400);
                                        setTimeout(function () {
                                            $(elem).detach();
                                            calcSum();
                                        }, 400);
                                    },
                                    error: function () {
                                        $("#statmessage").text("Ошибка сервера");
                                    },
                                    data: data
                                })
                            }

                        });

                        $("#eatentable").append(newDivIngrRow);*/
                    }
                }
                calcSum();
            },
            error: function (err) {
                $('#statmessage').text("Ошибка");
            },
            data: {date: dateStr},
            dataType: 'json'
        })
    }
    $("#date input").attr('date', dateStr);
    loadStats(dateStr);

    //Изменение даты в статистике
    var addhoverbutton = function () {
        $(this).addClass('hoverbutton');
    }
    var removehoverbutton = function () {
        $(this).removeClass('hoverbutton');
    }
    $("#date div").mouseenter(addhoverbutton).mouseleave(removehoverbutton);
    $("#date div").click(function () {
        var date = $('#date input').val();
        var rows = $('#eatentable').children();
        for (var i = 1; i < rows.length; ++i) {
            $(rows[i]).detach();
        }
        $("#date input").attr('date', date);
        loadStats(date);
    });

    //Подсчет сумм в статистике
    var calcSum = function () {
        var row = $("#eatentable").children('.ingrrow');
        var sumProteins, sumLipids, sumCarbs, sumCalories, sumWeight = 0;
        sumProteins = sumLipids = sumCarbs = sumCalories = sumWeight;
        for (var i = 1; i < row.length; ++i) {
            sumProteins = sumProteins + +$(row[i]).attr("proteins");
            sumLipids = sumLipids + +$(row[i]).attr("lipids");
            sumCarbs = sumCarbs + +$(row[i]).attr("carbs");
            sumCalories = sumCalories + +$(row[i]).attr("calories");
            sumWeight = sumWeight + +$(row[i]).attr("amount");
        }
        $("#eatenresamount").text(sumWeight);
        $("#eatenrescalories").text(sumCalories);
        $("#eatenreslipids").text(sumLipids);
        $("#eatenrescarbs").text(sumCarbs);
        $("#eatenresproteins").text(sumProteins);
    }

    //Поиск в статистике
    $("#statsearchinput").click(function () {
        $(this).val('');
    });
    $("#statsearchinput").keyup(function () {
        var divArray = $('#statrecipes, #statfood').children('div');
        var reg = new RegExp($("#statsearchinput").val(), 'i');
        for (var i = 0; i < divArray.length; ++i) {
            var text = $(divArray[i]).text();
            if (text.search(reg) == -1) {
                $(divArray[i]).removeClass('visible');
                $(divArray[i]).addClass('invisible');
            } else {
                $(divArray[i]).addClass('visible');
                $(divArray[i]).removeClass('invisible');
            }
        }
    });

    //Выход из аккаунта
    $("#exit").click(function () {
        $.ajax({
            url: "http://localhost:3001/mainpage/logout",
            type: "GET",
            success: function () {
                location.href = "http://localhost:3001"
            }
        })
    });

    //Показать/скрыть состав рецепта
    var handler1 = function () {
        var id = $(this).attr('id');
        $(this).addClass("hover");
        $('#' + id + 'ingr').slideDown(400);
        $(this).unbind('click', handler1);
        $(this).unbind('mouseenter', mouse1);
        $(this).unbind('mouseleave', mouse2);
        $(this).click(handler2);
    };
    var handler2 = function () {
        $(this).removeClass("hover");
        var id = $(this).attr('id');
        $('#' + id + 'ingr').slideUp(400);
        $(this).unbind('click', handler2);
        $(".row").mouseenter(mouse1).mouseleave(mouse2);
        $(this).click(handler1);
    };
    var mouse1 = function () {
        $(this).addClass("hover");
    };
    var mouse2 = function () {
        $(this).removeClass("hover");
    };
    $(".row").click(handler1);
    $(".row").mouseenter(mouse1).mouseleave(mouse2);

    //Удалить рецепт
    var deleteHandler = function () {
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
                $("#statrecipes").children("[recipe_id = " + id + "]").detach();
            },
            error: function () {
                $("#message").text('Ошибка сервера')
            }
        })
    };

    //Показать/скрыть рецепты
    var handlerShow = function () {
        $(this).next().slideDown(400);
        $(this).unbind('click', handlerShow);
        $(this).click(handlerHide);
    };
    var handlerHide = function () {
        $(this).next().slideUp(400);
        $(this).unbind('click', handlerHide);
        $(this).click(handlerShow);
    };
    var mouseHoverMenu = function () {
        $(this).addClass("hovebutton");
    };
    var mouseMenu = function () {
        $(this).removeClass("hovebutton");
    };
    var mouseRes1 = function () {
        $(this).addClass("hovebutton");
    };
    var mouseRes2 = function () {
        $(this).removeClass("hovebutton");
    };
    $("#recipes").click(handlerShow);
    $("#recipes").mouseenter(mouseHoverMenu).mouseleave(mouseMenu);

    //Показать/скрыть создание рецептов
    var handlerCreate1 = function () {
        $('#add').slideDown(400);
        $(this).unbind('click', handlerCreate1);
        $(this).click(handlerCreate2);
    };
    var handlerCreate2 = function () {
        $('#add').slideUp(400);
        $(this).unbind('click', handlerCreate2);
        $(this).click(handlerCreate1);
    };
    $("#addrecipe").click(handlerShow);
    $("#addrecipe").mouseenter(mouseHoverMenu).mouseleave(mouseMenu);

    //Показать скрыть статистику
    $("#stattitle").click(handlerShow);
    $("#stattitle").mouseenter(mouseHoverMenu).mouseleave(mouseMenu);

    //Поиск по продуктам
    $("#search").click(function () {
        $(this).val('');
    });
    $("#search").keyup(function () {
        var divArray = $('.divfood');
        var reg = new RegExp($("#search").val(), 'i');
        for (var i = 0; i < divArray.length; ++i) {
            var text = $(divArray[i]).text();
            if (text.search(reg) == -1) {
                $(divArray[i]).removeClass('visible');
                $(divArray[i]).addClass('invisible');
            } else {
                $(divArray[i]).addClass('visible');
                $(divArray[i]).removeClass('invisible');
            }
        }
    });

    //Изменение общего веса
    var isWeightGhanged = false;
    $("#resamount").keyup(function () {

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
    var calcAmount100 = function () {
        var weight = Math.round($("#resamount").val());
        var calories = $("#rescalories").text();
        var proteins = $("#resproteins").text();
        var lipids = $("#reslipids").text();
        var carbs = $("#rescarbs").text();

        if (weight != 0) {
            $("#calories100").text(Math.round(calories / weight * 100));
            $("#lipids100").text(Math.round(lipids / weight * 100));
            $("#carbs100").text(Math.round(carbs / weight * 100));
            $("#proteins100").text(Math.round(proteins / weight * 100));

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
    $("#nameinput").click(function () {
        if ($(this).val() == "Название")
            $(this).val('');
    })

    //Нажатие создать рецепт
    $("#createres").mouseenter(mouseRes1).mouseleave(mouseRes2);
    $("#createres").click(function () {
        var name = $("#nameinput").val();
        if (name == "" || name == "Название") {
            $("#addmessage").text("Введите название");
        } else {
            if ($("#ingrtable").children().length == 1) {
                $("#addmessage").text("Добавьте ингридиенты");
            } else {
                $("#addmessage").text("");
                var newRecipe = {};
                newRecipe.recipe_name = name;
                newRecipe.proteins = $("#proteins100").text();
                newRecipe.lipids = $("#lipids100").text();
                newRecipe.carbs = $("#carbs100").text();
                newRecipe.calories = $("#calories100").text();

                var ingridients = [];
                var ingrArray = $("#ingrtable").children("div[food_id]");

                for (var i = 0; i < ingrArray.length; ++i) {
                    var obj = {}
                    obj.food_id = $(ingrArray[i]).attr('food_id');
                    obj.amount = $($(ingrArray[i]).children()[1]).val()
                    ingridients.push(obj);
                }

                $.ajax({
                    url: "http://localhost:3001/mainpage/add",
                    type: "POST",
                    data: {
                        recipeInf: JSON.stringify(newRecipe),
                        ingridientsInf: JSON.stringify(ingridients)
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
                        $(newRow).append(newCol);

                        //proteins
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(newRecipe.proteins);
                        $(newRow).append(newCol);

                        //lipids
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(newRecipe.lipids);
                        $(newRow).append(newCol);

                        //carbs
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatleft');
                        $(newCol).text(newRecipe.carbs);
                        $(newRow).append(newCol);

                        //calories
                        newCol = document.createElement("div");
                        $(newCol).addClass('floatright');
                        $(newCol).text(newRecipe.calories);
                        $(newRow).append(newCol);

                        $(newRow).click(handler1);
                        $(newRow).mouseenter(mouse1).mouseleave(mouse2);

                        $("#recipe_table").append(newRow);

                        //INGRIDIENTS
                        var elem = document.createElement('div');
                        $(elem).addClass('ingr');
                        $(elem).attr('id', recipe_id + 'ingr');

                        newRow = document.createElement('div');
                        $(newRow).addClass('rowtitle2');
                        $(newRow).addClass('clearfix');

                        newCol = document.createElement('div');
                        $(newCol).addClass('floatleft2');
                        $(newCol).addClass('coltitle2');
                        $(newCol).text("Ингридиенты");
                        $(newRow).append(newCol);

                        newCol = document.createElement('div');
                        $(newCol).addClass('floatright2');
                        $(newCol).addClass('coltitle2');
                        $(newCol).text("Количество");
                        $(newRow).append(newCol);

                        $(elem).append(newRow);

                        for (var i = 0; i < ingrArray.length; ++i) {
                            newRow = document.createElement('div');
                            $(newRow).addClass('row2');
                            $(newRow).addClass('clearfix');

                            newCol = document.createElement('div');
                            $(newCol).addClass('floatleft2');
                            $(newCol).text($($(ingrArray[i]).children()[0]).text());
                            $(newRow).append(newCol);

                            newCol = document.createElement('div');
                            $(newCol).addClass('floatright2');
                            $(newCol).text($($(ingrArray[i]).children()[1]).val() + ' гр');
                            $(newRow).append(newCol);

                            $(elem).append(newRow);
                        }

                        var del = document.createElement('div');
                        $(del).addClass('delete');
                        $(del).text("Удалить");
                        $(del).attr('del_id', recipe_id);
                        $(del).click(deleteHandler);

                        $(elem).append(del);
                        //Скрытие сообщения нет рецептов
                        $("#message").text("");
                        $("#recipe_table").append(elem);

                        //Добавить этот рецепт в статистику
                        var newDiv = $(document.createElement('div'));
                        newDiv.attr('recipe_id', recipe_id);
                        newDiv.attr('proteins', newRecipe.proteins);
                        newDiv.attr('lipids', newRecipe.lipids);
                        newDiv.attr('carbs', newRecipe.carbs);
                        newDiv.attr('calories', newRecipe.calories);
                        newDiv.addClass('visible');
                        newDiv.addClass('clearfix');
                        var textDiv = $(document.createElement('div'));
                        textDiv.text(newRecipe.recipe_name);
                        textDiv.addClass('fll');
                        textDiv.addClass('textdivstat');
                        newDiv.append(textDiv);

                        var newInput = $(document.createElement('input'));
                        newInput.attr('type', 'text');
                        newInput.addClass('flr');
                        newInput.addClass('statinput');
                        newInput.addClass('invisible');
                        newDiv.append(newInput);
                        newDiv.addClass('recipestat')
                        var adddiv = $(document.createElement('div'));
                        adddiv.addClass('adddiv');
                        adddiv.addClass('invisible');
                        adddiv.text('Добавить');
                        newDiv.append(adddiv);
                        handlerStatElems(newDiv);
                        $("#statrecipes").append(newDiv)
                    },
                    error: function () {
                        $("#addmessage").text('Ошибка сервера')
                    },
                    dataType: 'json'
                })
            }
        }
    });

    //Обработчики для продуктов и рецептов в статистике
    var handlerStatElems = function (elem) {
        $(elem).mouseenter(mouse1).mouseleave(mouse2);
        var show = function () {
            $(elem).unbind('mouseleave', mouse2);
            $(elem).children('input').show(200);
            $(elem).children('.adddiv').show(200);
            $(elem).children('.textdivstat').unbind('click', show);
            $(elem).children('.textdivstat').click(hide);
        };
        var hide = function () {
            $(elem).children('input').hide(200);
            $(elem).children('.adddiv').hide(200);
            $(elem).children('.textdivstat').unbind('click', hide);
            $(elem).children('.textdivstat').click(show);
            $(elem).mouseleave(mouse2);
        };
        $(elem).children('.textdivstat').click(show);

        //Добавление статистики
        var adddiv = $($(elem).children('.adddiv'));
        var input  = $($(elem).children('input'));
        adddiv.click(function () {
            $("#statmessage").text('');
            if (Number(input.val()) == 0 || Number(input.val()) == NaN) {
                $("#statmessage").text('Введите количество');
            } else {
                if ($(elem).attr('recipe_id')) {
                    $.ajax({
                        url: "http://localhost:3001/mainpage/addrecstat",
                        type: "POST",
                        success: function () {
                            var data = {}
                            var weight = input.val();
                            data.recipe_id = $(elem).attr('recipe_id');
                            data.recipe_name = $(elem).children('.textdivstat').text();
                            data.calories = +$(elem).attr('calories')/100 * weight;
                            data.proteins = +$(elem).attr('proteins')/100 * weight;
                            data.lipids = +$(elem).attr('lipids')/100 * weight;
                            data.carbs = +$(elem).attr('carbs')/100 * weight;
                            data.amount = weight;

                            addStatRow(data);

                            calcSum();
                        },
                        error: function () {
                            $("#statmessage").text('Ошибка сервера');
                        },
                        data: {
                            recipe_id: $(elem).attr('recipe_id'),
                            date: $("#date input").attr('date'),
                            amount: input.val()
                        }
                    });
                } else {
                    $.ajax({
                        url: "http://localhost:3001/mainpage/addfoodstat",
                        type: "POST",
                        success: function () {
                            var data = {}
                            var weight = +input.val();
                            data.food_id = $(elem).attr('food_id');
                            data.recipe_name = $(elem).children('.textdivstat').text();
                            data.calories = +$(elem).attr('calories') /100 * weight;
                            data.proteins = +$(elem).attr('proteins')/100 * weight;
                            data.lipids = +$(elem).attr('lipids')/100 * weight;
                            data.carbs = +$(elem).attr('carbs')/100 * weight;
                            data.amount = weight;

                            addStatRow(data);

                            calcSum();
                        },
                        error: function () {
                            $("#statmessage").text('Ошибка сервера');
                        },
                        data: {
                            food_id: $(elem).attr('food_id'),
                            date: $("#date input").attr('date'),
                            amount: input.val()
                        }
                    });
                }
            }
        });
    }

    var addStatRow = function(data){
        var newDivIngrRow = $(document.createElement('div'));
        if (data.food_id)
            newDivIngrRow.attr('food_id', data.food_id);
        else
            newDivIngrRow.attr('recipe_id', data.recipe_id);
        newDivIngrRow.attr('proteins', data.proteins);
        newDivIngrRow.attr('lipids', data.lipids);
        newDivIngrRow.attr('carbs', data.carbs);
        newDivIngrRow.attr('calories', data.calories);
        newDivIngrRow.attr('amount', data.amount);
        newDivIngrRow.addClass('ingrrow');
        newDivIngrRow.addClass('clearfix');
        //Столбец
        var newDiv = $(document.createElement('div'));
        newDiv.addClass('ingrcol');
        newDiv.text(data.recipe_name);
        $(newDivIngrRow).append(newDiv);
        //Столбец
        newDiv = $(document.createElement('div'));
        newDiv.addClass('ingrcolright');
        newDiv.text(data.amount);
        $(newDivIngrRow).append(newDiv);
        //Столбец
        newDiv = $(document.createElement('div'));
        newDiv.addClass('ingrcolright');
        newDiv.text(data.calories);
        $(newDivIngrRow).append(newDiv);
        //Столбец
        newDiv = $(document.createElement('div'));
        newDiv.addClass('ingrcolright');
        newDiv.text(data.carbs);
        $(newDivIngrRow).append(newDiv);
        //Столбец
        newDiv = $(document.createElement('div'));
        newDiv.addClass('ingrcolright');
        newDiv.text(data.lipids);
        $(newDivIngrRow).append(newDiv);
        //Столбец
        newDiv = $(document.createElement('div'));
        newDiv.addClass('ingrcolright');
        newDiv.text(data.proteins);
        $(newDivIngrRow).append(newDiv);

        //Удаление статистики двойным нажатием
        $(newDivIngrRow).mouseenter(mouse1).mouseleave(mouse2);
        $(newDivIngrRow).dblclick(function () {
            var elem = this;
            var data = {}
            data.date = $("#date input").attr('date');
            if ($(this).attr('recipe_id')) {
                data.recipe_id = $(this).attr('recipe_id');
                $.ajax({
                    url: "http://localhost:3001/mainpage/delrecstats",
                    type: "POST",
                    success: function () {
                        $(elem).hide(400);
                        setTimeout(function () {
                            $(elem).detach();
                            calcSum();
                        }, 400);
                    },
                    error: function () {
                        $("#statmessage").text("Ошибка сервера");
                    },
                    data: data
                });
            } else {
                data.food_id = $(this).attr('food_id');
                $.ajax({
                    url: "http://localhost:3001/mainpage/delfoodstats",
                    type: "POST",
                    success: function () {
                        $(elem).hide(400);
                        setTimeout(function () {
                            $(elem).detach();
                            calcSum();
                        }, 400);
                    },
                    error: function () {
                        $("#statmessage").text("Ошибка сервера");
                    },
                    data: data
                });
            }
        })

        $("#eatentable").append(newDivIngrRow);
    }

});

$(document).ready( function(){
    $("#exit").click(function(){
            $.ajax({
                url: "http://localhost:3001/mainpage/logout",
                type: "GET",
                success: function () {
                    location.href = "http://localhost:3001"
                }
            })
    })
});

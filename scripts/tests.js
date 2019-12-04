var intervals = {};

// Edit button

$("#tests").on('click','#edit', function(){
    var elems = $(this).parent();
    var testID = parseInt($(elems).parent().attr('id').split('-')[1]);

    location.href = "Edit_Test_Page.html?var="+testID;

});


//  I kept the localhost for you to test when done change it back to measurementtoolbackend

//  Start Button
function StartTest(test_id){
    done = 0;
    var elems = $("#test-"+test_id).children();
    var bar = $(elems).find("#barDiv").children()[0];
    var prog = $(elems).find("#prog");
    
    try{
    //  New start
    if($(bar).hasClass("loadbar"))    
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://127.0.0.1:8000/tests/begintest/",
            data : JSON.stringify({id : test_id}),
            contentType: "application/json; charset=utf-8"
        })
    //  Unpause
    else if($(bar).hasClass("paused"))
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://127.0.0.1:8000/tests/continuetest/",
            data : JSON.stringify({id : test_id}),
            contentType: "application/json; charset=utf-8"
        })

    $(elems).find("#start").attr("disabled", true);
    $(elems).find("#pause").attr("disabled", false);
    $(elems).find("#stop").attr("disabled", false);
    $(elems).find("#edit").attr("disabled", true);
    $(bar).removeClass("loadbar paused stopped").addClass("started");
    done = UpdateTest(test_id);
    intervals[test_id] = setInterval(function() {
        if(done!= 100){
            done = UpdateTest(test_id);
            $(bar).css('width', done + '%');
            $(prog).text(done * 1  + '%');
        }
        else
        {
            clearInterval(intervals[test_id]);
            intervals[test_id] = null;
        } 
    }, 1);
}
    catch(e){
        console.log(e);
    }
}

//  Pause Button
function PauseTest(test_id) {
    var elems = $("#test-"+test_id).children();
    var bar = $(elems).find("#barDiv").children()[0];
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://127.0.0.1:8000/tests/abletorun/",
        data : JSON.stringify({id : test_id}),
        contentType: "application/json; charset=utf-8"
    })
    $(elems).find("#pause").attr("disabled", true);
    $(elems).find("#start").attr("disabled", false);
    $(elems).find("#stop").attr("disabled", false);
    clearInterval(intervals[test_id]);
    $(bar).removeClass("loadbar started stopped").addClass("paused");
}

//  Stop Button
function StopTest(test_id) {
    var elems = $("#test-"+test_id).children();
    var bar = $(elems).find("#barDiv").children()[0];
    var prog = $(elems).find("#prog");
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://127.0.0.1:8000/tests/stoptest/",
        data : JSON.stringify({id : test_id}),
        contentType: "application/json; charset=utf-8"
    })

    $(elems).find("#stop").attr("disabled", true);
    $(elems).find("#start").attr("disabled", true);
    $(elems).find("#pause").attr("disabled", true);
    $(elems).find("#edit").attr("disabled", false);
    $(bar).removeClass("loadbar started paused").addClass("stopped");

    clearInterval(intervals[test_id]);
    setTimeout(function(){
    $(bar).fadeOut();
    $(bar).css('width', '0%'); 
    $(prog).text('0%'); 
    $(bar).removeClass("stopped started paused").addClass("loadbar");
    $(bar).fadeIn();
    $(elems).find("#start").attr("disabled", false);
    }, 355);

}

//  Percentage of queries completed
function UpdateTest(test_id){
    var done = 0;
    $.ajax({
        async: false,
        type: "POST",
        url: "http://127.0.0.1:8000/tests/progress/",
        data : JSON.stringify({id : test_id}),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            done = response
        }
    })
    return done;   
}

$(window).on("load",function(){
    $("#no_tests").hide();
    $("#tests").hide();
    $("#newTest").hide();
    $.ajax({
        url: "http://127.0.0.1:8000/tests/gettests/", //https://measurementtoolbackend.herokuapp.com/ http://127.0.0.1:8000/
        dataType: "json",
        success: function( response ) {
            $("#loading").hide();
            if(response.length == 0){
                $("#no_tests").show();
            }else{
                $("#tests").show();
                $("#newTest").show();
                for(i = 0;i < response.length;i++){
                    var test = response[i];
                    $("#tests").append('<div class ="test" id="test-'+test.id+'"><p>'+test.name+'</p><div class="inner"><div class="loadbar w3-round-xlarge" id="barDiv" style="width: 70%"><div id="bar" class="loadbar w3-round-xlarge" style="width:'+test.Progress+'%;height: 20px"></div></div>&emsp;<p id="prog">'+test.Progress+'%</p>&emsp;<button type="button" id="start" class="button" onclick="StartTest('+test.id+')"><i class="fa fa-play" style="font-size:17px;text-shadow:5px 4px 6px #000000;"></i></button><button type="button" id="pause" class="button" onclick="PauseTest('+test.id+')" disabled><i class="fa fa-pause" style="font-size:17px;text-shadow:5px 4px 6px #000000;"></i></button><button type="button" id="stop" class="button" onclick="StopTest('+test.id+')" disabled><i class="fa fa-stop" style="font-size:17px;text-shadow:5px 4px 6px #000000;"></i></button>&emsp;&emsp;<button type="button" id="edit" class="button"><i class="fa fa-edit" style="font-size:20px;text-shadow:5px 4px 6px #000000;"></i></button><i id="view" class="fa fa-eye" style="font-size:20px;text-shadow:5px 4px 6px #000000;"></i></div>');
                    intervals[test.id]=null;
                }
            }
            $(".tests").mCustomScrollbar({
                axis:"y",
                theme: "minimal",
                setHeight: "20%"
            });
        },        
        error:function(){
            $("#no_tests").show();
            $("#loading").hide();
        }
        
    });  
    
});
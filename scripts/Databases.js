

$(window).on('load',function(){
    $("#no_DBs").hide();
    $("#databases").hide();
    $("#newDB").hide();
    $.ajax({
        url: "https://measurementtoolbackend.herokuapp.com/databases/getdatabases/",
    
        dataType: "json",
        success: function( response ) {
            $("#loading").hide();
            if(response.length == 0){
                $("#no_DBs").show();
            }else{
                $("#databases").show();
                $("#newDB").show();
                for(i = 0;i < response.length;i++){
                    
                    var Database = response[i];
                    var name = Database.name + ""
                    $("#databases").append('<div class ="db" id="db-'+Database.id+'"><div class="inner"><p>'+Database.name+'</p><div><a id="edit" href="Edit_Database_Page.html?var='+Database.id+'"><i class="fa fa-edit" style="font-size:20px;text-shadow:5px 4px 6px #000000;"></i></a><button type="button" id="delete" class="button" onclick="deletedb('+Database.id+')"><i class="fa fa-trash" style="color:red;font-size:17px;text-shadow:5px 4px 6px #000000;"></i></button></div></div>')
                }
                $(".databases").mCustomScrollbar({
                    axis:"y",
                    theme: "minimal",
                    setHeight: "20%"
                });
            }
        },
        error:function(){
            $("#no_DBs").show();
            $("#loading").hide();
        }
    });
    
});

function deletedb(dbid){
    var a = dbid
    $.ajax({
        type: "DELETE",
        url: "https://measurementtoolbackend.herokuapp.com/databases/removedatabase/",
        data : { id : a},
        success: function(){
            location.reload();
        }
    })
}
function onload(){
    let params = new URLSearchParams(location.search);
    db_id = params.get('var');
    $.ajax({
        type: "POST",
        url: "https://measurementtoolbackend.herokuapp.com/databases/getdatabase/",
        data: JSON.stringify({id : db_id}),
        contentType: "application/json",
        success: function(response){
            document.getElementById("InputName").value = response[0].name;
            document.getElementById("InputHost").value = response[0].host;
            document.getElementById("InputPort").value = response[0].port;
            document.getElementById("InputUser").value = response[0].username;
            document.getElementById("myInput").value = response[0].password;
            type = document.getElementById(response[0].dbtype_id);
            type.checked = true;
        }
    });
}


function myFunction() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
    x.type = "text";
    } else {
    x.type = "password";
    }
 }

 function CheckedType(){
       var types = document.getElementsByClassName("radio");
       for (i=0;i<types.length;i++){
             if (types[i].checked){
                   return types[i]
             }

       }
 }
    function CheckFields(){
    
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    var a = document.getElementById("myInput");
    var b = document.getElementById("InputUser");
    var c = document.getElementById("InputPort");
    var d = document.getElementById("InputHost");
    var e = document.getElementById("InputName");
    var IpAddr=d.value;
   if (a.value.length == 0 || b.value.length == 0 || e.value.length == 0)
   {
         alert("Not all fields have been entered")
         
   }
   else if(isNaN(c.value)) 
   {
         alert("Port Field is not a valid number")
   }
   else if(!IpAddr.match(ipformat))
   {
        alert("Host is not a valid IP Address")
   }
   else
   {
    let params = new URLSearchParams(location.search);
    db_id = params.get('var');
    $.ajax({
        type: "POST",
        url: "https://measurementtoolbackend.herokuapp.com/databases/getdatabase/",
        data : JSON.stringify({"id" : db_id}),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            req = '{"id": '+ db_id+','
            if(e.value != response[0].name){
                req += '"name": "'+ e.value+'",'
            }
            if(d.value != response[0].host){
                req += '"host": "'+ d.value+'",'
            }
            if(b.value != response[0].username){
                req += '"user": "'+ b.value+'",'
            }
            if(a.value != response[0].password){
                req += '"password": "'+ a.value+'",'
            }
            if(c.value != response[0].port){
                req += '"port": '+ c.value+','
            }
            if(CheckedType().id != response[0].dbtype_id){
                console.log(response[0].dbtype_id)
                console.log(CheckedType().id)
                req += '"dbtype": "'+ CheckedType().value+'",'
            }
            
            req = req.substr(0,req.length-1)
            req += '}'
            console.log(req)
            req = JSON.parse(req)
            $.ajax({

                type: "POST",
                    url: "https://measurementtoolbackend.herokuapp.com/databases/updatedatabase/",
                    contentType: "application/json; charset=utf-8",
                    data : JSON.stringify(req),
                    success: function(){
                        var x = document.getElementById("snackbar");
                        x.className = "show";
                        setTimeout(function(){ x.className = x.className.replace("show", ""); window.location.href = 'Databases.html'; }, 1500);
                       
                    }
            })
                
    

   }

 }
      )}}
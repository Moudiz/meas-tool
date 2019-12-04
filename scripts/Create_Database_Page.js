

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
                   return types[i].value
             }

       }
 }
    function CheckFields(){
    
    var pass = document.getElementById("myInput");
    var username = document.getElementById("InputUser");
    var port = document.getElementById("InputPort");
    var host = document.getElementById("InputHost");
    var name = document.getElementById("InputName");
    var IpAddr=host.value;
   
   if(isNaN(port.value)) 
   {
         alert("Port Field is not a valid number")
   }
   else if(IpAddr.value.length == 0)
   {
        alert("Host Cannot Be Blank.")
   }
   else
   {
         
         
      $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8000/databases/adddatabase/",
            // The key needs to match your method's input parameter (case-sensitive).
            data:JSON.stringify({name:document.getElementById("InputName").value,
            user: document.getElementById("InputUser").value,
            dbtype: CheckedType(),
            password: document.getElementById("myInput").value,
            host: document.getElementById("InputHost").value,
            port:  document.getElementById("InputPort").value}),
            contentType: "application/json; charset=utf-8",
            success: function(){
                  var x = document.getElementById("snackbar");
                  x.className = "show";
                  setTimeout(function(){ x.className = x.className.replace("show", ""); window.location.href = 'Databases.html'; }, 1500);
    },
    error: function(){
          alert("Something went wrong. Make sure that all the field are correctly entered.")
    }
    

 }
      )}}

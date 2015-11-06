
$("#wrapper").on('click','#btn',function(){
      
    $.ajax({
url:'https://mbad0la.pythonanywhere.com/user',
type:'post',
dataType:'json',
data:{u:$('#username').val(),p:$('#cred').val(),inapp:0},
success:function(r){
    console.log(r['name'])
    self.port.emit("authorised",r['login']);
    },
error:function(r){console.log(r);}
});
    
    $('#username,#cred,#btn').remove();
    $('#wall').css('top',60);
        
    });

self.port.on("show", function onShow(user) {
    
    if (user.length==0) {
        $("#wrapper").empty().append('<img id="wall" src="github_icon.png"/><input type="text" id="username" placeholder="Username"/></br><input type="password" id="cred" placeholder="Password"/><div id="btn">Go!</div>');
    }
    else
    {
        $("#wrapper").empty();
        $.ajax({
        url:'https://mbad0la.pythonanywhere.com/user',
        type:'post',
        dataType:'json',
        data:{u:user,p:"",inapp:1},
        success:function(r){
            console.log(r['name']);
            self.port.emit("authorised",r['login']);
            },
        error:function(r){console.log(r);}
});
    }

  
});

$('#wrapper').on('focus','#username',function(){$(this).attr('placeholder','').css('text-align','left');});
$('#wrapper').on('focusout','#username',function(){$(this).attr('placeholder','Username').css('text-align','center');});

$('#wrapper').on('focus','#cred',function(){$(this).attr('placeholder','').css('text-align','left');});
$('#wrapper').on('focusout','#cred',function(){$(this).attr('placeholder','Password').css('text-align','center');});

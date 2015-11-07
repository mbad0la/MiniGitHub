function loadstats(user)
{
    $('#wrapper').append('<div id="statwrap"></div>');
    $.ajax({
        url:'https://mbad0la.pythonanywhere.com/follower',
        type:'post',
        dataType:'json',
        data:{u:user,p:"",inapp:1},
        success:function(r1){
            $('#statwrap').append('<div class="stats"><span class="count">'+r1.length+'</span><br>Follower</div>');
            $.ajax({
            url:'https://mbad0la.pythonanywhere.com/following',
            type:'post',
            dataType:'json',
            data:{u:user,p:"",inapp:1},
            success:function(r2){
            $('#statwrap').append('<div class="stats"><span class="count">'+r2.length+'</span><br>Following</div>');
            
            $('#statwrap').fadeIn();
            },
            error:function(r2){console.log(r2);}
            });
        },
        error:function(r1){console.log(r1);}
        
    });
    
    
}
$("#wrapper").on('click','#btn',function(){
      
    $.ajax({
url:'https://mbad0la.pythonanywhere.com/user',
type:'post',
dataType:'json',
data:{u:$('#username').val(),p:$('#cred').val(),inapp:0},
success:function(r){
    console.log(r['name'])
    $('#wrapper').append('<img id="myimg" src="'+r['avatar_url']+'"/>');
    
    $('#wrapper').find('#myimg').load(function(){
        $('#loader,#wall').fadeOut().remove();
        $(this).fadeIn();
        
        loadstats(r['login']);
        
        });
    self.port.emit("authorised",r['login']);
    },
error:function(r){console.log(r);}
});
    
    $('#username,#cred,#btn').remove();
    $('#wrapper').append('<img id="loader" src="ajax-loader.gif"/>');
    $('#wall').css('top',50);
    //$('#wall').fadeOut(710);
        
    });

self.port.on("show", function onShow(user) {
    
    if (user.length==0) {
        $("#wrapper").empty().append('<img id="wall" src="github_icon.png"/><input type="text" id="username" placeholder="Username"/></br><input type="password" id="cred" placeholder="Password"/><div id="btn">Go!</div>');
        
        //$('#wrapper').append('<img id="wall" src="github_icon.png"/><div id="statwrap"><div class="stats"><span class="count">5</span><br>Follower</div><div class="stats"><span class="count">5</span><br>Following</div></div>');
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
            $('#wrapper').append('<img id="myimg" src="'+r['avatar_url']+'"/>');
    
            $('#wrapper').find('#myimg').load(function(){
            $('#loader').remove();
            $(this).fadeIn();
            loadstats(r['login']);
            });
            self.port.emit("authorised",r['login']);
            },
        error:function(r){console.log(r);}
        
});
        $('#wrapper').append('<img id="loader" src="ajax-loader.gif"/>');
    }

  
});

$('#wrapper').on('focus','#username',function(){$(this).attr('placeholder','').css('text-align','left');});
$('#wrapper').on('focusout','#username',function(){$(this).attr('placeholder','Username').css('text-align','center');});

$('#wrapper').on('focus','#cred',function(){$(this).attr('placeholder','').css('text-align','left');});
$('#wrapper').on('focusout','#cred',function(){$(this).attr('placeholder','Password').css('text-align','center');});

$("#wrapper").on('click','#btn',function(){
      
    $.ajax({
        url:'https://mbad0la.pythonanywhere.com/user',
        type:'post',
        dataType:'json',
        data:{u:$('#username').val(),p:$('#cred').val(),inapp:0},
        success:function(r){
            $('#wrapper').append('<img id="myimg" src="'+r['avatar_url']+'"/>');
    
            $('#wrapper').find('#myimg').load(function(){
                $('#wrapper').append('<div id="statwrap"><div class="stats"><span class="count">'+r['followers']+'</span><br>Follower</div><div class="stats"><span class="count">'+r['following']+'</span><br>Following</div></div>');
                $('#loader,#wall,#footer').fadeOut().remove();
                $('#wrapper').append('<div id="addonoptions"><div class="optab"><span class="octicon octicon-bell"></span><br><span class="optag">Notifications</span></div><div class="optab"><span class="octicon octicon-flame"></span><br><span class="optag">Treding</span></div><div class="optab"><span class="octicon octicon-rss"></span><br><span class="optag">Events</span></div></div>');
                $('#myimg,#statwrap,#addonoptions').fadeIn();
            });
        self.port.emit("authorised",r['login']);
        },
        error:function(r){console.log(r);}
    });
    
    $('#username,#cred,#btn').remove();
    $('#wrapper').append('<img id="loader" src="ajax-loader.gif"/>');
    $('#wall').css('top',50);
});

self.port.on("show", function onShow(user) {
    
    if (user.length==0) {
        $("#wrapper").empty().append('<div id="wall"><span class="mega-octicon octicon-mark-github"></span></div><input type="text" id="username" placeholder="Username"/></br><input type="password" id="cred" placeholder="Password"/><div id="btn">Go!</div>');
        
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
                    $('#wrapper').append('<div id="statwrap"><div class="stats"><span class="count">'+r['followers']+'</span><br>Follower</div><div class="stats"><span class="count">'+r['following']+'</span><br>Following</div></div>');
                    $('#wrapper').append('<div id="addonoptions"><div class="optab"><span class="octicon octicon-bell"></span><br><span class="optag">Notifications</span></div><div class="optab"><span class="octicon octicon-flame"></span><br><span class="optag">Treding</span></div><div class="optab"><span class="octicon octicon-rss"></span><br><span class="optag">Events</span></div></div>');
                    $('#myimg,#statwrap,#addonoptions').fadeIn();
                });
                self.port.emit("authorised",r['login']);
            },
            error:function(r){console.log(r);}
        });
        $('#wrapper').append('<img id="loader" src="ajax-loader.gif"/>');
    }
});

$('#goTorepo').click(function(){
    self.port.emit("redirect_to_repo");
});

$('#wrapper').on('focus','#username',function(){$(this).attr('placeholder','');});
$('#wrapper').on('focusout','#username',function(){$(this).attr('placeholder','Username');});

$('#wrapper').on('focus','#cred',function(){$(this).attr('placeholder','');});
$('#wrapper').on('focusout','#cred',function(){$(this).attr('placeholder','Password');});

function abreMegaMenu(e) {
    var elem = $(e).siblings('.submenu_superior_n2');
    if($(elem).hasClass('show')) { 
        $(elem).removeClass('show');
    }
    else {
        $('#menu_superior .show').removeClass('show');
        $(elem).addClass('show');
    }
}

$(document).on('click', function(event) {
    if ($(event.target).parents('#menuprincipal').length == 0) {
      $('#menuprincipal').children().children('ul.submenu_superior_n2').removeClass('show');
    }
});

$(document).keyup(function(e) {
    if (e.keyCode === 27) $('#menuprincipal').children().children('ul.submenu_superior_n2').removeClass('show');
});

$(function(){
    var items = [];
    var i = 0;
    $.getJSON('https://res.stj.jus.br/hrestp-c-portalp/MapaDoSite.json', function(data){
        var r1 = new RegExp('https://');
        var r2 = new RegExp('http://');
        var r3 = new RegExp('/sites/portalp');
        var ambiente = '/sites/portalp';

        // monta o menu superior
        $.each(data, function(key, val){
            var string = '';
            var x = "Início";
            if(key === data.length-1) {
               string = '<li class="menu_superior_n1" id="menu_superior_inicio"><a class="link_menu_superior_n1" href="' + ambiente + val.href  + '">' + val.title + '</a></li>';
            } else {
                string = '<li class="menu_superior_n1"><a class="link_menu_superior_n1" href="javascript:;">' + val.title + '</a>';
            }
            if(val.filhos !== null) {
                string += '<ul class="submenu_superior_n2">';
                $.each(val.filhos, function(key, f) {
                    if(f.ignorarFilhosNoMenu || f.filhos === null) {
                        if(r1.test(f.href) || r2.test(f.href) || r3.test(f.href)) {
                            string += '<li class="menu_superior_n2"><a class="link_menu_superior_n2" href="' + f.href + '">' + f.title + '</a></li>';
                        } else {
                            string += '<li class="menu_superior_n2"><a class="link_menu_superior_n2" href="' + ambiente + f.href + '">' + f.title + '</a></li>';
                        }
                    } else {
                        string += '<li class="menu_superior_n2">';
                        if(r1.test(f.href) || r2.test(f.href) || r3.test(f.href)) {
                            string += '<a class="link_menu_superior_n2" href="' + f.href + '">' + f.title + '</a>';
                        } else {
                            string += '<a class="link_menu_superior_n2" href="' + ambiente + f.href + '">' + f.title + '</a>';
                        }
                        string += '<ul class="submenu_superior_n3">';
                        $.each(f.filhos, function(key, ff) {
                            if(ff.href !== null) {
                                if(r1.test(ff.href) || r2.test(ff.href) || r3.test(ff.href)) {
                                    string += '<li class="menu_superior_n3"><a class="link_menu_superior_n3" href="' + ff.href + '">' + ff.title + '</a></li>';
                                } else {
                                    string += '<li class="menu_superior_n3"><a class="link_menu_superior_n3" href="' + ambiente + ff.href + '">' + ff.title + '</a></li>';
                                }
                            } else {
                                string += '<li class="menu_superior_n3"><a class="link_menu_superior_n3" href="' + ff.targetUrl + '">' + ff.title + '</a></li>'
                            }
                        });
                        string += '</ul></li>';
                    }
                });
                string += '</li></ul>';
            } else {
                string += '</li>';
            }
            items.push(string);
        });
        $("#menuprincipal").append(items);
        verificaUrl();

        // monta o menu mobile
        $("#menu_mobile").find('#accordion').append(items);
        arrumaMobile();
        $(".menu_superior_n1 a").on("click", function(){
            var elem = $(this).parent().children("ul");
            if($(elem).hasClass('show')) { 
                $(elem).removeClass('show');
            }
            else {
                $('#menu_superior .show').removeClass('show');
                $(elem).parent().children("ul").addClass('show');
            }
        });
        $("#menumobSup .link").on("click",function(){
        	$(this).parent().children("ul").toggle();
        });
    });

    function arrumaMobile() {
        var el = document.getElementById('menu_mobile');
        var ee = $(el).find('.link_menu_superior_n1,.link_menu_superior_n2,.link_menu_superior_n3');
        $.each(ee, function(key, a) {
            $(a).addClass('link').removeClass('link_menu_superior_n1').removeClass('link_menu_superior_n2').removeClass('link_menu_superior_n3');
        });
        ee = $(el).find('.menu_superior_n1,.menu_superior_n2,.menu_superior_n3');
        $.each(ee, function(key, a) {
            $(a).removeClass('menu_superior_n1').removeClass('menu_superior_n2').removeClass('menu_superior_n3');
        });
        ee = $(el).find('.submenu_superior_n1,.submenu_superior_n2,.submenu_superior_n3');
        $.each(ee, function(key, a) {
            $(a).removeClass('submenu_superior_n1').removeClass('submenu_superior_n2').removeClass('submenu_superior_n3');
        });
        $("#menumobSup a").each(function(){
        	if ($(this).parent().children("ul").length > 0)
        		$(this).attr("href","javascript:;").addClass("mais");
        });
    }

    function verificaUrl() {
        var href = window.location.pathname;
        var target = $('#menuprincipal').find('a[href="' + href + '"]');
        $(target).closest('li.menu_superior_n1').addClass('ativo');
    }
});
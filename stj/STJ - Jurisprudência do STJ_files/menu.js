//var ambiente = '/sites/portalp';
var url = window.location.href;
var pos1 = url.indexOf('/sites/');
var pos2 = url.indexOf('/',pos1+8);
var AMBIENTE = url.substring(pos1,pos2);
//console.log(AMBIENTE);


function abreMenu(e) {
    var elem = $(e).parent().children('.dropdown');
    if($(elem).hasClass('hidden')) $(elem).removeClass('hidden').addClass('show');
    else if($(elem).hasClass('show')) $(elem).removeClass('show').addClass('hidden');
}

function mostraMenu() {
    $('.retornaAnterior').removeClass('hidden').addClass('show');
    if($('#menu_lateral').hasClass('mostra_menu')) {
        $('#menu_lateral').removeClass('mostra_menu');
    } else {
        $('#menu_lateral').addClass('mostra_menu');
    }
}

function retornaMenu() {
    var elem = $('.ativo');
    $(elem).removeClass('.ativo');
    $(elem).parent().parent().prev('a').addClass('ativo');
    $(elem).next('ul.dropdown').removeClass('show').addClass('hidden');
    $(elem).parent().parent('ul.dropdown').removeClass('show').addClass('hidden');
    $(elem).parent().parent('ul.dropdown').parent().siblings().addClass('show');
}

$(function(){
    var items = [];
    var i = 0;
    //var r1 = new RegExp('/sites/portalp');
    var r1 = new RegExp(AMBIENTE);
    var r2 = new RegExp('https://');
    var r3 = new RegExp('http://');
    //var ambiente = '/sites/portalp';
    $.getJSON('https://res.stj.jus.br/hrestp-c-portalp/MapaDoSite.json', function(data){
        data = data.slice(0, (data.length - 1));
        $.each(data, function(key, val){
            var string = '';
            i = 0;
            if(val.filhos !== null) { string += temFilhos(val); }
            else {
                if(val.href !== null) {
                    if(val.href !== null) {
                        if(r1.test(val.href) || r2.test(val.href) || r3.test(val.href)) {
                            string += '<li class="unico"><a class="menu_lateral" href="' + val.href + '">' + val.title + '</a>';
                        } else {
                            string += '<li class="unico"><a class="menu_lateral" href="' + AMBIENTE + val.href + '">' + val.title + '</a>';
                        }
                    }
                } else {
                    string += '<li class="unico"><a class="menu_lateral" href="' + val.targetUrl +'">' + val.title + '</a></li>';
                }
            }
            items.push(string);
        });
        $("#menu_lateral").append(items);
        verificaUrl();
    });

    function temFilhos(x) {
        var st = '';
        var regex = new RegExp('MenuList.aspx');
        if(regex.test(x.targetUrl) || regex.test(x.href)) {
            st += '<li class="submenu"><a class="menu_lateral" hrefOrig="'+ AMBIENTE + x.href + '" href="javascript:;" onclick="abreMenu(this)">' + x.title + '</a>';
        } else {
            if(x.href !== null) {
                if(r1.test(x.href) || r2.test(x.href) || r3.test(x.href)) {
                    st += '<li class="submenu"><a class="menu_lateral" href="' + x.href + '" onclick="abreMenu(this)">' + x.title + '</a>';
                } else {
                    st += '<li class="submenu"><a class="menu_lateral" href="' + AMBIENTE + x.href + '" onclick="abreMenu(this)">' + x.title + '</a>';
                }
            } else {
                st += '<li class="submenu"><a class="menu_lateral" href="' + x.targetUrl + '" onclick="abreMenu(this)">' + x.title + '</a>';
            }
        }
        if(x.filhos) {
            i++;
            st += '<ul class="dropdown hidden menu_n' + i + '" data-nivel="' + i + '">';
            $.each(x.filhos, function(key, val) {
                if(val.filhos !== null) {
                    st += temFilhos(val);
                } else {
                    if(val.href !== null) {
                        if(r1.test(val.href) || r2.test(val.href) || r3.test(val.href)) {
                            st += '<li class="unico"><a class="menu_lateral" href="' + val.href +'">' + val.title + '</a></li>';
                        } else {
                            st += '<li class="unico"><a class="menu_lateral" href="' + AMBIENTE + val.href +'">' + val.title + '</a></li>';
                        }
                    } else {
                        st += '<li class="unico"><a class="menu_lateral" href="' + val.targetUrl +'">' + val.title + '</a></li>';
                    }
                }
            });
            st += '</ul>';
        }
        st += '</li>';
        i = 0;
        return st;
    }

    // Tratamento específico para as urls da Jurisprudência
    function verificaUrl() {
        var href = "";
        if ($("#urlaplicacao").length > 0)
        	href = $("#urlaplicacao").val();
        if (!href || href == "")
        	href = window.location.pathname;
        
        var hrefPai = "";
        if ($("#urlaplicacaoPai").length > 0)
        	hrefPai = $("#urlaplicacaoPai").val();

        // Procura os 3 tipos de url (scon, www ou ww2)
        var href1 = href.replace("http://www.stj.jus.br/SCON/","https://scon.stj.jus.br/SCON/");
        var href2 = href.replace("https://www.stj.jus.br/SCON/","https://scon.stj.jus.br/SCON/");
//        var href3 = href.replace("/jurisprudencia/externo/","https://ww2.stj.jus.br/jurisprudencia/externo/");
        
        var raizLateral = $('#menu_lateral a[hreforig="' + AMBIENTE + '/Jurisprudencia"]').parent();
        $(raizLateral).siblings().removeClass('show').addClass('hidden');

        // Primeiro trata o menu lateral
        // Procura a url inteira primeiro
        var elem = $(raizLateral).find('a[href="' + href + '"]');

        if(!elem || elem.length==0){
            elem = $(raizLateral).find('a[href="' + href1 + '"]');
		}
        if(!elem || elem.length==0){
            elem = $(raizLateral).find('a[href="' + href2 + '"]');
		}
//        if(!elem || elem.length==0){
//            elem = $(raizLateral).find('a[href="' + href3 + '"]');
//		}
        var elemPai = $("#menuprincipal").find('a[href="' + hrefPai + '"]');

        if(elem.length > 0){ 
        	$(".menuLateral").children("ul").children("li").removeClass('show').addClass('hidden');
        	var pai = $(elem).parent(); 
        	var n = 1;
        	while ($(pai).attr("id") != "menu_lateral" && n < 6) {
        		n++;
        		$(pai).removeClass('hidden').addClass('show');
        		pai = $(pai).parent();
        	}
        	$(elem).addClass('ativo');
        }
        
        // Trata menu superior
        elem = $('#menu_superior a[href="' + href + '"], #menumobSup a[href="' + href + '"]');
        if(!elem || elem.length==0){
            elem = $('#menu_superior a[href="' + href1 + '"], #menumobSup a[href="' + href1 + '"]');
		}
        if(!elem || elem.length==0){
            elem = $('#menu_superior a[href="' + href2 + '"], #menumobSup a[href="' + href2 + '"]');
		}
//        if(!elem || elem.length==0){
//            elem = $('#menu_superior a[href="' + href3 + '"]');
//		}
        if(elem.length > 0){ 
        	$(elem).addClass('ativo');
        	
        	var pai = $(elem);
        	var v = 0;
        	while (pai != null && v < 10) {
        		if ($(pai).hasClass('accordion'))
        			break;
//        		console.log(pai);
        		$(pai).addClass('ativo');
        		pai = $(pai).parent();
        		v++;
        	}
        }
        
    	// para testar no localhost
    	
    	$("a").each(function(){
    		var url = $(this).attr("href");
//			console.log("Antes: " + url);
			if (url) {
				
//				if (url.indexOf("/SCON/") == 0 && AMBIENTE == "https:/") {
//					url = url.replace("/SCON/", "https://scon.stj.jus.br/SCON/");
//					$(this).attr("href",url);
//				}

				if (url.indexOf("/sites/portalpjavascript:;") != -1) {
					url = "javascript:;";
					$(this).attr("href",url);
//					console.log("Depois: " + url);
				}
				
				var nome = $(this).html();
				if (nome == "Revista Doutrina 30 anos do STJ") {
					url = "https://ww2.stj.jus.br/docs_internet/revista/eletronica/revista_doutrina_dos_30_anos.pdf";
					$(this).attr("href",url);
					$(this).attr("target","_blank");
//					console.log("Depois: " + url);
				} else {
					if (nome == "Revista do Tribunal Federal de Recursos") {
						url = "https://ww2.stj.jus.br/intranet/revista/eletronica/publicacao/?aplicacao=revista.tfr";
						$(this).attr("href",url);
//						console.log("Depois: " + url);
					} else {
						if (url.indexOf("/Jurisprudencia/Pesquisa/Dicas-de-Pesquisa") != -1) {
							url = "https://www.stj.jus.br/sites/portalp/Jurisprudencia/Pesquisa/Dicas-de-Pesquisa";
							$(this).attr("href",url);
						} else {
							if (url.indexOf("/sites/portalp/Jurisprudencia/Pesquisa") != -1) {
								url = "/SCON/";
								$(this).attr("href",url);
							}
						}
					}	
				}
				if (url.indexOf("/sites/portalp/") == -1) { // Não é do portal
					
//					if (AMBIENTE == "http://stj195784" || AMBIENTE == "http://webdes" || AMBIENTE == "http://webappdinst01") {
//					url = url.replace("http://www.stj.jus.br/SCON/","/SCON/");
//					url = url.replace("https://scon.stj.jus.br/SCON/","/SCON/");
//					url = url.replace("https://ww2.stj.jus.br/jurisprudencia/externo/","/jurisprudencia/externo/");

//					if (url.indexOf(AMBIENTE) != -1) {
//						url = url.replace(AMBIENTE, "https://www.stj.jus.br/sites/portalp/");
//					}
//					$(this).attr("href",url);
//					}
				} else {
					if (url.indexOf("http") == -1 && url.indexOf("javascript") <= 0 && (url.indexOf("#") == -1 || url.indexOf("#") > 0)) {// Se não tem http no endereço, não tem javascript e não começa com #
						url = "http://www.stj.jus.br" + url;
						$(this).attr("href",url);
//						console.log("Depois: " + url);
					}
				}
				if (url.indexOf(".pdf") != -1)
					$(this).attr("target","_blank");
				
				
				if ($(this).hasClass("link_menu_superior_n1")) {
//					console.log($(this).html());
					if ($(this).html() == "Início")
						$(this).parent().css("display","none");
				}
				
// corrige links - temporario
				if (url.indexOf("&thesaurus=null") != -1) {
					url = url.replace("&thesaurus=null", "&thesaurus=");
					$(this).attr("href",url);
				}
				
			}
    	});
    	
		$("a.btn-redondo-link").each(function(){
			var endereco = $(this).attr("href");
			if (endereco.indexOf("/jurisprudencia/") == 0) {// inicia com
				$(this).attr("href", "https://ww2.stj.jus.br" + endereco);
			}
		});

		// constroi a rota
    	var inicio = "<a href=\"https://www.stj.jus.br/\" id=\"idInicio\">In&iacute;cio</a>";
		$("#idBreadcrumb").append(inicio);
    	if(elem.length > 0){ 
        	var pai = $(elem).parent("li"); 
        	var n = 1;
        	var fim = false;
        	while (!fim) {
        		if ($(pai).children("a").html()) {
					//console.log($(pai).children("a").attr("href"));
					var x;
					if ("javascript:;" == ($(pai).children("a").attr("href")))
						x = "<span>" + $(pai).children("a").html() + "</span>";
					else
        				x = "<a href=\"" + $(pai).children("a").attr("href") + "\">" + $(pai).children("a").html() + "</a>";
        			$("#idInicio").after(x);
        		}
        		n++;
        		pai = $(pai).parent();
        		fim = ($(pai).attr("id")=="menu_superior" || n >= 6);
        	}
        } else {
			var titulo = $("#idTituloArea").html();
     		var y = "<a href=\"" + href + "\">" + titulo + "</a>";
       		$("#idInicio").after(y);

			if (elemPai.length > 0){ 
        		var pai = $(elemPai).parent("li"); 
        		var n = 1;
        		var fim = false;
        		while (!fim) {
        			if ($(pai).children("a").html()) {
        				var x = "<a href=\"" + $(pai).children("a").attr("href") + "\">" + $(pai).children("a").html() + "</a>";
        				$("#idInicio").after(x);
        			}
        			n++;
        			pai = $(pai).parent();
        			fim = ($(pai).attr("id")=="menu_superior" || n >= 6);
        		}
			}
		}
	}
});

function quandoRespondeSeEhHumano() {
	document.getElementById("idCaptchaSelecionado").value = "TRUE";
}

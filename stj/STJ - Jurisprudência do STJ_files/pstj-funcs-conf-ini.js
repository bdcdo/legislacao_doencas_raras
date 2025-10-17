

function confIniFuncsPortalOrig(){
	confIniHome(); 
	confIniMenu();
	confIniMobile();
	confIniOutros();
}

function confIniForTemplate(){
	confIniMenu(); 
	confIniMobile();
}
//***************************************************************************************
//https://www.stj.jus.br/static_files/STJ/Recursos/portal2016/js/functionsJQueryHome.js
function confIniHome() {
	// ajusta estilos das linhas de portlets
	//	colorMe();

	// Marca primeiro aviso
	$("#aviso_0").addClass("ativo");

	// Transforma menu principal em menu reduzido ao rolar a tela
	$(window).scroll(function () {
		var isMobile = $("#divmenuprincipalmobile").is(":visible");
		if (isMobile)
			return;

		if ($(this).scrollTop() > 60) {
			if ($(".cabecalho_menor").length > 0)
				return;

			$(".cabecalho").hide();
			$(".blocoPoderJudiciario").hide();
			$(".blocoRedesSociais").hide();
			$(".cabecalho").addClass("cabecalho_menor").removeClass("cabecalho");
			$(".cabecalho_link").addClass("cabecalho_link_menor").removeClass("cabecalho_link");
			$(".sample-search-toolbar").hide();
			$(".sample-search-toolbar").addClass("sample-search-toolbar-menor").removeClass("sample-search-toolbar");
			$(".cabecalho_menor").fadeIn();
		} else {
			if ($(".cabecalho").length > 0)
				return;

			$(".cabecalho_menor").hide();
			$(".blocoPoderJudiciario").show();
			$(".blocoRedesSociais").show();
			$(".cabecalho_menor").removeClass("cabecalho_menor").addClass("cabecalho");
			$(".cabecalho_link_menor").removeClass("cabecalho_link_menor").addClass("cabecalho_link");
			$(".sample-search-toolbar-menor").addClass("sample-search-toolbar").removeClass("sample-search-toolbar-menor");
			$(".sample-search-toolbar").show();
			$(".cabecalho").fadeIn();
		}
	});

	// Mostra/esconde aviso na home
	$(".aviso_titulo").click(function () {
		var ativo = $(this).next().is(":visible");
		if (!ativo) {
			$(".aviso_titulo").next().hide();
			$(".aviso_titulo").parent().removeClass("ativo");
			$(this).next().slideDown();
			$(this).parent().addClass("ativo");
		} else {
			$(this).next().slideUp();
			$(this).parent().removeClass("ativo");
		}
	});

	// Mostra tooltip das redes social e órgãos do judiciário 
	$('.blocoRedesSociais a, .blocoPoderJudiciario a').hover(
		function () {
			var title = $(this).attr('title');
			$(this).data('tipText', title).removeAttr(
				'title');
			$('<p class="tooltip"></p>').text(title)
				.appendTo('class_engine').fadeIn('slow');
		}, function () {
			$(this).attr('title', $(this).data('tipText'));
			$('.tooltip').remove();
		}).mousemove(function (e) {
			var mousex = e.pageX + 20; // Get X coordinates
			var mousey = e.pageY + 10; // Get Y coordinates
			$('.tooltip').css({
				top: mousey,
				left: mousex
			})
		});

	// Mostra a caixa de pesquisa
	$(".lupaTopo").click(function () {
		$(".sample-search-toolbar-menor").toggle();
	});

	// Muda a cor de fundo de algumas áreas da home 
	function colorMe() {
		/*		$(".vgn-acpd-portlet").parent().each(
						function(index) {
							if (index == 1) {
								$(this).css("overflow", "auto");
								$(this).css("background-color",
										"#F6F8FA");
							}
							if ((index == 2) || (index == 3)) {
								$(this).css("overflow", "auto");
								$(this).css("background-color",
										"#FFFFFF");
								$(this).css("margin-top", "-10px");
								$(this).css("border-top", "10px solid #FFFFFF");
							}
						});*/
	}

	// Mostra a caixa de libras
	$(".obj_acesso_btn_libras").click(function () {
		$("#libras").css("display", "block");
	});

	$(".buttom_fechar").click(function () {
		$("#libras").css("display", "none");
	});

	$(".bannerTopo").click(function () {
		location.href = "https://www.stj.jus.br/sites/portalp/Paginas/STJ-no-Combate-ao-Coronavirus.aspx";
	});
}
//***************************************************************************************
//https://www.stj.jus.br/static_files/STJ/Recursos/portal2016/js/functionsJQueryMenu.js
function confIniMenu() {

	
	resize();
//	$("<span class='seta-menu-ativo'></span>").appendTo(
//		".link_menu_superior_n1");
	$(".link_menu_superior_n1").attr("href", "javascript:;");
	$(".menu_lateral_n1,.menu_lateral_n1_ativo").click(
		function () {
			var ativo = ($(this).children("ul")
				.is(":visible"));
			if (!ativo) {
				$(".menu_lateral_n1_ativo").children("ul")
					.hide();
				$(".menu_lateral_n1_ativo").removeClass(
					"menu_lateral_n1_ativo").addClass(
						"menu_lateral_n1");
				$(this).children("ul").slideDown();
				$(this).removeClass("menu_lateral_n1")
					.addClass("menu_lateral_n1_ativo");
			} else {
				$(this).children("ul").slideUp();
				$(this)
					.removeClass(
						"menu_lateral_n1_ativo")
					.addClass("menu_lateral_n1");
			}
		});

	$(".menu_superior_n1")
		.click(
			function () {

				var ativo = ($(this)
					.hasClass("menu_superior_n1_ativo"));
				$(".menu_superior_n1_ativo").children(
					"ul").hide();
				$(".menu_superior_n1_ativo")
					.removeClass(
						"menu_superior_n1_ativo")
					.addClass("menu_superior_n1");
				if (!ativo) {
					if ($(this).children("ul")
						.children("li").length > 0) {
						$(this).children("ul").show();
						$(this)
							.removeClass(
								"menu_superior_n1")
							.addClass(
								"menu_superior_n1_ativo");
					}
				} else {
					$(this).children("ul").hide();
					$(this).removeClass(
						"menu_superior_n1_ativo")
						.addClass(
							"menu_superior_n1");
				}
			});
	$(".link_menu_superior_n1").focusin(function () {
		$(this).addClass("link_menu_superior_n1_hover");
	});
	$(".link_menu_superior_n1").focusout(function () {
		$(this).removeClass("link_menu_superior_n1_hover");
	});

	// Voltar ao topo a partir do footer
	$(".setaTopo").click(function () {
		$("html,body").animate({
			scrollTop: $('#voltarTopo').offset().top
		}, 800);
	});

	// Voltar ao topo a partir de âncoras no conteúdo
	$(".setaTopoContent").click(function () {
		$("html,body").animate({
			scrollTop: $($.attr(this, 'href')).offset().top
		}, 600);
		return false;
	});

	// Navegação dentro conteúdo a partir de âncoras
	$(".setaLink").click(function () {
		$('html, body').stop().animate({
			scrollTop: $($.attr(this, 'href')).offset().top
		}, 1000);
		return false;
	});

	$(".lupaTopo").click(function () {
		$(".sample-search-toolbar").toggle();
	});

	$(".sample-search-toolbar input")
		.keyup(
			function (event) {
				var str = "";
				str += $(this).val();
				if (str != "")
					$(".tipo-pesquisa").show();
				else
					$(".tipo-pesquisa").hide();
				$("label.div-sugestoes-pesquisa-jur")
					.text(
						"buscar '"
						+ str
						+ "' em Jurisprudência");
				$("label.div-sugestoes-pesquisa-proc")
					.text(
						"buscar '"
						+ str
						+ "' em Processos");
				$("label.div-sugestoes-pesquisa-not")
					.text(
						"buscar '"
						+ str
						+ "' em Notícias");
				$("label.div-sugestoes-pesquisa-portal")
					.text(
						"buscar '"
						+ str
						+ "' em todo o Portal");
				$("#livre").attr("value", str);
				$("#termo").attr("value", str);
				$("#parametro").attr("value", str);
			});
	$(".div-sugestoes-pesquisa-jur").click(function () {
		$("#frmPesquisaJur").submit();
	});
	$(".div-sugestoes-pesquisa-proc").click(function () {
		$("#frmPesquisaProc").submit();
	});
	$(".tipo-pesquisa").click(function () {
		$(".sample-search-toolbar").hide();
	});
	$(window).scroll(
		function () {
			var isMobile = $("#divmenuprincipalmobile").is(
				":visible");
			if (isMobile)
				return;
			if ($(this).scrollTop() > 56) {
				$(".setaTopo").show();
				$(".acessibilidade").hide();
			} else {
				$(".setaTopo").hide();
				$(".acessibilidade").show();
			}
		});
	function ajustaMenu() {
		var tam = $("#menuprincipal").height();
		$(".cabecalho").css("height", tam + "px");
		$(".cab_pesq_estrutura").css("height", tam + "px");
		$(".sample-search-toolbar").css("margin-top",
			tam + "px");
	}
	$("#argkey").attr("placeholder", "Pesquisa livre");
	$("#numProcessoPesquisa").attr("placeholder",
		"Número no STJ");
	$("#campoEmail").attr("placeholder", "e-mail");
	$("#campoSenha").attr("placeholder", "senha");
	if ($(".obj_menu_tp1_div_ativo").length > 0) {
		if ($(".obj_menu_tp1_div_ativo").html() == "")
			$(".obj_menu_tp1_div_ativo").html("Veja tamb&eacute;m:");
		if ($(".obj_menu_tp1_div_ativo").next().html() != null)
			if ($(".obj_menu_tp1_div_ativo").next().html()
				.trim() == "") {
				$("#menuDireita").hide();
			}
	}
	$("#menuDireita .obj_menu_tp1_div_ativo").click(
		function () {
			var isMobile = $("#divmenuprincipalmobile").is(
				":visible");
			if (!isMobile)
				return;
			if ($(this).next().is(":visible")) {
				$(this).next().slideUp();
				$(this).parent().parent().addClass(
					"fechado");
			} else {
				$(this).next().slideDown();
				$(this).parent().parent().removeClass(
					"fechado");
			}
		});
	$(".submenu_superior_n3").each(function (index) {
		if ($(this).children("li").length == 0) {
			$(this).hide();
		}
	});





	$("#destaquesBox").appendTo("#corpoDaNoticiaBox");
	$(".container_principal, .container_principal_home").click(
		function () {
			$(".menu_superior_n1_ativo").children("ul")
				.hide();
			$(".menu_superior_n1_ativo").removeClass(
				"menu_superior_n1_ativo").addClass(
					"menu_superior_n1");
			$("#menumobile").hide();
		});
	$(document).keydown(
		function (e) {
			$(".menu_superior_n1_ativo").children("ul")
				.hide();
			$(".menu_superior_n1_ativo").removeClass(
				"menu_superior_n1_ativo").addClass(
					"menu_superior_n1");
			$("#menumobile").hide();
		});
	$(window).resize(function () {
		resize();
	});
	function resize() {
		var isMobile = $("#divmenuprincipalmobile").is(
			":visible");
		if ($(".destaquesHome").length > 0) {
			if (isMobile) {
				$(".servicos_stj").appendTo(
					".blocoNoticiasEmDestaque");
				$(".sample-search-toolbar").addClass(
					"sample-search-toolbar-menor")
					.removeClass("sample-search-toolbar");
				if ($(".cabecalho_menor").length > 0) {
					$(".blocoPoderJudiciario").show();
					$(".blocoRedesSociais").show();
					$(".cabecalho_menor").removeClass(
						"cabecalho_menor").addClass(
							"cabecalho");
					$(".cabecalho_link_menor").removeClass(
						"cabecalho_link_menor").addClass(
							"cabecalho_link");
				}
			} else
				$(".blocoPaginasSobMedida").after(
					$(".servicos_stj"));
			return;
		}
		var tam = $(window).width() - 367;
		if (tam > 820)
			tam = 820;
		$(".sample-search-toolbar").css("left", tam + "px");
		tam = $("#menuprincipal").height();
		if (tam < 56)
			tam = 56;

		//!!! ??? está bugando e colocando cabeçalho muito grande as vezes !!!
		//$(".cabecalho").css("height", tam + "px");
		$(".cabecalho").css("height", "56px");//porque não deixar fixo ???

		tam = $(window).width();
		if (!isMobile) {
			$("#menuesq").show();
			$("#menuDireita .obj_menu_tp1_div_ativo").next()
				.slideDown();
			$("#menuDireita .obj_menu_tp1_div_ativo").parent()
				.parent().removeClass("fechado");
		} else {
			$("#menuesq").hide();
			$("#menuDireita .obj_menu_tp1_div_ativo").next()
				.slideUp();
			$("#menuDireita .obj_menu_tp1_div_ativo").parent()
				.parent().addClass("fechado");
		}
	}

	// Função Accordion
	$(".div_quadro_texto").hide();
	$(".div_quadro_titulo").click(function () {
		var ativo = $(this).next().is(":visible");
		if (!ativo) {
			$(".div_quadro_titulo").next().hide();
			$(".div_quadro_titulo").removeClass("ativo");
			$(this).next().slideDown();
			$(this).addClass("ativo");
		} else {
			$(this).next().slideUp();
			$(this).removeClass("ativo");
		}
	});



	var currentUrl = window.location.href;
	var idPesquisa = "";
	var objeto = $(".label_generica");
	var objetoNext = $(".label_generica").next();
	var objetoBody = $("#voltarTopo");

	//console.log('>>>'+currentUrl.toLowerCase().indexOf("/institucional/gestao-socioambiental"));

	if (currentUrl.indexOf(encodeURI("/Projetos-Socioeducativos/Responsabilidade-socioambiental/STJ-Ambiental")) != -1 
		|| currentUrl.indexOf("/Projetos-Socioeducativos/Responsabilidade-socioambiental/STJ-Ambiental") != -1
		|| currentUrl.indexOf("/Institucional/Gestão-Socioambiental") != -1 
		|| currentUrl.indexOf(encodeURI("/Institucional/Gestão-Socioambiental")) != -1
		|| currentUrl.indexOf(encodeURI("/Institucional/Gestão-Socioambiental/Gestão-Socioambiental")) != -1 
		|| currentUrl.indexOf("/Institucional/Gestão-Socioambiental") != -1
		|| currentUrl.toLowerCase().indexOf("/institucional/gestao-socioambiental")>0 ) {
		idPesquisa = "ASOCIO"
	} else if (currentUrl.indexOf(encodeURI("/Institucional/Concursos")) != -1
		|| currentUrl.indexOf(encodeURI("/Institucional/Estágio")) != -1 
		|| currentUrl.indexOf("/Institucional/Estágio") != -1
		|| currentUrl.indexOf("/Institucional/Estagio") != -1) {
		idPesquisa = "CONPUB";
	} else if (currentUrl.indexOf(encodeURI("/Comunicação/Últimas-notícias")) != -1 
		|| currentUrl.indexOf("/Comunicação/Últimas-notícias") != -1
		|| currentUrl.indexOf("/Comunicacao/Noticias") >=0 ) {
		idPesquisa = "NOTICIA";
		objeto = $(".destaques_label");
	} else if (currentUrl.indexOf(encodeURI("/Educação-e-cultura/Projetos-Socioeducativos")) != -1 
		|| currentUrl.indexOf("/Educação-e-cultura/Projetos-Socioeducativos") != -1) {
		idPesquisa = "VISTEC";
	} else if (currentUrl.indexOf(encodeURI("/Contato-e-ajuda/Fale-conosco/Ouvidoria")) != -1 
		|| currentUrl.indexOf("/Contato-e-ajuda/Fale-conosco/Ouvidoria") != -1) {
		idPesquisa = "OUV";
	}
	//					} else if (currentUrl.indexOf(encodeURI("/Educação-e-cultura/Museu")) != -1 || currentUrl.indexOf("/Educação-e-cultura/Museu") != -1) {
	//						idPesquisa = "MUSEU";
	//					} else if (currentUrl.indexOf(encodeURI("/Educação-e-cultura/Projetos-Socioeducativos/Museu???Escola")) != -1 || currentUrl.indexOf("/Educação-e-cultura/Projetos-Socioeducativos/Museu???Escola") != -1) {
	//						idPesquisa = "MUSEU";
	//----------------------------------------------------------------------------------
	//					if (idPesquisa != "") {
	//						$(
	//								"<a href='javascript:abrePesquisa(\""
	//										+ idPesquisa
	//										+ "\");' title='Avalie este serviço.' class='seloPesquisaSatisfacao' id='"
	//										+ idPesquisa + "'>&nbsp;</a>")
	//								.appendTo($(objeto));
	//					}


//	console.log('idPesquisa>'+idPesquisa);
//	if (idPesquisa != "") {
//		$("<div id='mascara_pesquisa'></div>").prependTo($(objetoBody));
//		$("<div id='dv_pesquisa_satisfacao'></div>").insertBefore($(objetoNext));
//		$("<br>").insertBefore($("#dv_pesquisa_satisfacao"));
//		pesquisa_satisfacao(idPesquisa, '#dv_pesquisa_satisfacao');
//	}
	

//####################################

	var valor = "";
	var tamanho = "";
	var contadorDeTamanho = 0;
	$(".obj_acesso_btn_restaurar").click(function () {
		while (contadorDeTamanho < 0) {
			$("p,h1,h2,h3,a").each(function () {
				tamanho = $(this).css("font-size");
				if (tamanho.indexOf("px") > 0) {
					valor = tamanho.replace("px", "");
					valor = valor * 1.1;
					$(this).css("font-size", valor + "px");
				}
			});
			contadorDeTamanho++;
		}
		while (contadorDeTamanho > 0) {
			$("p,h1,h2,h3,a").each(function () {
				tamanho = $(this).css("font-size");
				if (tamanho.indexOf("px") > 0) {
					valor = tamanho.replace("px", "");
					valor = valor / 1.1;
					$(this).css("font-size", valor + "px");
				}
			});
			contadorDeTamanho--;
		}
	});
	$(".obj_acesso_btn_amais").click(function () {
		if (contadorDeTamanho >= 5)
			return;
		$("p,h1,h2,h3,a").each(function () {
			tamanho = $(this).css("font-size");
			if (tamanho.indexOf("px") > 0) {
				valor = tamanho.replace("px", "");
				valor = valor * 1.1;
				$(this).css("font-size", valor + "px");
			}
		});
		contadorDeTamanho++;
	});
	$(".obj_acesso_btn_amenos").click(function () {
		if (contadorDeTamanho <= -5)
			return;
		$("p,h1,h2,h3,a").each(function () {
			tamanho = $(this).css("font-size");
			if (tamanho.indexOf("px") > 0) {
				valor = tamanho.replace("px", "");
				valor = valor / 1.1;
				$(this).css("font-size", valor + "px");
			}
		});
		contadorDeTamanho--;
	});
	$(".flip-wrapper .flip-container .texto").each(function () {
		if ($(this).children(".chamada").length > 0)
			$(this).html($(this).children(".chamada").html());
		else
			$(this).html("");
	});
	if ($("h1.titulo_texto").length > 0)
		document.title = "STJ - Notícias: "
			+ $("h1.titulo_texto").html();


	
	$("#frmPesquisaJur").submit(function () { 
		limpaPesquisaJur();
	});
	

	
	function pesquisa_satisfacao(txt_sigla_servico, txt_div_exibicao) {
		 
//		$.get("http://www.stj.jus.br/webstj/pesquisa/questao.asp", { desc_sigla: txt_sigla_servico }, function (data) {
//			if(!data || data.indexOf('<meta HTTP-EQUIV="refresh"')>0){
//				console.error('CONTEÚDO INVÁLIDO PARA /webstj/pesquisa/questao.asp');
//				console.error(data); 
//			}else{
//				//console.log(data);
//				$(txt_div_exibicao).html(data);
//				//console.log($(txt_div_exibicao).get(0));
//			}
//		});
		
	}
	
}


function abrePesquisa(id) {
//	window.open(
//		"http://www.stj.jus.br/webstj/pesquisa/pesquisa.asp?desc_sigla="
//		+ id, 'PS',
//		'resizable=true,scrollbars=yes,width=550,height=800');
	window.open(
			"http://svwd-iisapp-01/webstj/pesquisa/pesquisa.asp?desc_sigla="
			+ id, 'PS',
			'resizable=true,scrollbars=yes,width=550,height=800');
	
}
function limpaPesquisaJur() {
	var texto = document.getElementById("livre").value;
	document.getElementById("livre").value = removeAcentoJur(texto);
}
function removeAcentoJur(newStringComAcento) {
	var string = newStringComAcento;
	var mapaAcentosHex = {
		a: /[\xE0-\xE6]/g,
		e: /[\xE8-\xEB]/g,
		i: /[\xEC-\xEF]/g,
		o: /[\xF2-\xF6]/g,
		u: /[\xF9-\xFC]/g,
		c: /\xE7/g,
		n: /\xF1/g
	};
	for (var letra in mapaAcentosHex) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace(expressaoRegular, letra);
	}
	return string;
}
//***************************************************************************************
//http://www.stj.jus.br/static_files/STJ/Recursos/portal2016/js/functionsJQueryMobile.js
function confIniMobile() {
	// Menu ?  direita aparece fechado na interface mobile
	$("#menuDireita").addClass("fechado");

	($("#menuprincipal").clone().addClass("mobile")).appendTo("#divmenuprincipalmobile");

	$("#divmenuprincipalmobile .menu_superior_n1").addClass("menu_mobile_n1").removeClass("menu_superior_n1");
	$("#divmenuprincipalmobile .menu_superior_n2").addClass("menu_mobile_n2").removeClass("menu_superior_n2");
	$("#divmenuprincipalmobile .menu_superior_n3").addClass("menu_mobile_n3").removeClass("menu_superior_n3");

	//$("#divmenuprincipalmobile .menu_superior_n1_hover").addClass("menu_mobile_n1_hover").removeClass("menu_superior_n1_hover");
	$("#divmenuprincipalmobile .menu_superior_n2_hover").addClass("menu_mobile_n2_hover").removeClass("menu_superior_n2_hover");
	//$("#divmenuprincipalmobile .menu_superior_n3_hover").addClass("menu_mobile_n3_hover").removeClass("menu_superior_n3_hover");

	$("#divmenuprincipalmobile .link_menu_superior_n1").addClass("link_menu").removeClass("link_menu_superior_n1");
	$("#divmenuprincipalmobile .link_menu_superior_n2").addClass("link_menu").removeClass("link_menu_superior_n2");
	$("#divmenuprincipalmobile .link_menu_superior_n3").addClass("link_menu").removeClass("link_menu_superior_n3");

	$("#divmenuprincipalmobile .submenu_superior_n2").addClass("submenu_mobile_n2").removeClass("submenu_superior_n2");
	$("#divmenuprincipalmobile .submenu_superior_n3").addClass("submenu_mobile_n3").removeClass("submenu_superior_n3");

	$("#divmenuprincipalmobile .span_menu_superior_n2").addClass("span_menu_mobile_n2").removeClass("span_menu_superior_n2");
	$("#divmenuprincipalmobile .span_menu_mobile_n2").after("<span class='mais' title='Clique para mais itens.'>&nbsp;</span>");

	$("#divmenuprincipalmobile .menu_mobile_n2_hover").parent().parent().addClass("menu_mobile_n1_hover");

	// Marca itens de menu que tem subitens
	$("#divmenuprincipalmobile li").each(
		function () {
			if ($(this).children("ul").length > 0) {
				$(this).children("a.link_menu").addClass("subMenu");
			}
		});

	$("#divmenuprincipalmobile .subMenu").after("<span class='mais' title='Clique para mais itens.'>&nbsp;</span>");


	$("#menuesq").before("<div id='controlaMenuEsq'><a id='abreMenuInterno' href='javascript:;' class='setaParaBaixo'>&nbsp;</a></div>");

	$("#menuesq li").each(
		function () {
			if ($(this).children("ul").length > 0) {
				if ($(this).children("ul").children("li").length > 0) {
					$(this).addClass("subMenu");
				}
			}
		});

	$("#divmenuprincipalmobile li a, #divmenuprincipalmobile .mais").click(function () {

		var ativo = ($(this).parent().children("ul").is(":visible"));
		if (ativo) {
			$(this).parent().children("a").removeClass("linkAtivo");
			$(this).parent().children("span.span_menu_mobile_n2").removeClass("span_menu_mobile_n2_Ativo");
			$(this).parent().children("ul").slideUp();
			$(this).parent().parent().children("li").show();

			$(this).parent().parent().parent().children("a.link_menu").css("display", "block");
		}
		else {

			if ($(this).parent().children("ul").length > 0) {
				// antes de abrir o menu atual, fecha todos os outros
				$(this).parent().parent().children("li").children("ul").hide();
				// esconde os outros itens de mesmo nivel
				$(this).parent().parent().children("li").hide();
				$(this).parent().show();
				$(this).parent().children("a").addClass("linkAtivo");
				$(this).parent().children("span.span_menu_mobile_n2").addClass("span_menu_mobile_n2_Ativo");
				$(this).parent().children("ul").children("li").show();
				$(this).parent().children("ul").slideDown();

				$(this).parent().parent().parent().children("a.link_menu").hide();

				$("html,body").animate({ scrollTop: ($('#menuprincipal').offset().top - 60) }, 500);
			}
		}
	});

	$("#mostraMenu").click(function () {
		var ativo = ($("#menuprincipal.mobile").is(":visible"));
		if (ativo)
			$("#menuprincipal.mobile").slideUp();
		else
			$("#menuprincipal.mobile").slideDown();
	});

	// Posiciona o menu superior no link correspondente ?  pagina corrente
	// Ajusta classes dos itens a partir do nivel 3
	$(".menu_mobile_n3_hover").addClass("menu_mobile_n3");
	$(".menu_mobile_n3 .menu_mobile_n3 .menu_mobile_n3").addClass("menu_mobile_n5");
	$(".menu_mobile_n3 .menu_mobile_n3").addClass("menu_mobile_n4");

	$(".menu_mobile_n4").removeClass("menu_mobile_n3");
	$(".menu_mobile_n5").removeClass("menu_mobile_n3").removeClass("menu_mobile_n4");

	$(".menu_mobile_n3_hover").each(
		function () {
			if ($(this).hasClass("menu_mobile_n5"))
				$(this).addClass("menu_mobile_n5_hover").removeClass("menu_mobile_n3_hover");

			if ($(this).hasClass("menu_mobile_n4"))
				$(this).addClass("menu_mobile_n4_hover").removeClass("menu_mobile_n3_hover");
		});

	// esconde os itens nao ativos 
	if ($(".menu_mobile_n2_hover").length > 0) {
		if ($(".menu_mobile_n1_hover").length > 0)
			$(".menu_mobile_n1").hide();
		$(".menu_mobile_n1").hide();
		$(".menu_mobile_n1_hover").css("display", "block");
		$(".menu_mobile_n1_hover").children("a").addClass("linkAtivo");
		$(".menu_mobile_n1_hover").children("ul").css("display", "block");
	}

	if ($(".menu_mobile_n3_hover").length > 0) {
		$(".menu_mobile_n2").hide();
		$(".menu_mobile_n2_hover").parent().parent().children("a").hide();
		$(".menu_mobile_n2_hover").css("display", "block");
		$(".menu_mobile_n2_hover").children("a").addClass("linkAtivo");
		$(".menu_mobile_n2_hover").children("ul").css("display", "block");
	}

	if ($(".menu_mobile_n4_hover").length > 0) {
		$(".menu_mobile_n3").hide();
		$(".menu_mobile_n3_hover").parent().parent().children("a").hide();
		$(".menu_mobile_n3_hover").css("display", "block");
		$(".menu_mobile_n3_hover").children("a").addClass("linkAtivo");
		$(".menu_mobile_n3_hover").children("ul").css("display", "block");
	}

	if ($(".menu_mobile_n5_hover").length > 0) {
		$(".menu_mobile_n4").hide();
		$(".menu_mobile_n4_hover").parent().parent().children("a").hide();
		$(".menu_mobile_n4_hover").css("display", "block");
		$(".menu_mobile_n4_hover").children("a").addClass("linkAtivo");
		$(".menu_mobile_n4_hover").children("ul").css("display", "block");
	}
	// -------------------------------------

	$("#controlaMenuEsq a").click(function () {
		var ativo = ($("#menuesq").is(":visible"));
		if (ativo)
			$("#menuesq").slideUp();
		else
			$("#menuesq").slideDown();
	});
}
//***************************************************************************************
// http://www.stj.jus.br/static_files/STJ/Recursos/portal/js/functionsJQuery.js
function confIniOutros() {

	//jQuery.noConflict();//??

	//??? tratar estes erros ??? mostrar mensagem na consolle???
	try{$("#tabs").tabs();}catch(e){};
	try{$("#content > div").hide();}catch(e){};
	try{$("#content > div:eq(0)").show();}catch(e){};
	
	
	/* âncora deslizante */
	try{
		var $doc = $('html, body');
		$('.scrollSuave').click(function() {
			$doc.animate({
				scrollTop: $( $.attr(this, 'href') ).offset().top
			}, 600);
			return false;
		});	
	}catch(e){
		//???
	};

}

/*
$(document).ready(function(){ 
	$("#tabs").tabs();		
	$("#content > div").hide();
	$("#content > div:eq(0)").show();
});

*/
function opentab(num) {
	jQuery("#content > div").hide();
	jQuery("#content > div:eq(" + (num-1) + ")").fadeIn();
	jQuery("#tabs > a").removeClass("tabs_hover").addClass("tabs_links");
	jQuery("#tabs > a:eq(" + (num-1) + ")").removeClass("tabs_links").addClass("tabs_hover");
}

/*
function tab( num ) { 
  var sDiv = document.getElementById("tab"+ num);  
  sDiv.style.display == "block";

	if(num=1) {
		 var sDiv2 = document.getElementById("tab"+ num+1);
		 sDiv2.style.display == "none";
	}
	
	else {
		 var sDiv2 = document.getElementById("tab"+ num-1);
		 sDiv2.style.display == "none";
	}
  
}
*/
//***************************************************************************************
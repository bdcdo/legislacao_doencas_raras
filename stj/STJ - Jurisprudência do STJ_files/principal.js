var timerAvisos = null;
var carregouMinInativos = false;
var carregouMinAtivos = false;
var carregouOrgaosJulgadores = false;
var carregouRamosDoDireito = false;
var carregouNota = false;
var carregouSituacao = false;
var carregouUF = false;
var carregouCLAS = false;
var carregouJuizo = false;
var carregouANO = false;

jQuery(document).ready(function($) {
	
	$(".clsTipoPDF").change(function() {
		//console.log($(this).val());
		$("#integraPDF").val($(this).val());
	});

	$("#frmConsultaRef.clsFrmConsultaINF").on("submit", function(){
		//console.log("default: " + $("#isPesquisaDefault").val());
		//console.log("livre: " + $("#livreInf").val());
		
		if ("true" == $("#isPesquisaDefault").val()) {
			$("#livreInf").val("@DOCN");
			$("#pesquisaPorNumero").prop("checked", false);
		}
	});

	var dis = $(".clsCheckSelecionaTituloRR:checked").length == 0 && $(".clsCheckSelecionaMateriaRR:checked").length == 0;
	$("#btnGerarPDFRR").prop("disabled",dis);

	function getPesquisaSelecaoRR() {
		
		var pesq = "";

		$(".clsCheckSelecionaMateriaRR").each(function(){
				
				var selecionado = $(this).is(":checked");
				var pesqTitulo = "";	
				var filtraTitulo = true;
				if (selecionado) {
					
					// Verifica se todos est„o marcados ou se nenhum est· marcado, pois nesses casos o filtro ser· apenas pela matÈria
					//console.log($(this).next().find(".clsCheckSelecionaTituloRR").length);
					//console.log($(this).next().find(".clsCheckSelecionaTituloRR:checked").length);
					
					filtraTitulo = (($(this).next().find(".clsCheckSelecionaTituloRR").length != $(this).next().find(".clsCheckSelecionaTituloRR:checked").length) || $(this).next().find(".clsCheckSelecionaTituloRR:checked").length == 0)
				} 
				if (filtraTitulo) {
				$(this).next().find(".clsCheckSelecionaTituloRR").each(function(){
					
					var marcado = $(this).prop("checked");
					if (marcado) {
						console.log("titulo:" + $(this).val() + " " + $(this).prop("checked"));
						
						var item = $(this).val();
	//					$(this).next().find(".clsCodigoDoc").each(function(){
	//						if (item != "") item = item + " ou ";
	//						item = item + "@DOCN='" + $(this).val() + "'"; 
	//					});
						if (pesqTitulo == "") {
							pesqTitulo = item;
						}
						else {
							pesqTitulo += " ou " + item;
						}
					}
				});
				
				}
				
				if (selecionado) {
					console.log("materia marcada:" + $(this).val());
					var item = $(this).val();
					if (pesqTitulo != "")
						item = "(" + item + ") e (" + pesqTitulo + ")";
					
					if (pesq == "") {
						pesq = "(" + item + ")";
					}
					else {
						pesq += " ou (" + item + ")";
					}
				} else {
					if (pesqTitulo != "") {
						if (pesq == "") {
							pesq = "(" + pesqTitulo + ")";
						}
						else {
							pesq += " ou (" + pesqTitulo + ")";
						}
					}
				}
			});
		
		$("#pesquisaSelecao").val(pesq);
		$("#idpesquisaSelecao").val(pesq);
	}

	$(".clsCheckSelecionaMateriaRR,.clsCheckSelecionaTituloRR").click(function(){
		console.log($(this).val());
		getPesquisaSelecaoRR();
		dis = $(".clsCheckSelecionaTituloRR:checked").length == 0 && $(".clsCheckSelecionaMateriaRR:checked").length == 0;
		$("#btnGerarPDFRR").prop("disabled",dis);
	});
	$("#idMarcaTodos").click(function(){
		$(".clsCheckSelecionaMateriaRR,.clsCheckSelecionaTituloRR").prop("checked",$(this).prop("checked"));
		getPesquisaSelecaoRR();
		dis = $(".clsCheckSelecionaTituloRR:checked").length == 0 && $(".clsCheckSelecionaMateriaRR:checked").length == 0;
		$("#btnGerarPDFRR").prop("disabled",dis);
	});

	$(".clsCheckSelecionaMateriaRR").click(function(){
		$(this).next().find(".clsCheckSelecionaTituloRR").prop("checked",$(this).prop("checked"));
		getPesquisaSelecaoRR();
		dis = $(".clsCheckSelecionaTituloRR:checked").length == 0 && $(".clsCheckSelecionaMateriaRR:checked").length == 0;
		$("#btnGerarPDFRR").prop("disabled",dis);
	});

	$(".clsMostraEmentaRR").click(function(){
		var id = $(this).data("id");
		$(id).toggle();
	});

	$("#tpP").change(function(){
		if ($(this).is(":checked"))
			$("#listaPesquisasProntas").hide();
	});
	
	$(".carousel-banner").click(function(){
//		console.log("click no banner");
		var url = $(this).data("url");
		if (url != null && url != "")
			window.open(url);
	});
	
	$("#checkAgruparRamos").change(function(){
		if ($(this).is(":checked")) {
			$("#ordem").val("ramos");
			$("#ordemRef").val("ramos");
		}
		else {
			$("#ordem").val("");
			$("#ordemRef").val("");
		}
	});
	
	function contaSelecao() {
		var valor = $("#listaNotasSelecionadas").val();
		var conta = 0;
		var pos = valor.indexOf("@cnot");
		while (pos != -1) {
			conta = conta + 1;
			pos = valor.indexOf("@cnot", pos+1);
		}
		if (conta > 0) {
					$("#btnExportarNotasPDF").removeClass("btn-disabled");
					$("#btnExportarNotasPDF").prop("disabled",false);
					$("#btnLimparSelecao").removeClass("btn-disabled");
					$("#btnLimparSelecao").prop("disabled",false);
					$("#checkAgruparRamos").parent().removeClass("clsDisabled");
					$("#checkAgruparRamos").prop("disabled",false);
		} else {
					$("#btnExportarNotasPDF").addClass("btn-disabled");
					$("#btnExportarNotasPDF").prop("disabled",true);
					$("#btnLimparSelecao").addClass("btn-disabled");
					$("#btnLimparSelecao").prop("disabled",true);
					$("#checkSelecaoTodos").prop("checked", false);
					$("#checkAgruparRamos").parent().addClass("clsDisabled");
					$("#checkAgruparRamos").prop("disabled",true);
		}
		if (conta >= 1000) {
			$("#btnSelecionaResultset").addClass("btn-disabled");
			$("#btnSelecionaResultset").prop("disabled",true);
			$(".checkSelecionaNota").prop("disabled",true);
		} else {
			$("#btnSelecionaResultset").removeClass("btn-disabled");
			$("#btnSelecionaResultset").prop("disabled",false);			
			$(".checkSelecionaNota").prop("disabled",false);
		}
		$("#btnExportarNotasPDF span").html(conta);
	}
	
	$("#checkSelecaoTodos").change(function(){
		var valor = $(this).prop("checked");
		$(".checkSelecionaNota").prop("checked", valor);
		
		var lista = "";
		$(".checkSelecionaNota").each(function(){
			var cnot = $(this).data("cnot");
			if (lista != "")
				lista = lista + ",";
			lista = lista + cnot;
		});
		var strUrl = "/jurisprudencia/SelecionaNota?cnot="+lista+"&checked="+$(this).prop("checked");
			$.get(strUrl, function(data, status){
				$("#listaNotasSelecionadas").val(data);
				contaSelecao();
			});
		
	});

	$("#btnLimparSelecao").click(function(){
		$(".checkSelecionaNota").prop("checked", false);
			var strUrl = "/jurisprudencia/SelecionaNota?action=limpar";
			$.get(strUrl, function(data, status){
					//console.log(data + " - " + status);
					$("#listaNotasSelecionadas").val(data);
					contaSelecao();
		});
	});
	
	$("#btnSelecionaResultset").click(function(){
		$("#esperaSelecao").show();
//		$(".checkSelecionaNota").prop("checked", true);
		var pesquisa = $("#criterioDePesquisa").val();
		pesquisa = encodeURIComponent(pesquisa);
		var strUrl = "/jurisprudencia/SelecionaNota?action=resultset&pesquisa=" + pesquisa;
			$.get(strUrl, function(data, status){
					console.log(data + " - " + status);
					$("#listaNotasSelecionadas").val(data);
					contaSelecao();
					$("#esperaSelecao").hide();
					
					$(".checkSelecionaNota").each(function(){
						var valor = $(this).data("cnot");
						if (valor)
							while (valor.indexOf("0") == 0)
								valor = valor.substring(1);
						if (data.indexOf('"' + valor + '"') != -1) 
							$(this).prop("checked", true);
						else
							$(this).prop("checked", false);
					});
		});
/*		$.post("/jurisprudencia/SelecionaNota",{ 
			pesquisa: pesquisa, 
			action: "resultset"
		}, function(data, status){
//console.log(data + " - " + status);
					$("#listaNotasSelecionadas").val(data);
					contaSelecao();
					$("#esperaSelecao").hide();
					
					$(".checkSelecionaNota").each(function(){
						var valor = $(this).data("cnot");
						if (valor)
							while (valor.indexOf("0") == 0)
								valor = valor.substring(1);
						if (data.indexOf('"' + valor + '"') != -1) 
							$(this).prop("checked", true);
						else
							$(this).prop("checked", false);
					});
		});*/

	});

	$(".checkSelecionaNota").change(function(){
		var cnot = $(this).data("cnot");
		var strUrl = "/jurisprudencia/SelecionaNota?cnot="+cnot+"&checked="+$(this).prop("checked");
		$.get(strUrl, function(data, status){
				//console.log(data + " - " + status);
				$("#listaNotasSelecionadas").val(data);
				contaSelecao();
				if (data != "") {
					$("#btnLimparSelecao").show();
					$("#btnExportarNotasPDF").removeClass("btn-disabled");
					$("#btnExportarNotasPDF").prop("disabled",false);
					$("#btnLimparSelecao").removeClass("btn-disabled");
					$("#btnLimparSelecao").prop("disabled",false);
				}
				else {
					$("#btnLimparSelecao").hide();
					$("#btnExportarNotasPDF").addClass("btn-disabled");
					$("#btnExportarNotasPDF").prop("disabled",true);
					$("#btnLimparSelecao").addClass("btn-disabled");
					$("#btnLimparSelecao").prop("disabled",true);
				}
				$(".checkSelecionaNota").each(function(){
						var valor = $(this).data("cnot");
						if (valor)
							while (valor.indexOf("0") == 0)
								valor = valor.substring(1);
						if (data.indexOf('"' + valor + '"') != -1) 
							$(this).prop("checked", true);
						else
							$(this).prop("checked", false);
				});
			});
	});
	
	$("#idQtdDocsPag").change(function(){
		$("#lRef").val($(this).val());
		$("#frmConsultaRef").submit();
	});
	
	$("#btnTodos").click(function(){
		$("#livreInf").val("@cnot");
		limparTodosOsFiltros();
		$("#pesquisaPorNumero").prop("checked",false);
		$("#frmConsultaRef").submit();
	});

	$("#btnDTDP").click(function(){
		$("#ordenacaoRef").val("-@DTDP");
		$("#frmConsultaRef").submit();
	});
	
	$(".clsGetHistorico").click(function(){
		var docn = $(this).data("docn");
		var versao = $(this).data("versao");
		var seqd = $(this).data("seqd");
		
		if ($("#historicoModal" + docn + " .modal-content").html() == "") {
			var gifWait = '<div class="clsWait" style="padding: 2em; text-align: center">' +
				'<img src="/recursos/imagens/gif-carregando.gif" style="width: 2em;"/>' +
				'</div>';
			$("#historicoModal" + docn + " .modal-content").html(gifWait);
			$.get("/SCON/jt/mostraVersao.jsp?docn=" + docn + "&v=" + versao + "&seqd=" + seqd, function(data){
				$("#historicoModal" + docn + " .modal-content").html(data);
				
				$(document).on("mouseover",".mostraTituloNota a",function() {
						$(this).next(".tituloNota").show();		
				});
				$(document).on("mouseout",".mostraTituloNota a",function() {
						$(this).next(".tituloNota").hide();		
				});
			});
		}
	});
	
	$(".btn-ocultar-JT").click(function(){
		$(this).hide();
		$(".btn-mostrar-JT").show();
		$(".divEdicaoJT").hide();
	});
	$(".btn-mostrar-JT").click(function(){
		$(this).hide();
		$(".btn-ocultar-JT").show();
		$(".divEdicaoJT").show();
	});
	$("#selectAllJT").change(function(){
		var status = $(this).prop("checked");
		$(".clsCheckJT").prop("checked",status);
		
		$(".clsCheckJT").each(function(key){
			var edicao = $(this).val();
			var acao = "add";
			if (!status)
				acao = "remove";
			//console.log(edicao);
			var strUrl = "/SCON/ActionSelecionaEdicao?edicao=" + edicao + "&acao=" + acao;
			$.get(strUrl, function(data, status){
				//console.log(data + " - " + status);
				$("#edicoesSelecionadas").val(data);
				$("#listaEdicoesSelecionadas").html(data);
				$("#limparSelecaoJT").show();
			});
		});
	});
	$("#limparSelecaoJT").click(function(){
			var strUrl = "/SCON/ActionSelecionaEdicao?acao=limparSelecao";
			$.get(strUrl, function(data, status){
				//console.log(data + " - " + status);
				$("#edicoesSelecionadas").val("");
				$("#listaEdicoesSelecionadas").html("");
				$(".clsCheckJT").prop("checked",false);
				$("#selectAllJT").prop("checked",false);
				$("#limparSelecaoJT").hide();
			});
	});
	$("#selectAllJTTema").change(function(){
		$(".clsCheckJTTema").prop("checked",$(this).prop("checked"));
	});
	$("#selectAllJTLista").change(function(){
		$(".clsCheckJTLista").prop("checked",$(this).prop("checked"));
	});
	$(".clsCheckJT").change(function(){
		var edicao = $(this).val();
		var acao = "add";
		if (!$(this).is(":checked"))
			acao = "remove";
		var strUrl = "/SCON/ActionSelecionaEdicao?edicao=" + edicao + "&acao=" + acao;
			$.get(strUrl, function(data, status){
				//console.log(data + " - " + status);
				$("#edicoesSelecionadas").val(data);
				$("#listaEdicoesSelecionadas").html(data);
				$("#limparSelecaoJT").show();
		});
	});
	$(".clsSubmitPesquisaTema").click(function(){
		$(this).next().children("form").submit();
	});
	
	$("#selectMateria").change(function(){
		$("#materiaRef").val($(this).val());
		$("#frmBuscaMateria").submit();
	});

// Pesquisa Pronta
/*	var valorFiltroPPAnterior = null;
	function refreshListaPP(obj) {
		var filtro = $(obj).val();
		filtro = tiraAcentos(filtro);
		
		if (filtro != valorFiltroPPAnterior) {
			valorFiltroPPAnterior = filtro;
			
		$.getJSON("/SCON/GetListaPP?filtro=" + filtro, function(data){
			//console.log(data);
			var obj = data;
			if (obj.erro && obj.erro != null) {
				console.log(obj.erro);
			} 
			else {
				
				var formulario = "/SCON/pesquisar.jsp?b=ACOR&preConsultaPP=##DOCN##/##INDICE##";
				
				var result = "";
				if (obj.length > 0) {
				//result += '<table class="tabelaEdicoesPP" id="idTabelaRetornoPesquisaPP">';
				
				for (var i = 0 ; i < obj.length ; i++) {
					
					var f = formulario.replace("##DOCN##", obj[i].docn);
					f = f.replace("##INDICE##", obj[i].indice);
//					f = f.replace("##DOCN##", obj[i].docn);
//					f = f.replace("##INDICE##", obj[i].indice);
					
				  	//result += '<tr>';
					//result += '<td>';
					result += '<div><a href="' + f + '" target="_blank" class="linkPP">' + obj[i].materia + ' / ';
					if (obj[i].titulo != '') 
						result += obj[i].titulo + ' / ';
					result += obj[i].tema + '</a></div>';
					//result += f;
					//result += '</td>';
					//result += '</tr>';
				}
				//result += "</table>";
				var botaoFecha = '<div class="text-end"><button class="btn-close btnFecha" type="button" title="Fechar"></button></div>';
				result = '<div>' + botaoFecha + result + '</div>';
				}
				$("#listaEdicoesPP").html(result);
				$("#listaEdicoesPP").show(result);
				$( document ).on( "click", ".btnFecha, .linkPP", function(){
					$("#listaEdicoesPP").hide();
				});
			} 
		});
		
		}
	}
	*/
//	$(".mostraSugestoesPP").keyup(function(){
		//if (event.which == 32)
//			refreshListaPP(this);
		//console.log(event.which);
//	});
	
//	$("#filtroPesquisaPronta").change(function(){
//		refreshListaPP();
//	});

//	$("#filtroPesquisaPronta").focusin(function(){
//		if ($("#listaEdicoesPP").html() != "")
//			$("#listaEdicoesPP").show();
//		refreshListaPP();
//	});

// ----------------------------------
// JurisprudÍncia em Teses	
	var valorFiltroJTAnterior = null;
	
	function refreshLista() {
		var filtro = $("#filtroEdicaoJT").val();
		filtro = tiraAcentos(filtro);
		
		if (filtro != '')
			$("#btnListarTodas").show();
		else
			$("#btnListarTodas").hide();
		
		var ordem = $("#ordemLista").val();
		var agrupaTema = "";
		var agrupaMat = "";
		var agrupa = "";
		
		if ($("#agruparPorTemas").length > 0) {
		if ($("#agruparPorTemas").prop("checked")) {
			agrupaTema = $("#agruparPorTemas").val();
		}
					
		if ($("#agruparPorMateria").prop("checked")) {
			agrupaMat = $("#agruparPorMateria").val();
		}
		
		if (agrupaMat != "") {
			if (agrupaTema != "") {
				agrupa = agrupaMat + "," + agrupaTema;	
			} else {
				agrupa = agrupaMat;				
			}
		} else {
			if (agrupaTema != "") {
				agrupa = agrupaTema;				
			}			
		}
		

		//$("#agrupaTemaPDF").val(agrupa);
		//$("#agrupaTemaPDF1").val(agrupa);
		//$("#agrupaTemaPDF2").val(agrupa);
		//$("#agrupaTemaPDF3").val(agrupa);
		}
		var materia = $("#selectMateria").val();
		materia = tiraAcentos(materia);
		
		if (filtro != valorFiltroJTAnterior) {
			valorFiltroJTAnterior = filtro;
		$.getJSON("/SCON/GetListaEdicoes?filtro=" + filtro + "&ordem=" + ordem + "&materia=" + materia + "&agrupa=" + agrupa, function(data){
			//console.log(data);
			var obj = data;
			if (obj.erro && obj.erro != null) {
				console.log(obj.erro);
			} 
			else {
				var result = "";//"<ul>";
				var materiaAnterior = '';
				var temaAnterior = '';
				
				
				if (obj.length > 0) {
					
					
				result += '<table class="tabelaEdicoesJT" id="idTabelaRetornoPesquisaJT">';
				result += '<tr>' + '<th><input type="checkbox" id="selectAllJTLista" title="Clique para selecionar todas as ediÁıes."></th>' +
					'<th>EdiÁ„o</th>' +
					'<th>⁄tima vers„o</th>' +
					'</tr>';
				
				for (var i = 0 ; i < obj.length ; i++) {
					var atlz = obj[i].dataatlz;
					if (!atlz || atlz == null) 
						atlz = obj[i].datapb;

					materia = obj[i].materia;
					
					if (ordem == 'materia' || ordem == 'tema' || agrupa.indexOf('mat') != -1) {
						if (materia != materiaAnterior) {
							temaAnterior = '';
							result += '<tr><td colspan="3"><h4>' + materia + '</h4></td><tr>';
						}
					}
					
					var tema = obj[i].tema;

					if (ordem == 'tema') {
						if (tema != temaAnterior)
							result += '<tr><td colspan="3"><h4>' + tema + '</h4></td></tr>';
					}
//				  	result += '<div class="row py-1"><div class="col-9"><a href="/SCON/jt/doc.jsp?livre=\'' + obj[i].numero + '\'.tit.">' + obj[i].titulo + '</a></div>' + 
//				  	'<div class="col-3">' + atlz + '</div>' +
//				  	'</div>';
				  	
				  	result += '<tr><td><input type="checkbox" name="selecao_edicao" class="clsCheckJTLista" value="'+obj[i].numero+'"></td><td><a href="javascript:;" class="clsLinkEdicao" data-edicao="' + obj[i].numero + '"><span class="clsLabel">' + obj[i].titulo + '</span></a></td><td><span class="clsLabel">' + atlz + '</span></td></tr>';

				  	materiaAnterior = materia;
				  	temaAnterior = tema;
				}
				result += "</table>";
				}
				$("#listaEdicoesJT").html(result);
				
				$( document ).on("change", "#selectAllJTLista", function(){
					$(".clsCheckJTLista").prop("checked",$(this).prop("checked"));
				});

				if (result != "")
					$(".clsCheckOrdem").show();
				else
					$(".clsCheckOrdem").hide();
				
					$( document ).on( "click", "#idTabelaRetornoPesquisaJT .clsLinkEdicao", function(){
						var edicao = $(this).data("edicao");
						$("#edicaoSelecionada").val(edicao);
						var texto = $(this).children("span").html();
						$("#filtroEdicaoJT").val(texto);
						$("#filtroEdicaoJT").focus();
						
						//location.href = "/SCON/jt/doc.jsp?livre='" + edicao + "'.tit.";
					});

			} 
		});
		
		}
	}
	
	$(".clsIconeTeseAtualizada").click(function(){
		$(this).next().toggle();
	});
	
	refreshLista();
	$("#filtroEdicaoJT").keyup(function(){
		refreshLista();
	});
	
	$("#filtroEdicaoJT").change(function(){
		refreshLista();
	});

	$("#filtroEdicaoJT").focusin(function(){
		refreshLista();
	});
	
	$(".clsCheckOrdem input[type=radio]").change(function(){
		valorFiltroJTAnterior = null;
		$("#ordemLista").val($(this).val());
		//$("#ordemPDF").val($(this).val());
		refreshLista();
	});
/*	$(".clsCheckAgrupar input[type=checkbox]").change(function(){
		valorFiltroJTAnterior = null;
		refreshLista();
	}); */

	$(".clsCheckAgrupar input[type=checkbox]").click(function(){
		valorFiltroJTAnterior = null;
		refreshLista();
	});
	$("#idBaixarEdicaoSelecionada").click(function(){
		var edicao = $("#edicaoSelecionada").val();
		if (edicao)
		window.open("/SCON/GetPDFJT?edicao=" + edicao, "JT" + edicao);
	});
	$("#idAcessarEdicaoSelecionada").click(function(){
		var edicao = $("#edicaoSelecionada").val();
		if (edicao)
		location.href="/SCON/jt/doc.jsp?livre='" + edicao + "'.tit.";
	});

	$(".btn-download-JT").click(function(){
		var edicao = $(this).data("edicao");
		if (!edicao)
			edicao = $("#edicao").val();
		//console.log("->" + edicao);
		window.open("/SCON/GetPDFJT?edicao=" + edicao, "JT" + edicao);
		//window.open("/SCON/ExportaEdicaoJT?edicao=" + edicao, "JT" + edicao);
	});

	if ($("#listaEdicoesPorNumero").length > 0)
		$("#edicao").val($("#listaEdicoesPorNumero").val());
		
	$("#listaEdicoesPorTema").change(function(){
		$("#listaEdicoesPorNumero").val($(this).val());
		$("#edicao").val($(this).val());
	});
	$("#listaEdicoesPorNumero").change(function(){
		$("#listaEdicoesPorTema").val($(this).val());
		$("#edicao").val($(this).val());
	});
	
//	$(".clsDivAvisos .modal-content img").click(function(){
		//$(".clsDivAvisos .modal-content").toggleClass("clsExpande");
//	});

// Habilita tooltips - popper.js
/*	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  		return new bootstrap.Tooltip(tooltipTriggerEl)
	});*/

	$(".clsBtnHistorico").click(function() {
		var id = $(this).data("versao");
		var indice = $(this).data("indice");
		if (!$("#" + id).is(":visible")) {
			$(".redacaoVersao" + indice).hide();
			$("#" + id).show();
			$(this).parent().children(".clsBtnHistorico").removeClass("ativo");
			$(this).addClass("ativo");
		}
	});

	$("#fechaConfig").click(function(){
		$("#idMostrarConfiguracoesRef").toggleClass("clsMostrar");
	});
	
	$(".fechaHist").click(function(){
		$(this).parent().hide();
		$(".clsBtnHistorico").removeClass("ativo");
	});

	$("#p").change(function(){
//		console.log("change " + $(this).val());
		if ($(this).is(":checked"))
			$(this).val("true");
		else
			$(this).val("false");
	});
	
	$(".clsEmentaCompleta button, .clsResumoEmenta button").click(function() {
		$(this).parent().toggle();
		$(this).parent().next(".clsEmentaCompleta").toggle();
		$(this).parent().prev(".clsResumoEmenta").toggle();
	});
	
	$(".tipo1").change(function(){
		if ($(this).val() == null)
			$(this).val("ART");
	});
	$(".tipo2").change(function(){
		if ($(this).val() == null)
			$(this).val("PAR");
	});
	$(".tipo3").change(function(){
		if ($(this).val() == null)
			$(this).val("INC");
	});
	
	/*
	$(".has-float-label input").focusout(function() {
		var val = $(this).val();
		if (val != "")
			$(this).next("label").addClass("transparente");
		else
			$(this).next("label").removeClass("transparente");
	});
	
	$(".has-float-label input").focusin(function() {
		$(this).next("label").removeClass("transparente");
	});

	$("#divMinistrosAvancada *").focusin(function() {
//		console.log($(this));
		if (!$("#divMinistrosAvancada").hasClass("foco"))
			$("#divMinistrosAvancada").addClass("foco");
	});
		
	$("#divMinistrosAvancada *").focusout(function() {
//		console.log($(this));
		if ($("#divMinistrosAvancada").hasClass("foco"))
			$("#divMinistrosAvancada").removeClass("foco");
	});
	
	$("#divOrgaosJulgadoresAvancada *").focusin(function() {
//		console.log($(this));
		if (!$("#divOrgaosJulgadoresAvancada").hasClass("foco"))
			$("#divOrgaosJulgadoresAvancada").addClass("foco");
	});
		
	$("#divOrgaosJulgadoresAvancada *").focusout(function() {
//		console.log($(this));
		if ($("#divOrgaosJulgadoresAvancada").hasClass("foco"))
			$("#divOrgaosJulgadoresAvancada").removeClass("foco");
	});

	$("#idConjuntoCamposLegislacao .clsConjuntoCamposLegislacao *").focusin(function() {
//		console.log($(this));
		if (!$(this).parent().parent().parent(".clsConjuntoCamposLegislacao").hasClass("foco"))
			$(this).parent().parent().parent(".clsConjuntoCamposLegislacao").addClass("foco");
	});
		
	$("#idConjuntoCamposLegislacao .clsConjuntoCamposLegislacao *").focusout(function() {
//		console.log($(this));
		if ($(this).parent().parent().parent(".clsConjuntoCamposLegislacao").hasClass("foco"))
			$(this).parent().parent().parent(".clsConjuntoCamposLegislacao").removeClass("foco");
	});
*/
	var tituloArea = $("#idTituloArea").text();
	if (tituloArea) {
		if ("JurisprudÍncia do STJ" == tituloArea) 
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/hA7eeLVTtA");
		else if ("Pesquisa Pronta" == tituloArea)
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/3eE9FU7Cvs");
		else if ("Informativo de JurisprudÍncia" == tituloArea)
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/bCBnWDLmL4");
		else if ("JurisprudÍncia em Teses" == tituloArea)
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/dwvaDptF96");
		else if ("LegislaÁ„o Aplicada" == tituloArea)
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/6W7dU4DceA");
		else if ("Pesquisa Pronta" == tituloArea)
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/3eE9FU7Cvs");
		else if ("S˙mulas Anotadas" == tituloArea)
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/Emhz5h2E33");
		else if ("Repetitivos e IACs Anotados" == tituloArea)
			$(".process-botoes a.icon_avalie").attr("href","https://forms.office.com/r/73ZthGfPTH");
	}
	
	$("a").each(function(){
		var link = $(this).attr("href");
		if (link) {
//		link = link.replace("http://www.stj.jus.br/webstj/pesquisa/pesquisa.asp","http://svwd-iisapp-01/webstj/pesquisa/pesquisa.asp");
//		link = link.replace("https://www.stj.jus.br/webstj/pesquisa/pesquisa.asp","http://svwd-iisapp-01/webstj/pesquisa/pesquisa.asp");
//		link = link.replace("https://ww2.stj.jus.br/webstj/pesquisa/pesquisa.asp","http://svwd-iisapp-01/webstj/pesquisa/pesquisa.asp");
//		link = link.replace("https://processo.stj.jus.br/webstj/pesquisa/pesquisa.asp","http://svwd-iisapp-01/webstj/pesquisa/pesquisa.asp");
		
		// TODO - REMOVER ESSE SCRIPT PARA PRODUCAO
//		console.log("antes: " + link);
//		link = link.replace("https://scon.stj.jus.br/","/");
//		link = link.replace("https://processo.stj.jus.br/","/");
//		link = link.replace("https://ww2.stj.jus.br/","/");
//		link = link.replace("https://www.stj.jus.br/","/");
//		link = link.replace("http://www.stj.jus.br/","/");
		
//		console.log("depois: " + link);
		if (link.indexOf("/webstj/pesquisa/pesquisa.asp") != -1)
			$(this).attr("target","_blank");
			
		$(this).attr("href",link);
		}
	});

//	$("#idSelectFormatoHTMLEdicao").prop("checked",true);
//	$("#idSelectFormatoHTMLEdicaoE").prop("checked",true);
	
//	
	$("#btnGeraPDF").click(function() {
		
		var sumulasOld = $("#livreGeraPDF").val();
		var sumulas = $("#livreGeraPDF").val();
		var novo = "";
		var contador = 0;
		var backref = 1;
		while (sumulas != "") {
			var iPos = sumulas.indexOf("OU");
			var numero = "";
			if (iPos != -1) {
				numero = sumulas.substring(0, iPos);
				sumulas = sumulas.substring(iPos + 3);
			} else {
				numero = sumulas;
				sumulas = ""; 
			}
			if (contador == 20) {
				novo = novo + ";" + backref + " ";
				backref = backref + 1;
				contador = 0;
			}
			contador = contador + 1;
			if (novo != "")
				novo = novo + "ou ";
			novo = novo + numero;
		}  
		$("#livreGeraPDF").val(novo);
		$("#frmGeraPDF").submit();
		$("#livreGeraPDF").val(sumulasOld);
	});
	$("#btnLimpaSelecaoPDF").click(function() {
		$("#idCheckSeleciona").prop("checked",false);
		$("#listaSumulas .clsCheckSeleciona").prop("checked",false);
		$("#livreGeraPDF").val("");
		$("#documentosSelecionadosParaPDF").val("");
		$("#btnLimpaSelecaoPDF").hide();
	});
	if ($("#livreGeraPDF").length > 0) {
		var campoPesquisa = $("#livreGeraPDF").val();
		if (!campoPesquisa) campoPesquisa = "";
		if (campoPesquisa == "") {
			$("#btnLimpaSelecaoPDF").hide();
			$("#btnGeraPDF").prop('disabled', true);
		} else {
			$("#btnLimpaSelecaoPDF").show();
			$("#btnGeraPDF").prop('disabled', false);
		}
	}
	$("#idCheckSeleciona").change(function(){
		$("#listaSumulas .clsCheckSeleciona").prop("checked",$(this).prop("checked"));
		
		var campoPesquisa = $("#livreGeraPDF").val();
		if (!campoPesquisa) campoPesquisa = "";
		$("#listaSumulas .clsCheckSeleciona").each(function(){
			var num = $(this).val();
			if ($(this).prop("checked")) {
				if (campoPesquisa.indexOf("'" + num + "'") == -1) {
					if (campoPesquisa != "")
						campoPesquisa = campoPesquisa + " OU ";
					campoPesquisa = campoPesquisa + "@NUM='" + num + "'"; 
				} 
			} else {
				if (campoPesquisa.indexOf("'" + num + "'") != -1) {
					campoPesquisa = campoPesquisa.replace(" OU @NUM='" + num + "'", ""); 
					campoPesquisa = campoPesquisa.replace("@NUM='" + num + "' OU ", ""); 
					campoPesquisa = campoPesquisa.replace("@NUM='" + num + "'", ""); 
				} 
			}
//			console.log(campoPesquisa);
		});
		$("#livreGeraPDF").val(campoPesquisa);
		$("#documentosSelecionadosParaPDF").val(campoPesquisa);
		if (campoPesquisa == "") {
			$("#btnLimpaSelecaoPDF").hide();
			$("#btnGeraPDF").prop('disabled', true);
		} else {
			$("#btnLimpaSelecaoPDF").show();
			$("#btnGeraPDF").prop('disabled', false);
		}
	});
	$("#listaSumulas .clsCheckSeleciona").change(function(){
		var campoPesquisa = $("#livreGeraPDF").val();
		if (!campoPesquisa) campoPesquisa = "";
		var num = $(this).val();
		if ($(this).prop("checked")) {
			if (campoPesquisa.indexOf("'" + num + "'") == -1) {
				if (campoPesquisa != "")
					campoPesquisa = campoPesquisa + " OU ";
				campoPesquisa = campoPesquisa + "@NUM='" + num + "'"; 
			} 
		} else {
			if (campoPesquisa.indexOf("'" + num + "'") != -1) {
				campoPesquisa = campoPesquisa.replace(" OU @NUM='" + num + "'", ""); 
				campoPesquisa = campoPesquisa.replace("@NUM='" + num + "' OU ", ""); 
				campoPesquisa = campoPesquisa.replace("@NUM='" + num + "'", ""); 
			} 
		}
//		console.log(campoPesquisa);
		$("#livreGeraPDF").val(campoPesquisa);
		$("#documentosSelecionadosParaPDF").val(campoPesquisa);
		if (campoPesquisa == "") {
			$("#btnLimpaSelecaoPDF").hide();
			$("#btnGeraPDF").prop('disabled', true);
		} else {
			$("#btnLimpaSelecaoPDF").show();
			$("#btnGeraPDF").prop('disabled', false);
		}
	});
	
	
	$(".imagemMensagem img").click(function(){
		var url = $(this).data("url");
		if (url)
			window.location.href=url;
		else
			window.location.href="/SCON/";
	});
	
/*	$("button,a,span,input").each(function(){
		var title = $(this).attr("title");
		if (title) {
			$(this).append("<div class=\"textoHint\">" + title + "</div>");
			$(this).addClass("temHint");
			$(this).attr("title","").attr("original-title",title);
		}
	});
	*/


	$(window).resize(function(){
	if ($("#idColTipoPesquisa").length > 0) {
		var larguraFiller = $("#idColTipoPesquisa").width();
		larguraFiller = larguraFiller + 10;
		$("#idDivFormBotoesOperadoresAvancada .clsFill").css("width",larguraFiller+"px");
	}
	});

	if ($("#idColTipoPesquisa").length > 0) {
		var larguraFiller = $("#idColTipoPesquisa").width();
		larguraFiller = larguraFiller + 10;
		$("#idDivFormBotoesOperadoresAvancada .clsFill").css("width",larguraFiller+"px");
	}
	$(".divMensagemTutorial").mouseover(function(){
		if (!$(this).parent().children("i").hasClass("icofont-question-hover"))
			$(this).parent().children("i").addClass("icofont-question-hover");
	});
	$(".divMensagemTutorial").mouseout(function(){
		if ($(this).parent().children("i").hasClass("icofont-question-hover"))
			$(this).parent().children("i").removeClass("icofont-question-hover");
	});

	if ($("#desabilitaHint").is(":checked")) { 
		$(".hasHint").addClass("hideHint");
	}
	
/*	if ($("#pp").is(":checked")) { 
		$("#pesquisaLivre").addClass("mostraSugestoesPP");
		
		$(document).on("keyup", ".mostraSugestoesPP", function(){
			refreshListaPP($("#pesquisaLivre"));
		});
	}
*/
	$("#desabilitaHint").change(function() {
		if ($("#desabilitaHint").is(":checked")) {
			$("#desabilitaHint").val("SIM");
			$(".hasHint").addClass("hideHint");
		}
		else {
			$("#desabilitaHint").val("NAO");
			$(".hasHint").removeClass("hideHint");
		}
	});	

/*
	$("#pp").change(function() {
		if ($("#pp").is(":checked")) {
			$("#pp").val("SIM");
			$("#pesquisaLivre").addClass("mostraSugestoesPP");
			
			$(document).on("keyup", ".mostraSugestoesPP", function(){
		//if (event.which == 32)
			refreshListaPP($("#pesquisaLivre"));
		//console.log(event.which);
		});

		}
		else {
			$("#pp").val("NAO");
			$("#pesquisaLivre").removeClass("mostraSugestoesPP");
		}
	}); */	
	
	$("#listaSub").change(function(){
		var valor = $("#classe").val();
		if (valor == "")
			$("#classe").val($(this).val());
		else 
			$("#classe").val(valor + " OU " + $(this).val());
	});

	function setFiltroTema() {
		if ($("#tema1Ref").length > 0 && $("#tema2Ref").length > 0) {
			var tema1 = $("#tema1Ref").val();
			var tema2 = $("#tema2Ref").val();
			
			$("#tema1FormRef").val(tema1);
			$("#tema2FormRef").val(tema2);
			
			var tema = "";
			if ((tema1 != "") && (tema2 != "")) {
			//	tema = "@LREF >= \"" + tema1 + "\" E @LREF <= \"" + tema2 + "\"";
			
				var temaInicio = Number(tema1);
				var temaFinal = Number(tema2);
				
				//if (temaFinal - temaInicio > 100) {
					
					tema = "@LREF >= \"" + tema1 + "\" E @LREF <= \"" + tema2 + "\"";
					
				//} else {
				
				//for (var x = temaInicio ; x <= temaFinal ; x++) {
				//	if (tema != "")
				//		tema = tema + " OU ";
			//		tema = tema + "@LREF=\"" + x + "\"";
				//}
				//}
			
			} else if (tema1 != ""){
				tema = "@LREF = \"" + tema1 + "\"";
			} else if (tema2 != "") {
				tema = "@LREF = \"" + tema2 + "\"";
			}
			if ($("#filtroPorTemaRef").length > 0)
				$("#filtroPorTemaRef").val(tema);													
		}
	}
	
	function setData(tipo) {
		var data = "";
		if ($("#dtpb1" + tipo).length > 0 && $("#dtpb2" + tipo).length > 0) {
			var dtpb1 = $("#dtpb1" + tipo).val();
			var dtpb2 = $("#dtpb2" + tipo).val();
			data = "";
			if ((dtpb1 != "") && (dtpb2 != "")) {
				dtpb1 = dtpb1.substring(6,10) + dtpb1.substring(3,5) + dtpb1.substring(0,2);
				dtpb2 = dtpb2.substring(6,10) + dtpb2.substring(3,5) + dtpb2.substring(0,2);
				data = "@DTPB >= \"" + dtpb1 + "\" E @DTPB <= \"" + dtpb2 + "\"";
			} else if (dtpb1 != ""){
				dtpb1 = dtpb1.substring(6,10) + dtpb1.substring(3,5) + dtpb1.substring(0,2);
				data = "@DTPB >= \"" + dtpb1 + "\"";
			} else if (dtpb2 != "") {
				dtpb2 = dtpb2.substring(6,10) + dtpb2.substring(3,5) + dtpb2.substring(0,2);
				data = "@DTPB <= \"" + dtpb2 + "\"";
			}
			if ($("#dtpb" + tipo).length > 0)
				$("#dtpb" + tipo).val(data);													
		}
		if ($("#dtde1" + tipo).length > 0 && $("#dtde2" + tipo).length > 0) {
			var dtde1 = $("#dtde1" + tipo).val();
			var dtde2 = $("#dtde2" + tipo).val();
			data = "";
			if ((dtde1 != "") && (dtde2 != "")) {
				dtde1 = dtde1.substring(6,10) + dtde1.substring(3,5) + dtde1.substring(0,2);
				dtde2 = dtde2.substring(6,10) + dtde2.substring(3,5) + dtde2.substring(0,2);
				data = "@DTDE >= \"" + dtde1 + "\" E @DTDE <= \"" + dtde2 + "\"";
			} else if (dtde1 != ""){
				dtde1 = dtde1.substring(6,10) + dtde1.substring(3,5) + dtde1.substring(0,2);
				data = "@DTDE >= \"" + dtde1 + "\"";
			} else if (dtde2 != "") {
				dtde2 = dtde2.substring(6,10) + dtde2.substring(3,5) + dtde2.substring(0,2);
				data = "@DTDE <= \"" + dtde2 + "\"";
			}
			if ($("#dtde" + tipo).length > 0)
				$("#dtde" + tipo).val(data);
		}
		if ($("#dtdj1" + tipo).length > 0 && $("#dtdj2" + tipo).length > 0) {
			var dtdj1 = $("#dtdj1" + tipo).val();
			var dtdj2 = $("#dtdj2" + tipo).val();
			data = "";
			if ((dtdj1 != "") && (dtdj2 != "")) {
				dtdj1 = dtdj1.substring(6,10) + dtdj1.substring(3,5) + dtdj1.substring(0,2);
				dtdj2 = dtdj2.substring(6,10) + dtdj2.substring(3,5) + dtdj2.substring(0,2);
				data = "@DTDJ >= \"" + dtdj1 + "\" E @DTDJ <= \"" + dtdj2 + "\"";
			} else if (dtdj1 != ""){
				dtdj1 = dtdj1.substring(6,10) + dtdj1.substring(3,5) + dtdj1.substring(0,2);
				data = "@DTDJ >= \"" + dtdj1 + "\"";
			} else if (dtdj2 != "") {
				dtdj2 = dtdj2.substring(6,10) + dtdj2.substring(3,5) + dtdj2.substring(0,2);
				data = "@DTDJ <= \"" + dtdj2 + "\"";
			}
			if ($("#dtdj" + tipo).length > 0)
				$("#dtdj" + tipo).val(data);
		}
		var dtpb = "";
		if ($("#dtpb" + tipo).length > 0) dtpb = $("#dtpb" + tipo).val();
		
		var dtde = "";
		if ($("#dtde" + tipo).length > 0) dtde = $("#dtde" + tipo).val();
		
//		var dtdj = "";
//		if ($("#dtdj" + tipo).length > 0) dtdj = $("#dtdj" + tipo).val();

		if (dtpb != "" && dtde != "") {
			$("#data" + tipo).val("(" + dtpb + ") E (" + dtde + ")");
		} else if (dtpb != "") {
			$("#data" + tipo).val(dtpb);
		} else if (dtde != "") {
			$("#data" + tipo).val(dtde);
		} else
			$("#data" + tipo).val("");
	}

	setData("");
	$("#dtpb1,#dtpb2").change(function(){
		setData("");
	});
	$("#dtde1,#dtde2").change(function(){
		setData("");
	});
	setData("Ref");
	$("#dtpb1Ref,#dtpb2Ref").change(function(){
		setData("Ref");
	});
	$("#dtde1Ref,#dtde2Ref").change(function(){
		setData("Ref");
	});
	$("#dtdj1Ref,#dtdj2Ref").change(function(){
		setData("Ref");
	});

	var dLimite = new Date("2021-09-30");
	var dHoje = Date.now();
	if (dHoje < dLimite)
		$(".clsLinkSaibaMais").after("<div id=\"linkPesquisaCNJ\"><a href=\"https://docs.google.com/forms/d/e/1FAIpQLSdEOoo8n9rZzBk1G-nhYMhKMg4fMBZNKvlO-KpqlqvIsVvXuQ/viewform\" target=\"_blank\"><span class=\"t-amarelo\">Sua opini„o È importante!</span><span class=\"bannerCNJ\"><img src=\"/recursos/imagens/banner-pesquisa-CNJ.jpg\"></span></a></div>");

	$( " .tabs " ).tabs();
	
	$("#operadorRef").change(function(){
		var valor = $(this).val();
		valor = valor.toUpperCase();
		$("#idPesquisaAvancada #operador" + valor).prop("checked",true);
	});
	$("#idPesquisaAvancada #operadorE,#idPesquisaAvancada #operadorADJ").change(function(){
		if ($("#operadorE").prop("checked"))
			$("#operadorRef").val("e");
		if ($("#operadorADJ").prop("checked"))
			$("#operadorRef").val("adj");
	});
	$("#idPesquisaAvancada #p").change(function(){
		$("#pRef").prop("checked",$(this).prop("checked"));
	});
	$("#pRef").change(function(){
		$("#idPesquisaAvancada #p").prop("checked",$(this).prop("checked"));
	});
	$("#idPesquisaAvancada #thesaurus").change(function(){
		$("#thesaurusRef").prop("checked",$(this).prop("checked"));
	});
	$("#thesaurusRef").change(function(){
		$("#idPesquisaAvancada #thesaurus").prop("checked",$(this).prop("checked"));
	});
	
	// --------------------------------------
	
	$("#idNavegaTabRecente").click(function() {
		location.href = "/jurisprudencia/externo/informativo/?ativa=0";
	});
	
	$("#idNavegaTabOutras").click(function() {
		location.href = "/jurisprudencia/externo/informativo/?ativa=1";
	});

	$("#maisRef").click(function(event) {
		var indice = $(".clsConjuntoCamposLegislacao").length + 1;
		addLegislacao(indice);
	});
	
	$("#esperaSUM").hide();
	
	if (isIE()) { 
		$("#formRefinamento #configuracoesPesquisa").addClass("configIE");
	}
	
	var larguraOriginalRefinamento = $("#formRefinamento .formWrapper").width();
	var alturaOriginalRefinamento = $("#formRefinamento .formWrapper").height();

	$( ".clsResizablePP" ).resizable( {
		maxHeight: 96,
		maxWidth: 1200,
		minHeight: 96,
		minWidth: 280
	});

/*	$(".colunaRefinamento #idMostrarPesquisaAvancada").click(function(){
		//console.log("click aqui");
		
		if ($("#idPesquisaAvancada").is(":visible")) {
	 		$("#formRefinamento .formWrapper").height(alturaOriginalRefinamento);
			$(".formWrapper").css("width","274px");
			$(".formWrapper").removeClass("formExpandido");
		} else {
			//$(".formWrapper").css("height","585px");
			$(".formWrapper").css("height","572px");
			$(".formWrapper").css("width","1000px");
			//$(".formWrapper").css("max-height","572px");
			$(".formWrapper").addClass("formExpandido");
		}
	}); */
	
/*	$(".blocoPesquisaAvancada").css("max-height",$(window).height()-150+"px");
	$(window).resize(function() {
		$(".blocoPesquisaAvancada").css("max-height",$(window).height()-150+"px");
	});
*/
	/* nova implementacao do refinamento */

	$("#idLinkFiltrar").click(function() {
		$("#frmConsultaRef").submit();
	});
	
	$( "#botaoLimparTodosFiltros").click(function() {
		limparTodosOsFiltros();
		$("#frmConsultaRef").submit();
	});
	
	function limparTodosOsFiltros() {
		$("#livrePPRef").val("");
		$("#filtroPorNotaRef").val("");
		$("#filtroPorTemaRef").val("");
		$("#tema1FormRef").val("");
		$("#tema2FormRef").val("");
		$("#filtroRepetitivo input").prop("checked", false);
		$("#divOrgaosJulgadores input").prop("checked", false);
		$("#divAno input").prop("checked", false);
		$("#orgaoRef").val("");
		$("#ministroRef input").prop("checked", false);
		$("#divUFRef input").prop("checked", false);
		$("#ufRef").val("");
		$("#divCLASRef input").prop("checked", false);
		$("#classeRef").val("");
		$("#juizoRef").val("");
		$("#relatorRef").val("");
		$("#filtroRamoDoDireito input").prop("checked", false);
		$("#notaRef").val("");
		$("#ementaRef").val("");
		$("#processoRef").val("");
		$("#dataRef").val("");
		$("#dtdeRef").val("");
		$("#dtpbRef").val("");
		$("#dtdjRef").val("");
		$("#dtpb1Ref").val("");
		$("#dtpb2Ref").val("");
		$("#dtde1Ref").val("");
		$("#dtde2Ref").val("");
		$("#dtdj1Ref").val("");
		$("#dtdj2Ref").val("");
		$("#anoRef").val("");
		$("#divMateria input").prop("checked", false);
		$("#materiaRef").val("");
		$("#divSituacao input").prop("checked", false);
		$("#situacaoRef").val("");
	}
	
	$("#idBtnLimparAvancada,#idLimparPesquisaAvancada").click(function(){
		limparFormularioAvancado();
		$("#idLimparPesquisaAvancada").hide();
	});
	$("#idBtnLimparTodos").click(function(){
		limparTodosOsCampos();
	});
	$( "#botaoLimparFiltrosOrgaoJulgador").click(function() {
		$("#divOrgaosJulgadores input").prop("checked", false);
		$("#orgaoRef").val("");
		$("#frmConsultaRef").submit();
	});

	$( "#botaoLimparFiltrosUF").click(function() {
		$("#divUFRef input").prop("checked", false);
		$("#ufRef").val("");
		$("#frmConsultaRef").submit();
	});

	$( "#botaoAplicarFiltrosOrgaoJulgador, #aplicarFiltroRamoDoDireitoPP").click(function() {
		$("#frmConsultaRef").submit();
	});
	
	$( "#botaoLimparFiltrosMinistro").click(function() {
		$("#ministroRef input").prop("checked", false);
		$("#relatorRef").val("");
		$("#frmConsultaRef").submit();
	});

	$( "#botaoAplicarFiltrosMinistro").click(function() {
		$("#frmConsultaRef").submit();
	});
	
	$( "#botaoAplicarFiltrosRamosDoDireito").click(function() {
		$("#frmConsultaRef").submit();
	});

	$( "#botaoAplicarFiltrosUF").click(function() {
		$("#frmConsultaRef").submit();
	});

	$( "#botaoAplicarFiltrosCLAS").click(function() {
		$("#frmConsultaRef").submit();
	});

	$( "#botaoLimparFiltrosUF").click(function() {
		$("#divUFRef input").prop("checked", false);
		$("#ufRef").val("");
		$("#frmConsultaRef").submit();
	});

	$( "#botaoLimparFiltrosRamosDoDireito").click(function() {
		$("#divMateria input").prop("checked", false);
		$("#materiaRef").val("");
		$("#frmConsultaRef").submit();
	});

	$( "#botaoLimparFiltrosCLAS").click(function() {
		$("#divCLASRef input").prop("checked", false);
		$("#classeRef").val("");
		$("#frmConsultaRef").submit();
	});

	$( "#botaoAplicarFiltrosDTDE,#botaoAplicarFiltrosDTPB,#botaoAplicarFiltrosDTDJ").click(function() {
		$("#frmConsultaRef").submit();
	});
	$( "#botaoAplicarFiltrosTEMA").click(function() {
		setFiltroTema();
		$("#frmConsultaRef").submit();
	});
	$( "#botaoLimparFiltrosDTDE").click(function() {
		$("#dtdeRef").val("");
		$("#dtde1").val("");
		$("#dtde2").val("");
		setData();
		$("#frmConsultaRef").submit();
	});
	$( "#botaoLimparFiltrosDTDJ").click(function() {
		$("#dtdjRef").val("");
		$("#dtdj1").val("");
		$("#dtdj2").val("");
		setData();
		$("#frmConsultaRef").submit();
	});
	$( "#botaoLimparFiltrosDTPB").click(function() {
		$("#dtpbRef").val("");
		$("#dtpb1").val("");
		$("#dtpb2").val("");
		setData();
		$("#frmConsultaRef").submit();
	});

	$( "#divUFRef input" ).change(function() {
		var marcado = false;
		var txtFiltroPorUF = "";
		$("#divUFRef input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				var valor = $(this).val();
				//valor = "\"" + valor + "\"";
				if (txtFiltroPorUF != "")
					txtFiltroPorUF = txtFiltroPorUF + " ou ";
				txtFiltroPorUF = txtFiltroPorUF + valor;
			}
		});
		$("#ufRef").val(txtFiltroPorUF);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#botaoAplicarFiltrosUF").show();
		$("#botaoLimparFiltrosUF").show();
		$("#frmConsultaRef").submit();
	});
	
	$( "#divMateria input" ).change(function() {
		var marcado = false;
		var txtFiltroPorMateria = "";
		$("#divMateria input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				var valor = $(this).val();
				var base = $("#b").val();
				// nao acrescenta aspas no informativo
				if (base != "INFJ")
					if (valor.indexOf("'") == -1)
						valor = "'" + valor + "'";
				if (txtFiltroPorMateria != "")
					txtFiltroPorMateria = txtFiltroPorMateria + " ou ";
				txtFiltroPorMateria = txtFiltroPorMateria + "(" + valor + ")";
			}
		});
		$("#materiaRef").val(txtFiltroPorMateria);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#botaoAplicarFiltrosRamosDoDireito").show();
		$("#botaoLimparFiltrosRamosDoDireito").show();
		$("#frmConsultaRef").submit();
	});

	$( "#divCLASRef input" ).change(function() {
		var marcado = false;
		var txtFiltroPorCLAS = "";
		$("#divCLASRef input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				var valor = $(this).val();
				//valor = "\"" + valor + "\"";
				if (txtFiltroPorCLAS != "")
					txtFiltroPorCLAS = txtFiltroPorCLAS + " ou ";
				txtFiltroPorCLAS = txtFiltroPorCLAS + valor;
			}
		});
		$("#classeRef").val(txtFiltroPorCLAS);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#botaoAplicarFiltrosCLAS").show();
		$("#botaoLimparFiltrosCLAS").show();
		$("#frmConsultaRef").submit();
	});

	$( "#divJuizo input" ).change(function() {
		var marcado = false;
		var txtFiltroPorJuizo = "";
		$("#divJuizo input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				var valor = $(this).val();
				//valor = "\"" + valor + "\"";
				if (txtFiltroPorJuizo != "")
					txtFiltroPorJuizo = txtFiltroPorJuizo + ";";
				txtFiltroPorJuizo = txtFiltroPorJuizo + valor;
			}
		});
		$("#juizoRef").val(txtFiltroPorJuizo);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#botaoAplicarFiltrosJUIZO").show();
		$("#botaoLimparFiltrosJUIZO").show();
		$("#frmConsultaRef").submit();
	});

	$( "#ministroRef input" ).change(function() {
		var marcado = false;
		var txtFiltroPorMinistro = "";
		$("#ministroRef input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				var valor = $(this).val();
				var valor0 = valor;
				while (valor0.length < 4) valor0 = "0" + valor0;
				if (valor != valor0)
					valor = "(\"" + valor + "\" OU \"" + valor0 + "\")";
				else
					valor = "\"" + valor + "\"";
				if (txtFiltroPorMinistro != "")
					txtFiltroPorMinistro = txtFiltroPorMinistro + " OU ";
				txtFiltroPorMinistro = txtFiltroPorMinistro + valor;
			}
		});
		$("#relatorRef").val(txtFiltroPorMinistro);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#botaoAplicarFiltrosMinistro").show();
		$("#botaoLimparFiltrosMinistro").show();
		$("#frmConsultaRef").submit();
	});
	 
	$( "#divMinistrosAvancada input" ).change(function() {
		var marcado = false;
		var txtFiltroPorMinistro = "";
		$("#divMinistrosAvancada input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				var valor = $(this).val();
				var valor0 = valor;
				while (valor0.length < 4) valor0 = "0" + valor0;
				if (valor != valor0)
					valor = "(\"" + valor + "\" OU \"" + valor0 + "\")";
				else
					valor = "\"" + valor + "\"";
				if (txtFiltroPorMinistro != "")
					txtFiltroPorMinistro = txtFiltroPorMinistro + " OU ";
				txtFiltroPorMinistro = txtFiltroPorMinistro + valor;
			}
		});
		$("#relator").val(txtFiltroPorMinistro);
	});

	$( "#divOrgaosJulgadores input" ).change(function() {
		var marcado = false;
		var txtFiltroPorMinistro = "";
		$("#divOrgaosJulgadores input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				if (txtFiltroPorMinistro != "")
					txtFiltroPorMinistro = txtFiltroPorMinistro + " OU ";
				txtFiltroPorMinistro = txtFiltroPorMinistro + "\"" + $(this).val() + "\"";
			}
		});
		$("#orgaoRef").val(txtFiltroPorMinistro);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#botaoAplicarFiltrosOrgaoJulgador").show();
		$("#botaoLimparFiltrosOrgaoJulgador").show();
		$("#frmConsultaRef").submit();
	});

	$( "#divAno input" ).change(function() {
		var marcado = false;
		var txtFiltroPorAno = "";
		$("#divAno input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				if (txtFiltroPorAno != "")
					txtFiltroPorAno = txtFiltroPorAno + " OU ";
				txtFiltroPorAno = txtFiltroPorAno + "\"" + $(this).val() + "\"";
			}
		});
		$("#anoRef").val(txtFiltroPorAno);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#frmConsultaRef").submit();
	});

	$( "#divSituacao input" ).change(function() {
		var marcado = false;
		var txtFiltroPorSituacao = "";
		$("#divSituacao input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				if (txtFiltroPorSituacao != "")
					txtFiltroPorSituacao = txtFiltroPorSituacao + " OU ";
				txtFiltroPorSituacao = txtFiltroPorSituacao + $(this).val();
			}
		});
		$("#situacaoRef").val(txtFiltroPorSituacao);
		$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
		$("#frmConsultaRef").submit();
	});

	function excluiItemSelecionado(item) {
		//console.log(item);
		var id = item;
		id = id.replace("org","acheck");
		id = id.replace("min","acheck");
		$("#" + id).trigger("click");
	}

	$( "#divOrgaosJulgadoresAvancada input" ).change(function() {
		var marcado = false;
		var txtFiltroPorOrgao = "";
		var nomeFiltroPorOrgao = "";
		$("#divOrgaosJulgadoresAvancada input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			var idOrg = "org" + $(this).val();
			while (idOrg.indexOf("\"")!=-1)
				idOrg = idOrg.replace("\"","");
			if ($(this).is(":checked")) {
				if (txtFiltroPorOrgao != "")
					txtFiltroPorOrgao = txtFiltroPorOrgao + " OU ";
				txtFiltroPorOrgao = txtFiltroPorOrgao + "\"" + $(this).val() + "\"";
				var nomeSelecionado = ($(this).parent().children("span.nome").html());
				if (nomeFiltroPorOrgao != "")
					nomeFiltroPorOrgao = nomeFiltroPorOrgao + " OU ";
				nomeFiltroPorOrgao = nomeFiltroPorOrgao + "(" + nomeSelecionado + ")";
				if ($("#" + idOrg).length == 0) {
					$("#spanNomesOrgaos").append("<span class=\"clsItemSelecionado\" id=\"org" + $(this).val() + "\">" + nomeSelecionado + "<i class=\"icofont-close clsExcluirItem\" title=\"Clique para excluir\"></i></span>");
				}
			} else {
				if ($("#" + idOrg).length > 0)
					$("#" + idOrg).remove();
			}
		});
		$("#orgao").val(txtFiltroPorOrgao);
//		$("#orgaoSelecionado").val(nomeFiltroPorOrgao);
	});
	
//	$( document ).on( "click", ".clsItemSelecionado i.clsExcluirItem", function(event) {
//		excluiItemSelecionado($(this).parent().attr("id"));
//	});

	$( "#divMinistrosAvancada input[type=checkbox]" ).change(function() {
		var marcado = false;
		var txtFiltroPorMinistro = "";
		var nomeFiltroPorMinistro = "";
		var nomeSelecionado = "";
		$("#divMinistrosAvancada input[type=checkbox]").each(function(index){
			marcado = marcado || $(this).is(":checked");
			var idMin = "min" + $(this).val();
			if ($(this).is(":checked")) {
				if (txtFiltroPorMinistro != "")
					txtFiltroPorMinistro = txtFiltroPorMinistro + " OU ";
				txtFiltroPorMinistro = txtFiltroPorMinistro + "\"" + $(this).val() + "\"";
				nomeSelecionado = ($(this).parent().children("span.nome").html());
				if (nomeFiltroPorMinistro != "")
					nomeFiltroPorMinistro = nomeFiltroPorMinistro + " OU ";
				nomeFiltroPorMinistro = nomeFiltroPorMinistro + "(" + nomeSelecionado + ")";
				if ($("#" + idMin).length == 0)
					$("#spanNomesMinistros").append("<span class=\"clsItemSelecionado\" id=\"min" + $(this).val() + "\">" + nomeSelecionado + "<i class=\"icofont-close clsExcluirItem\" title=\"Clique para excluir\"></i></span>");
			} else {
				if ($("#" + idMin).length > 0)
					$("#" + idMin).remove();
			}
		});
		$("#relatorRef").val(txtFiltroPorMinistro);
//		$("#relatorSelecionado").html(nomeFiltroPorMinistro);
		//$("#relatorSelecionado").val(nomeFiltroPorMinistro);
		
	});

	$("#divOrgaosJulgadoresAvancada .clsControlaDiv").click(function(event){
		var obj = event.target.className;
		if (obj == null || obj.indexOf("clsExcluirItem") == -1) {
			if ($("#divOrgaosJulgadoresAvancada").hasClass("aberta"))
				$("#divOrgaosJulgadoresAvancada").removeClass("aberta");
			else
				$("#divOrgaosJulgadoresAvancada").addClass("aberta");
		} else {
			if (obj != null && obj.indexOf("clsExcluirItem") != -1) {
				excluiItemSelecionado($(event.target).parent().attr("id"));
//				event.stopPropagation();
			}
		}
	});
	
	$("#divMinistrosAvancada .clsControlaDiv").click(function(event){
		var obj = event.target.className;
		if (obj == null || obj.indexOf("clsExcluirItem") == -1) {
			if ($("#divMinistrosAvancada").hasClass("aberta"))
				$("#divMinistrosAvancada").removeClass("aberta");
			else
				$("#divMinistrosAvancada").addClass("aberta");
		} else {
			if (obj != null && obj.indexOf("clsExcluirItem") != -1) {
				excluiItemSelecionado($(event.target).parent().attr("id"));
//				event.stopPropagation();
			}
		}
	});

	$(".divideInativos").next().hide();
	$(".divideInativos,.divideAtivos").click(function(){
		$(this).next().slideToggle();
		$(this).children(".listaUp").toggle();
		$(this).children(".listaDown").toggle();
	});
	
	$("#MIN-INATIVOS.divisoria").click(function(){
		var campoFiltro = $(this).attr("id");
		if (carregouMinInativos)
			$("#divInativos").toggle();
		else {
			getFiltros(campoFiltro);
			$("#divInativos").show();
		}
	});
	
	$("#MIN-ATIVOS.divisoria").click(function(){	
		$("#divAtivos").toggle();
		$(this).children(".listaUp").toggle();
		$(this).children(".listaDown").toggle();
	});
	
	$(".botaoMostraFiltro,.botaoEscondeFiltro").click(function(){
		var campoFiltro = $(this).attr("id");
		var carrega = (campoFiltro == "MIN-INATIVOS" && !carregouMinInativos) 
			|| (campoFiltro == "MIN" && !carregouMinAtivos) 
			|| (campoFiltro == "ORG" && !carregouOrgaosJulgadores)
			|| (campoFiltro == "SIT" && !carregouSituacao)
			|| (campoFiltro == "MAT" && !carregouRamosDoDireito)
			|| (campoFiltro == "JUIZO" && !carregouJuizo)
			|| (campoFiltro == "UF" && !carregouUF)
			|| (campoFiltro == "ANO" && !carregouANO); 

		if ($(this).hasClass("botaoMostraFiltro") || carrega) {
			$(this).addClass("botaoEscondeFiltro").removeClass("botaoMostraFiltro");
			if (campoFiltro != "mostraFiltroRamoDoDireitoPP" && campoFiltro != "DTDE" && campoFiltro != "DTPB") {
				getFiltros(campoFiltro);
			}
		}
		else
			$(this).removeClass("botaoEscondeFiltro").addClass("botaoMostraFiltro");
	});
	
	//https://wa.me/5561998736292
	
	$(".btn_Zap").click(function(){
		window.open("https://wa.me/5561998736292");
	});
	
	$(".btn_email").click(function(){
		window.open("/SCON/pesqmail/");
	});

	/*-------------------------------------------*/
	
	$( ".listadocumentos" ).scroll(function() {
		if ($(this).scrollTop() > 0) 
			$(this).css("border-top","1px solid #DDDFE1");
		else
			$(this).css("border-top","none");
	});
	
	var limiteScroll = 160;
	$(window).scroll(function() {
//		console.log("scroll: " + $(this).scrollTop());
//		console.log("window: " + $(window).height());
//		console.log("document: " + $(document).height());
	
		var d = 0;
		if ($(this).scrollTop() > limiteScroll) {
			var hw = $(window).height();
			var dh = $(document).height();
			d = dh - hw;
		//console.log("diferenÁa: " + d);
		}
		if ($(this).scrollTop() > limiteScroll && d > 288) {
			if (!$(".formularioRefinamento").hasClass("formFixo"))
				$(".formularioRefinamento").addClass("formFixo");
			if (!$(".formularioRefinamentoFiltros").hasClass("formFixoFiltros"))
				$(".formularioRefinamentoFiltros").addClass("formFixoFiltros");
			if (!$(".barraOutrasBases").hasClass("barraOutrasBasesFixo"))
				$(".barraOutrasBases").addClass("barraOutrasBasesFixo");
			if (!$(".infoPesquisa").hasClass("infoPesquisasFixo"))
				$(".infoPesquisa").addClass("infoPesquisaFixo");

			if (!$("#idLinkTopoPagina").hasClass("rodapeHome"))
				$("#idLinkTopoPagina").show();

		} else {
			if ($(".formularioRefinamento").hasClass("formFixo"))
				$(".formularioRefinamento").removeClass("formFixo");
			if ($(".formularioRefinamentoFiltros").hasClass("formFixoFiltros"))
				$(".formularioRefinamentoFiltros").removeClass("formFixoFiltros");
			if ($(".barraOutrasBases").hasClass("barraOutrasBasesFixo"))
				$(".barraOutrasBases").removeClass("barraOutrasBasesFixo");
			if ($(".infoPesquisa").hasClass("infoPesquisaFixo"))
				$(".infoPesquisa").removeClass("infoPesquisaFixo");

			$("#idLinkTopoPagina").hide();
		}
	});
	
	$(".formularioRefinamento #livreRef").focusin(function(){
		$("#corpopaginajurisprudencia").addClass("focoPesquisa");
	});
	
	$(".formularioRefinamento #fechaForm").click(function(){
		$("#corpopaginajurisprudencia").removeClass("focoPesquisa");
	});

/*	$("#formRefinamento #frmConsultaRef #livreRef").focusin(function(){
		$(this).parent().parent().css("width","1000px");
		$(this).parent().parent().addClass("formExpandido");
		if ($("#idPesquisaAvancada").length == 0 || !$("#idPesquisaAvancada").is(":visible"))
			$("#formRefinamento .formWrapper").height(alturaOriginalRefinamento);	
	}); 
	$("#fechaForm").click(function(){
		$(this).parent().removeClass("formExpandido");
		$("#formRefinamento .formWrapper").width(larguraOriginalRefinamento);
		$("#formRefinamento .formWrapper").height(alturaOriginalRefinamento);
		$("#idPesquisaAvancada").hide();
	}); 
	$("#resultadoPesquisa,.blocoPesquisaAvancada").click(function(){
		$(".formExpandido").removeClass("formExpandido");
		$("#formRefinamento .formWrapper").width(larguraOriginalRefinamento);
		$("#formRefinamento .formWrapper").height(alturaOriginalRefinamento);
		$("#idPesquisaAvancada").hide();
	}); 
	$(document).keyup(function(e) {
	     if (e.key == "Escape") { // escape key maps to keycode `27`
    	    $(".formWrapper").removeClass("formExpandido");
	 		$("#formRefinamento .formWrapper").width(larguraOriginalRefinamento);
			$("#formRefinamento .formWrapper").height(alturaOriginalRefinamento);
			$("#idPesquisaAvancada").hide();
	    }
	});
	*/
	function trocaSimbolo(obj, simbolo) {
		var valor = $("#" + obj).val();
		if (valor) {
			while (valor.indexOf(simbolo) != -1)
				valor = valor.replace(simbolo,"");
			$("#" + obj).val(valor);
		}
	}
	$("#frmConsulta").submit(function(){
		getPesquisa();
		trocaSimbolo("livre","∫");
		trocaSimbolo("livre","™");	
	});
	
	$("#frmConsultaRef").submit(function(){
		getPesquisaRef();
		trocaSimbolo("livreRef","∫");
		trocaSimbolo("livreRef","™");	
	});

	$(".clsFrmConsultaINF").submit(function(){
		
		//$("#filtroPorMinistroRef").val($("#relatorRef").val());
		
		if ($("#livreInf").val() == "")
			$("#livreInf").val("@DOCN");
	});

	$(".divListaAcordaos table tr:nth-child(even)").addClass("linhaPar");
	$(".divListaAcordaos table tr:nth-child(odd)").addClass("linhaImpar");
	
	$("#paginaajuda table tr:nth-child(even)").addClass("linhaPar");
	$("#paginaajuda table tr:nth-child(odd)").addClass("linhaImpar");

	$("#idMostrarBotoesOperadores,#idMostrarConfiguracoes,#idMostrarConfiguracoes2,#idMostrarConfiguracoesRef").click(function(){
		$(this).toggleClass("clsMostrar");
//		console.log($(this));
	});
	
/*	$(".clsAtivaPesquisaAvancada").click(function(){
		if (!$(".clsPesquisaAvancada").is(":visible")) {
			$(".clsPesquisaAvancada").show();
			$(".clsPesquisaReduzida").hide();
		
			$("#tpT").prop("checked","true");
			$(this).parent().parent().hide();
		}
	});*/
	
	$("#idMostrarPesquisaAvancada,#idEsconderPesquisaAvancada,.clsAtivaPesquisaAvancada").click(function(){
		$(".clsPesquisaAvancada").toggle();
		$(".clsPesquisaReduzida").toggle();
		
		if ($(".clsPesquisaAvancada").is(":visible")) {
			$("#tpT").prop("checked","true");
			//$(".clsPesquisaReduzida + .hint").hide();
			$(".clsPesquisaReduzida + .hint").addClass("hiddenElement");
			$(".clsPesquisaAvancada + .hint").removeClass("hiddenElement");

		} else {
			//$(".clsPesquisaAvancada + .hint").hide();
			$(".clsPesquisaAvancada + .hint").addClass("hiddenElement");
			$(".clsPesquisaReduzida + .hint").removeClass("hiddenElement");
		}

		
//		$("#idPesquisaAvancada").toggle();
//		$("#idTituloTodosOsCampos").toggle();
//		$(".clsDivOpcoes").toggle();
//		$(".clsDivInput").toggleClass("expande");
//		$(".clsDivSpacerOperadores").toggle();
//
//		if ($("#idPesquisaAvancada").is(":visible")) {
//			$(this).children(".icofont-plus").hide();
//			$(this).children(".icofont-close").show();
//		} else {
//			$(this).children(".icofont-plus").show();
//			$(this).children(".icofont-close").hide();
//		}
	});
	
	$("#mostraOutrosProdutos").click(function(){
		if ($("#idListaOutrosProdutos").children("ul").is(":visible")) {
			$("#idListaOutrosProdutos").children("ul").hide();
			$("#idListaOutrosProdutos").removeClass("ativo");
		}
		else {
			$("#idListaOutrosProdutos").children("ul").show();
			$("#idListaOutrosProdutos").addClass("ativo");
		}
	});
	
	$(".btn_JTeses").click(function(){
		location.href = "/SCON/jt/";
	});
	$(".btn_RepetitivosIAC").click(function(){
		location.href = "/SCON/recrep/";
	});
	$(".btn_LegisAplic").click(function(){
		location.href = "/SCON/legaplic/";
	});
	$(".btn_pesqPront").click(function(){
		location.href = "/SCON/pesquisa_pronta/";
	});
	$(".btn_SessFoco").click(function(){
		var local = window.location.href;
		if (local.indexOf("intra") != -1)
			location.href = "/jurisprudencia/externo/sessaoemfoco/";
		else
			location.href = "https://ww2.stj.jus.br/jurisprudencia/externo/sessaoemfoco/";
	});
	$(".btn_inform").click(function(){
		var local = window.location.href;
		if (local.indexOf("intra") != -1)
			location.href = "/jurisprudencia/externo/informativo/";
		else
			location.href = "https://ww2.stj.jus.br/jurisprudencia/externo/informativo/";
	});
	
	$("#btnLimparInformativo").click(function(){
		$("#idLivreTemp1").val("");
	});
	
	$(".mostraEmentaSemFormatacao").click(function(){
		$(this).next(".clsSemFormatacao").show();
		$(this).next(".clsSemFormatacao").children("textarea").select();
		
		var idobjeto = $(this).next(".clsSemFormatacao").children("textarea").attr("id");
		copiaParaClipboard(idobjeto);
		
//		console.log($(this).parent().parent().next());
		//$(this).parent().parent().next(".clsSemFormatacao").hide();
		//alert("Texto copiado para a area de transferencia com sucesso.");		
	});
	$(".clsSemFormatacao .botao, .clsFechaClipboard").click(function(){ 
		$(this).parent().hide();
	});
	
	$(".linkListaTodosOsSucessivos").click(function(){
		if ($(this).parent().children(".divListaTodosOsSucessivos").is(":visible")) {
			$(this).parent().children(".divListaTodosOsSucessivos").hide();
			$(this).parent().children(".divListaSucessivosSelecionados").slideDown();
			var tamSuce = $(this).children(".clsLabel").data("tsuc");
			$(this).children(".clsLabel").html("Clique aqui para listar todos os acÛrd„os similares ("+tamSuce+" documentos)");
		} else {
			$(this).parent().children(".divListaSucessivosSelecionados").hide();
			$(this).parent().children(".divListaTodosOsSucessivos").slideDown();
			$(this).children(".clsLabel").html("Clique aqui para listar apenas os acÛrd„os similares mais recentes");
		}
	});

	$(".clsMostraBRS,.clsMostraAmigavel").click(function(){
		$(".clsPesquisaBRS").toggle();
		$(".clsPesquisaAmigavel").toggle();
		$(".clsMostraBRS").toggle();
		$(".clsMostraAmigavel").toggle();
	});
	
	// exibe botao de limpar pesquisa avancada
	if ($(".clsPesquisaAvancada").length > 0) {
		var mostra = $("#processo").val() != "" || $("#classe").val() != "" || $("#relator").val() != "" || $("#dtpb1").val() != ""
			|| $("#dtpb2").val() != "" || $("#dtde1").val() != "" || $("#dtde2").val() != "" || $("#orgao").val() != "" || $("#ementa").val() != ""
			|| $("#uf").val() != "" || $("#nota").val() != "";// || $("#pesquisaLivre").val() != "";
		
		if (mostra){
			$("#idLimparPesquisaAvancada").show();
		}
		$(document).on("change", ".clsPesquisaAvancada input, .clsPesquisaAvancada select", function(){
			var mostra = $("#processo").val() != "" || $("#classe").val() != "" || $("#relator").val() != "" || $("#dtpb1").val() != ""
				|| $("#dtpb2").val() != "" || $("#dtde1").val() != "" || $("#dtde2").val() != "" || $("#orgao").val() != "" || $("#ementa").val() != ""
				|| $("#uf").val() != "" || $("#nota").val() != "" 
				|| $(".siglajud").val() != "" || $(".numero_leg").val() != "";
			
			for (var n = 1 ; n <= 6 ; n++) {
				mostra = mostra || $(".numero_art" + n).val() != "";
			}
			
			if (mostra){
				$("#idLimparPesquisaAvancada").show();
			}
		});
	}

	$("#idBotoesOperadores button[type=button]").click(function(){
		var pesquisa = $("#pesquisaLivre").val();
		if ($(this).val() == "$") {
			if (pesquisa != "")
				pesquisa = pesquisa + $(this).val() + " ";
			else
				pesquisa = pesquisa + $(this).val();
		}
		else {
			if (pesquisa != "")
				pesquisa = pesquisa + " " + $(this).val() + " ";
		}
		$("#pesquisaLivre").val(pesquisa);
		$("#pesquisaLivre").focus();
	});

/*	$(".labelTeseRevisada,.seloTese").mouseover(function() {
		$(this).next().show();
	});
	
	$(".labelTeseRevisada,.seloTese").mouseout(function() {
		$(this).next().hide();
	});*/

	$(".data").datepicker({
		dateFormat: "dd/mm/yy",
		dayNames: ["Domingo","Segunda","TerÁa","Quarta","Quinta","Sexta","S·bado"],
		dayNamesMin: ["D","S","T","Q","Q","S","S"],
		dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"],
		monthNames: ["Janeiro","Fevereiro","MarÁo","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
		monthNamesShort: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
		nextText: "PrÛximo",
		prevText: "Anterior",
		showButtonPanel: true,
		closeText: "Fechar",
		currentText: "Hoje"
	});
	function ajustaData(valor) {
		if (valor.length == 10) {
			valor = valor.substring(6) + valor.substring(3,5) + valor.substring(0,2);
		}
		return valor;
	}
	$("#data_inicial,#data_final,#tipo_data").change(function(){
		var tipo = $("#tipo_data").val();
		var inicio = $("#data_inicial").val();
		var fim = $("#data_final").val();
		inicio = ajustaData(inicio);
		fim = ajustaData(fim);
		var valor = "";
		if (inicio != "")
			valor = "@" + tipo + " >= " + inicio;
		if (fim != "") {
			if (valor != "")
				valor = valor + " E ";
			valor = valor + "@" + tipo + " <= " + fim;
		}
		$("#data").val(valor);
		$("#dataRef").val(valor);
	});
	$("#data_inicial,#data_final").focusout(function(){
		var tipo = $("#tipo_data").val();
		var inicio = $("#data_inicial").val();
		var fim = $("#data_final").val();
		inicio = ajustaData(inicio);
		fim = ajustaData(fim);
		var valor = "";
		if (inicio != "")
			valor = "@" + tipo + " >= " + inicio;
		if (fim != "") {
			if (valor != "")
				valor = valor + " E ";
			valor = valor + "@" + tipo + " <= " + fim;
		}
		$("#data").val(valor);
		$("#dataRef").val(valor);
	});
	$( "#data_inicial,#data_final" ).datepicker( "option", "maxDate", "0" );
	$( "#data_inicial,#data_final" ).datepicker( "option", "minDate", new Date(1998, 1 - 1, 1) );

	$("#data_inicialRef,#data_finalRef,#tipo_dataRef").change(function(){
		var tipo = $("#tipo_dataRef").val();
		var inicio = $("#data_inicialRef").val();
		var fim = $("#data_finalRef").val();
		inicio = ajustaData(inicio);
		fim = ajustaData(fim);
		var valor = "";
		if (inicio != "")
			valor = "@" + tipo + " >= " + inicio;
		if (fim != "") {
			if (valor != "")
				valor = valor + " E ";
			valor = valor + "@" + tipo + " <= " + fim;
		}
		$("#dataRef").val(valor);
	});
	$("#data_inicialRef,#data_finalRef").focusout(function(){
		var tipo = $("#tipo_dataRef").val();
		var inicio = $("#data_inicialRef").val();
		var fim = $("#data_finalRef").val();
		inicio = ajustaData(inicio);
		fim = ajustaData(fim);
		var valor = "";
		if (inicio != "")
			valor = "@" + tipo + " >= " + inicio;
		if (fim != "") {
			if (valor != "")
				valor = valor + " E ";
			valor = valor + "@" + tipo + " <= " + fim;
		}
		$("#dataRef").val(valor);
	});
	$( "#data_inicialRef,#data_finalRef" ).datepicker( "option", "maxDate", "0" );
	$( "#data_inicialRef,#data_finalRef" ).datepicker( "option", "minDate", new Date(1998, 1 - 1, 1) );

//	$("#numero_leg").focus(function(){
//		console.log("Foco:" + $("#numero_leg").val());
//	});
	
	$( document ).on("blur",".siglajud", function(){
			var id = $(this).attr("id");
			var sigla = $(this).val();
			if (sigla != null)
				sigla = sigla.toUpperCase();
			id = id.replace("siglajud_","");
			var strUrl = "/SCON/GetSiglaJudiciaria?sigla=" + sigla;
			$.get(strUrl, function(data, status){
				console.log(data + " - " + status);
//				$("#numero_leg" + id).val("");
				$("#siglajud_" + id).val(sigla);
				if (data != "") {
					data = data.trim();
					if (data != "0" && (data == "" || !isNaN(data)))
						$("#numero_leg" + id).val(data);
					//formataRefLeg();
					if (sigla.indexOf("SUM(") == 0) { // comeca com SUM(
						$("#tipo1_" + id).val("NUM");
						$("#tipo2_" + id).val("NUM");
						$("#tipo3_" + id).val("NUM");
						$("#tipo4_" + id).val("NUM");
						$("#tipo5_" + id).val("NUM");
						$("#tipo6_" + id).val("NUM");
					}
				}
			});
	});
	$( document ).on("change",".siglajud", function(){
		var id = $(this).attr("id");
		var sigla = $(this).val();
		id = id.replace("siglajud_","");
		var strUrl = "/SCON/GetSiglaJudiciaria?sigla=" + $(this).val();
		$.get(strUrl, function(data, status){
			//console.log(data + " - " + status);
			if (data != "") {
				data = data.trim();
				if (data != "0" && (data == "" || !isNaN(data)))
					$("#numero_leg" + id).val(data);
				//formataRefLeg();
				if (sigla.indexOf("SUM(") == 0) { // comeca com SUM(
					$("#tipo1_" + id).val("NUM");
					$("#tipo2_" + id).val("NUM");
					$("#tipo3_" + id).val("NUM");
					$("#tipo4_" + id).val("NUM");
					$("#tipo5_" + id).val("NUM");
					$("#tipo6_" + id).val("NUM");
				}
			}
		});
});
	
	// Trata configuracoes da exibicao dos documentos
	$("#qtdDocsPagina").change(function(){
		if ($("#numDocsPaginaRef").length > 0)
			$("#numDocsPaginaRef").val($(this).val());
		$("#numDocsPagina").val($(this).val());
		if ($("#lRef").length > 0)
			$("#lRef").val($(this).val());
		$("#l").val($(this).val());
		var n = $("#documentoAtual").val();
		if (n == null || n == "") n = "1";
		navegaForm(n);
	});
	$("#tp_ord_num_asc,#tp_ord_num_desc,#tp_ord_mat").click(function(){
		if (!$(this).hasClass("ativo")) {
			var valor = $(this).val();
			$("#frmNavegaDocs #ordenacao").val(valor);
			$("#frmNavegaDocs #ordenacaoRef").val(valor);
			$("#frmNavegaDocs #ordenacaoNav").val(valor);
			$("#ordenacaoPDF").val(valor);
			$(".clsBtnOrdenacao").removeClass("ativo");
			$(this).addClass("ativo");
			var n = $("#documentoAtual").val();
			if (n == null || n == "") n = "1";
			navegaForm(n);
		}
	});
	$("#tp_vis_documento_completo").click(function(){
		if (!$(this).hasClass("ativo")) {
			$("#frmNavegaDocs #tipo_visualizacao").val("");
			$("#frmNavegaDocs #tipo_visualizacaoRef").val("");
			$("#frmNavegaDocs #tipo_visualizacaoNav").val("");
			$(this).addClass("ativo");
			$("#tp_vis_lista_resumida").removeClass("ativo");
			var n = $("#documentoAtual").val();
			if (n == null || n == "") n = "1";
			navegaForm(n);
		}
	});
	$("#tp_vis_lista_resumida").click(function(){
		if (!$(this).hasClass("ativo")) {
			$("#frmNavegaDocs #tipo_visualizacao").val("RESUMO");
			$("#frmNavegaDocs #tipo_visualizacaoRef").val("RESUMO");
			$("#frmNavegaDocs #tipo_visualizacaoNav").val("RESUMO");
			$(this).addClass("ativo");
			$("#tp_vis_documento_completo").removeClass("ativo");
			var n = $("#documentoAtual").val();
			if (n == null || n == "") n = "1";
			navegaForm(n);
		}
	});
	$(".clsBtnOrdenacaoJT").click(function(){
		$("#ordenacaoRef").val($(this).val());
		$("#frmConsultaRef").attr("action", "toc.jsp");
		$("#frmConsultaRef").submit();
	});
	// --------------------------------
	// Trata filtros de refinamento

	var carregouFiltroOrgaoJulgador = false;
	var carregouFiltroMinistro = false;
	
	$("#mostraFiltroOrgaoJulgador").click(function (){
		var urlFiltros = $("#urlFiltros").val();
		var ativo = ($("#filtroOrgaoJulgador").is(":visible"));
		if (ativo) {
    		$("#filtroOrgaoJulgador").hide();
    		$(this).addClass("botaoMostraFiltro").removeClass("botaoEscondeFiltro");
		} else {
			if (!carregouFiltroOrgaoJulgador) {
				$("#filtroOrgaoJulgador").html("<span><img src=\"/recursos/imagens/gif-carregando.gif\"/></span>");
				$.get(urlFiltros+"&campoFiltro=ORG", function(data, status){
					$("#filtroOrgaoJulgador").html(data);
					setaHandlerChange();
					carregouFiltroOrgaoJulgador = true;
				});
			}
    		$("#filtroOrgaoJulgador").show();
    		$(this).addClass("botaoEscondeFiltro").removeClass("botaoMostraFiltro");
    	 }
	});
	$("#mostraFiltroMinistro").click(function (){
		var urlFiltros = $("#urlFiltros").val();
		var ativo = ($("#filtroMinistro").is(":visible"));
		if (ativo) {
    		$("#filtroMinistro").hide();
    		$(this).addClass("botaoMostraFiltro").removeClass("botaoEscondeFiltro");
		} else {
			if (!carregouFiltroMinistro) {
				$("#filtroMinistro").html("<span><img src=\"/recursos/imagens/gif-carregando.gif\"/></span>");
				$.get(urlFiltros+"&campoFiltro=MIN", function(data, status){
					$("#filtroMinistro").html(data);
					setaHandlerChange();
					carregouFiltroMinistro = true;
				});
			}
    		$("#filtroMinistro").show();
    		$(this).addClass("botaoEscondeFiltro").removeClass("botaoMostraFiltro");
    	}
	});
	$("#mostraFiltroRamoDoDireito").click(function (){
		var ativo = ($("#filtroRamoDoDireito").is(":visible"));
		if (ativo) {
    		$("#filtroRamoDoDireito").hide();
    		$(this).addClass("botaoMostraFiltro").removeClass("botaoEscondeFiltro");
		} else {
    		$("#filtroRamoDoDireito").show();
    		$(this).addClass("botaoEscondeFiltro").removeClass("botaoMostraFiltro");
   	 	}
	});
	$("#mostraFiltroOrgao").click(function (){
		var ativo = ($("#filtroOrgaoJulgador").is(":visible"));
		if (ativo) {
    		$("#filtroOrgaoJulgador").hide();
    		$(this).addClass("botaoMostraFiltro").removeClass("botaoEscondeFiltro");
		} else {
    		$("#filtroOrgaoJulgador").show();
    		$(this).addClass("botaoEscondeFiltro").removeClass("botaoMostraFiltro");
   	 	}
	});

	// handlers
	setaHandlerChange();
	function setaHandlerChange() {
		
			$( document ).on( "dblclick", "#formRefinamento .nomeFiltro", function(){
				$(this).siblings("input").prop("checked", true);
				$(this).siblings("input").trigger("change");
				navegaForm("1");
			});

			$( document ).on( "click", "#limpaFiltroOrgaos", function() {
				$("#filtroOrgaoJulgador input").prop("checked", false);
				$("#filtroPorOrgao").val("");
				navegaForm("1");
			});
		
			$( document ).on( "click", "#limpaFiltroMinistros", function() {
				$("#filtroMinistro input").prop("checked", false);
				$("#filtroPorMinistro").val("");
				navegaForm("1");
			});

			$( document ).on( "click", "#aplicaFiltroMinistros,#aplicaFiltroOrgaos", function() {
				navegaForm("1");
			});
			
			$( document ).on( "change", "#filtroOrgaoJulgador input, #filtroMinistro input", function() {
				var marcado = false;
				var txtFiltroPorOrgao = "";
				var txtFiltroPorMinistro = "";
				$("#filtroOrgaoJulgador input").each(function(index){
					marcado = marcado || $(this).is(":checked");
					if ($(this).is(":checked")) {
						if (txtFiltroPorOrgao != "")
							txtFiltroPorOrgao = txtFiltroPorOrgao + " OU ";
						txtFiltroPorOrgao = txtFiltroPorOrgao + "\"" + $(this).val() + "\"";
						$("#limpaFiltroOrgaos").show();
						$("#aplicaFiltroOrgaos").show();
					}
				});
				$("#filtroMinistro input").each(function(index){
					marcado = marcado || $(this).is(":checked");
					if ($(this).is(":checked")) {
						if (txtFiltroPorMinistro != "")
							txtFiltroPorMinistro = txtFiltroPorMinistro + " OU ";
						txtFiltroPorMinistro = txtFiltroPorMinistro + "\"" + $(this).val() + "\"";
						$("#limpaFiltroMinistros").show();
						$("#aplicaFiltroMinistros").show();
					}
				});
				if (marcado)
					$("#botoesFiltro").show();
				else
					if ($("#filtroOrg").val() == "" && $("#filtroMin").val() == "") 
						$("#botoesFiltro").hide();
				
				if (txtFiltroPorOrgao.indexOf(" OU ") == 0)
					txtFiltroPorOrgao = txtFiltroPorOrgao.substring(4);
				if (txtFiltroPorMinistro.indexOf(" OU ") == 0)
					txtFiltroPorMinistro = txtFiltroPorMinistro.substring(4);
				$("#filtroPorOrgao").val(txtFiltroPorOrgao);
				$("#filtroPorMinistro").val(txtFiltroPorMinistro);
			});
	}
	// ---------
	
	$("#filtroRepetitivo input").change(function() {
		var marcado = false;
		var txtFiltroPorNota = "";
		$("#filtroRepetitivo input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				if (txtFiltroPorNota != "")
					txtFiltroPorNota = txtFiltroPorNota + " OU ";
				txtFiltroPorNota = txtFiltroPorNota + "(" + $(this).val() + ")";
				$("#limpaFiltroRepetitivos").show();
				$("#aplicaFiltroRepetitivos").show();
				$("#botaoLimparTodosFiltros").addClass("elementoVisivel");
			}
		});
		$("#filtroPorNota").val(txtFiltroPorNota);
		$("#filtroPorNotaRef").val(txtFiltroPorNota);
		$("#frmConsultaRef").submit();
	});
	
	$("#idLinkFiltrarResultados,#aplicaFiltroRepetitivos").click(function(){
		//navegaForm("1");
		$("#frmConsultaRef").submit();
	});
	
	$("#limpaFiltroRepetitivos").click(function() {
		$("#filtroRepetitivos input").prop("checked", false);
		$("#filtroPorNota").val("");
		$("#filtroPorNotaRef").val("");
		//navegaForm("1");
		$("#frmConsultaRef").submit();
	});

	$("#formRefinamento .nomeFiltro").dblclick(function(){
		$(this).siblings("input").prop("checked", true);
		$(this).siblings("input").trigger("change");
		navegaForm("1");
	});
	/*-----------------------------*/
	$("#filtroRamoDoDireito input").change(function() {
		var marcado = false;
		var txtFiltroPorRamo = "";
		$("#filtroRamoDoDireito input").each(function(index){
			marcado = marcado || $(this).is(":checked");
			if ($(this).is(":checked")) {
				if (txtFiltroPorRamo != "")
					txtFiltroPorRamo = txtFiltroPorRamo + " ou ";
				txtFiltroPorRamo = txtFiltroPorRamo + "\"" + $(this).val() + "\"";
				$("#limpaFiltroRamos").show();
				$("#aplicaFiltroRamos").show();
			}
		});
		$("#filtroPorRamos").val(txtFiltroPorRamo);
//		$("#frmNavegaDocs").submit();
		$("#frmConsultaRef").submit();
	});
	
	$("#idLinkFiltrarResultadosSumulas,#aplicaFiltroRamos,#aplicaFiltroOrgaos").click(function(){
		$("#frmNavegaDocs").submit();
	});
	
	$("#aplicaFiltroRamosTEMA").click(function(){
		$("#frmConsultaRef").submit();
	});
	
	$("#limpaFiltroRamosTEMA").click(function() {
		$("#filtroMateria input").prop("checked", false);
		$("#frmConsultaRef").submit();
	});

	$("#filtroMateria input").click(function() {
//		$(".clsControlaFiltros a").show();
	});
	
	$("#limpaFiltroRamos").click(function() {
		$("#filtroRamoDoDireito input").prop("checked", false);
		$("#filtroPorRamos").val("");
		$("#frmNavegaDocs").submit();
	});

	$("#formRefinamento .nomeFiltro").dblclick(function(){
		$(this).siblings("input").prop("checked", true);
		$(this).siblings("input").trigger("change");
		navegaForm("1");
	});

	
	/* hint JurisprudÍncia Tem·tica */
	$(".paginaPesquisaPronta .mostraTituloNota, .corpoPaginaResultado .mostraTituloNota").mouseover(function() {
//		console.log("mouseover");
		$(this).children(".tituloNota").show();		
	});

	$(".paginaPesquisaPronta .mostraTituloNota, .corpoPaginaResultado .mostraTituloNota").mouseout(function() {
//		console.log("mouseout");
		$(this).children(".tituloNota").hide();		
	});

	$(".mostraTituloNota a").mouseover(function() {
//		console.log("mouseover");
		$(this).next(".tituloNota").show();		
	});
	$(".mostraTituloNota a").mouseout(function() {
//		console.log("mouseout");
		$(this).next(".tituloNota").hide();		
	});

	/**
	 * Clearable text inputs
	 */
	function tog(v){return v?"addClass":"removeClass";} 
	$(document).on("input", ".clearable", function(){
	    $(this)[tog(this.value)]("x");
	}).on("mousemove", ".x", function( e ){
	    $(this)[tog(this.offsetWidth-38 < e.clientX-this.getBoundingClientRect().left)]("onX");
	}).on("touchstart click", ".onX", function( ev ){
	    ev.preventDefault();
	    $(this).removeClass("x onX").val("").change();
	});

	$(".clearable").focusin(function() {
		if ($(this).val() != "")
			$(this).addClass("x");
	});
	$(".clearable").focusout(function() {
		$(this).removeClass("x");
	});
	
	
	$("#pesquisa_triagem").change(function(){
		$("#pesquisa").val($(this).val());
	});
	
	/*Informativo de Jurisprudencia*/
	
	$(".divBannerEdicoesComemorativas button").click(function(){
		console.log($(this).data("arquivo"));
		var nomeArquivo = $(this).data("arquivo");
		//openFile("/SCON/SearchBRS?b=INFJ&tipo=informativo&O=JT&livre='" + nomeArquivo + "'.cod.","Inf" + nomeArquivo + ".pdf");
		openFile(nomeArquivo,"INFJ");
	});
	
	$("#btnClearSearch").click(function() {
		$("#livreInf").val("");
		limparTodosOsFiltros();
		$("#frmConsultaRef").submit();
	});
	
	var numAnoAtual = $("#idInformativoEdicoesCombo").val();
	$("#idInformativoEdicoesCombo" + numAnoAtual).show();
	
	$("#idInformativoEdicoesCombo").change(function(){
		$(".clsInformativoEdicoesCombo").hide();
		var ano = $(this).val();
		$("#idInformativoEdicoesCombo" + ano).show();
	});
	
	var numAnoAtualE = $("#idInformativoEdicoesComboE").val();
	$("#idInformativoEdicoesComboE" + numAnoAtualE).show();
	
	$("#idInformativoEdicoesComboE").change(function(){
		$(".clsInformativoEdicoesCombo").hide();
		var ano = $(this).val();
		$("#idInformativoEdicoesComboE" + ano).show();
	});

	$("#idSelectFormatoHTMLEdicao").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAnterior").removeClass("icofont-download").addClass("icofont-ui-search");
			$("#idBaixarEdicaoAnterior span").html("Visualizar");
		}
	});

	$("#idSelectFormatoHTMLEdicaoE").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAnteriorE").removeClass("icofont-download").addClass("icofont-ui-search");
			$("#idBaixarEdicaoAnteriorE span").html("Visualizar");
		}
	});

	$("#idSelectFormatoHTMLEdicaoAtual").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAtual").removeClass("icofont-download").addClass("icofont-ui-search");
			$("#idBaixarEdicaoAtual span").html("Visualizar");
		}
	});

	$("#idSelectFormatoHTMLEdicaoAtualE").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAtualE").removeClass("icofont-download").addClass("icofont-ui-search");
			$("#idBaixarEdicaoAtualE span").html("Visualizar");
		}
	});

	$("#idSelectFormatoPDFEdicao,#idSelectFormatoRTFEdicao").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAnterior").addClass("icofont-download").removeClass("icofont-ui-search");
			$("#idBaixarEdicaoAnterior span").html("Baixar");
		}
	});
	
	$("#idSelectFormatoPDFEdicaoE,#idSelectFormatoRTFEdicaoE").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAnteriorE").addClass("icofont-download").removeClass("icofont-ui-search");
			$("#idBaixarEdicaoAnteriorE span").html("Baixar");
		}
	});

	$("#idSelectFormatoPDFEdicaoAtual,#idSelectFormatoRTFEdicaoAtual").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAtual").addClass("icofont-download").removeClass("icofont-ui-search");
			$("#idBaixarEdicaoAtual span").html("Baixar");
		}
	});

	$("#idSelectFormatoPDFEdicaoAtualE,#idSelectFormatoRTFEdicaoAtualE").change(function(){
		if ($(this).is(":checked")) {
			$("#idBaixarEdicaoAtualE").addClass("icofont-download").removeClass("icofont-ui-search");
			$("#idBaixarEdicaoAtualE span").html("Baixar");
		}
	});
	
	$("#idBaixarEdicaoAnterior").click(function(){
		var ano = $("#idInformativoEdicoesCombo").val();
		var pasta = $("#idInformativoPasta").val();
		var base = $("#idInformativoBase").val();
		var nomeArquivo = $("#idInformativoEdicoesCombo" + ano).val();
		if ($("#idSelectFormatoRTFEdicao").is(":checked")) {
			openFile(pasta + "/RTF/Inf" + nomeArquivo + ".rtf","Inf" + nomeArquivo + ".rtf");
		} else if ($("#idSelectFormatoPDFEdicao").is(":checked")) {
			//openFile("/SCON/SearchBRS?b="+base+"&tipo=informativo&O=JT&livre='" + nomeArquivo + "'.cod.","Inf" + nomeArquivo + ".pdf");
			openFile("/SCON/GetPDFINFJ?edicao=" + nomeArquivo,"Inf" + nomeArquivo + ".pdf");
		} else if ($("#idSelectFormatoHTMLEdicao").is(":checked")) {
			$("#idLivreEdicao").val("'" + nomeArquivo + "'.cod.");
			$("#idAcaoEdicao").val("pesquisarumaedicao");
			$("#idFormAbrirEdicaoInformativo").submit();
		}
	});

	$("#idBaixarEdicaoAnteriorE").click(function(){
	    var ano = $("#idInformativoEdicoesComboE").val();
	    if (ano && ano.length > 4) ano = ''; 
		var pasta = $("#idInformativoPasta").val();
		var base = $("#idInformativoBase").val();
		var nomeArquivo = $("#idInformativoEdicoesComboE" + ano).val();
		if ($("#idSelectFormatoRTFEdicaoE").is(":checked")) {
			openFile(pasta + "/RTF/Inf" + nomeArquivo + ".rtf","Inf" + nomeArquivo + ".rtf");
		} else if ($("#idSelectFormatoPDFEdicaoE").is(":checked")) {
			//openFile("/SCON/SearchBRS?b="+base+"&tipo=informativo&O=JT&livre='" + nomeArquivo + "'.cod.","Inf" + nomeArquivo + ".pdf");
			openFile("/SCON/GetPDFINFJ?edicao=" + nomeArquivo,"Inf" + nomeArquivo + ".pdf");
		} else if ($("#idSelectFormatoHTMLEdicaoE").is(":checked")) {
			$("#idLivreEdicaoE").val("'" + nomeArquivo + "'.cod.");
			$("#idAcaoEdicaoE").val("pesquisarumaedicao");
			$("#idFormAbrirEdicaoInformativoE").submit();
		}
	});

	$("#idBaixarEdicaoAtual").click(function(){
		var pasta = $("#idInformativoPasta").val();
		var base = $("#idInformativoBase").val();
		var nomeArquivo = $("#idInformativoEdicaoAtual").val();
		if ($("#idSelectFormatoRTFEdicaoAtual").is(":checked")) {
			openFile(pasta + "/RTF/Inf" + nomeArquivo + ".rtf","Inf" + nomeArquivo + ".rtf");
		} else if ($("#idSelectFormatoPDFEdicaoAtual").is(":checked")) {
			//openFile("/SCON/SearchBRS?b="+base+"&tipo=informativo&O=JT&livre='" + nomeArquivo + "'.cod.","Inf" + nomeArquivo + ".pdf");
			openFile("/SCON/GetPDFINFJ?edicao=" + nomeArquivo,"Inf" + nomeArquivo + ".pdf");
		} else if ($("#idSelectFormatoHTMLEdicaoAtual").is(":checked")) {
			$("#idLivreEdicao").val("'" + nomeArquivo + "'.cod.");
			$("#idAcaoEdicao").val("pesquisarumaedicao");
			$("#idFormAbrirEdicaoInformativo").submit();
		}
	});

	$("#idInformativoAgrupadoPorAnoFormatoPDF").change(function(){
		if ($(this).is(":checked")) {
			$("#sliderPDF").show();
			$("#sliderRTF").hide();
		}
	});

	$("#idInformativoAgrupadoPorAnoFormatoRTF").change(function(){
		if ($(this).is(":checked")) {
			$("#sliderPDF").hide();
			$("#sliderRTF").show();
		}
	});
	
	$("#idSelectAnoDataRTF").change(function(){
		var valor = $("#idSelectAnoDataRTF option:selected").html();
		$("#idSelectAnoDataPDF option").each(function(){
			if ($(this).html() == valor)
					$(this).attr("selected", true);
		});
	});
	
	$("#idSelectAnoDataPDF").change(function(){
		var valor = $("#idSelectAnoDataPDF option:selected").html();
		$("#idSelectAnoDataRTF option").each(function(){
			if ($(this).html() == valor)
					$(this).attr("selected", true);
		});
	});
	
	if ($("#idSelectFormatoPDF").is(":checked")) {
		$("#idSelectAnoDataRTF").hide();
		$("#idSelectAnoDataPDF").show();
	} else 	if ($("#idSelectFormatoRTF").is(":checked")) {
		$("#idSelectAnoDataPDF").hide();
		$("#idSelectAnoDataRTF").show();
	}
	
	$("#idSelectFormatoPDF").change(function(){
		if ($(this).is(":checked")) {
			$("#idSelectAnoDataRTF").hide();
			$("#idSelectAnoDataPDF").show();
		}
	});

	$("#idSelectFormatoRTF").change(function(){
		if ($(this).is(":checked")) {
			$("#idSelectAnoDataPDF").hide();
			$("#idSelectAnoDataRTF").show();
		}
	});

	$("#livreInf").keypress(function(event){
		if ( event.which == 13 ) {
			if ($("#frmConsulta").length > 0)
				$("#frmConsulta").submit();
			if ($("#frmConsultaRef").length > 0)
				$("#frmConsultaRef").submit();
		} else {
			if ( (event.which < 48 || event.which > 57) && event.which != 69 && event.which != 101) {
				$("#pesquisaPorNumero").prop("checked",false);
			}
		}
		$("#isPesquisaDefault").val("false");
	});
	
	$("#tema1Ref,#tema2Ref").keypress(function(event){
		if ( event.which == 13 ) {
			setFiltroTema();
			$("#frmConsultaRef").submit();
		}
	});

	$("#livreR").keypress(function(event){
		if ( event.which == 13 ) {
			$("#frmConsultaR").submit();
		}
	});
	
	$("#idBaixarPorData").click(function(){
		if ($("#idSelectFormatoRTF").is(":checked")) {
			var nomeArquivo = $("#idSelectAnoDataRTF").val();
			var nomeGravar = nomeArquivo;
			while (nomeGravar.indexOf("/") != -1)
				nomeGravar = nomeGravar.substring(nomeGravar.indexOf("/")+1);
			openFile(nomeArquivo,nomeGravar);
		} else if ($("#idSelectFormatoPDF").is(":checked")) {
			var nomeArquivo = $("#idSelectAnoDataPDF").val();
			var nomeGravar = nomeArquivo;
			while (nomeGravar.indexOf("/") != -1)
				nomeGravar = nomeGravar.substring(nomeGravar.indexOf("/")+1);
			openFile(nomeArquivo,nomeGravar);
		}
	});
	$("#idBaixarPorRamo").click(function(){
			var nomeArquivo = $("#idSelectAnoRamoDireito").val();
			var nomeGravar = nomeArquivo;
			while (nomeGravar.indexOf("/") != -1)
				nomeGravar = nomeGravar.substring(nomeGravar.indexOf("/")+1);
			openFile(nomeArquivo,nomeGravar);
	});
	
	$("#idPesquisaEdicaoBotao").click(function(){
		$("#idAcao").val("pesquisarumaedicao");
		if ($("#idFormatoHtml").is(":checked")) {
			$("#idLivre").val("'" + $("#idInformativoEdicoesCombo").val() + "'.cod.");
			$("#idFrm").submit();
		}
		else {
			var nomeArquivo = $("#idInformativoEdicoesCombo").val();
			var pasta = $("#idInformativoPasta").val();
			var base = $("#idInformativoBase").val();
			if ($("#idFormatoRtf").is(":checked")) {
				downloadFile(pasta + "/RTF/Inf" + nomeArquivo + ".rtf","Inf" + nomeArquivo + ".rtf");
			} else if ($("#idFormatoPdf").is(":checked")) {
				//window.open("/SCON/SearchBRS?b="+base+"&tipo=informativo&O=JT&livre='" + nomeArquivo + "'.cod.");
				window.open("/SCON/GetPDFINFJ?edicao=" + nomeArquivo);
//			window.open("/SCON/SearchBRS?b="+base+"&tipo=informativo&livre=@COD='" + nomeArquivo + "'");
			}
		}
	});
	
	$("#idInformativoEdicoesCombo").change(function() {
//		console.log($(this).val());
		$("#idLivre").val("'" + $(this).val() + "'.cod.");
	});
	$("#btnPesquisarInformativo").click(function(){
		$("#idAcao").val("pesquisar");
		$("#idLivre").val($("#idLivreTemp1").val());
		$("#idFrm").submit();
	});
	$("#idLivreTemp1").keypress(function(event) {
		if (event.which == 13) {
			$("#idAcao").val("pesquisar");
			$("#idLivre").val($("#idLivreTemp1").val());
			$("#idFrm").submit();		     
		}
	});

	//------------------------------ fim das funcoes do informativo
	
	$(".detalheDocumento").dialog({ autoOpen: false });
	var docWidth = $( document ).width();
	if (docWidth > 1000) docWidth = 1000;
	else docWidth = docWidth - 100;
	var docHeight = $( document ).height();
	if (docHeight > 800) docHeight = 800;
	else docHeight = docHeight - 100;
	$(".detalheDocumento").dialog( "option", "height", docHeight);
	$(".detalheDocumento").dialog( "option", "width", docWidth);
	
	// AVISOS 
	var totalAvisos = $(".clsDivAvisos").length;
	function randomInt() {
		var min = 0;
		var max = totalAvisos;
		return min + Math.floor((max - min) * Math.random());
	}
	$(".clsDivAvisos").hide();
	var indiceAvisos = 0;//randomInt();
	if (!$("#divAvisos" + indiceAvisos + ".clsDivAvisos").is(":visible")) {
		$("#divAvisos" + indiceAvisos + ".clsDivAvisos").show();
	}
	$("#idAtivaAviso" + indiceAvisos).addClass("aviso-ativo");
	var tempoAviso = 10000;
	function destacaAviso() {
		var indx = -1;
		$(".clsDivAvisos").each(function(index){
			if ($(this).is(":visible")) {
//				console.log(index + " ativo ");
				indx = index+1;
				if (indx >= totalAvisos)
					indx = 0;
			}
		});
		$(".clsDivAvisos").each(function(){
			if ($(this).attr("id") == ("divAvisos" + indx)) 
				$(this).show();
			else 
				$(this).hide();
		}); 
		$(".aviso-dot-navega").removeClass("aviso-ativo");
		$("#idAtivaAviso" + indx).addClass("aviso-ativo");
	}
	
	timerAvisos = setInterval(function(){
				destacaAviso();
			}, tempoAviso);
	
	if ($(".clsConteudoAviso").length)
		if ($(".clsConteudoAviso:visible").length == 0) {
			timerAvisos = setInterval(function(){
				destacaAviso();
			}, tempoAviso);
		}
	
	$(".juris_avisos i.icofont-rounded-right").click(function(){
		if (indiceAvisos < totalAvisos-1) 
			indiceAvisos = indiceAvisos + 1;
		else
			indiceAvisos = 0;
		$(".clsDivAvisos").each(function(){
			if ($(this).attr("id") == ("divAvisos" + indiceAvisos)) 
				$(this).show();
			else 
				$(this).hide();
		});
	});
	$(".juris_avisos i.icofont-rounded-left").click(function(){
		if (indiceAvisos > 0) 
			indiceAvisos = indiceAvisos - 1;
		else
			indiceAvisos = totalAvisos-1;
		$(".clsDivAvisos").each(function(){
			if ($(this).attr("id") == ("divAvisos" + indiceAvisos)) 
				$(this).slideDown();
			else 
				$(this).hide();
		});
	});
	
	$(".clsLinkSaibaMais").click(function(){
//		console.log("clique saiba mais");
//		$(".clsConteudoAviso").toggle();
		if ($(".clsConteudoAviso").is(":visible")) {
			$(".clsConteudoAviso").hide();
			$(this).parent().find(".icofont-rounded-up").hide();
			$(this).parent().find(".icofont-rounded-down").show();
			$(this).parent().find(".avisoUp").hide();
			$(this).parent().find(".avisoDown").show();
			if (timerAvisos == null) {
				timerAvisos = setInterval(function(){
//					console.log("timer avisos");
					destacaAviso();
				}, tempoAviso);
			}
		} else {
			$(".clsConteudoAviso").show();
			$(this).parent().find(".icofont-rounded-down").hide();
			$(this).parent().find(".icofont-rounded-up").show();
			$(this).parent().find(".avisoUp").show();
			$(this).parent().find(".avisoDown").hide();
			clearInterval(timerAvisos);
			timerAvisos = null;
		}
	});
	
	$(".aviso-dot-navega").click(function(){
		var id = $(this).attr("id");
		$(".aviso-dot-navega").removeClass("aviso-ativo");
		$(this).addClass("aviso-ativo");
//		console.log(id);
		id = id.replace("idAtivaAviso","");
		$(".clsDivAvisos").each(function(index){
			if ($(this).attr("id") == ("divAvisos" + id)) { 
				$(this).show();
				$(this).find(".clsConteudoAviso").show();
				$(this).find(".icofont-rounded-down").hide();
				$(this).find(".icofont-rounded-up").show();
				$(this).find(".avisoUp").show();
				$(this).find(".avisoDown").hide();
			}
			else {
				$(this).hide();
				$(this).find(".clsConteudoAviso").hide();
				$(this).find(".icofont-rounded-down").show();
				$(this).find(".icofont-rounded-up").hide();
				$(this).find(".avisoUp").hide();
				$(this).find(".avisoDown").show();
			}
		});
		
	});
	

	$("div.docTitulo").each(function() {
		if ($(this).children(".clsHint").length > 0)
			$(this).css("text-decoration","underline");
	});
	$("div.docTitulo").mouseover(function() {
		$(this).children(".clsHint").show();
	});
	$("div.docTitulo").mouseout(function() {
		$(this).children(".clsHint").hide();
	});
	$(".divisoria").mouseover(function() {
		$(this).next(".clsHint").show(1000);
	});
	$(".divisoria").mouseout(function() {
		$(this).next(".clsHint").hide();
	});
	$(".divisoria").click(function() {
		$(this).next(".clsHint").hide();
	});
});

function loadDetalhe(num,strUrl) {
		if ($("#divDetalhe" + num).html() == "") {
			$.get(strUrl, function(data, status){
//				console.log(data + " - " + status);
				if (data != "") {
					$("#divDetalhe" + num).html(data);
//					$("#divDetalhe" + num).show();
					$("#divDetalhe" + num).dialog( "open" );
					
					$( document ).on( "click", ".mostraEmentaSemFormatacao", function() {
						$(this).parent().parent().next(".clsSemFormatacao").show();
//						console.log($(this).parent().parent().next());
					});
					$( document ).on( "click", ".clsSemFormatacao .botao", function() {
						$(this).parent().hide();
					});
					$( document ).on( "click", "#mostraSumulaSemFormatacao", function () {
						$(".clsSemFormatacao").show();
						$(".clsSemFormatacao textarea").select();
						
						var idobjeto = $(".clsSemFormatacao").children("textarea").attr("id");
						copiaParaClipboard(idobjeto);
						//$(".clsSemFormatacao").hide();
						//alert("Texto copiado para a ·rea de transferÍncia com sucesso.");
					});
				}
			});
		} else {
			$("#divDetalhe" + num).dialog( "open" );
//			$("#divDetalhe" + num).show();
		}
}
function loadDetalheModal(num,strUrl) {
	if ($("#modalSum" + num + " .modal-content").html() == "") {
		$.get(strUrl, function(data, status){
			if (data != "") {
				$("#modalSum" + num + " .modal-content").html(data);
				$( document ).on( "click", ".mostraEmentaSemFormatacao", function() {
					$(this).parent().parent().next(".clsSemFormatacao").show();
//					console.log($(this).parent().parent().next());
				});
				$( document ).on( "click", ".clsSemFormatacao .botao", function() {
					$(this).parent().hide();
				});
				$( document ).on( "click", "#mostraSumulaSemFormatacao", function () {
					$(".clsSemFormatacao").show();
					$(".clsSemFormatacao textarea").select();
					
					var idobjeto = $(".clsSemFormatacao").children("textarea").attr("id");
					copiaParaClipboard(idobjeto);
					//$(".clsSemFormatacao").hide();
					//alert("Texto copiado para a ·rea de transferÍncia com sucesso.");
				});
			}
		});
	}
}
function limparTodosOsCampos() {
	$("#livre").val("");	
	$("#pesquisaLivre").val("");
	$("#pesquisa_livre").val("");
	limparFormularioAvancado();
}
function limparFormularioAvancado() {
	$("#pesquisa_livre").val("");
	$("#data").val("");
	$("#ref").val("");
	$("#processo").val("");
	$("#classe").val("");
	$("#uf").val("");
	$("#relator").val("");
	$("#spanNomesMinistros .clsItemSelecionado").remove();
	$("#dtpb").val("");
	$("#dtpb1").val("");
	$("#dtpb2").val("");
	$("#dtde").val("");
	$("#dtde1").val("");
	$("#dtde2").val("");
	$("#orgao").val("");
	$("#spanNomesOrgaos .clsItemSelecionado").remove();
	$("#ementa").val("");
//	$("#getsiglajud").val("");
	$(".siglajud").val("");
	$(".numero_leg").val("");
	$(".tipo1").value="ART";
	$(".numero_art1").val("");
	$(".tipo2").value="PAR";
	$(".numero_art2").val("");
	$(".tipo3").value="INC";
	$(".numero_art3").val("");
	$(".tipo4").value="";
	$(".numero_art4").val("");
	$(".tipo5").value="";
	$(".numero_art5").val("");
	$(".tipo6").value="";
	$(".numero_art6").val("");
	$("#nota").val("");	
	$("#divMinistrosAvancada input, #divOrgaosJulgadoresAvancada input").prop("checked", false);
}

function downloadFile(url,name) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.responseType = "blob";

	req.onload = function (event) {
		var blob = req.response;
//		console.log(name);
		var link=document.createElement("a");
		link.href=window.URL.createObjectURL(blob);
		link.download=name;
		link.click();
	};
	req.send();
}
function openFile(url,name) {
	window.open(url,name);
}
function validaRefinamento() {
	return true;
}

/* le json */

function getFiltros(campoFiltro) {
	/*
	if (campoFiltro == "MIN-INATIVOS") { 
		if (carregouMinInativos) 
//		return;
			;
		else
			$("#divInativos label").hide();
	}
	if (campoFiltro == "MIN") {
		if(carregouMinAtivos) 
//			return;
			;
		else 
			$("#divAtivos label").hide();
	}
	if (campoFiltro == "NOTA") {
		if (carregouNota) 
//			return;
			;
	}

	if (campoFiltro == "SIT") {
		if (carregouSituacao) 
//			return;
			;
	}

	if (campoFiltro == "ORG") { 
		if (carregouOrgaosJulgadores) 
//			return;
			;
		else 
			$("#divOrgaosJulgadores label").hide();
	}

	if (campoFiltro == "UF") {
		if (carregouUF) 
//			return;
			;
		else
			$("#divUF label").hide();
	}

	if (campoFiltro == "CLAS") { 
		if (carregouCLAS) 
//			return;
			;
		else
			$("#divCLAS label").hide();
	}

	if (campoFiltro == "MAT") { 
		if (carregouRamosDoDireito) 
//			return;
			;
		else
			$("#divMateria label").hide();
	}
*/
	$("#espera"+campoFiltro).show();

	var urlFiltros = $("#parametros").val();
	
//	if ($("#livrePPRef").length > 0)
//		if ($("#livrePPRef").val() != "")
//			urlFiltros += "&livrePP="+$("#livrePPRef").val()
	
	$.getJSON("/SCON/SearchFiltroBRS?" + urlFiltros + "&campoFiltro="+campoFiltro, function(data){
		console.log(data);
		var obj = data;
		if (obj.erro && obj.erro != null) {
			console.log(obj.erro);
			$(".clsConteudoFiltro .qtd").html("");
			$(this).parent("label").show();
		} else {
			for (var i = 0 ; i < obj.length ; i++) {
				//console.log(obj[i].nome);
				var id;
				id = "#docs" + obj[i].nome;
				$(".clsConteudoFiltro " + id).html("(" + obj[i].docs + ")");
			}
		}
		$("#espera"+campoFiltro).hide();
		
		if (campoFiltro == "MIN-INATIVOS") {
			carregouMinInativos = true; 
			$("#divInativos .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
			if ($("#divInativos label:visible").length == 0) {
				$("#MIN-INATIVOS .listaDown").hide();
				$("#MIN-INATIVOS .listaUp").hide();
			}
		}
		if (campoFiltro == "MIN") {
			carregouMinAtivos = true; 
			$("#divAtivos .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});

			var marcado = false;
			$("#divAtivos .qtd").each(function(){
				marcado = marcado || $(this).is(":visible");
			});
			if (!marcado) // abre os inativos
				$("#MIN-INATIVOS").trigger("click");
			
			if ($("#divAtivos label:visible").length == 0) {
				$("#MIN-ATIVOS .listaDown").hide();
				$("#MIN-ATIVOS .listaUp").hide();
			}
		}
		if (campoFiltro == "ORG") {
			carregouOrgaosJulgadores = true; 
			$("#divOrgaosJulgadores .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
		}
		if (campoFiltro == "ANO") {
			carregouANO = true; 
			$("#divAno .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
		}
		if (campoFiltro == "SIT") {
			carregouSituacao = true; 
			$("#divSituacao .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
		}
		if (campoFiltro == "UF") {
			carregouUF = true; 
			$("#divUF .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
		}
		if (campoFiltro == "CLAS") {
			carregouCLAS = true; 
			$("#divCLAS .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
		}
		if (campoFiltro == "JUIZO") {
			carregouJuizo = true; 
			$("#divJuizo .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
		}
		if (campoFiltro == "MAT") {
			carregouRamosDoDireito = true; 
			$("#divMateria .qtd").each(function(){
				if ("(0)" == $(this).html())
					$(this).parent("label").hide();
				else
					$(this).parent("label").show();
			});
		}
		if (campoFiltro == "NOTA") 
			carregouNota = true; 
		

    });
}

function trataCopiaParaClipboard(idObj) {
	$("#" + idObj).parent().show();
	copiaParaClipboard(idObj);
	alert('Link copiado para ·rea de transferÍncia.');
	$("#" + idObj).parent().hide();
}

function copiaParaClipboard(idObj) {
	  var copyText = document.getElementById(idObj);
	  copyText.select();
	  copyText.setSelectionRange(0, 99999);
	  document.execCommand("copy");
}
function formataRefLeg() {
	
//	console.log("Conta: " + $(".clsConjuntoCamposLegislacao").length);
	$(".clsConjuntoCamposLegislacao").each(function(){
	
	var sigla = $(this).find(".siglajud").val();
	if (sigla)
		sigla = sigla.toUpperCase();
	
	var num = $(this).find(".numero_leg").val();
	if (num) {
		num = num.trim();
		while (num.indexOf(".") != -1)
			num = num.replace(".","");
		if (num == "0")
			num = "";
	}

	if (sigla && sigla != "") {
		var siglaTmp = sigla.trim();
		while (siglaTmp.indexOf(".") != -1)
			siglaTmp = siglaTmp.replace(".","");
		if (!isNaN(siglaTmp))
			sigla = siglaTmp;
		if (!isNaN(sigla)) { //sigla È numÈrica - transfere para o campo correto
			num = sigla;
			sigla = "";		
		}	
	}
	var refleg = "";
	if (sigla != "")
		refleg = sigla;
	if (num)
	if (num != "") {
		if (refleg != "")
			refleg = refleg + " MESMO ";
		while (num.length < 6)
			num = "0" + num;
		refleg = refleg + num;
	}
	var listaartigos = "";
	
	for (var n = 1 ; n <= 6 ; n++) {
	
	var tipo;
	var artigo;
	tipo = $(this).find(".tipo" + n).val();
	artigo = $(this).find(".numero_art" + n).val().trim();
	if (tipo != "" && artigo != "") {
		if (!isNaN(artigo)) {
			while (artigo.length < 5)
				artigo = "0" + artigo;
			if (sigla == "SUM(STJ)" && tipo == "NUM") {
				if (artigo.length < 6)
					artigo = "0" + artigo;
				tipo = "SUM";
			}
		} else {
			var artigo2 = artigo;
			while (artigo.length < 5)
				artigo = "0" + artigo;
			if (sigla == "SUM(STJ)" && tipo == "NUM") {
				if (artigo.length < 6)
					artigo = "0" + artigo;
				tipo = "SUM";
			}
			artigo = "(\"" + artigo + "\" OU \"" + artigo2 + "\")";
		}
		if (listaartigos != "") {
			if (tipo == "ART")
				listaartigos = listaartigos + ") MESMO (";
			else
				listaartigos = listaartigos + " COM ";
		}
		if (isNaN(artigo))
			listaartigos = listaartigos + tipo + " ADJ " + artigo;
		else
			listaartigos = listaartigos + tipo + " ADJ \"" + artigo + "\"";
	}
	}
	if (listaartigos != "") {
		if (refleg != "")
			refleg = refleg + " MESMO ";
		refleg = refleg + " ( " + listaartigos + ")";
	}
	var refAtual = "";
	if ($("#ref").length > 0) {
		refAtual = $("#ref").val();
		if (refAtual != "")
			refleg = refAtual + " e " + refleg;
		$("#ref").val(refleg);
	}
	if ($("#refRef").length > 0) {
		refAtual = $("#refRef").val();
		if (refAtual != "")
			refleg = refAtual + " e " + refleg;
		$("#refRef").val(refleg);
	}
	});
}
function tiraAcentos(txt) {

		var texto = txt;
		/*if (texto != null) {

		var caracteresAcentuados = "·¡„√‚¬‡¿È…Í ÌÕÛ”ı’Ù‘ˆ÷˙⁄¸‹Á«";
		var caracteresNaoAcentuados = "aAaAaAaAeEeEiIoOoOoOoOuUuUcC";

		for (var i = 0; i < texto.length; i++) {
			var letra = texto.substring(i, i + 1);
			var indice = caracteresAcentuados.indexOf(letra);
			if (indice >= 0)
				texto = texto.replace(letra, caracteresNaoAcentuados.substring(indice, indice + 1));
		}
		}
*/
		return texto;
}
function getPesquisa() {
	
	if (!$("#idColTipoPesquisa").is(":visible"))
		$("#tpT").prop("checked",true);
	var pesquisaAmigavel = ""; 
	if ($("#pesquisaLivre").val() != '') {
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#pesquisaLivre").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#pesquisaLivre").val();
		//console.log("1" + pesquisaAmigavel);
	}
	
	if ($("#processo").val() != '') {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#processo").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#processo").val();
		//console.log("2" + pesquisaAmigavel);
	}
	if ($("#classe").val() != '') {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#classe").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#classe").val();
		//console.log("3" + pesquisaAmigavel);
	}
	if ($("#uf").val() != '') {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#uf").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#uf").val();
		//console.log("4" + pesquisaAmigavel);
	}
	
	var txtFiltroPorMinistro = "";
	$("#divMinistrosAvancada input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (valor.indexOf("(") != -1)
				valor = valor.substring(0,valor.indexOf("("));
			if (txtFiltroPorMinistro != "")
				txtFiltroPorMinistro = txtFiltroPorMinistro + " OU ";
			txtFiltroPorMinistro = txtFiltroPorMinistro + valor;
		}
	});
	if (txtFiltroPorMinistro != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorMinistro + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorMinistro;
		//console.log("5" + pesquisaAmigavel);
	}
	
	if ($("#dtpb1").val() != '' || $("#dtpb2").val() != '') {
		
		var data = "";
		if ($("#dtpb1").val() != '')
			data = $("#dtpb1").val();
		if ($("#dtpb2").val() != '') {
			if (data != '')
				data = data + " a " + $("#dtpb2").val();
			else
				data = $("#dtpb2").val();
		}
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>Publica&ccedil;&atilde;o: " + data + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " Publica&ccedil;&atilde;o: " + data;
		//console.log("6" + pesquisaAmigavel);
	}

	if ($("#dtde1").val() != '' || $("#dtde2").val() != '') {
		
		var data = "";
		if ($("#dtde1").val() != '')
			data = $("#dtde1").val();
		if ($("#dtde2").val() != '') {
			if (data != '')
				data = data + " a " + $("#dtde2").val();
			else
				data = $("#dtde2").val();
		}
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>Julgamento: " + data + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " Julgamento: " + data;
		//console.log("7" + pesquisaAmigavel);
	}

	var txtFiltroPorOrgao = "";
	$("#divOrgaosJulgadoresAvancada input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (txtFiltroPorOrgao != "")
				txtFiltroPorOrgao = txtFiltroPorOrgao + " OU ";
			txtFiltroPorOrgao = txtFiltroPorOrgao + valor;
		}
	});
	if (txtFiltroPorOrgao != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorOrgao + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorOrgao;
		//console.log("8" + pesquisaAmigavel);
	}
	
	if ($("#ementa").val() != '') {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#ementa").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#ementa").val();
		//console.log("9" + pesquisaAmigavel);
	}

	$("#nota option").each(function(index){
		if ($(this).is(":selected")) {
			if ($(this).val() != "") {
				var valor = $(this).html();
				if (pesquisaAmigavel != '')
					pesquisaAmigavel = pesquisaAmigavel + " e ";
				//pesquisaAmigavel = pesquisaAmigavel + " <b>" + valor + "</b>";
				pesquisaAmigavel = pesquisaAmigavel + " " + valor;
			}
		}
		//console.log("10" + pesquisaAmigavel);
	});
	// -----------
	$(".clsConjuntoCamposLegislacao").each(function(){
		
		var sigla = $(this).find(".siglajud").val();
		var num = $(this).find(".numero_leg").val();
		var tipo1 = $(this).find(".tipo1").val();
		var artigo1 = $(this).find(".numero_art1").val().trim();
		var tipo2 = $(this).find(".tipo2").val();
		var artigo2 = $(this).find(".numero_art2").val().trim();
		var tipo3 = $(this).find(".tipo3").val();
		var artigo3 = $(this).find(".numero_art3").val().trim();
		var tipo4 = $(this).find(".tipo4").val();
		var artigo4 = $(this).find(".numero_art4").val().trim();
		var tipo5 = $(this).find(".tipo5").val();
		var artigo5 = $(this).find(".numero_art5").val().trim();
		var tipo6 = $(this).find(".tipo6").val();
		var artigo6 = $(this).find(".numero_art6").val().trim();
		
		var valor = "";
		if (sigla != "")
			valor = valor + " " + sigla;
		if (num != "")
			valor = valor + " " + num;
		if (artigo1 != "")
			valor = valor + " " + tipo1 + " " + artigo1;
		if (artigo2 != "")
			valor = valor + " " + tipo2 + " " + artigo2;
		if (artigo3 != "")
			valor = valor + " " + tipo3 + " " + artigo3;
		if (artigo4 != "")
			valor = valor + " " + tipo4 + " " + artigo4;
		if (artigo5 != "")
			valor = valor + " " + tipo5 + " " + artigo5;
		if (artigo6 != "")
			valor = valor + " " + tipo6 + " " + artigo6;
		
		if (valor != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
			//pesquisaAmigavel = pesquisaAmigavel + " <b>" + valor + "</b>";
			pesquisaAmigavel = pesquisaAmigavel + " " + valor;
		}
		//console.log("11" + pesquisaAmigavel);
	});
	// -----------
//	pesquisaAmigavel = pesquisaAmigavel.toLowerCase();


	$("input[type=text]").each(function(){
		var valorCampo = $(this).val();
		$(this).val(tiraAcentos(valorCampo));
	});


	$("#pesquisaAmigavel").val(pesquisaAmigavel);
	
//	alert('ok');
	
	formataRefLeg();
	var numProcesso = $("#processo").val();
	if (numProcesso != null && numProcesso != "") {
		while (numProcesso.indexOf(".") != -1)
			numProcesso = numProcesso.replace(".","");
		$("#processo").val(numProcesso);
	}
	var valor = $("#ref").val();
	if (valor != null && valor != "") {
		//$("#indx").val(valor);
		var livre = $("#pesquisaLivre").val();
		if (livre == "") {
			valor = "(" + valor + ").REF.";
			$("#pesquisaLivre").val(valor);
		}
		else {
			valor = "(" + livre + ") e (" + valor + ").REF.";
			$("#pesquisaLivre").val(valor);
		}
		$(".siglajud").val("");
//		$("#getsiglajud").val("");
		$(".numero_leg").val("");
		$(".tipo1").val("ART");
		$(".tipo2").val("PAR");
		$(".tipo3").val("INC");
		$(".tipo4").val("");
		$(".tipo5").val("");
		$(".tipo6").val("");
		$(".numero_art1").val("");
		$(".numero_art2").val("");
		$(".numero_art3").val("");
		$(".numero_art4").val("");
		$(".numero_art5").val("");
		$(".numero_art6").val("");
		$("#ref").val("");
//		$("#indx").val("");
	}
	$("#livre").val($("#pesquisaLivre").val());
	$("#pesquisa_livre").val($("#pesquisaLivre").val());
	return true;
}
function setIdPesquisa(id) {
	//$("a.icon_avalie").attr("href",	"https://processo.stj.jus.br/webstj/pesquisa/pesquisa.asp?desc_sigla=" + id);
} 
function focoSumula(idDiv, idMais) {
	var element = $("#"+idMais);
	//$("#" + idDiv).find(".docSumula").animate({ scrollTop: element.offset().top }, 500);
	$("#" + idDiv).animate({ scrollTop: element.offset().top }, 500);
}
function AbrirDocumento(URL,nome) {
	var janela = window.open (URL);//, nome);
	janela.focus();
}
jQuery.datepicker._gotoToday = function(id) {
    var target = jQuery(id);
    var inst = this._getInst(target[0]);
    if (this._get(inst, "gotoCurrent") && inst.currentDay) {
            inst.selectedDay = inst.currentDay;
            inst.drawMonth = inst.selectedMonth = inst.currentMonth;
            inst.drawYear = inst.selectedYear = inst.currentYear;
    }
    else {
            var date = new Date();
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            this._setDateDatepicker(target, date);
            this._selectDate(id, this._getDateDatepicker(target));
    }
    this._notifyChange(inst);
    this._adjustDate(target);
}
function addLegislacao(indice) {
	var elemento =  '<div id="idConjuntoCamposLegislacao' + indice + '" class="clsConjuntoCamposLegislacao has-fixed-float-label">' + 
	'   <div class="row"><div class="col-12 text-end"><button type="button" class="btn-close" title="Remover este item"></button></div></div>' +
	'	<div class="row">' + 
	'	<div class="form-group col-12 col-md-8 has-float-label">' + 
	'  	<input type="text" class="form-control clearable siglajud" id="siglajud_' + indice + '" list="listasiglajud"> ' + 
	'    <label for="siglajud_' + indice + '">Norma</label>' + 
	'	</div>' + 
	'	<div class="form-group col-12 col-md-4 has-float-label">' + 
	'	<input type="text" class="form-control clearable numero_leg" id="numero_leg' + indice + '">' + 
	'	<label for="numero_leg' + indice + '">N˙mero</label>' + 
	'	</div>' + 
	'	</div>' + 
	'	<div class="row">';
	
	for (var n = 1 ; n <= 6 ; n++) {
		elemento = elemento +
	'		<div class="form-group col-5 col-md-2 col-xl">' + 
	'					<select id="tipo' + n + '_' + indice + '" class="form-control clearable tipo' + n + '" title="Selecione o item">' + 
	'						<option value=""></option>' +
	'						<option value="ART" ##SELECTED1##>ART</option> ' +
	'						<option value="PAR" ##SELECTED2##>PAR</option> ' +
	'						<option value="INC" ##SELECTED3##>INC</option> ' +
	'						<option value="LET">LET</option> ' +
	'						<option value="ITEM">ITEM</option> ' +
	'						<option value="NUM">NUM</option> ' +
	'					</select>' + 
	'		</div>' + 
	'		<div class="form-group col-7 col-md-4 col-xl">' + 
	'					<input type="text" id="numero_art' + n + '_' + indice + '" class="form-control clearable numero_art' + n + '" title="Informe n˙mero ou letra do item">' + 
	'		</div>';
		if (n == 1)
			elemento = elemento.replace("##SELECTED1##"," selected");
		else
			elemento = elemento.replace("##SELECTED1##","");
		if (n == 2)
			elemento = elemento.replace("##SELECTED2##"," selected");
		else
			elemento = elemento.replace("##SELECTED2##","");
		if (n == 3)
			elemento = elemento.replace("##SELECTED3##"," selected");
		else
			elemento = elemento.replace("##SELECTED3##","");
	}
	elemento = elemento + 
	'	</div>	' + 
	//'	<label for="numero_leg' + indice + '">LegislaÁ„o</label>' + 
	'	</div>';
	$("#idConjuntoCamposLegislacao").append(elemento);

	$(document).on("focusin", ".clearable", function() {
		if ($(this).val() != "")
			$(this).addClass("x");
	});
	$(document).on("focusout", ".clearable", function() {
		$(this).removeClass("x");
	});
	$(document).on("focusin","#idConjuntoCamposLegislacao .clsConjuntoCamposLegislacao *", function() {
//		console.log($(this));
		if (!$(this).parent().parent().parent(".clsConjuntoCamposLegislacao").hasClass("foco"))
			$(this).parent().parent().parent(".clsConjuntoCamposLegislacao").addClass("foco");
	});
		
	$(document).on("focusout","#idConjuntoCamposLegislacao .clsConjuntoCamposLegislacao *", function() {
//		console.log($(this));
		if ($(this).parent().parent().parent(".clsConjuntoCamposLegislacao").hasClass("foco"))
			$(this).parent().parent().parent(".clsConjuntoCamposLegislacao").removeClass("foco");
	});
	$(document).on("change", ".tipo1", function(){
		if ($(this).val() == null)
			$(this).val("ART");
	});
	$(document).on("change", ".tipo2", function(){
		if ($(this).val() == null)
			$(this).val("PAR");
	});
	$(document).on("change", ".tipo3", function(){
		if ($(this).val() == null)
			$(this).val("INC");
	});
	$(document).on("click", ".clsConjuntoCamposLegislacao .btn-close", function() {
		$(this).parent().parent().parent().remove();
	});
}
function getPesquisaRef() {
	
	var pesquisaAmigavel = "";
	
	if ($("#pesquisaAmigavelRef").length > 0) {
	 
	if ($("#livreRef").val() != '')
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#livreRef").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#livreRef").val();
	
	var txtFiltroRepetitivo = "";
	$("#filtroRepetitivo input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).parent().find(".nome").html();
			if (valor.indexOf("(") != -1)
				valor = valor.substring(0,valor.indexOf("("));
			if (txtFiltroRepetitivo != "")
				txtFiltroRepetitivo = txtFiltroRepetitivo + " OU ";
			txtFiltroRepetitivo = txtFiltroRepetitivo + valor;
		}
	});
	if (txtFiltroRepetitivo != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroRepetitivo + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroRepetitivo;
	}

	var txtFiltroPorMinistro = "";
	$("#ministroRef input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (valor.indexOf("(") != -1)
				valor = valor.substring(0,valor.indexOf("("));
			if (txtFiltroPorMinistro != "")
				txtFiltroPorMinistro = txtFiltroPorMinistro + " OU ";
			txtFiltroPorMinistro = txtFiltroPorMinistro + valor;
		}
	});
	if (txtFiltroPorMinistro != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorMinistro + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorMinistro;
	}
	
	var txtFiltroPorMateria = "";
	$("#divMateria input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (txtFiltroPorMateria != "")
				txtFiltroPorMateria = txtFiltroPorMateria + " OU ";
			txtFiltroPorMateria = txtFiltroPorMateria + valor;
		}
	});
	if (txtFiltroPorMateria != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorMateria + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorMateria;
	}

	var txtFiltroPorJuizo = "";
	$("#divJuizo input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (txtFiltroPorJuizo != "")
				txtFiltroPorJuizo = txtFiltroPorJuizo + " OU ";
			txtFiltroPorJuizo = txtFiltroPorJuizo + valor;
		}
	});
	if (txtFiltroPorJuizo != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorJuizo + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorJuizo;
	}

	if ($("#dtpb1Ref").val() != '' || $("#dtpb2Ref").val() != '') {
		
		var data = "";
		if ($("#dtpb1Ref").val() != '')
			data = $("#dtpb1Ref").val();
		if ($("#dtpb2Ref").val() != '') {
			if (data != '')
				data = data + " a " + $("#dtpb2Ref").val();
			else
				data = $("#dtpb2Ref").val();
		}
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>Publica&ccedil;&atilde;o: " + data + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " Publica&ccedil;&atilde;o: " + data;
	}

	if ($("#dtde1Ref").length > 0 && $("#dtde2Ref").length > 0)
	if ($("#dtde1Ref").val() != '' || $("#dtde2Ref").val() != '') {
		
		var data = "";
		if ($("#dtde1Ref").val() != '')
			data = $("#dtde1Ref").val();
		if ($("#dtde2Ref").val() != '') {
			if (data != '')
				data = data + " a " + $("#dtde2Ref").val();
			else
				data = $("#dtde2Ref").val();
		}
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>Julgamento: " + data + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " Julgamento: " + data;
	}

	var txtFiltroPorOrgao = "";
	$("#divOrgaosJulgadores input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (txtFiltroPorOrgao != "")
				txtFiltroPorOrgao = txtFiltroPorOrgao + " OU ";
			txtFiltroPorOrgao = txtFiltroPorOrgao + valor;
		}
	});
	if (txtFiltroPorOrgao != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorOrgao + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorOrgao;
	}

	var txtFiltroPorClasse = "";
	$("#divCLAS input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (txtFiltroPorClasse != "")
				txtFiltroPorClasse = txtFiltroPorClasse + " OU ";
			txtFiltroPorClasse = txtFiltroPorClasse + valor;
		}
	});
	if (txtFiltroPorClasse != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorClasse + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorClasse;
	}
	
	var txtFiltroPorUF = "";
	$("#divUF input").each(function(index){
		if ($(this).is(":checked")) {
			var valor = $(this).prev(".nome").html();
			if (txtFiltroPorUF != "")
				txtFiltroPorUF = txtFiltroPorUF + " OU ";
			txtFiltroPorUF = txtFiltroPorUF + valor;
		}
	});
	if (txtFiltroPorUF != "") {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + txtFiltroPorUF + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + txtFiltroPorUF;
	}

	if ($("#ementaRef").val() != '') {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#ementaRef").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#ementaRef").val();
	}

	if ($("#notaRef").length > 0)
	if ($("#notaRef").val() != '') {
		if (pesquisaAmigavel != '')
			pesquisaAmigavel = pesquisaAmigavel + " e ";
		//pesquisaAmigavel = pesquisaAmigavel + " <b>" + $("#notaRef").val() + "</b>";
		pesquisaAmigavel = pesquisaAmigavel + " " + $("#notaRef").val();
	}

	$("input[type=text]").each(function(){
		var valorCampo = $(this).val();
		$(this).val(tiraAcentos(valorCampo));
	});

	$("#pesquisaAmigavelRef").val(pesquisaAmigavel);
	} else {
	$("input[type=text]").each(function(){
		var valorCampo = $(this).val();
		$(this).val(tiraAcentos(valorCampo));
	});
		
	}
	if ($("#livreRef").val() != "") {
		$("#preConsultaPPRef").val("");
		$("#pesquisa_livre").val($("#livreRef").val());
	}
}

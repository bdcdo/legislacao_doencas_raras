function doPesquisaAjax(elemento, base, parametros) {
	
	document.getElementById(elemento).innerHTML = '<span><img src="/recursos/imagens/gif-carregando.gif"/></span>';
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4)
			if (xhttp.status == 200) {
			var resposta = xhttp.responseText;
			if (resposta != null)
				resposta = resposta.trim();

			if (document.getElementById(elemento)) {
				document.getElementById(elemento).innerHTML = resposta;
	    		if (resposta.indexOf("(0)") != -1) {
	    			if (document.getElementById(elemento).className=="tabBase")
	    				document.getElementById(elemento).className="tabVazia";	    	
	    		}
	    		var idMensagem = elemento.replace("campo","outrasBasesResultado");
	    		if (document.getElementById(idMensagem)) {
	    			if (resposta.indexOf("(0)") != -1)
	    				document.getElementById(idMensagem).innerHTML = "";
	    			else
	    				document.getElementById(idMensagem).innerHTML = resposta;
	    		}
			}
			} else {
				document.getElementById(elemento).innerHTML = "Erro!!!";
			}
			// Habilita tooltips - popper.js
			var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
			var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  				return new bootstrap.Tooltip(tooltipTriggerEl)
			});
	}
	xhttp.open("GET", "/SCON/jurisprudencia/pesquisaAjax.jsp?" + parametros + "&b=" + base, true);
	xhttp.send();

	return true;
}
function doPesquisaPrecedentes(elemento, base, parametros) {
	
	document.getElementById(elemento).innerHTML = '<span><img src="/recursos/imagens/gif-carregando.gif"/></span>';
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4)
			if (xhttp.status == 200) {
			var resposta = xhttp.responseText;
			if (resposta != null)
				resposta = resposta.trim();

			if (document.getElementById(elemento)) {
				document.getElementById(elemento).innerHTML = resposta;
	    		if (resposta.indexOf("(0)") != -1) {
	    			if (document.getElementById(elemento).className=="tabBase")
	    				document.getElementById(elemento).className="tabVazia";	    	
	    		}
	    		var idMensagem = elemento.replace("campo","outrasBasesResultado");
	    		if (document.getElementById(idMensagem)) {
	    			if (resposta.indexOf("(0)") != -1)
	    				document.getElementById(idMensagem).innerHTML = "";
	    			else
	    				document.getElementById(idMensagem).innerHTML = resposta;
	    		}
			}
			} else {
				document.getElementById(elemento).innerHTML = "Erro!!!";
			}
			// Habilita tooltips - popper.js
			var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
			var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  				return new bootstrap.Tooltip(tooltipTriggerEl)
			});
	}
	xhttp.open("GET", "/repetitivos/temas_repetitivos/pesquisa.jsp?" + parametros + "&ajax=true", true);
	xhttp.send();

	return true;
}
function replaceAll(string, token, newtoken) {
	while (string.indexOf(token) != -1) {
 		string = string.replace(token, newtoken);
	}
	return string;
}
function docPDF(cdoc) {
    var largura = (screen.availWidth / 2) - 5;
    var altura = (screen.availHeight - 60);
	window.open('', 'DOCPDF', 'directories=no,hotkeys=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,dependent=yes,width='+largura+',height='+altura+',top=0,left=' + largura);
	document.getElementById('form' + cdoc).submit();
	//janela.focus();
}
function Doc(URL) {
    var largura = (screen.availWidth / 2) - 5;
    var altura = (screen.availHeight - 65);
	var janela = window.open (URL, 'DOC', 'directories=no,hotkeys=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,dependent=yes,width='+largura+',height='+altura+',top=0,left=' + largura);
	janela.focus();
}
function DocPrint(id) {
    var largura = (screen.availWidth / 2) - 5;
    var altura = (screen.availHeight - 65);
	var janela = window.open ("", 'DOC', 'directories=no,hotkeys=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,dependent=yes,width='+largura+',height='+altura+',top=0,left=' + largura);
	document.getElementById(id).submit();
	janela.focus();
}
function processo(URL) {
    var largura = (screen.availWidth / 2) - 5;
    var altura = (screen.availHeight - 65);
	var janela = window.open (URL, 'Processo',  'directories=no,hotkeys=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,dependent=yes,width='+largura+',height='+altura+',top=0,left=' + largura);
	janela.focus();
}
function inteiro_teor(URL) {
    var largura = (screen.availWidth / 2) - 5;
    var altura = (screen.availHeight - 65);
	var janela = window.open (URL, 'InteiroTeor',  'directories=no,hotkeys=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,dependent=yes,width='+largura+',height='+altura+',top=0,left=' + largura);
	janela.focus();
}
function Abrir(URL) {
	var janela = window.open (URL, 'Jurisp', 'directories=no,hotkeys=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,dependent=yes,width=800,height=600,top=10,left=200');
	janela.focus();
}
function AbrirDocumento(URL,nome) {
	var janela = window.open (URL);//, nome);
	janela.focus();
}
function Sucessivos(URL) {
    var largura = (screen.availWidth / 2) - 5;
    var altura = (screen.availHeight - 65);
	janela = window.open (URL, 'Sucessivos', 'directories=no,hotkeys=no,location=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,dependent=yes,width='+largura+',height='+altura+',top=0,left=0');
	janela.focus();
}
function mudatitle() {
	controle = document.getElementById('refinar');
	controle.title = controle.options[controle.selectedIndex].text;
}
function mostra_help(num) {
	if (window.innerWidth > 600) {
		document.getElementById('help' + num).style.visibility = 'visible';
		document.getElementById('help' + num).style.display = 'block';
	}
}
function esconde_help(num) {
	document.getElementById('help' + num).style.visibility = 'hidden';
	document.getElementById('help' + num).style.display = 'none';
}
function trataPlural() {
	if (document.getElementById("p").value == "false")
		document.getElementById("p").value="true";
	else
		document.getElementById("p").value="false";
}
function trataThesaurus() {
	if (document.getElementById("thesaurus").value == "")
		document.getElementById("thesaurus").value="JURIDICO";
	else
		document.getElementById("thesaurus").value="";
}
function ValidaPesquisaPorEmail()
{
	if (document.getElementById("acao").value != "sendIt")
		return true;
	
	if (document.getElementById("txt_nome").value == "")		
	{
		alert("Campo de preenchimento obrigatório: NOME");
		document.getElementById("txt_nome").focus();
		return false;	
	}

	if (document.getElementById("txt_email").value == "")		
	{
		alert("Campo de preenchimento obrigatório: E-MAIL");
		document.getElementById("txt_email").focus();
		return false;
	}
	if (!isEmail(document.getElementById("txt_email").value))
	{
		alert("Endereço de e-mail inválido");
		document.getElementById("txt_email").focus();
		return false;
	}
	
	if (document.getElementById("txt_celular").value == "")	 
	{
		alert("Campo de preenchimento obrigatório: TELEFONE DE CONTATO");
		document.getElementById("txt_celular").focus();
		return false;	
	}

	if ((document.getElementById("txt_telefone").value == "") && (document.getElementById("txt_celular").value == ""))	 
	{
		alert("Campo de preenchimento obrigatório: RAMAL");
		document.getElementById("txt_telefone").focus();
		return false;	
	}
	
	if (document.getElementById("txt_ramo_direito").value.length > 2000) {
		alert("O campo RAMO DO DIREITO não pode ter mais de 2000 caracteres.");
		document.getElementById("txt_ramo_direito").focus();
		return false;
	}
	if (document.getElementById("txt_assunto").value == "")		
	{
		alert("Campo de preenchimento obrigatório: ASSUNTO");
		document.getElementById("txt_assunto").focus();
		return false;	
	}
	if (document.getElementById("txt_assunto").value.length > 2000) {
		alert("O campo ASSUNTO não pode ter mais de 2000 caracteres.");
		document.getElementById("txt_assunto").focus();
		return false;
	}
	if (!document.getElementById("ind_tipo_decisaoA").checked &&		
			!document.getElementById("ind_tipo_decisaoD").checked)
	{
		alert("Campo de preenchimento obrigatório: TIPO DE DECISÃO");
		document.getElementById("ind_tipo_decisaoA").focus();
		return false;	
	}
	if (document.getElementById("txt_legislacao").value.length > 2000) {
		alert("O campo LEGISLAÇÃO não pode ter mais de 2000 caracteres.");
		document.getElementById("txt_legislacao").focus();
		return false;
	}

	if (document.getElementById("txt_outras_especificacoes").value.length > 2000) {
		alert("O campo OUTRAS ESPECIFICAÇÕES não pode ter mais de 2000 caracteres.");
		document.getElementById("txt_outras_especificacoes").focus();
		return false;
	}
	if (document.getElementById("ind_periodo5").checked)		
		if (document.getElementById("txt_periodo").value == "")
	{
		alert("Campo de preenchimento obrigatório.");
		document.getElementById("txt_periodo").focus();
		return false;	
	}
//	if (document.frmDados.ConfirmouEmail.value == "")		
//	{
//		alert("Confirme o endereço de e-mail para evitar problemas no recebimento da pesquisa.");
//		document.frmDados.ConfirmouEmail.value = "sim";
//		document.frmDados.txt_email.focus();
//		return false;	
//	}

	return true;
}

function setResumo() {
	if (document.getElementById("tipo_visualizacao"))
		document.getElementById("tipo_visualizacao").value="RESUMO";
}
function voltaLista() {
	document.getElementById("frmNavegaDocs").action="/SCON/pesquisar.jsp";
	if (document.getElementById("repetitivos"))
		document.getElementById("repetitivos").value = "";
	document.getElementById("frmNavegaDocs").submit();
}
function navegaForm(docNum) {
	if (document.getElementById("iNav"))
		document.getElementById("iNav").value=docNum;
	var baseBRS = "";
	if (document.getElementById("bNav"))
		baseBRS = document.getElementById("bNav").value;
	var temaBRS = "";
	if (document.getElementById("temaNav"))
		temaBRS = document.getElementById("temaNav").value;
	
	if (baseBRS=="DTXT" || baseBRS=="DTXD")
		document.getElementById("frmNavegaDocs").action="/SCON/decisoes/toc.jsp";
	else
		if (baseBRS=="SUMU")
			document.getElementById("frmNavegaDocs").action="/SCON/sumstj/toc.jsp";
		else
			if (baseBRS=="SUNT")
				document.getElementById("frmNavegaDocs").action="/SCON/sumstj/toc.jsp";
			else
				if (baseBRS=="SUMT")
					document.getElementById("frmNavegaDocs").action="/SCON/sumstj/toc.jsp";
				else
					if (baseBRS=="TEMA")
						document.getElementById("frmNavegaDocs").action="/SCON/sumulas/enunciados.jsp";
					else
						if (temaBRS=="TEMA")
							document.getElementById("frmNavegaDocs").action="/SCON/precedentes/toc.jsp";
						else
							document.getElementById("frmNavegaDocs").action="/SCON/jurisprudencia/toc.jsp";
	document.getElementById("frmNavegaDocs").submit();
}
function navegaHome() {
	document.getElementById("frmNavegaDocs").action="/SCON/index.jsp";
	document.getElementById("frmNavegaDocs").submit();
}
function navegaDoc(docNum) {
	if (document.getElementById("iNav"))
		document.getElementById("iNav").value=docNum;
	var baseBRS = "";
	if (document.getElementById("bNav"))
		baseBRS = document.getElementById("bNav").value;
	var temaBRS = "";
	if (document.getElementById("temaNav"))
		temaBRS = document.getElementById("temaNav").value;
	if (baseBRS=="DTXT" || baseBRS=="DTXD")
		document.getElementById("frmNavegaDocs").action="/SCON/decisoes/doc.jsp";
	else
		if (baseBRS=="SUMU")
			document.getElementById("frmNavegaDocs").action="/SCON/sumulas/doc.jsp";
		else
			if (baseBRS=="SUNT")
				document.getElementById("frmNavegaDocs").action="/SCON/sumstj/toc.jsp";
			else
	  			if (baseBRS=="SUMT")
					document.getElementById("frmNavegaDocs").action="/SCON/sumstj/toc.jsp";
				else
					if (temaBRS=="TEMA")
						document.getElementById("frmNavegaDocs").action="/SCON/precedentes/toc.jsp";
					else
						document.getElementById("frmNavegaDocs").action="/SCON/jurisprudencia/doc.jsp";
	document.getElementById("frmNavegaDocs").submit();
}

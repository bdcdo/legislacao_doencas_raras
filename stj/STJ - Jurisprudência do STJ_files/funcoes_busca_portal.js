var KEYWORD_PARAM = 'q';

function startSearch(currentKeyword, previousKeyword, linkURI ){

	previousKeyword = !previousKeyword ? KEYWORD_PARAM + "=" : ( KEYWORD_PARAM + "=" + encodeURIComponent(trim(previousKeyword)) ) ;

	if( !linkURI ){
		linkURI = document.URL;
	}

	if( linkURI.indexOf(KEYWORD_PARAM) !== -1) {
		linkURI = linkURI.replace(previousKeyword, KEYWORD_PARAM + "=" + encodeURIComponent(trim(currentKeyword)));
	}  else {
		linkURI = linkURI + ( ( linkURI.indexOf("?") == -1 ) ? "?" : "&" ) ;
		linkURI = linkURI + KEYWORD_PARAM + "=" + encodeURIComponent(trim(currentKeyword));
	}

	document.location = linkURI;
}

var ComponentRefresh = function( baseURL, webContext ) {

	webContext = (webContext != null && webContext != undefined) ? webContext : "/sites"

	this.baseURL = baseURL || ( document.location.protocol + "//" + document.location.host + webContext + "/render/component" );

	this.fire = function( url, params, handler ){
		
		if( !url ){
			url = this.baseURL;
		}

		url = url + "?";

		for(var x in params){
			if( !params[x] ){
				continue;
			}
			url = url + x + "=" + params[x] + "&" ;
		}

		url = url.substring(0, url.lastIndexOf("&"));

		var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		document.querySelectorAll('.loadDiv')[0].style.display = "inline";
		xhr.open('GET', url , true);

		xhr.onreadystatechange = function() {
			var status = false;

			status = (xhr.readyState == 4);

			if ( status === true ) {
				handler(xhr.responseText, params.vgnextcomponentid);
				document.querySelectorAll('.loadDiv')[0].style.display = "none";

				if(document.pesqAvan!=null && document.pesqAvan['tmp.dtin_ano'] != null && params.dataInicio && params.dataFim){
					
					var dataInicioSplited = params.dataInicio.split("/");
					var dataFimSplited = params.dataFim.split("/");

					document.pesqAvan['tmp.dtin_ano'].value = dataInicioSplited[2];
					document.pesqAvan['tmp.dtin_mes'].value = dataInicioSplited[1];
					document.pesqAvan['tmp.dtin_dia'].value = dataInicioSplited[0];
					document.pesqAvan['tmp.dtfim_ano'].value = dataFimSplited[2];
					document.pesqAvan['tmp.dtfim_mes'].value = dataFimSplited[1];
					document.pesqAvan['tmp.dtfim_dia'].value = dataFimSplited[0];
				}

			}
		}

		xhr.send(null);
	}
}

function paginate( params ){
	if( !params || !params.vgnextcomponentid || !params.vgnextoid ){
		return;
	}
	
	if (params.maxPages) {
		
		if(parseInt(params.vgnextsearchresultspageno) == parseInt(params.currentPageNo) ){
			return;
		}
		
		if(parseInt(params.vgnextsearchresultspageno) > parseInt(params.maxPages) ){			
			document.getElementById(params.pageNumberElementId).value = params.currentPageNo;
			return;
		}
		
		if(parseInt(params.vgnextsearchresultspageno) <= 0) {
			document.getElementById(params.pageNumberElementId).value = params.currentPageNo;
			return;
		}
		
		if(isNaN(params.vgnextsearchresultspageno)){
			document.getElementById(params.pageNumberElementId).value = params.currentPageNo;
			return;
		}
	}
	var vui = vui || undefined;

	if( !params.appInstanceName && vui ){
		params.appInstanceName = vui.cps.ui.ice.properties.appInstanceName;
	}

	if( !params.vgnextsearchresultspageno){
		params.vgnextsearchresultspageno = '1';
	}
	if(params.vgnextkeyword){
		params.vgnextkeyword = encodeURIComponent(trim(params.vgnextkeyword));
	}else{
		params.vgnextkeyword = '';
	}
	var	handler = params.handler ? params.handler : function(html, componentOid){
		var component = document.getElementById(params.compDivId || "vgn-ext-search-comp-" + componentOid);
		if (component) {
			component.innerHTML = html;
		}
	};

	var componentRefresh = new ComponentRefresh(null, params.webcontext);
	componentRefresh.fire(null, params, handler);
}

function trim(string) {
	return string.replace(/^\s+|\s+$/g,"");
}

function paginateResults(params, context) {
	
	var handler = function (html, componentId) {
		var elementId = "vgn-ext-query-comp-pagination-div-"+componentId;
		//DIV will be reloaded with the response
		document.getElementById(elementId).innerHTML = html;
		if(typeof ice !== 'undefined' && ice && ice.component){
			vui.publish( ice.component.TOPIC, {type : ice.component.ICE_COMPONENT_CHANGED_EVENT ,
				componentId : componentId} );
		}
	};
	var componentRefresh = new ComponentRefresh(null, context);
	componentRefresh.fire(null, params, handler);
}

			function searchByEnter(e) {
				if (e.keyCode == 13){
					search();
				}
			}

			function search() {
				if(document.getElementById('searchText_48183fbd19ebc410VgnVCM10000072000e0aRCRD').value != ''){
					startSearch(document.getElementById('searchText_48183fbd19ebc410VgnVCM10000072000e0aRCRD').value,
							"null","https://www.stj.jus.br/sites/portalp/Paginas/inc/ResultadoDaBusca.aspx");
				  }
				  else{
				    alert('Digite ao menos uma palavra')
				    document.getElementById('searchText_48183fbd19ebc410VgnVCM10000072000e0aRCRD').focus();
				  }
				
					
			}

function submitJurisprudencia() {
	var x = document.getElementById('searchText_48183fbd19ebc410VgnVCM10000072000e0aRCRD').value;
	document.getElementById('headerLivre').value = x;
	document.getElementById('frmPesquisaJurHeader').submit();
}

function submitProcessos() {
	var x = document.getElementById('searchText_48183fbd19ebc410VgnVCM10000072000e0aRCRD').value;
	document.getElementById('headerTermo').value = x;
	document.getElementById('frmPesquisaProcHeader').submit();
}
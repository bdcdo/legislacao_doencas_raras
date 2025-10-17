$(function() {
	var Accordion = function(el, multiple) {
	this.el = el || {};
	this.multiple = multiple || false;
	
	var links = this.el.find('.link');
	
	links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
	}
	
	Accordion.prototype.dropdown = function(e) {
	var $el = e.data.el;
	$this = $(this),
	$next = $this.next();
	
	$next.slideToggle();
	$this.parent().toggleClass('open');
	
	if (!e.data.multiple) {
	$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
	};
	}
	
	var accordion = new Accordion($('#accordion'), false);

	// operações de acessibilidade -- tamanho da fonte
	$('#acessivel').on('click', 'a', null, function (e) {
		var action = $(this).data('action');
		var padrao = ($('.container-xxl').parent().css('font-size'));
		var atual = ($('.container-xxl').css('font-size'));
		padrao = Number(padrao.replace('px', ''));
		atual = Number(atual.replace('px', ''));
	
		switch (action.toString()) {
			case '+1':
				atual += 0.5;
				break;
			case '-1':
				atual -= 0.5;
				break;
			case '0':
			default:
				atual = padrao;
				break;
		}
		$('.container-xxl').css('font-size', atual + 'px');
	});
});
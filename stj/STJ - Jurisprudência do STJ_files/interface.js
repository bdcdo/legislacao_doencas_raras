jQuery(document).ready(function($) {
	if (isIE()) { // ajusta grid principal
		$(".icon_avalie").addClass("icon_avalie_ie");
		$(".cab_pesquisa").addClass("cab_pesquisa_ie");
	}

// Habilita tooltips - popper.js
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  		return new bootstrap.Tooltip(tooltipTriggerEl)
	});

	$(".tooltip.show").click(function() {
		$(this).hide();
		$(this).css("opacity","0");
//		console.log('fade click');
	});
	$(".tooltip.show").mouseout(function() {
		$(this).hide();
		$(this).css("opacity","0");
//		console.log('fade mouseout');
	});
});
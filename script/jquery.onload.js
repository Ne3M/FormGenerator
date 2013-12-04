// JavaScript Document
$(document).ready(function() { 
	try { console.log('init console... done'); } catch(e) { console = { log: function() {} } }
		
	// reset des champs
	clearForm(true);
	addFieldForm();
	deleteField();
	selectForm();
	deleteSavedForm();
		
});



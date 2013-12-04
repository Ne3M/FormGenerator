// JavaScript Document

var formClass = "custom_form";

function addFieldForm() {
	
	$('#form_name').change(function(){
		
		$(this).attr('value', $(this).val());
		
		if( ($(this).val() == "") && ($('.disable_further').size() == 0) ) {
			$('<div />').addClass('disable_further').height( $(document).height()-250 ).appendTo('#container');
			$('#name_form li').append($('<em />').html('Le formulaire doit avoir un nom'));
		} else {
			$('.disable_further').remove();
			$('#name_form li em').remove();
			updateCode();
		}
		
	});
	
	$('#type_de_champ').change(function(){
			
		$('#add_input .'+formClass+' li').hide();
		$('#add_input .'+formClass+' li:first').show();
		$('input, select:not(#type_de_champ)', '#add_input').val('');
			
		if( $(this).val() ) { 
			$(this).closest('li').next().slideDown();
		} else {
			$(this).closest('li').next().slideUp();
		}
	});
	
	$('#nom_du_champ').change(function(){
		$('#nom_champ em').remove();
		nameIsUnique = checkNames();
		if( nameIsUnique ) {
			$('#nom_champ em').remove();
			checkParam();
		} else {
			$('#nom_champ').append($('<em />').html('Un champ avec ce nom existe d&eacute;j&agrave; !'));
			$('#valider_champ').hide();
		}
	});
	
	var t = "";
	$('#nom_du_champ, #form_name').keyup(function(){
		_this = $(this);
		if( t != "" ) {
			clearTimeout(t);
		}
		t = setTimeout(
				function(){
					_this.trigger('change');
				}, 
				1000
			);
	});
	
	
	$('#add_option button').click(function(){
		addOption();
	});
	$('#valider_champ button').click(function(){
		addField();
	});
	$('.remove_option').live('click', function(){
		$(this).closest('li').remove();
	});
}

function addField() {
	var fieldType = $('#type_de_champ').val();
	var fieldName = cleanName($('#nom_du_champ').val());
	var fieldText = $('#nom_du_champ').val();
	var newLabel;
	var newField;
	var liClass = "";
	
	if (fieldType == "text") {
		newLabel = $('<label>').attr('for',fieldName).text(fieldText);
		newField = $('<input>').attr('type','text').attr('name',fieldName).attr('id',fieldName);
	
	} else if (fieldType == "hidden") {
		newLabel = $('<label>').html('Champ cach&eacute; : '+fieldText);
		newField = $('<input>').attr('type','hidden').attr('name',fieldName).attr('id',fieldName);
		
	} else if (fieldType == "password") {
		newLabel = $('<label>').attr('for',fieldName).text(fieldText);
		newField = $('<input>').attr('type','password').attr('name',fieldName).attr('id',fieldName);
		
	} else if (fieldType == "textarea") {
		newLabel = $('<label>').attr('for',fieldName).text(fieldText);
		newField = $('<textarea>').attr('name',fieldName).attr('id',fieldName);
		
	} else if( fieldType == "select") {
		newLabel = $('<label>').attr('for',fieldName).text(fieldText);
		newField = $('<select>').attr('name',fieldName).attr('id',fieldName);
		newField.append('\n\u0009\u0009\u0009');
		$('.option_to_add').each(function(){
			var textOption = $(this).find('[name^=text_option_]').val();
			var textValue = $(this).find('[name^=value_option_]').val();
			var optionItem = $('<option>').html(textOption).attr('value',cleanName(textValue));
			newField.append('\u0009').append(optionItem).append('\n\u0009\u0009\u0009');
		});
		$('.option_to_add').remove();
		
	} else if( fieldType == "radio") {
		newLabel = $('<label>').text(fieldText);
		newField = $('<div>');
		$('.option_to_add').each(function(){
			var textOption = $(this).find('[name^=text_option_]').val();
			var textValue = $(this).find('[name^=value_option_]').val();
			
			var radioItem = $('<input>').attr('type','radio').attr('id',cleanName(textValue)).attr('value',cleanName(textValue));
			var labelItem = $('<label>').text(textOption).attr('for',cleanName(textValue)).addClass('label_radio');
			newField.append('\u0009').append(radioItem).append(labelItem).append('\n\u0009\u0009\u0009');
		});
		liClass = "box_list";
		newField = newField.html();
		$('.option_to_add').remove();
		
	} else if (fieldType == "checkbox") {
		newLabel = $('<label>').attr('for',fieldName).text(fieldText);
		newField = $('<input>').attr('type','checkbox').attr('name',fieldName).attr('id',fieldName).val('1');
		
	} else if( fieldType == "checkboxList") {
		newLabel = $('<label>').text(fieldText);
		newField = $('<div>');
		$('.option_to_add').each(function(){
			var textOption = $(this).find('[name^=text_option_]').val();
			var textValue = $(this).find('[name^=value_option_]').val();
			
			var radioItem = $('<input>').attr('type','checkbox').attr('id',cleanName(textValue)).attr('value',cleanName(textValue));
			var labelItem = $('<label>').text(textOption).attr('for',cleanName(textValue)).addClass('label_radio');
			newField.append('\u0009').append(radioItem).append(labelItem).append('\n\u0009\u0009\u0009');
		});
		liClass = "box_list";
		newField = newField.html();
		$('.option_to_add').remove();
	} else if (fieldType == "valid") {
		newField = $('<button>').attr('name',fieldName).attr('id',fieldName).val(fieldName).text(fieldText);
		liClass = "validation";
	}
	
	if (fieldType != "hidden") {
		$('#current_form ul').append('<li />').append("\n\u0009\u0009");
		if ( liClass != "" ) {
			$('#current_form ul li:last').addClass(liClass);	
		}
		$('#current_form ul li:last').append("\n\u0009\u0009\u0009").append(newLabel).append("\n\u0009\u0009\u0009").append(newField).append("\n\u0009\u0009");
	} else {
		$('.hidden_field').append(newField).append("\n\u0009\u0009");
		hidden_item = $('<div />').addClass('hidden_item').html(newLabel);
		$('.hidden_field_interface').append(hidden_item);
	}
	
	updateCode();
	clearForm();
	autoSave();
	return false;	
}

function checkParam() {
	
	switch($('#type_de_champ').val())
	{
		case "text":
			$('#valider_champ').show();
			break;
		case "hidden":
			$('#valider_champ').show();
			break;
		case "password":
			$('#valider_champ').show();
			break;
		case "textarea":
			$('#valider_champ').show();
			break;
		case "select":
			if( $('.option_to_add').size() == 0 ) {
				addOption();
			}
			$('#add_option').show();
			$('#valider_champ').show();
			break;
		case "radio":
			if( $('.option_to_add').size() == 0 ) {
				addOption();
			}
			$('#add_option').show();
			$('#valider_champ').show();
			break;
		case "checkbox":
			$('#valider_champ').show();
			break;
		case "checkboxList":
			if( $('.option_to_add').size() == 0 ) {
				addOption();
			}
			$('#add_option').show();
			$('#valider_champ').show();
			break;
		case "valid":
			$('#valider_champ').show();
			break;
	}
}

function addOption() {
	var newOption = $('<li/>').addClass('option_to_add');
	var newOptionLabel = $('<label>').html("Libell&eacute; / Value de l'option");
	var newOptionText = $('<input>').attr('type','text').attr('name','text_option_'+$('.option_to_add').size()).attr('id','text_option_'+$('.option_to_add').size());
	var newOptionName = $('<input>').attr('type','text').attr('name','value_option_'+$('.option_to_add').size()).attr('id','value_option_'+$('.option_to_add').size());
	var newDeleteBtn = $('<button>').addClass('remove_option').html('X');
	
	newOption.append(newOptionLabel).append(newOptionText).append(newOptionName).append(newDeleteBtn)
	newOption.insertBefore( $('#add_input #add_option') );
}

function deleteField(){
	$('.'+formClass+' li, .hidden_item', '#current_form').live('mouseenter',function(){
		$(this).css('background-color','#efefef');
		var deleteFieldBtn = $('<button>').addClass('remove_field').html('X');
		$(this).append(deleteFieldBtn);
	});
	$('.'+formClass+' li, .hidden_item', '#current_form').live('mouseleave',function(){
		$(this).css('background-color','').removeAttr('style');
		$(this).find('.remove_field').remove();
	});
	$('#current_form .'+formClass+' li .remove_field').live('click',function(){
		$(this).closest('li').remove();
		updateCode();
	});
	$('.hidden_item .remove_field', '#current_form').live('click',function(){
		var fieldIndex = ($(this).closest('div').index())-1 ;
		$('.hidden_field input:eq('+fieldIndex+')').remove();
		$('.hidden_field').html( $('.hidden_field').html().replace(/\n\u0009\u0009\n\u0009\u0009/g,'\n\u0009\u0009') )
		updateCode();
	});
}

function checkNames(){
	var formName = cleanName($('#form_name').val());
	var futureFieldName = cleanName($('#nom_du_champ').val()); // To 
	if ( futureFieldName != "" ) {
		if( ($('[id='+futureFieldName+']').size() != 0)||(futureFieldName == formName) ) {
			return false;
		}
	}
	
	return true;
}

function cleanName(newVal){
	newVal = newVal.toLowerCase();
	myRegExp = new RegExp("'|\\\\|\"|\/","g");
	newVal = newVal.replace(myRegExp, "-"); 
	newVal = newVal.replace(/\s/g, "-"); 
	newVal = newVal.replace(/\+/g, "-plus-");
	newVal = newVal.replace( "\u00E9", "e");
	newVal = newVal.replace(/[\u00E9\u00E8\u00EA\u00EB]/g, "e");
	newVal = newVal.replace(/[\u00E0\u00E1\u00E2\u00E3\u00E4\u00E5]/g, "a"); 
	newVal = newVal.replace(/[\u00EC\u00ED\u00EE\u00EF]/g, "i"); 
	newVal = newVal.replace(/[\u00F2\u00F3\u00F4\u00F5\u00F6]/g, "o"); 
	newVal = newVal.replace(/[\u00F9\u00FA\u00FB\u00FC]/g, "u"); 
	newVal = newVal.replace(/\W/g, "-"); 
	return (newVal);	
}

function clearForm(isLoading){
	$('#add_input .'+formClass+' li').hide()
	$('#add_input .'+formClass+' li:first').show();
	$('input, select', '#add_input').val('');
	$('#valider_champ').hide();
	if( isLoading ) {
		$('#result','#source_code').val('');
		$('input', '#name_form').val('');
		
		$('<div />').addClass('disable_further').height( $(document).height()-250 ).appendTo('#container');
	}
}
function updateCode(){
	var newVal = '';
	var formName = cleanName($('#form_name').val());
	formStart = '<form name="'+formName+'" id="'+formName+'">';
	hiddenFieldCode = '\u0009<div class="hidden_field">\n'+$('#current_form .hidden_field').html()+'\n\u0009</div>';
	formFieldCode = '\u0009<ul class="'+formClass+'">\n'+$('#current_form ul').html()+'\n\u0009</ul>';
		
	if( $('.hidden_field input').size() > 0 ) {
		newVal = formStart+'\n'+hiddenFieldCode+'\n'+formFieldCode+'\n</form>';
		//$('#source_code #result').val(formStart+'\n'+hiddenFieldCode+'\n'+formFieldCode+'\n</form>');
	} else {
		newVal = formStart+'\n'+formFieldCode+'\n</form>';
		//$('#source_code #result').val(formStart+'\n'+formFieldCode+'\n</form>');
	}
	$('#source_code #result').val(newVal);
	newVal = newVal.replace(/</g,'&lt;').replace(/>/g,'&gt;');
	$('#source_code #result').html(newVal);
}


// Need to be host in firefox // Chrome is ok
function autoSave() {
	date = new Date();
	today = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
	localStorage.setItem(today+'_form_'+$('#form_name').val(), $('#container').html());
	selectForm();
}
function selectForm() {
	$('#loadSave').remove();
	var selectSave = $('<ul>').attr('id','loadSave');
	var items = localStorage.length
	for(i=0;i<items;i++){  
		var itemName = localStorage.key(i);
		if( (localStorage.getItem(itemName) != "null")&&(localStorage.getItem(itemName)) ) {
			//alert(itemName + ' = ' + localStorage.getItem(itemName) + '  '); 
			itemOption = $('<li>').html($('<a>').html(itemName).attr('href','#'));
			selectSave.append(itemOption);
		}
	} 
	
	$('#older_form').css('left',($('#container').offset().left)+630).append(selectSave);
	$('#older_form li a').click(function(){
		loadForm($(this).html());						 
		return false;
	});

}
function deleteSavedForm(){
	$('#older_form ul li').live('mouseenter',function(){
		$(this).css('background-color','#efefef');
		var deleteFieldBtn = $('<button>').addClass('remove_form').html('X');
		$(this).append(deleteFieldBtn);
	});
	$('#older_form ul li').live('mouseleave',function(){
		$(this).css('background-color','').removeAttr('style');
		$(this).find('.remove_form').remove();
	});
	$('#older_form ul li .remove_form').live('click',function(){
		deleteForm($(this).closest('li').find('a').html());
		$(this).closest('li').remove();
	});
}
function loadForm(formToLoad) {
	$('#container').html(	localStorage.getItem(formToLoad)  );	
}
function deleteForm(formName) {
	localStorage.removeItem(formName)	
}


/*
function saveForm() {
	date = new Date();
	today = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
	checkOlderForm(today);
	localStorage.setItem(today+'_form_'+$('#form_name').val(), $('#container').html());
}
function checkOlderForm(today){
	var items = localStorage.length
	for(i=0;i<items;i++){ 
		var itemName = localStorage.key(i);
		isToday = (itemName.split('_')[0] == today)	
		if (isToday) {
			timeLabel = 'aujourd\'hui';
		} else {
			timeLabel = 'le ' + itemName.split('_')[0];
		}

		if ( itemName.split('_')[2] == $('#form_name').val() ) {
			overWrite = confirm('Vous avez d\u00E9j\u00E0 enregistr\u00E9 le formulaire \u00AB '+ $('#form_name').val() + ' \u00BB ' + timeLabel + ', voulez vous l\'\u00E9craser ?')	 
			if (overWrite) {
				if(isToday) {
					return
				} else {
					deleteForm(itemName);
				}
			} else {
				if(isToday) {
					newName("Veuillez indiquer un nouveau nom pour ce formulaire");
				}
			}
		}
	} 
}
function newName(newNameText){
	newNameText = prompt(newNameText,"");
	if(newNameText == null) {
		return false;	
	} else if (newNameText == ""){
		newName("Le nom du formulaire est vide, veuillez indiquer un nouveau nom pour ce formulaire");
	}
	newNameText = newNameText.toString();
	newNameText = cleanName(newNameText);
	if( ($('#'+newNameText).size() == 0)&&( $('#form_name').val() !=  newNameText ) ) {
		$('#form_name').val( newNameText );
	} else {
		newName("Ce nom est d\u00E9j\u00E0 utilis\u00E9 par un champs, veuillez indiquer un nouveau nom pour ce formulaire");
	}
	
}

function selectform() {
	var selectSave = $('<select>').attr('name','loadSave').attr('id','loadSave');
	var items = localStorage.length
	for(i=0;i<items;i++){  
		var itemName = localStorage.key(i);
		if( (localStorage.getItem(itemName) != "null")&&(localStorage.getItem(itemName)) ) {
			//alert(itemName + ' = ' + localStorage.getItem(itemName) + '  '); 
			itemOption = $('<option>').val(itemName).html(itemName);
			selectSave.append(itemOption);
		}
	} 
	$('#container').prepend(selectSave);
}
*/



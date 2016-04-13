/**
 * index.js
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the MIT license.
 *
 * Controls index.html
 */

$(document).ready(function () {
    // function to encrypt
	function encrypt(message, passwords) {
		var encrypted = CryptoJS.AES.encrypt(message, passwords);
		return encrypted;
	}

	// function to decrypt
	function decrypt(message, passwords) {
		var decrypted = CryptoJS.AES.decrypt(message, passwords);
		return decrypted.toString(CryptoJS.enc.Utf8);
	}
	
	// function to copy text to clipboard
	function copyText() {
		document.getElementById("confirmationText").select();
		document.execCommand("Copy", false, null);
	}

	// function to clear text
	function clearText() {
		$("#messageBox").val("");
		$("#passwordBox").val("");
	};
    
    $('#successAlertClose').click(function () {
        $('#successAlert').fadeOut();
        if (typeof chrome === 'undefined') {
            addon.port.emit('resize', 278);
        }
    });

    $('#unkownErrorAlertClose').click(function () {
        $('#unknownErrorAlert').fadeOut();
    });

    $('#goButton').click(function () {
		var codeMessage = $('#messageBox').val();
		var codePassword = $('#passwordBox').val();
		
		var codeResult = encrypt(codeMessage, codePassword); //get result

		var text = "" + codeResult;
                    $('#confirmationText').html(text);
                    $('#confirmationModal').modal().show();
        });
	
	$('#decryptButton').click(function () {
		var codeMessage = $('#messageBox').val();
		var codePassword = $('#passwordBox').val();
		
		var codeResult = decrypt(codeMessage, codePassword); //get result

		var text = "" + codeResult;
                    $('#confirmationText').html(text);
                    $('#confirmationModal').modal().show();
        });	
	
	$("#copy").click(function () {
		copyText();
		confirmResults();
		clearText();
	});
	
    $('#done').click(function () {
        clearText();
    });
	
    function confirmResults() {
        $('#cover').show();
            var text = 'Copied to clipboard.';
            $('#successAlertLabel').text(text);
            $('#successAlert').slideDown();
            $('#confirmationModal').modal('hide');
            $('#cover').fadeOut('slow');
            $('#cover').hide();
        };

    /*
     *  Settings Menu
     */

    /*
     * About
     */

    if (typeof chrome !== 'undefined') {
        $('#version').text(chrome.runtime.getManifest().version);
    } else {
        addon.port.on('version', function (version) {
            $('#version').text(version);
        });
    }

    $('#aboutModal').on('click', 'a', function () {
        if (typeof chrome !== 'undefined') {
            chrome.tabs.create({url: $(this).attr('href')});
        } else {
            addon.port.emit('openTab', $(this).attr('href'));
        }
        return false;
    });

    /*
     * Resizing
     */

    $('.modal').on('shown.bs.modal', function() {
        var $main = $('#main');
        var height = $main.height();
        var modalHeight = $(this).find('.modal-dialog').height();
        if (modalHeight > height) {
            $main.height(modalHeight);
            if (typeof chrome === 'undefined') {
                addon.port.emit('resize', modalHeight+2);
            }
        }
    }).on('hidden.bs.modal', function () {
        $('#main').height('auto');
        if (typeof chrome === 'undefined') {
            if ($('#successAlert').is(':visible')) {
                var height = 350;
            } else {
                var height = 278;
            }
            addon.port.emit('resize', height);
        }
    });
});
//logo page redirection
$(document).on('pagebeforeshow', '#opt_app', function () {

	if (localStorage.getItem('DealerId')) {
		setTimeout(function () {
			window.location.href = "#form";
		}, 2000);
	} else {
		setTimeout(function () {
			window.location.href = "#login";
		}, 2000);
	}
});



$(document).on('pageshow', '#form', function () {

	$('#chk_1').trigger("change");
	$('#chk_2').trigger("change");
	$('#chk_3').trigger("change");
	$('#chk_4').trigger("change");

	if (localStorage.getItem('DealerClass') == 'Dealership')
		$("#chk_3").parent().show();
	else
		$("#chk_3").parent().hide();

	$('#CTG_Services').controlgroup('refresh');

});


/**/
$(document).on('pagebeforeshow', '#pagePrivacy', function () {

	$.ajax({
		type: "GET",
		url: "http://opticoat.com/opt_app/login.php?handler=getCMS&page_id=59",
		dataType: 'json',
		beforeSend: function () {
			$.mobile.loading('show')
		},
		complete: function () {
			$.mobile.loading('hide')
		},
		success: function (data) {
			if (data.Success == 'true') {
				$('#pagePrivacy div#sp_privacy').html(data.HTML);
			} else {
				$('#pagePrivacy div#sp_privacy').html(data.Msg);
			}
		},
		error: function () {
			alert('Could not connect to the server!');
		}
	});
});
/**/

function QRonSuccess(result) {

	if (result.cancelled == true) {
		return false;
	}
	var code = result.text;
	$('#vehicle_vin').val(code);
	//alert(code);
}

function QRFailure(message) {
	$('#messagebox p').html('Scanner Fails!');
}


$(document).ready(function () {

	$('#btnBarcode').on('click', function (e) {
		try {
			cordova.plugins.barcodeScanner.scan(QRonSuccess, QRFailure);
		} catch (err) {
			$('#messagebox p').html('Scanner Fails!');
		}
		e.preventDefault();
	});


	$("#formclaim").validate({
		
		errorPlacement: function(error, element) {},
		submitHandler: function (form) {
			
			
			var LotPat = /(L)[0-9]{6}[A-z]{1}/i;
			
			if( $('#chk_2').prop('checked') == true ){
				if ( LotPat.test( $( '#opticoat_pro_lot_no' ).val() ) == false ) {
					//alert( 'OPTI-COAT PRO LOT NO. is not valid!' );
					
					$('#messagebox p').html('OPTI-COAT PRO LOT NO. is not valid!');
					$.mobile.changePage('#messagebox', 'pop', true, true);
						
					
					$( '#opticoat_pro_lot_no' ).focus();
					return false;
				}
			}	
			
			if( $('#chk_1').prop('checked') == true ){
				if( $( '#optiguard_leather_lot_no' ).val() != '' ){
					if ( LotPat.test( $( '#optiguard_leather_lot_no' ).val() ) == false ) {
						//alert( 'Leather Lot No. is not valid!' );
						$('#messagebox p').html('Leather Lot No. is not valid!');
						$.mobile.changePage('#messagebox', 'pop', true, true);
						
						$( '#optiguard_leather_lot_no' ).focus();
						return false;
					}
				}
			}
			
			
			var formData = $("#formclaim").serialize();

			$.ajax({
				type: "POST",
				url: "http://opticoat.com/opt_app/login.php?handler=add&dealer_id=" + localStorage.getItem('DealerId'),
				beforeSend: function () {
					$.mobile.loading('show')
				},
				complete: function () {
					$.mobile.loading('hide')
				},
				data: formData,
				dataType: 'json',
				success: function (data) {

					if (data.Msg) {
						$('#messagebox p').html(data.Msg);
						$.mobile.changePage('#messagebox', 'pop', true, true);
					}

					if (data.Success == 'true') {
						localStorage.removeItem('formdata');
						form.reset();
					}

					if (data.JS) {
						//eval(data.JS);
					}
				},

				error: function (data, errorThrown) {
					alert('request failed :' + errorThrown);
				}
			});

			return false;


			//$.mobile.changePage("#form");
			return false;
		},
		invalidHandler: function () {
			// stuff to do when form is invalid
			// alert("invalid form");
		}
	});

	$(".logout").click(function () {
		localStorage.clear();
		$.mobile.changePage("#login");
		$("#form_login")[0].reset();
	})
	$("#errorMsg").hide();
	$("#btnLogin").click(function () {

		var usu = $("#txtuser").val();
		var pass = $("#txtpassword").val();

		$.ajax({
			type: "POST",
			url: "http://opticoat.com/opt_app/login.php?handler=Login",
			beforeSend: function () {
				$.mobile.loading('show')
			},
			complete: function () {
				$.mobile.loading('hide')
			},
			data: {
				'usu': usu,
				'pass': pass
			},
			dataType: 'json',
			success: function (data) {

				if (data.Success == 'true') {

					localStorage.setItem('DealerId', data.Dealerid);
					localStorage.setItem('DealerClass', data.DealerClass);

					if (localStorage.getItem('DealerClass') == 'Dealership')
						$("#sp_Dealership").show();
					else
						$("#sp_Dealership").hide();


					$.mobile.changePage("#form");
				} else {
					$('#messagebox p').html(data.Msg);
					$.mobile.changePage('#messagebox', 'pop', true, true);
				}
			},
			error: function () {
				alert('Could not connect to the server!');
			}

		});
	});
});

//logo page redirection
$(document).on('pagebeforeshow', '#opt_app', function() {

	if (localStorage.getItem('DealerId')) {
		setTimeout(function() {
			window.location.href = "#form";
		}, 2000);
	} else {
		setTimeout(function() {
			window.location.href = "#login";
		}, 2000);
	}
});



$(document).on('pageshow', '#form', function() {

	$('#chk_1').trigger("change");
	$('#chk_2').trigger("change");
	$('#chk_3').trigger("change");
	
	if( localStorage.getItem('DealerClass' ) == 'Dealership' )
		$("#chk_3").parent().show();
	else
		$("#chk_3").parent().hide();

	$('#CTG_Services').controlgroup('refresh');

});


/**/
$(document).on('pagebeforeshow', '#pagePrivacy', function() {

	$.ajax({
		type: "GET",
		url: "http://opti-coat.net/opt_app/login.php?handler=getCMS&page_id=59",
		dataType: 'json',
		beforeSend: function() {
			$.mobile.loading('show')
		},
		complete: function() {
			$.mobile.loading('hide')
		},
		success: function(data) {
			if (data.Success == 'true') {
				$('#pagePrivacy div#sp_privacy').html(data.HTML);
			} else {
				$('#pagePrivacy div#sp_privacy').html(data.Msg);
			}
		},
		error: function() {
			alert('Could not connect to the server!');
		}
	});
});
/**/

function QRonSuccess(result){
	
	if( result.cancelled == true ){
		return false; 	
	}				 
	var code = result.text;
	$('#vehicle_vin').val(code);
	//alert(code);
}
function QRFailure(message){
	$('#messagebox p').html('Scanner Fails!');
}


$(document).ready(function() {
	
	$('#btnBarcode').on('click',function(e){
		try{
			cordova.plugins.barcodeScanner.scan(QRonSuccess, QRFailure);
		}catch(err) {
			$('#messagebox p').html('Scanner Fails!');
		}
		e.preventDefault();
	});
	

	$("#submit").click(function() {
		//alert('sss');
		//form validatio
		$("#formclaim").validate({

			submitHandler: function(form) {
				//alert("hello");  // stuff to do when form is valid
				// alert('valid form submitted'); // for demo

				//alert('functin called');
				var formData = $("#formclaim").serialize();

				$.ajax({
					type: "POST",
					url: "http://opti-coat.net/opt_app/login.php?handler=add&dealer_id=" + localStorage.getItem('DealerId'),
					beforeSend: function() {
						$.mobile.loading('show')
					},
					complete: function() {
						$.mobile.loading('hide')
					},
					data: formData,
					dataType: 'json',
					success: function(data) {

						if (data.Msg) {
							$('#messagebox p').html(data.Msg);
							$.mobile.changePage('#messagebox', 'pop', true, true);
						}

						if (data.Success == 'true') {
							localStorage.clear();
							form.reset();
						}

						if (data.JS) {
							//eval(data.JS);
						}
					},

					error: function(data, errorThrown) {
						alert('request failed :' + errorThrown);
					}


				});

				return false;


				//$.mobile.changePage("#form");
				return false;
			},
			invalidHandler: function() {
				// stuff to do when form is invalid
				// alert("invalid form");
			}
		});
	});
	$(".logout").click(function() {
		localStorage.clear();
		$.mobile.changePage("#login");
		$("#form_login")[0].reset();
	})
	$("#errorMsg").hide();
	$("#btnLogin").click(function() {

		var usu = $("#txtuser").val();
		var pass = $("#txtpassword").val();

		$.ajax({
			type: "POST",
			url: "http://opti-coat.net/opt_app/login.php?handler=Login",
			beforeSend: function() {
				$.mobile.loading('show')
			},
			complete: function() {
				$.mobile.loading('hide')
			},
			data: {
				'usu': usu,
				'pass': pass
			},
			dataType: 'json',
			success: function(data) {

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
			error: function() {
				alert('Could not connect to the server!');
			}

		});
	});
});
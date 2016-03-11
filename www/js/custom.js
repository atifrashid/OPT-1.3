// JavaScript Document
//form serialize

function saveFormDate() {
    var str = $("#formclaim").serialize();
    $("#results").text(str);
	 localStorage.setItem('formdata', str );
}


$(document).ready(function () {
    // jQuery version number text
    $("input[type='number']").each(function (i, el) {
        el.type = "text";
        el.onfocus = function () {
            this.type = "number";
        };
        el.onblur = function () {
            this.type = "text";
        };
    });


	    //call function on blur 
    $(":input").blur(function () {
        saveFormDate();
    });


	//var picker = $( "input[type='text']", this );
    $('.mdate').mobipick();

    // jQuery version number text

    //cookies in input fields

    if ( localStorage.getItem('formdata') ) {
        var str = decodeURIComponent(( localStorage.getItem('formdata')  + '').replace(/\+/g, '%20'));
        //var str = urldecode(jsData);
        //alert(str);
        var pairs = str.split('&');
        var obj = {}, p, idx, val;
        for (var i = 0, n = pairs.length; i < n; i++) {
            p = pairs[i].split('=');
            //alert(pairs[i]);
            idx = p[0];
            var ele = $('[name="' + idx + '"]');
            var type = ele.attr('type');
            if (type == 'checkbox') {
                $(':checkbox[value="' + p[1] + '"]').attr("checked", "checked");

            } else if (type == 'text') {
                ele.val(p[1]);
            } else if (type == 'date') {
                ele.val(p[1]);
            } else if (type == 'email') {
                ele.val(p[1]);
            } else if (type == 'radio') {
                $(':radio[value="' + p[1] + '"]').attr("checked", "checked");
                $(':radio[value="' + p[1] + '"]').trigger('change');
            } else if (ele.is('select')) {
                ele.val(p[1]);
                ele.trigger('change');
            } else if (ele.is('textarea')) {
                ele.val(p[1]);
            }
        }
    }
    //chkbox show hide
    $('#chk_1').change(function () {
        if ($(this).is(':checked')) {
            $('#tbl_addwarr').show(200);
        } else {
            $('#tbl_addwarr').hide(200);
        }

    });

    $('#chk_2').change(function () {
        if ($(this).is(':checked')) {
            $('#tbl_addwarr2').show(200);
        } else {
            $('#tbl_addwarr2').hide(200);
        }
    });

	$('#chk_3').change(function () {
        if ($(this).is(':checked')) {
            $('#tbl_pg').show(200);
        } else {
            $('#tbl_pg').hide(200);
        }
    });


	



});

/* Date Picker */

	
	$(".date-picker").datepicker({
        format: 'yyyy-mm-dd',
		  autoclose: true 
   });
	
	$(".date-picker").on("change", function () {
		var id = $(this).attr("id");
		var val = $("label[for='" + id + "']").text();
		$("#msg").text(val + " changed");
	});
	

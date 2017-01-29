$(document).ready(function () {
    window.onload = initializeMaps;

    // $(".contact_submit").click(function (e) {
    //     $('#ContactForm').submit();
    //     e.preventDefault();
    // });

    $("#callback").click(function () {
        $("#Telephone").toggleClass('required error');
    });

    $("#intrestedIn").selectbox({
        onOpen: function (inst) {
          //  console.log("open", inst);
        }
    });

    // $("#ContactForm").validate({
    //     errorPlacement: function () {
    //         //element.addClass('error');
    //     },
    //     highlight: function (element) {
    //         $(element).addClass('error');
    //     },
    //     unhighlight: function (element) {
    //         $(element).removeClass('error');
    //     }
        //        ,
        //        submitHandler: function () {
        //            var formData = $("#ContactForm").serialize();
        //            $.ajax({
        //                type: "POST",
        //                url: "/contact/contactform",
        //                data: formData,
        //                error: function () {
        //                    alert('error');
        //                },
        //                success: function (data) {
        //                    $(".thankyou").html(data.Message);
        //                    $(".thankyou").delay(1000).animate({ height: 525 }, { duration: 1000, easing: 'easeOutCubic' });

        //                    setTimeout(function () {
        //                        window.location = "/thank-you";
        //                    }, 5000);
        //                }
        //            });
        //        }
    // });


    $('[placeholder]').focus(function () {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function () {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur().parents('form').submit(function () {
        $(this).find('[placeholder]').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        });
    });

});

function initializeMaps() {
    var styles =
						[
						  {
						      stylers: [
							{ invert_lightness: false },
							  { hue: "#DB7675" },
							  { saturation: 25 }
							]
						  }
						];

    var lat = 53.383829;
    var lng = -1.470404;
    var latlng = new google.maps.LatLng(lat, lng);
    var settings = {
        zoom: 18,
        center: latlng,
        backgroundColor: "#DB7675",
        mapTypeControl: false,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, position: google.maps.ControlPosition.TOP_RIGHT },
        navigationControl: true,
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
    };

    var map = new google.maps.Map(document.getElementById("map"), settings);

    var styledMapOptions = { map: map, name: "Campbell Harrison limited" };

    var styledMap = new google.maps.StyledMapType(styles, styledMapOptions);

    map.mapTypes.set('Campbell Harrison limited', styledMap);
    map.setMapTypeId('Campbell Harrison limited');

    var contentString = '<div id="maps_content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<p class="map">19 Paradise Square <br/>Sheffield <br/> United Kingdom<br/>S1 2DE </p>' +
				'</div>' +
				'</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var companyImage = new google.maps.MarkerImage('/Resources/images/map-mark.png',
					new google.maps.Size(100, 50),
					new google.maps.Point(0, 0),
					new google.maps.Point(50, 50)
				);


    var companyPos = new google.maps.LatLng(lat, lng);

    var companyMarker = new google.maps.Marker({
        position: companyPos,
        map: map,
        icon: companyImage,
        title: "Campbell Harrison limited",
        zIndex: 3
    });

    //    google.maps.event.addListener(companyMarker, 'click', function () {
    //        infowindow.open(map, companyMarker);
    //    });
}

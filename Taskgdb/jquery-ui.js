var UIJQueryUI = function () {

    
    var handleDatePickers = function () {
        var currentDate = new Date();
        $( "#ui_date_picker_range_from" ).datepicker({
	      defaultDate: "+1w",
	      changeMonth: true,
		  changeYear: true,
		  dateFormat: 'yy-mm-dd',
		  yearRange : 'c-100:-0',
		  onClose: function( selectedDate ) {
	        $( "#ui_date_picker_range_to" ).datepicker( "option", "minDate", selectedDate );
			},
			maxDate:currentDate
	    });
		$( "#ui_date_picker_range_to" ).datepicker({
	      defaultDate: "+1w",
	      changeMonth: true,
		  changeYear: true,
		  dateFormat: 'yy-mm-dd',
		  yearRange : 'c-100:-0',
	      onClose: function( selectedDate ) {
	        $( "#ui_date_picker_range_from" ).datepicker( "option", "maxDate", selectedDate );
	      },
		  maxDate:currentDate
	    });
		
    }


    return {
        //main function to initiate the module
        init: function () {
            handleDatePickers();
            
        }

    };

}();
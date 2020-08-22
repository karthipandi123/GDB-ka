// dual box added by karthick
var settings = new Array();
var group1 = new Array();
var group2 = new Array();
var onSort = new Array();
var rolecheck = false;
// the main method that the end user will execute to setup the DLB
var configureBoxes = function(options) {
	var index = settings.push({
		box1View : 'box1View',
		box1Storage : 'box1Storage',
		box1Filter : 'box1Filter',
		box1Clear : 'box1Clear',
		box1Counter : 'box1Counter',
		box2View : 'box2View',
		box2Storage : 'box2Storage',
		box2Filter : 'box2Filter',
		box2Clear : 'box2Clear',
		box2Counter : 'box2Counter',
		to1 : 'to1',
		allTo1 : 'allTo1',
		to2 : 'to2',
		allTo2 : 'allTo2',
		transferMode : 'move',
		sortBy : 'text',
		useFilters : true,
		useCounters : true,
		useSorting : true,
		selectOnSubmit : true
	});
	index--;
	// merge default settings w/ user defined settings (with user-defined
	// settings overriding defaults)
	$.extend(settings[index], options);
	// define box groups
	group1.push({
		view : settings[index].box1View,
		storage : settings[index].box1Storage,
		filter : settings[index].box1Filter,
		clear : settings[index].box1Clear,
		counter : settings[index].box1Counter,
		index : index
	});
	group2.push({
		view : settings[index].box2View,
		storage : settings[index].box2Storage,
		filter : settings[index].box2Filter,
		clear : settings[index].box2Clear,
		counter : settings[index].box2Counter,
		index : index
	});
	// define sort function
	if (settings[index].sortBy == 'text') {
		onSort.push(function(a, b) {
			var aVal = a.text.toLowerCase();
			var bVal = b.text.toLowerCase();
			if (aVal < bVal) {
				return -1;
			}
			if (aVal > bVal) {
				return 1;
			}
			return 0;
		});
	} else {
		onSort.push(function(a, b) {
			var aVal = a.value.toLowerCase();
			var bVal = b.value.toLowerCase();
			if (aVal < bVal) {
				return -1;
			}
			if (aVal > bVal) {
				return 1;
			}
			return 0;
		});
	}
	// configure events
	if (settings[index].useFilters) {
		$('#' + group1[index].filter).keyup(function() {
		});
		$('#' + group2[index].filter).keyup(function() {
		});
		$('#' + group1[index].clear).click(function() {
			clearFilter(group1[index]);
		});
		$('#' + group2[index].clear).click(function() {
			clearFilter(group2[index]);
		});
	}
	if (isMoveMode(settings[index])) {
		$('#' + group2[index].view).dblclick(function() {
			moveSelected(group2[index], group1[index]);
		});
		$('#' + settings[index].to1).click(function() {
			rolecheck = true;
			moveSelected(group2[index], group1[index]);
			$("#box1View").prop('disabled', false);
		});
		$('#' + settings[index].allTo1).click(function() {
			moveAll(group2[index], group1[index]);
		});
	} else {
		$('#' + group2[index].view).dblclick(function() {
			removeSelected(group2[index], group1[index]);
		});
		$('#' + settings[index].to1).click(function() {
			removeSelected(group2[index], group1[index]);
		});
		$('#' + settings[index].allTo1).click(function() {
			removeAll(group2[index], group1[index]);
		});
	}
	$('#' + group1[index].view).dblclick(function() {
		moveSelected(group1[index], group2[index]);
	});
	$('#' + settings[index].to2).click(function() {
		rolecheck = false;
		moveSelected(group1[index], group2[index]);
		$("#box1View").prop('disabled', true);
	});
	$('#' + settings[index].allTo2).click(function() {
		moveAll(group1[index], group2[index]);
	});
	// initialize the counters
	if (settings[index].useCounters) {
		updateLabel(group1[index]);
		updateLabel(group2[index]);
	}
	// pre-sort item sets
	if (settings[index].useSorting) {
		sortOptions(group1[index]);
		sortOptions(group2[index]);
	}
	// hide the storage boxes
	$('#' + group1[index].storage + ',#' + group2[index].storage).css(
			'display', 'none');
	// attach onSubmit functionality if desired
	if (settings[index].selectOnSubmit) {
		$('#' + settings[index].box2View).closest('form').submit(
				function() {
					$('#' + settings[index].box2View).children('option').attr(
							'selected', 'selected');
				});
	}
};
function updateLabel(group) {
	var showingCount = $("#" + group.view + " option").size();
	var hiddenCount = $("#" + group.storage + " option").size();
	$("#" + group.counter).text(
			'Showing ' + showingCount + ' of ' + (showingCount + hiddenCount));
};
function filter(group) {
	var index = group.index;
	var filterLower;
	if (settings[index].useFilters) {
		filterLower = $('#' + group.filter).val().toString().toLowerCase();
	} else {
		filterLower = '';
	}
	$('#' + group.view + ' option').filter(function(i) {
		var toMatch = $(this).text().toString().toLowerCase();
		return toMatch.indexOf(filterLower) == -1;
	}).appendTo('#' + group.storage);
	$('#' + group.storage + ' option').filter(function(i) {
		var toMatch = $(this).text().toString().toLowerCase();
		return toMatch.indexOf(filterLower) != -1;
	}).appendTo('#' + group.view);
	try {
		$('#' + group.view + ' option').removeAttr('selected');
	} catch (ex) {
		// swallow the error for IE6
	}
	if (settings[index].useSorting) {
		sortOptions(group);
	}
	if (settings[index].useCounters) {
		updateLabel(group);
	}
};
function sortOptions(group) {
	var $toSortOptions = $('#' + group.view + ' option');
	$toSortOptions.sort(onSort[group.index]);
	$('#' + group.view).empty().append($toSortOptions);
};
function moveSelected(fromGroup, toGroup) {
	if (isMoveMode(settings[fromGroup.index])) {
		if (rolecheck) {
			var a = $('#' + fromGroup.view + ' option:selected').toArray();
			var roleCheck = false;
			if (a.length == 1 && a[0].innerHTML == "Administrator") {
				var status = CheckAdministratorRole();
				if (status) {
					$('#' + fromGroup.view + ' option:selected').appendTo(
							'#' + toGroup.view).toArray();
					rolecheck = false;
				} else {
					return false;
				}
			} else if (a.length > 1) {
				var admin = false;
				var number = 0;
				for (var i = 0; i < a.length; i++) {
					if (a[i].innerHTML == "Administrator") {
						roleCheck = CheckAdministratorRole();
						admin = true;
						number = i;
						break;
					}
				}
				if (admin) {
					if (roleCheck) {
						a.splice(number, 1);
						$(a).appendTo('#' + toGroup.view).toArray();
					}
				} else {
					if (roleCheck) {
						$('#' + fromGroup.view + ' option:selected').appendTo(
								'#' + toGroup.view).toArray();
						rolecheck = false;
					}
				}
			} else {
				$('#' + fromGroup.view + ' option:selected').appendTo(
						'#' + toGroup.view).toArray();
				rolecheck = false;
			}
		} else
			$('#' + fromGroup.view + ' option:selected').appendTo(
					'#' + toGroup.view);
	} else {
		$('#' + fromGroup.view + ' option:selected:not([class*=copiedOption])')
				.clone().appendTo('#' + toGroup.view).end().end().addClass(
						'copiedOption');
	}
	try {
		$('#' + fromGroup.view + ' option,#' + toGroup.view + ' option')
				.removeAttr('selected');
	} catch (ex) {
		// swallow the error for IE6
	}

	if (settings[fromGroup.index].useCounters) {
		updateLabel(fromGroup);
	}
};
function moveAll(fromGroup, toGroup) {
	if (isMoveMode(settings[fromGroup.index])) {
		$('#' + fromGroup.view + ' option').appendTo('#' + toGroup.view);
	} else {
		$('#' + fromGroup.view + ' option:not([class*=copiedOption])').clone()
				.appendTo('#' + toGroup.view).end().end().addClass(
						'copiedOption');
	}
	try {
		$('#' + fromGroup.view + ' option,#' + toGroup.view + ' option')
				.removeAttr('selected');
	} catch (ex) {
	}
	if (settings[fromGroup.index].useCounters) {
		updateLabel(fromGroup);
	}
}
function removeSelected(removeGroup, otherGroup) {
	$('#' + otherGroup.view + ' option.copiedOption').add(
			'#' + otherGroup.storage + ' option.copiedOption').remove();
	try {
		$('#' + removeGroup.view + ' option:selected').appendTo(
				'#' + otherGroup.view).removeAttr('selected');
	} catch (ex) {
		// swallow the error for IE6
	}
	$('#' + removeGroup.view + ' option').add(
			'#' + removeGroup.storage + ' option').clone().addClass(
			'copiedOption').appendTo('#' + otherGroup.view);

	if (settings[removeGroup.index].useCounters) {
		updateLabel(removeGroup);
	}
}
function removeAll(removeGroup, otherGroup) {
	$('#' + otherGroup.view + ' option.copiedOption').add(
			'#' + otherGroup.storage + ' option.copiedOption').remove();
	try {
		$('#' + removeGroup.storage + ' option').clone().addClass(
				'copiedOption').add('#' + removeGroup.view + ' option')
				.appendTo('#' + otherGroup.view).removeAttr('selected');
	} catch (ex) {
		// swallow the error for IE6
	}
	if (settings[removeGroup.index].useCounters) {
		updateLabel(removeGroup);
	}
};
function clearFilter(group) {
	$('#' + group.filter).val('');
	$('#' + group.storage + ' option').appendTo('#' + group.view);
	try {
		$('#' + group.view + ' option').removeAttr('selected');
	} catch (ex) {
		// swallow the error for IE6
	}
	if (settings[group.index].useSorting) {
		sortOptions(group);
	}
	if (settings[group.index].useCounters) {
		updateLabel(group);
	}
};
function isMoveMode(currSettings) {
	return currSettings.transferMode == 'move';
};
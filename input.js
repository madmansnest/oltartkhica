$.getScript("input_codes.js");

var current_variants = [];

function add_letter(c) {
  $("#current_code").text($("#current_code").text() + String.fromCharCode(c));
}

function erase_last() {
  if ($("#current_code").text()=="") {
    $("#ithkuil_input").val($("#ithkuil_input").val().substr(0, $("#ithkuil_input").val().length - 1));
  }
  else {
      $("#current_code").text($("#current_code").text().substr(0, $("#current_code").text().length - 1));
  }
}

function erase_all() {
  $("#current_code").text('');
}

function update_variants() {
  var s = $("#current_code").text();
  var keys = input_keys();
  if ($.inArray(s, keys) == -1) {
    current_variants = [];
    $("#input_matches").text('');
  }
  else {
    var im = "";
    var i = 1;
    current_variants = input_codes[s];
    $.each(current_variants, function(i, j) {
      im = im + (i+1) + j + " ";
      $("#input_matches").text(im);
    });
  }
}

function choose_variant(i) {
  if (i<=current_variants.length) {
    var selected_variant = current_variants[i-1]
    $("#ithkuil_input").val($("#ithkuil_input").val() + selected_variant[selected_variant.length-1]);
    current_variants = [];
    $("#input_matches").text('');
    $("#current_code").text('');
  }
}

function input_keys() {
  return $.map(input_codes, function(element, index) {
    return index
  });
}

$(document).ready(function() {
  $(document).keydown(function(event) {
    event.stopPropagation();
    if (!$("#ithkuil_input").is(":focus")) {
      if (event.keyCode >= 65 && event.keyCode <= 90) {
        add_letter(event.keyCode);
      }
      else if (event.keyCode >= 48 && event.keyCode <= 57) {
        choose_variant(event.keyCode-48);
      }
      else if (event.keyCode == 8) {
        erase_last();
      }
      else if (event.keyCode == 27) {
        erase_all();
      }
      else if (event.keyCode == 32) {
        choose_variant(1);
      }
      update_variants();
      event.stopPropagation();
    };
  });
});

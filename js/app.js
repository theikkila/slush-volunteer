// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

// Timing submit time
var start = Date.now();


$(document).foundation();

// Data Abide Checkbox Group Validation
$(document).foundation({
    abide: {
        validators: {
            checkbox_limit: function(el, required, parent) {
                var group = parent.closest('.checkbox-group');
                var min = group.attr('data-abide-validator-min');
                var checked = group.find(':checked').length;
                if (checked >= min) {
                    group.find('small.error').hide();
                    return true;
                } else {
                    group.find('small.error').css({
                        display: 'block'
                    });
                    return false;
                }
            }
        }
    }
});

$('#register').on('valid.fndtn.abide', function() {
  // Handle the submission of the form
  var data = {
    data: $(this).serializeArray(),
    time_to_submit: (Date.now() - start)
  };
  $.ajax({url: "https://aleksandria.slush.org/documents/volunteer-application", method: 'POST', data: JSON.stringify(data)})
  .done(function (doc) {
      // if successful returnes created document, show happy congratz-dialog
      console.log(doc);
      alert("Success!!!");
  }).fail(function () {
      // Something happened during submit, show alert.
      alert("Fail.. We're sorry!");
  });
});

// Smooth scroll for in page links
$(function(){
    var target, scroll;

    $("a[href*=#]:not([href=#])").on("click", function(e) {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            target = $(this.hash);
            target = target.length ? target : $("[id=" + this.hash.slice(1) + "]");

            if (target.length) {
                if (typeof document.body.style.transitionProperty === 'string') {
                    e.preventDefault();
                  
                    var avail = $(document).height() - $(window).height();

                    scroll = target.offset().top;
                  
                    if (scroll > avail) {
                        scroll = avail;
                    }

                    $("html").css({
                        "margin-top" : ( $(window).scrollTop() - scroll ) + "px",
                        "transition" : "1s ease-in-out"
                    }).data("transitioning", true);
                } else {
                    $("html, body").animate({
                        scrollTop: scroll
                    }, 1000);
                    return;
                }
            }
        }
    });

    $("html").on("transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd", function (e) {
        if (e.target == e.currentTarget && $(this).data("transitioning") === true) {
            $(this).removeAttr("style").data("transitioning", false);
            $("html, body").scrollTop(scroll);
            return;
        }
    });
});
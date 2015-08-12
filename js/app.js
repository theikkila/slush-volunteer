// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

// Timing submit time
var start = Date.now();
var endpoint = "https://aleksandria.slush.org";
//var endpoint = "http://localhost:8080";

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
  ga('send', 'event', 'application', 'submit');
  $("#submit-btn").attr('disabled', 1);
  var data = {
    data: $(this).serializeArray(),
    time_to_submit: (Date.now() - start)
  };
  $.ajax({
    url: endpoint + "/documents/volunteer-application",
    method: 'POST',
    data: JSON.stringify(data),
    headers: {'content-type': "application/json; charset=utf-8"}})
  .done(function (doc) {
      $("#submit-btn").attr('disabled', 0);
      // if successful returnes created document, show happy congratz-dialog
      Raven.captureMessage('application submit succeed')
      $('#apply-submit').foundation('reveal', 'open');
      alertify.log("Application saved!", "success");
      alertify.log("You will be redirected in 15 seconds...", "success");
      setTimeout(function () {
          Raven.captureMessage('Application is redirecting...')
          window.location = "http://www.slush.org/";
      }, 15000);
  }).fail(function () {
      $("#submit-btn").attr('disabled', 0);
      Raven.captureMessage('application submit failed')
      // Something happened during submit, show alert.
      alertify.error("Oh! Sorry, something nasty happened! Please try again later or contact us!");
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
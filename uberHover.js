/* 
 * uberHover.js v1.0
 * Copyright 2015 Joah Gerstenberg (www.joahg.com)
 */

(function($) { 
  $.fn.uberHover = function(_opt) {
    _opt = _opt || {};

    // set defaults for options
    var opt = {
      demo: !!_opt.demo
    };

    // only allow to be run on uls
    if (!$(this).is('ul')) return false;

    // add class for uberHover styling
    $(this).addClass('uberHover');

    // if demoing, add class
    if (opt.demo) $(this).addClass('demo');

    // declare variables
    var overPolygon = false, remPolygon;

    // master hover function on dropdown descendants 
    // (on mouseenter)
    $(this).find('.dropdown, .dropdown-submenu').hover(function() {

      // since user is hovering over link, he is obviously not hovering over the polygon
      overPolygon = false;

      // if there is a timer going about to remove the polygon, clear the timer
      if (!remPolygon) clearInterval(remPolygon);

      // go ahead and remove the polygon if it exists
      $('#hoverHelper').remove()

      // remove any class-hovers
      $('.top-nav .navbar-left > li.dropdown.hover').removeClass('hover');

      // function to trigger on mousemove
      $(this).bind('mousemove', function(e) {

        // if the mousemove function is being called for the parent li, while hovering over the child dropdown, return false and exit
        if ($(this).is('.dropdown') && ($(this).find('ul').offset().top - e.pageY) < 1) return false;

        // set the hovered link as the active list item
        window.$activeLi = $(this);

        // remove the polygon
        $('#hoverHelper').remove()

        // get dropdown menu, declare points variable
        var $ul = $(this).find('> ul.dropdown-menu'), points;

        // if this is a top-level dropdown
        if ($(this).is('.dropdown')) {

          // get width and height of the needed svg area
          var width = $ul.width(),
              height = $ul.offset().top - e.pageY;

          // if height is below 1 (aka already hovering over the dropdown menu), return false and exit.
          if (height < 1) return false;

          // define points for polygon
          //(e.pageX - $ul.offset().left).toString() + ' 0,
          points = $(this).width().toString() + ' -5, 0 -5, 0 ' + height.toString() + ', ' + width.toString() + ' ' + height.toString();
         
          style = 'left:' + ($(this).offset().left - $(this).parent().offset().left) + 'px;bottom:0;';

        // if this is a non-top-level dropdown, go through same process
        } else if ($(this).is('.dropdown-submenu')) {
          var width = $ul.offset().left - e.pageX,
              height = $ul.height();

          if (width < 1) return false;

          //(e.pageY - $ul.offset().top + 3).toString()

          points = '-5 ' + $(this).height().toString() + ', ' + '-5 0, ' + width.toString() + ' 0, ' + width.toString() + ' ' + height.toString();
          style = 'top:' + ($(this).offset().top - $(this).parent().offset().top).toString() + 'px;right:0;';
        }

        // add the hoverhelper svg to the dom (inside the parent ul)
        $(this).parent().prepend('<div id="hoverHelper" style="' + style + '"><a href="' + $(this).find(' > a').attr('href') + '"><?xml version="1.0" standalone="no"?><svg width="' + width + '" height="' + height + '" version="1.1" xmlns="http://www.w3.org/2000/svg"><polygon points="' + points + '" /></svg></a></div>');

        // set the hover action for the polygon
        // (on mouseenter)
        $('#hoverHelper polygon').hover(function() {

          // set overPolygon to true
          overPolygon = true;

          // remove the hover class from any hovered lis
          $('.uberHover li.hover').not($(window.$activeLi)).removeClass('hover');

          // add the hover class to the active list item
          $(window.$activeLi).addClass('hover');

          // set the timeout to remove the svg after 500ms
          setTimeout(function() {
            $('#hoverHelper').remove();
            $('.uberHover li.hover').removeClass('hover');
          }, 500);

        // (on mouseleave)
        }, function() {

          // set overPolygon to false
          overPolygon = false;

          // remove the hover class from any hovered lis
          $('.uberHover li.hover').removeClass('hover');
        });
      });

    // (on mouseleave)
    }, function() {
      $('.uberHover li.hover').removeClass('hover');

      // set the timer to automatically remove the polygon after 10ms if user isn't hoverin over it
      remPolygon = setTimeout(function() {
        if (!overPolygon) {
          $('#hoverHelper').remove();
        }
      }, 10);

      // remove the mousemove binding
      $(this).unbind('mousemove');
    });
  };
})(jQuery);
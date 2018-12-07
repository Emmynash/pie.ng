/* Theme Name: Admiria - Responsive Bootstrap 4 Admin Dashboard & Frontend
   Author: Themesbrand
   File Description:Main JS file of the template
*/


!function(n){"use strict";function t(){n(".navbar-nav a").bind("click",function(t){var i=n(this);n("html, body").stop().animate({scrollTop:n(i.attr("href")).offset().top-0},1500,"easeInOutExpo"),t.preventDefault()})}function i(){n(window).load(function(){n(".sticky").sticky({topSpacing:0})})}function a(){n(".image-popup").magnificPopup({type:"image",closeOnContentClick:!0,mainClass:"mfp-fade",gallery:{enabled:!0,navigateByImgClick:!0,preload:[0,1]}})}function o(){t(),i(),a()}o()}(jQuery);


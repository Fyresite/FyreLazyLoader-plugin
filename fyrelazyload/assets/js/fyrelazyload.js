(function($) {

    var pluginUrl = lazyLocation.pluginsUrl + '/fyrelazyload';
    
    $('[data-src]').each(function (index, el) {
        if (isScrolledIntoView(el)) { 
            el.src = $(el).data('src'); 
        } else {
            el.src = pluginUrl + '/assets/img/loader.gif'; 
        }  
    }); 

    $(window).on('scroll', function(e) {
      $('[data-src]').each(function (index, el) {
        if (isScrolledIntoView(el)) {
          el.src = $(el).data('src');
        }
      });
    });

    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

})(jQuery);
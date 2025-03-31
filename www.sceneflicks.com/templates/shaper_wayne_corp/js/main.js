/**
 * @package Helix Ultimate Framework
 * @author JoomShaper https://www.joomshaper.com
 * @copyright Copyright (c) 2010 - 2018 JoomShaper
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 or Later
*/

jQuery(function ($) {

    // Stikcy Header
    if ($('body').hasClass('sticky-header')) {
        var header = $('#sp-header');

        if($('#sp-header').length) {
            var headerHeight = header.outerHeight();
            var stickyHeaderTop = header.offset().top;
            var stickyHeader = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > stickyHeaderTop) {
                    header.addClass('header-sticky');
                } else {
                    if (header.hasClass('header-sticky')) {
                        header.removeClass('header-sticky');
                    }
                }
            };
            stickyHeader();
            $(window).scroll(function () {
                stickyHeader();
            });
        }

        if ($('body').hasClass('layout-boxed')) {
            var windowWidth = header.parent().outerWidth();
            header.css({"max-width": windowWidth, "left": "auto"});
        }
    }

    // go to top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.sp-scroll-up').fadeIn();
        } else {
            $('.sp-scroll-up').fadeOut(400);
        }
    });

    $('.sp-scroll-up').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    // Preloader
    $(window).on('load', function () {
        $('.sp-preloader').fadeOut(500, function() {
            $(this).remove();
        });
    });

    //mega menu
    $('.sp-megamenu-wrapper').parent().parent().css('position', 'static').parent().css('position', 'relative');
    $('.sp-menu-full').each(function () {
        $(this).parent().addClass('menu-justify');
    });

    // Offcanvs
    $('#offcanvas-toggler').on('click', function (event) {
        event.preventDefault();
        $('.offcanvas-init').addClass('offcanvas-active');
    });

    $('.close-offcanvas, .offcanvas-overlay').on('click', function (event) {
        event.preventDefault();
        $('.offcanvas-init').removeClass('offcanvas-active');
    });

    $(document).on('click', '.offcanvas-inner .menu-toggler', function(event){
        event.preventDefault();
        $(this).closest('.menu-parent').toggleClass('menu-parent-open').find('>.menu-child').slideToggle(400);
    });

    //Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Article Ajax voting
    $('.article-ratings .rating-star').on('click', function (event) {
        event.preventDefault();
        var $parent = $(this).closest('.article-ratings');

        var request = {
            'option': 'com_ajax',
            'template': template,
            'action': 'rating',
            'rating': $(this).data('number'),
            'article_id': $parent.data('id'),
            'format': 'json'
        };

        $.ajax({
            type: 'POST',
            data: request,
            beforeSend: function () {
                $parent.find('.fa-spinner').show();
            },
            success: function (response) {
                var data = $.parseJSON(response);
                $parent.find('.ratings-count').text(data.message);
                $parent.find('.fa-spinner').hide();

                if(data.status)
                {
                    $parent.find('.rating-symbol').html(data.ratings)
                }

                setTimeout(function(){
                    $parent.find('.ratings-count').text('(' + data.rating_count + ')')
                }, 3000);
            }
        });
    });
    // For top bar
      $('#sp-top-bar, #sp-header').wrapAll("<div class='header-wrapper'></div>")
      
    //  Cookie consent
    $('.sp-cookie-allow').on('click', function(event) {
        event.preventDefault();

        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = "spcookie_status=ok" + expires + "; path=/";

        $(this).closest('.sp-cookie-consent').fadeOut();
    });

    //Template Related JS
    $(".sppb-testimonial-pro .sppb-item").each(function(){
        $(this).find(".sppb-testimonial-message, .sppb-addon-testimonial-pro-footer").wrapAll('<div class="sp-testimonial-wrap-content"></div>')
    })

    if (!$('.sp-page-title').length>0){
        $('body:not(.home-page)').addClass("no-page-title")
    }

    //input field animation
    $('input[type="text"],input[type="password"], input[type="email"], textarea').each(function(){
        let $this = $(this);
        $this.wrap('<div class="sp-input-wrap"></div>');
        let placeHolder = $this.context.placeholder;
        let wrap = $this.parent('.sp-input-wrap');
        wrap.append('<span>' + placeHolder +'</span>')
        $this.focus(function(){
            wrap.addClass('active')
            $this.attr('placeholder', '')
        })
        $this.focusout(function(){
            $this.attr('placeholder', placeHolder)
            if ($this.val().length<1){
                wrap.removeClass('active')
            }
        })
    })

    //For react only
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var newNodes = mutation.addedNodes;
            if (newNodes !== null) {
                var $nodes = $(newNodes);

                $nodes.each(function () {
                    var $node = $(this);

                    $node.find('.sppb-testimonial-pro .sppb-item').each(function () {
                        $(this).find(".sppb-testimonial-message, .sppb-addon-testimonial-pro-footer").wrapAll('<div class="sp-testimonial-wrap-content"></div>')
                    });

                    $node.find('#slider').each(function () {

                        if ($('#carousel').is('.flexslider')) {
                            // Thumb Gallery
                            var $sppbTgOptions = $('.sppb-tg-slider');
                            // Autoplay
                            var $autoplay = $sppbTgOptions.data('sppb-tg-autoplay');
                            // arrows
                            var $arrows = $sppbTgOptions.data('sppb-tg-arrows');
                            $('#carousel').flexslider({
                                animation: 'slide',
                                controlNav: false,
                                directionNav: $arrows,
                                animationLoop: false,
                                slideshow: $autoplay,
                                minItems: 5,
                                move: 1,
                                itemWidth: 270,
                                itemMargin: 15,
                                asNavFor: '#slider'
                            });
                            $('#slider').flexslider({
                                animation: "fade",
                                controlNav: false,
                                directionNav: $arrows,
                                animationLoop: false,
                                slideshow: $autoplay,
                                sync: "#carousel"
                            });
                        }
                    });
                });
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };
    // Pass in the target node, as well as the observer options
    observer.observe(document.body, config);
});

"use strict";
var quantity_more_switches = document.querySelectorAll(".quantity .more");
var quantity_less_switches = document.querySelectorAll(".quantity .less");

if(quantity_more_switches.length) for( var i = 0; i < quantity_more_switches.length; i++ ) {
    quantity_more_switches[i].addEventListener('click', function(e){
        e.preventDefault();
        var input = this.parentElement.getElementsByClassName('quantity-input')[0];
        var num = this.parentElement.getElementsByClassName('num')[0]; 
        num.innerHTML = ++input.value;
    });
}

if(quantity_less_switches.length) for( var i = 0; i < quantity_less_switches.length; i++ ) {
    quantity_less_switches[i].addEventListener('click', function(e){
        e.preventDefault();
        var input = this.parentElement.getElementsByClassName('quantity-input')[0];
        if(input.value == 1) return;
        var num = this.parentElement.getElementsByClassName('num')[0];
      num.innerHTML = --input.value; 
    });
}


function getCartCount() {
  jQuery.ajax({
    url: '/cart.js',
    dataType: 'json',
    method: 'GET'
  }).done(function(data){ 
    var cart_count = document.getElementById('cart');
 
    if(data.item_count > 0){
      cart_count.innerHTML ='<span class="cart-count">'+ data.item_count  +'</span>'
    } else {
     cart_count.innerHTML =''
    }

  })
} 


var mini_cart = document.getElementById('mini-cart');
if(mini_cart) {
  

 
  function updateCart() {
    jQuery.ajax({
        url: '/cart.js',
        dataType: 'json',
      method: 'GET'
    }).done(function(data){

      if(window.BOLD && BOLD.common && BOLD.common.cartDoctor && typeof BOLD.common.cartDoctor.fix === 'function'){
        data = BOLD.common.cartDoctor.fix(data); 
      }

      getCartCount()
      var html = '';
        if(data.items.length == 0){
            html = '<div class="empty-cart-message">Your cart is empty</div>';
            document.querySelector('#mini-cart .cart-total-section').classList.add('hide');
        } else {
           
            for(var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                html += '<div class="cart-item item-'+item.variant_id+'"> \
                    <a href="'+item.url+'" class="cart-item-image"> \
                        <img src="'+item.image+'"> \
                    </a> \
                    <h3>'+item.title+'</h3> \
                    <div class="quantity-container"> \
                    <div class="quantity"> \
                        <input type="hidden" class="item-key" name="key" value="'+item.variant_id+'"> \
                        <input type="hidden" class="quantity-input" value="'+item.quantity+'" name="quantity"> \
                        <a href="#!" class="less">-</a> \
                        <span class="num">'+item.quantity+'</span> \
                        <a href="#!" class="more">+</a> \
                    </div> \
                    </div> \
                    <div class="final-price-container">$'+(item.line_price/100).toFixed(2)+'</div> \
                    <div class="remove-container"> \
                    <a class="remove-item" data-key="'+item.variant_id+'" href="#!"> \
                        <i class="fa fa-trash" title="Remove" aria-hidden="true"></i> \
                    </a> \
                    </div> \
                </div>';
            }
            document.querySelector('#mini-cart .cart-total-section').classList.remove('hide');
        }

        document.querySelector('#mini-cart .cart-total .total').innerHTML = '$' + (data.total_price / 100).toFixed(2);
        document.querySelector('#mini-cart .cart-items').innerHTML = html;

        var quantity_more_switches = document.querySelectorAll("#mini-cart .quantity .more");
        var quantity_less_switches = document.querySelectorAll("#mini-cart .quantity .less");

        if(quantity_more_switches.length) for( var i = 0; i < quantity_more_switches.length; i++ ) {
            quantity_more_switches[i].addEventListener('click', function(e){
                e.preventDefault();
                var input = this.parentElement.getElementsByClassName('quantity-input')[0];
                var num = this.parentElement.getElementsByClassName('num')[0];
                num.innerHTML = ++input.value;
            });
        }

        if(quantity_less_switches.length) for( var i = 0; i < quantity_less_switches.length; i++ ) {
            quantity_less_switches[i].addEventListener('click', function(e){
                e.preventDefault();
                var input = this.parentElement.getElementsByClassName('quantity-input')[0];
                if(input.value == 1) return;
                var num = this.parentElement.getElementsByClassName('num')[0];
                num.innerHTML = --input.value;
            });
        }

      if(window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function'){
        BOLD.common.eventEmitter.emit('BOLD_COMMON_cart_loaded', data);
      }

    });
  }

  var mini_cart_inner = mini_cart.getElementsByClassName('cart-inner');
  if(mini_cart_inner.length) mini_cart_inner[0].addEventListener('click', function(e){
    if(!e.target.matches(".btn")){
     e.stopPropagation();
    }
  });
  
  var close_cart = mini_cart.getElementsByClassName('close-cart');
  if(close_cart.length) for( var i = 0; i < close_cart.length; i++ ){
    close_cart[i].addEventListener('click', function(e){

      e.preventDefault();
      document.body.classList.remove('mini-cart-active');
    }); 
  }
  
  mini_cart.addEventListener('click', function(e){
    if (!window.BOLD.csp){e.preventDefault();};
    document.body.classList.remove('mini-cart-active');
  });
  
  var cart_links = document.getElementsByClassName('cart-link');
  if(cart_links.length) for( var i = 0; i < cart_links.length; i++ ) {
    cart_links[i].addEventListener('click', function (e){
      e.preventDefault();
      document.body.classList.toggle('mini-cart-active');
      document.body.classList.remove('mobile-menu-active');
      updateCart();
    });
  }
  
  var cart_items = document.getElementsByClassName('cart-items');
  if(cart_items.length) cart_items[0].addEventListener('click', function(e){
    var trg = e.target;
    if(trg.parentNode.classList.contains('remove-item')) {
      e.preventDefault();
      e.stopPropagation();
      var key = trg.parentNode.getAttribute('data-key');
      
      var updates = {};
      updates[key] = 0;
      
      jQuery.ajax({
        url: '/cart/update.js',
        dataType: 'json',
        method: 'POST',
        data: {
          updates: updates
        }
      }).done(function(){
        var row = document.querySelector('.cart-item.item-'+key);
        if(row) row.remove();
        updateCart();
      });
    } else if(trg.classList.contains('less') || trg.classList.contains('more')) {
      var key = trg.parentNode.getElementsByClassName('item-key')[0].value;
      var quantity = trg.parentNode.getElementsByClassName('quantity-input')[0].value;
      
      var updates = {};
      updates[key] = quantity;
      
      jQuery.ajax({
        url: '/cart/update.js',
        dataType: 'json',
        method: 'POST',
        data: {
          updates: updates
        }
      }).done(function(){
        updateCart();
      });
    }
  });
}


var add_to_cart = document.querySelectorAll('.product .add-to-cart');
if(add_to_cart.length){
    for( var i = 0; i < add_to_cart.length; i++ ) {
        add_to_cart[i].addEventListener('click', function(e){
            e.preventDefault();
            if(this.classList.contains('product-added')) return;
           
            if(document.getElementById('ProductSelect-product-template')) {
				var id = document.getElementById('ProductSelect-product-template').value;
            } else {
              var id = this.parentNode.parentNode.getElementsByClassName('variation-id');
              if(id.length) id = id[0].value;
            }

            var quantity = this.parentNode.parentNode.getElementsByClassName('quantity-input');
            if(id) {
                if(!quantity.length) quantity = 1;
                else quantity = quantity[0].value;

                var that = this;
                jQuery.ajax({
                    url: '/cart/add.js',
                    dataType: 'json',
                    method: 'POST',
                    data: {
                        quantity: quantity, id: id
                    }
                }).done(function(data){
                    getCartCount();
                    that.classList.add('product-added');
                    setTimeout(function(){
                        that.classList.remove('product-added');
                    }, 4000);
                }).fail(function(){
                    that.classList.add('product-error');
                    setTimeout(function(){
                        that.classList.remove('product-error');
                    }, 4000);
                });
            }
        });
    }
}

var mobile_menu_switch = document.getElementsByClassName('mobile-menu-activator');
if(mobile_menu_switch.length) for( var i = 0; i < mobile_menu_switch.length; i++ ){
  mobile_menu_switch[i].addEventListener('click', function(e){
  	e.preventDefault();
    document.body.classList.add('mobile-menu-active');
  }); 
}

var mobile_menu_close = document.getElementsByClassName('mobile-menu-close');
if(mobile_menu_close.length) for( var i = 0; i < mobile_menu_close.length; i++ ){
  mobile_menu_close[i].addEventListener('click', function(e){
  	e.preventDefault();
    document.body.classList.remove('mobile-menu-active');
  });
}

function animate(elem, style, unit, from, to, time, prop) {
    if (!elem) {
        return;
    }
    var start = new Date().getTime(),
        timer = setInterval(function () {
            var step = Math.min(1, (new Date().getTime() - start) / time);
            if (prop) {
                elem[style] = (from + step * (to - from))+unit;
            } else {
                elem.style[style] = (from + step * (to - from))+unit;
            }
            if (step === 1) {
                clearInterval(timer);
            }
        }, 25);
    if (prop) {
          elem[style] = from+unit;
    } else {
          elem.style[style] = from+unit;
    }
}
 



jQuery(document).ready(function($){
  var value = $('.product-form__variants').val();
  var startSlide = $('.product-main-images-slider > div[data-variant='+value+']').index();
    
  var slideNum = $('.product-main-images-pager .pager-slide').length;
  if(slideNum > 4) {
    $('.product-main-images-pager').slick({
      infinite: true,
      slidesToShow: 4,
      swipeToSlide: true,
      asNavFor: '.product-main-images-slider',
      focusOnSelect: true,
      initialSlide: startSlide
    });
    
    var args = {
      infinite: true,
      fade: true,
      asNavFor: '.product-main-images-pager',
      initialSlide: startSlide
    };
  } else {
    var args = {
      infinite: true,
      fade: true,
      initialSlide: startSlide
    };
    
    $('.product-main-images-pager .pager-slide').click(function(){
      const nextIndex = $(this).index()
      const isNewIndex = nextIndex != window.boldCurrentSlickIndex
      $('.product-main-images-slider').slick('slickGoTo', nextIndex);
      window.boldCurrentSlickIndex = nextIndex
      /** BOLD: Trigger variant change code if the slider index changed */
      isNewIndex && $('.product-main-images-slider').trigger('afterChange')
    });
  }

  $('.product-main-images-slider').slick(args);
  
  $('.swatch :radio').change(function() {
    for ( var i = 0; i < $('.swatch :radio').size(); i++ ) {
      if($('.swatch :radio').eq(i).attr('id') == $(this).attr('id')) {
        break;
      }
    }
    $('.swatch').attr('data-option-index', i+1);
    var optionIndex = $(this).closest('.swatch').attr('data-option-index');
    var optionValue = $(this).val();
    var color = $(this).val();
    $('.variant-title').html(' - '+ color);
    $('.product-form__item select').val(color).trigger('change');
  });
  
  
  $('.product-form__item select').change(function(){
    var color = $(this).val();
    $('.variant-title').html(' - '+ color);
    $('.product-form__variants select').val(color).trigger('change');
  });
  
  var stopChange = false;
  var ignoreSlickSwitch = 0;
  $('.product-form .selector-wrapper').change(function(){
//     if(ignoreSlickSwitch > 0) {
//       ignoreSlickSwitch--;
//       return;
//     }
    var value = $('.product-form__variants').val();
    console.log(value);
    if(window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function'){
//       BOLD.common.eventEmitter.emit('BOLD_COMMON_variant_changed');
    }
    $('.product-main-images-pager :not(.slick-cloned) .image-ratio-container[data-variant='+value+']').eq(0).click();

    //Bold Removed
    //stopChange = true;
    stopChange = false;
  });

  $('.product-main-images-slider').on('afterChange', function(event, slick, currentSlide){
    if(stopChange) {
      console.log("TTT");
      if(window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function'){
//         BOLD.common.eventEmitter.emit('BOLD_COMMON_variant_changed');
      }
      stopChange = false;
      return;
    }
    var variant = $('.product-main-images-slider .slick-current:not(.slick-cloned) .image-ratio-container').attr("data-variant");
    $('.product-form .product-form__variants').val(variant).trigger('change');

    var text = $('.product-form .product-form__variants option[value="'+variant+'"]').text().trim().split(' / ');
    if(text.length == 2) {
      ignoreSlickSwitch = 3;
      if($('#SingleOptionSelector-0 option[value="'+text[0]+'"]').length > 0) {
        $('#SingleOptionSelector-0').val(text[0]);
        $('#SingleOptionSelector-1').val(text[1]).trigger('change');
      } else {
        $('#SingleOptionSelector-0').val(text[1]);
        $('#SingleOptionSelector-1').val(text[0]).trigger('change');
      }
    } else {
      ignoreSlickSwitch = 2;
      $('#SingleOptionSelector-0').val(text[0]).trigger('change');
    }

    var color = $('.product-form__item select').val();
    if(color) {
      $('.variant-title').html(' - '+ color);
      $('.swatch input[value="'+color+'"]').click();
    }
    
  });
});


/*------------------------------------------------ Fancy Box -----------------------------------------------------*/
jQuery(document).ready(function($) {

	/* Apply fancybox to multiple items */
	
	$(".product-main-images-slider a.product-main-image").fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	200, 
		'overlayShow'	:	false,
      loop: false
	});
	
});
/*----------------------------------------------------------------------------------------------------------------*/

jQuery(document).ready(function($) {
  $(window).load(function(){
  	var str = $(".yotpo-stars .sr-only").text();
    var ind = str.indexOf("star");
    str = str.substring(0, ind);
    str = str.trim();
    console.log(str);
    if(str.length == 1) {
      str = str + ".0";
    }
    $(".yotpo-stars .sr-only").text(str);
  });
  
  $("#site-header").css("top", ($("#announce-bar").outerHeight() - 1 ) + "px");
  var header_height = $("#site-header").outerHeight() + $("#announce-bar").outerHeight() - 2;
  header_height = header_height + "px";
  console.log(parseInt($("#site-header").outerHeight()));
  console.log(parseInt($("#announce-bar").outerHeight()));
  console.log(header_height);
  $("body").css("padding-top", header_height);
  
  var social_top;
  if($(window).width() >= 768) {
//     if($(".single-article").hasClass("type1")) {
//       var social_top = $(".post-banner").height() + 90;
//       var social_right = ($(window).width() - $(".page-width").width()) / 2;
//       $("ul.social-sharing").css("top", social_top + "px");
//       $("ul.social-sharing").css("right", social_right + "px");
//     }
//     else {
      social_top = $(".post-banner").height() + 90;
      var social_right = ($(window).width() - 850) / 2;
      social_right = social_right * 0.9;
      $("ul.social-sharing").css("top", social_top + "px");
      $("ul.social-sharing").css("right", social_right + "px");
//     }
  }
  else {
    if($(".single-article").hasClass("type1")) {
      social_top = $(".post-banner").height() + 75;
      $("ul.social-sharing").css("top", social_top + "px");
      $("ul.social-sharing").css("right", "0");
    }
    else {
      var social_top = $(".post-banner").height() + 95;
      $("ul.social-sharing").css("top", social_top + "px");
      $("ul.social-sharing").css("right", "0");
    }
  }
  /////////
  $(window).scroll(function fix_element() {
    $(".single-article ul.social-sharing").css(
      $(window).scrollTop() > ( social_top - 30 )
        ? { 'position': 'fixed', 'top': '70px' }
        : { 'position': 'fixed', 'top': (social_top - $(window).scrollTop())+"px" }
    );
    return fix_element;
  }());
  /////////
  jQuery( window ).on( "orientationchange", function( event ) {
    setTimeout(function(){
      if($(".single-article").hasClass("type1")) {
        var social_top = $(".post-banner").height() + 75;
        $("ul.social-sharing").css("top", social_top + "px");
        $("ul.social-sharing").css("right", "0");
      }
      else if ($(".single-article").hasClass("type2")) {
        var social_top = $(".post-banner").height() + 95;
        $("ul.social-sharing").css("top", social_top + "px");
        $("ul.social-sharing").css("right", "0");
      }
    }, 100);
  } );
});
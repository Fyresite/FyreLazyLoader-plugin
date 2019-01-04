<?php
/*
Plugin Name:  Fyre Lazy Load
Plugin URI:   
Description:  Lazy load images by leaving out src="URL" and instead using data-src="URL"
Version:      0
Author:       Fyresite.com
Author URI:   https://fyresite.com/
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  wporg
Domain Path:  /languages
*/

// LOAD SCRIPT
	function fyre_lazy_scripts(){

		$dir = plugin_dir_url(__FILE__); 
		wp_register_script('intersectionobserver', $dir .'assets/js/intersection-observer.js', array('jquery'), false, true);    
		wp_enqueue_script('intersectionobserver');
		wp_register_script('fyrelazyload', $dir .'assets/js/fyrelazyload.js', array('jquery','intersectionobserver'), false, true);
		wp_enqueue_script('fyrelazyload');

		//get plugin directory
		wp_localize_script('fyrelazyload', 'lazyLocation', array(
			'pluginsUrl' => plugins_url(),
		));
	}
	add_action( 'wp_enqueue_scripts', 'fyre_lazy_scripts'); 

//ADD LAZY TO WOOCOMMERCE AUTOMATICALLY

	// unhook original woocommerce image call and hook lazy image html
	function fyre_lazy_woocommerce_thumbnail_action_swap() {
		remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
		add_action( 'woocommerce_before_shop_loop_item_title', 'get_fyre_lazy_woocommerce_thumbnail', 99 );
	}
	add_action('init', 'fyre_lazy_woocommerce_thumbnail_action_swap', 99 );

	// get the featured image by ID then populate the attributes, leaving the src empty for lazy load
	function get_fyre_lazy_woocommerce_thumbnail( ) {  
		
		global $product;

		$image_size = apply_filters( 'single_product_archive_thumbnail_size', 'woocommerce_thumbnail' );  
		$img = wp_get_attachment_image_src( $product->thumbnail_id, $image_size);

		echo '<img src="" data-src="'.$img[0].'" width="'.$img[1].'" height="'.$img[2].'" >';

	}

// AUTO LAZY IMAGES DISPLAYED USING the_content()

	function fyre_auto_lazy_content($content){ 
		
		$lazyContent = preg_replace('/\s*\b(src=")/i', ' data-src="', $content);

		return $lazyContent;   
	}

	add_filter( 'the_content', 'fyre_auto_lazy_content' ); 
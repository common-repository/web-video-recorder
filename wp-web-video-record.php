<?php
/**
 * Plugin Name: Web Video Recorder
 * Description: Record video and share as a post
 * Version: 1.0.0
 * Author: RFSOFTLAB
 * License: GPLv2 or later
 *
 * @package web-video-record
 */

defined('ABSPATH') or die('You are not permitted to access');

require_once (plugin_dir_path(__FILE__).'webViedoShortCode.php');
Class WebVideoRecord
{
    public function __construct()
    {
        //hook
        add_action('wp_enqueue_scripts',array(&$this,'webVideoRecordCss'));
    }

/*    public function active(){

    }*/
    function webVideoRecordCss(){
        wp_enqueue_style('webVideoMain',plugins_url('css/webVideoMain.css',__FILE__));
        wp_enqueue_style('webVideo',plugins_url('css/webVideo.css',__FILE__));
        wp_enqueue_style('style',plugins_url('css/style.css',__FILE__));
    }
}
if(class_exists('WebVideoRecord')){
    $objectWebVideoRecord = new WebVideoRecord();
    //activation
//    add_action('init',array(&$objectWebVideoRecord,'active'));
}






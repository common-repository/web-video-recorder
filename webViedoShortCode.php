<?php

//short code
function webVideoInit(){
    //short code
    function webVideoRecordShortCode()
    {
        wp_enqueue_script('webVideoRecordPlugin',plugins_url('js/webVideoRecordPlugin.js',__FILE__));
        wp_enqueue_script('webVideoRecordAdapter-latest',plugins_url('js/adapter-latest.js',__FILE__));
        wp_enqueue_script('webVideoRecordCustomFile',plugins_url('js/webVideoRecordCustomFile.js',__FILE__));
        wp_localize_script('webVideoRecordCustomFile','webVideoRecordObj',
            array(
                    'check_login' => is_user_logged_in(),
                    'create_nonce' => wp_create_nonce("webVideoRecordSpecialString"),
                    'createWebVideoAjaxUrl' => admin_url( 'admin-ajax.php' )
            ));
        ?>
        <div id="message"></div>
        <div id="recorder"></div>
        <?php
    }
    add_shortcode('rf-web-video-plugin','webVideoRecordShortCode');
}
add_action('init','webVideoInit');

function webVideoAjaxUpload()
{
    if(!check_ajax_referer('webVideoRecordSpecialString', 'webVideoSecurity')){
       return wp_send_json_error("Nonce error found");
    }
    $host_addr = $_SERVER['HTTP_HOST'];
    // echo $host_addr;
    //var_dump($_FILES['file']['error']);

    if (is_user_logged_in()) {
        if (isset($_FILES['file']) and !$_FILES['file']['error']) {
            global $current_user, $wpdb;
            $query = "SELECT ID FROM $wpdb->posts ORDER BY ID DESC LIMIT 0,1";
            $result = $wpdb->get_results($query);
            $row = $result[0];
/*            echo "<pre>";
            var_dump($row);
            var_dump($id = $row->ID);*/
            $id = $row->ID;

            if (!empty(sanitize_text_field($_POST['custom_post_title']))) {
                $name = sanitize_text_field($_POST['custom_post_title']);
            } else {
                $name = "Video blog - " . $id;
                //  var_dump($name);
            }
            if (!empty(sanitize_textarea_field($_POST['custom_post_description']))) {
                $descript = sanitize_textarea_field($_POST['custom_post_description']);
            } else {
                $descript = "Video blog description -" . $id;
                //var_dump($descript);
            }
            $u_id = $current_user->ID;
            $filename = sanitize_file_name(uniqid() . date("Y-m-d-H-i-s"));
            $filename = $filename . '.webm';
            $uri = $_SERVER['REQUEST_URI'];
            $ex_uri = explode('/', $uri);
            $get_value = $ex_uri[1];
            //    var_dump($get_value) ;
            $upload = $_SERVER['DOCUMENT_ROOT'] . "/" . $get_value . "/wp-content/";
            $upload1 = "http://" . $host_addr . "/" . $get_value . "/wp-content/";
            $path1 = $upload1 . "uploads/";
            $path = $upload . "uploads/";
            !file_exists($path) && mkdir($path, 0777);
            //    echo $path."<br/>";
            $year_folder = $path . date("Y");
            $month_folder = $year_folder . '/' . date("m");
            $date_folder = $month_folder . '/' . date("d");

            !file_exists($year_folder) && !file_exists(mkdir($year_folder, 0777));
            !file_exists($month_folder) && !file_exists(mkdir($month_folder, 0777));
            !file_exists($date_folder) && !file_exists(mkdir($date_folder, 0777));

            $host_url = $path1 . date("Y") . '/' . date("m") . '/' . date("d") . '/' . $filename;
            //    echo $host_url."<br/>";

            $path = $date_folder . '/' . $filename;
            if (!move_uploaded_file($_FILES['file']['tmp_name'], $path)) {
                echo "problem moving uploaded file";
            }
            $post = array(
                'post_author' => $u_id,
                'post_mime_type' => $_FILES['file']['type'],
                'post_title' => $name,
                'post_content' => $descript . '<br/>' . '[video  width="640" height="480"  webm="' . $host_url . '"]',
                'post_status' => 'publish',
                'post_type' => 'post',
                'guid' => $host_url
            );
            /*    echo "<pre>";
                var_dump($post);*/

            $insert_post = wp_insert_post($post);
            if($insert_post){
                echo "Your post has been uploaded successfully";
            }else{
                echo "Something is wrong.";
            }

            /*   echo "<pre>";
               var_dump($post_id);*/
        } else {
            echo "silence is golden";
        }
    } else {
        echo "User should be logged in to upload video";
    }
    wp_die();
}
add_action('wp_ajax_webVideoUpload','webVideoAjaxUpload');
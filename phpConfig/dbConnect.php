<?php
/*
Site : http:www.smarttutorials.net
Author :muni
*/
require_once 'config.php';

if( isset($_POST['type']) && !empty( isset($_POST['type']) ) ){
    $type = $_POST['type'];
    
    switch ($type) {
        case "save_Contact":
           save_Contact($mysqli);
            break;
        case "delete_contact":
            delete_Contact($mysqli, $_POST['id']);
            break;
        case "getContact":
            getContact($mysqli);
            break;
        default:
            invalidRequest();
    }
}else{
    invalidRequest();
}

/**
 * This function will handle user add, update functionality
 * @throws Exception
 */
function save_Contact($mysqli){
    try{
        $data = array();
        $name = $mysqli->real_escape_string(isset( $_POST['user']['name'] ) ? $_POST['user']['name'] : '');
        $phone = $mysqli->real_escape_string(isset( $_POST['user']['phone'] ) ? $_POST['user']['phone'] : '');
        $address = $mysqli->real_escape_string( isset( $_POST['user']['address'] ) ? $_POST['user']['address'] : '');
        $email = $mysqli->real_escape_string( isset( $_POST['user']['email'] ) ? $_POST['user']['email'] : '');
        $id = $mysqli->real_escape_string( isset( $_POST['user']['id'] ) ? $_POST['user']['id'] : '');
    
        if($name == ''){
            throw new Exception( "Required fields missing, Please enter and submit" );
        }
    
    
        if(empty($id)){
            $query = "INSERT INTO contactdetails (`id`, `name`, phone, `address`, `email`) VALUES (NULL, '$name', '$phone', '$address', '$email')";
        }else{
            $query = "UPDATE contactdetails SET `name` = '$name', phone = '$phone', `address` = '$address', `email` = '$email' WHERE `contactdetails`.`id` = $id";
        }
    
        if( $mysqli->query( $query ) ){
            $data['success'] = true;
            if(!empty($id))$data['message'] = 'User updated successfully.';
            else $data['message'] = 'User inserted successfully.';
            if(empty($id))$data['id'] = (int) $mysqli->insert_id;
            else $data['id'] = (int) $id;
        }else{
            throw new Exception( $mysqli->sqlstate.' - '. $mysqli->error );
        }
        $mysqli->close();
        echo json_encode($data);
        exit;
    }catch (Exception $e){
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}

/**
 * This function will handle user deletion
 * @param string $id
 * @throws Exception
 */
function delete_Contact($mysqli, $id = ''){
    try{
        if(empty($id)) throw new Exception( "Invalid User." );
        $query = "DELETE FROM `contactDetails` WHERE `id` = $id";
        if($mysqli->query( $query )){
            $data['success'] = true;
            $data['message'] = 'User deleted successfully.';
            echo json_encode($data);
            exit;
        }else{
            throw new Exception( $mysqli->sqlstate.' - '. $mysqli->error );
        }
        
    
    }catch (Exception $e){
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}
    
/**
 * This function gets list of users from database
 */
function getContact($mysqli){
    try{
    
        $query = "SELECT * FROM `contactDetails` order by id desc limit 500";
        $result = $mysqli->query( $query );
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $row['id'] = (int) $row['id'];
            $data['data'][] = $row;
        }
        $data['success'] = true;
        echo json_encode($data);exit;
    
    }catch (Exception $e){
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}
    
    


function invalidRequest()
{
    $data = array();
    $data['success'] = false;
    $data['message'] = "Invalid request.";
    echo json_encode($data);
    exit;
}
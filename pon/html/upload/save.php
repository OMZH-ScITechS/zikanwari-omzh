<?php

if( !empty($_FILES['temp']['tmp_name']) ) {
    if (is_uploaded_file($_FILES['temp']['tmp_name'])) {
        if( move_uploaded_file( $_FILES['temp']['tmp_name'], '/var/www/html/upload/temp/'.$_FILES['temp']['name'] ) ) {
            echo 'サーバーへの保存が完了しました。変換処理終了後に効果音が利用可能となります。また、適用されない場合は再読み込みを行ってください。';
        } else {
            echo '保存に失敗しました。再度お試しください。';
        }
    }
} else {
    echo 'errrrrrr';
}
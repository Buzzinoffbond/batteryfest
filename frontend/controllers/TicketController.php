<?php

namespace frontend\controllers;

use frontend\models\Ticket;
use yii\web\NotFoundHttpException;
use yii\web\Controller;
use doamigos\qrcode\formats\MailTo;
use dosamigos\qrcode\QrCode;
use dosamigos\qrcode\lib\Enum;
use yii\imagine\Image;
use Yii;
use yii\web\Response;
use mPDF;

class TicketController extends Controller
{
    public function actionPng($ticket){
        $ticket_data = Ticket::findOne(['ticket'=>$ticket]);
        if ($ticket_data->status === 1) {
            $text = 'http://batteryfest.ru/?ticket='.$ticket_data->ticket;
            $qrcode_file = Yii::getAlias('@webroot/img/qr'.time().'.png');
            $qrcode = QrCode::png($text,$qrcode_file,Enum::QR_ECLEVEL_Q,8);
            $watermark = Yii::getAlias('@webroot/img/watermark-logo.png');
            $image = Image::watermark($qrcode_file,$watermark,[142,137]);
            if (file_exists($qrcode_file)) {
                unlink($qrcode_file);
            }
            Yii::$app->getResponse()->getHeaders()
                ->set('Pragma', 'public')
                ->set('Expires', '0')
                ->set('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                ->set('Content-Transfer-Encoding', 'binary')
                ->set('Content-type', 'image/png');
            Yii::$app->response->format = Response::FORMAT_RAW;
            return $image;
        }
        else{
            throw new NotFoundHttpException('Ticket not found');
        }
    }

    public function actionPdf($ticket_hash){
        $ticket = Ticket::findOne(['ticket'=>$ticket_hash]);
        $mpdf = new mPDF();
        $mpdf->WriteHTML($this->renderPartial('pdf',['ticket'=>$ticket]));
        $mpdf->Output('batteryfest_ticket.pdf', 'I'); //
        exit;
    }


}
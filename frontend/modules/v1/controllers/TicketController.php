<?php

namespace frontend\modules\v1\controllers;

use frontend\models\Ticket;
use yii\web\NotFoundHttpException;
class TicketController extends DefaultController
{
    public $modelClass = 'frontend\models\Ticket';
    public $enableCsrfValidation = false;

    public function actionGet($vk_id){
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $result = Ticket::findOne(['vk_id'=>$vk_id]);
        $data=[];
        if ($result) {
            $data = [
                "status"=>$result->status,
                "ticket"=>$result->ticket,
            ];
        }
        else{
            throw new NotFoundHttpException('Ticket not found'); 
        }
        return $data;
    }
    public function actionPost($vk_id){
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $data=[];
        $ticket = new Ticket;
        $ticket->vk_id = $vk_id;
        if ($ticket->save()) {
            $data = [
                'name'=>'Ticket registered',
                'message'=>'Ticket registered successfully',
                'status'=>200,
            ];
        }
        return $data;
    }
    public function actionPut($vk_id,$post_id){
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $data=[];
        $ticket = Ticket::findOne(['vk_id'=>$vk_id]);
        if ($ticket) {
            $ticket->post_id = $post_id;
            $ticket->status = 1;
            $ticket->save();
            $data = [
                'name'=>'Ticket activated',
                'message'=>'Ticket activated successfully',
                'status'=>200,
            ];
        }
        else{
            $ticket = new Ticket;
            $ticket->vk_id = $vk_id;
            $ticket->post_id = $post_id;
            $ticket->status = 1;
            if ($ticket->save()) {
                $data = [
                    'name'=>'Ticket registered and activated',
                    'message'=>'Ticket registered and activated successfully',
                    'status'=>200,
                ];
            }
        }
        return $data;
    }
}
<?php

namespace frontend\models;

use Yii;
use yii\base\Security;
/**
 * This is the model class for table "tickets".
 *
 * @property integer $id
 * @property string $first_name
 * @property string $last_name
 * @property integer $vk_id
 * @property integer $post_id
 * @property string $ticket
 * @property integer $status
 * @property integer $date_update
 * @property integer $date_create
 */
class Ticket extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tickets';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['vk_id',], 'required'],
            [['ticket'],'unique'],
            [['status', 'date_update', 'date_create'], 'integer'],
            [['vk_id', 'post_id','first_name', 'last_name', 'ticket'], 'string', 'max' => 500]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'vk_id' => 'Vk ID',
            'post_id' => 'Post ID',
            'ticket' => 'Ticket',
            'status' => 'Status',
            'date_update' => 'Date Update',
            'date_create' => 'Date Create',
        ];
    }
    
    public function behaviors()
    {
        return [
            'timestamp' => [
                'class' => 'yii\behaviors\TimestampBehavior',
                'attributes' => [
                    \yii\db\ActiveRecord::EVENT_BEFORE_INSERT => ['date_create', 'date_update'],
                    \yii\db\ActiveRecord::EVENT_BEFORE_UPDATE => ['date_update'],
                ],
            ],
        ];
    }
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            $ticket = md5(time());
            $this->ticket = $ticket;
            return true;
        } else {
            return false;
        }
    }
}

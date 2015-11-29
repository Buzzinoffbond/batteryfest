<?php

use yii\db\Schema;
use yii\db\Migration;

class m151107_194648_tickets extends Migration
{
    public function safeUp()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%tickets}}', [
            'id' => Schema::TYPE_PK,
            'first_name' => Schema::TYPE_STRING . '(500) NOT NULL',
            'last_name' => Schema::TYPE_STRING . '(500) NOT NULL',
            'vk_id' => Schema::TYPE_STRING . '(500) NULL',
            'post_id' => Schema::TYPE_STRING . '(500) NULL',
            'ticket' => Schema::TYPE_STRING . '(500) NOT NULL',
            'status' => Schema::TYPE_INTEGER . ' NOT NULL DEFAULT 0',
            'note' => Schema::TYPE_STRING . '(500) NOT NULL',
            'date_update' => Schema::TYPE_INTEGER . ' NOT NULL',
            'date_create' => Schema::TYPE_INTEGER . ' NOT NULL',
        ], $tableOptions);
    }

    public function safeDown()
    {
        $this->dropTable('{{%tickets}}');
    }
}

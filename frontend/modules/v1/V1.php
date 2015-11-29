<?php

namespace frontend\modules\v1;

class V1 extends \yii\base\Module
{
    public $controllerNamespace = 'frontend\modules\v1\controllers';

/*    public function behaviors()
    {
        return [
            'corsFilter' => [
                'class' => \yii\filters\Cors::className(),
                'cors' => [
                    // restrict access to
                    'Origin' => ['http://batteryfest.dev'],
                    'Access-Control-Request-Method' => ['POST','GET'],
                    // Allow only POST and PUT methods
                    // 'Access-Control-Request-Headers' => ['X-Wsse'],
                    // Allow only headers 'X-Wsse'
                    // 'Access-Control-Allow-Credentials' => true,
                    // Allow OPTIONS caching
                    // 'Access-Control-Max-Age' => 3600,
                    // Allow the X-Pagination-Current-Page header to be exposed to the browser.
                    // 'Access-Control-Expose-Headers' => ['X-Pagination-Current-Page'],
                ],
    
            ],
        ];
    }*/
/*    public function behaviors()
    {
        return [
            'corsFilter' => [
                'class' => \yii\filters\Cors::className(),
                'cors' => [
                    'Origin' => ['*'],
                    'Access-Control-Request-Method' => ['GET', 'POST'],
                ],
                'actions' => [
                    'select-city' => [
                        'Access-Control-Allow-Credentials' => true,
                    ]
                ]
            ]
        ];
    }*/

    public function init()
    {
        parent::init();

        // custom initialization code goes here
    }
}

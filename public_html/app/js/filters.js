// angular.module('filters',[])
//     .filter('html', function($sce){
//         return function(text) {
//             return $sce.trustAsHtml(text);
//         };
//     });
angular.module('filters', []).filter('html', function($sce) {
    return function(text) {
        console.log($sce);
        return $sce.trustAsHtml(text);
    };
});
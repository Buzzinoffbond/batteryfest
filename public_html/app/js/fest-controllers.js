'use strict';

var festControllers = angular.module('festControllers', []);

//Repost
festControllers.controller('Repost',
    function($scope,$resource,$window){
        var User = {};
        $scope.Step = {};
        $scope.ticket ='';
        var CheckButtons = function(){
            setButtons('available','unavailable','unavailable');
            VK.Auth.getLoginStatus(
                function (response){
                    if (response.session !== null && response.session.mid) {
                        User.id = response.session.mid;
                        VK.Api.call('users.isAppUser',{user_id:User.id}, function(r) {
                            if (r.response) {
                                setButtons('done','available','unavailable');
                                VK.Api.call('users.get',{user_ids:User.id,fields:'first_name,last_name,photo_50'}, function(r) {
                                    if (r.response) {
                                        User.first_name = r.response[0].first_name;
                                        User.last_name = r.response[0].last_name;
                                        User.photo = r.response[0].photo_50;
                                        $scope.post_credentials.name = User.first_name+' '+User.last_name;
                                        $scope.post_credentials.avatar = User.photo;
                                    };
                                    
                                });
                                //check on server here
                                var Ticket = $resource('/api/v1/tickets/:vk_id', {vk_id:User.id}, {
                                    check: {method:'GET', isArray:false}
                                });
                                Ticket.check(function(responseTicket){
                                    if (responseTicket.status==1) {
                                        User.ticket = responseTicket.ticket;
                                        $scope.qrcode = '/api/ticket/png/'+responseTicket.ticket;
                                        setButtons('done','done','available');
                                        $scope.ticket = User.ticket;
                                    };
                                })
                            }
                            else{
                            };
                        });
                    }
                });
        }
        var setButtons = function(newAuth,newPost,newSave){
            $scope.Step.auth = newAuth,
            $scope.Step.post = newPost,
            $scope.Step.save = newSave
        }
        CheckButtons();
        $scope.auth = function(){
            if ($scope.Step.auth === 'available'){
                VK.Auth.login(function(response){
                    var Ticket = $resource('/api/v1/ticket/:vk_id', {vk_id:User.id}, {
                        register: {method:'GET'}
                    });
                    Ticket.register(function(responseTicket){
                    });
                    CheckButtons();
                });
            }
        }
        function countdown(){
            var fest = new Date("December 4 2015");
            var now = Date.now();
            var count = Math.floor( (fest - now) / (1000*60*60*24) ) + 1;
            var last = count%10;
            if (last===1 && count!==11) {var days = ' день'; var remaining = 'остался '}
            else if ((last>=2 && last<=4) && !(count>=11 && count<=14)) {var days = ' дня'; var remaining = 'осталось '}
            else {var days = ' дней'; var remaining = 'осталось '}
            return {count:count,days:days,remaining:remaining};
        }
        var countdown = countdown();
        $scope.post_text = 'До главного рок-фестиваля @mpei_ru (МЭИ) '+countdown.remaining+countdown.count+countdown.days+'.\n4 декабря я иду на @batteryfestxx (БАТАРЕЮ). Вход свободный по электронным билетам на batteryfest.ru.\n \n#batteryfest #рок #фестиваль #рокклуб #дкмэи #мэи';
        var textarea = autosize(document.querySelector('textarea'));
        autosize.update(textarea);
        var post_placeholder = [
            {name:'Брэндон Флауэрс',avatar:'/app/img/dummy/brandon_vk.jpg'}
        ];
        var rand_int = function(max){
            return Math.floor(Math.random() * (max + 1));
        }
        $scope.post_credentials = post_placeholder[rand_int(post_placeholder.length-1)];
        var post_image = [
            {id:"photo-88897995_390905938",url:"https://pp.vk.me/c633131/v633131551/2753/bIK9s3ZccI8.jpg"},
            {id:"photo-88897995_390905942",url:"https://pp.vk.me/c633131/v633131551/275c/P_is5r4mBIs.jpg"},
            {id:"photo-88897995_390905945",url:"https://pp.vk.me/c633131/v633131551/2765/oI0E4K_vlac.jpg"},
            {id:"photo-88897995_390905950",url:"https://pp.vk.me/c633131/v633131551/276e/njNAxBJO71E.jpg"},
            {id:"photo-88897995_390905955",url:"https://pp.vk.me/c633131/v633131551/2777/Me0RqJyt54M.jpg"},
            {id:"photo-88897995_390905960",url:"https://pp.vk.me/c633131/v633131551/2780/uh7VT_iPvyk.jpg"},
            {id:"photo-88897995_390905969",url:"https://pp.vk.me/c633131/v633131551/2789/04hRo4sHdxc.jpg"},
            {id:"photo-88897995_390905977",url:"https://pp.vk.me/c633131/v633131551/2792/5C4fjqKBCcY.jpg"},
            {id:"photo-88897995_390905986",url:"https://pp.vk.me/c633131/v633131551/279b/zdjZgjc6zRc.jpg"},
            {id:"photo-88897995_390905998",url:"https://pp.vk.me/c633131/v633131551/27a4/l7qd2IFlanI.jpg"},
            {id:"photo-88897995_390906010",url:"https://pp.vk.me/c633131/v633131551/27ad/-q9r45C3zHc.jpg"},
            {id:"photo-88897995_390906017",url:"https://pp.vk.me/c633131/v633131551/27b6/QURbbhAhX7Y.jpg"}
        ];
        var current_image = rand_int(post_image.length-1);
        $scope.post_image = post_image[current_image];
        $scope.qrcode = '/app/img/dummy/qr.jpg';
        $scope.nextPostimage = function(){
            current_image++;
            if (current_image>(post_image.length-1)) {
                current_image=0;
            };
            $scope.post_image = post_image[current_image];
        }
        $scope.prevPostimage = function(){
            current_image--;
            if (current_image<0) {
                current_image=post_image.length-1;
            };
            $scope.post_image = post_image[current_image];
        }
        $scope.makePost = function(){
            if ($scope.Step.post === 'available'){
                VK.Api.call('wall.post', {friends_only: 0, message: $scope.post_text, attachments: $scope.post_image.id+',http://batteryfest.ru'}, function(r) {
                    if (r.response) {
                        User.post_id = r.response.post_id;
                        var Ticket = $resource('/api/v1/ticket/:vk_id/:post_id', {vk_id:User.id,post_id:User.post_id}, {
                            activate: {method:'GET'}
                        });
                        Ticket.activate(function(responseTicket){
                            if (responseTicket.status===200) {
                                CheckButtons();
                            };
                        });
                    }
                    else{
                        console.log('post is not submitted. error: '+r.error.error_code+' '+r.error.error_msg);
                    };
                });
            };
        }
    });

//Pages
festControllers.controller('Index',
    function($scope,Head,Menu){
        Head.setTitle('Рок-фестиваль «Батарея»');
        Menu.setActive('festindex');
    });
festControllers.controller('About',
    function($scope,Head,Menu){
        Head.setTitle('О фестивале');
        Menu.setActive('festabout');
    });
festControllers.controller('Agreement',
    function($scope,Head,Menu){
        Head.setTitle('Соглашение на обработку персональных данных');
    });
festControllers.controller('Contact',
    function($scope,Head,Menu,ymapsConfig){
        Head.setTitle('Контакты');
        Menu.setActive('contact');
        VK.Widgets.Subscribe("vk_subscribe_rock_club_dkmpei", {mode: 1, soft: 1}, -12829450);
        VK.Widgets.Subscribe("vk_subscribe_dkmpei", {mode: 1, soft: 1}, -720079);
        VK.Widgets.Subscribe("vk_subscribe_batteryfest", {mode: 1, soft: 1}, -88897995);
        $scope.map = {
            center: [55.75741927717397,37.70828449999999],
            zoom: 16,
            marker:{
                coords:[55.75741927717397,37.70828449999999],
                properties:'pm2ywl',
            }
        };
    });
festControllers.controller('Participate',
    function($scope,Head,Menu){
        Head.setTitle('Участвовать');
        Menu.setActive('participate');
        $scope.membersPlaceholders = [{
            "name": "Энтони Кидис",
            "instrument": "Вокал"
        }, {
            "name": "Майкл Бэлзари",
            "instrument": "Бас-гитара"
        }, {
            "name": "Чад Смит",
            "instrument": "Барабаны"
        }, {
            "name": "Джош Клингхоффер",
            "instrument": "Гитара"
        }, ];
        $scope.members = [
            {name: '', instrument: '' }
        ];
        $scope.addMember = function(){
            $scope.members.push({name: '' , instrument: '' })
        }
        $scope.removeMember = function(index){
            $scope.members.splice(index,1);
        }
    });

festControllers.controller('Tickets',
    function($scope,Head,Menu){
        Head.setTitle('Билеты на фестиваль');
        Menu.setActive('tickets');
    });

var albums = [
    {
        name:'Батарея XIX',
        link_name:'Весна 2015',
        description:'<p>8,9 Апреля 2015</p><p>Фото <a href="https://vk.com/id138713229">Всеволод Анисимов</a></p>',
        photos:[
{orig:'/photos/battery_19/9e3phiqpbrux4goic6ir.jpg',thumb:'/photos/battery_19/thumb/9e3phiqpbrux4goic6ir.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/9hjpciaa5vlwxmmp4qhl.jpg',thumb:'/photos/battery_19/thumb/9hjpciaa5vlwxmmp4qhl.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/19qo43eevrlqnjyre0q5.jpg',thumb:'/photos/battery_19/thumb/19qo43eevrlqnjyre0q5.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/29pdx4fzneeyihzeb3ro.jpg',thumb:'/photos/battery_19/thumb/29pdx4fzneeyihzeb3ro.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/38jnyneeczvvljuljxvd.jpg',thumb:'/photos/battery_19/thumb/38jnyneeczvvljuljxvd.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/81b636d7cxrsg39ptz9l.jpg',thumb:'/photos/battery_19/thumb/81b636d7cxrsg39ptz9l.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/a1btaxhtirxlkrycyyng.jpg',thumb:'/photos/battery_19/thumb/a1btaxhtirxlkrycyyng.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/a31x2ktfa8aly4iifwfr.jpg',thumb:'/photos/battery_19/thumb/a31x2ktfa8aly4iifwfr.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/aswhjxe9jfrz8ubj7ydv.jpg',thumb:'/photos/battery_19/thumb/aswhjxe9jfrz8ubj7ydv.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/b9tuamartjc6qo2mlsnb.jpg',thumb:'/photos/battery_19/thumb/b9tuamartjc6qo2mlsnb.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/beyfio7yelet5fugtkyx.jpg',thumb:'/photos/battery_19/thumb/beyfio7yelet5fugtkyx.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/bf9lejyavie6eca2o2id.jpg',thumb:'/photos/battery_19/thumb/bf9lejyavie6eca2o2id.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/bft7bua6ilirhgz8nsel.jpg',thumb:'/photos/battery_19/thumb/bft7bua6ilirhgz8nsel.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/bshtb6qt3lojstkqdego.jpg',thumb:'/photos/battery_19/thumb/bshtb6qt3lojstkqdego.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/cb4jzjlwvsf5xszdbuxg.jpg',thumb:'/photos/battery_19/thumb/cb4jzjlwvsf5xszdbuxg.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/crit7qnxvtjg2hcqrjjv.jpg',thumb:'/photos/battery_19/thumb/crit7qnxvtjg2hcqrjjv.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/csmo8exrb2wc9kuwymuf.jpg',thumb:'/photos/battery_19/thumb/csmo8exrb2wc9kuwymuf.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/cuyly217tvsb8helivyc.jpg',thumb:'/photos/battery_19/thumb/cuyly217tvsb8helivyc.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/cwr6sb8s8wfsrwpmny03.jpg',thumb:'/photos/battery_19/thumb/cwr6sb8s8wfsrwpmny03.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/cy3ffrivy6vdgv3mfbjp.jpg',thumb:'/photos/battery_19/thumb/cy3ffrivy6vdgv3mfbjp.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/d5rjchqx1ccra6czeax5.jpg',thumb:'/photos/battery_19/thumb/d5rjchqx1ccra6czeax5.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/dbcchtbze45kbak2icvd.jpg',thumb:'/photos/battery_19/thumb/dbcchtbze45kbak2icvd.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/dmqreqnvwdxy74vljvek.jpg',thumb:'/photos/battery_19/thumb/dmqreqnvwdxy74vljvek.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/dmuslylcacbuey7ibux2.jpg',thumb:'/photos/battery_19/thumb/dmuslylcacbuey7ibux2.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/dodkgwgef0p7d7uaexsu.jpg',thumb:'/photos/battery_19/thumb/dodkgwgef0p7d7uaexsu.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/dx3hko0dzogppdwcsds0.jpg',thumb:'/photos/battery_19/thumb/dx3hko0dzogppdwcsds0.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/dx6hz2h3wtly4vsmddcv.jpg',thumb:'/photos/battery_19/thumb/dx6hz2h3wtly4vsmddcv.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/eao6d3kayfmwbdlodllj.jpg',thumb:'/photos/battery_19/thumb/eao6d3kayfmwbdlodllj.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/ei1kfu8z3ucyblkmyux5.jpg',thumb:'/photos/battery_19/thumb/ei1kfu8z3ucyblkmyux5.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/einimw7df9xnhtrslp9s.jpg',thumb:'/photos/battery_19/thumb/einimw7df9xnhtrslp9s.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/ekkpwonm0dstc8jbdd5f.jpg',thumb:'/photos/battery_19/thumb/ekkpwonm0dstc8jbdd5f.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/erpqzoef7dmmmkgfc5rj.jpg',thumb:'/photos/battery_19/thumb/erpqzoef7dmmmkgfc5rj.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/ewdhmlwzkgf6or6t0th7.jpg',thumb:'/photos/battery_19/thumb/ewdhmlwzkgf6or6t0th7.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/ey389rcakxlfjtveela9.jpg',thumb:'/photos/battery_19/thumb/ey389rcakxlfjtveela9.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/f6send1zfvrghzklpmhn.jpg',thumb:'/photos/battery_19/thumb/f6send1zfvrghzklpmhn.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/faumxiijrtxajkivut7u.jpg',thumb:'/photos/battery_19/thumb/faumxiijrtxajkivut7u.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/fel79z17bxzvfb1capmp.jpg',thumb:'/photos/battery_19/thumb/fel79z17bxzvfb1capmp.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/fhbje3mlmjudtvlctmjx.jpg',thumb:'/photos/battery_19/thumb/fhbje3mlmjudtvlctmjx.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/fvg9mcusewistbrzppza.jpg',thumb:'/photos/battery_19/thumb/fvg9mcusewistbrzppza.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/g165s4s131dhjumalmz6.jpg',thumb:'/photos/battery_19/thumb/g165s4s131dhjumalmz6.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/gcaiywic0feygxjw89xi.jpg',thumb:'/photos/battery_19/thumb/gcaiywic0feygxjw89xi.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/ggz4pqa9pe1m5jxnynin.jpg',thumb:'/photos/battery_19/thumb/ggz4pqa9pe1m5jxnynin.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/golvtzj9wwiq0n8mvt0e.jpg',thumb:'/photos/battery_19/thumb/golvtzj9wwiq0n8mvt0e.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/gsydivealws0wewysklg.jpg',thumb:'/photos/battery_19/thumb/gsydivealws0wewysklg.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/gtszcz4l3tmwozrlqrz5.jpg',thumb:'/photos/battery_19/thumb/gtszcz4l3tmwozrlqrz5.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/gwt8rkyzgh4zvqdfohfr.jpg',thumb:'/photos/battery_19/thumb/gwt8rkyzgh4zvqdfohfr.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/h1j35vksoukslu4bqlkp.jpg',thumb:'/photos/battery_19/thumb/h1j35vksoukslu4bqlkp.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/hjjs1wtctuopht0waar7.jpg',thumb:'/photos/battery_19/thumb/hjjs1wtctuopht0waar7.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/hlmgjjeqhy9khw5ik2dz.jpg',thumb:'/photos/battery_19/thumb/hlmgjjeqhy9khw5ik2dz.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/hscyfl2zf51n79huxcav.jpg',thumb:'/photos/battery_19/thumb/hscyfl2zf51n79huxcav.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/i8mzdam2hc3n9o1jjyvf.jpg',thumb:'/photos/battery_19/thumb/i8mzdam2hc3n9o1jjyvf.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/ijpzr9jabhq4cgdtx86h.jpg',thumb:'/photos/battery_19/thumb/ijpzr9jabhq4cgdtx86h.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/inopis1qi0apimiqozfm.jpg',thumb:'/photos/battery_19/thumb/inopis1qi0apimiqozfm.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/io2bzt583ie515sy8xqi.jpg',thumb:'/photos/battery_19/thumb/io2bzt583ie515sy8xqi.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/jftrbntfzgolhb91krra.jpg',thumb:'/photos/battery_19/thumb/jftrbntfzgolhb91krra.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/jrfuqi5h0dkl7s8uh2tq.jpg',thumb:'/photos/battery_19/thumb/jrfuqi5h0dkl7s8uh2tq.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/k3gpjc48bp7dmhin4zxk.jpg',thumb:'/photos/battery_19/thumb/k3gpjc48bp7dmhin4zxk.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/kfmujjhadk54w2qn5gxs.jpg',thumb:'/photos/battery_19/thumb/kfmujjhadk54w2qn5gxs.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/kjqhh7r4n9vwq5gtgylx.jpg',thumb:'/photos/battery_19/thumb/kjqhh7r4n9vwq5gtgylx.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/kloe7zn5u9sualoztv63.jpg',thumb:'/photos/battery_19/thumb/kloe7zn5u9sualoztv63.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/kz80zyjjlwzwymduatpv.jpg',thumb:'/photos/battery_19/thumb/kz80zyjjlwzwymduatpv.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/ldgxanqtglbiq8hykmdo.jpg',thumb:'/photos/battery_19/thumb/ldgxanqtglbiq8hykmdo.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/liyxiax8dpn8bvzjhqhq.jpg',thumb:'/photos/battery_19/thumb/liyxiax8dpn8bvzjhqhq.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/lmakt1admujggykv52vd.jpg',thumb:'/photos/battery_19/thumb/lmakt1admujggykv52vd.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/lut7svtadnnags0l0f6x.jpg',thumb:'/photos/battery_19/thumb/lut7svtadnnags0l0f6x.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/m19jumxv5p4b16zzvp4n.jpg',thumb:'/photos/battery_19/thumb/m19jumxv5p4b16zzvp4n.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/mi9o5vavqukivlqj6ycf.jpg',thumb:'/photos/battery_19/thumb/mi9o5vavqukivlqj6ycf.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/mrgmetxr99hvt8jcct5c.jpg',thumb:'/photos/battery_19/thumb/mrgmetxr99hvt8jcct5c.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/mws50b10t1xdl0w3p6je.jpg',thumb:'/photos/battery_19/thumb/mws50b10t1xdl0w3p6je.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/n5qrq3hwz5ej08b09ien.jpg',thumb:'/photos/battery_19/thumb/n5qrq3hwz5ej08b09ien.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/nhysmlso9ztaflxtli8t.jpg',thumb:'/photos/battery_19/thumb/nhysmlso9ztaflxtli8t.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/nornp4bxhx6m3o2c3301.jpg',thumb:'/photos/battery_19/thumb/nornp4bxhx6m3o2c3301.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/oc67hods3tlseweyaiqd.jpg',thumb:'/photos/battery_19/thumb/oc67hods3tlseweyaiqd.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/ocpzlqo70rsr0aq28xz3.jpg',thumb:'/photos/battery_19/thumb/ocpzlqo70rsr0aq28xz3.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/olchqa158yybgpqc64nl.jpg',thumb:'/photos/battery_19/thumb/olchqa158yybgpqc64nl.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/ong0ezkdnvfosumethhk.jpg',thumb:'/photos/battery_19/thumb/ong0ezkdnvfosumethhk.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/oplhfbmbfkmzdrg4tvwo.jpg',thumb:'/photos/battery_19/thumb/oplhfbmbfkmzdrg4tvwo.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/p6kqte0bcmeeoperz9vq.jpg',thumb:'/photos/battery_19/thumb/p6kqte0bcmeeoperz9vq.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/pde8hrgyyl51gy3tnbwb.jpg',thumb:'/photos/battery_19/thumb/pde8hrgyyl51gy3tnbwb.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/pdfpo6oslui4txa2brxs.jpg',thumb:'/photos/battery_19/thumb/pdfpo6oslui4txa2brxs.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/plhe2g5gmi8n39a6exso.jpg',thumb:'/photos/battery_19/thumb/plhe2g5gmi8n39a6exso.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/psm3xb8edm1pyrsqdki8.jpg',thumb:'/photos/battery_19/thumb/psm3xb8edm1pyrsqdki8.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/pujkivpdka7a2rcc72p9.jpg',thumb:'/photos/battery_19/thumb/pujkivpdka7a2rcc72p9.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/pzasbf91dsltnm2ovkfw.jpg',thumb:'/photos/battery_19/thumb/pzasbf91dsltnm2ovkfw.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/qaby2yfbc2dcemrmvdjb.jpg',thumb:'/photos/battery_19/thumb/qaby2yfbc2dcemrmvdjb.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/qrw8po7likbcj0topl55.jpg',thumb:'/photos/battery_19/thumb/qrw8po7likbcj0topl55.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/qzwaaxrlzsx2eqetnm43.jpg',thumb:'/photos/battery_19/thumb/qzwaaxrlzsx2eqetnm43.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/r53dgc18fsei78vctike.jpg',thumb:'/photos/battery_19/thumb/r53dgc18fsei78vctike.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/rmsvrekoo6p7we65ctr8.jpg',thumb:'/photos/battery_19/thumb/rmsvrekoo6p7we65ctr8.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/rpyqhxswhw7djgekdzvm.jpg',thumb:'/photos/battery_19/thumb/rpyqhxswhw7djgekdzvm.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/scxa3lgljwcjrge8pyid.jpg',thumb:'/photos/battery_19/thumb/scxa3lgljwcjrge8pyid.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/sduujm9mjsocgpewqgkn.jpg',thumb:'/photos/battery_19/thumb/sduujm9mjsocgpewqgkn.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/skspybp6cek3ndahnr3u.jpg',thumb:'/photos/battery_19/thumb/skspybp6cek3ndahnr3u.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/sm3eocknxrbsdnjknmxp.jpg',thumb:'/photos/battery_19/thumb/sm3eocknxrbsdnjknmxp.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/smuk8qzdhzxndqttyd74.jpg',thumb:'/photos/battery_19/thumb/smuk8qzdhzxndqttyd74.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/swujyoqnlvo5karohmfr.jpg',thumb:'/photos/battery_19/thumb/swujyoqnlvo5karohmfr.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/tcf0zho8znp2gzvrckk7.jpg',thumb:'/photos/battery_19/thumb/tcf0zho8znp2gzvrckk7.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/telmdnprsm6ybyik7hqy.jpg',thumb:'/photos/battery_19/thumb/telmdnprsm6ybyik7hqy.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/tjw7rainlwxw1lyl0ivh.jpg',thumb:'/photos/battery_19/thumb/tjw7rainlwxw1lyl0ivh.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/tukmsi5qu4bmtkl2rxa7.jpg',thumb:'/photos/battery_19/thumb/tukmsi5qu4bmtkl2rxa7.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/tykztetqapaw7p9okudo.jpg',thumb:'/photos/battery_19/thumb/tykztetqapaw7p9okudo.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/u46lgduq9ogmeqv1n8qu.jpg',thumb:'/photos/battery_19/thumb/u46lgduq9ogmeqv1n8qu.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/ub0asosogvrhplzk1ipj.jpg',thumb:'/photos/battery_19/thumb/ub0asosogvrhplzk1ipj.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/ud1y72ilshinehfqhier.jpg',thumb:'/photos/battery_19/thumb/ud1y72ilshinehfqhier.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/us5ukdcr1dxt88mpojyh.jpg',thumb:'/photos/battery_19/thumb/us5ukdcr1dxt88mpojyh.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/utrgr2wqst1t15k9uhha.jpg',thumb:'/photos/battery_19/thumb/utrgr2wqst1t15k9uhha.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/uzh9o2ipjrsylyzylaj3.jpg',thumb:'/photos/battery_19/thumb/uzh9o2ipjrsylyzylaj3.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/vcjn1tlsa8bmw0i9ctuw.jpg',thumb:'/photos/battery_19/thumb/vcjn1tlsa8bmw0i9ctuw.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/vdiurr5duw8tlkte8boh.jpg',thumb:'/photos/battery_19/thumb/vdiurr5duw8tlkte8boh.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/vph5egphiylisij24w52.jpg',thumb:'/photos/battery_19/thumb/vph5egphiylisij24w52.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/vujakap1wvjplqgjkt6i.jpg',thumb:'/photos/battery_19/thumb/vujakap1wvjplqgjkt6i.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/vvzpir3ca2hsbiybia4d.jpg',thumb:'/photos/battery_19/thumb/vvzpir3ca2hsbiybia4d.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/wdou9dngngnj9cjibqv0.jpg',thumb:'/photos/battery_19/thumb/wdou9dngngnj9cjibqv0.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/wdry8splbn9orylhifnv.jpg',thumb:'/photos/battery_19/thumb/wdry8splbn9orylhifnv.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/wdujdntv4y93qvro1kgg.jpg',thumb:'/photos/battery_19/thumb/wdujdntv4y93qvro1kgg.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/whixkty0jqwuywslgnvt.jpg',thumb:'/photos/battery_19/thumb/whixkty0jqwuywslgnvt.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/wqc6ezu2m9up3u34nuso.jpg',thumb:'/photos/battery_19/thumb/wqc6ezu2m9up3u34nuso.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/wrf56sfbpvqpg4kwbg2k.jpg',thumb:'/photos/battery_19/thumb/wrf56sfbpvqpg4kwbg2k.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/wsq1qev8v8fu16rapmzc.jpg',thumb:'/photos/battery_19/thumb/wsq1qev8v8fu16rapmzc.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/xag5nbluabfeqf7nrc5i.jpg',thumb:'/photos/battery_19/thumb/xag5nbluabfeqf7nrc5i.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/xcit3zi2ek840zqlr8jt.jpg',thumb:'/photos/battery_19/thumb/xcit3zi2ek840zqlr8jt.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/xh64kkmowahmcqobzhak.jpg',thumb:'/photos/battery_19/thumb/xh64kkmowahmcqobzhak.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/xikehmv8lzmrvnvgtkpz.jpg',thumb:'/photos/battery_19/thumb/xikehmv8lzmrvnvgtkpz.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/xuajmwvurfxpr9lyxxvn.jpg',thumb:'/photos/battery_19/thumb/xuajmwvurfxpr9lyxxvn.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/yrjfhdr0bo4vectfkf7m.jpg',thumb:'/photos/battery_19/thumb/yrjfhdr0bo4vectfkf7m.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/zqx3tv8ien8lvuvmprcs.jpg',thumb:'/photos/battery_19/thumb/zqx3tv8ien8lvuvmprcs.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/zu5dqdergob6tkbmxvnr.jpg',thumb:'/photos/battery_19/thumb/zu5dqdergob6tkbmxvnr.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/zzrc6doasb1lyfsdrgij.jpg',thumb:'/photos/battery_19/thumb/zzrc6doasb1lyfsdrgij.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/0j2aisn9iieycxq7alb0.jpg',thumb:'/photos/battery_19/thumb/0j2aisn9iieycxq7alb0.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/1bvmn0p9elwrdmpzxche.jpg',thumb:'/photos/battery_19/thumb/1bvmn0p9elwrdmpzxche.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/1y6kizpfbzjpnpt7flar.jpg',thumb:'/photos/battery_19/thumb/1y6kizpfbzjpnpt7flar.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/2jwvcvpctldxzdptpxwy.jpg',thumb:'/photos/battery_19/thumb/2jwvcvpctldxzdptpxwy.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/2ot5smpcknicuctgemkb.jpg',thumb:'/photos/battery_19/thumb/2ot5smpcknicuctgemkb.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/3zuo0l3xryva0gbbbvj8.jpg',thumb:'/photos/battery_19/thumb/3zuo0l3xryva0gbbbvj8.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/4fxi0n7tj71bb38r8lcy.jpg',thumb:'/photos/battery_19/thumb/4fxi0n7tj71bb38r8lcy.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/5sawdmdyksvrmlwv7z0f.jpg',thumb:'/photos/battery_19/thumb/5sawdmdyksvrmlwv7z0f.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/6fukmvfgptonreygwd0m.jpg',thumb:'/photos/battery_19/thumb/6fukmvfgptonreygwd0m.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/6juuqkzesdotciifgamv.jpg',thumb:'/photos/battery_19/thumb/6juuqkzesdotciifgamv.jpg',caption:'',width:684,height:1024},
{orig:'/photos/battery_19/6xzpb1jdgz0v1zmnehzv.jpg',thumb:'/photos/battery_19/thumb/6xzpb1jdgz0v1zmnehzv.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/07cxi1kmeic0d7jwlubl.jpg',thumb:'/photos/battery_19/thumb/07cxi1kmeic0d7jwlubl.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_19/8jbmjqkm5gndrgvzs9z0.jpg',thumb:'/photos/battery_19/thumb/8jbmjqkm5gndrgvzs9z0.jpg',caption:'',width:1440,height:962},
        ],
        videos:[]
    },
    {
        name:'Батарея XVIII ',
        link_name:'Зима 2014',
        description:'4 декабря 2014',
        photos:[
{orig:'/photos/battery_18/9ppxlucoebysgr5v2ltp.jpg',thumb:'/photos/battery_18/thumb/9ppxlucoebysgr5v2ltp.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/47j3fojzmbyfgivv3eer.jpg',thumb:'/photos/battery_18/thumb/47j3fojzmbyfgivv3eer.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/76rbpdbzovtajcagkthm.jpg',thumb:'/photos/battery_18/thumb/76rbpdbzovtajcagkthm.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/82ybnkq3sr6gy7yhkdwp.jpg',thumb:'/photos/battery_18/thumb/82ybnkq3sr6gy7yhkdwp.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/a6ayywswaee5rgka9wev.jpg',thumb:'/photos/battery_18/thumb/a6ayywswaee5rgka9wev.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/aolxgo5zpunkhr8jjhap.jpg',thumb:'/photos/battery_18/thumb/aolxgo5zpunkhr8jjhap.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/aothfboxo4xtjeg3v20o.jpg',thumb:'/photos/battery_18/thumb/aothfboxo4xtjeg3v20o.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/bg8hihjqvf3nd3uqwlrz.jpg',thumb:'/photos/battery_18/thumb/bg8hihjqvf3nd3uqwlrz.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/bilz2b7prt7mtadubfm9.jpg',thumb:'/photos/battery_18/thumb/bilz2b7prt7mtadubfm9.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/bqhlnf7v5tqguppftl9o.jpg',thumb:'/photos/battery_18/thumb/bqhlnf7v5tqguppftl9o.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/cboh8n9bqrmrhnsylhwa.jpg',thumb:'/photos/battery_18/thumb/cboh8n9bqrmrhnsylhwa.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_18/cbymqyxec1ph2hsrxami.jpg',thumb:'/photos/battery_18/thumb/cbymqyxec1ph2hsrxami.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/cupykegatife8giuoabn.jpg',thumb:'/photos/battery_18/thumb/cupykegatife8giuoabn.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/cyhm3f9excge4kdb4bxl.jpg',thumb:'/photos/battery_18/thumb/cyhm3f9excge4kdb4bxl.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/d0nv8hrr6x4a4jrscolr.jpg',thumb:'/photos/battery_18/thumb/d0nv8hrr6x4a4jrscolr.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/d6rtbqmbp5ebnexxncgm.jpg',thumb:'/photos/battery_18/thumb/d6rtbqmbp5ebnexxncgm.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/d47smgbdpywtdd4jocgr.jpg',thumb:'/photos/battery_18/thumb/d47smgbdpywtdd4jocgr.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/dgx4icj7qbqw5paloaqb.jpg',thumb:'/photos/battery_18/thumb/dgx4icj7qbqw5paloaqb.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/e5h43ggq2ao4qjifqwez.jpg',thumb:'/photos/battery_18/thumb/e5h43ggq2ao4qjifqwez.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/epfpg6l4salfpqfz34mj.jpg',thumb:'/photos/battery_18/thumb/epfpg6l4salfpqfz34mj.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/epp7ufuazio6ivfhpxtq.jpg',thumb:'/photos/battery_18/thumb/epp7ufuazio6ivfhpxtq.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/ey4vy6y9afzv53ayjxva.jpg',thumb:'/photos/battery_18/thumb/ey4vy6y9afzv53ayjxva.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/ezr8gjoadxkqpsokyudk.jpg',thumb:'/photos/battery_18/thumb/ezr8gjoadxkqpsokyudk.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/fehtzu8xuueaultmqzcp.jpg',thumb:'/photos/battery_18/thumb/fehtzu8xuueaultmqzcp.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/fgimvccfd3izhzyxz2ao.jpg',thumb:'/photos/battery_18/thumb/fgimvccfd3izhzyxz2ao.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/fgymtklchrjbdwlxt7gj.jpg',thumb:'/photos/battery_18/thumb/fgymtklchrjbdwlxt7gj.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/glmgalm1hsvacfmpess7.jpg',thumb:'/photos/battery_18/thumb/glmgalm1hsvacfmpess7.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/grqlufkoaj4dsugktnip.jpg',thumb:'/photos/battery_18/thumb/grqlufkoaj4dsugktnip.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/guy3for90pmtlg4j9kkd.jpg',thumb:'/photos/battery_18/thumb/guy3for90pmtlg4j9kkd.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/hbh042ybfet9npiwzpdb.jpg',thumb:'/photos/battery_18/thumb/hbh042ybfet9npiwzpdb.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/hgsuf5z9p0slp5htrgrf.jpg',thumb:'/photos/battery_18/thumb/hgsuf5z9p0slp5htrgrf.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_18/hi9s4b7fx4yt1hzzvks5.jpg',thumb:'/photos/battery_18/thumb/hi9s4b7fx4yt1hzzvks5.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/hkpbsnuomq21stnh5osd.jpg',thumb:'/photos/battery_18/thumb/hkpbsnuomq21stnh5osd.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/i6qjs8650wvujww0ve6a.jpg',thumb:'/photos/battery_18/thumb/i6qjs8650wvujww0ve6a.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/icuo658444ihanapiiha.jpg',thumb:'/photos/battery_18/thumb/icuo658444ihanapiiha.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/ivojxzow9hujgeexdkoj.jpg',thumb:'/photos/battery_18/thumb/ivojxzow9hujgeexdkoj.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/jajasl8gogpxhhtbvevj.jpg',thumb:'/photos/battery_18/thumb/jajasl8gogpxhhtbvevj.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/ju3ihzdh1ltjxd8b6cfd.jpg',thumb:'/photos/battery_18/thumb/ju3ihzdh1ltjxd8b6cfd.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/kculmo97j1whdvy7pets.jpg',thumb:'/photos/battery_18/thumb/kculmo97j1whdvy7pets.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/kfi9crxqosvaduxx8vci.jpg',thumb:'/photos/battery_18/thumb/kfi9crxqosvaduxx8vci.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/ktl3myuo7mqqjdwh37n7.jpg',thumb:'/photos/battery_18/thumb/ktl3myuo7mqqjdwh37n7.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/l9suuhoqzqpjfmpipmjc.jpg',thumb:'/photos/battery_18/thumb/l9suuhoqzqpjfmpipmjc.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/li4k06qg38tyhabyu3y6.jpg',thumb:'/photos/battery_18/thumb/li4k06qg38tyhabyu3y6.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/lnhmuc0f7cdedif1ydqs.jpg',thumb:'/photos/battery_18/thumb/lnhmuc0f7cdedif1ydqs.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/lqqhtktwlg3wm7ytne1h.jpg',thumb:'/photos/battery_18/thumb/lqqhtktwlg3wm7ytne1h.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/m2hslakz7s711bt3gxwj.jpg',thumb:'/photos/battery_18/thumb/m2hslakz7s711bt3gxwj.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/m18juofhkspit2red3kq.jpg',thumb:'/photos/battery_18/thumb/m18juofhkspit2red3kq.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/mkj9f9jdvjtcjmq9mpxu.jpg',thumb:'/photos/battery_18/thumb/mkj9f9jdvjtcjmq9mpxu.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/mkmhcoeanyckudmz4yhs.jpg',thumb:'/photos/battery_18/thumb/mkmhcoeanyckudmz4yhs.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/mslhwy2sdlsppyeeybt6.jpg',thumb:'/photos/battery_18/thumb/mslhwy2sdlsppyeeybt6.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/oqzg7xutp6fe5ctmnig7.jpg',thumb:'/photos/battery_18/thumb/oqzg7xutp6fe5ctmnig7.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/otl7vnyoc91vqigme21p.jpg',thumb:'/photos/battery_18/thumb/otl7vnyoc91vqigme21p.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/ow70qvo6iulczvwbgec8.jpg',thumb:'/photos/battery_18/thumb/ow70qvo6iulczvwbgec8.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/phhsg3wuqwvd1n3iux3q.jpg',thumb:'/photos/battery_18/thumb/phhsg3wuqwvd1n3iux3q.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/pjjsqldnits7wzeyyuwm.jpg',thumb:'/photos/battery_18/thumb/pjjsqldnits7wzeyyuwm.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/prh8ugjsvu4i1zbofu7q.jpg',thumb:'/photos/battery_18/thumb/prh8ugjsvu4i1zbofu7q.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/px5egcjylutjsqzjjdim.jpg',thumb:'/photos/battery_18/thumb/px5egcjylutjsqzjjdim.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/qiclj88rwkwhsllkdvva.jpg',thumb:'/photos/battery_18/thumb/qiclj88rwkwhsllkdvva.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/qwtzzixpk78ogocjqmhq.jpg',thumb:'/photos/battery_18/thumb/qwtzzixpk78ogocjqmhq.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_18/rufefh6xbw1pao8xonma.jpg',thumb:'/photos/battery_18/thumb/rufefh6xbw1pao8xonma.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_18/sa1svpos8slb0fu0hug0.jpg',thumb:'/photos/battery_18/thumb/sa1svpos8slb0fu0hug0.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/sdwzmxjc050cvf9ujorz.jpg',thumb:'/photos/battery_18/thumb/sdwzmxjc050cvf9ujorz.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/setlauiuruj0se6pn3ib.jpg',thumb:'/photos/battery_18/thumb/setlauiuruj0se6pn3ib.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/sivskhgcunumnyhyhwp0.jpg',thumb:'/photos/battery_18/thumb/sivskhgcunumnyhyhwp0.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/tjhpzkadukzw4thzayjs.jpg',thumb:'/photos/battery_18/thumb/tjhpzkadukzw4thzayjs.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/tt0or37daaw38i7kr9if.jpg',thumb:'/photos/battery_18/thumb/tt0or37daaw38i7kr9if.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/tx6g7mud1emvf4g5rbuk.jpg',thumb:'/photos/battery_18/thumb/tx6g7mud1emvf4g5rbuk.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/uomjhqz79o7vpkcacfzz.jpg',thumb:'/photos/battery_18/thumb/uomjhqz79o7vpkcacfzz.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/upc3kebx54i2ndziozm0.jpg',thumb:'/photos/battery_18/thumb/upc3kebx54i2ndziozm0.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/w6xjab538skgscluqcpo.jpg',thumb:'/photos/battery_18/thumb/w6xjab538skgscluqcpo.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/wfywjjmvvrnloil8sqwg.jpg',thumb:'/photos/battery_18/thumb/wfywjjmvvrnloil8sqwg.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/wiu8ms9bsdx6ngiecsaw.jpg',thumb:'/photos/battery_18/thumb/wiu8ms9bsdx6ngiecsaw.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/wjlp5p9w4bhfvyiupmaw.jpg',thumb:'/photos/battery_18/thumb/wjlp5p9w4bhfvyiupmaw.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/wjxis3mwluekygefp2di.jpg',thumb:'/photos/battery_18/thumb/wjxis3mwluekygefp2di.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/wxa3x8uqp06zl8tvjujq.jpg',thumb:'/photos/battery_18/thumb/wxa3x8uqp06zl8tvjujq.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/wzccdupvi1wjyojvgtev.jpg',thumb:'/photos/battery_18/thumb/wzccdupvi1wjyojvgtev.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/x0zadrnicovym4ggbe8n.jpg',thumb:'/photos/battery_18/thumb/x0zadrnicovym4ggbe8n.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/x3mgd5ma3kt28hjyrwba.jpg',thumb:'/photos/battery_18/thumb/x3mgd5ma3kt28hjyrwba.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/xsmbwldtqjspmoe6ljhw.jpg',thumb:'/photos/battery_18/thumb/xsmbwldtqjspmoe6ljhw.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/y39njlfhosxpdqwawj3n.jpg',thumb:'/photos/battery_18/thumb/y39njlfhosxpdqwawj3n.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/ziqgwpxy1mfsosro5nuc.jpg',thumb:'/photos/battery_18/thumb/ziqgwpxy1mfsosro5nuc.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/zpwafwz7rtjlwblh9xc8.jpg',thumb:'/photos/battery_18/thumb/zpwafwz7rtjlwblh9xc8.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_18/zthy92c4qhsmfclfepzy.jpg',thumb:'/photos/battery_18/thumb/zthy92c4qhsmfclfepzy.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/zwshphnbobrrnq1xkz5e.jpg',thumb:'/photos/battery_18/thumb/zwshphnbobrrnq1xkz5e.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_18/1rtz57cnc6fnmp787lqb.jpg',thumb:'/photos/battery_18/thumb/1rtz57cnc6fnmp787lqb.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/2pv1zsiak6c9zaom1wec.jpg',thumb:'/photos/battery_18/thumb/2pv1zsiak6c9zaom1wec.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/5dyv1qkrl7lmhkwgmoo6.jpg',thumb:'/photos/battery_18/thumb/5dyv1qkrl7lmhkwgmoo6.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/7nrihhum7hmkwb5d7khh.jpg',thumb:'/photos/battery_18/thumb/7nrihhum7hmkwb5d7khh.jpg',caption:'',width:1440,height:962},
{orig:'/photos/battery_18/9fuwt6g206agjdhdn60z.jpg',thumb:'/photos/battery_18/thumb/9fuwt6g206agjdhdn60z.jpg',caption:'',width:1440,height:962},
        ],
        videos:[]
    },
    {
        name:'Батарея XVII',
        link_name:'Весна 2014',
        description:'<p>9,10,11 апреля 2014</p>',
        photos:[
{orig:'/photos/battery_17/phgszdjw8jnq6tz1n0x8.jpg',thumb:'/photos/battery_17/thumb/phgszdjw8jnq6tz1n0x8.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/pis743xurhss51snxeh1.jpg',thumb:'/photos/battery_17/thumb/pis743xurhss51snxeh1.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/pnej0ekgrh8kvqlc9fsp.jpg',thumb:'/photos/battery_17/thumb/pnej0ekgrh8kvqlc9fsp.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/qla5asot2yq4e2zoefnw.jpg',thumb:'/photos/battery_17/thumb/qla5asot2yq4e2zoefnw.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/qmfibqbzbxcag4wae93d.jpg',thumb:'/photos/battery_17/thumb/qmfibqbzbxcag4wae93d.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/r7ra4cpo1qzfq2djnidz.jpg',thumb:'/photos/battery_17/thumb/r7ra4cpo1qzfq2djnidz.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/rt4ljvj7xh9afla5yuvp.jpg',thumb:'/photos/battery_17/thumb/rt4ljvj7xh9afla5yuvp.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/tkbfmlhmrmagg44jyamy.jpg',thumb:'/photos/battery_17/thumb/tkbfmlhmrmagg44jyamy.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/u1ylu3kz0a2ngeg5enxn.jpg',thumb:'/photos/battery_17/thumb/u1ylu3kz0a2ngeg5enxn.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/u30qsjccjbrn2fif3njg.jpg',thumb:'/photos/battery_17/thumb/u30qsjccjbrn2fif3njg.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/uocfehimwu7l2fq4sht1.jpg',thumb:'/photos/battery_17/thumb/uocfehimwu7l2fq4sht1.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/vnky1zzgf559n6tgdomn.jpg',thumb:'/photos/battery_17/thumb/vnky1zzgf559n6tgdomn.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/xqksgulivd9svfk0lmxy.jpg',thumb:'/photos/battery_17/thumb/xqksgulivd9svfk0lmxy.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/yitvc0nuqlpabbtestfb.jpg',thumb:'/photos/battery_17/thumb/yitvc0nuqlpabbtestfb.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/zbldqsoerefluumlx86w.jpg',thumb:'/photos/battery_17/thumb/zbldqsoerefluumlx86w.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/zeyzhdpj7hqqdt9wrhcs.jpg',thumb:'/photos/battery_17/thumb/zeyzhdpj7hqqdt9wrhcs.jpg',caption:'',width:1440,height:959},
{orig:'/photos/battery_17/zizgyln7v2wtpedfoowz.jpg',thumb:'/photos/battery_17/thumb/zizgyln7v2wtpedfoowz.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/zucqnxxeqxtpatiu3blg.jpg',thumb:'/photos/battery_17/thumb/zucqnxxeqxtpatiu3blg.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/0intujadfe1nh7vc8fob.jpg',thumb:'/photos/battery_17/thumb/0intujadfe1nh7vc8fob.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/0o919dxkrokxz4lcxs4n.jpg',thumb:'/photos/battery_17/thumb/0o919dxkrokxz4lcxs4n.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/1suod7oj8otlclapeqvq.jpg',thumb:'/photos/battery_17/thumb/1suod7oj8otlclapeqvq.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/7irinaykxgxwxp2o7ndy.jpg',thumb:'/photos/battery_17/thumb/7irinaykxgxwxp2o7ndy.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/8wv0fanigx2aha5wcco5.jpg',thumb:'/photos/battery_17/thumb/8wv0fanigx2aha5wcco5.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/8zdfwrkvdjmkq7dnio27.jpg',thumb:'/photos/battery_17/thumb/8zdfwrkvdjmkq7dnio27.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/9xhjfakjitozrtvgs6dx.jpg',thumb:'/photos/battery_17/thumb/9xhjfakjitozrtvgs6dx.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/80buxrfscyfymu2s4ou9.jpg',thumb:'/photos/battery_17/thumb/80buxrfscyfymu2s4ou9.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/97zekjujoxju3zpuxit3.jpg',thumb:'/photos/battery_17/thumb/97zekjujoxju3zpuxit3.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/alpgwsc0p8vfkgtohweg.jpg',thumb:'/photos/battery_17/thumb/alpgwsc0p8vfkgtohweg.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/avrtjykaxfsos53lwxwo.jpg',thumb:'/photos/battery_17/thumb/avrtjykaxfsos53lwxwo.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/cbadptbivcbr7sdepu6k.jpg',thumb:'/photos/battery_17/thumb/cbadptbivcbr7sdepu6k.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/cslmdrzpl7jtvjddjvda.jpg',thumb:'/photos/battery_17/thumb/cslmdrzpl7jtvjddjvda.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/dwlc5wsujqmuphebbutr.jpg',thumb:'/photos/battery_17/thumb/dwlc5wsujqmuphebbutr.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/dyhsrbsqpza9cmspukis.jpg',thumb:'/photos/battery_17/thumb/dyhsrbsqpza9cmspukis.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/ekfhgyi6j5irwqzitsd9.jpg',thumb:'/photos/battery_17/thumb/ekfhgyi6j5irwqzitsd9.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/ewn4aebxmoyilmlani5m.jpg',thumb:'/photos/battery_17/thumb/ewn4aebxmoyilmlani5m.jpg',caption:'',width:1440,height:959},
{orig:'/photos/battery_17/eziypuyt4lt0vmfpf1in.jpg',thumb:'/photos/battery_17/thumb/eziypuyt4lt0vmfpf1in.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/fhv3uspxyauppfsnwesq.jpg',thumb:'/photos/battery_17/thumb/fhv3uspxyauppfsnwesq.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/fuqxjdgh0pnbmkwxfglh.jpg',thumb:'/photos/battery_17/thumb/fuqxjdgh0pnbmkwxfglh.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/g23jlrvptftsbf1dmon0.jpg',thumb:'/photos/battery_17/thumb/g23jlrvptftsbf1dmon0.jpg',caption:'',width:679,height:1024},
{orig:'/photos/battery_17/gdb56tuicsjqg6pyj4ms.jpg',thumb:'/photos/battery_17/thumb/gdb56tuicsjqg6pyj4ms.jpg',caption:'',width:1440,height:959},
{orig:'/photos/battery_17/gnawujpz4ojxrscojmio.jpg',thumb:'/photos/battery_17/thumb/gnawujpz4ojxrscojmio.jpg',caption:'',width:1440,height:959},
{orig:'/photos/battery_17/gts9dy0hmdxhweob4qve.jpg',thumb:'/photos/battery_17/thumb/gts9dy0hmdxhweob4qve.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/gwfogbdpixynqxhjd1zf.jpg',thumb:'/photos/battery_17/thumb/gwfogbdpixynqxhjd1zf.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/hr07cy1jecywfvhh8tln.jpg',thumb:'/photos/battery_17/thumb/hr07cy1jecywfvhh8tln.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/icxdlkf6ru71guxv5hyv.jpg',thumb:'/photos/battery_17/thumb/icxdlkf6ru71guxv5hyv.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/j8hndl0bq5wvxb5t5fti.jpg',thumb:'/photos/battery_17/thumb/j8hndl0bq5wvxb5t5fti.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/jznwhiqsqffv8a25cs4u.jpg',thumb:'/photos/battery_17/thumb/jznwhiqsqffv8a25cs4u.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/k0oiwzviryvajwuvdfd9.jpg',thumb:'/photos/battery_17/thumb/k0oiwzviryvajwuvdfd9.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/kkc6utiwyubbaezx5bjb.jpg',thumb:'/photos/battery_17/thumb/kkc6utiwyubbaezx5bjb.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/l7ktcafxb4gvqoshfrxt.jpg',thumb:'/photos/battery_17/thumb/l7ktcafxb4gvqoshfrxt.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/mf32qjrc4nbgmfsokm3f.jpg',thumb:'/photos/battery_17/thumb/mf32qjrc4nbgmfsokm3f.jpg',caption:'',width:1440,height:960},
{orig:'/photos/battery_17/mj2u3uuojmoi4rhucrjr.jpg',thumb:'/photos/battery_17/thumb/mj2u3uuojmoi4rhucrjr.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/mnv2ii39el4vbtdbm668.jpg',thumb:'/photos/battery_17/thumb/mnv2ii39el4vbtdbm668.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/nmh2h28s8fv72c60nblv.jpg',thumb:'/photos/battery_17/thumb/nmh2h28s8fv72c60nblv.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/nwjgokat73tlfhplbkge.jpg',thumb:'/photos/battery_17/thumb/nwjgokat73tlfhplbkge.jpg',caption:'',width:683,height:1024},
{orig:'/photos/battery_17/odjt1kecetvfeyjjk5ae.jpg',thumb:'/photos/battery_17/thumb/odjt1kecetvfeyjjk5ae.jpg',caption:'',width:1440,height:961},
{orig:'/photos/battery_17/omidwng0masmt7769ptb.jpg',thumb:'/photos/battery_17/thumb/omidwng0masmt7769ptb.jpg',caption:'',width:1440,height:961},
],
        videos:[],
    },
    {
        name:'Батарея XVI',
        link_name:'Зима 2013',
        description:'5 декабря 2013',
        photos:[
{orig:'/photos/battery_16/yvw7yheneimzhdd7rauq.jpg',thumb:'/photos/battery_16/thumb/yvw7yheneimzhdd7rauq.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/5zmns41z16jddurf4bta.jpg',thumb:'/photos/battery_16/thumb/5zmns41z16jddurf4bta.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/7ucmuvltuqptdvpenbw1.jpg',thumb:'/photos/battery_16/thumb/7ucmuvltuqptdvpenbw1.jpg',caption:'',width:1151,height:768},
{orig:'/photos/battery_16/9u71c9hahxgfiye8efd8.jpg',thumb:'/photos/battery_16/thumb/9u71c9hahxgfiye8efd8.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/abbknfashg1hrrh913oo.jpg',thumb:'/photos/battery_16/thumb/abbknfashg1hrrh913oo.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/dtjaserx6ltll5zpzzma.jpg',thumb:'/photos/battery_16/thumb/dtjaserx6ltll5zpzzma.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/fh7j6ekgrbtuawcgzfet.jpg',thumb:'/photos/battery_16/thumb/fh7j6ekgrbtuawcgzfet.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/fqi2j1ezcdelsua7vuqv.jpg',thumb:'/photos/battery_16/thumb/fqi2j1ezcdelsua7vuqv.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/gagciubgh6fsqywssxuk.jpg',thumb:'/photos/battery_16/thumb/gagciubgh6fsqywssxuk.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/h2ppgyriapkc4eyolqn5.jpg',thumb:'/photos/battery_16/thumb/h2ppgyriapkc4eyolqn5.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/hqdvvymuhe28mygw7fue.jpg',thumb:'/photos/battery_16/thumb/hqdvvymuhe28mygw7fue.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/iuhqdtj9sik7lchzjebw.jpg',thumb:'/photos/battery_16/thumb/iuhqdtj9sik7lchzjebw.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/lizdwz3ynrbzm1jzv7jh.jpg',thumb:'/photos/battery_16/thumb/lizdwz3ynrbzm1jzv7jh.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/lk2fohwadlzpbessk15j.jpg',thumb:'/photos/battery_16/thumb/lk2fohwadlzpbessk15j.jpg',caption:'',width:1151,height:768},
{orig:'/photos/battery_16/lox0hodv2qhpyojwst6v.jpg',thumb:'/photos/battery_16/thumb/lox0hodv2qhpyojwst6v.jpg',caption:'',width:1150,height:768},
{orig:'/photos/battery_16/lz56d3pqopqtoeyfdoft.jpg',thumb:'/photos/battery_16/thumb/lz56d3pqopqtoeyfdoft.jpg',caption:'',width:1366,height:669},
{orig:'/photos/battery_16/mgqri33rnwfhuvtvszja.jpg',thumb:'/photos/battery_16/thumb/mgqri33rnwfhuvtvszja.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/mnfo6wknspmbw9zxoub3.jpg',thumb:'/photos/battery_16/thumb/mnfo6wknspmbw9zxoub3.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/n1isj7breylkrs82u9bc.jpg',thumb:'/photos/battery_16/thumb/n1isj7breylkrs82u9bc.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/nddtedhy2p5rf8u3rmvq.jpg',thumb:'/photos/battery_16/thumb/nddtedhy2p5rf8u3rmvq.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/oll3csdwplldkya3qnzx.jpg',thumb:'/photos/battery_16/thumb/oll3csdwplldkya3qnzx.jpg',caption:'',width:1151,height:768},
{orig:'/photos/battery_16/p5a7c5sntlwwdprg3d0d.jpg',thumb:'/photos/battery_16/thumb/p5a7c5sntlwwdprg3d0d.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/qancvbmm3gfnmvnin7rd.jpg',thumb:'/photos/battery_16/thumb/qancvbmm3gfnmvnin7rd.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/qpsmfzfab2toyfavluwr.jpg',thumb:'/photos/battery_16/thumb/qpsmfzfab2toyfavluwr.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/ri61ewzd19h1ijnhtayw.jpg',thumb:'/photos/battery_16/thumb/ri61ewzd19h1ijnhtayw.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/rii8tq8eakso0nkurtob.jpg',thumb:'/photos/battery_16/thumb/rii8tq8eakso0nkurtob.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/szpt0nmswlg3ixetgvcu.jpg',thumb:'/photos/battery_16/thumb/szpt0nmswlg3ixetgvcu.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/tgxxyw0ylkfje3cqt2s4.jpg',thumb:'/photos/battery_16/thumb/tgxxyw0ylkfje3cqt2s4.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/tqv8hyxhwtzegybiyvrk.jpg',thumb:'/photos/battery_16/thumb/tqv8hyxhwtzegybiyvrk.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/udrzxlcdsidufo1dtrwe.jpg',thumb:'/photos/battery_16/thumb/udrzxlcdsidufo1dtrwe.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/ui7hqwnvoorefowxrnqm.jpg',thumb:'/photos/battery_16/thumb/ui7hqwnvoorefowxrnqm.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/uurn2qabmdttnurtil1y.jpg',thumb:'/photos/battery_16/thumb/uurn2qabmdttnurtil1y.jpg',caption:'',width:512,height:768},
{orig:'/photos/battery_16/va1kotvzb4exvq1o5jko.jpg',thumb:'/photos/battery_16/thumb/va1kotvzb4exvq1o5jko.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/wtvmlzgvuqjlfvxtfw41.jpg',thumb:'/photos/battery_16/thumb/wtvmlzgvuqjlfvxtfw41.jpg',caption:'',width:1152,height:768},
{orig:'/photos/battery_16/xgd0rsv8df2uktgmlfnb.jpg',thumb:'/photos/battery_16/thumb/xgd0rsv8df2uktgmlfnb.jpg',caption:'',width:511,height:768},
],
        videos:[],
    },
    {
        name:'Батарея XV',
        link_name:'Весна 2012',
        description:'Весна 2012',
        photos:[],
        videos:[
            {name:'Lightroom - Сон (Live БАТАРЕЯ 2012. Весна)',url:'https://www.youtube.com/watch?t=1&v=dtB7jcdpfjo',thumb:'http://img.youtube.com/vi/dtB7jcdpfjo/0.jpg'},
            {name:'Newrolla - Про слона (Live БАТАРЕЯ 2012. Весна)',url:'https://www.youtube.com/watch?v=VySa_vs1zOs',thumb:'http://img.youtube.com/vi/VySa_vs1zOs/0.jpg'}

        ],
    }
];
festControllers.controller('Media',
    function($scope,$sce,Head,Menu){
        Head.setTitle('Отчеты');
        Menu.setActive('media');
        $scope.CurrentAlbum = albums[0];
        $scope.albumDescription = $sce.trustAsHtml(albums[0].description);
        $scope.albumName = albums[0].name;
        $scope.AlbumPhotos = albums[0].photos;
        $scope.AlbumVideos = albums[0].videos;
        $scope.Albums = albums;
        /* construct gallery */
        $scope.openGallery = function (event,index){
            event.preventDefault();
            var pswpElement = document.querySelectorAll('.pswp')[0];
            // build items array
            var items = [];
            angular.forEach($scope.AlbumPhotos, function(item, key) {
                items.push({
                    src: item.orig,
                    w: item.width,
                    h: item.height,
                    title: item.caption,
                    msrc: item.orig,
                });
            });
            var options = {
                index: index, // start at index slide
                history: false,
                backButtonHideEnabled: false,
                shareEl: false,
                shareButtons: [
                    {id:'facebook', label:'Поделиться на Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
                    {id:'vk', label:'Поделиться Вконтакте', url:'http://vk.com/share.php?url={{url}}'},
                    {id:'twitter', label:'Твитнуть', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
                    //{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'},
                    {id:'download', label:'Скачать фото', url:'{{raw_image_url}}', download:true}
                ],
                getThumbBoundsFn: function(index) {
                    // find thumbnail element
                    var thumbnail = document.querySelectorAll('.photo-thumb')[index];
                    // get window scroll Y
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
                    // optionally get horizontal scroll
                    // get position of element relative to viewport
                    var rect = thumbnail.getBoundingClientRect(); 
                    // w = width
                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                
                
                    // Good guide on how to get element coordinates:
                    // http://javascript.info/tutorial/coordinates
                }
            };
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        }
        $scope.selectAlbum = function(index){
            $scope.CurrentAlbum = albums[index];
            $scope.albumDescription = $sce.trustAsHtml(albums[index].description);
            $scope.albumName = albums[index].name;
            $scope.AlbumPhotos = albums[index].photos;
            $scope.AlbumVideos = albums[index].videos;
        }

    });
var Lineup = [
    {
        name:'Саша Прёт',
        url:'http://studband.ru/artist/sasha+pryot'
    }, 
    {
        name:'Jordans'
    },
    {
        name:'Штормовое Предупреждение'
    },
    {
        name:'MORE/',
        university:'ВИТИГ',
        url:'http://studband.ru/artist/more'
    },
    {
        name:'Sell The Ray',
        university:'МФТИ',
        url:'http://studband.ru/artist/sell+the+ray'
    },
    {
        name:'GO!inside'
    },
    {
        name:'Trial'
    },
    {
        name:'Dark Corner'
    },
    {
        name:'Small Spark Destroys a Forest',
        url:'http://studband.ru/artist/small+spark+destroys+a+forest'
    },
];
festControllers.controller('Lineup',
    function($scope,Head,Menu){
        Head.setTitle('Lineup');
        Menu.setActive('lineup');
        $scope.Groups = Lineup;
    });
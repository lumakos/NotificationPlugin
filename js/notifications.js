var getRandomItem = function (list) {
    return Math.floor(Math.random()*list.length);
}

var actions = [
    'hearted your pen',
    'commented on your pen',
    'followed you',
    'mentioned you in'
];

var pens = [
    'a great pen!',
    'testing VelocityJs',
    'multiple css3 background',
    'best pen ever!!!11 yolo',
    'notifications!'
];

var Notification = function(data) {
    this.name = data.name.first + ' ' + data.name.last;

    this.message = this.randomMessage();

    this.picture = data.picture.thumbnail;
    this.elem;
    this.duration = 8000;

    this.create();

    this.animOptions = {
        duration: 400,
        easing: 'easeInOut'
    };

    this.show = function() {
        $(this.elem).velocity(
            {
                opacity: [1, 0],
                marginTop: [0, 20]
            }, this.animOptions
        );

        this.delete();
    }

};

Notification.prototype.randomMessage = function() {
    var message = '',
        action = actions[getRandomItem(actions)];

    message += '<a href="#">'+this.name+'</a> ';
    message += action;
    if (!(actions.indexOf(action) == 2)) {
        message += ' <a href="#">' + pens[getRandomItem(pens)] + '</a>';
    }

    return message;
};

Notification.prototype.delete = function(instant) {
    this.duration = (typeof instant == "undefined") ? 8000 : 0;
    this.animOptions = {
        duration: 400,
        easing: 'easeInOut'
    };

    var opts = this.animOptions;
    opts['delay'] = this.duration;
    opts['display'] = 'none';
    $(this.elem).velocity("stop", true).velocity(
        {
            opacity: [0, 1],
            marginTop: [-75, 0]
        }, opts
    );
};

Notification.prototype.create = function() {
    var box = document.createElement('div');
    box.classList.add('n-box');

    var close = document.createElement('div');
    close.classList.add('n-close');
    close.innerHTML = '&times;';
    //close notification
    close.addEventListener('click', (function(element){ return function(){ element.delete(true); }; })(this), false);

    console.log(this.message);

    var picture =  document.createElement('img');
    picture.classList.add('n-picture');
    picture.src = this.picture;

    var body = document.createElement('div');
    body.classList.add('n-body');

    var message = document.createElement('span');
    message.classList.add('n-message');

    message.innerHTML = this.message;

    box.appendChild(close);
    box.appendChild(picture);
    box.appendChild(message);

    var wrapper = document.getElementById('wrapper');
    wrapper.appendChild(box);

    this.elem = box;
};


$(function(){

    var users = {};

    // users from randomuser.me
    var request = $.getJSON('https://s3-us-west-2.amazonaws.com/s.cdpn.io/128337/users.json');

    $.when( request ).done(function() {
        var btn = document.querySelector('.simulate')
        btn.disabled = false
        btn.innerHTML = 'Notify!'
        console.log(request.responseJSON);
        users = request.responseJSON.results;

        var notifications = [];

        var pushNotif = function(){
            var user = users[Math.floor(Math.random()*users.length)].user;

            var n = new Notification(user);
            n.show();
            notifications.push(n);
        };

        btn.addEventListener('click', pushNotif, false);

    });

});

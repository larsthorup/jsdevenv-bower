define(function (require) {
    require('jquery');
    require('less!newsfeed/newsfeed');
    var template = require('text!newsfeed/newsfeed.html');

    function render(container) {
        container.html(template);
    }

    return {
        render: render
    };
});
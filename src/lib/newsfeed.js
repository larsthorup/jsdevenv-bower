define(function (require) {
    require('jquery');
    require('less!lib/newsfeed');
    var template = require('text!lib/newsfeed.html');

    function render(container) {
        container.html(template);
    }

    return {
        render: render
    };
});
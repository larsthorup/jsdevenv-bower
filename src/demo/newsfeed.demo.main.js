require.config({baseUrl: '..'});
require(['require.conf'], function () {
    require(['jquery', 'newsfeed/newsfeed'], function ($, newsfeed) {
        newsfeed.render($('#newsfeed-container'));
    });
});

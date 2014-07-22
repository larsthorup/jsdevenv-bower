require.config({baseUrl: '..'});
require(['require.conf'], function () {
    require(['jquery', 'lib/newsfeed'], function ($, newsfeed) {
        newsfeed.render($('#newsfeed-container'));
    });
});

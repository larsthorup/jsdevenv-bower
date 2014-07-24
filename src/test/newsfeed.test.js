define(function (require) {
    var expect = require('chai').expect;
    var $ = require('jquery');
    var newsfeed = require('newsfeed/newsfeed');

    describe('newsfeed', function () {
        it('renders', function () {
            var container = $('<div></div>');
            newsfeed.render(container);
            expect(container.find('.newsfeed li').eq(0).text().trim()).to.equal('More peace');
        })
    })
});
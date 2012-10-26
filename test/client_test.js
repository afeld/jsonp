/*jshint browser:true*/
/*global describe, $, it, sinon, assert, expect */
describe('$.jsonp()', function(){
  it('should do standard ajax for relative domains', function(){
    sinon.stub($, 'ajax');

    $.jsonp({
      url: '/foo'
    });

    expect($.ajax.calledWithMatch({url: '/foo'})).to.be.ok();
  });
});

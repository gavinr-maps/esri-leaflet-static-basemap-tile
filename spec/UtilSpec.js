describe('Util', function () {
    it('should error on getSelf if no access token is provided', function (done) {
        L.esri.Static.Util.getSelf().catch(e => {
          expect(e).to.equal('An access token is required to access the static basemap tiles service.')});
          done();
    });
});
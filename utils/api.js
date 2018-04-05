var axios = requires('axios');

module.exports = {
  fetchCans: function(id) {
    var encodedURI = window.encodeURI('http://localhost:3004/cans/' + id);
  }
};

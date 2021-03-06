
var $ = require('jquery');

$(function() {

  var $tvShowsContainer = $('#app-body').find('.tv-shows');

  
  $tvShowsContainer.on('click','button.like',function(ev){
    var $this = $(this); 
    $this.closest('.tv-show').toggleClass('liked');
  })


  function renderShows(shows) {
    $tvShowsContainer.find('.loader').remove(); 
    shows.forEach(function (show) {
      var article = template
        .replace(':name:', show.name)
        .replace(':img:', show.image ? show.image.medium : '')
        .replace(':summary:', show.summary)
        .replace(':img alt:', show.name + " Logo")

      var $article = $(article)  
      $article.hide();
      $tvShowsContainer.append($article.fadeIn(1500));
    })
  }

  /**
   * Submit search form

   */
  
  $('#app-body')
    .find('form')
    .submit(function (ev) {
      ev.preventDefault();
      var busqueda = $(this)
        .find('input[type="text"]')
        .val(  );


      $tvShowsContainer.find('.tv-show').remove() 
      var $loader = $('<div class="loader">'); 
      $loader.appendTo($tvShowsContainer );//anexamos al final nuestros shows
      $.ajax({
        url: 'http://api.tvmaze.com/search/shows', 
        data: { q: busqueda },//q es el valor que toma el api para trabajar con su data  
        success: function (res, textStatus, xhr) { //al hacer un console.log de res vemos quje nos devuelve un array con objetos
          $loader.remove();
          var shows = res.map(function (el) {
            return el.show;//al ser una funcion map, trabajamos con el elemento en si(el) y dentrro de este map podremos trbajar con la propiedad que nososotros queramos, en este caso el show.
          })

          renderShows(shows);          
        }
      })
    })


  var template = '<article class="tv-show">' +
          '<div class="left img-container">' +
            '<img src=":img:" alt=":img alt:">' +
          '</div>' +
          '<div class="right info">' +
            '<h1>:name:</h1>' +
            '<p>:summary:</p>' +
            '<button  class="like">💖</button>'
          '</div>' +
        '</article>';


  if (!localStorage.shows) {//si no existe, hacemos el request
    
    $.ajax('https://api.tvmaze.com/shows')
      .then(function (shows) {
        $tvShowsContainer.find('.loader').remove();
        localStorage.shows = JSON.stringify(shows);
        renderShows(shows);
      })
  } else { //si exista datos
    renderShows(JSON.parse(localStorage.shows));
  }
  






})

$(function(){

    var citations = {
        'auteur':'Vincent Beaulieu',
        'citation':'Ce site permet de faire des citations secretes'
    }

    var nbColonnes = 10;

    function initColonnes(citation){
        var colonnes = [];

        for(var i = 0; i < nbColonnes; i++){
            var colonne = citation.split('').filter((letter, index) => index % nbColonnes == i);
            colonnes.push(colonne);
        }

        return colonnes;
    }

    var colonnes = initColonnes(citations.citation);
    console.log(colonnes);

    var maxIndices = 0;
    $('.col--indices').each(function(){
        var indicesCourant = $(this).children('span').length;
        if(indicesCourant > maxIndices) {
            maxIndices = indicesCourant;
        }
    });

    $('.col--indices').each(function(){
        var indicesCourant = $(this).children('span').length;
        $(this).css('paddingTop', (maxIndices - indicesCourant) * 3 + 'rem')
    });

    $('#reponse-1').css('background-color', '#000');


});

function getQuote(){
    $('#spinner').removeClass('d-none');
    $('#btn-new-quote').addClass('not-active');

    $.ajax( {
      url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      success: function(data) {
        var post = data.shift(); // The data is an array of posts. Grab the first one.
        if (post.content.length > 70 || post.content.length < 30) {
            getQuote();
        } else {
            $('#spinner').addClass('d-none');
            $('#btn-new-quote').removeClass('not-active');

            $('#quote-title').text(post.title);
            $('#quote-content').html(post.content);
            // If the Source is available, use it. Otherwise hide it.
            if (typeof post.custom_meta !== 'undefined' && typeof post.custom_meta.Source !== 'undefined') {
                $('#quote-source').html('Source:' + post.custom_meta.Source);
            } else {
                $('#quote-source').text('');
            }

            var rows = splitQuote(post.content);
            placeQuote(rows);

        }
      },
      cache: false
    });
}

function splitQuote(quote) {
    // removes html tags
    quote = quote.replace(/<\/?[^>]+(>|$)|\./g, "")

    // replaces - ' _ # — ,  by spaces
    quote = quote.replace(/#|_|-|'|—|,/g,' ');

    // removes \n and \r
    quote = quote.replace(/\r?\n|\r/g, '');

    // replaces double spaces by simple space
    quote = quote.replace(/ +(?= )/g,'');

    var nbRow = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
    var rowLength = Math.floor(quote.length / nbRow)+1;
    var rows = [];
    for (i = 0; i < nbRow; i++){
        rows.push(quote.substring(i*rowLength, (i+1)*rowLength));
    }
    return rows
}

$(function(){

    var counter = 0;

    var citations = [{
        'auteur':'Vincent Beaulieu',
        'citation':'Ce site permet de faire des citations secretes'
    },
    {
        'auteur':'Vincent Beaulieu',
        'citation':'Vous savez je ne crois pas qu il y ait de bonnes ou de mauvaises situations'
    }]

    var nbColonnes = 12;

    initBoard();

    function initBoard() {
        var citation = citations[1].citation
        var colonnes = getColonnes(citation);
        var sortedColonnes = getSortedColonnes(citation);
    
        var maxIndices = getMaxIndices(colonnes);

        $('#indices').empty();
        $('#reponses').empty();

        for(let i = 0; i < nbColonnes; i++){
    
            var divIndice = document.createElement('div');
            divIndice.classList.add('col');
            divIndice.classList.add('col--indices');
            divIndice.id = 'col--indices-' + i;
    
            var divReponse = document.createElement('div');
            divReponse.classList.add('col');
            divReponse.classList.add('col--reponses');
            divReponse.id = 'col--reponses-' + i;
    
            for(let j = 0; j < sortedColonnes[i].length; j++){
                if(isAlpha(sortedColonnes[i][j])){
                    var spanIndice = document.createElement('span');
                    spanIndice.classList.add('indice');
                    spanIndice.innerHTML = sortedColonnes[i][j].toUpperCase();
                    divIndice.appendChild(spanIndice);
                }
            }
    
            for(let j = 0; j < colonnes[i].length; j++){
                var spanReponse = document.createElement('span');
                spanReponse.classList.add('reponse');
                if(!isAlpha(colonnes[i][j])){
                    $(spanReponse).css('backgroundColor', '#000');
                }
                divReponse.appendChild(spanReponse);
    
            }

            document.getElementById('indices').appendChild(divIndice);
            document.getElementById('reponses').appendChild(divReponse);
    
            var indicesCourant = sortedColonnes[i].filter(letter => isAlpha(letter)).length;
            $('#col--indices-' + i).css('paddingTop', (maxIndices - indicesCourant) * 3 + 'rem');
        }
           
    }
    function getColonnes(citation){
        var colonnes = [];

        for(var i = 0; i < nbColonnes; i++){
            var colonne = citation.split('').filter((letter, index) => index % nbColonnes == i);
            colonnes.push(colonne);
        }
        return colonnes;
    }

    function getSortedColonnes(citation){
        var sortedColonnes = [];

        for(var i = 0; i < nbColonnes; i++){
            var colonne = citation.split('').filter((letter, index) => index % nbColonnes == i);
            sortedColonnes.push(colonne.sort());
        }
        return sortedColonnes;
    }

    $('.indice').click(function(){
        $(this).toggleClass('striked');
    })
    $('#reponse-1').css('background-color', '#000');

    $('#btn-change-width').click(function(e){
        e.preventDefault();
        nbColonnes = prompt('Quelle largeur?');
        initBoard();
    });
    function isAlpha(ch){
        return typeof ch === "string" && ch.length === 1
               && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
      }

      function getMaxIndices(colonnes) {
        var maxIndices = 0;
        for(let i = 0;i < colonnes.length; i++){
            var indicesCourant = colonnes[i].filter(letter => isAlpha(letter)).length;
            if(indicesCourant > maxIndices) {
                maxIndices = indicesCourant;
            }
        }
        return maxIndices;
      } 

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
      cache: false,
      type: 'get'
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

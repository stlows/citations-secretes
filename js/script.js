$(function(){
    var counter = 0;

    var clickedIndice = null;

    var citations = [{
        'auteur':'Vincent Beaulieu',
        'citation':'Ce site permet de faire des citations secretes'
    },
    {
        'auteur':'Vincent Beaulieu',
        'citation':'Vous savez je ne crois pas qu il y ait de bonnes ou de mauvaises situations'
    }]

    var nbColonnes = 12;

    initBoard(citations[1].citation);

    $('#reponse-1').css('background-color', '#000');

    $('#btn-change-width').click(function(e){
        e.preventDefault();
        nbColonnes = prompt('Quelle largeur?');
        initBoard();
    });

    $('#btn-new-quote').click(function(e){
        e.preventDefault();
        getQuote();
    });

    function initBoard(citation) {
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
                    spanReponse.classList.add('space');
                }
                divReponse.appendChild(spanReponse);

            }

            document.getElementById('indices').appendChild(divIndice);
            document.getElementById('reponses').appendChild(divReponse);

            var indicesCourant = sortedColonnes[i].filter(letter => isAlpha(letter)).length;
            $('#col--indices-' + i).css('paddingTop', (maxIndices - indicesCourant) * 3 + 'rem');
        }
        initEvents();
    }

    function initEvents()
    {
        var cursor = document.getElementById('custom-cursor');
        $("body").mousemove(function(e) {
            cursor.style.left = e.pageX-12+"px";
            cursor.style.top = e.pageY-20+"px";
        });

        $('.indice').mousedown(function(e){
            e.preventDefault();

            $("#custom-cursor").html($(this).html());
            $("#custom-cursor").removeClass("d-none");

            $('.indice').attr("id","");
            if (!$(this).hasClass('striked')) {
                $(this).attr("id","indice--selected");
                clickedIndice = $(this);
            }
            s
        });

        $('.reponse').mouseup(function(e){
            e.preventDefault();
            if (!$(this).hasClass('space')){
                var reponseParentID = $(this).parent().attr("id");
                var reponseNb = reponseParentID.substr(reponseParentID.length - 1);

                if ($.trim($(this).html())!='') { // if the element is not empty
                    // un-strike the indice
                    var colIndices = $("#col--indices-"+reponseNb).children();
                    for (i = 0; i < colIndices.length ; i++){
                        if (colIndices[i].innerHTML == $(this).html()){
                            if (colIndices[i].classList.contains('striked')) {
                                colIndices[i].classList.remove('striked');
                                break;
                            }
                        }
                    }
                }

                $(this).empty();

                if (clickedIndice) {
                    if (sameColumn(clickedIndice,$(this))){
                        $(this).html(clickedIndice.html());
                        clickedIndice.addClass('striked');
                    }
                }
            }

            $('.indice').attr("id","");
            clickedIndice = null;
        });

        $("body").mouseup(function(e){
            $("#custom-cursor").addClass("d-none");
        });

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

    function getQuote(){
        $('#spinner').removeClass('d-none');
        $('#btn-new-quote').addClass('not-active');

        $.ajax( {
            url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
            error: function(error) {
                $('#invalid-feedback').html('Erreur lors de la recherche de citation')
                $('#spinner').addClass('d-none');
                $('#btn-new-quote').removeClass('not-active');
            },
            success: function(data) {
                var post = data.shift(); // The data is an array of posts. Grab the first one.
                if (post.content.length > 70 || post.content.length < 30) {
                    getQuote();
                } else {
                    $('#spinner').addClass('d-none');
                    $('#btn-new-quote').removeClass('not-active');
                    var quote = formatQuote(post.content);
                    initBoard(quote);

                    // $('#quote-title').text(post.title);
                    // $('#quote-content').html(quote);
                    // // If the Source is available, use it. Otherwise hide it.
                    // if (typeof post.custom_meta !== 'undefined' && typeof post.custom_meta.Source !== 'undefined') {
                    //     $('#quote-source').html('Source:' + post.custom_meta.Source);
                    // } else {
                    //     $('#quote-source').text('');
                    // }


                }
            },
            cache: false,
            type: 'get'
        });
    }

    function formatQuote(quote) {
        // removes html tags
        quote = quote.replace(/<\/?[^>]+(>|$)|\./g, "")

        // replaces - ' _ # — , & ; ASCII by spaces
        quote = quote.replace(/#|_|-|'|—|,|&|;\d+/g,' ');

        // removes \n and \r
        quote = quote.replace(/\r?\n|\r/g, '');

        // replaces double spaces by simple space
        quote = quote.replace(/ +(?= )/g,'');

        return quote;
    }

    function sameColumn(indice, reponse) {
        var indiceParentID = indice.parent().attr("id");
        var indiceNb = indiceParentID.substr(indiceParentID.length - 1);
        var reponseParentID = reponse.parent().attr("id");
        var reponseNb = reponseParentID.substr(reponseParentID.length - 1);
        if (indiceNb == reponseNb) { // in same column
            return true;
        }
        return false;
    }
});

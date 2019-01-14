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
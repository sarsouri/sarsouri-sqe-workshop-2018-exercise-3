import $ from 'jquery';
//import {UnparseCode} from './code-analyzer';
//import {iv} from './co';
import {build} from './buildTheGraph';
import * as d3graphviz from 'd3-graphviz';
//import * as viz from 'viz.js';
//const esgraph= require('esgraph');
//var node;
//let id=0;
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        //let parsedCode = parseCode(codeToParse,true);
        let myparms = $('#parmsPlaceholder').val();
        $('#parsedCode').val(JSON.stringify());
        let string=build(codeToParse,myparms);
        /*var color=iv(parsedCode,myparms);
        var  node=new Map();
        node=f(parsedCode,node);
        node=mergthenormalnode(node);
        node=mergthenormalnodeleft(node);
        node=coloringthecfg(node,color);
        let string='digraph G {'+changethesrting('',node)+'}';
        //let cfg = esgraph(parsedCode['body'][0]['body']);
        //let dot= esgraph.dot(cfg);*/
        d3graphviz.graphviz('#this').renderDot(string);
    });
});


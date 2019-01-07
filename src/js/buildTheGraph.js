//import $ from 'jquery';
import {parseCode,UnparseCode} from './code-analyzer';
import {iv} from './co';
export {build};
//import * as viz from 'viz.js';
//const esgraph= require('esgraph');
//var node;
let id=0;
function build(codeToParse,myparms) {
    id=0;
    //console.log(id+'dkskalf;jlk');
    let parsedCode = parseCode(codeToParse,true);
    //$('#parsedCode').val(JSON.stringify(parsedCode));
    var color=iv(parsedCode,myparms);
    var  node=new Map();
    node=f(parsedCode,node);
    node=mergthenormalnode(node);
    node=mergthenormalnodeleft(node);
    node=coloringthecfg(node,color);
    let string='digraph G {'+changethesrting('',node)+'}';
    //let cfg = esgraph(parsedCode['body'][0]['body']);
    //let dot= esgraph.dot(cfg);
    return string;
}
/*function tostring(color,n) {
    var s='{';
    for (let i=1;i<n;i++) {
        if (color.has(i)){
            if (color.get(i)) {
                s=s+'(line '+i.toString()+':green'+'),';
            }else {
                s=s+'(line '+i.toString()+':red'+'),';
            }
        }

    }
    s=s+'}';
    return s;
}*/
// string=changethesrting(dot,node);
//let string ='digraph G {n0 [label="entry", shape="diamond"]}'
//d3graphviz.graphviz('#this').renderDot('digraph G {n1 [label="VariableDeclaration",shape="rectangle",fill="red",color="green"]}');
//let svgXml = viz('digraph {a -> b}', { format: 'svg'});
//document.body.innerHtml = svgXml;
function changethesrting(string,node) {
    /*var x =string.split('\n');
    let i=0;
    string='n'+i.toString()+'[label="'+''+'", shape="'+'rectangle'+'"]';
    return string;*/
    string=stringofnormal(string,node);
    string=stringofIf(string,node);
    string=stringofmerg(string,node);
    return string;
}
/*function stringofwhile() {

}*/
function stringofmerg(string,node) {
    if (node.get('type')=='merg'&&node.get('color')!='black') {
        let color=node.get('color');
        if (color=='white')
            color='black';
        node.set('color','black');

        string=string+'n'+node.get('id').toString()+'[label="'+' '+'", shape="'+'circle",'+'color="'+color+'"]\n';
        string=ss(string,node);
    }
    return string;
}
function stringofnormal(string,node) {
    if (node.get('type')=='normal'||node.get('type')=='returnnode') {
        let color=node.get('color');
        if (color=='white')
            color='black';
        string=string+'n'+node.get('id').toString()+'[label="'+node.get('body')+'", shape="'+'rectangle",'+'color="'+color+'"]\n';
        string=ss(string,node);
    }
    return string;
}
function ss(string,node) {
    if (node.get('right')!=null){
        let s='n'+node.get('id').toString()+'-> n'+node.get('right').get('id').toString()+'[]\n';
        //if (string.indexOf(s)==-1) {
        string = string + s;
        //}
        string=changethesrting(string,node.get('right'));
    }
    return string;
}
function stringofIf(string,node) {
    if (node.get('type')=='ifnode'||node.get('type')=='whilenode') {
        //let color=node.get('color');
        //if (color=='white')
        //    color='black';
        string=string+'n'+node.get('id').toString()+'[label="'+node.get('body')+'", shape="'+'diamond",'+'color="'+node.get('color')+'"]\n';
        string=string+'n'+node.get('id').toString()+'-> n'+node.get('right').get('id').toString()+'[label="T"]\n';
        string=string+'n'+node.get('id').toString()+'-> n'+node.get('left').get('id').toString()+'[label="F"]\n';
        string=changethesrting(string,node.get('right'));
        string=changethesrting(string,node.get('left'));
    }
    return string;
}
/* rectangle
let string ='digraph G {n0 [label="entry", style="rounded"]\n' +
     'n1 [label="VariableDeclaration",style="circle",fill="red",color="green"]\n' +
     'n2 [label="VariableDeclaration"]\n' +
     'n3 [label="VariableDeclaration"]\n' +
     'n1 -> n10 [color="red", label="exception"]\n' +
     'n4 [label="BinaryExpression"]\n' +
     'n5 [label="AssignmentExpression"]\n' +
     'n6 [label="ReturnStatement"]\n' +
     'n7 [label="BinaryExpression"]\n' +
     'n8 [label="AssignmentExpression"]\n' +
     'n9 [label="AssignmentExpression"]\n' +
     'n10 [label="exit", style="rounded"]\n' +
     'n0 -> n1 []\n' +
     'n1 -> n2 []\n' +

     'n2 -> n3 []\n' +
     'n2 -> n10 [color="red", label="exception"]\n' +
     'n3 -> n4 []\n' +
     'n4 -> n5 [label="true"]\n' +
     'n4 -> n7 [label="false"]\n' +
     'n4 -> n10 [color="red", label="exception"]\n' +
     'n5 -> n6 []\n' +
     'n5 -> n10 [color="red", label="exception"]\n' +
     'n6 -> n10 []\n' +
     'n7 -> n8 [label="true"]\n' +
     'n7 -> n9 [label="false"]\n' +
     'n7 -> n10 [color="red", label="exception"]\n' +
     'n8 -> n6 []\n' +
     'n8 -> n10 [color="red", label="exception"]\n' +
     'n9 -> n6 []\n' +
     'n9 -> n10 [color="red", label="exception"]\n' +
     '}';
*/
function coloringthecfg(node,color) {
    var temp = node;
    //temp.get('type')=='normal'
    //temp.set('body',temp.get('body')+'\n'+temp.get('right').get('body'));
    while(temp.get('right')!=null||temp.get('left')!=null){
        temp = ifandwhile(temp, color);
    }
    temp.set('color','green');
    return node;
}
function ifandwhile(temp,color) {
    if (temp.get('type')=='ifnode'||temp.get('type')=='whilenode') {
        if (color.get(temp.get('line'))&&temp.get('color')!='green'){
            temp.set('color','green');
            temp = temp.get('right');
        }else {
            temp.set('color','green');
            temp = temp.get('left');
        }
    }else {
        temp.set('color','green');
        temp = temp.get('right');
    }
    return temp;
}






function mergthenormalnode(node) {
    var temp = node;
    while(temp.get('right')!=null||temp.get('left')!=null){
        if (temp.get('type')=='normal'&&temp.get('right').get('type')=='normal') {
            temp.set('body',temp.get('body')+'\n'+temp.get('right').get('body'));
            temp.set('right',temp.get('right').get('right'));
        }else {
            temp=ifwhile(temp);
            temp = temp.get('right');
            //break;
        }//break;

    }
    return node;
}
function mergthenormalnodeleft(node) {
    var temp = node;
    while(temp.get('right')!=null||temp.get('left')!=null){
        if (temp.get('type')=='normal'&&temp.get('right').get('type')=='normal') {
            temp.set('body',temp.get('body')+'\n'+temp.get('right').get('body'));
            temp.set('right',temp.get('right').get('right'));
        }else {
            temp=theleft(temp);
        }
    }
    return node;
}
/*function ifwhileleft(temp) {
    if (temp.get('type') == 'whilenode') {
        temp = whilestleft(temp);
        temp = temp.get('right');
        temp = temp.get('left');
        console.log(temp);
        console.log('ttt');
    }
    return temp;
}*/
/*function whilestleft(temp) {
    while (temp.get('type')!='merg') {
        console.log(temp.get('type'));
        if (temp.get('type')=='normal'&&temp.get('right').get('type')=='normal') {
            temp.set('body', temp.get('body') + '\n' + temp.get('right').get('body'));
            temp.set('right', temp.get('right').get('right'));
        }else {
            temp=theleft(temp);
        }
    }
    console.log(temp.get('type'));
    console.log(temp);
    return temp;
}*/
function theleft(temp) {
    if (temp.get('left')!=null) {
        temp = temp.get('left');
    }else {
        temp = temp.get('right');
    }
    return temp;
}
function ifwhile(temp) {
    if (temp.get('type') == 'whilenode') {

        temp = whilest(temp);
        temp = temp.get('right');
        temp = temp.get('left');
    }
    return temp;
}
function whilest(temp) {
    while (temp.get('type')!='merg') {
        if (temp.get('type')=='normal'&&temp.get('right').get('type')=='normal') {
            temp.set('body', temp.get('body') + '\n' + temp.get('right').get('body'));
            temp.set('right', temp.get('right').get('right'));
        }else {
            temp=temp.get('right');
        }
    }
    return temp;
}
/*function mtnn(temp) {
    console.log(temp.get('type'));
    if (temp.get('type')=='normal'&&temp.get('right').get('type')!='normal'){
        temp=temp.get('right');
    }else {
        if(temp.get('type')=='merg'){
            temp.set('right',mergthenormalnode(temp.get('right')));
        }else {
            console.log(temp.get('type'));
            temp.set('right',mergthenormalnode(temp.get('right')));
            temp.set('left',mergthenormalnode(temp.get('left')));
        }
    }
    return temp;
}*/
//function merg(node) {

//}
function f(x,mynode) {
    if (x.type == 'Program') {
        for (let i = 0; i < x.body.length; i++) {
            mynode= f(x.body[i],mynode);
        }
    }else {
        return mynode = functiondeclaration(x, mynode);//else
    }
    return mynode;
    //if (x.type == 'VariableDeclaration') { variabledeclaration(x);}else {
    //   f1(x);
    //}
}


function  functiondeclaration(x,mynode) {
    var thenode = mynode;
    var newnode;
    var mergnode;
    for (let i = 0; i < x.body.body.length; i++) {
        if (x.body.body[i].type == 'VariableDeclaration' || x.body.body[i].type == 'ExpressionStatement') {
            newnode = normalnode(x.body.body[i]);
            thenode.set('right', newnode);
            thenode = newnode;
        } else {
            if (x.body.body[i].type == 'IfStatement') {
                thenode = if1(thenode, newnode, mergnode, x.body.body[i]);
            } else {
                thenode = functiondeclaration1(thenode, newnode, mergnode, x.body.body[i]);
            }
        }
    }
    //console.log(mynode.get('right'));
    return mynode.get('right');
}
function if1(thenode,newnode,mergnode,x) {
    /// newnode=ifnode(x.body.body[i]);
    mergnode=new Map();
    mergnode.set('type','merg');
    mergnode.set('color','white');
    mergnode.set('id',id);
    id++;
    newnode=ifnode(x,mergnode);
    thenode.set('right',newnode) ;
    thenode=mergnode;
    //console.log(thenode);
    //console.log(newnode);
    return thenode;
}
function functiondeclaration1(thenode,newnode,mergnode,x) {
    if (x.type=='WhileStatement'){
        mergnode=new Map();
        mergnode.set('type','merg');
        mergnode.set('color','white');
        mergnode.set('id',id);
        id++;
        var nextmergnode=new Map();
        nextmergnode.set('type','merg');
        nextmergnode.set('color','white');
        nextmergnode.set('id',id);
        id++;
        newnode=whilenode(x,nextmergnode,mergnode);mergnode.set('right',newnode);thenode.set('right',mergnode) ;thenode=nextmergnode;
    }else {
        newnode=returnnode(x);
        thenode.set('right',newnode) ;
        thenode=newnode;
    }
    return thenode;
}
/*    if (i<x.body.body.length) {
        if (x.body.body[i].type == 'VariableDeclaration' || x.body.body[i].type == 'ExpressionStatement') {
            normalnode(x.body.body[i], mynode);
        }
    }*/
function normalnode(x) {
    var newnode=new Map();
    let s=UnparseCode(x);
    let line=x.loc.start.line;
    //console.log(line);
    //console.log(s);
    newnode.set('id',id);
    id++;
    newnode.set('type','normal');
    newnode.set('color','white');
    newnode.set('body',s);
    newnode.set('line',line);
    newnode.set('right',null);
    newnode.set('left',null);
    return newnode;
}
function ifnode(x,mergnode) {
    var newnode=new Map();
    let s=UnparseCode(x.test);
    let line=x.test.loc.start.line;
    // console.log(line);
    // console.log(s);
    newnode.set('id',id);
    id++;
    newnode.set('type','ifnode');
    newnode.set('color','white');
    newnode.set('body',s);
    newnode.set('line',line);
    newnode.set('right',blockornot(x.consequent,mergnode));
    if (x.alternate!=null) {
        newnode.set('left', blockornot(x.alternate,mergnode));
    }else newnode.set('left', mergnode);
    //console.log(newnode);
    return newnode;
}
function blockornot(x,mergsort) {
    var mynode=new Map();
    if (x.type=='BlockStatement') {
        mynode= blockstatment(x,mynode,mergsort);
    }else{
        mynode=notblock(x,mynode,mergsort);
    }
    // console.log(mynode);
    return mynode;
}
function notblock(x,mynode,globmergsort) {
    var newnode;
    var mergnode;
    if (x.type == 'VariableDeclaration' || x.type == 'ExpressionStatement') {
        mynode = normalnode(x);
        mynode.set('right',globmergsort);
    } else {
        if (x.type == 'IfStatement') {
            mynode = ifnode(x,globmergsort);
        } else {
            mynode = functiondeclaration1(mynode, newnode, mergnode, x);
        }
    }
    // mynode.set('right',globmergsort);
    return mynode;
}
/*function if2(thenode,newnode,mergnode,x) {
    /// newnode=ifnode(x.body.body[i]);
    mergnode=new Map();
    mergnode.set('type','merg');
    newnode=ifnode(x,mergnode);
    thenode.set('right',newnode) ;
    //thenode=mergnode;
    //console.log(thenode);
    console.log(newnode);
    return thenode;
}*/
function blockstatment(x,mynode,globmergnode) {
    //var mynode;
    var thenode=mynode ;
    var newnode;
    var mergnode;
    for (let i = 0; i < x.body.length; i++) {
        if (x.body[i].type == 'VariableDeclaration' || x.body[i].type == 'ExpressionStatement') {
            newnode = normalnode(x.body[i]);
            thenode.set('right', newnode);
            thenode = newnode;
        } else {
            if (x.body[i].type == 'IfStatement') {
                thenode = if1(thenode, newnode, mergnode, x.body[i], i);
            } else {
                thenode = functiondeclaration1(thenode, newnode, mergnode, x.body[i], i);
            }
        }}
    thenode.set('right',globmergnode);
    return mynode.get('right');
}
/*function f1(x) {
    var thenode;
    //var newnode;
    //var mergnode;
    if (x.type == 'VariableDeclaration' || x.type == 'ExpressionStatement') {
        thenode = normalnode(x);
    } else {
        if (x.type == 'IfStatement') {
            thenode = if1(thenode, newnode, mergnode, x, i);
        } else {
            thenode = functiondeclaration1(thenode, newnode, mergnode, x, i);
        }
    }
}*/
function whilenode(x,nextmergnode,mergnode) {
    var newnode=new Map();
    let s=UnparseCode(x.test);
    let line=x.test.loc.start.line;
    //console.log(line);
    //console.log(s);
    newnode.set('id',id);
    id++;
    newnode.set('type','whilenode');
    newnode.set('color','white');
    newnode.set('body',s);
    newnode.set('line',line);
    newnode.set('right',blockornot(x.body,mergnode));
    newnode.set('left', nextmergnode);
    //console.log(newnode);
    return newnode;
}
function returnnode(x) {
    var newnode=new Map();
    let s=UnparseCode(x);
    let line=x.loc.start.line;
    //console.log(line);
    //console.log(s);
    newnode.set('id',id);
    newnode.set('type','returnnode');
    newnode.set('color','white');
    newnode.set('body',s);
    newnode.set('line',line);
    newnode.set('right',null);
    newnode.set('left',null);
    id++;
    return newnode;
}
/*function variabledeclaration(x) {

}*/

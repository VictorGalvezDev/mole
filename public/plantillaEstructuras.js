function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function plantillaEstructuras(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (estructuras) {// iterate estructuras
;(function(){
  var $$obj = estructuras;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var estructura = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"opcionLista\"\u003E" + (pug_escape(null == (pug_interp = estructura._doc.nombre) ? "" : pug_interp)) + "\u003Cbutton class=\"fa fa-trash borrarEstructura\"\u003E\u003C\u002Fbutton\u003E\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var estructura = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"opcionLista\"\u003E" + (pug_escape(null == (pug_interp = estructura._doc.nombre) ? "" : pug_interp)) + "\u003Cbutton class=\"fa fa-trash borrarEstructura\"\u003E\u003C\u002Fbutton\u003E\u003C\u002Fli\u003E";
    }
  }
}).call(this);
}.call(this,"estructuras" in locals_for_with?locals_for_with.estructuras:typeof estructuras!=="undefined"?estructuras:undefined));;return pug_html;}
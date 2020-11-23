
//IPAD DEBUG CONSOLE
(function() {
    $("body").append(
        $("<div id=logger></div>").css({
            position: "absolute",
            width: "450px",
            height: "350px",
            right: "0px",
            bottom: "0px",
            "background-color": "#000",
            opacity: 0.7,
            "font-size":"8px",
            color: "#ff0",
            "z-index":1000,
            "line-height":"10px",
        })
    );
    String.prototype.escape = function() {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return this.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
    };
    var cnt=1;
    var log_orig = 
        {log: console.log, warn: console.warn, error: console.error};
    for(var key in log_orig) { 
        if (log_orig.hasOwnProperty(key)) {
            (function(key){
            console[key] = function(str){
                $("#logger").prepend(key+" "+(cnt++)+". "+str.escape()+"<br>");
                return log_orig[key].apply(this, arguments);
            };
            }(key));
        }
    }
})();


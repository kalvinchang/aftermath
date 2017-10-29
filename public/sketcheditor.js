var MQ = MathQuill.getInterface(2);
var elt = document.getElementById('calculator');
var options = {
	graphpaper: false
};
var calculator = Desmos.GraphingCalculator(elt, options);
console.log(calculator.getExpressions());

var textboxArea = jQuery('#textboxes');
var textboxes;

elt.addEventListener('keypress', function(event) {
   if (event.key == 'Enter' && calculator.getExpressions().length != 0) {
        if (calculator.getExpressions()[0].latex == "") { return; }
         var expressionInLatex = calculator.getExpressions()[0].latex;
         console.log(expressionInLatex);
         //inject expression into the sketchboard
         var textBox = jQuery('<p class="equationText draggable">' + expressionInLatex + '</p>');
         textboxArea.append(textBox);	//add CSS animation for the ejection
         //remove expression from desmos keyboard
         textboxes = jQuery('.equationText');
         var recentlyAdded = textboxes[textboxes.length - 1];
         calculator.removeExpression(calculator.getExpressions()[0]);
         //make the textbox an editable field
         var field = MQ.MathField(recentlyAdded);
         MQ.StaticMath(field);
         $('.draggable').draggable();
   }
});

// jQuery draggable plugin
(function($) {
    $.fn.draggable = function(options) {
        var $handle = this,
            $draggable = this;
        
        options = $.extend({}, {
            handle: null,
            cursor: 'move'
        }, options);

        if( options.handle ) {
            $handle = $(options.handle);
        }

        $handle.css('cursor', options.cursor).on("mousedown", function(e) {
            var x = $draggable.offset().left - e.pageX,
                y = $draggable.offset().top - e.pageY,
                z = $draggable.css('z-index');
                
            $draggable.css('z-index', 100000);
                
            $(document.documentElement)
                .on('mousemove.draggable', function(e) {
                    $draggable.offset({
                        left: x + e.pageX,
                        top: y + e.pageY
                    });
                })
                .one('mouseup', function() {
                    $(this).off('mousemove.draggable');
                    $draggable.css('z-index', z);
                });

            // disable selection
            e.preventDefault();
            });
    };
})(jQuery);

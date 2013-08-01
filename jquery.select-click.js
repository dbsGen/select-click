(function ($) {
    var DefaultTolerance = 2,
        ToleranceAttr = 'select-tolerance',
        SelectAttr = 'select-callback',
        ClickAttr = 'click-callback',
        SelectClickKey = 'selectClick';

    $.fn.selectClick = function (selectCallback, clickCallback, clickTolerance) {
        var h = {};
        h[SelectAttr] = selectCallback;
        h[ClickAttr] = clickCallback;
        h[ToleranceAttr] = clickTolerance;
        new SelectClick(this, h)
    };
    var SelectClick = function(element, ops){
        var $element;
        if(element instanceof jQuery) {
            $element = element;
        }else {
            $element = $($element);
        }
        if (!ops) ops = {};
        $element.data(SelectClickKey, this);
        this.prevX = ops['prevX'] || 0;
        this.prevY = ops['prevY'] || 0;
        var that = this;
        var mousedown = function(e) {
            that.prevX = e.pageX;
            that.prevY = e.pageY;
        };
        var click = function(e) {
            var tolerance = parseInt($element.attr(ToleranceAttr) || ops[ToleranceAttr]);
            tolerance = isNaN(tolerance) ? 2 : tolerance;
            var dx = Math.abs(e.pageX - that.prevX);
            var dy = Math.abs(e.pageY - that.prevY);
            if (dx < tolerance && dy < tolerance) {
                eval_t($element.attr(ClickAttr) || ops[ClickAttr])
            }
            else {
                eval_t($element.attr(SelectAttr) || ops[SelectAttr])
            }
        };
        $element.each(function(){
            this.onmousedown = mousedown;
            this.onclick = click;
        });
    };

    // Add html5 support
    $(document).delegate('[' + SelectAttr + ']', 'mousedown', function(e){
        checkSelectClick($(this), {prevX: e.pageX, prevY: e.pageY})
    });

    var checkSelectClick = function(element, ops) {
        var sc = element.data(SelectClickKey);
        if(!sc) new SelectClick(element, ops);
    };
    var eval_t = function(string) {
        if (typeof string == 'string') {
            eval(string);
        }else if (typeof string == 'function') {
            string();
        }
    }
})(jQuery);

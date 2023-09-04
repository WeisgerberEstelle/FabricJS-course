
const Point = fabric.util.createClass({
    initialize: function(x, y) {
        this.x = x || 0
        this.y = y || 0
    },
    toString: function() {
        return this.x + '/' + this.y;
    }
});

var point = new Point(10, 20);

point.x; // 10
point.y; // 20

point.toString();
var deg0 = 0.0;
var deg90 = Math.PI / 2.0;
var deg180 = Math.PI;
var deg270 = Math.PI * 1.5;
var deg360 = Math.PI * 2.0;

function getArcParams(cmd) {
    var x = cmd.x !== undefined ? cmd.x : cmd.prevX;
    var y = cmd.y !== undefined ? cmd.y : cmd.prevY;

    var centerX = cmd.prevX + cmd.i;
    var centerY = cmd.prevY + cmd.j;
    return {
        x: centerX,
        y: centerY,
        r: Math.sqrt(cmd.i * cmd.i + cmd.j * cmd.j),
        startAngle: Math.atan2(cmd.prevY - centerY, cmd.prevX - centerX),
        endAngle: Math.atan2(y - centerY, x - centerX),
        startX: cmd.prevX,
        startY: cmd.prevY,
        endX: x,
        endY: y,
        cw: cmd.g === 2
    };
}

function getSplineParams(cmd) {
    return {
        prevX: cmd.prevX,
        prevY: cmd.prevY,
        c1X: cmd.prevX + cmd.i,
        c1Y: cmd.prevY + cmd.j,
        c2X: cmd.x + cmd.p,
        c2Y: cmd.y + cmd.q,
        x: cmd.x,
        y: cmd.y
    };
}

function getArcMinMax(arc) {
    var startAngle, endAngle;
    var bounds = {
        minX: arc.startX,
        maxX: arc.startX,
        minY: arc.startY,
        maxY: arc.startY
    };

    if (arc.cw) {
        // cw: start = start and end = end
        startAngle = arc.startAngle;
        endAngle = arc.endAngle;
    } else {
        // ccw: start = end and end = start for clockwise
        startAngle = arc.endAngle;
        endAngle = arc.startAngle;
    }

    if (startAngle < 0) startAngle += deg360;
    if (endAngle < 0) endAngle += deg360;

    // from now on we only think in clockwise direction
    var intersectsAngle = function (sA, eA, angle) {
        return (
            (sA >= angle && (eA <= angle || eA > sA)) ||
            (sA <= angle && eA <= angle && eA > sA)
        );
    };

    if (intersectsAngle(startAngle, endAngle, deg0)) {
        // arc crosses positive x
        bounds.maxX = Math.max(bounds.maxX, arc.x + arc.r);
    }

    if (intersectsAngle(startAngle, endAngle, deg90)) {
        // arc crosses positive y
        bounds.maxY = Math.max(bounds.maxY, arc.y + arc.r);
    }

    if (intersectsAngle(startAngle, endAngle, deg180)) {
        // arc crosses negative x
        bounds.minX = Math.min(bounds.minX, arc.x - arc.r);
    }

    if (intersectsAngle(startAngle, endAngle, deg270)) {
        // arc crosses negative y
        bounds.minY = Math.min(bounds.minY, arc.y - arc.r);
    }

    return bounds;
}

function getSplineMinMax(spline) {
    // Adapted from solution posted here: https://stackoverflow.com/a/24814530

    function calcAxisRange(cur, cp1, cp2, dst) {
        var a = 3 * dst - 9 * cp2 + 9 * cp1 - 3 * cur;
        var b = 6 * cur - 12 * cp1 + 6 * cp2;
        var c = 3 * cp1 - 3 * cur;
        var disc = b * b - 4 * a * c;
        var min = cur;
        var max = cur;

        if (dst < min) min = dst;
        if (dst > max) max = dst;
        if (disc >= 0) {
            var t1 = (-b + Math.sqrt(disc)) / (2 * a);
            var t2 = (-b - Math.sqrt(disc)) / (2 * a);
            if (t1 > 0 && t1 < 1) {
                var p = calcBezStep(cur, cp1, cp2, dst, t1);
                if (p < min) min = p;
                if (p > max) max = p;
            }
            if (t2 > 0 && t2 < 1) {
                var p = calcBezStep(cur, cp1, cp2, dst, t2);
                if (p < min) min = p;
                if (p > max) max = p;
            }
        }

        return {min: min, max: max};
    }

    var xRange = calcAxisRange(spline.prevX, spline.c1X, spline.c2X, spline.x);
    var yRange = calcAxisRange(spline.prevY, spline.c1Y, spline.c2Y, spline.y);

    return {
        minX: xRange.min,
        maxX: xRange.max,
        minY: yRange.min,
        maxY: yRange.max
    };
}

function calcBezStep(cur, cp1, cp2, dst, t) {
    return (
        cur * (1 - t) * (1 - t) * (1 - t) +
        3 * cp1 * t * (1 - t) * (1 - t) +
        3 * cp2 * t * t * (1 - t) +
        dst * t * t * t
    );
}

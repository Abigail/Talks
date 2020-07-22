var piece;

function loaded () {
    piece = new Piece ({piece: 'knight'});

    piece . draw ();

    var knight = SVG ('#chess-piece');

    var offsets = [[-1, -2], [ 1, -2], [ 2, -1], [ 2,  1],
                   [ 1,  2], [-1,  2], [-2,  1], [-2, -1]];

    offsets . forEach (item => {
        var [x, y] = item;
        knight . animate ({duration:  500,
                           delay:     500,})
               . dmove (  x * piece . rect_size,   y * piece . rect_size)

        knight . animate ({duration:   50,
                           delay:     500,})
               . dmove (- x * piece . rect_size, - y * piece . rect_size)
               . after (function () {
                     piece . place_circle ({x: x, y: y});
                 });
    });
}

var piece;

function loaded () {
    piece = new Piece ({piece: 'knight'});

    piece . draw ();

    var knight = SVG ('#chess-piece');

    var offsets = [[-1, -2], [ 1, -2], [ 2, -1], [ 2,  1],
                   [ 1,  2], [-1,  2], [-2,  1], [-2, -1]];

    offsets . forEach (item => {
        [x, y] = item;
        knight . animate ({duration: 1000,
                           delay:    1000,})
               . dmove (  x * piece . rect_size,   y * piece . rect_size)

        knight . animate ({duration:  100,
                           delay:    1000,})
               . dmove (- x * piece . rect_size, - y * piece . rect_size);
    });
}

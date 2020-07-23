var spiral;

function loaded () {
    spiral = new Spiral ({});

    spiral . draw ();

    spiral . place_values ({from_value: 2});

    spiral . place_image (chess_pieces . knight . image,
                         {value: 1, id: 'chess-piece'});
}

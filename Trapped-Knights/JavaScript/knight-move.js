var spiral;

function loaded () {
    spiral = new Spiral ({});

    spiral . draw ();

    spiral . place_values ({from_value: 2});

    var knight = chess_pieces . knight;

    spiral . place_piece (knight, {});
    var moves = knight . run_list;

    for (var i = 1; i <= 5; i ++) {
        let move = moves [i];
        nav . add_todo (function () {
            spiral . move_piece ({value: move})
        });
    }
}

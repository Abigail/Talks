let spiral;

function loaded () {
    spiral = new Spiral ({});

    spiral . draw ();

    spiral . place_values ({ });

    nav . add_todo (function () {
        $('#number-1') . css ('display', 'none');
        spiral . place_image (chess_pieces . knight . image,
                             {value: 1, id: 'chess-piece'});
    })
}

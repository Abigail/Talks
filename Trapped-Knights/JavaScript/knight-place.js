let spiral;

function loaded () {
    spiral = new Spiral ({});

    spiral . draw ({with_values: 1});

    nav . add_todo (function () {
        $('#number-1') . css ('display', 'none');
        spiral . place_image (chess_pieces . knight . image,
                             {value: 1, id: 'chess-piece'});
    })
}

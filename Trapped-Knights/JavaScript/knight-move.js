let spiral;

function loaded () {
    spiral = new Spiral ({});

    spiral . draw ({with_values: 1});

    let knight = chess_pieces . knight;

    spiral . place_piece (knight, {});
    spiral . hide_value (1);

    let moves = knight . run_list;

    console . log (moves . length);

    let manual_steps = 5;

    for (let i = 1; i <=  manual_steps; i ++) {
        nav . add_todo (function () {
            spiral . move_piece ({
                move_list: moves,
                start:     i,
                end:       i,
                callback:  function (args) {
                    $('#move-number') . html (args . move);
                }
            });
        });
    }

    //
    // We're using a trick here. We first delete the existing chess
    // piece, then replace it with another. This way, the animation
    // runs more smoothly; that is, it won't do the first steps all
    // at once.
    //
    nav . add_todo (function () {
        SVG ('#chess-piece') . css ({display: 'none'});
        SVG ('#chess-piece') . id ('bogus');
        spiral . place_piece (knight, {value: moves [manual_steps]});
        spiral . move_piece ({
            move_list: moves,
            start:     manual_steps + 1,
            callback:  function (args) {
                $('#move-number') . html (args . move);
            }
        });
    });
}

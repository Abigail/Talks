let spiral;

function loaded () {
//  let [x, y, value] = (new Spiral) . positions ({value: 2084});

//  console . log ([x, y, value]);

    // min_x: 1, min_y: -29
    // min_x: -29, min_y: -29, size: 59

    spiral = new Spiral ({min_x:  1,
                          min_y: -29});

    spiral . draw ({with_values: 1});

    let knight = chess_pieces . knight;
    
    //
    // Find the index of the last position not on the board
    //
    let moves = knight . run_list;

    let index = moves . length - 1;
    for (;index >= 0; index --) {
        if (!spiral . on_board ({value: moves [index]})) {
            break;
        }
    }

    for (let i = 0; i <= index; i ++) {
        let value = moves [i];
        if (spiral . on_board ({value: value})) {
            spiral . hide_value (value);
            spiral . place_circle ({value: value});
        }
    }

    spiral . hide_value (moves [index + 1]);
    spiral . place_piece (knight, {value: moves [index + 1]});

    $('#move-number') . html (index + 1);

    //
    // We're using a trick here. We first delete the existing chess
    // piece, then replace it with another. This way, the animation
    // runs more smoothly; that is, it won't do the first steps all
    // at once.
    //
    nav . add_todo (function () {
        spiral . move_piece ({
            move_list: moves,
            start:     index + 2,
            callback:  function (args) {
                $('#move-number') . html (args . move);
            }
        })
    });
}

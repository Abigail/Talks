//
// This contains the various functions which are called from the
// loaded () method -- which is the method being called after
// the page was loaded.
//


//
// piece_movements:
//   Method to set up the image which shows the movement of the piece.
//
function piece_movements (name) {
    piece = new Piece ({piece: chess_pieces [name]});

    piece . draw ();

    make_credits_line (name);
}


//
// move_piece:
//    Create a board, center the piece in the middle. Move the piece
//    one step for a few iteration, then animate the rest until it
//    runs out of bounds.
//
function move_piece (name) {
    let piece       = chess_pieces [name];
    let spiral_args = piece . spiral_args || {};
    let spiral      = new Spiral (spiral_args);

    spiral . draw ({with_values: 1});

    spiral . place_piece (piece, {});
    spiral . hide_value (1);

    let moves = piece . run_list;

    let manual_steps = piece . manual_moves || 0;

    for (let i = 1; i <= manual_steps; i ++) {
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
        spiral . place_piece (piece, {value: moves [manual_steps]});
        spiral . move_piece ({
            move_list: moves,
            start:     manual_steps + 1,
            callback:  function (args) {
                $('#move-number') . html (args . move);
            }
        });
    });
}




//
// piece_path:
//   Method to set up the image which shows the path of the piece.
//
function piece_path (name) {
    let piece = chess_pieces [name];

    let board = new Spiral;

    board . draw_path ({piece: piece});
}

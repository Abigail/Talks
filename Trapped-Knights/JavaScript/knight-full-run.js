let spiral;

function loaded () {
    spiral = new Spiral;

    let knight = chess_pieces . knight;
    let moves  = knight . run_list;

    //
    // Find the minimum and maximum x, y values
    //
    let [x, y] = spiral . positions ({value: moves [0]});
    let [min_x, max_x, min_y, max_y] = [x, x, y, y];
    for (let i = 1; i < moves . length; i ++) {
        let value = moves [i];
        let [x, y] = spiral . positions ({value: value});
        if (x < min_x) {min_x = x}
        if (x > max_x) {max_x = x}
        if (y < min_y) {min_y = y}
        if (y > max_y) {max_y = y}
    }

    //
    // Make sure we have a square of odd size.
    //
    if ((max_x - min_x) % 2) {min_x --;}
    if ((max_y - min_y) % 2) {min_y --;}
    if ((max_x - min_x) > (max_y - min_y)) {
        min_y += (max_x - min_x) - (max_y - min_y);
    }
    if ((max_y - min_y) > (max_x - min_x)) {
        min_x += (max_y - min_y) - (max_x - min_x);
    }

    spiral . set_bounding_box (min_x, min_y, max_x, max_y);

    //
    // Draw the field; we're not doing numbers for such
    // small squares.
    //
    spiral . draw ();

    //
    // Start with a knight at the middle.
    //
    spiral . place_piece (knight, {value: 1});

    nav . add_todo (function () {
        spiral . move_piece ({
            move_list: moves,
            duration:   100,
            delay:       20,
            callback: function (args) {
                $('#move-number') . html (args . move);
            }});
    });
}

class Board {
    //
    // Construct a board. We take the following options:
    //
    //  - size:       The size (in squares, not pixels) of the board,
    //                Defaults to 13, for a 13 x 13 board. 
    //  - width:      The width of the board (in squares). Only needed
    //                for non-square boards. Defaults to size.
    //  - heigth:     The heigth of the board (in squares). Only needed
    //                for non-square boards. Defaults to size.
    //  - rect_size:  The size of the squares of the board, in internal
    //                coordinates. Defaults to 10. It's very unlikely
    //                to be ever needed.
    //  - addto:      CSS identifier of element the SVG images should
    //                be placed in. Defaults to '.inner'.
    //  - id:         id of the SVG images. Defaults to 'board'.
    //
    constructor (args) {
        this . size      = args . size      || 13;
        this . width     = args . width     || this . size;
        this . height    = args . height    || this . size;
        this . rect_size = args . rect_size || 10;
        this . addto     = args . addto     || '.inner';
        this . id        = args . id        || 'board';

        //
        // Derived values.
        //   - min_x, min_y, max_x, max_y:
        //            The minimum/maximum coordinates of the squares on
        //            the board.
        //
        this . min_x     = - (Math . floor (this . width  / 2));
        this . min_y     = - (Math . floor (this . height / 2));
        this . max_x     = - this . min_x;
        this . max_y     = - this . min_y;

        this . max_value = this . width * this . height;
    }


    //
    // Draw the empty board.
    //
    draw () {
        var size      = this . size;
        var rect_size = this . rect_size;
        
        //
        // Calculate the parameters for the viewbox.
        // For now, we will have (0, 0) in the middle.
        // 
        var viewbox_min_x  = (this . min_x - .5)  * rect_size;
        var viewbox_min_y  = (this . min_y - .5)  * rect_size;
        var viewbox_width  =  this . width        * rect_size;
        var viewbox_height =  this . height       * rect_size;

        //
        // Create the (empty) SVG image, and place it in
        // the relevant container.
        //
        var board = SVG () . addTo   (this . addto)
                           . id      (this . id)
                           . size    ('100%', '100%')
                           . viewbox (viewbox_min_x, viewbox_min_y,
                                      viewbox_width, viewbox_height);

        //
        // Create the squares; we place the *centers* on specific
        // locations.
        //
        var x, y;
        for (x = this . min_x; x <= this . max_x; x ++) {
            for (y = this . min_x; y <= this . max_x; y ++) {
                var class_name = (x + y) % 2 ? "odd" : "even";
                var value      = this . to_value (x, y);
                var id_name    = "value-" + value;
                var rect = board . rect     (rect_size, rect_size)
                                 . cx       (x * rect_size)
                                 . cy       (y * rect_size)
                                 . id       (id_name)
                                 . addClass (class_name);
            }
        }

        this . board = board;
    }

    //
    // Find the x, y coordinates.
    //   - if args contains "x", and "y", use (x, y)
    //   - if args contains "value", convert this to coordinates
    //   - else, use (0, 0)
    //
    find_coordinates (args) {
        if (("x" in args) && ("y" in args)) {
            return [args . x, args . y];
        }
        if ("value" in args) {
            return this . to_coordinates (args . value);
        }
        return [0, 0];
    }


    //
    // Place a circle on a specific location
    //
    place_circle (args) {
        var x, y;
        [x, y] = this . find_coordinates (args);

        var rect_size = this . rect_size;

        this . board . circle (.8 * rect_size)
                     . center (x * rect_size, y * rect_size)
                     . addClass ("circle");
    }

    //
    // Place an image on a specific location
    //
    place_image (image_name, args) {
        var x, y;
        [x, y] = this . find_coordinates (args);

        var path  = '../Images/' + image_name;
        var image = this . board . image (path);

        //
        // Scale the image to be 80% of the size a square,
        // and place it 10% away from the edges.
        //
        var rect_size = this . rect_size;
        image . size   (rect_size * .8, rect_size * .8);
        image . center (rect_size *  x, rect_size *  y);

        if ("id" in args) {
            image . id (args . id);
        }
        if ("class" in args) {
            image . addClass (args . class);
        }

        return (image);
    }

    //
    // Place a piece on a particular location. This just draws the
    // image on the given spot, and sets some coordinates.
    //
    place_piece (piece, args) {
        var x, y, value;
        [x, y] = this . find_coordinates (args);
        value = args . value || this . to_value (x, y);

        args . x  = x;
        args . y  = y;
        args . id = "chess-piece";

        var image = this . place_image (piece . image, args);

        this . current_piece               = {};
        this . current_piece . image       = image;
        this . current_piece . coordinates = [x, y];
        this . current_piece . value       = value;
    }

    //
    // Move current piece along a series of moves.
    //
    move_piece (args) {
        let move_list      = args . move_list;

        let current_piece  = this . current_piece;
        let image          = current_piece . image;
        let rect_size      = this . rect_size;

        var runner = image . animate ();

        let start = args . start || 0;
        let end   = move_list . length - 1;
        if (args . end && args . end < end) {
            end = args . end;
        }

        let me = this;

        for (let i = start; i <= end; i ++) {
            //
            // Get the next value or coordinates to move to;
            // for now, assume it's always a value.
            //
            let target = move_list [i];
            if (target > this . max_value) {
                break;
            }
            let [new_x, new_y] = this . find_coordinates ({value: target});
            let new_value      = this . to_value (new_x, new_y);

            let [old_x, old_y] = current_piece . coordinates;
            let  old_value     = current_piece . value;

            runner . animate ({duration: 500})
                   . center (new_x * rect_size, new_y * rect_size)
                   . after (function () {
                         console . log (Date . now () + ": " +
                                        "Moved from " + old_value + 
                                        " to " + new_value);
                         me . hide_value (new_value);
                         me . place_circle ({x: old_x, y: old_y})
                     });

            current_piece . coordinates = [new_x, new_y];
            current_piece . value       =  new_value;
        }
    }


    //
    // Place text on a particular spot
    //
    place_text (text, args) {
        var x, y;
        [x, y] = this . find_coordinates (args);

        var rect_size = this . rect_size;

        var text = this . board . plain (text)
                                . attr ({x: x * rect_size,
                                         y: y * rect_size});

        if ("id" in args) {
            text . id (args . id);
        }
        if ("class" in args) {
            text . addClass (args . class);
        }

        return text;
    }

    //
    // Place a given value on the corresponding square
    //
    place_value (value) {
        this . place_text (value, {value: value,
                                   id: "number-" + value,
                                   class: "number"});
    }

    //
    // Hide the given value from sight.
    //
    hide_value (value) {
        $('#number-' + value) . css ('display', 'none');
    }


    //
    // Place a series of values, with delays
    //
    place_values (args) {
        var from_value = args . from_value || 1;
        var to_value   = args . to_value   || this . max_value;
        var init_delay = args . init_delay || 0;
        var delay      = args . delay      || 0;

        var count = 0;
        var value;
        if (delay || init_delay) {
            for (value = from_value; value <= to_value; value ++, count ++) {
                setTimeout (function (board, value) {
                                board . place_value (value)
                            },
                            init_delay + count * delay, 
                            this, value);
            }
        }
        else {
            for (value = from_value; value <= to_value; value ++) {
                this . place_value (value);
            }
        }
    }

    //
    // Takes the x, y coordinates of a square, returns the corresponding value
    //
    to_value (x, y) {
        var real_x = x - this . min_x;
        var real_y = y - this . min_y;

        return (real_y * (this . width) + real_x + 1);
    }
}



//
// Contains the calculations for a spiral. A spiral lables the
// squares in the following way:
//
//     17  16  15  14  13
//     18   5   4   3  12
//     19   6   1   2  11
//     20   7   8   9  10
//     21  22  23  24  25  ...
//
// The calculations have been lifted from Chess::Infinite::Board::Spiral.
//
class Spiral extends Board {
    //
    // Takes the x, y coordinates of a square, returns the corresponding value
    //
    to_value (x, y) {
        var abs_x = Math . abs (x);
        var abs_y = Math . abs (y);
        var max   = abs_x > abs_y ? abs_x : abs_y;
        var base  = Math . pow (2 * max - 1, 2);

        return y ==  max ? base + 7 * max + x
             : x == -max ? base + 5 * max + y
             : y == -max ? base + 3 * max - x
             :             base + 1 * max - y;
    }


    //
    // Takes value, returns a pair of x, y coordinates
    //
    to_coordinates (value) {
        var base = Math . ceil  (Math . sqrt (value));
        var ring = Math . floor (base / 2);
        var left = value - Math . pow (2 * ring - 1, 2);

        var x_val, y_val;

        if (left <= 2 * ring) {
            x_val =     ring;
            y_val =     ring - left;
        }
        else if (left <= 4 * ring) {
            x_val = 3 * ring - left;
            y_val =   - ring;
        }
        else if (left <= 6 * ring) {
            x_val =    - ring;
            y_val = -5 * ring + left;
        }
        else if (left <= 8 * ring) {
            x_val = -7 * ring + left;
            y_val =      ring;
        }

        return [x_val, y_val];
    }
}


//
// Board to show how a piece moves
//

class Piece extends Board {
    //
    // We're using a different default size
    //
    constructor (args) {
        if (!("size" in args)) {
            args . size = 7;
        }

        super (args);

        this . piece = args . piece;
    }

    draw () {
        //
        // Draw the board, using the parent class
        //
        super . draw ();

        //
        // Draw the chess piece
        //
        var piece     = this . piece;
        var element   = this . place_image (piece . image,
                                          ({id: "chess-piece"}));

        var rect_size = this . rect_size;
        var me        = this;

        //
        // For all the places a piece can jump to, move the
        // piece to the destination, then quickly move it
        // back, leaving a circle where it jumped to.
        //
        if ("moves" in piece) {
            piece . moves . forEach (item => {
                var [x, y] = item;
                element . animate ({duration:  500,
                                    delay:     500,})
                        . dmove (  x * rect_size,
                                   y * rect_size)
                        . animate ({duration:   50,
                                    delay:     500,})
                        . dmove (- x * rect_size,
                                 - y * rect_size)
                        . after (function () {
                              me . place_circle ({x: x, y: y});
                          });
            });
        }
    }
}

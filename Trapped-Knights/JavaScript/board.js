class Board {
    //
    // Construct a board. We take the following options:
    //
    //  - size:       The size (in squares, not pixels) of the board,
    //                Defaults to 15, for a 15 x 15 board. 
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
        // 
        var viewbox_min_x  = this . min_x  * rect_size;
        var viewbox_min_y  = this . min_y  * rect_size;
        var viewbox_width  = this . width  * rect_size;
        var viewbox_height = this . height * rect_size;

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
        // Create the squares
        //
        var x, y;
        for (x = this . min_x; x <= this . max_x; x ++) {
            for (y = this . min_x; y <= this . max_x; y ++) {
                var class_name = (x + y) % 2 ? "odd" : "even";
                var value      = this . to_value (x, y);
                var id_name    = "value-" + value;
                var rect = board . rect     (rect_size, rect_size)
                                 . x        (x * rect_size)
                                 . y        (y * rect_size)
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
                     . center ((x + .5) * rect_size, (y + .5) * rect_size)
                     . addClass ("circle");
    }

    //
    // Place an image on a specific location
    //
    place_image (image_name, args) {
        var x, y;
        [x, y] = this . find_coordinates (args);

        var path  = '../Images/' + image_name + '.svg';
        var image = this . board . image (path);

        //
        // Scale the image to be 80% of the size a square,
        // and place it 10% away from the edges.
        //
        var rect_size = this . rect_size;
        image . size (rect_size *      .8 , rect_size *      .8) ;
        image . move (rect_size * (x + .1), rect_size * (y + .1));

        if ("id" in args) {
            image . id (args . id);
        }
        if ("class" in args) {
            text . addClass (args . class);
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
                                . attr ({x: (x + .5) * rect_size,
                                         y: (y + .6) * rect_size});

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
    // Place a series of values, with delays
    //
    place_values (args) {
        var from_value = args . from_value;
        var to_value   = args . to_value;
        var init_delay = args . init_delay || 0;
        var delay      = args . delay      || 0;

        var count = 0;
        var value;
        for (value = from_value; value <= to_value; value ++, count ++) {
            setTimeout (function (board, value) {board . place_value (value)},
                        init_delay + count * delay, 
                        this, value);
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
        super . draw ();

        this . place_image (this . piece, ({id: "chess-piece"}));
    }
}

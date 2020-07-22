//
// Handle navigation stuff. In particular, keypresses
//
class Navigate {
    constructor (args) {
        this . next    = args . next;
        this . prev    = args . prev;
        this . title   = args . title || "title.html";
        this . index   = args . index || "index.html";

        this . urls    = {
            "n":    args . next,
            "p":    args . prev,
            "t":    args . title || "title.html",
            "i":    args . index || "index.html",
        };
        this . toggled = 0;

        this . paused  = 1;

        this . todo = [];
    }

    //
    // Queue an action
    //
    add_todo (f) {
        this . todo . push (f)
    }

    //
    // Handle hitting a space.
    //   - If we have any actions queued, execute the first one.
    //   - If there are any paused elements, make them visible.
    //   - Else, return 0 so we can later default to going to the next page.
    //
    handle_space () {
        //
        // Execute the first queued actions, if any.
        //
        if (this . todo . length) {
            this . todo . shift () ();
            return (1);
        }

        //
        // Unpause the next paused element, if any
        //
        var paused   = this . paused;
        var div_name = "paused_" + paused;
        var element  = document . getElementById (div_name);
        if (element) {
            element . className = 'visible';
            this . paused ++;
            return (1);
        }

        return (0);
    }


    //
    // Handle a keypress
    //
    do_keypress (event) {
        var char = String . fromCharCode (event . which);
        var href;

        //
        // Space is the default action. Do whatever is 'next'. 
        // If nothing is queued, assume it's the same as 'n'.
        //
        if (char == ' ') {
            if (this . handle_space ()) {
                return;
            }
            char = 'n';
        }

        //
        // Navigate to the next/previous page (if exist), 
        // or the title or index page.
        //
        if (this . urls [char]) {
            location . href = this . urls [char]
        }
    }
}

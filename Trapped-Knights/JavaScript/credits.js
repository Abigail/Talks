let CC_ORG = "https://creativecommons.org";

//
// Licence specific info:
//    -  name of licence (to be displayed)
//    -  title (tooltip when hoovering)
//    -  link
//
let licence_info = {
    'CC0 1.0':  {
        name:   "CC0 1.0",
        title:  "Creative Commons CC0 1.0 Universal " +
                "Public Domain Dedication",
        link:   CC_ORG + "/publicdomain/zero/1.0/deed.en"
    },
    'CC BY-SA 3.0': {
        name:   "CC BY-SA 3.0",
        title:  "Creative Commons Attribution-ShareAlike 3.0 Unported",
        link:   CC_ORG + "/licenses/by-sa/3.0/deed.en",
    },
};

let silh_info = {
    licence:   'CC0 1.0',
    name:      'SVG SILH',
    link:      'https://svgsilh.com/',
    title:     'Free SVG Image & Icon',
};

//
// Credit info
//    -  licence:  link to licence info
//    -  name:     name of creator (to be displayed)
//    -  title:    additional info (for tooltip)
//    -  link:     URL of webpage/site image comes from
//
let credit_info = {
    knight:     silh_info,
    king:       silh_info,
    queen:      silh_info,
    rook:       silh_info,
    bishop:     silh_info,
    pawn:       silh_info,

    amazon:     {
        licence:   'CC BY-SA 3.0',
        name:      'NikNaks',
        link:      'https://commons.wikimedia.org/wiki/File:Chess_Alt26.svg',
        title:     '(via Wikipedia)',
    },
    archbishop: {
        licence:   'CC BY-SA 3.0',
        name:      'NikNaks',
        link:      'https://commons.wikimedia.org/wiki/File:Chess_alt45.svg',
        title:     '(via Wikipedia)',
    },
}

function anchor (args = {}) {
    let link  = args . link;
    let title = args . title;
    let text  = args . name;

    if (!text) {
        return "";
    }
    if (!link) {
        return text;
    }

    let anchor = `<a href = '${link}'`;
    if (title) {
        anchor += ` title = '${title}'`
    }
    anchor += `>${text}</a>`;

    return anchor;
}


//
// Create a credits line of text, to be displayed in the bottom left
// corner of the page showing the movements of the piece.
//
function make_credits_line (piece) {
    let credit  = credit_info [piece];
    let licence = licence_info [credit ['licence']];

    let line    = anchor (credit) + ". " + anchor (licence);

    $('.credits') . html ("Chess piece credits: " + line);
}

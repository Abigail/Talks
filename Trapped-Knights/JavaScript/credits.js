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
    'CC BY-SA 4.0': {
        name:   "CC BY-SA 4.0",
        title:  "Creative Commons Attribution-ShareAlike 4.0 International",
        link:   CC_ORG + "/licenses/by-sa/4.0/deed.en",
    },
    'CC BY 4.0': {
        name:   "CC BY 4.0",
        title:  "Creative Commons Attribution 4.0 International",
        link:   CC_ORG + "/licenses/by/4.0/deed.en",
    },
    'GPL 3': {
        name:   'GPL Version 3',
        title:  'GNU General Public Licence Version 3',
        link:   'https://www.gnu.org/licenses/gpl-3.0.html',
    },
};

let silh_info = {
    licence:   'CC0 1.0',
    name:      'SVG SILH',
    link:      'https://svgsilh.com/',
    title:     'Free SVG Image & Icon',
};

let xboard_info = {
    licence:   'GPL 3',
    name:      'xboard',
    link:      'http://www.gnu.org/software/xboard/',
    title:     '(GNU software)',
};

let shogi_info = {
    licence:   'CC BY-SA 3.0',
    name:      'Hari Sheldon &amp; orangain',
    link:      'https://github.com/orangain/shogi-piece-images',
    title:     'GitHub',
};

let janggi_info = {
    licence:   'CC BY-SA 4.0',
    name:      'Hari Seldon',
    title:     '(via Wikipedia)',
}

let sasr_info   = {
    licence:   'CC BY 4.0',
    name:      'Ola Sassersson',
    title:     "Sassersson's Abstract Shape Representation",
};

let janggi_name_map = {
    elephant:  'Sang',
    soldier:   'Byung',
}

//
// Credit info
//    -  licence:  link to licence info
//    -  name:     name of creator (to be displayed)
//    -  title:    additional info (for tooltip)
//    -  link:     URL of webpage/site image comes from
//
let credit_info = {
    knight:                       silh_info,
    king:                         silh_info,
    queen:                        silh_info,
    rook:                         silh_info,
    bishop:                       silh_info,
    pawn:                         silh_info,

    chancellor:                   xboard_info,
    dragonhorse:                  xboard_info,
    dragonking:                   xboard_info,

    amazon:     {
        licence:                 'CC BY-SA 3.0',
        name:                    'NikNaks',
        link:                    'https://commons.wikimedia.org/wiki/' +
                                         'File:Chess_Alt26.svg',
        title:                   '(via Wikipedia)',
    },
    archbishop: {
        licence:                 'CC BY-SA 3.0',
        name:                    'NikNaks',
        link:                    'https://commons.wikimedia.org/wiki/' +
                                         'File:Chess_alt45.svg',
        title:                   '(via Wikipedia)',
    },

    centaur: {
        licence:                 'CC0 1.0',
        name:                    'Free SVG',
        link:                    'https://freesvg.org',
    },

    gold_general:                 shogi_info,
    silver_general:               shogi_info,
    silver_general_east:          shogi_info,
    silver_general_south:         shogi_info,
    silver_general_west:          shogi_info,
    lance:                        shogi_info,
    shogi_pawn:                   shogi_info,
    shogi_knight:                 shogi_info,

    horse:                        xboard_info,

    janggi_elephant: {
        licence:                 'CC BY-SA 4.0',
        name:                    'Hari Seldon',
        link:                    'https://commons.wikimedia.org/wiki/' +
                                         'File:Red_Sang_(svg).svg',
        title:                   '(via Wikipedia)',
    },

    janggi_elephant:              janggi_info,
    janggi_soldier:               janggi_info,

    wazir: {
        name:                    'Freepik',
        link:                    'https://www.flaticon.com/authors/freepik',
        title:                   'Freepik',
    },
    dabbaba: {
        name:                    'Free icons',
        link:                    'https://freeicons.io/',
        title:                   'Free icons',
    },
    threeleaper:                  xboard_info,
};


for (name in janggi_name_map) {
    let janggi_name = janggi_name_map [name];
    let key         = "janggi_" + name;
    let link        = 'https://commons.wikimedia.org/wiki/' +
                      `File:Red_${janggi_name}_(svg).svg`;

    credit_info [key] ["link"] = link;
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

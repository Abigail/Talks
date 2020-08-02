package GenerateFile;

use 5.028;

use strict;
use warnings;
no  warnings 'syntax';

use experimental 'signatures';
use experimental 'lexical_subs';


sub generate_file ($name) {
    if ($name =~ m!/([^/]+)-move\.mkdn$!) {
        my $piece = ucfirst $1;
        return <<~ "--" =~ s/^\s+//gmr;
            # Move the $piece

            %% Template: move
        --
    }

    return "";
}


1;

__END__

package Common {
    use 5.028;

    use strict;
    use warnings;
    no  warnings 'syntax';

    use lib "/Users/abigail/Perl/CPAN/Chess-Infinite/lib/";

    use experimental 'signatures';
    use experimental 'lexical_subs';

    use Hash::Util::FieldHash qw [fieldhash];

    my @list;

    fieldhash my %svg;

    sub set_svg ($self, $svg) {$svg {$self} = $svg; $self}
    sub     svg ($self)       {$svg {$self}}

    sub new ($class) {
        bless do {\my $var} => $class;
    }
    sub init ($self) {
        $self
    }

    #
    # Save SVG.
    #
    sub save ($self, $name, %args) {
        state $counter = 0;
        my $file_name = sprintf "%03d-%s" => ++ $counter, $name;
        open my $fh, ">", "../Images/$file_name.svg" or
                              die "Failed to open $file_name.svg: $!";
        binmode $fh, ":utf8";
        print $fh $self -> svg -> xmlify (-inline => $args {inline});
        close $fh or die "Failed to close $file_name: $!";
        push @list => $args {index_me} ? $file_name : ":$file_name";
    }

    sub list ($self) {
        @list
    }
    sub slide ($self, $name, $index_me = 0) {
        push @list => $index_me ? "$name" : ":$name"
    }
}


__END__

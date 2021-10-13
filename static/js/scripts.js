

$(() => {
    var wordlist = ["test", "hoi", "you", "hallo", "nee"];
    var words = [];

    i = 0;
    w = 0;
    l = 0;
    inputlength = 0;

    while(i <= 200) {
        words[i] = wordlist[Math.floor(Math.random() * 5)];
        $(".contentbox-words").append(`<span class=w${i}>` + words[i] + "</span>")
        $(".w" + i).lettering();

        i++;
    }

    $("#typer").attr("maxlength", `${words[0].length}`)

    $("#typer").change( function() {
        text = $("#typer").val();
        $("#typer").val("");
        
        if (text == words[w]) {
            $(".w" + w + " span").css("color", "green")
            $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")   
            w++;

            $("#typer").attr("maxlength", `${words[w].length}`)
        } else {
            $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")
            $(".w" + w + " span").css("color", "white")
        }
        l = 0;
        inputlength = 0;
    });

    $("#typer").on("input", function() {
        if ($("#typer").val().length < inputlength) {
            $(`.w${w} > .l${l}`).css("color", "white")
            $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")
            l--;
            $(`.w${w} > .l${l}`).css("border-right", "3px solid #faf000")
        } else {
            if($("#typer").val().length <= words[w].length){
                if ($("#typer").val().charAt(l) == words[w].charAt(l)) {
                    $(`.w${w} > .l${l+1}`).css("color", "green")
                } else {
                    $(`.w${w} > .l${l+1}`).css("color", "red")
                }
                $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")
                l++;
                $(`.w${w} > .l${l}`).css("border-right", "3px solid #faf000")
            }
        }
        inputlength = $("#typer").val().length;
    });
});
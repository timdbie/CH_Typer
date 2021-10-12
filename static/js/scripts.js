$(() => {
    $('.contentbox-wordsinp').show();

    var wordlist = ["test", "hoi", "you", "hallo", "nee"];

    var words = [];

    i = 0;
    w = 0;
    l = 0;


    while(i <= 200) {
        words[i] = wordlist[Math.floor(Math.random() * 5)];
        $(".contentbox-words").append(`<span class=w${i}>` + words[i] + "</span>")
        $(".w" + i).lettering();

        i++;
    }

    $("#typer").on("keyup", (e) => {
        if (e.which >= 65 && e.which <= 90) {
            if ($("#typer").val().charAt(l) == words[w].charAt(l)){
                $(`.w${w} > .l${l+1}`).css("color", "green")
            } else {
                $(`.w${w} > .l${l+1}`).css("color", "red")
            }
            
            l++;
        }
 
        if (e.which == 8 || e.which == 46) {
            if (l > 0){
                $(`.w${w} > .l${l}`).css("color", "white")
                l--;
            }
        }
        
        if (e.which == 13) {
            text = $("#typer").val();
            $("#typer").val("");

            if (text == words[w]) {
                $(".w" + w + " span").css("color", "green")
                w++;
            } else {
                $(".w" + w + " span").css("color", "white")
            }

            l = 0;
        }
    });
});
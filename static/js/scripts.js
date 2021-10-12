$(() => {

    var wordlist = ["test", "hoi", "you", "hallo", "nee"];

    var words = [];

    i = 0;
    w = 0;
    l = 0;

    while(i <= 50) {
        words[i] = wordlist[Math.floor(Math.random() * 5)];
        $(".contentbox-words").append(`<span id=w${i}>` + words[i] + "</span>")

        i++;
    }

    $("#typer").on("keypress", (e) => {
        if (e.which >= 97 && e.which <= 122) {           

        }

        if (e.keyCode == 8 || e.keyCode == 46) {
            i--;
        }
        
        if (e.which == 13 || e.which == 32) {
            text = $("#typer").val();
            $("#typer").val("");

            if (text == words[w]) {
                $("#w" + w).css("color", "green")
                w++;
                l = 0;
            }
        }
    });
});
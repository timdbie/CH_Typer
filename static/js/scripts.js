$(() => {
    var wordlist = ["test", "hoi", "you", "hallo", "nee"];
    var words = [];

    function startTyper () {
        i = 0;
        w = 0;
        l = 0;
        inputlength = 0;
        toppos = 0;
        firstline = true;

        while(i <= 300) {        
            words[i] = wordlist[Math.floor(Math.random() * 5)];
            $(".contentbox-words").append(`<span class=w${i}>` + words[i] + "</span>")
            $(".w" + i).lettering();

            i++;
        }
        
        $("#typer").attr("maxlength", `${words[0].length}`)
    }
    startTyper();


    $("#refresh").click( function() {
        $(".contentbox-words").empty()
        $(".contentbox-words").css("top", "0")
        words = []
        startTyper()
    });

    $("html").on("keydown", (e) => {
        if (e.which == 9) {
            $("#refresh").focus()
            e.preventDefault()
        }
    });

    $("html").on("keyup", (e) => {
        if (e.which == 9) {
            $("#refresh").blur()
            $("#typer").focus()
            e.preventDefault()
        }
    });


    $("#typer").change( function() {
        text = $("#typer").val();
        $("#typer").val("");
        
        if (text == words[w]) {
            $(".w" + w + " span").css("color", "green")
            $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")

            oldpos = $(".w" + w).offset().top
            w++;
            newpos = $(".w" + w).offset().top

            if (oldpos != newpos) {
                if (firstline == true) {
                    firstline = false;
                } else {
                    toppos = toppos - 50;
                    $(".contentbox-words").css("top", `${toppos}px`)
                }
            }

            $("#typer").attr("maxlength", `${words[w].length}`)
        } else {
            $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")
            $(".w" + w + " span").css("color", "white")
            $(".w" + w + " span").css("opacity", "0.2")
        }
        l = 0;
        inputlength = 0;
    });

    $("#typer").on("input", function() {
        if ($("#typer").val().length < inputlength) {
            $(`.w${w} > .l${l}`).css("opacity", "0.2")
            $(`.w${w} > .l${l}`).css("color", "white")
            $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")
            l--;
            $(`.w${w} > .l${l}`).css("border-right", "3px solid #faf000")
        } else {
            if($("#typer").val().length <= words[w].length){
                if ($("#typer").val().charAt(l) != words[w].charAt(l)) {
                    $(`.w${w} > .l${l+1}`).css("color", "red")
                }
                $(`.w${w} > .l${l+1}`).css("opacity", "1")
                $(`.w${w} > .l${l}`).css("border-right", "3px solid transparent")
                l++;
                $(`.w${w} > .l${l}`).css("border-right", "3px solid #faf000")
            }
        }
        inputlength = $("#typer").val().length;
    });
});
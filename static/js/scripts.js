$("document").ready(function() {
    $("#typer").css("display", "block")
    $("#typer").focus()

    var wordlist = ["test", "hoi", "you", "hallo", "nee"];

    function startTyper () {
        words = [];
        i = 0;
        w = 0;
        l = 0;
        totalentries = 0;
        inputlength = 0;
        toppos = 0;
        firstline = true;
        timerstarted = false;
        endingpopup = false;

        while(i <= 300) {        
            words[i] = wordlist[Math.floor(Math.random() * 5)];
            $(".contentbox-words").append(`<span class=w${i}>` + words[i] + "</span>")
            $(".w" + i).lettering();

            i++;
        }
        
        $("#typer").attr("maxlength", `${words[0].length}`)
    }
    startTyper();

    $(".contentbox-wordscnt").fadeTo("fast", 1)

    function startTimer() {
        sec = 14
        timerstarted = true
        $(".contentbox-timer").html(15);

        timer = setInterval(function () {
            if (sec >= 0) {
                $(".contentbox-timer").html(sec);
                sec--;
            } else {
                clearInterval(timer);
                $(".contentbox-timer").empty()
                endingPopUp()
            }
        }, 1000);
    }

    function endingPopUp() {
        $("#typer").blur()
        $(".contentbox-wordsinp").fadeTo("fast", 1)

        typedwords = totalentries / 5
        wpm = typedwords / 0.25

        $(".contentbox-wordsinp h2").html(wpm + " WPM")
        endingpopup = true
    }


    function refreshTyper() {
        if (timerstarted){ 
            clearInterval(timer);
            $(".contentbox-timer").empty()
        }

        if (endingpopup) {
            $(".contentbox-wordsinp").fadeTo("fast", 0)
        }

        $(".contentbox-words").empty()
        $(".contentbox-words").css("top", "0")
        startTyper()

        $("#typer").focus()
    }

    $("#refresh").click( function() {
        $(".contentbox-words").fadeOut(200)
        $(".contentbox-words").promise().done(function(){
            refreshTyper()
        });
        $(".contentbox-words").fadeIn(200)
    });


    $("html").on("keydown", (e) => {
        if (e.which == 9) {
            $("#refresh").focus()
            e.preventDefault()
        }

        if (e.which == 32) {
            submitInput()
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

    
    $("#typer").focus( function() {
        if (endingpopup) {
            refreshTyper()
        }
    });

    $("#typer").change(submitInput)

    function submitInput() {
        text = $("#typer").val();
        $("#typer").val("");
        
        if (text == words[w]) {
            $(".w" + w + " span").css("color", "green")
            $(`.w${w} > .l${l}`).css("border-right", "2px solid transparent")

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
            $(`.w${w} > .l${l}`).css("border-right", "2px solid transparent")
            $(".w" + w + " span").css("color", "white")
            $(".w" + w + " span").css("opacity", "0.2")
        }
        l = 0;
        inputlength = 0;
    }

    $("#typer").on("input", function() {
        if (timerstarted == false) {
            startTimer()
        }

        if ($("#typer").val().length < inputlength) {
            $(`.w${w} > .l${l}`).css("opacity", "0.2")
            $(`.w${w} > .l${l}`).css("color", "white")
            $(`.w${w} > .l${l}`).css("border-right", "2px solid transparent")
            l--;
            totalentries--;
            $(`.w${w} > .l${l}`).css("border-right", "2px solid #faf000")
        } else {
            if($("#typer").val().length <= words[w].length){
                if ($("#typer").val().charAt(l) != words[w].charAt(l)) {
                    $(`.w${w} > .l${l+1}`).css("color", "red")
                }
                $(`.w${w} > .l${l+1}`).css("opacity", "1")
                $(`.w${w} > .l${l}`).css("border-right", "2px solid transparent")
                l++;
                totalentries++;
                $(`.w${w} > .l${l}`).css("border-right", "2px solid #faf000")
            }
        }
        inputlength = $("#typer").val().length;
    });

});

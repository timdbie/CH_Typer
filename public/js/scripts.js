$("document").ready(function() {
    $("#typer").css("display", "block")
    $("#typer").focus()
    selectedtimer = 14
    wpmval = 0.25

    function startTyper () {
        words = [];
        i = 0;
        w = 0;
        l = 0;
        correctentries = 0;
        totalentries = 0;
        inputlength = 0;
        errors = 0;
        toppos = 0;
        firstline = true;
        timerstarted = false;
        endingpopup = false;

        generateWords(wpmval*300)
        checkChar()
        $("#typer").attr("maxlength", `${words[0].length}`)
    }
    startTyper();

    $(".contentbox-wordscnt").fadeTo("fast", 1)

    function startTimer() {
        sec = selectedtimer
        timerstarted = true
        $(".contentbox-timer").html(sec+1);

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

    $(".header-timercnt button").click( function() {
        selectedtimer = parseInt($(this).val())
        wpmval = (selectedtimer + 1) / 60
        $("#typer").focus()
    });


    function endingPopUp() {
        $("#typer").blur()
        $("#endingpopup").fadeTo("fast", 1)

        typedwords = totalentries / 5
        grosswpm = typedwords / wpmval
        grosswpmval = Math.round(grosswpm)

        typedcorrectwords = correctentries / 5
        netwpm = typedcorrectwords / wpmval
        netwpmval = Math.round(netwpm)

        if(netwpmval < 0) {
            netwpmval = 0
        }

        accuracy = Math.round((correctentries / totalentries) * 100)

        $("#wpm h1").html(netwpmval)
        $("#rawwpm").html("raw: " + grosswpmval + " WPM")

        $("#accuracy h1").html(accuracy)
        $("#entries").html("entries: " + totalentries + "/" + correctentries + "/" + errors)
        endingpopup = true
    }


    function refreshTyper() {
        $("#typer").blur()
        $("#typer").val("")
        if (timerstarted){ 
            clearInterval(timer);
            $(".contentbox-timer").empty()
        }

        if (endingpopup) {
            $("#endingpopup").fadeTo("fast", 0)
        }

        $("#cursor").appendTo(".contentbox-wordscnt")
        $(".contentbox-words").empty()
        $(".contentbox-words").css("top", "0")
        startTyper()

        $("#typer").focus()
    }

    $("#refresh").click( function() {
        $(".contentbox-words").fadeOut(150)
        $(".contentbox-timer").fadeOut(150)
        $(".contentbox-words").promise().done(function(){
            refreshTyper()
            $(".contentbox-words").fadeIn(150)
            $(".contentbox-timer").fadeIn(0)
        });
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

    function submitInput() {
        text = $("#typer").val();

        if (text != words[w]) {
            $(`.w${w} > span`).css("border-bottom", "2px solid red")
        }


        $("#typer").val("");

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

        l = 0;
        checkChar()
        inputlength = 0;
    }

    function checkChar() {
        if (l == 0) {
            $("#cursor").appendTo(`.w${w} > .l${l + 1}`)

            $("#cursor").css({
                "left" : "-2px",
                "right" : "auto"
            })
        } else {
            $("#cursor").appendTo(`.w${w} > .l${l}`)

            $("#cursor").css({
                "left" : "auto",
                "right" : "-1px"
            })
        }
    }

    $("#typer").on("input", function() {
        if (timerstarted == false) {
            startTimer()
        }

        if ($("#typer").val().length < inputlength) {
            if($(`.w${w} > .l${l}`).css("color") == "rgb(255, 0, 0)") {
                errors--;
            } else {
                correctentries--;
            }

            $(`.w${w} > .l${l}`).css("color", "rgba(255,255,255,0.20)")
            l--;
            checkChar()
        } else {
            if($("#typer").val().length <= words[w].length){
                if ($("#typer").val().charAt(l) != words[w].charAt(l)) {
                    $(`.w${w} > .l${l+1}`).css("color", "red")
                    errors++;
                } else {
                    $(`.w${w} > .l${l+1}`).css("color", "white")
                    correctentries++;
                }
                l++;
                totalentries++;
                checkChar()
            }
        }
        inputlength = $("#typer").val().length;
    });

});

AFRAME.registerComponent('gamemode', {
    init: function () {
        this.el.addEventListener("body-loaded", e => {
            console.log("LOADEDDDDDDDDD");
            document.querySelector("#materials > span").innerHTML = window.materials;
            document.getElementById("materials").style.display = "block";
        });
    },
    deathUpdate() {
        console.log("new death!");
        setTimeout(() => {
            if (document.querySelectorAll('[enemy]').length == 0) {
                document.getElementById("gameover-win").style.display = 'block';
                window.gameover = true;
            }
            else if (document.querySelectorAll('[character]').length == 0) {
                document.getElementById("gameover-lose").style.display = 'block';
                window.gameover = true;
            }
        }, 1000);
        
    }
});

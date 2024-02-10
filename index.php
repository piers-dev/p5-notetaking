<!DOCTYPE html>
<html>

<head>

    <head>
        <meta charset="UTF-8">
        <title>Gravity Notes</title>
        <meta name="description" content="Gravity Notes v0.1">
        <meta name="keywords" content="Notetaking, Notes, Organisation">
        <meta name="viewport" content="width=device-width, height=device-height">
    </head>
    <script src="js/p5/p5.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/themes/light.css" />
    <script type="module"
        src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/shoelace-autoloader.js"></script>
    <link rel="stylesheet" href="css/style.css" />

    <?php
    echo "Hello"

    ?>

</head>

<body oncontextmenu="return false;">
    <input type="file" style="display: none;" id="fileLoad" accept=".board" onchange="loadFromFile()" />
    <input type="color" id="bg" onchange="updateBG()">
    <input type="color" id="og" onchange="updateBG()">

    <input type="color" id="fg" onchange="updateFG()">
    <input type="color" id="sg" onchange="updateSG()">
    <div id="overlay">
        <div>
            <sl-tooltip content="Outside Colour" placement="right">
                <button class="colorSelect" onclick="document.getElementById('og').click()"
                    style="background-color: var(--outground);border-radius: 15px 15px 0px 0px;"></button>
            </sl-tooltip>
        </div>
        <div>
            <sl-tooltip content="Background Colour" placement="right">
                <button class="colorSelect" onclick="document.getElementById('bg').click()"
                    style="background-color: var(--background);border-radius: 0;"></button>
            </sl-tooltip>
        </div>
        <div>
            <sl-tooltip content="Foreground Colour" placement="right">
                <button class="colorSelect" onclick="document.getElementById('fg').click()"
                    style="background-color: var(--foreground); border-radius: 0;"></button>
            </sl-tooltip>
        </div>
        <div>
            <sl-tooltip content="Special Colour" placement="right">
                <button class="colorSelect" onclick="document.getElementById('sg').click()"
                    style="background-color: var(--special);border-radius: 0px 0px 15px 15px;"></button>
            </sl-tooltip>
        </div>

        <sl-icon name="palette"
            style="color: var(--foreground); width: 40px; height: 40px; padding: 10px 5px;"></sl-icon>



    </div>



    <div id="menuBar">
        <div>
            <script>
                function copylink() {
                    window.open("/?data=\""+encodeURIComponent(btoa(JSON.stringify(nodesToObj(nodes))))+"\"");
                }
            </script>
            <sl-tooltip id="helpMenu">
                <div slot="content" class="tooltip">

                    <h2> <sl-icon name="plus-circle" style=" width: 25px; height: 25px;"></sl-icon> Add Note </h2>
                    <p> - Double-Click anywhere to Add a Note</p><br>
                    <h2> <sl-icon name="copy" style=" width: 25px; height: 25px;"></sl-icon> Duplicate Note </h2>
                    <p> - Alt+Click on any Note to Duplicate</p><br>
                    <h2> <sl-icon name="pencil" style=" width: 25px; height: 25px;"></sl-icon> Edit Note </h2>
                    <p> - Click on a Note to Edit it<br> - Click and Drag to Move<br> - Scroll while Hovering to Adjust
                        Size</p><br>
                    
                    <h2> <sl-icon name="trash" style=" width: 25px; height: 25px;"></sl-icon> Remove Note </h2>
                    <p> - Right-Click on any Note to Remove it</p><br>
                    <h2> <sl-icon name="stars" style=" width: 25px; height: 25px;"></sl-icon> Organisers </h2>
                    <p> - Middle-Click on any Note to Toggle Gravity</p><br>
                    <h2> <sl-icon name="arrows-move" style=" width: 25px; height: 25px;"></sl-icon> Canvas </h2>
                    <p> - Middle-Click and Drag to Pan<br> - Scroll to Zoom</p><br>


                </div>
                <button class="uiComponent">
                    <sl-icon name="question-circle"
                        style="color: var(--foreground); width: 30px; height: 30px;"></sl-icon>

                </button>


            </sl-tooltip>
            <sl-tooltip content="Save To File">
                <button class="uiComponent" onclick="filesave()">
                    <sl-icon name="floppy" style="color: var(--foreground); width: 30px; height: 30px;"></sl-icon>

                </button>


            </sl-tooltip>
            <sl-tooltip content="Open From File">
                <button class="uiComponent" onclick="fileopen()">
                    <sl-icon name="folder2-open" style="color: var(--foreground); width: 30px; height: 30px;"></sl-icon>

                </button>


            </sl-tooltip>
            
            <span style="margin: 0px 10px;"></span>
            <sl-tooltip content="Undo">
                <button class="uiComponent" onclick="undo()" id="undoButton">
                    <sl-icon name="arrow-90deg-left" style="color: var(--foreground); width: 30px; height: 30px;"></sl-icon>

                </button>


            </sl-tooltip>
            <sl-tooltip content="Redo">
                <button class="uiComponent" onclick="redo()" id="redoButton">
                    <sl-icon name="arrow-90deg-right" style="color: var(--foreground); width: 30px; height: 30px;"></sl-icon>

                </button>


            </sl-tooltip>
        </div>
    </div>
    <div id="canvasBar">
        <div>
            <sl-tooltip content="Add Organiser">
                <button class="uiComponentBig" onclick="addNote(true)"
                    style="border-color: var(--special); box-shadow: 0px 5px var(--special); size: 80px;">
                    <sl-icon name="folder-plus" style="color: var(--special); width: 40px; height: 40px;"></sl-icon>

                </button>


            </sl-tooltip>
            
            <sl-tooltip content="Add Note">
                <button class="uiComponentBig" onclick="addNote()">
                    <sl-icon name="plus-circle" style="color: var(--foreground); width: 40px; height: 40px;"></sl-icon>

                </button>


            </sl-tooltip>

        </div>
    </div>
    <div id="socialBar">
        <div>
            <script>
                function openwebsite() {
                    window.open("https://piersbaker.net/","_blank");
                }
                function opentwitter() {
                    window.open("https://twitter.com/@Pixstatic","_blank");
                }
                
            </script>
            <sl-tooltip content="My Website">
                <button class="uiComponent" onclick="openwebsite()">
                    <sl-icon name="box-arrow-up-right" style="color: var(--foreground); width: 30px; height: 30px;"></sl-icon>

                </button>


            </sl-tooltip>
            <sl-tooltip content="My Twitter">
                <button class="uiComponent" onclick="opentwitter()">
                    <sl-icon name="twitter" style="color: var(--foreground); width: 30px; height: 30px;"></sl-icon>

                </button>


            </sl-tooltip>
        </div>
    </div>



    <div id="canvas"></div>

    <script src="js/particle.js"></script>

    <script src="js/notenode.js"></script>


    <script src="js/rendermain.js"></script>
</body>

</html>
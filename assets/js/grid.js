var Grid = {
    draw: function() {
        var canvas = document.getElementById('grid');
        var ctx = canvas.getContext('2d');
        document.getElementById('grid').width = Board.numberOfItemTypes * 50 + WIDTH * 50;
        document.getElementById('grid').height = HEIGHT * 50;
        var img = new Image();
        img.onload = function() {
            for (var i=0; i<WIDTH; i++) {
                for (var j=0; j<HEIGHT; j++) {
                    ctx.drawImage(img, Board.numberOfItemTypes * 50 + i * 50, j * 50);
                }
            }
        }
        img.src="assets/images/FruitCell.png";
    }
}

var board = new Array();
var score = 0;
var hasConflicted = new Array();
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    if (documentWidth > 500)
    {
        gridConatainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }
    var gridContainer = $('#grid-container');
    gridContainer.css('width',gridConatainerWidth-2*cellSpace);
    gridContainer.css('height',gridConatainerWidth-2*cellSpace);
    gridContainer.css('padding',cellSpace);
    gridContainer.css('border-radius',radiusFrac*gridConatainerWidth);
    var gridCell = $('.grid-cell');
    gridCell.css('width',cellSideLength);
    gridCell.css('height',cellSideLength);
    gridCell.css('border-radius',radiusFrac*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for (var i = 0 ; i < 4; i++)
    {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));

            //初始化数字
            board[i][j] = 0;
            hasConflicted[i][j] = false;
            /*if (i == 3 && j == 3)
                board[i][j] = 0;
            else if(0 == (i+j)%2)
                board[i][j] = 2;
            else
                board[i][j] = 4;*/
        }
    }

    //分数初始化
    score = 0;
    updateScore(score);
    updateBoardView();
}

function updateBoardView(){

    $(".number-cell").remove();
    for (var i = 0 ; i < 4; i++)
        for (var j = 0; j < 4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>'); 
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if ( board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSpace/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSpace/2);
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }

    var numberCell = $('.number-cell');
    numberCell.css('line-height',cellSideLength+'px');
    numberCell.css('font-size',0.6*cellSideLength+'px')

}

function generateOneNumber(){
    
    if ( nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor((Math.random()*4)));
    var randy = parseInt( Math.floor((Math.random()*4)));
    
    var times = 0;
    while(times < 50){
        if ( board[randx][randy] == 0)
            break;

        var randx = parseInt( Math.floor((Math.random()*4)));
        var randy = parseInt( Math.floor((Math.random()*4)));
        times++;
    }

    if (times == 50){
        for (var i = 0; i < 4; i++)
            for(var j = 0; j < 4; j++)
                if(board[i][j] == 0){
                    randx =i;
                    randy = j;
                }
    }


    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;

    showNumberWithAnimation(randx, randy,randNumber);
    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37: //left
            event.preventDefault();
            if (moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38: //up;
            event.preventDefault();
            if (moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if (moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if (moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        default:
            break;
    }

});

document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
    event.preventDefault();
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    
    if (Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth){
        return;
    }

    //x
    if (Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax > 0){  //move right
            if (moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{    //move left
            if (moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
    else{   //y
        if (deltay > 0){ //move down
            if (moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{  //move up
            if (moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
});

function moveLeft(){
    if ( !canMoveLeft(board))
        return false;

    for(var i = 0; i < 4; i++)
        for(var j = 1; j < 4; j++){
            if (board[i][j] != 0){
                for (var k = 0; k < j; k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[i][k] &&  noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add
                        score += board[i][k];
                        hasConflicted[i][k] = true;
                        updateScore(score);
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if ( !canMoveUp(board))
        return false;

    for(var j = 0; j < 4; j++)
        for(var i = 1; i < 4; i++){
            if(board[i][j] != 0){
                for(var k = 0; k < i; k++)
                    if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[k][j] &&  noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add
                        score += board[k][j];
                        hasConflicted[k][j] = true;
                        updateScore(score);
                        continue;
                    }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;

}

function moveRight(){
    if ( !canMoveRight(board))
        return false;

     for(var i = 0; i < 4; i++)
        for(var j = 2; j >= 0; j--){
            if(board[i][j] != 0){
                for(var k = 3; k >j; k--){
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board))
                    {
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[i][k] &&  noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add
                        score += board[i][k];
                        hasConflicted[i][k] = true;
                        updateScore(score);
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;

}

function moveDown(){
    if ( !canMoveDown(board))
        return false;

    for(var j = 0; j < 4; j++)
        for(var i = 2; i >= 0; i--){
            if(board[i][j] != 0){
                for(var k = 3; k > i; k--)
                    if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[k][j] &&  noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add
                        score += board[k][j];
                        hasConflicted[k][j] = true;
                        updateScore(score);
                        continue;
                    }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;


}

function isGameOver(){
    if(nospace( board ) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert('gameover!');
}

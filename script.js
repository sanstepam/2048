import { Grid } from "./grid.js"
import { Tile } from "./tile.js"

const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();

function setupInputOnce() {
    window.addEventListener("keydown", handleInput, { once: true });
  }
  

function handleInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (!canMoveUp()){
                setupInputOnce()
                return
            }
            moveUp()
            break;

        case 'ArrowDown':
            if (!canMoveDown()){
                setupInputOnce()
                return
            }
            moveDown()
            break;

        case 'ArrowLeft':
            if (!canMoveLeft()){
                setupInputOnce()
                return
            }
            moveLeft()
            break;

        case 'ArrowRight':
            if (!canMoveRight()){
                setupInputOnce()
                return
            }
            moveRight()
            break;

        
    
        default:
            setupInputOnce()
            return

    }
    setupInputOnce()

    const newTile = new Tile(gameBoard);
    grid.getRandomEmptyCell().linkTile(newTile);


}
   function moveUp(){
        slideTiles(grid.cellsGroupedByColumn)
    }

    function moveDown() {
        slideTiles(grid.cellsGroupedByReversedColumn)
    }

    function moveLeft(){
        slideTiles(grid.cellsGroupedByRow)
    }

    function moveRight() {
        slideTiles(grid.cellsGroupedByReversedRow)
    }

    function slideTiles(groupedCells){
        groupedCells.forEach(group => slideTilesInGroup(group));

        grid.cells.forEach(cell => {
            cell.hasTileForMerge() && cell.mergeTiles()
          });
        }

        function slideTilesInGroup(group){
            for (let i = 1; i < group.length; i++){
                if(group[i].isEmpty()) {continue}
    
                const cellWithTile = group[i]
    
                let targetCell;
                let j = i - 1
                while(j >= 0 && group[j].canAccept(cellWithTile.linkedTile)){
                    targetCell = group[j];
                    j--;
                }
    
                if (!targetCell) {continue}
    
                if (targetCell.isEmpty()) {
                    targetCell.linkTile(cellWithTile.linkedTile)
                } else {
                    targetCell.linkTileForMerge(cellWithTile.linkedTile)
                }
    
                cellWithTile.unlinkTile()
        }
    }

    function canMoveUp() {
        return canMove(grid.cellsGroupedByColumn)
    }

    function canMoveDown() {
        return canMove(grid.cellsGroupedByReversedColumn)
    }

    function canMoveLeft() {
        return canMove(grid.cellsGroupedByRow)
    }

    function canMoveRight() {
        return canMove(grid.cellsGroupedByReversedRow)
    }

    function canMove(groupedCells) {
        return groupedCells.some(group=> canMoveInGroup(group))
    }

    function canMoveInGroup(group) {
        return group.some((cell, index)=> {
            if (index === 0) return false

            if (cell.isEmpty()) return false

            const targetCell = group[index-1]
            return targetCell.canAccept(cell.linkedTile)
        })
    }

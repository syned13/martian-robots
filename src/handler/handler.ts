var fs = require("fs");

var RobotFallenError = new Error("robot fallen error");

var validDirections = ["N", "E", "S", "W"];

interface Point {
  x: number;
  y: number;
}

interface Grid {
  upperLeft: Point;
  bottomRight: Point;
  markedGridPositions: Point[];
}

class Robot {
  direction: string;
  x: number;
  y: number;
  grid: Grid;

  constructor(x: number, y: number, direction: string, grid: Grid) {
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.grid = grid;
  }

  move(instructions: string) {
    for (let i = 0; i < instructions.length; i++) {
      switch (instructions[i]) {
        case "L":
          this.rotateToLeft();
          break;
        case "R":
          this.rotateToRight();
          break;
        case "F":
          this.moveForward();
          break;
        default:
          throw new Error("invalid input: robot instruction");
      }
    }
  }

  moveForward() {
    let newX: number;
    let newY: number;

    switch (this.direction) {
      case "N":
        newX = this.x;
        newY = this.y + 1;
        break;
      case "E":
        newX = this.x + 1;
        newY = this.y;
        break;
      case "S":
        newX = this.x;
        newY = this.y - 1;
        break;
      case "W":
        newX = this.x - 1;
        newY = this.y;
        break;
      default:
        throw new Error("invalid direction");
    }

    const hasCurrentPositionAScent = this.hasCurrentPositionAScent();
    const willFall = this.willFall(newX, newY);

    if (willFall && hasCurrentPositionAScent) {
      return; //ignore command
    } else if (willFall) {
      throw RobotFallenError;
    }

    this.x = newX;
    this.y = newY;
  }

  rotateToRight() {
    switch (this.direction) {
      case "N":
        this.direction = "E";
        break;
      case "E":
        this.direction = "S";
        break;
      case "S":
        this.direction = "W";
        break;
      case "W":
        this.direction = "N";
        break;
      default:
        throw new Error("invalid direction");
    }
  }

  rotateToLeft() {
    switch (this.direction) {
      case "N":
        this.direction = "W";
        break;
      case "W":
        this.direction = "S";
        break;
      case "S":
        this.direction = "E";
        break;
      case "E":
        this.direction = "N";
        break;
      default:
        throw new Error("invalid direction");
    }
  }

  willFall(newX: number, newY: number): boolean {
    return (
      newX > this.grid.upperLeft.x ||
      newX < this.grid.bottomRight.x ||
      newY > this.grid.upperLeft.y ||
      newY < this.grid.bottomRight.y
    );
  }

  hasCurrentPositionAScent(): boolean {
    return this.grid.markedGridPositions.some(
      (markedPosition) =>
        markedPosition.x === this.x && markedPosition.y === this.y
    );
  }
}

function isValidDirection(direction: string): boolean {
  return validDirections.includes(direction);
}

async function main() {
  try {
    const inputContent = getInputContent();
    await execute(inputContent);
  } catch (e) {
    console.log(e);
  }
}

function getInputContent(): string[] {
  if (process.argv.length < 3) {
    throw new Error("input file not specified");
  }

  const fileName = process.argv[2];

  const file = fs.readFileSync(fileName);

  const fileStr = String(file);

  if (fileStr === "") {
    throw new Error("file is empty");
  }

  return fileStr.split("\n");
}

export async function execute(inputContent: string[]) {
  if (inputContent.length < 3) {
    throw new Error("invalid input: at least 3 lines required");
  }

  const grid = await getGrid(inputContent[0]);

  let currentLine = 1;

  while (currentLine < inputContent.length) {
    if (inputContent[currentLine] === "") {
      currentLine++;
      continue;
    }

    const robotPositions = inputContent[currentLine++];

    const robotInstructions = inputContent[currentLine++];

    const robot = getRobot(robotPositions.trim(), grid);
    try {
      robot.move(robotInstructions);
      console.log(`${robot.x} ${robot.y} ${robot.direction}`);
    } catch (e) {
      if (e === RobotFallenError) {
        grid.markedGridPositions.push({ x: robot.x, y: robot.y });
        console.log(`${robot.x} ${robot.y} ${robot.direction} LOST`);
      } else {
        throw e;
      }
    }
  }
}

function getRobot(robotPositions: string, grid: Grid): Robot {
  const robotPositionsSplitted = robotPositions.split(" ");
  if (robotPositionsSplitted.length != 3) {
    throw new Error("invalid input: robot position and direction");
  }

  const robotX = parseInt(robotPositionsSplitted[0]);
  if (!robotX && robotX !== 0) {
    throw new Error("invalid input: robot position x coordinate");
  }

  const robotY = parseInt(robotPositionsSplitted[1]);
  if (!robotY) {
    throw new Error("invalid input: robot position y coordinate");
  }

  const direction = robotPositionsSplitted[2];

  if (!direction || !isValidDirection(direction)) {
    throw new Error("invalid input: robot direction");
  }

  return new Robot(robotX, robotY, direction, grid);
}

async function getGrid(gridLeftCoordinatesLine: string): Promise<Grid> {
  const splittedGridLeftCoordinates = gridLeftCoordinatesLine.split(" ");

  const gridLeftCoordinateX = parseInt(splittedGridLeftCoordinates[0]);
  if (!gridLeftCoordinateX) {
    throw new Error("invalid input: grid coordinates");
  }

  const gridLeftCoordinateY = parseInt(splittedGridLeftCoordinates[1]);
  if (!gridLeftCoordinateY) {
    throw new Error("invalid input: grid coordinates");
  }

  return {
    upperLeft: {
      x: gridLeftCoordinateX,
      y: gridLeftCoordinateY,
    },
    bottomRight: {
      x: 0,
      y: 0,
    },
    markedGridPositions: [],
  };
}

// main();

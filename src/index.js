let worldSize;
let cellSize;
let worldBuffer;

const cellwise = (world, fn) => world.forEach((cols, m) => (
  cols.forEach((cell, n) => fn(cell, m, n))
));

const countNeighbors = (world, m, n) => {
  let sum = 0 - world[m][n]; // subtract self
  const mMin = Math.max(m - 1, 0);
  const mMax = Math.min(m + 1, worldSize[0] - 1);
  const nMin = Math.max(n - 1, 0);
  const nMax = Math.min(n + 1, worldSize[1] - 1);

  for (let mI = mMin; mI <= mMax; mI++) {
    for (let nI = nMin; nI <= nMax; nI++) {
      sum += world[mI][nI];
    }
  }

  return sum;
};

const randomWorld = (m, n) => (
  Array.from({ length: m }, () => (
    Array.from({ length: n }, () => (
      Math.floor(Math.random() * 2)
    ))
  ))
);

const updateWorlds = () => {
  const oldWorld = worldBuffer[0];
  const newWorld = worldBuffer[1];

  oldWorld.forEach((cols, m) => {
    cols.forEach((oldCell, n) => {
      const neighbors = countNeighbors(oldWorld, m, n);
      let newCell = oldCell;

      if (neighbors < 2 || neighbors > 3) {
        newCell = 0;
      } else if (oldCell || neighbors === 3) {
        newCell = 1;
      }

      newWorld[m][n] = newCell;
    });
  });

  worldBuffer = [newWorld, oldWorld];
};

window.setup = () => {
  frameRate(2);
  colorMode(RGB, 1);
  createCanvas(400, 400);
  stroke(0.5);
  worldSize = [15, 15]
  cellSize = 15;

  const startWorld = randomWorld(...worldSize);
  worldBuffer = [startWorld, randomWorld(...worldSize)];

  draw();
};

window.draw = () => {
  const world = worldBuffer[0];

  cellwise(world, (cell, m, n) => {
    fill(cell ? 0 : 1);
    rect(n * cellSize, m * cellSize, cellSize, cellSize);
  });

  updateWorlds();
}
import { spawnFood } from './useSnakeGame';

test('spawnFood avoids snake cells', () => {
  const size = 5;
  const snake = [{x:2,y:2}, {x:2,y:3}, {x:2,y:4}];
  const food = spawnFood(size, snake);
  const collides = snake.some(s => s.x === food.x && s.y === food.y);
  expect(collides).toBe(false);
  expect(food.x).toBeGreaterThanOrEqual(0);
  expect(food.y).toBeGreaterThanOrEqual(0);
  expect(food.x).toBeLessThan(size);
  expect(food.y).toBeLessThan(size);
});

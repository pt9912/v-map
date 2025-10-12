# BVHNode2D Usage Examples

## toString() Method

The `toString()` method provides a visual representation of the BVH tree structure:

```typescript
import { BVHNode2D } from './BVHNode2D';
import { Triangle2D } from './AABB2D';

// Build a BVH tree from triangles
const triangles: Triangle2D[] = [...]; // Your triangles
const bvh = BVHNode2D.build(triangles);

// Print tree structure
console.log(bvh.toString());
```

### Example Output

For a tree with 8 triangles:

```
NODE bbox=[0.00, 0.00, 80.00, 10.00]
├─ left:
│  NODE bbox=[0.00, 0.00, 40.00, 10.00]
│  ├─ left:
│  │  LEAF bbox=[0.00, 0.00, 20.00, 10.00] triangles=2
│  └─ right:
│  │  LEAF bbox=[20.00, 0.00, 40.00, 10.00] triangles=2
└─ right:
   NODE bbox=[40.00, 0.00, 80.00, 10.00]
   ├─ left:
   │  LEAF bbox=[40.00, 0.00, 60.00, 10.00] triangles=2
   └─ right:
      LEAF bbox=[60.00, 0.00, 80.00, 10.00] triangles=2
```

### Understanding the Output

- **NODE**: Internal node with child nodes
- **LEAF**: Leaf node containing actual triangles
- **bbox=[x_min, y_min, x_max, y_max]**: Bounding box coordinates
- **triangles=N**: Number of triangles in leaf node
- **├─**, **└─**, **│**: Tree structure indicators

## getStats() Method

The `getStats()` method provides statistics about the BVH tree:

```typescript
const stats = bvh.getStats();

console.log('BVH Statistics:');
console.log(`  Depth: ${stats.depth}`);
console.log(`  Total Nodes: ${stats.nodeCount}`);
console.log(`  Leaf Nodes: ${stats.leafCount}`);
console.log(`  Total Triangles: ${stats.triangleCount}`);
console.log(`  Min Triangles/Leaf: ${stats.minTrianglesPerLeaf}`);
console.log(`  Max Triangles/Leaf: ${stats.maxTrianglesPerLeaf}`);
```

### Example Output

```
BVH Statistics:
  Depth: 4
  Total Nodes: 15
  Leaf Nodes: 8
  Total Triangles: 100
  Min Triangles/Leaf: 2
  Max Triangles/Leaf: 2
```

### Statistics Explained

- **depth**: Maximum depth of the tree (1 = single node)
- **nodeCount**: Total number of nodes (internal + leaf)
- **leafCount**: Number of leaf nodes containing triangles
- **triangleCount**: Total number of triangles in the tree
- **minTrianglesPerLeaf**: Minimum triangles in any leaf node
- **maxTrianglesPerLeaf**: Maximum triangles in any leaf node

## Debugging Usage

### Combined Output for Debugging

```typescript
// Build BVH
const bvh = BVHNode2D.build(triangles, 0, 10);

// Print structure
console.log('=== BVH Tree Structure ===');
console.log(bvh.toString());
console.log();

// Print statistics
const stats = bvh.getStats();
console.log('=== BVH Statistics ===');
console.log(JSON.stringify(stats, null, 2));
```

### Performance Analysis

Use `getStats()` to analyze tree quality:

```typescript
const stats = bvh.getStats();

// Check if tree is balanced
const avgTrianglesPerLeaf = stats.triangleCount / stats.leafCount;
console.log(`Average triangles per leaf: ${avgTrianglesPerLeaf.toFixed(2)}`);

// Check depth efficiency
const idealDepth = Math.ceil(Math.log2(stats.triangleCount));
console.log(`Ideal depth: ${idealDepth}, Actual: ${stats.depth}`);

// Check triangle distribution
const distribution = stats.maxTrianglesPerLeaf - stats.minTrianglesPerLeaf;
console.log(`Triangle distribution spread: ${distribution}`);
```

## Integration with GeoTIFF Layer

Example usage in DeckGLGeoTIFFLayer:

```typescript
// After building triangulation
const triangulation = new Triangulation(transformFn, targetExtent, 0.5);
const triangles2D = triangulation.getTriangles().map(t =>
  BVHNode2D.toTriangle2D(t)
);

// Build BVH
const bvh = BVHNode2D.build(triangles2D);

// Debug output
if (process.env.NODE_ENV === 'development') {
  console.log('Triangulation BVH:');
  console.log(bvh.toString());

  const stats = bvh.getStats();
  console.log(`Created BVH with ${stats.triangleCount} triangles, ` +
              `depth ${stats.depth}, ${stats.leafCount} leaves`);
}

// Use for spatial queries
const containingTriangle = bvh.findContainingTriangle({ x: 100, y: 100 });
```

## Unit Testing

The methods are also useful for testing:

```typescript
describe('BVH Quality', () => {
  it('should create balanced tree', () => {
    const bvh = BVHNode2D.build(triangles);
    const stats = bvh.getStats();

    // Assert tree quality
    expect(stats.depth).toBeLessThan(15);
    expect(stats.leafCount).toBeGreaterThan(stats.triangleCount / 10);

    // Log for debugging if test fails
    if (stats.depth >= 15) {
      console.log('Unbalanced tree detected:');
      console.log(bvh.toString());
    }
  });
});
```

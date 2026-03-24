#!/bin/bash
set -e

# Script to download test DEM (Digital Elevation Model) GeoTIFF files
# These are used for testing terrain-geotiff layer functionality
# Files are downloaded to /tmp/v-map-test-dems/

TEST_DIR="/tmp/v-map-test-dems"
CACHE_FILE="$TEST_DIR/.cache_timestamp"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== v-map Test DEM Download Script ===${NC}"

# Create test directory
mkdir -p "$TEST_DIR"

# Check if files are already cached (less than 24 hours old)
if [ -f "$CACHE_FILE" ]; then
    CACHE_AGE=$(($(date +%s) - $(stat -c %Y "$CACHE_FILE" 2>/dev/null || stat -f %m "$CACHE_FILE")))
    if [ $CACHE_AGE -lt 86400 ]; then
        echo -e "${GREEN}✓ Using cached test DEMs (${CACHE_AGE}s old)${NC}"
        ls -lh "$TEST_DIR"/*.tif 2>/dev/null || true

        # Ensure symlink exists even when using cache
        DEMO_LINK="demo/terrain-geotiff/test-dems"
        if [ ! -L "$DEMO_LINK" ]; then
            echo -e "${BLUE}Creating symlink for demo: $DEMO_LINK -> $TEST_DIR${NC}"
            ln -sf "$TEST_DIR" "$DEMO_LINK"
            echo -e "${GREEN}✓ Symlink created${NC}"
        fi

        exit 0
    fi
fi

echo -e "${YELLOW}Downloading test DEM files...${NC}"

# Download USGS sample DEMs
echo -e "${BLUE}1. Downloading USGS i30dem.tif (5.3 MB)...${NC}"
wget -q -O "$TEST_DIR/i30dem.tif" \
    https://download.osgeo.org/geotiff/samples/usgs/i30dem.tif

echo -e "${BLUE}2. Downloading USGS m30dem.tif (5.3 MB)...${NC}"
wget -q -O "$TEST_DIR/m30dem.tif" \
    https://download.osgeo.org/geotiff/samples/usgs/m30dem.tif

# Update cache timestamp
touch "$CACHE_FILE"

# Create symlink for HTTP access in demo
DEMO_LINK="demo/terrain-geotiff/test-dems"
if [ ! -L "$DEMO_LINK" ]; then
    echo -e "${BLUE}Creating symlink for demo: $DEMO_LINK -> $TEST_DIR${NC}"
    ln -sf "$TEST_DIR" "$DEMO_LINK"
    echo -e "${GREEN}✓ Symlink created${NC}"
else
    echo -e "${GREEN}✓ Symlink already exists${NC}"
fi

echo -e "${GREEN}✓ Download complete!${NC}"
echo ""
echo "Test DEM files available at:"
ls -lh "$TEST_DIR"/*.tif

echo ""
echo -e "${GREEN}Usage:${NC}"
echo "  - deck.gl:  provider='deck'"
echo "  - Cesium:   provider='cesium'"
echo ""
echo "Example URLs for testing (via HTTP):"
echo "  ./test-dems/i30dem.tif"
echo "  ./test-dems/m30dem.tif"
echo ""
echo "Physical location: $TEST_DIR"

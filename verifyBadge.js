function verifyBadge(input) {
    const file = input.files[0];
    const image = new Image();
  
    image.onload = function() {
      if (image.width !== 512 || image.height !== 512) {
        alert("Image size must be 512x512 pixels.");
        return;
      }
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
  
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let hasNonTransparentPixels = false;
  
      // Verify non-transparent pixels are within a circle
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha !== 0) {
          hasNonTransparentPixels = true;
  
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
  
          // Check if the pixel is within the circle
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = canvas.width / 2;
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  
          if (distance > radius) {
            alert("Non-transparent pixels must be within a circle.");
            return;
          }
        }
      }
  
      if (!hasNonTransparentPixels) {
        alert("Image must contain non-transparent pixels.");
        return;
      }
  
      // Check colors of the badge
      function isHappyColor(r, g, b) {
        // Define the range of "happy" feeling colors
        const happyColors = [
            { minR: 200, maxR: 255, minG: 100, maxG: 255, minB: 100, maxB: 255 }, // Example happy color range 1 (pink/red)
            { minR: 100, maxR: 255, minG: 150, maxG: 255, minB: 100, maxB: 255 }  // Example happy color range 2 (green)
            // Add more color ranges as needed
        ];

        // Check if the pixel's color falls within any of the happy color ranges
        for (let colorRange of happyColors) {
            if (r >= colorRange.minR && r <= colorRange.maxR &&
                g >= colorRange.minG && g <= colorRange.maxG &&
                b >= colorRange.minB && b <= colorRange.maxB) {
                return true; // Pixel color is within a happy color range
            }
        }

        return false; // Pixel color is not a happy color
    }

    // Check colors of the badge
    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha !== 0) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check if the pixel color is happy
            if (!isHappyColor(r, g, b)) {
                alert("Badge contains colors that don't give a 'happy' feeling.");
                return;
            }
        }
    }

    // If all checks pass
      alert("Badge uploaded successfully!");
    };
  
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        image.src = e.target.result;
      };
    }
  }
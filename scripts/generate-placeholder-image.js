const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create a directory for the image if it doesn't exist
const imageDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Create a canvas for the blog hero image
const width = 800;
const height = 500;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

// Fill background with a gradient
const gradient = context.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#3498db');
gradient.addColorStop(1, '#2c3e50');
context.fillStyle = gradient;
context.fillRect(0, 0, width, height);

// Add some decorative elements
context.fillStyle = 'rgba(255, 255, 255, 0.1)';
for (let i = 0; i < 10; i++) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const size = Math.random() * 100 + 50;
  context.beginPath();
  context.arc(x, y, size, 0, Math.PI * 2);
  context.fill();
}

// Add text
context.font = 'bold 40px Arial';
context.fillStyle = 'white';
context.textAlign = 'center';
context.fillText('Blog Workspace', width / 2, height / 2 - 20);

context.font = '20px Arial';
context.fillText('Modern blogging with Next.js', width / 2, height / 2 + 20);

// Save the image
const buffer = canvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(imageDir, 'blog-hero.jpg'), buffer);

console.log('Placeholder image created at public/images/blog-hero.jpg');

#!/usr/bin/env node

/**
 * Copy Legacy Site Build Script
 *
 * This script copies the built legacy site from old/dist-legacy/
 * to public/legacy/ so it can be served at /legacy/ path in the
 * new portfolio site.
 *
 * Usage: node scripts/copy-legacy.js
 */

const fs = require('fs');
const path = require('path');

// Recursive copy function (Node 16+ has fs.cpSync but for compatibility)
function copyDir(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy directories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function copyLegacySite() {
  const source = path.resolve(__dirname, '../old/dist-legacy');
  const target = path.resolve(__dirname, '../public/legacy');

  try {
    console.log('📦 Copying legacy site...');
    console.log(`  Source: ${source}`);
    console.log(`  Target: ${target}`);

    // Check if source exists
    if (!fs.existsSync(source)) {
      console.error('❌ Error: Legacy build not found at', source);
      console.error('   Run "npm run build:legacy" first');
      process.exit(1);
    }

    // Remove existing legacy folder if it exists
    if (fs.existsSync(target)) {
      console.log('  Removing existing legacy folder...');
      fs.rmSync(target, { recursive: true, force: true });
    }

    // Copy legacy dist to public/legacy
    copyDir(source, target);

    console.log('✅ Legacy site copied successfully');

    // Verify index.html exists
    const indexPath = path.join(target, 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('❌ Error: Legacy index.html not found after copy');
      process.exit(1);
    }

    // Verify CV PDF exists (critical for production)
    const pdfPath = path.join(target, 'YAMAC_BEZIRGAN_CV.pdf');
    if (!fs.existsSync(pdfPath)) {
      console.error('❌ Error: CV PDF not found after copy');
      console.error('   Expected:', pdfPath);
      console.error('   Make sure YAMAC_BEZIRGAN_CV.pdf exists in old/dist-legacy/');
      process.exit(1);
    }
    console.log('  ✓ CV PDF found');

    // Calculate and log size
    const getDirectorySize = (dirPath) => {
      let size = 0;
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          size += getDirectorySize(filePath);
        } else {
          size += stats.size;
        }
      }

      return size;
    };

    const totalSize = getDirectorySize(target);
    console.log(`  Total size: ${(totalSize / 1024).toFixed(2)} KB`);

  } catch (err) {
    console.error('❌ Failed to copy legacy site:', err.message);
    process.exit(1);
  }
}

// Run the script
copyLegacySite();

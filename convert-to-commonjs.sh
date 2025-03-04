#!/bin/bash
for file in src/declarations/*/*.did.js; do
  # Convert export const to const
  sed -i 's/export const/const/g' "$file"
  # Ensure module.exports is added at the end
  if ! grep -q "module.exports" "$file"; then
    echo "module.exports = { idlFactory, init };" >> "$file"
  fi
done
echo "Converted all .did.js files to CommonJS"
#!/bin/bash

# Loop through folders
for d in ~/Music/Pandora/*;
do
  echo "in directory: \"$d\"" 
  # Change directory to the folder and rename the song's artist
  # Old way
  ( cd "$d" && id3tool -a "`basename \"$PWD\"`" *.mp4)

  # New way - this corrupts the file
  # ( cd "$d" && id3v2 -a "`basename \"$PWD\"`" *.mp4)
done

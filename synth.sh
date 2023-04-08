cp -r /mnt/d/go_lib/ml/audio/js ./frontend/public
cp -r /mnt/d/go_lib/ml/audio/js/audio.ts ./frontend/src/core/audio.ts

tsc --target es2017 ./frontend/public/js/*.ts
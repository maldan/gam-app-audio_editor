package main

import (
	"embed"

	helloworld "github.com/maldan/gam-app-audio_editor/internal/app/audio_editor"
)

//go:embed frontend/dist/*
var frontFs embed.FS

func main() {
	helloworld.Start(frontFs) //
}

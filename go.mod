module github.com/maldan/gam-app-audio_editor

go 1.18

// replace github.com/maldan/go-cmhp => ../../go_lib/cmhp

replace github.com/maldan/go-ml => ../../go_lib/ml

require github.com/maldan/go-ml v0.0.0-20230406002748-f916466fef17

require (
	github.com/edsrzf/mmap-go v1.1.0 // indirect
	golang.org/x/exp v0.0.0-20230310171629-522b1b587ee0 // indirect
	golang.org/x/sys v0.5.0 // indirect
)

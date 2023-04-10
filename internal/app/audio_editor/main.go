package audio_editor

import (
	"embed"
	"flag"
	"fmt"
	"github.com/maldan/gam-app-audio_editor/internal/app/audio_editor/config"
	ms "github.com/maldan/go-ml/server"
	ms_handler "github.com/maldan/go-ml/server/core/handler"
	"os"
	"strings"

	"github.com/maldan/gam-app-audio_editor/internal/app/audio_editor/api"
)

func Start(frontFs embed.FS) {
	// Server
	var host = flag.String("host", "127.0.0.1", "Server Hostname")
	var port = flag.Int("port", 16000, "Server Port")
	_ = flag.Int("clientPort", 8080, "Client Port")

	// Data
	var dataDir = flag.String("dataDir", "db", "Data Directory")
	_ = flag.String("appId", "id", "App id")
	flag.Parse()

	// Set
	wd, _ := os.Getwd()
	wd = strings.ReplaceAll(wd, "\\", "/")
	config.DataDir = wd + "/" + *dataDir
	config.Host = fmt.Sprintf("%s:%d", *host, *port)

	// Start server
	ms.Start(ms.Config{
		Host: fmt.Sprintf("%s:%d", *host, *port),
		Router: []ms_handler.RouteHandler{
			{
				Path: "/api",
				Handler: ms_handler.API{
					ControllerList: []any{api.Project{}},
				},
			},
			{
				Path: "/data",
				Handler: ms_handler.FS{
					ContentPath: config.DataDir,
				},
			},
		},
	})
}

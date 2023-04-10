package api

import (
	"fmt"
	"github.com/maldan/gam-app-audio_editor/internal/app/audio_editor/config"
	"github.com/maldan/gam-app-audio_editor/internal/app/audio_editor/db"
	ms_error "github.com/maldan/go-ml/server/error"
	ml_fs "github.com/maldan/go-ml/util/io/fs"
	ml_file "github.com/maldan/go-ml/util/io/fs/file"
	ml_json "github.com/maldan/go-ml/util/io/fs/json"
	"strings"
)

type Project struct {
}

type ArgsProject struct {
	Name string `json:"name"`
	Body string `json:"body"`
}

// PostIndex of reference
func (r Project) PostIndex(args ArgsProject) {
	p := fmt.Sprintf("%v/project/%v/track.json", config.DataDir, args.Name)
	err := ml_file.New(p).Write([]byte(args.Body))
	ms_error.FatalIfError(err)
}

// GetIndex of reference
func (r Project) GetIndex(args ArgsProject) map[string]any {
	p := fmt.Sprintf("%v/project/%v/track.json", config.DataDir, args.Name)
	body, err := ml_json.FromFile[map[string]any](p)
	ms_error.FatalIfError(err)
	return body
}

// GetList of reference
func (r Project) GetList() []db.Project {
	files, _ := ml_fs.ListAll(config.DataDir + "/project")
	out := make([]db.Project, 0)
	for _, file := range files {
		relativePath := strings.Replace(file.FullPath, config.DataDir, "", 1)

		cat := strings.Split(relativePath, "/")
		cat = cat[0 : len(cat)-1]

		ref := db.Project{
			Name: file.Name,
			Url:  "http://" + config.Host + "/data" + relativePath,
		}

		out = append(out, ref)
	}
	return out
}

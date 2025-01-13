package app

import (
	"context"
	"fmt"

	"github.com/showntop/llmack/engine"
	"github.com/showntop/llmack/tool"
	"github.com/showntop/llmack/workflow"
	"github.com/showntop/wuyill/internal/search/domain"
)

// Application ...
type Application struct {
}

// NewApplication ...
func NewApplication() *Application {
	return &Application{}
}

// SearchCommand ...
type SearchCommand struct {
	Query string
}

// Search ...
func (app *Application) Search(ctx context.Context, command SearchCommand) (SearchEventStream, error) {
	events := NewSearchEventStream()
	go func() {
		defer events.Close()

		settings := engine.DefaultSettings()
		settings.Workflow = domain.NewWorkflow()
		settings.LLMModel.Provider = "hunyuan"
		runx := engine.NewWorkflowEngine(settings)
		esm := runx.Stream(ctx, engine.Input{Query: command.Query})
		for chunk := esm.Next(); chunk != nil; chunk = esm.Next() {
			if data, ok := chunk.Data.(*workflow.Event); ok {
				if ee, ok := data.Data.(tool.Event); ok {
					if ee.Name == "related" {
						events.Push(&SearchEvent{Status: ee.Name, Related: ee.Data.(string)})
					} else if ee.Name == "answer" {
						events.Push(&SearchEvent{Status: ee.Name, Answer: ee.Data.(string)})
					} else if ee.Name == "sources" {
						events.Push(&SearchEvent{Status: ee.Name, Sources: ee.Data})
					} else if ee.Name == "images" {
						events.Push(&SearchEvent{Status: ee.Name, Images: ee.Data})
					} else if ee.Name == "videos" {
						events.Push(&SearchEvent{Status: ee.Name, Videos: ee.Data})
					}
				}
			}
			if data, ok := chunk.Data.(*workflow.Result); ok {
				fmt.Println(data)
			}
		}
	}()
	return events, nil
}

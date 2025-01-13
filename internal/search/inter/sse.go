package inter

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/showntop/llmack/engine"
	"github.com/showntop/llmack/llm"
	"github.com/showntop/wuyill/internal/search/app"
)

// SSEHandler ...
type SSEHandler struct {
	app *app.Application
}

// NewSSEHandler ...
func NewSSEHandler(app *app.Application) *SSEHandler {
	return &SSEHandler{
		app: app,
	}
}

// Search ...
func (h *SSEHandler) Search(c *gin.Context) {
	ctx := c.Request.Context()
	var params SearchRequest
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")

	if len(params.Messages) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "empty message"})
		return
	}
	events, err := h.app.Search(ctx, app.SearchCommand{
		Query: params.Messages[len(params.Messages)-1].Content,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for event := range events {
		c.SSEvent("data", event)
		c.Writer.Flush()
	}
}

// Consult ...
func (h *SSEHandler) Consult(c *gin.Context) {

	ctx := c.Request.Context()

	var input engine.Input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")

	var settings = &engine.Settings{}

	settings.LLMModel.Provider = "coze"
	settings.LLMModel.Name = "none"
	settings.PresetPrompt = ""

	botEngine := engine.NewChatEngine(settings, engine.WithMemory(nil))
	esm := botEngine.Stream(ctx, engine.Input{
		Inputs: map[string]any{},
		Query:  input.Query,
	})
	for result := esm.Next(); result != nil; result = esm.Next() { // toast searching
		if data, ok := result.Data.(*llm.Chunk); ok {
			c.SSEvent("data", map[string]any{"answer": data.Delta.Message.Content().Data})
			c.Writer.Flush()
		}
	}
}

package main

import (
	"context"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.uber.org/fx"

	"github.com/showntop/wuyill/internal/pkg/log"
	"github.com/showntop/wuyill/internal/search"
	"github.com/showntop/wuyill/internal/search/inter"

	"github.com/showntop/llmack/llm"
	xlog "github.com/showntop/llmack/log"
	_ "github.com/showntop/llmack/tool/search/ai"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.FatalContext(context.Background(), "Failed to load env file: %v", err)
	}

	xlog.SetLogger(&xlog.WrapLogger{})

	llm.WithConfigs(map[string]any{
		"hunyuan": map[string]any{
			"api_key": os.Getenv("hunyuan_api_key"),
		},
		"openai-c": map[string]any{
			"api_key":  os.Getenv("hunyuan2_api_key"),
			"base_url": os.Getenv("hunyuan2_base_url"),
		},
		"coze": map[string]any{
			"bot_id":   os.Getenv("coze_bot_id"),
			"user_id":  os.Getenv("coze_user_id"),
			"endpoint": os.Getenv("coze_endpoint"),
			"api_key":  os.Getenv("coze_api_key"),
		},
	})
}

func main() {
	fx.New(
		search.Module,
		fx.Invoke(startHTTPServer),
	).Run()
}

func startHTTPServer() {
	startGinServer(register)
}

// startGinServer 创建 gRPC 网关
func startGinServer(_ func(*gin.Engine)) error {
	// new gin server with cors
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	register(r)
	return r.Run(":9001")
}

func register(r *gin.Engine) {
	// 注册SSE
	handler := inter.SSEHandler{}
	r.POST("/api/eyao/query", handler.Consult)
	r.POST("/api/search", handler.Search)
}

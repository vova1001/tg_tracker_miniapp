package router

import (
	"github.com/redis/go-redis/v9"
	h "github.com/vova1001/tg_tracker_miniapp/handlers"

	"github.com/gin-gonic/gin"
)

func RoutRegister(r *gin.Engine, bot_token string, rdb *redis.Client) {

	r.Use(func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", "https://tg-tracker-miniapp.onrender.com")
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(204)
			return
		}
		ctx.Next()
	})

	r.POST("/entry", h.CreateUser(bot_token, rdb))

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, "Hi world!")
	})
}

package handlers

import (
	"github.com/redis/go-redis/v9"
	a "github.com/vova1001/tg_tracker_miniapp/authmiddle"

	"github.com/gin-gonic/gin"
)

func RoutRegister(r *gin.Engine, bot_token string, rdb *redis.Client) {

	r.Use(func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*") // открыто для всех
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true") // куки разрешены

		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(204)
			return
		}
		ctx.Next()
	})

	auth := r.Group("/auth")
	auth.Use(a.AuthMiddleware(bot_token, rdb))
	{
		auth.GET("/get-user", func(ctx *gin.Context) {
			user, exists := ctx.Get("user")
			if !exists {
				ctx.JSON(401, gin.H{"error": "User not found"})
				return
			}

			correctlyTypeUser, ok := user.(*a.User)
			if !ok {
				ctx.JSON(500, gin.H{"err": "Invalid type User"})
				return
			}

			ctx.JSON(200, correctlyTypeUser)
		})
	}

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, "Hi world!")
	})
}

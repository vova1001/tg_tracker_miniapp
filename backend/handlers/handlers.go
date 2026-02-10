package handlers

import "github.com/gin-gonic/gin"

func RoutRegister(r *gin.Engine) {
	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, "Hi world!")
	})
}

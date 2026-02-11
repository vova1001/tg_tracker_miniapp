package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	b "github.com/vova1001/tg_tracker_miniapp/bot_tg"
	h "github.com/vova1001/tg_tracker_miniapp/handlers"
)

func main() {

	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Println("ENV ERROR")
	}
	token := os.Getenv("TELEGRAM_BOT_TOKEN")

	b.StartBot(token)

	router := gin.Default()
	h.RoutRegister(router)
	router.Run(":8080")
}

package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"

	b "github.com/vova1001/tg_tracker_miniapp/bot_tg"
	r "github.com/vova1001/tg_tracker_miniapp/router"
)

func main() {

	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Println("ENV ERROR")
	}
	ctx := context.Background()
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	redisURL := os.Getenv("REDIS_URL")
	log.Println("Using default Redis address:", redisURL)

	rdb := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})

	_, err = rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}

	log.Println("Connected to Redis at", redisURL)

	go b.StartBot(token)

	router := gin.Default()
	r.RoutRegister(router, token, rdb)
	router.Run(":8080")
}

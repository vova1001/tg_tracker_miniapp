package main

import (
	"context"
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
		log.Println("No .env file found")
	}

	ctx := context.Background()
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	if token == "" {
		log.Fatal("TELEGRAM_BOT_TOKEN not set")
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://default:LnyKT0XHx6OXn2oGtht1BINwl0TWCHKd@redis-15345.c16.us-east-1-2.ec2.cloud.redislabs.com:15345"
		log.Println("Using Redis Cloud (local config)")
	} else {
		log.Println("Using Redis from env:", redisURL)
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatal("Failed to parse Redis URL:", err)
	}

	rdb := redis.NewClient(opt)

	_, err = rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}
	log.Println("Connected to Redis Cloud")

	go b.StartBot(token)
	log.Println("Bot started")

	router := gin.Default()
	r.RoutRegister(router, token, rdb)

	log.Println("API server on :8080")
	router.Run(":8080")
}

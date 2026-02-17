package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type User struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	PhotoURL  string `json:"photo_url"`
}

type Session struct {
	UserID    int64     `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

type ResponseUserAndSession struct {
	User    *User  `json:"user"`
	Session string `json:"session_id"`
}

func CreateUser(bot_token string, rdb *redis.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req struct {
			InitData string `json:"initData"`
		}
		err := ctx.ShouldBindJSON(&req)
		if err != nil {
			ctx.JSON(400, gin.H{"err": err.Error()})
			ctx.Abort()
			return
		}
		if !validDateTg(req.InitData, bot_token) {
			ctx.JSON(400, gin.H{"err": "Invalid Telegram data"})
			ctx.Abort()
			return
		}
		tgUser, err := ParseUser(req.InitData)
		if err != nil {
			ctx.JSON(400, gin.H{"err": err.Error()})
			ctx.Abort()
			return
		}
		ctxRedis := ctx.Request.Context()
		userKey := "user:" + strconv.Itoa(int(tgUser.ID))

		var resp ResponseUserAndSession

		userJSON, _ := json.Marshal(tgUser)
		rdb.Set(ctxRedis, userKey, userJSON, 30*24*time.Hour)

		sessionID := uuid.New().String()
		sessionKey := "session:" + sessionID
		session := Session{UserID: tgUser.ID, CreatedAt: time.Now()}
		sessionJSON, _ := json.Marshal(session)
		rdb.Set(ctx, sessionKey, sessionJSON, 24*time.Hour)

		ctx.SetCookie(
			"session_id",
			sessionID,
			86400,
			"/",
			"",
			false,
			true,
		)
		resp.User = tgUser
		resp.Session = sessionID

		ctx.JSON(200, resp)
	}
}

func validDateTg(initData string, bot_token string) bool {
	log.Println("🔍 Валидация initData")
	log.Println("  Token length:", len(bot_token))
	log.Println("  InitData length:", len(initData))
	log.Println("  InitData preview:", initData[:min(100, len(initData))])

	params := make(map[string]string)
	pairs := strings.Split(initData, "&")

	var hash string
	var dataChekS []string

	for _, pair := range pairs {
		kv := strings.SplitN(pair, "=", 2)
		if len(kv) != 2 {
			continue
		}
		key, value := kv[0], kv[1]

		if key == "hash" {
			hash = value
			log.Println("  Hash found:", hash[:min(20, len(hash))]+"...")
		}

		params[key] = value
		dataChekS = append(dataChekS, key+"="+value)
	}

	sort.Strings(dataChekS)
	dataCheckString := strings.Join(dataChekS, "\n")
	log.Println("  Data check string length:", len(dataCheckString))

	secret := hmac.New(sha256.New, []byte("WebAppData"))
	secret.Write([]byte(bot_token))
	secretKey := secret.Sum(nil)

	h := hmac.New(sha256.New, secretKey)
	h.Write([]byte(dataCheckString))
	computedHash := hex.EncodeToString(h.Sum(nil))

	result := computedHash == hash
	log.Println("  Hash match:", result)
	if !result {
		log.Println("  Computed:", computedHash[:min(20, len(computedHash))]+"...")
	}

	return result
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func ParseUser(initData string) (*User, error) {
	val, err := url.ParseQuery(initData)
	if err != nil {
		return nil, err
	}
	userStr := val.Get("user")
	if userStr == "" {
		return nil, nil
	}
	userStr = strings.ReplaceAll(userStr, "\\", "")
	var user User
	err = json.Unmarshal([]byte(userStr), &user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

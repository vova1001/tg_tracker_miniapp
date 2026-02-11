package bot_tg

import (
	"fmt"
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func StartBot(token string) {

	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		log.Fatal("Error create bot", err)
	}

	bot.Debug = true

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 30

	updatesCh := bot.GetUpdatesChan(u)
	fmt.Println("bot listеns")

	for update := range updatesCh {
		if update.Message == nil {
			continue
		}
		fmt.Println(update.Message.From.UserName, " ", update.Message.Text)

		chatID := update.Message.Chat.ID

		if update.Message.Text == "/start" {

			text := "Привет! Нажми кнопку ниже, чтобы открыть Mini App."

			btn := map[string]interface{}{
				"text": "Открыть Mini App",
				"web_app": map[string]string{
					"url": "https://example.com",
				},
			}

			keyboard := map[string]interface{}{
				"keyboard": [][]map[string]interface{}{
					{btn},
				},
				"resize_keyboard": true,
			}

			msg := tgbotapi.NewMessage(chatID, text)
			msg.ReplyMarkup = keyboard
			bot.Send(msg)

		}

	}
}

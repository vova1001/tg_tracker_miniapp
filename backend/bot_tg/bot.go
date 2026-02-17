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

			text := "Привет! Нажми кнопку ниже, чтобы открыть Mini App Tracker."

			inlineBtn := tgbotapi.InlineKeyboardButton{
				Text: "Открыть Mini App",
				WebApp: &tgbotapi.WebAppInfo{
					URL: "https://tg-tracker-miniapp.onrender.com/",
				},
			}

			inlineKeyboard := tgbotapi.NewInlineKeyboardMarkup(
				tgbotapi.NewInlineKeyboardRow(inlineBtn),
			)

			msg := tgbotapi.NewMessage(chatID, text)
			msg.ReplyMarkup = inlineKeyboard

			_, err := bot.Send(msg)
			if err != nil {
				log.Println("Ошибка отправки сообщения:", err)
			}
		}
	}
}


import pygame
import time
import random
import os

pygame.init()
white = (255, 255, 255)
black = (0, 0, 0)
red = (213, 50, 80)
green = (0, 255, 0)
blue = (50, 153, 213)
width = 600
height = 400
screen = pygame.display.set_mode((width, height))
background_img = pygame.image.load('background.png').convert_alpha()
background_img = pygame.transform.scale(background_img, (width, height))
pygame.display.set_caption('Snake Game')
clock = pygame.time.Clock()
snake_block = 10
snake_speed = 15
font_style = pygame.font.SysFont("bahnschrift", 25)
score_font = pygame.font.SysFont("comicsansms", 35)
def score_display(score, high_score=None):
    value = score_font.render("Score: " + str(score), True, white)
    screen.blit(value, [0, 0])
    if high_score is not None:
        hs_value = font_style.render(f"High Score: {high_score}", True, blue)
        screen.blit(hs_value, [0, 30])
def draw_snake(snake_block, snake_list):
    for x in snake_list:
        pygame.draw.rect(screen, green, [x[0], x[1], snake_block, snake_block])
def message(msg, color):
    mesg = font_style.render(msg, True, color)
    screen.blit(mesg, [width / 6, height / 3])
import sqlite3
DB_FILE = 'snake_scores.db'
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.commit()
    conn.close()
def save_score(name, score):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('INSERT INTO scores (name, score) VALUES (?, ?)', (name, score))
    conn.commit()
    conn.close()
def get_high_score():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT MAX(score) FROM scores')
    result = c.fetchone()
    conn.close()
    return result[0] if result and result[0] is not None else 0
def get_leaderboard(limit=5):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT name, score FROM scores ORDER BY score DESC, timestamp ASC LIMIT ?', (limit,))
    results = c.fetchall()
    conn.close()
    return results
def title_screen():
    waiting = True
    button_color = blue
    play_button_rect = pygame.Rect(width//2-75, height//2 + 40, 150, 40)
    quit_button_rect = pygame.Rect(width//2-75, height//2 + 100, 150, 40)
    name_box = pygame.Rect(width//2-100, height//2-30, 200, 35)
    active = False
    name = ""
    leaderboard = get_leaderboard()
    while waiting:
        temp_bg = background_img.copy()
        temp_bg.set_alpha(128)
        screen.blit(temp_bg, (0, 0))
        title_text = pygame.font.SysFont("comicsansms", 50).render("Dakto INC Snake", True, white)
        screen.blit(title_text, (width//2 - title_text.get_width()//2, height//3 - 60))
        prompt = font_style.render("Enter your name:", True, white)
        screen.blit(prompt, (width//2 - prompt.get_width()//2, height//2 - 60))
        pygame.draw.rect(screen, blue if active else white, name_box, 2)
        name_surface = font_style.render(name, True, white)
        screen.blit(name_surface, (name_box.x+5, name_box.y+5))
        lb_title = font_style.render("Leaderboard:", True, blue)
        screen.blit(lb_title, (width//2 - lb_title.get_width()//2, height//2 + 80 + 60))
        for i, (n, s) in enumerate(leaderboard):
            lb_entry = font_style.render(f"{i+1}. {n} - {s}", True, white)
            screen.blit(lb_entry, (width//2 - lb_entry.get_width()//2, height//2 + 110 + 60 + i*28))
        pygame.draw.rect(screen, button_color, play_button_rect, border_radius=10)
        play_text = font_style.render("Play Game", True, white)
        screen.blit(play_text, (width//2 - play_text.get_width()//2, height//2 + 47))
        pygame.draw.rect(screen, red, quit_button_rect, border_radius=10)
        quit_text = font_style.render("Quit Game", True, white)
        screen.blit(quit_text, (width//2 - quit_text.get_width()//2, height//2 + 107))
        pygame.display.update()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if name_box.collidepoint(event.pos):
                    active = True
                else:
                    active = False
                if play_button_rect.collidepoint(event.pos) and name.strip():
                    return name.strip()
                if quit_button_rect.collidepoint(event.pos):
                    pygame.quit()
                    quit()
            if event.type == pygame.KEYDOWN:
                if active:
                    if event.key == pygame.K_RETURN:
                        if name.strip():
                            return name.strip()
                    elif event.key == pygame.K_BACKSPACE:
                        name = name[:-1]
                    elif len(name) < 12 and event.unicode.isprintable():
                        name += event.unicode
def game_loop():
    game_over = False
    game_close = False
    x = width / 2
    y = height / 2
    dx = 0
    dy = 0
    direction = None
    snake_list = []
    length = 1
    high_score = get_high_score()
    food_x = round(random.randrange(0, width - snake_block) / 10.0) * 10.0
    food_y = round(random.randrange(0, height - snake_block) / 10.0) * 10.0
    player_name = None
    if hasattr(game_loop, 'player_name'):
        player_name = game_loop.player_name
    paused = False
    while not game_over:
        while game_close:
            screen.fill(blue)
            message("Game Over! Press C-Play Again, Q-Quit, or M-Menu", red)
            score_display(length - 1, high_score)
            pygame.display.update()
            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        game_over = True
                        game_close = False
                    if event.key == pygame.K_c:
                        game_loop.player_name = player_name
                        game_loop()
                    if event.key == pygame.K_m:
                        main()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_over = True
            if event.type == pygame.KEYDOWN:
                if not paused:
                    if event.key == pygame.K_a:
                        dx = -snake_block
                        dy = 0
                        direction = 'LEFT'
                    elif event.key == pygame.K_d:
                        dx = snake_block
                        dy = 0
                        direction = 'RIGHT'
                    elif event.key == pygame.K_w:
                        dy = -snake_block
                        dx = 0
                        direction = 'UP'
                    elif event.key == pygame.K_s:
                        dy = snake_block
                        dx = 0
                        direction = 'DOWN'
                    elif event.key == pygame.K_p:
                        paused = True
                else:
                    # Pause menu controls
                    if event.key == pygame.K_p:
                        paused = False
                    elif event.key == pygame.K_m:
                        main()
        if not paused:
            if x >= width or x < 0 or y >= height or y < 0:
                game_close = True
            if direction is not None:
                x += dx
                y += dy
            temp_bg = background_img.copy()
            temp_bg.set_alpha(128)
            screen.blit(temp_bg, (0, 0))
            pygame.draw.rect(screen, red, [food_x, food_y, snake_block, snake_block])
            snake_head = [x, y]
            snake_list.append(snake_head)
            if len(snake_list) > length:
                del snake_list[0]
            for segment in snake_list[:-1]:
                if segment == snake_head:
                    game_close = True
            draw_snake(snake_block, snake_list)
            score_display(length - 1, high_score)
            pygame.display.update()
            if x == food_x and y == food_y:
                food_x = round(random.randrange(0, width - snake_block) / 10.0) * 10.0
                food_y = round(random.randrange(0, height - snake_block) / 10.0) * 10.0
                length += 1
                if (length - 1) > high_score:
                    high_score = length - 1
                save_score(player_name, length - 1)
            clock.tick(snake_speed)
        else:
            # Draw pause menu
            temp_bg = background_img.copy()
            temp_bg.set_alpha(180)
            screen.blit(temp_bg, (0, 0))
            pause_text = pygame.font.SysFont("comicsansms", 48).render("Paused", True, white)
            screen.blit(pause_text, (width//2 - pause_text.get_width()//2, height//2 - 60))
            resume_text = font_style.render("Press P to Resume", True, blue)
            menu_text = font_style.render("Press M for Menu", True, blue)
            screen.blit(resume_text, (width//2 - resume_text.get_width()//2, height//2 + 10))
            screen.blit(menu_text, (width//2 - menu_text.get_width()//2, height//2 + 40))
            pygame.display.update()
            clock.tick(10)
    pygame.quit()
    quit()
def main():
    init_db()
    while True:
        player_name = title_screen()
        game_loop.player_name = player_name
        game_loop()
if __name__ == "__main__":
    main()

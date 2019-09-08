import time
import concurrent.futures
from PIL import Image, ImageDraw

MAX_THREADS = None
MAX_ITER = 250

WIDTH = 2560
HEIGHT = 1440

RE_START = -2
RE_END = 1
IM_START = -1
IM_END = 1

im = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
draw = ImageDraw.Draw(im)

print()
print("Starting...")
print("Max Threads: {} Dimensions: {}x{} Depth: {}".format(MAX_THREADS, HEIGHT, WIDTH, MAX_ITER))
start = time.time()

def point():
    for x in range(0, WIDTH):
        for y in range(0, HEIGHT):
            yield x, y

def mandelbrot(x, y):
    c = complex(RE_START + (x / WIDTH) * (RE_END - RE_START),
                IM_START + (y / HEIGHT) * (IM_END - IM_START))

    z = 0
    n = 0
    while abs(z) <= 2 and n < MAX_ITER:
        z = z*z + c
        n += 1
    
    color = 255 - int(n * 255 / MAX_ITER)
    return (x, y, (color, color, color))

d = WIDTH*HEIGHT
i = 0

with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
    futures = []
    for x, y in point():
        print("Adding {}, {}".format(x, y), end="\r")
        futures.append(executor.submit(mandelbrot, x, y))
    
    for future in concurrent.futures.as_completed(futures):
        i += 1
        data = future.result()
        draw.point([data[0], data[1]], data[2])
        print("Progress: {}%".format(int(i/d * 1000)/10), end="\r")

end = time.time()
total = end - start
print()
print("{}s elapsed".format(int((total)*1000)/1000))
print()

im.save("{}x{}-{}-{}-{}.png".format(HEIGHT, WIDTH, MAX_THREADS, MAX_ITER, int(total)), "PNG")
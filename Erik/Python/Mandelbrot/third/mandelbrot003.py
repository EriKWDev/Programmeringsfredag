from threading import Thread
from math import log, log2
import time
from tkinter import *
from PIL import Image, ImageDraw, ImageTk
try:
   import queue
except ImportError:
   import Queue as queue

def range_help(x, a, b, c, d):
    return (x-a)/(b-a) * (d-c) + c

def points(w, h):
    max_number = w*h

    for x in range(0, w):
        for y in range(0, h):
            yield x, y

def mandelbrot(x, y):
    c = complex(RE_START + ((x) / WIDTH) * (RE_END - RE_START),
                IM_START + ((y) / HEIGHT) * (IM_END - IM_START))

    z = 0
    n = 0
    while abs(z) <= 2 and n < MAX_ITER:
        z = z*z + c
        n += 1
    
    if n is not MAX_ITER:
       n = n + 1 - log(log2(abs(z)))
    
    color_intensity = 255 - range_help(n, 0, MAX_ITER, 0, 255)
    
    h = (color_intensity + (range_help(c.real, RE_START, RE_END, 0, 255)))%255
    s = 170
    v = 210 if n < MAX_ITER else 0

    return int(h), int(s), int(v)

def work(index):
    done = False
    while not done:
        try:
            x, y = next(POINT)
            h, s, v = mandelbrot(x, y)
            draw.point([x, y], (h, s, v))
            if(x%50 == 0):
                print("Progress: {}%".format(int((x/WIDTH)*10000)/100), end="\r")
        except StopIteration:
            done = True
            return index
        except ValueError:
            continue

HEIGHT = 600
WIDTH = int(HEIGHT*1.618)
MAX_THREADS = 1
POINT = points(WIDTH, HEIGHT)

MAX_ITER = 100

RE_ZOOM = 1
IM_ZOOM = 1
RE_OFFSET = 0
IM_OFFSET = 0

RE_START = -2 * RE_ZOOM + RE_OFFSET
RE_END = 1 * RE_ZOOM + RE_OFFSET
IM_START = -1 * IM_ZOOM + IM_OFFSET
IM_END = 1 * IM_ZOOM + IM_OFFSET

im = Image.new("HSV", (WIDTH, HEIGHT), (0, 0, 0))
draw = ImageDraw.Draw(im)

def regenerate_mandelbrot():
    print()
    print("Starting...")
    print("Max Threads: {}, Dimensions: {}x{}, Depth: {}".format(MAX_THREADS, HEIGHT, WIDTH, MAX_ITER))
    start = time.time()
    threads = []

    for i in range(0, MAX_THREADS):
        thread_worker = Thread(target=work, args=(i,))
        thread_worker.start()
        threads.append(thread_worker)

    for thread in threads:
        thread.join()

    end = time.time()
    total = end - start
    print("Process took {}s to complete.".format(int(total*1000)/1000))
    print()
    #im.save("003-{}x{}-{}-{}-{}.png".format(HEIGHT, WIDTH, MAX_THREADS, MAX_ITER), "PNG")
    im.convert("RGB").save("test.png", "PNG")
    return True

class Window(Frame):
    def __init__(self, master=None):
        Frame.__init__(self, master)
        self.pack(fill=BOTH, expand=YES)
        self.image = Image.open("test.png")
        self.img_copy = self.image.copy()
        self._load_image()

        self.background_image = ImageTk.PhotoImage(self.image)

        self.background = Label(self, image=self.background_image)
        self.background.pack(fill=BOTH, expand=YES)
        self.background.bind("<Configure>", self._resize_image)
    
    def _load_image(self):
        self.image = Image.open("test.png")
        self.img_copy= self.image.copy()

    def _resize_image(self, event):
        new_width = event.width
        new_height = event.height

        self.image = self.img_copy.resize((new_width, new_height))

        self.background_image = ImageTk.PhotoImage(self.image)
        self.background.configure(image =  self.background_image)

def main():
    regenerate_mandelbrot()
    root = Tk()
    app = Window(root)
    root.wm_title("Mandelbrot Window")
    root.geometry("{}x{}".format(int(WIDTH), int(HEIGHT)))
    root.mainloop()

if __name__ == "__main__":
    main()
